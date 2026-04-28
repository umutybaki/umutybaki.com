---
title: "5 - Tools & x86-64 Assembly - Study Guide"
date: "2026-04-14"
description: "Comprehensive guide to GDB, Valgrind, Make, and x86-64 assembly for the COMP 201 midterm."
---

# 5 - Tools & x86-64 Assembly - Study Guide

**For COMP201: Computer Systems & Programming at Koç University**



## GCC Compilation Pipeline

Let me walk you through what happens when you type `gcc hello.c -o hello`. Your code goes through a **4-stage pipeline**: preprocessing, compilation, assembly, and linking. Let's look at each one.

### Stage 1: Preprocessing

**What it does:** Expands `#include` directives, processes `#define` macros, removes comments.

**Flag:** `gcc -E`

**Output:** `.i` file (preprocessed C code, still human-readable but expanded)

```bash
gcc -E hello.c -o hello.i
```

If you open `hello.i`, you'll see your original source code, but every `#include <stdio.h>` has been replaced with the entire contents of that header file, and every macro has been expanded.

**Key insight:** The preprocessor is very dumb - it's just text manipulation. It doesn't understand C at all.

### Stage 2: Compilation

**What it does:** Converts C code into assembly language (human-readable machine instructions).

**Flag:** `gcc -S`

**Output:** `.s` file (assembly code)

```bash
gcc -S hello.c -o hello.s
```

Now you have assembly code! This is where the **compiler** (the real translator) does the hard work. It understands your C semantics and figures out how to express them as CPU instructions.

**Key insight:** This is the stage you're learning about right now. Assembly is the interface between humans and the CPU.

### Stage 3: Assembly

**What it does:** Converts assembly code into machine code (binary instructions the CPU understands).

**Flag:** `gcc -c`

**Output:** `.o` file (object file - binary, not human-readable)

```bash
gcc -c hello.c -o hello.o
# or from the .s file:
gcc -c hello.s -o hello.o
```

The **assembler** reads the human-readable assembly and outputs raw binary. But notice: you don't have an executable yet! Object files are "incomplete" - they contain references to external functions that need to be resolved.

**Key insight:** A `.o` file is object code, not executable. It's the "middle ground" between assembly and executables.

### Stage 4: Linking

**What it does:** Combines object files + libraries into a single executable.

**Flag:** `gcc` (default, final executable)

**Output:** executable (or `.exe` on Windows)

```bash
gcc hello.c -o hello         # All 4 stages in one command
gcc hello.o -o hello         # Just linking (stage 4)
```

The **linker** (`ld`) takes your object files and the system libraries (like `libc` for `printf`) and glues them together. It resolves all the "TODO" references ("I need `printf` from somewhere!") by finding them in the libraries.

**Key insight:** Without linking, you have machine code islands floating around. The linker is the glue that holds it all together.

### Full Pipeline Visualization

```text
hello.c
  ↓ [gcc -E] Preprocessor (cpp)
hello.i (expanded C)
  ↓ [gcc -S] Compiler (cc1)
hello.s (assembly)
  ↓ [gcc -c] Assembler (as)
hello.o (object file, binary)
  ↓ [ld] Linker
hello (executable)
```

### Common Compilation Flags

```bash
# Stop at each stage
gcc -E hello.c -o hello.i    # Preprocess only
gcc -S hello.c -o hello.s    # Stop after assembly
gcc -c hello.c -o hello.o    # Stop after assembling

# Full compilation
gcc hello.c -o hello          # Preprocess, compile, assemble, link

# Useful flags
gcc -g hello.c -o hello       # Include debug symbols (for gdb)
gcc -O2 hello.c -o hello      # Optimization level 2
gcc -Wall hello.c -o hello    # Warn about all common mistakes
gcc -Wall -g -O2 hello.c      # All of the above
```

**Why should you care?** When you see an error message like "undefined reference to `printf`", you know it's a **linking error** (stage 4). When you see a **syntax error**, it's a **compilation error** (stage 2). Understanding the pipeline helps you debug!


## Make and Makefiles

### What is Make?

**Make** is a **build automation tool**. Instead of typing the same `gcc` commands over and over, you write them once in a **Makefile**, and `make` executes them for you. Better yet, `make` only recompiles files that have changed - a huge time-saver for large projects.

### Makefile Structure

A Makefile is a series of **rules**. Each rule specifies:
- A **target** (what you want to build)
- **Dependencies** (what files the target depends on)
- **Commands** (how to build it)

```makefile
target: dependency1 dependency2 ...
	command_to_build_target
	another_command
```

**CRITICAL:** The indentation before commands MUST be a TAB character, not spaces! This is a common mistake.

### Simple Example

```makefile
# Variables (optional but recommended)
CC = gcc
CFLAGS = -Wall -g -O2

# Build the executable 'myprogram' from myprogram.c
myprogram: myprogram.c
	$(CC) $(CFLAGS) myprogram.c -o myprogram

# Delete all build artifacts
clean:
	rm -f myprogram

# .PHONY tells make these targets don't represent actual files
.PHONY: clean
```

You'd use it like:

```bash
make              # Build myprogram (if myprogram.c is newer than myprogram)
make clean        # Delete myprogram
make myprogram    # Force rebuild of myprogram
```

### Multi-File Project Example

```makefile
CC = gcc
CFLAGS = -Wall -g

# The main target depends on multiple object files
myprogram: main.o utils.o helpers.o
	$(CC) $(CFLAGS) main.o utils.o helpers.o -o myprogram

# Pattern rule: any .o file comes from a .c file with the same name
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

# Clean up
clean:
	rm -f *.o myprogram

.PHONY: clean
```

**Key variables:**
- `$<` = first dependency
- `$@` = target
- `$(CC)` = the compiler command
- `$(CFLAGS)` = compiler flags

### Another Practical Example

```makefile
# For the project with main.c, utils.c, and a utils.h header
CC = gcc
CFLAGS = -Wall -Wextra -g
LIBS = -lm  # link math library

SOURCES = main.c utils.c
OBJECTS = $(SOURCES:.c=.o)
TARGET = myprogram

all: $(TARGET)

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) $(OBJECTS) -o $(TARGET) $(LIBS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJECTS) $(TARGET)

.PHONY: all clean
```

### Why Make Matters

Imagine you're working on a project with 50 source files. Without Make:
```bash
gcc -Wall -g file1.c file2.c file3.c ... file50.c -o myprogram
```

Every time you change one file, you wait for all 50 to recompile. With Make:
```bash
make
```

Make knows which files changed and only recompiles those + anything that depends on them. For a large project, this can mean the difference between a 2-minute wait and a 10-second rebuild.


## x86-64 Architecture Overview

### Why Assembly?

**Assembly** is the human-readable form of machine code. CPUs understand only 1s and 0s, but we can write instructions like `mov %rax, %rbx` and an **assembler** converts them to binary.

x86-64 is the **64-bit version** of the x86 instruction set, the dominant architecture on PCs and servers. Here's a quick history:

- **8086 (1978):** 16-bit registers, started it all
- **80386 (1985):** Extended to 32-bit (IA-32)
- **x86-64 (2003):** Extended to 64-bit, what we use today

### Registers: Your Fastest Storage

A **register** is a tiny, super-fast piece of memory built into the CPU. x86-64 has **16 general-purpose 64-bit registers**. Think of them as your CPU's "scratchpad" - variables you're actively using live here.

Each register can be accessed at different sizes:
- **64-bit:** `%rax`, `%rbx`, etc.
- **32-bit:** `%eax`, `%ebx`, etc. (lower 32 bits)
- **16-bit:** `%ax`, `%bx`, etc. (lower 16 bits)
- **8-bit:** `%al`, `%bl`, etc. (lowest 8 bits)

**Golden rule:** When you write to a 32-bit register (`%eax`), it **zero-extends** the upper 32 bits automatically. When you write to 8-bit or 16-bit, the upper bits are NOT cleared.


## x86-64 Registers (CRITICAL)

**You must memorize this table for the exam.**

| 64-bit | 32-bit | 16-bit | 8-bit | Special Purpose |
|:---|:---|:---|:---|:---|
| %rax   | %eax   | %ax    | %al   | Return value, accumulator |
| %rbx   | %ebx   | %bx    | %bl   | Callee-saved |
| %rcx   | %ecx   | %cx    | %cl   | 4th argument, loop counter |
| %rdx   | %edx   | %dx    | %dl   | 3rd argument, I/O |
| %rsi   | %esi   | %si    | %sil  | 2nd argument, source |
| %rdi   | %edi   | %di    | %dil  | 1st argument, destination |
| %rsp   | %esp   | %sp    | %spl  | Stack pointer |
| %rbp   | %ebp   | %bp    | %bpl  | Base pointer (frame) |
| %r8    | %r8d   | %r8w   | %r8b  | 5th argument |
| %r9    | %r9d   | %r9w   | %r9b  | 6th argument |
| %r10   | %r10d  | %r10w  | %r10b | Caller-saved |
| %r11   | %r11d  | %r11w  | %r11b | Caller-saved |
| %r12   | %r12d  | %r12w  | %r12b | Callee-saved |
| %r13   | %r13d  | %r13w  | %r13b | Callee-saved |
| %r14   | %r14d  | %r14w  | %r14b | Callee-saved |
| %r15   | %r15d  | %r15w  | %r15b | Callee-saved |

### Register Naming Pattern

Look at %rax:
- `%rax` = 64-bit (quadword)
- `%eax` = 32-bit (doubleword) - the 'e' is for "extended"
- `%ax` = 16-bit (word)
- `%al` = 8-bit (byte) - the 'l' is for "low byte"

The pattern holds for the first 8 registers. For %r8–%r15, you add suffixes: `b`, `w`, `d`, or no suffix for 64-bit.

### Critical Register Facts

1. **%rax is special:** Function return values go here. Very common in reverse engineering.
2. **%rsp is sacred:** This is the **stack pointer**. The stack grows downward in memory (toward lower addresses). Never mess with %rsp unless you know what you're doing.
3. **Caller-saved vs. Callee-saved:** Some registers you must preserve if your function uses them (callee-saved: %rbx, %r12–%r15, %rsp, %rbp). Others the caller must save if it wants to keep their values (caller-saved: %rax, %rcx, %rdx, %rsi, %rdi, %r8–%r11).
4. **Arguments go in registers:** The first 6 integer arguments to a function go in %rdi, %rsi, %rdx, %rcx, %r8, %r9 (in that order). The 7th argument and beyond go on the stack.


## Data Sizes and Instruction Suffixes

In assembly, we use **suffixes** on instructions to specify data size. This is the x86-64 convention (AT&T syntax, what GCC uses).

| Suffix | Data Size | C Type | Example |
|:---|:---|:---|:---|
| `b`    | 1 byte    | `char` | `movb $0x42, %al` |
| `w`    | 2 bytes   | `short` | `movw $0x1234, %ax` |
| `l`    | 4 bytes   | `int` | `movl $0xDEADBEEF, %eax` |
| `q`    | 8 bytes   | `long`, pointer | `movq $0x123456789, %rax` |

**Rule of thumb:** Match the suffix to the register size you're using.

```asm
movb %al, %bl        # Move 1 byte
movw %ax, %bx        # Move 2 bytes
movl %eax, %ebx      # Move 4 bytes (32-bit, zero-extends)
movq %rax, %rbx      # Move 8 bytes (full 64-bit)
```


## The mov Instruction

### Syntax and Semantics

The **mov** instruction copies data from a source to a destination:

```asm
mov src, dst
```

This is **AT&T syntax** (what GCC outputs). Note: **source comes first, destination comes second**. This is opposite to **Intel syntax** (where you'd write `mov dst, src`). Be careful!

**Semantics:** The instruction reads from `src` and writes to `dst`. The original `src` is unchanged (it's a copy, not a move).

```asm
movl $42, %eax       # %eax now contains 42
movl $42, %eax       # Again - copies 42 to %eax
movl %eax, %ebx      # %eax → %ebx, %eax unchanged
movl (%rax), %ebx    # Read from memory at address %rax, store in %ebx
```

### Operand Types

Each operand can be one of three types:

#### 1. Immediate (Literal Value)

A **constant** value, written with a `$` prefix.

```asm
movl $10, %eax       # Move literal 10 into %eax
movl $0xFF, %ebx     # Move literal 255 into %ebx
movq $0x1000, %rax   # Move 64-bit address into %rax
```

**Restriction:** Only the source can be immediate (can't do `mov %eax, $10`).

#### 2. Register

A register name.

```asm
movl %eax, %ebx      # Copy %eax to %ebx
movq %r8, %rax       # Copy %r8 to %rax
movw %cx, %dx        # Copy %cx to %dx (16-bit)
```

#### 3. Memory

An address in memory. Written with parentheses or offsets.

```asm
movl (%rax), %ebx    # Load from address %rax into %ebx
movl $42, (%rax)     # Store literal 42 to address %rax
movl 8(%rax), %ebx   # Load from address (%rax + 8) into %ebx
```

### Critical Restriction: No Memory-to-Memory

**You cannot move directly from memory to memory.** This is illegal:

```asm
movl (%rax), (%rbx)  # WRONG! Illegal in x86-64
```

You must use a register as an intermediary:

```asm
movl (%rax), %ecx    # Load from memory
movl %ecx, (%rbx)    # Store to memory
```


## mov Operand Forms and Addressing Modes

### The 5 Addressing Modes

The CPU provides flexible ways to calculate memory addresses. Each mode is useful for different situations (array access, struct fields, pointer dereference, etc.).

| Mode | Syntax | Address | Meaning |
|:---|:---|:---|:---|
| Direct | `addr` | addr | Fixed address (rare) |
| Register Indirect | `(%r)` | R[r] | Address is in register r |
| Base + Displacement | `D(%r)` | R[r] + D | Register + constant offset |
| Indexed | `(%r₁, %r₂)` | R[r₁] + R[r₂] | Sum of two registers |
| Indexed with Offset | `D(%r₁, %r₂)` | R[r₁] + R[r₂] + D | Two regs + constant |
| Scaled Index | `(%r, %i, s)` | R[r] + s·R[i] | Base + scaled index |
| Full Form | `D(%r, %i, s)` | R[r] + s·R[i] + D | All combined |

**General formula:**
```
Effective Address = Displacement + BaseRegister + Scale × IndexRegister
```text

Where:
- **Displacement (D):** A constant (0–2 billion, typically small)
- **Base register (Rb):** Any general-purpose register
- **Index register (Ri):** Any register EXCEPT %rsp
- **Scale (S):** 1, 2, 4, or 8 (multiplies the index)

### Practical Examples

#### Array Access

```c
int arr[10];
int x = arr[3];  // Access arr[3]
```

If `arr` is in %rdi and the index (3) is in %rsi:

```asm
movl (%rdi, %rsi, 4), %eax  # Effective address: %rdi + 4*%rsi
                             # For index 3: %rdi + 4*3 = %rdi + 12
                             # (int is 4 bytes, so index 3 = byte offset 12)
```

#### Struct Field Access

```c
struct Point { int x; int y; };
Point p;
int val = p.y;  // Second field (offset 4 bytes from start)
```

If the struct pointer is in %rax:

```asm
movl 4(%rax), %eax  # Load from address %rax + 4 (the 'y' field)
```

#### Pointer Dereference

```c
int *ptr = ...;
int x = *ptr;  // Dereference the pointer
```

```asm
movl (%rdi), %eax   # Load from address stored in %rdi
```


## The lea Instruction

### What lea Does

**lea** stands for "**Load Effective Address**". It's different from `mov` in one crucial way:

> **lea DOES NOT read from or write to memory. It computes an address and stores the address in a register.**

```asm
lea addr, %reg      # Store the address in %reg (don't read from addr)
```

Compare:
```asm
movq (%rax), %rbx   # Read value at address %rax, store in %rbx
leaq (%rax), %rbx   # Compute address %rax, store in %rbx
```

The first reads memory; the second doesn't.

### Why This Matters for Exam

The exam loves `lea` because it's often used for clever arithmetic. Since `lea` computes addresses, you can use it to do math:

```asm
leaq (%rdi, %rdi, 2), %rax   # %rax = %rdi + 2*%rdi = 3*%rdi
```

This computes `3*x` in a single instruction! Without `lea`, you'd need multiple instructions:

```asm
# Without lea (3 instructions):
movq %rdi, %rax
addq %rdi, %rax    # %rax = 2*%rdi
addq %rdi, %rax    # %rax = 3*%rdi
```

### Common Patterns

Compilers use `lea` for multiplications by small constants:

```asm
# 3*x in %rdi, result in %rax:
leaq (%rdi, %rdi, 2), %rax

# 5*x:
leaq (%rdi, %rdi, 4), %rax

# 9*x:
leaq (%rdi, %rdi, 8), %rax

# x*2 + 7 (address calc):
leaq 7(%rdi, %rdi, 1), %rax
```

### When You See lea

If you see `lea` in assembly, ask: "Is this computing an address for memory access, or doing arithmetic?" Usually it's arithmetic. The instruction computes the address but doesn't access memory, making it fast and efficient.


## Arithmetic and Logical Instructions

### Two-Operand Arithmetic Instructions

These instructions follow the pattern: `op src, dst` → `dst = dst OP src`

| Instruction | Operation | Syntax | Example | C Equivalent |
|:---|:---|:---|:---|:---|
| `add` | Addition | `add S, D` | `addl %ecx, %eax` | `eax += ecx` |
| `sub` | Subtraction | `sub S, D` | `subl $8, %rsp` | `rsp -= 8` |
| `imul` | Signed Multiply | `imul S, D` | `imulq %rbx, %rax` | `rax *= rbx` |
| `and` | Bitwise AND | `and S, D` | `andl $0xFF, %eax` | `eax &= 0xFF` |
| `or` | Bitwise OR | `or S, D` | `orl %ecx, %eax` | `eax \|= ecx` |
| `xor` | Bitwise XOR | `xor S, D` | `xorl %eax, %eax` | `eax ^= eax` |
| `sal` / `shl` | Left Shift | `sal k, D` | `sall $2, %eax` | `eax <<= 2` |
| `sar` | Arithmetic Right Shift | `sar k, D` | `sarl $1, %eax` | `eax >>= 1` |
| `shr` | Logical Right Shift | `shr k, D` | `shrl $1, %eax` | `eax >>= 1` |

**Note:** For shifts, the amount can be:
- An 8-bit register (usually `%cl`)
- An immediate (0–255)

### One-Operand Instructions

| Instruction | Operation | Syntax | Example |
|:---|:---|:---|:---|
| `inc` | Increment | `inc D` | `incl %eax` |
| `dec` | Decrement | `dec D` | `decl %eax` |
| `neg` | Negate (two's complement) | `neg D` | `negl %eax` |
| `not` | Bitwise NOT | `not D` | `notl %eax` |

### Clever Tricks

**Zero a register using xor:**

```asm
xorl %eax, %eax    # XOR with itself = 0, faster than movl $0
```

This is idiomatic x86 assembly. Any time you see `xorl %reg, %reg`, it means "zero this register."

**Multiply by powers of 2 using shifts:**

```asm
sall $2, %eax      # Left shift by 2 = multiply by 4 (2^2)
shll $3, %eax      # Left shift by 3 = multiply by 8 (2^3)
```

Shifts are faster than multiplication.

**Divide by 2 using arithmetic right shift:**

```asm
sarl $1, %eax      # Arithmetic right shift by 1 = divide by 2 (signed)
```

### How Suffixes Work with Arithmetic

Just like `mov`, arithmetic instructions have size suffixes:

```asm
addl %ecx, %eax    # Add 32-bit values
addq %rcx, %rax    # Add 64-bit values
addw %cx, %ax      # Add 16-bit values
addb %cl, %al      # Add 8-bit values
```


## Reverse Engineering Assembly

This is the **key exam skill**. You'll be given assembly and asked: "What C code generated this?" Let's practice.

### Strategy for Reverse Engineering

1. **Identify the function:** Look for the function label and the `ret` at the end.
2. **Track arguments:** Where do %rdi, %rsi, %rdx go? These are the first three arguments.
3. **Watch return value:** What ends up in %rax before `ret`?
4. **Trace operations:** Follow each instruction to understand what the code does.
5. **Map back to C:** Reconstruct the C code that would produce this assembly.

### Example 1: Simple Arithmetic

**Assembly:**
```asm
simple:
    leal (%rdi, %rdi, 2), %eax   # %eax = 3 * %edi
    addl %esi, %eax              # %eax += %esi
    ret
```

**Step-by-step:**
1. First argument is in %rdi (call it `x`)
2. Second argument is in %rsi (call it `y`)
3. `leal (%rdi, %rdi, 2), %eax`: Compute %rdi + 2*%rdi = 3*x, store in %eax
4. `addl %esi, %eax`: Add second argument: %eax += y
5. `ret`: Return %eax

**C code:**
```c
int simple(int x, int y) {
    return 3 * x + y;
}
```

### Example 2: Array Access

**Assembly:**
```asm
get_array_elem:
    movl (%rdi, %rsi, 4), %eax   # Load arr[index]
    ret
```

**Step-by-step:**
1. First argument is in %rdi (array pointer, call it `arr`)
2. Second argument is in %rsi (index, call it `i`)
3. `movl (%rdi, %rsi, 4), %eax`: Load from address %rdi + 4*%rsi into %eax
   - This is array indexing! Effective address = base + scale*index
   - Scale is 4 because we're dealing with `int` (4 bytes)
4. `ret`: Return %eax

**C code:**
```c
int get_array_elem(int arr[], int i) {
    return arr[i];  // or: *(arr + i)
}
```

### Example 3: Conditional Arithmetic

**Assembly:**
```asm
conditional_op:
    movl %edi, %eax              # %eax = x
    cmpl %esi, %edi              # Compare x with y
    jle .L1                      # Jump if x <= y
    imull %esi, %eax             # %eax *= y (if x > y)
    jmp .L2
.L1:
    addl %esi, %eax              # %eax += y (if x <= y)
.L2:
    ret
```

**Step-by-step:**
1. First arg in %rdi (x), second in %rsi (y)
2. Copy x into %eax (default return value)
3. Compare x with y
4. If x <= y, jump to .L1 (add path)
5. Otherwise, multiply by y and jump to .L2
6. At .L1, add y instead
7. Return %eax

**C code:**
```c
int conditional_op(int x, int y) {
    if (x > y) {
        return x * y;
    } else {
        return x + y;
    }
}
```


## Calling Conventions (Brief)

Understanding how functions call other functions is crucial for reading assembly. Here are the essentials:

### Argument Passing (x86-64 System V ABI)

**Integer arguments (the first 6):**
- 1st argument: %rdi
- 2nd argument: %rsi
- 3rd argument: %rdx
- 4th argument: %rcx
- 5th argument: %r8
- 6th argument: %r9

Arguments 7+ go on the stack.

### Return Value

- **Integer return value:** In %rax (or %edx:%eax for 128-bit on some systems)
- **Floating-point return value:** In %xmm0

### Register Preservation

**Caller must save these if they need to preserve them after a call:**
- %rax, %rcx, %rdx, %rsi, %rdi, %r8–%r11 (caller-saved)

**Functions must preserve these:**
- %rbx, %r12–%r15, %rbp, %rsp (callee-saved)

This means if your function uses %rbx, you must save it on entry and restore it on exit.


## Practice Problems

### Problem 1: GCC Pipeline

**Question:** Given a file `myprogram.c`, write the exact GCC commands to:
1. Produce the preprocessed file (`myprogram.i`)
2. Produce the assembly file (`myprogram.s`)
3. Produce the object file (`myprogram.o`)
4. Produce the final executable with debug symbols

**Answer:**
```bash
# 1. Preprocess
gcc -E myprogram.c -o myprogram.i

# 2. Compile to assembly
gcc -S myprogram.c -o myprogram.s

# 3. Assemble to object
gcc -c myprogram.c -o myprogram.o

# 4. Full compilation with debug
gcc -g myprogram.c -o myprogram
```

### Problem 2: Makefile

**Question:** Write a Makefile for a project with `main.c`, `utils.c`, and `utils.h` that compiles to `myprogram`. Include a `clean` target.

**Answer:**
```makefile
CC = gcc
CFLAGS = -Wall -g

SOURCES = main.c utils.c
OBJECTS = $(SOURCES:.c=.o)
TARGET = myprogram

all: $(TARGET)

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) $(OBJECTS) -o $(TARGET)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJECTS) $(TARGET)

.PHONY: all clean
```

### Problem 3: Addressing Modes

**Question:** Evaluate the following addressing mode expressions. Assume %rax = 0x1000, %rcx = 0x10, %rdx = 0x2.

1. `(%rax)` → Address: `0x1000`
2. `8(%rax)` → Address: `0x1008`
3. `(%rax, %rcx)` → Address: `0x1010` (0x1000 + 0x10)
4. `8(%rax, %rcx)` → Address: `0x1018` (0x1000 + 0x10 + 8)
5. `(%rax, %rdx, 4)` → Address: `0x1008` (0x1000 + 4*2)
6. `16(%rax, %rcx, 2)` → Address: `0x1030` (0x1000 + 2*0x10 + 16)

**Answers:**
1. `0x1000`
2. `0x1008`
3. `0x1010`
4. `0x1018`
5. `0x1008`
6. `0x1030`

### Problem 4: Reverse Engineering

**Question:** What C function generated this assembly?

```asm
mystery:
    xorl %eax, %eax          # Zero %eax
    xorl %ecx, %ecx          # Zero %ecx
    jmp .L2
.L1:
    addl (%rdi, %rcx, 4), %eax  # %eax += arr[i]
    incl %ecx                # i++
.L2:
    cmpl %esi, %ecx          # Compare i with n
    jl .L1                   # If i < n, loop
    ret
```

**Step-by-step:**
1. Zero %eax (sum accumulator) and %ecx (loop counter i)
2. Jump to condition check
3. Loop body: add arr[i] to sum, increment i
4. Check if i < n; if so, loop
5. Return sum in %eax

**C code:**
```c
int mystery(int arr[], int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }
    return sum;
}
```

(This is a simple array sum!)


## Common Exam Traps

### 1. AT&T vs. Intel Syntax

**AT&T (GCC default):** `mov src, dst`

```asm
movl %eax, %ebx    # Copy %eax to %ebx
```

**Intel syntax:** `mov dst, src` (opposite!)

```asm
mov ebx, eax       # Copy eax to ebx
```

**Trap:** Mentally flipping syntax can cause you to misread assembly. Always remember: GCC uses AT&T, source first.

### 2. Makefile Tab Indentation

**WRONG:**
```makefile
myprogram: myprogram.c
    gcc myprogram.c -o myprogram  # Spaces!
```

**RIGHT:**
```makefile
myprogram: myprogram.c
	gcc myprogram.c -o myprogram  # TAB!
```

Most text editors can be configured to use tabs for Makefiles. If you copy from a web example, be careful.

### 3. 32-bit Register Zero-Extension

Writing to a 32-bit register **automatically zero-extends** the upper 32 bits:

```asm
movl $0xFFFFFFFF, %eax
# %rax is now 0x00000000FFFFFFFF, not 0xFFFFFFFFFFFFFFFF
```

**Why?** This is a hardware feature for efficiency - the 32-bit operation automatically clears the upper bits.

But writing to 8-bit or 16-bit does NOT zero-extend:

```asm
movb $0xFF, %al
# %rax upper bits are UNCHANGED (not cleared)
```

### 4. lea Does NOT Access Memory

```asm
leaq (%rax), %rbx
# This stores the ADDRESS in %rbx, does not read from it
```

Compare:
```asm
movq (%rax), %rbx
# This reads the VALUE at address %rax, stores in %rbx
```

Trap: If you see `lea`, don't assume memory access happened.

### 5. xorl as Idiomatic Zero

```asm
xorl %eax, %eax    # Sets %eax to 0
```

This is everywhere in real assembly. Recognize it instantly as "zero this register."

### 6. Stack Grows Downward

```asm
sub $8, %rsp       # Allocate 8 bytes on stack
add $8, %rsp       # Deallocate 8 bytes from stack
```

The stack pointer %rsp points to the top (smallest address) of the stack. When you allocate space, you *subtract* from %rsp. When you deallocate, you *add* back.

**Trap:** Students often write it backwards.

### 7. Instruction Suffixes Must Match Operand Size

```asm
movl %eax, %ebx    # 32-bit: correct
movl %rax, %rbx    # Wrong! %rax is 64-bit, should use movq
movq $42, %eax     # Wrong! Can't mix 64-bit imm with 32-bit reg
```

### 8. sal and shl Are the Same

```asm
sall $2, %eax
shll $2, %eax
# These are identical (logical left shift = arithmetic left shift)
```

But `sar` (arithmetic right shift) and `shr` (logical right shift) differ:

```asm
sarl $1, %eax      # Arithmetic right shift (sign-extends)
shrl $1, %eax      # Logical right shift (zero-extends)
```

For unsigned numbers, they're the same. For signed numbers, use `sar`.

### 9. Arguments and Calling Convention

**Never assume:** The first argument is NOT always in %rax. It's in %rdi!

```asm
myfunction:
    movl %edi, %eax    # First argument is in %edi, copy to %eax
    ret
```

Get the argument mapping wrong, and your reverse engineering will be completely wrong.

### 10. Memory-to-Memory is Illegal

```asm
movl (%rax), (%rbx)    # WRONG! Illegal instruction
```

You must use a register:

```asm
movl (%rax), %ecx
movl %ecx, (%rbx)
```


## Summary: Key Takeaways

1. **GCC Pipeline:** Preprocess → Compile → Assemble → Link
2. **Make:** Automates builds; use Makefiles with TAB indentation
3. **Registers:** 16 general-purpose 64-bit registers; memorize their names and purposes
4. **Data sizes:** b=byte, w=word, l=long(4), q=quad(8); match suffixes to register sizes
5. **mov:** Copies data; source first (AT&T); can't do memory-to-memory
6. **Addressing modes:** Direct, indirect, base+displacement, indexed, scaled
7. **lea:** Computes addresses without reading memory; useful for arithmetic
8. **Arithmetic:** add, sub, imul, and, or, xor, shifts; follow src,dst pattern
9. **Reverse engineering:** Track arguments, return value, and operations carefully
10. **Calling convention:** First 6 args in %rdi, %rsi, %rdx, %rcx, %r8, %r9; return in %rax


## Quick Reference: Common Instructions

```asm
# Data Movement
movb, movw, movl, movq         # Move (byte, word, long, quad)
leaq                           # Load effective address (no memory access!)

# Arithmetic
addl, addq                      # Add
subl, subq                      # Subtract
imull, imulq                    # Signed multiply
incl, incq                      # Increment
decl, decq                      # Decrement
negl, negq                      # Negate

# Logical
andl, andq                      # Bitwise AND
orl, orq                        # Bitwise OR
xorl, xorq                      # Bitwise XOR
notl, notq                      # Bitwise NOT

# Shifts
sall, salq                      # Left shift (same as shl)
shll, shlq
sarl, sarq                      # Arithmetic right shift (sign-extends)
shrl, shrq                      # Logical right shift (zero-extends)

# Control Flow (not covered in detail here, but you'll see them)
cmp                             # Compare
jl, jle, jg, jge, je, jne       # Conditional jumps
jmp                             # Unconditional jump
ret                             # Return from function
```


## Final Exam Advice

- **Memorize the register table.** You'll refer to it constantly when reading assembly.
- **Practice reverse engineering.** Do at least 10 examples before the exam. It's a skill that takes practice.
- **Watch for idioms.** Assembly code has patterns: `xorl reg, reg` for zero, `leaq` for multiplication, etc.
- **Trace execution step-by-step.** Don't try to understand assembly by glancing at it. Trace each instruction carefully.
- **Test your Makefiles.** Make one mistake (spaces instead of tab) and your Makefile won't work. Test before the exam.
- **Understand the pipeline, not just memorize.** Know *why* there are 4 stages and what each does.

**Good luck on the exam!**
