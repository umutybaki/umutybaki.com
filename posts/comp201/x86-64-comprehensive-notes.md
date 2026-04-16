---
title: "x86-64 Assembly — Comprehensive Study Notes"
date: "2026-04-16"
description: "Comprehensive study notes covering x86-64 assembly fundamentals, arithmetic, logic, registers, and control flow for COMP201."
---

# x86-64 Assembly — Comprehensive Study Notes

> **Course:** COMP201 — Computer Systems & Programming (Koç University, Spring 2026, Prof. Aykut Erdem)
>
> **Covers:** Lecture 14 (Intro to x86-64), Lecture 15 (Arithmetic & Logic), Lecture 16 (Control Flow & Condition Codes), Lecture 17 (More Control Flow).
>
> These notes are written to be **self-contained**. If you read them from top to bottom, you should be able to learn x86-64 assembly from scratch without needing the original slides. Each concept comes with intuition, the formal rule, worked examples, and small exercises.


## 1. Why Assembly Matters — The Big Picture

Everything you have learned in this course so far — integers in two's complement, ASCII characters, pointers, `struct`s, the stack and heap, `malloc`/`free` — has been about how a computer **represents data**. But your programs themselves are *also* data: the `.c` files you write eventually become sequences of bytes that the CPU reads, interprets, and executes.

**The fundamental question this lecture block answers is:**

> *How does a computer actually execute a C program?*

The short answer is that your C code is translated by a compiler into **machine code** — long sequences of raw bytes the CPU understands directly. Pure machine code is unreadable to humans (it is literally 1s and 0s), so engineers created a one-to-one human-readable mirror of it called **assembly language**. Each line of assembly corresponds (almost) directly to one machine instruction.

Why should you, a programmer using a high-level language, ever look at assembly?

- **To debug at the deepest level.** When a bug is a nightmare — a pointer is mysteriously wrong, a stack is corrupted, or optimization has rewritten your loop — the only way to know what is *really* happening is to read the assembly.
- **To understand performance.** Why is one loop 10× faster than another? The difference usually shows up in the assembly: fewer instructions, better register use, no unnecessary memory accesses.
- **To reverse engineer.** Security researchers, malware analysts, and anyone inspecting a binary without source code all read assembly.
- **To appreciate what your compiler is doing for you.** Once you see how much work GCC does to turn `sum += arr[i];` into half a dozen machine instructions, you understand why C is called a "high-level" language.

Engineers literally used to *write* code directly in assembly before C existed. C was invented partly so that people wouldn't have to.

Before we plunge in, a note on vocabulary. The word **assembly** refers to the human-readable text form; the word **machine code** refers to the raw bytes. A program called an **assembler** converts assembly into machine code; a program called a **disassembler** (like `objdump -d`) converts machine code back into assembly. In this course we look at the output of `objdump -d`, which shows both side by side.


## 2. The Compilation Pipeline: From C to Bits

When you compile a C program with GCC, you are invoking a pipeline that turns text into an executable:

1. **Preprocessing** — `#include`s and macros are expanded.
2. **Compilation proper** — C source becomes assembly text (`.s`).
3. **Assembly** — the assembly text becomes an **object file** (`.o`) containing machine code.
4. **Linking** — object files and libraries are combined into an executable.

Two important things to internalize:

- **Assembly is processor-specific.** The instructions we are learning (`mov`, `add`, `jmp`, `lea`, `cmp`, etc.) are part of the **x86-64** instruction set, used by Intel and AMD CPUs in most desktops, laptops, and servers. Phones and tablets often use ARM instead, and chips for tiny embedded devices use things like MIPS or RISC-V. The *ideas* transfer, but the exact instruction names and encodings do not.
- **A single line of C may become many lines of assembly.** There is not a 1-to-1 correspondence. For example, `sum += arr[i];` may need several assembly instructions: one to compute the address of `arr[i]`, one to fetch the value, one to do the addition, and possibly one to store it back.

To look at the assembly of a compiled program, you run `objdump -d my_program`. This disassembles the executable. For quick experiments, the **Compiler Explorer** website (<https://godbolt.org>) shows you the assembly of any C snippet in real time — a fantastic tool for learning.


## 3. Reading an Assembly Listing (objdump output)

Let's look at the example that drives the whole lecture series. Here is a tiny C function:

```c
int sum_array(int arr[], int nelems) {
    int sum = 0;
    for (int i = 0; i < nelems; i++) {
        sum += arr[i];
    }
    return sum;
}
```

When compiled and disassembled, it becomes this:

```asm
00000000004005b6 <sum_array>:
  4005b6: ba 00 00 00 00        mov    $0x0,%edx
  4005bb: b8 00 00 00 00        mov    $0x0,%eax
  4005c0: eb 09                 jmp    4005cb <sum_array+0x15>
  4005c2: 48 63 ca              movslq %edx,%rcx
  4005c5: 03 04 8f              add    (%rdi,%rcx,4),%eax
  4005c8: 83 c2 01              add    $0x1,%edx
  4005cb: 39 f2                 cmp    %esi,%edx
  4005cd: 7c f3                 jl     4005c2 <sum_array+0xc>
  4005cf: f3 c3                 repz retq
```

Don't panic. Every column of this listing means something specific. Let's peel them apart.

**`00000000004005b6 <sum_array>:`** — This is the **symbol header**. `<sum_array>` is the name of the C function, preserved so humans can find it. `4005b6` is the **memory address** where the first instruction of the function lives. When the program runs, this is where the CPU will jump to in order to "call" this function.

**`4005b6:`, `4005bb:`, `4005c0:`, …** — These are the addresses of each individual instruction. Notice they are **not evenly spaced**: `4005bb – 4005b6 = 5` means the first instruction is 5 bytes long. Instructions in x86 have *variable length* (anywhere from 1 to about 15 bytes). Sequential instructions are placed sequentially in memory, so the next instruction after one at address `A` of length `n` starts at address `A + n`.

**`ba 00 00 00 00`, `48 63 ca`, …** — This is the **machine code**: the raw hexadecimal bytes stored in memory. This is what the CPU literally reads and executes. The assembly column next to it is just a human-readable rendering of these bytes.

**`mov $0x0,%edx`** — The **assembly instruction**. Every instruction has two parts:

- an **opcode** (the operation name, e.g. `mov`, `add`, `jmp`, `cmp`),
- zero or more **operands** (the arguments).

In AT&T syntax (what GCC uses by default on Linux, and what your course uses), operands come in the order **source, destination**: `mov src, dst` means "copy `src` into `dst`". This is the *opposite* of Intel syntax, which writes `mov dst, src`. Be careful when reading documentation from different sources — almost every source of confusion about assembly traces back to syntax differences.

Two conventions you will see in every operand:

- A `$` prefix marks an **immediate value** — a literal constant hard-coded into the instruction. `$0x0` means "the number zero".
- A `%` prefix marks a **register** — one of the CPU's on-chip storage slots. `%edx` is one of them (the 32-bit lower half of `%rdx`, as we'll see).

So `mov $0x0,%edx` reads as: *put the constant 0 into register `%edx`*. The equivalent C statement is roughly `edx = 0;`.


## 4. Registers — The CPU's Scratch Paper

Before we can manipulate data, we need to know where data lives. In C you think of variables as having names and sitting "in memory". Assembly is more primitive: there is **memory** (the big pool of RAM where the stack, heap, globals, and code all live), and there is a separate, much smaller, much faster pool of storage called **registers** that sits directly inside the CPU.

**A register is a fast, named, fixed-size slot on the CPU itself.** It is not in RAM. Reading and writing a register takes essentially zero time compared to reading from main memory. Whenever the CPU wants to compute something, the operands must be in registers (or baked into the instruction itself). Most assembly instructions either move data between memory and registers, or perform arithmetic on registers.

x86-64 has **16 general-purpose integer registers**, each 64 bits (8 bytes) wide:

```text
%rax  %rbx  %rcx  %rdx
%rsi  %rdi  %rbp  %rsp
%r8   %r9   %r10  %r11
%r12  %r13  %r14  %r15
```

Think of them as 16 labeled sheets of scratch paper on the CPU's desk. The CPU can only do arithmetic on what is on its desk. If your program has a variable `x` that is currently in memory, the compiler must emit instructions to (1) fetch `x` from memory into some register, (2) operate on it, (3) possibly write the result back to memory.

**Architectural picture:**

```text
+------------------+                 +----------------------+
|      CPU         |                 |     Main Memory      |
|  +------------+  |                 |  (stack, heap,       |
|  | Registers  |<----- load/store --->  globals, code)     |
|  | (named)    |  |                 |  accessed by address |
|  +------------+  |                 +----------------------+
|       ^          |
|       v          |                 +----------------------+
|  +------------+  |                 |       Disk           |
|  |    ALU     |  |                 |  (holds program      |
|  | (math)     |  |                 |   when not running)  |
|  +------------+  |                 +----------------------+
+------------------+
```

The **ALU** (Arithmetic Logic Unit) is the chunk of hardware that actually does the adding, subtracting, comparing, and bit-fiddling. It reads its inputs from registers and writes its outputs back to registers.

Some registers have conventional jobs:

- `%rax` — stores the function's **return value**.
- `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9` — hold the **first six arguments** to a function (in that order).
- `%rsp` — the **stack pointer**, pointing at the top of the stack.
- `%rbp` — sometimes the **base pointer** (frame pointer).
- `%rip` — the **instruction pointer**: the address of the *next* instruction to execute. (We'll unpack this in §15.)

You don't have to memorize all the conventions right now. The important one for reading code is: **when you see `%rdi` used early in a function, that's the first argument to the function. `%rax` at the end is the return value.**

## 5. The `mov` Instruction — Moving Data Around

The single most common instruction in any x86 program is `mov`. It copies bytes from a source to a destination. Think of it as the assignment operator `=` from C. (A better name would have been `copy`, because the source is unchanged.)

```text
mov  src, dst       # meaning: dst = src
```

Source and destination can each be one of three things:

- an **immediate** (a literal constant, only allowed as the source),
- a **register**,
- a **memory location** (but *at most one* of `src`/`dst` may be memory — you cannot copy directly from one memory location to another in a single instruction).

The rule "at most one memory operand" is a restriction of the x86 instruction encoding: memory-to-memory copies must be done in two steps, going through a register.

**Three concrete shapes of `mov`:**

```asm
mov  $0x104, %rax      # put the constant 0x104 into %rax       (immediate -> register)
mov  %rax,   %rbx      # copy whatever's in %rax into %rbx       (register  -> register)
mov  %rax,   (%rcx)    # copy %rax into the memory at addr in %rcx (register -> memory)
mov  0x104, %rax       # copy the value stored AT address 0x104 into %rax (memory -> register)
```

Two syntax things are worth burning into your brain immediately:

- `$0x104` with a `$` means "the literal number `0x104`".
- `0x104` *without* a `$` means "the contents of memory at address `0x104`".

Mixing those two up is the single most common bug people make when reading assembly for the first time. A `$` is the assembly equivalent of *"the integer itself"*, and its absence is the equivalent of *"go read RAM at this spot"*.

### Practice — Basic `mov`

> Assume the value `5` is stored at address `0x42`, and the value `8` is stored in `%rbx`. What happens?

1. `mov $0x42, %rax` → puts the number `0x42` into `%rax`.
2. `mov 0x42, %rax` → reads memory at address `0x42` (which holds `5`) and puts `5` into `%rax`.
3. `mov %rbx, 0x55` → writes `8` (contents of `%rbx`) into memory at address `0x55`.

The first two look almost identical but behave completely differently. Go slowly.

## 6. Operand Forms — All 11 Ways to Name a Location

`mov` — and many other instructions — need to specify memory locations, and x86 is astonishingly flexible about how you may *compute* an address. The reason is pragmatic: C programs access memory in very predictable patterns (array indexing, struct fields, pointer chasing), and x86 has a single general-purpose addressing mode that matches all those patterns so the compiler can use it directly, without extra instructions.

The **most general memory operand** looks like this:

```text
Imm(rb, ri, s)     means address  Imm  +  R[rb]  +  R[ri] * s
```

where

- **`Imm`** is a signed integer **displacement** (default: 0 if omitted),
- **`rb`** is a **base** register (default: 0 if omitted),
- **`ri`** is an **index** register (default: 0 if omitted),
- **`s`** is a **scale factor**, which must be one of `1`, `2`, `4`, or `8` (default: 1 if omitted).

`R[r]` is just shorthand for "contents of register `r`". So the address computation is literally

$$
\text{address} = \text{Imm} + R[r_b] + R[r_i] \cdot s
$$

You rarely use all four at once. Below are all the partial shapes, with worked intuitions. Each row is a valid thing you can put in place of `src` or `dst` in a `mov`.

| Form | Computed address | Name | Used for… |
|:---|:---|:---|:---|
| `$Imm` | `Imm` itself (value, not address) | Immediate (src only) | literal constants |
| `rᵢ` | value in register `rᵢ` | Register | variables living in registers |
| `Imm` | `M[Imm]` | Absolute | a fixed global variable |
| `(rᵢ)` | `M[R[rᵢ]]` | Indirect | dereferencing a pointer |
| `Imm(rᵦ)` | `M[Imm + R[rᵦ]]` | Base + displacement | struct field via pointer |
| `(rᵦ, rᵢ)` | `M[R[rᵦ] + R[rᵢ]]` | Indexed | array element, byte-sized elements |
| `Imm(rᵦ, rᵢ)` | `M[Imm + R[rᵦ] + R[rᵢ]]` | Indexed + displacement | array of structs, byte-sized elements |
| `(, rᵢ, s)` | `M[R[rᵢ] * s]` | Scaled indexed | array of `s`-byte elements, no base |
| `Imm(, rᵢ, s)` | `M[Imm + R[rᵢ] * s]` | Scaled indexed | global array element |
| `(rᵦ, rᵢ, s)` | `M[R[rᵦ] + R[rᵢ] * s]` | Scaled indexed | array element at `arr[i]` (most common) |
| `Imm(rᵦ, rᵢ, s)` | `M[Imm + R[rᵦ] + R[rᵢ] * s]` | Scaled indexed | struct containing an array, offset `Imm` |

A few handy mental pictures:

- **`(rᵦ)` is a pointer dereference.** If `rᵦ` holds a pointer, `(rᵦ)` means "the thing pointed to".
- **`Imm(rᵦ)` is a struct field access.** If `rᵦ` points to a struct and `Imm` is the byte offset of the field, `Imm(rᵦ)` is that field. For instance, `12(%rax)` is "the field 12 bytes into the struct pointed to by `%rax`".
- **`(rᵦ, rᵢ, s)` is `arr[i]` when each element is `s` bytes.** `rᵦ` holds the array's base address, `rᵢ` holds the index, and `s` is the element size. So for an `int` array (`s=4`), `(%rdi, %rcx, 4)` is `arr[i]` where `arr` is in `%rdi` and `i` is in `%rcx`.

### Practice — Operand Forms

> Assume: `0x11` is stored at `0x10C`, `0xAB` is at `0x104`, `%rax = 0x100`, `%rdx = 0x3`.

1. `mov $0x42, (%rax)` → Write `0x42` to memory address `0x100`. (The `(%rax)` means "address held in `%rax`", which is `0x100`.)
2. `mov 4(%rax), %rcx` → Address = `0x100 + 4 = 0x104`. Memory there holds `0xAB`, so `%rcx ← 0xAB`.
3. `mov 9(%rax, %rdx), %rcx` → Address = `9 + 0x100 + 0x3 = 0x10C`. Memory there holds `0x11`, so `%rcx ← 0x11`.

And with scaling:

1. `mov $0x42, 0xfc(, %rcx, 4)` with `%rcx = 0x1` → Address = `0xfc + 0 + 1*4 = 0x100`. Write `0x42` there.
2. `mov (%rax, %rdx, 4), %rbx` with `%rax = 0x100, %rdx = 0x3` → Address = `0x100 + 3*4 = 0x10C`. Memory there holds `0x11`, so `%rbx ← 0x11`.

### Reverse-engineering example (from the lecture)

```asm
// %rdi stores arr, %rcx stores 3, and %rax stores num
mov (%rdi, %rcx, 8), %rax
```

`arr` is of type `long[]`, so each element is 8 bytes. `(%rdi, %rcx, 8)` is `arr[3]`. The C line is:

```c
long num = arr[3];
```

Another:

```asm
// %ecx stores x, %rax stores ptr
mov %ecx, (%rax)
```

`%rax` holds `ptr`, `(%rax)` is `*ptr`. The C line is `*ptr = x;`.

Another:

```asm
// %rcx stores str, %rdx stores 2
mov $0x63, (%rcx, %rdx, 1)
```

`0x63` is the ASCII code for `'c'`. Each element is 1 byte (char). Address is `str + 2*1 = str[2]`. So the C line is `str[2] = 'c';`.

## 7. Data Sizes and Size Suffixes

Up to now we have blurred over the question of *how many bytes* a `mov` actually copies. x86-64 uses a consistent naming scheme:

| Size in bytes | Assembly name | Suffix | C type |
|:---|:---|:---:|:---|
| 1 | byte | `b` | `char` |
| 2 | word | `w` | `short` |
| 4 | double word | `l` | `int`, `float` |
| 8 | quad word | `q` | `long`, `double`, pointer |

The name "word" is historical — on older Intel processors from the 1970s a word really was 16 bits. When Intel moved to 32-bit, they preserved the meaning of "word" for backward compatibility, so a 32-bit quantity became a "double word" and a 64-bit quantity became a "quad word". The suffix `l` (not `d`) comes from "long", which at the time meant 32-bit.

You write the suffix right after the opcode: `movb`, `movw`, `movl`, `movq`. Same pattern for other instructions: `addq`, `subl`, `xorw`, etc.

**Usually the assembler can infer the suffix from the operands** (for example, `%al` is a 1-byte register, so any instruction writing to `%al` must be byte-sized), but making it explicit is best practice.

### Practice — picking the right suffix

Given the registers (from the next section), what's the right suffix for each?

1. `mov__ %eax, (%rsp)` — `%eax` is 4 bytes → `movl`.
2. `mov__ (%rax), %dx` — `%dx` is 2 bytes → `movw`.
3. `mov__ $0xff, %bl` — `%bl` is 1 byte → `movb`.
4. `mov__ (%rsp, %rdx, 4), %dl` — `%dl` is 1 byte → `movb`.
5. `mov__ (%rdx), %rax` — `%rax` is 8 bytes → `movq`.
6. `mov__ %dx, (%rax)` — `%dx` is 2 bytes → `movw`.

## 8. Register Sizes — Looking at Sub-Parts of a Register

Each 64-bit register can also be *partially* accessed at smaller sizes. This is a legacy feature: when Intel moved from 16-bit → 32-bit → 64-bit CPUs, they preserved access to the older, smaller "versions" of each register so that old code would keep working.

For the first eight registers the naming system is irregular (because they date back to the 8080 of the 1970s):

| 64-bit | 32-bit | 16-bit | 8-bit (low) |
|:---|:---|:---|:---|
| `%rax` | `%eax` | `%ax` | `%al` |
| `%rbx` | `%ebx` | `%bx` | `%bl` |
| `%rcx` | `%ecx` | `%cx` | `%cl` |
| `%rdx` | `%edx` | `%dx` | `%dl` |
| `%rsi` | `%esi` | `%si` | `%sil` |
| `%rdi` | `%edi` | `%di` | `%dil` |
| `%rbp` | `%ebp` | `%bp` | `%bpl` |
| `%rsp` | `%esp` | `%sp` | `%spl` |

For the newer eight registers (`%r8`–`%r15`), the naming is regular — you just add a size letter:

| 64-bit | 32-bit | 16-bit | 8-bit |
|:---|:---|:---|:---|
| `%r8` | `%r8d` | `%r8w` | `%r8b` |
| `%r9` | `%r9d` | `%r9w` | `%r9b` |
| `%r10` | `%r10d` | `%r10w` | `%r10b` |
| `%r11` | `%r11d` | `%r11w` | `%r11b` |
| `%r12` | `%r12d` | `%r12w` | `%r12b` |
| `%r13` | `%r13d` | `%r13w` | `%r13b` |
| `%r14` | `%r14d` | `%r14w` | `%r14b` |
| `%r15` | `%r15d` | `%r15w` | `%r15b` |

Visually, the 8 bytes of `%rax` look like this:

```text
 63                          31            15    7    0
 +---------------------------+-------------+-----+----+
 |                           |             |     |    |
 |         %rax (64)         |   %eax (32) | %ax |%al |
 |                           |             |(16) |(8) |
 +---------------------------+-------------+-----+----+
```

Writing to `%al` only changes the bottom byte and leaves the rest alone. Writing to `%ax` only changes the bottom two bytes.

**Important rule — the one exception to "only change what you wrote":** writing to a 32-bit register (`%eax`, `%ebx`, `%r8d`, …) *also zeros the upper 32 bits of the full 64-bit register*. This is a deliberate design choice in x86-64: it lets the CPU decode and execute `movl`-style instructions slightly faster, and it guarantees predictable behaviour. So `movl $1, %eax` sets `%rax` to `0x00000000_00000001`, not to some arbitrary top half.

### Practice — upper bytes after `mov`

Start with `%rax = 0xAAAAAAAAAAAAAAAA` (imagine) and execute:

1. `movabsq $0x0011223344556677, %rax` → `%rax = 0011223344556677` (full 64-bit write).
2. `movb $-1, %al` → only low byte changed: `%rax = 00112233445566FF`.
3. `movw $-1, %ax` → only low 2 bytes changed: `%rax = 001122334455FFFF`.
4. `movl $-1, %eax` → writing `%eax` zeros top 4 bytes: `%rax = 00000000FFFFFFFF`.
5. `movq $-1, %rax` → full 64-bit write: `%rax = FFFFFFFFFFFFFFFF`.

Line 4 is the "trap". If you expected `0011223344555555555555FFFFFFFF`, you'd be wrong — the upper bytes are *cleared*, not preserved.

## 9. `mov` Variants: `movabsq`, `movz`, `movs`, `cltq`

### `movabsq` — for big constants

Regular `movq` instructions can only carry a 32-bit immediate, which the CPU then sign-extends to 64 bits. That's fine for small constants, but if you want to load a full 64-bit literal, you need `movabsq`:

```asm
movabsq $0x0011223344556677, %rax
```

`movabsq` accepts a 64-bit immediate, but only into a register (not memory).

### `movz` and `movs` — copy small into big

When you copy an 8-bit value into a 64-bit register, you need to decide how to fill the upper 56 bits. Two natural answers:

- **Fill with zeros.** This is **zero extension**, used when the source value is **unsigned**. Instruction family: `movz` (move with zero extension).
- **Fill with copies of the source's top bit** (its sign bit). This is **sign extension**, used when the source is **signed two's complement**. A negative `int8_t` like `-1` (`0xFF`) becomes `0xFFFFFFFFFFFFFFFF` (still -1) rather than `0x00000000000000FF` (which would be 255). Instruction family: `movs` (move with sign extension).

The source can be in memory or a register; the destination must be a register.

| Instruction | Description |
|:---|:---|
| `movzbw` | zero-extend byte → word |
| `movzbl` | zero-extend byte → double word |
| `movzwl` | zero-extend word → double word |
| `movzbq` | zero-extend byte → quad word |
| `movzwq` | zero-extend word → quad word |
| `movsbw` | sign-extend byte → word |
| `movsbl` | sign-extend byte → double word |
| `movswl` | sign-extend word → double word |
| `movsbq` | sign-extend byte → quad word |
| `movswq` | sign-extend word → quad word |
| `movslq` | sign-extend double word → quad word |

Think of the first letter after `mov` as "zero or sign", the next as "from size", the last as "to size".

*(There is no `movzlq` — because any `movl` automatically zero-extends into the 64-bit register, you don't need a separate instruction.)*

### `cltq` — a short way to sign-extend `%eax`

`cltq` (Convert Long to Quad) is a zero-operand shortcut that sign-extends `%eax` into `%rax`. It's equivalent to `movslq %eax, %rax` but shorter in binary encoding, so the compiler emits it a lot.

## 10. The `lea` Instruction — Load Effective Address

`lea src, dst` looks visually identical to `mov`, but it behaves completely differently — and the difference is precisely what makes it useful.

- `mov (%rax), %rdx` means: **go to memory** at the address in `%rax`, **fetch** the value there, put it into `%rdx`.
- `lea (%rax), %rdx` means: **compute the address** (here, just `%rax`), **do not dereference**, put that *computed address* into `%rdx`. Effectively `%rdx = %rax`.

`lea` is the *address-computation machine*. It lets you use all of x86's rich operand forms as a pocket calculator:

| Operands | `mov` meaning | `lea` meaning |
|:---|:---|:---|
| `6(%rax), %rdx` | `%rdx = M[6 + %rax]` | `%rdx = 6 + %rax` |
| `(%rax, %rcx), %rdx` | `%rdx = M[%rax + %rcx]` | `%rdx = %rax + %rcx` |
| `(%rax, %rcx, 4), %rdx` | `%rdx = M[%rax + 4*%rcx]` | `%rdx = %rax + 4*%rcx` |
| `7(%rax, %rax, 8), %rdx` | `%rdx = M[7 + %rax + 8*%rax]` | `%rdx = 7 + 9*%rax` |

Look at that last one. `lea 7(%rax, %rax, 8), %rdx` computes `%rdx = 9*%rax + 7` in a single instruction, with no multiplication or addition instruction needed. Compilers *love* `lea` because it does integer arithmetic "for free" alongside pointer arithmetic. You will often see `lea` used purely to compute things like `x + 1`, `2*x + 3`, `x + y`, `x + 4*y`, all in one go.

**Mnemonic:** `lea` is C's `&` operator, minus the dereferencing step. Where `mov` reads through the address, `lea` hands you the address itself.

**Important caveat:** `lea` does **not** set condition codes. The ALU-style instructions (add, sub, etc.) do. If you're using `lea` to compute arithmetic and then want to branch on the sign, you'll still need a `cmp` or `test`.

## 11. Arithmetic and Logical Instructions

Now that we can move data, let's compute. Arithmetic/logic instructions generally take one or two operands. They may modify memory *or* a register, but they cannot have two memory operands.

### Unary instructions (one operand)

| Instruction | Effect | Description |
|:---|:---|:---|
| `inc D` | `D ← D + 1` | Increment |
| `dec D` | `D ← D - 1` | Decrement |
| `neg D` | `D ← -D` | Two's-complement negate |
| `not D` | `D ← ~D` | Bitwise NOT |

Examples:

```asm
incq  16(%rax)    # add 1 to the quad word 16 bytes above %rax
dec   %rdx        # subtract 1 from %rdx
not   %rcx        # flip every bit of %rcx
```

### Binary instructions (two operands)

Read the AT&T syntax as *operate `src` into `dst`*: so `sub S, D` means *subtract `S` from `D`*, i.e. `D ← D - S`. This is the opposite of how you'd read it in English for `sub`, so be careful.

| Instruction | Effect | Description |
|:---|:---|:---|
| `add  S, D` | `D ← D + S` | Add |
| `sub  S, D` | `D ← D - S` | Subtract (`D - S`, not `S - D`!) |
| `imul S, D` | `D ← D * S` | Signed multiply (truncated to `D`'s size) |
| `xor  S, D` | `D ← D ^ S` | Bitwise XOR |
| `or   S, D` | `D ← D \| S` | Bitwise OR |
| `and  S, D` | `D ← D & S` | Bitwise AND |

Examples:

```asm
addq  %rcx, (%rax)                 # *(long*)%rax += %rcx
xorq  $16, (%rax, %rdx, 8)         # *(long*)(%rax + 8*%rdx) ^= 16
subq  %rdx, 8(%rax)                # *(long*)(%rax + 8) -= %rdx
```

A common idiom: `xor %rax, %rax` (XORing anything with itself is zero) is a very short way to zero out a register. You'll see it constantly as the first instruction of a function, equivalent to `int sum = 0;`.

## 12. Large Multiplication and Division

64-bit arithmetic has a subtlety: multiplying two 64-bit numbers can produce a 128-bit result, and dividing a 128-bit number by a 64-bit number can leave you with a 64-bit quotient and 64-bit remainder. x86-64 has special "two-register" instructions to handle these.

### `imul` with two operands — the normal case

`imul S, D` computes `D ← D * S`, truncating the product to fit in the destination register. You will use this 99% of the time.

### `imul` / `mul` with one operand — the full-width case

If you give `imulq` a single operand, the CPU multiplies it by `%rax` and puts the full 128-bit result into the register pair `%rdx:%rax` (high 64 bits in `%rdx`, low 64 bits in `%rax`).

| Instruction | Effect | Description |
|:---|:---|:---|
| `imulq S` | `%rdx:%rax ← S × %rax` | Signed full multiply |
| `mulq  S` | `%rdx:%rax ← S × %rax` (unsigned) | Unsigned full multiply |

### Division

- **Dividend** is the number being divided, **divisor** is what we're dividing by, **quotient** is the whole-number result, **remainder** is what's left over.
- x86-64 division takes the **128-bit dividend** in `%rdx:%rax` and the 64-bit divisor as the instruction's operand. It puts the **quotient in `%rax`** and the **remainder in `%rdx`**.

| Instruction | Effect | Description |
|:---|:---|:---|
| `idivq S` | `%rax ← %rdx:%rax / S`,  `%rdx ← %rdx:%rax % S` (signed) | Signed divide |
| `divq  S` | same but unsigned | Unsigned divide |

The twist: most divisions in C involve only 64-bit numbers, so you wouldn't want to set `%rdx` to zero explicitly every time. The **`cqto`** instruction takes the 64-bit value in `%rax` and **sign-extends** it into `%rdx`, preparing the `%rdx:%rax` pair for division. (For unsigned division you'd zero `%rdx` with `xor %rdx, %rdx` instead.)

### Example — full division with remainder

```c
// Returns x/y, stores remainder in *remainder_ptr
long full_divide(long x, long y, long *remainder_ptr) {
    long quotient  = x / y;
    long remainder = x % y;
    *remainder_ptr = remainder;
    return quotient;
}
```

Compiles to:

```asm
full_divide:
    movq  %rdx, %rcx    # save remainder_ptr (3rd arg) into %rcx
    movq  %rdi, %rax    # move x into %rax (low half of dividend)
    cqto                # sign-extend %rax into %rdx (high half of dividend)
    idivq %rsi          # divide by y; quotient → %rax, remainder → %rdx
    movq  %rdx, (%rcx)  # *remainder_ptr = remainder
    ret                 # return %rax (the quotient)
```

Notice the third argument (`remainder_ptr`) arrives in `%rdx` but has to be moved out of the way to `%rcx` because `idivq` will clobber `%rdx`.

## 13. Shift Instructions

Shifts take an amount `k` and a destination `D`. `k` can be an immediate or the specific 8-bit register `%cl` (and *only* `%cl` — no other register allowed).

| Instruction | Effect | Description |
|:---|:---|:---|
| `sal k, D` | `D ← D << k` | Left shift (same as `shl`) |
| `shl k, D` | `D ← D << k` | Left shift |
| `sar k, D` | `D ← D >>_A k` | Arithmetic right shift (preserves sign) |
| `shr k, D` | `D ← D >>_L k` | Logical right shift (fills with 0) |

Examples:

```asm
shll $3, (%rax)                # *(int*)%rax <<= 3
shrl %cl, (%rax, %rdx, 8)      # arr[rdx] >>>= %cl (unsigned)
sarl $4, 8(%rax)               # *(int*)(%rax+8) >>= 4 (signed, arithmetic)
```

### Why "arithmetic" vs "logical"?

For unsigned numbers there's only one right-shift: fill with zeros. For signed numbers in two's complement, shifting right to divide by a power of two should preserve the sign — so you fill with *copies of the sign bit*. That's arithmetic right shift (`sar`). In C, `>>` on a signed int is arithmetic, and `>>` on an unsigned int is logical; the compiler picks `sar` or `shr` accordingly.

### Quirk — shift counts and `%cl`

If you shift by `%cl` rather than an immediate, the CPU uses only the **low-order log₂(w) bits** of `%cl`, where `w` is the width in bits of the destination. So for `shlb` (byte destination, 8 bits), `log₂(8) = 3`, meaning only the low 3 bits of `%cl` are consulted. If `%cl = 0xFF`, then:

- `shlb` uses only the bottom 3 bits of `0xFF` (which are `111` = 7), so it shifts by 7.
- `shlw` uses only the bottom 4 bits (`1111` = 15), shifting by 15.
- `shll` uses 5 bits (31), `shlq` uses 6 bits (63).

This is how the chip avoids undefined behaviour when you shift by more than the data's width.

## 14. Reverse-Engineering Practice (Arithmetic)

The best way to check that all this is gelling is to *read* assembly and recover C. Let's walk through the three reverse-engineering problems from the lecture.

### Reverse-engineering 1

```asm
// x in %edi, arr in %rsi, i in %edx
add_to:
    movslq %edx, %rdx              # sign-extend i into full-width %rdx
    movl   %edi, %eax              # copy x into %eax
    addl   (%rsi, %rdx, 4), %eax   # add arr[i] (4-byte elements) to %eax
    ret                             # return %eax
```

The C is:

```c
int add_to(int x, int arr[], int i) {
    int sum = x;
    sum += arr[i];
    return sum;
}
```

Two things to notice. First, the C `int` `i` (32 bits) has to be widened to 64 bits before it can be used as an index in an address calculation (addresses are 64 bits in x86-64). That's what `movslq` does. Second, `arr[i]` is the classic `(rbase, ri, 4)` pattern.

### Reverse-engineering 2

```asm
// nums in %rdi, y in %esi
elem_arithmetic:
    movl  %esi, %eax        # eax = y
    imull (%rdi), %eax      # eax *= nums[0]
    subl  4(%rdi), %eax     # eax -= nums[1]  (offset 4 bytes = next int)
    sarl  $2, %eax          # eax >>= 2  (signed)
    addl  $2, %eax          # eax += 2
    ret                     # return eax
```

The C is:

```c
int elem_arithmetic(int nums[], int y) {
    int z = nums[0] * y;
    z -= nums[1];
    z >>= 2;
    return z + 2;
}
```

### Reverse-engineering 3

```asm
// x in %rdi, ptr in %rsi
func:
    leaq 1(%rdi), %rcx      # rcx = x + 1
    movq %rcx,   (%rsi)     # *ptr = x + 1
    movq %rdi,   %rax       # rax = x
    cqto                    # sign-extend rax into rdx:rax
    idivq %rcx              # rax = x / (x+1); rdx = x % (x+1)
    movq %rdx,   %rax       # return value = remainder
    ret
```

The C is:

```c
long func(long x, long *ptr) {
    *ptr = x + 1;
    long result = x % *ptr;   // *ptr is x+1
    return result;
}
```

## 15. Assembly Execution and the Program Counter `%rip`

So far we've looked at individual instructions. But how does the CPU know which instruction to do *next*? And how does it ever jump around (to do a loop, or call a function)?

**Instructions are themselves just bytes stored in memory.** When your program runs, the region of memory holding the code (called the **text segment**) is laid out like this:

```text
            High addresses
         +---------------+
         |    Stack      |
         +---------------+
         |     Heap      |
         +---------------+
         |     Data      |  <- globals
         +---------------+
         |     Text      |  <- code (machine-code instructions)
         +---------------+   0x400000 (typical start address)
            Low addresses
```

The CPU has a special register called the **program counter** (PC), known in x86-64 as **`%rip`** (Instruction Pointer, Register). `%rip` always holds the memory address of the *next* instruction to execute.

The execution cycle is:

1. Fetch the instruction at the address in `%rip`.
2. Decode and execute it.
3. Advance `%rip` by the size in bytes of that instruction (so it points to the one right after).
4. Repeat.

Suppose our `loop` function starts at `0x4004ed`:

```asm
00000000004004ed <loop>:
  4004ed: 55                       push   %rbp
  4004ee: 48 89 e5                 mov    %rsp, %rbp
  4004f1: c7 45 fc 00 00 00 00     movl   $0x0, -0x4(%rbp)
  4004f8: 83 45 fc 01              addl   $0x1, -0x4(%rbp)
  4004fc: eb fa                    jmp    4004f8 <loop+0xb>
```

Tracing the value of `%rip` over time:

| Step | `%rip` | About to execute |
|:---|:---|:---|
| 1 | `4004ed` | `push %rbp` (1 byte) |
| 2 | `4004ee` | `mov %rsp, %rbp` (3 bytes) |
| 3 | `4004f1` | `movl $0x0, -0x4(%rbp)` (7 bytes) |
| 4 | `4004f8` | `addl $0x1, -0x4(%rbp)` (4 bytes) |
| 5 | `4004fc` | `jmp 4004f8` (2 bytes) → rewrites `%rip` back to `4004f8` |
| 6 | `4004f8` | …and we're back to step 4, forever. |

So this assembly implements an **infinite loop**: `while (true) { i++; }`. The ability to write to `%rip` — to "interfere with" what the program counter thinks comes next — is what lets us build every form of control flow.

## 16. Unconditional Jumps (`jmp`)

`jmp` sets `%rip` to a new value, unconditionally.

There are two kinds of jumps:

- **Direct jump:** the destination is hard-coded into the instruction.

  ```asm
  jmp  4004f8 <loop+0xb>      # %rip ← 0x4004f8
  ```

- **Indirect jump:** the destination comes from a register or memory location.

  ```asm
  jmp  *%rax                  # %rip ← %rax
  jmp  *(%rsi)                # %rip ← M[%rsi]
  ```

  Indirect jumps are used for things like `switch` statements with jump tables and dispatching through function pointers.

A `jmp` by itself always jumps. To do *conditional* control flow (if, while, for), we need to first run a comparison, then jump only if a certain condition holds. That's the subject of §17–§19.

## 17. Condition Codes — The CPU's Secret Status Bits

Alongside the 16 general-purpose registers, the x86-64 CPU maintains a separate tiny register made of single-bit flags called **condition codes** (or sometimes "flags"). They are set automatically as a *side effect* of most arithmetic and logic instructions.

The four condition codes we care about:

- **`CF` — Carry Flag.** Set when the most recent *unsigned* operation generated a carry out of the top bit. It detects unsigned overflow.
- **`ZF` — Zero Flag.** Set when the most recent result was exactly 0.
- **`SF` — Sign Flag.** Set when the most recent result was negative (top bit = 1 for signed interpretation).
- **`OF` — Overflow Flag.** Set when the most recent operation caused signed two's-complement overflow.

For example, after computing `t = a + b`:

| Flag | When set (informally) |
|:---|:---|
| CF | `(unsigned) t < (unsigned) a` — unsigned overflow |
| ZF | `t == 0` |
| SF | `t < 0` |
| OF | `(a<0 == b<0) && (t<0 != a<0)` — signed overflow |

You don't read or write these flags directly. Instead:

- Arithmetic/logic instructions (`add`, `sub`, `and`, `or`, `xor`, `inc`, `dec`, shifts, `cmp`, `test`) **set** them as a side effect.
- Conditional jumps (`je`, `jne`, …), `set` instructions, and `cmov` instructions **read** them.

Important exceptions to the "set them as a side effect" rule:

- **`lea` never sets condition codes** — it was designed purely for address computation.
- **Logical operations (`xor`, `and`, `or`) always clear `CF` and `OF`** to zero and set `ZF`/`SF` based on the result.
- **Shifts set `CF` to the last bit shifted out** and `OF` to zero.
- **`inc` and `dec` set `OF` and `ZF` but leave `CF` alone** (historical quirk, useful in certain loops).

## 18. `cmp` and `test` — Setting Condition Codes

Most of the time, when you want to branch, you don't actually want to *compute* anything — you just want to see *what would have happened*. `cmp` and `test` let you do exactly that: perform an operation purely for its side effect on the condition codes, discarding the result.

### `cmp` — subtract without storing

```asm
cmp  S1, S2       # computes S2 - S1, sets flags, throws away the difference
```

**Read it as: "compare S2 to S1".** Notice the operand order: `cmp` does `S2 - S1`, *not* `S1 - S2`. This is the single biggest stumbling block for beginners. The right mental translation is:

- After `cmp $3, %edi`, the flags tell you how `%edi` compares to `3` (not the other way round).

Has suffixes for data sizes:

| Instruction | Size |
|:---|:---|
| `cmpb` | byte |
| `cmpw` | word (16) |
| `cmpl` | dword (32) |
| `cmpq` | qword (64) |

### `test` — AND without storing

```asm
test  S1, S2      # computes S2 & S1, sets flags, throws away the result
```

Most often used as `testq %rax, %rax`, which ANDs a value with itself. The result equals the value, so the flags directly reflect the sign and zeroness of the value — a compact idiom for "is this register zero, negative, or positive?". When you see `test %reg, %reg` followed by a conditional jump, read it as *"branch on the sign of %reg"*.

**Worked example — interpreting `cmp` and `test`**

Suppose `%edi = 0x10` (that's 16 in decimal).

- `cmp $0x10, %edi` — computes `%edi - 0x10 = 16 - 16 = 0`. `ZF` is set. A subsequent `je` would jump.
- `test $0x10, %edi` — computes `%edi & 0x10 = 0x10 & 0x10 = 0x10 ≠ 0`. `ZF` is *not* set. A subsequent `je` would **not** jump.

These look deceptively similar but do very different things. `cmp` is about *equality/ordering*; `test` is about *bitmask checks* and *sign checks*.

## 19. Conditional Jumps — `je`, `jne`, `jg`, `jl`, …

Conditional jumps inspect the condition codes and jump to the target **only if** the condition holds. Otherwise execution continues to the next instruction. The target is hard-coded in the instruction (direct jump only).

### Unsigned vs signed

x86 provides two families of comparison jumps because signed and unsigned numbers don't order the same way. `0xFFFFFFFF` is `-1` as a signed `int`, but `4294967295` as an unsigned `int`.

- **Signed:** `jg`, `jge`, `jl`, `jle` — these mean "greater", "greater or equal", "less", "less or equal".
- **Unsigned:** `ja`, `jae`, `jb`, `jbe` — these mean "above", "above or equal", "below", "below or equal".
- **Equality:** `je` / `jne` work for both (equality doesn't care about signedness).

### Full table

| Instruction | Synonym | Jump when… | In terms of flags |
|:---|:---|:---|:---|
| `je  L` | `jz` | equal / zero | `ZF = 1` |
| `jne L` | `jnz` | not equal / not zero | `ZF = 0` |
| `js  L` | | negative | `SF = 1` |
| `jns L` | | non-negative | `SF = 0` |
| `jg  L` | `jnle` | signed greater (>) | `ZF = 0 and SF = OF` |
| `jge L` | `jnl` | signed greater or equal (≥) | `SF = OF` |
| `jl  L` | `jnge` | signed less (<) | `SF ≠ OF` |
| `jle L` | `jng` | signed less or equal (≤) | `ZF = 1 or SF ≠ OF` |
| `ja  L` | `jnbe` | unsigned above (>) | `CF = 0 and ZF = 0` |
| `jae L` | `jnb` | unsigned above or equal (≥) | `CF = 0` |
| `jb  L` | `jnae` | unsigned below (<) | `CF = 1` |
| `jbe L` | `jna` | unsigned below or equal (≤) | `CF = 1 or ZF = 1` |

### Reading `cmp` + jump pairs

The `cmp S1, S2` + `jCC` pair is best read as a single phrase. Remember: `cmp S1, S2` computes `S2 - S1`, and the jump asks "was that relation true?". So:

```asm
cmp $2, %edi
jg  target        # jump if %edi > 2
```

```asm
cmp $3, %edi
jne target        # jump if %edi != 3
```

```asm
cmp $4, %edi
je  target        # jump if %edi == 4
```

```asm
cmp $1, %edi
jle target        # jump if %edi <= 1
```

Grammar check: `cmp S1, S2` + `jOP` asks "is `S2 OP S1`?". So `cmp $2, %edi; jg target` asks "is `%edi > 2`?".

### Exercise — conditional jump

```asm
00000000004004d6 <if_then>:
  4004d6: cmp $0x6, %edi
  4004d9: jne 4004de <if_then+0x8>
  4004db: add $0x1, %edi
  4004de: lea (%rdi, %rdi, 1), %eax
  4004e1: retq
```

Given `%edi = 0x5`:

- `cmp $0x6, %edi` computes `5 - 6 = -1`. ZF=0, SF=1.
- `jne 4004de`: ZF=0 so we DO jump. `%rip ← 0x4004de`.
- Next instruction executed is `lea (%rdi, %rdi, 1), %eax`, which computes `%eax = %rdi + 1*%rdi = 2*5 = 0xa`.
- `retq`: we return with `%eax = 0xa`.

So after the jump `%rip` is `0x4004de`, and after `retq` the return value is `0xa` (i.e. 10).

## 20. `if` Statements in Assembly

The standard assembly pattern for a C `if` with no `else`:

```c
if (cond) {
    body;
}
rest;
```

becomes (in pseudocode):

```asm
    cmp / test ...         # set flags
    jCC_opposite  past     # skip over body if cond is FALSE
    body
past:
    rest
```

The trick is that you **jump when the condition is FALSE**, to *skip* the body. That's why the jump in an if-statement is always the *negation* of the source-level condition.

**Worked example — `if_then`**

```c
int if_then(int param1) {
    if (param1 == 6) {
        param1++;
    }
    return param1 * 2;
}
```

compiles to

```asm
if_then:
    cmp $0x6, %edi           # flags based on param1 - 6
    jne 4004de               # if param1 != 6, skip body
    add $0x1, %edi           # param1++
4004de:
    lea (%rdi, %rdi, 1), %eax  # return param1 * 2
    ret
```

Exactly the pattern: condition-inverted-jump skips over the body.

Look at that `lea (%rdi, %rdi, 1), %eax`: it computes `%rdi + 1*%rdi = 2*%rdi` and writes it to `%eax`. That's `param1 * 2` in one instruction, without using `imul`. This is a canonical `lea` trick for multiplication by small constants.

## 21. `if`/`else` Statements in Assembly

For

```c
if (cond) {
    a;
} else {
    b;
}
rest;
```

the pattern is:

```asm
    cmp / test ...
    jCC_opposite  else_body     # if cond FALSE, go to else
    a                            # if-body
    jmp   past_else              # skip over else
else_body:
    b                            # else-body
past_else:
    rest
```

Note the **unconditional `jmp`** at the end of the if-body: without it, execution would "fall through" into the else-body.

**Worked example**

```asm
400552 <+0>:   cmp $0x3, %edi
400555 <+3>:   jle 0x40055e <if_else+12>
400557 <+5>:   mov $0xa, %eax
40055c <+10>:  jmp 0x400563 <if_else+17>
40055e <+12>:  mov $0x0, %eax
400563 <+17>:  add $0x1, %eax
```

Reading through:

- `cmp $3, %edi` sets flags for `arg - 3`.
- `jle else` — if `arg <= 3`, go to else-body. So the *source condition* was `arg > 3` (its inverse).
- If-body: `ret = 10;`
- `jmp past_else` — skip the else.
- Else-body: `ret = 0;`
- After: `ret++`.

C code:

```c
if (arg > 3) {
    ret = 10;
} else {
    ret = 0;
}
ret++;
```

## 22. `while` Loops in Assembly

The typical assembly layout for

```c
while (test) {
    body
}
```

is "test at the bottom":

```asm
    jmp   test         # jump to the test first time
body_label:
    body
test:
    <cmp / test>
    jCC   body_label   # jump back if test succeeds
```

This arrangement evaluates the test *once per iteration*, and the unconditional `jmp` at the top is only executed *once* (on entry), never again inside the loop. Compilers like this because it's one branch per iteration instead of two.

**Worked example — `while (i < 100) { i++; }`**

```c
void loop() {
    int i = 0;
    while (i < 100) {
        i++;
    }
}
```

compiles to

```asm
400570 <+0>:   mov  $0x0, %eax            # i = 0
400575 <+5>:   jmp  0x40057a              # go straight to the test
400577 <+7>:   add  $0x1, %eax            # i++
40057a <+10>:  cmp  $0x63, %eax           # flags from (i - 99)
40057d <+13>:  jle  0x400577              # if i <= 99, loop
40057f <+15>:  repz retq
```

Let's trace the first few iterations:

| Step | `%eax` (i) | After |
|:---|:---|:---|
| 1 | 0 | `mov $0, %eax` → `i = 0` |
| 2 | 0 | `jmp` to test |
| 3 | 0 | `cmp $99, %eax`: `0 - 99 = -99` → SF=1, ZF=0 → `i <= 99` |
| 4 | 0 | `jle` succeeds, back to `add` |
| 5 | 1 | `add $1, %eax` → `i = 1` |
| 6 | 1 | `cmp`, still `<= 99`, loop again |
| … | … | … |
| ? | 100 | `cmp`: `100 - 99 = 1` → SF=0, ZF=0 → NOT `<= 99` |
| ? | 100 | `jle` fails, fall through to `ret` |

Two subtle things:

- The constant `0x63` is **99**, not **100**. The loop runs *while* `i <= 99`, which is the same as `i < 100`. The compiler picked `jle` + `99` over `jl` + `100` (either is valid).
- `repz retq` is an encoding quirk: `repz` is a legacy prefix that does nothing in front of `retq`, but it helps CPUs predict the return, so GCC emits it.

## 23. `for` Loops in Assembly

```c
for (init; test; update) {
    body
}
```

is *exactly* equivalent to

```c
init;
while (test) {
    body;
    update;
}
```

so `for` loops compile to the *same* "while" pattern. The difference from a hand-rolled while is only that the `update` step is always at the end of the body.

### Back to our very first example — `sum_array`

Now, *finally*, we can read the whole `sum_array` disassembly end-to-end:

```c
int sum_array(int arr[], int nelems) {
    int sum = 0;
    for (int i = 0; i < nelems; i++) {
        sum += arr[i];
    }
    return sum;
}
```

```asm
00000000004005b6 <sum_array>:       # arr in %rdi, nelems in %esi
  4005b6:  mov    $0x0, %edx        # i = 0                       (init)
  4005bb:  mov    $0x0, %eax        # sum = 0                     (init)
  4005c0:  jmp    4005cb            # jump to the test            (pre-test jump)
  4005c2:  movslq %edx, %rcx        # rcx = (long) i              (body start)
  4005c5:  add    (%rdi, %rcx, 4), %eax   # sum += arr[i]          (body)
  4005c8:  add    $0x1, %edx        # i++                         (update)
  4005cb:  cmp    %esi, %edx        # flags from (i - nelems)     (test)
  4005cd:  jl     4005c2            # if i < nelems, loop         (test)
  4005cf:  repz retq                # return; %eax has sum
```

Mapping to the C source:

- `%edx` is `i`.
- `%eax` is `sum` (and also the return value, as is the convention).
- `%rdi` is `arr` (first argument).
- `%esi` is `nelems` (second argument).
- `(%rdi, %rcx, 4)` is `arr[i]` (int = 4 bytes, base + index*size).
- `movslq %edx, %rcx` widens the 32-bit signed `i` to a 64-bit `%rcx` because address arithmetic uses 64-bit registers — you can't directly index with a 32-bit register.
- `cmp %esi, %edx; jl …` reads as *"if `i < nelems`, jump"*. Remember: `cmp S1, S2` computes `S2 - S1`, so this compares `%edx` (i) against `%esi` (nelems).

### Python cross-check

You can validate the logic with Python:

```python
def sum_array(arr, nelems):
    """Sum the first `nelems` elements of arr."""
    s = 0
    for i in range(nelems):
        s += arr[i]
    return s

# Simulate the exact assembly step-by-step
def sum_array_asm(arr, nelems):
    edx = 0                # i
    eax = 0                # sum
    while True:
        # test block
        # cmp %esi, %edx; jl loop_body  => if edx < esi, jump to body
        if edx < nelems:
            rcx = edx      # movslq: sign-extend
            eax += arr[rcx]    # add arr[i] to sum
            edx += 1       # i++
        else:
            return eax

print(sum_array([1, 2, 3, 4, 5], 5))      # 15
print(sum_array_asm([1, 2, 3, 4, 5], 5))  # 15
```

## 24. `set` Instructions — Materializing a Condition as 0 or 1

Sometimes you don't want to *branch* on a condition — you want to turn the condition itself into a value (`1` if true, `0` if false). That's what `set` instructions do.

```asm
setCC  D     # D ← 1 if condition CC holds, else 0
```

The destination `D` is a **single byte** (typically an 8-bit register like `%al`, or a 1-byte memory location). `set` doesn't touch the other bytes of the register, so you usually follow it with `movzbl %al, %eax` to zero-extend it into the full 32-bit return register.

### Example — `x < 16`?

```c
int small(int x) {
    return x < 16;
}
```

compiles to

```asm
    cmp    $0xf,  %edi       # flags from (x - 15)
    setle  %al               # %al = 1 if x <= 15, else 0
    movzbl %al,   %eax       # zero-extend to %eax
    ret
```

Wait — the C compares against 16, but the assembly compares against 15! That's because `x < 16` is the same as `x <= 15` for ints. The compiler uses whichever form generates shorter machine code.

### Full table

Same condition suffixes as conditional jumps, just attached to `set`:

| Instr | Synonym | Sets to 1 when… |
|:---|:---|:---|
| `sete  D` | `setz` | equal / zero |
| `setne D` | `setnz` | not equal / not zero |
| `sets  D` | | negative |
| `setns D` | | non-negative |
| `setg  D` | `setnle` | signed greater |
| `setge D` | `setnl` | signed greater or equal |
| `setl  D` | `setnge` | signed less |
| `setle D` | `setng` | signed less or equal |
| `seta  D` | `setnbe` | unsigned above |
| `setae D` | `setnb` | unsigned above or equal |
| `setb  D` | `setnae` | unsigned below |
| `setbe D` | `setna` | unsigned below or equal |

## 25. `cmov` Instructions — Conditional Move

`cmov` is a compromise between a `mov` and a conditional jump: it unconditionally *computes* the source address, but only *writes* to the destination if the condition holds.

```asm
cmovCC  src, dst      # if condition CC, dst ← src;   else dst unchanged
```

`src` can be a register or memory; `dst` must be a register. No memory destination.

### Why?

Branches hurt modern CPUs: they stall the pipeline and hurt branch prediction. For a *simple* either-or choice, `cmov` lets the compiler emit straight-line code with no branches — often faster for short, balanced conditions.

The C construct that maps most naturally to `cmov` is the **ternary operator**:

```c
result = test ? then_value : else_value;
```

### Example — max

```c
int max(int x, int y) {
    return x > y ? x : y;
}
```

compiles to

```asm
    cmp    %edi, %esi      # flags from (y - x) — i.e. "is x > y?"
    mov    %edi, %eax      # eax = x (default)
    cmovge %esi, %eax      # if y >= x, eax = y
    ret
```

Put in prose: "start by assuming the answer is `x`; then, if `y >= x`, overwrite with `y`". No branching.

### Example — `x / 4` with correct rounding for negatives

In C, dividing a negative number by a power of two with `>>` rounds *toward negative infinity*, not toward zero. For example `-14 >> 2 = -4`, but `-14 / 4 = -3` in C. So the compiler has to adjust by adding a bias before shifting — and it can use `cmov` to add the bias only when `x` is negative.

```c
int signed_division(int x) {
    return x / 4;
}
```

```asm
signed_division:
    leal   3(%rdi), %eax        # eax = x + 3         (bias)
    testl  %edi,    %edi        # flags from x & x (really just x)
    cmovns %edi,    %eax        # if x >= 0, eax = x  (drop the bias)
    sarl   $2,      %eax        # eax >>= 2  (signed)
    ret
```

The idea: shifting negative numbers rounds down, but `/` rounds toward zero. For negatives, we need to add `4 - 1 = 3` *before* shifting to compensate. The `cmovns` says "if the sign flag is clear (x is non-negative), use `x` unmodified". So the bias only applies when `x < 0`. Clever, right?

### Full table

| Instr | Synonym | Move when… |
|:---|:---|:---|
| `cmove  S,R` | `cmovz` | equal / zero |
| `cmovne S,R` | `cmovnz` | not equal / not zero |
| `cmovs  S,R` | | negative |
| `cmovns S,R` | | non-negative |
| `cmovg  S,R` | `cmovnle` | signed greater |
| `cmovge S,R` | `cmovnl` | signed greater or equal |
| `cmovl  S,R` | `cmovnge` | signed less |
| `cmovle S,R` | `cmovng` | signed less or equal |
| `cmova  S,R` | `cmovnbe` | unsigned above |
| `cmovae S,R` | `cmovnb` | unsigned above or equal |
| `cmovb  S,R` | `cmovnae` | unsigned below |
| `cmovbe S,R` | `cmovna` | unsigned below or equal |

### Ternary operator — C refresher

For completeness, since this is the C construct `cmov` maps to:

```c
condition ? expression_if_true : expression_if_false
```

Equivalent to:

```c
int x;
if (argc > 1) {
    x = 50;
} else {
    x = 0;
}
// same as
int x = argc > 1 ? 50 : 0;
```

## 26. Full Walk-through: `sum_array`

Tying it all together — this is the exact example from Lecture 14 on slide 1 and Lecture 17 near the end. Knowing everything in §1–§25, you should now be able to read it with complete understanding. Below is the fully annotated version.

```c
int sum_array(int arr[], int nelems) {
    int sum = 0;
    for (int i = 0; i < nelems; i++) {
        sum += arr[i];
    }
    return sum;
}
```

```asm
00000000004005b6 <sum_array>:
;;  Calling convention: arr in %rdi (pointer, 64-bit); nelems in %esi (int, 32-bit).
;;  %eax is the int return value; %edx will host `i`; %rcx widens `i` for addressing.

  4005b6: ba 00 00 00 00   mov    $0x0, %edx
           ;; i = 0 (in %edx).

  4005bb: b8 00 00 00 00   mov    $0x0, %eax
           ;; sum = 0 (in %eax). %eax also holds the return value.

  4005c0: eb 09            jmp    4005cb
           ;; Skip straight to the loop test.

  4005c2: 48 63 ca         movslq %edx, %rcx
           ;; Sign-extend i (32-bit) into the 64-bit %rcx, because addressing
           ;; uses 64-bit registers. (If nelems is always non-negative we could
           ;; have used movzlq or movslq — compiler chose sign-extend.)

  4005c5: 03 04 8f         add    (%rdi, %rcx, 4), %eax
           ;; Fetch arr[i]: address = %rdi + 4*%rcx; add 4 bytes at that addr
           ;; into %eax. So sum += arr[i].

  4005c8: 83 c2 01         add    $0x1, %edx
           ;; i++.

  4005cb: 39 f2            cmp    %esi, %edx
           ;; Flags from (i - nelems). Sets SF if i < nelems.

  4005cd: 7c f3            jl     4005c2
           ;; If i < nelems (signed), jump back to the body. (jl uses SF != OF.)

  4005cf: f3 c3            repz retq
           ;; Return; %eax holds sum.
```

That is a full, working, reverse-engineered C-to-assembly mapping, annotated. If you can read and explain the above in your own words, you have internalized everything from Lectures 14–17.


## 27. Cheat-Sheet / Summary Tables

### Operand forms (most general first)

| Form                  | Address                         | Name                       |
|:----------------------|:--------------------------------|:---------------------------|
| `$Imm`                | `Imm` (literal)                | Immediate (src only)       |
| `r_a`                 | `R[r_a]`                       | Register                   |
| `Imm`                 | `M[Imm]`                       | Absolute                   |
| `(r_a)`               | `M[R[r_a]]`                    | Indirect                   |
| `Imm(r_b)`            | `M[Imm + R[r_b]]`              | Base + displacement        |
| `(r_b, r_i)`          | `M[R[r_b] + R[r_i]]`           | Indexed                    |
| `Imm(r_b, r_i)`       | `M[Imm + R[r_b] + R[r_i]]`     | Indexed + disp.            |
| `(, r_i, s)`          | `M[R[r_i]*s]`                  | Scaled indexed             |
| `Imm(, r_i, s)`       | `M[Imm + R[r_i]*s]`            | Scaled indexed + disp.     |
| `(r_b, r_i, s)`       | `M[R[r_b] + R[r_i]*s]`         | Scaled indexed + base      |
| `Imm(r_b, r_i, s)`    | `M[Imm + R[r_b] + R[r_i]*s]`   | Most general               |

`s` ∈ {1, 2, 4, 8}.

### Data sizes

| Bytes | x86 name    | Suffix | Typical C       |
|:------|:------------|:------:|:----------------|
| 1     | byte        | `b`    | `char`           |
| 2     | word        | `w`    | `short`          |
| 4     | double word | `l`    | `int`, `float`   |
| 8     | quad word   | `q`    | `long`, pointer, `double` |

### Instruction cheat-sheet

| Category    | Instruction  | Effect                                                    |
|:------------|:-------------|:----------------------------------------------------------|
| Move        | `mov S, D`   | `D ← S`                                                   |
| Move 64-bit | `movabsq $Imm, R` | 64-bit immediate → register                          |
| Move sign   | `movs__ S, R`| sign-extend S into R                                      |
| Move zero   | `movz__ S, R`| zero-extend S into R                                      |
| Sign ext.   | `cltq`       | `%rax ← sign-extend %eax`                                 |
| Sign ext.   | `cqto`       | `%rdx:%rax ← sign-extend %rax` (for division)             |
| Addr calc   | `lea S, D`   | `D ← address of S` (no memory access; no flags)           |
| Add         | `add S, D`   | `D ← D + S`                                               |
| Subtract    | `sub S, D`   | `D ← D - S`                                               |
| Multiply    | `imul S, D`  | `D ← D * S` (truncated)                                   |
| Full mult.  | `imulq S`    | `%rdx:%rax ← S * %rax` (signed, 128-bit)                  |
| Divide      | `idivq S`    | `%rax ← %rdx:%rax / S`, `%rdx ← %rdx:%rax % S`            |
| AND         | `and S, D`   | `D ← D & S`                                               |
| OR          | `or  S, D`   | `D ← D \| S`                                              |
| XOR         | `xor S, D`   | `D ← D ^ S`                                               |
| NOT         | `not D`      | `D ← ~D`                                                  |
| Negate      | `neg D`      | `D ← -D`                                                  |
| Increment   | `inc D`      | `D ← D + 1`                                               |
| Decrement   | `dec D`      | `D ← D - 1`                                               |
| Shift left  | `sal k, D` / `shl k, D` | `D ← D << k`                                   |
| Arith. right shift | `sar k, D` | `D ← D >>_A k` (signed)                            |
| Logical right shift | `shr k, D` | `D ← D >>_L k` (unsigned)                         |
| Compare     | `cmp S1, S2` | flags from `S2 - S1`                                      |
| Test        | `test S1, S2`| flags from `S2 & S1`                                      |
| Jump        | `jmp L`      | `%rip ← L`                                                |
| Cond. jump  | `jCC L`      | `%rip ← L` iff CC                                         |
| Set byte    | `setCC D`    | `D ← 1 iff CC, else 0` (byte destination)                 |
| Cond. move  | `cmovCC S, R`| `R ← S` iff CC (R must be register)                       |

### Condition codes

| Flag | Name     | Set when last op result…                       |
|:-----|:---------|:-----------------------------------------------|
| CF   | Carry    | produced unsigned overflow                     |
| ZF   | Zero     | was exactly 0                                   |
| SF   | Sign     | was negative (top bit = 1)                     |
| OF   | Overflow | produced signed (two's-complement) overflow    |

Set by: arithmetic, logical, `cmp`, `test`, shifts.
**Not** set by: `lea`, `mov`.


## 28. Extra Practice

### Practice A — "fill in the blank" while loop

```asm
// a in %rdi, b in %rsi
loop:
    movl  $1, %eax            # result = 1
    jmp   .L2                 # pre-test jump
.L3:
    leaq  (%rdi, %rsi), %rdx  # rdx = a + b
    imulq %rdx, %rax          # result *= (a + b)
    addq  $1, %rdi            # a++
.L2:
    cmpq  %rsi, %rdi          # flags from (a - b)
    jl    .L3                 # loop while a < b
    rep; ret
```

The C:

```c
long loop(long a, long b) {
    long result = 1;
    while (a < b) {
        result = result * (a + b);
        a = a + 1;
    }
    return result;
}
```

### Practice B — "escape room"

```asm
escapeRoom:
    leal  (%rdi, %rdi), %eax    # eax = 2 * arg
    cmpl  $5,      %eax         # flags from (eax - 5)
    jg    .L3                   # if 2*arg > 5, jump → returns 1
    cmpl  $1,      %edi         # else compare arg to 1
    jne   .L4                   # if arg != 1, jump → returns 0
    movl  $1,      %eax
    ret
.L3:
    movl  $1, %eax
    ret
.L4:
    movl  $0, %eax
    ret
```

For what values of the first parameter does this return `1`?

- Path 1 (`jg .L3`): `2*arg > 5` → `arg > 2` (integer arithmetic; really `arg >= 3`). Returns `1`.
- Path 2: fell through, so `2*arg <= 5` (i.e. `arg <= 2`). Then `cmp $1, %edi`. If `arg != 1`, go to `.L4` and return `0`. If `arg == 1`, fall through and return `1`.

**Answer:** returns 1 when `arg > 2` (i.e. `arg >= 3`) **or** `arg == 1`. It returns 0 when `arg == 0` or `arg == 2` (or negative values `<= 2`).

### Practice C — reading `sum_example1`

```asm
00000000004005ac <sum_example1>:
  4005bd: 8b 45 e8       mov  %esi, %eax
  4005c3: 01 d0          add  %edi, %eax
  4005cc: c3             retq
```

Among the candidates

```c
// A)
void sum_example1() {
    int x; int y; int sum = x + y;
}

// B)
int sum_example1(int x, int y) {
    return x + y;
}

// C)
void sum_example1(int x, int y) {
    int sum = x + y;
}
```

The assembly (i) uses two parameters (%edi, %esi — yes), (ii) leaves the sum in %eax (the return-value register). Only (B) matches, because only (B) actually returns something. (C) would compute the sum but discard it; a good optimizing compiler would elide the whole function body for (A) and (C).

### Practice D — `sum_example2` variable mapping

```asm
0000000000400578 <sum_example2>:
  400578: 8b 47 0c    mov  0xc(%rdi), %eax
  40057b: 03 07       add  (%rdi),    %eax
  40057d: 2b 47 18    sub  0x18(%rdi),%eax
  400580: c3          retq
```

```c
int sum_example2(int arr[]) {
    int sum = 0;
    sum += arr[0];
    sum += arr[3];
    sum -= arr[6];
    return sum;
}
```

Questions:

- *Which location represents `sum`?* → `%eax`. (All arithmetic lands in it; it's also the return register.)
- *Which constant represents the `6` in `arr[6]`?* → `0x18`, because `arr[6]` is at offset `6 * sizeof(int) = 6 * 4 = 24 = 0x18` bytes from `arr`.


### Closing

These notes cover every concept introduced in Lectures 14–17 of COMP201 — from the very first `mov $0x0, %edx` to the fully-annotated `sum_array`, with every instruction family, operand form, condition code, control-flow construct, and their conditional-move / conditional-set variants along the way. Next up in Lecture 18 is **function calls**: how the stack is set up on entry, how arguments past the first six are passed, how `call` and `ret` cooperate with `%rip`, and how local variables actually live on the stack. Everything you just learned about `mov`, `%rsp`, `jmp`, and the operand forms will reappear — this is the foundation.

*Good luck studying, and happy disassembling!*
