---
title: "6 - Data, Memory, and Security — Study Guide"
date: "2026-04-14"
description: "Comprehensive guide to arrays, structures, memory layout, and security vulnerabilities in C for the COMP 201 final exam."
---

# 6 - Data, Memory, and Security — Study Guide

**A comprehensive guide to understanding data representation, memory organization, and security vulnerabilities in C — everything you need for the final exam.**


## Introduction: From Code to Memory

In this study guide, we explore three interconnected topics that are fundamental to understanding how C programs work at the system level. First, we examine how complex data types like arrays and structures are represented in memory. Then, we look at how the operating system organizes memory for a running program. Finally, we study how vulnerabilities arise from improper memory access and how to protect against them.

**Key insight:** Understanding memory layout is essential for writing secure, efficient C programs. The same concepts that make C powerful (direct memory access, pointer arithmetic) are also the source of its most dangerous bugs.


## Memory and the Stack Frame {#memory-and-stack-frame}

### The Instruction Pointer (%rip)

Machine code instructions live in main memory, just like stack and heap data. The `%rip` register stores the address of the next instruction to execute — it marks our place in the program's instructions.

**How %rip changes:**
- To advance to the next instruction, special hardware adds the size of the current instruction in bytes
- `jmp` instructions work by adjusting %rip by a specified amount

Example of how %rip points to instructions:

```c
void loop() {
    int i = 0;
    while (i < 100) {
        i++;
    }
}
```

Disassembled (showing addresses and bytes):

```asm
0000000000400570 <loop>:
0x400570 <+0>:  b8 00 00 00 00    mov $0x0,%eax
0x400575 <+5>:  eb 03             jmp 0x40057a <loop+10>
0x400577 <+7>:  83 c0 01           add $0x1,%eax
0x40057a <+10>: 83 f8 63          cmp $0x63,%eax
0x40057d <+13>: 73 f8             jle 0x400577 <loop+7>
0x40057f <+15>: f3 c3             repz retq
```

### The Stack Pointer (%rsp)

The `%rsp` register stores the address of the current "top" of the stack. In our diagrams, the stack grows downward (toward lower addresses), so %rsp points to the "bottom" of the stack visually.

**Key rule:** %rsp must point to the same place before a function is called and after that function returns, since stack frames go away when a function finishes.

### The Stack Frame Structure

When a function is called, a new stack frame is created:

```text
High Addresses
┌─────────────────┐
│  Caller's Frame  │
├─────────────────┤
│   Return Addr    │  ← Pushed by call instruction
├─────────────────┤
│   Old %rbp       │  ← Saved frame pointer (optional)
├─────────────────┤
│  Saved Registers │  ← Caller-saved registers
├─────────────────┤
│   Local Vars     │  ← If can't be kept in registers
├─────────────────┤
│  Argument Build  │  ← For functions with >6 args
└─────────────────┘ ← %rsp points here
Low Addresses
```

### push and pop Instructions

The `pushq` instruction:
- Decrements %rsp by 8
- Stores the source value at the new top of stack

```asm
pushq S      →  R[%rsp] ⟵ R[%rsp] – 8
              M[R[%rsp]] ⟵ S
```

The `popq` instruction:
- Reads the value from the top of stack into the destination
- Increments %rsp by 8

```asm
popq D      →  D ⟵ M[R[%rsp]]
              R[%rsp] ⟵ R[%rsp] + 8
```

**Important:** `pop` does not remove/clear out the data! It just increments %rsp to indicate that the next push can overwrite that location.

### call and ret Instructions

The `call` instruction:
- Pushes the address of the instruction immediately following the call onto the stack
- Sets %rip to point to the beginning of the specified function

```asm
call Label
call *Operand
```

The `ret` instruction:
- Pops this instruction address from the stack
- Stores it in %rip

```asm
ret
```

**Critical distinction:**
- **Return address**: The stored %rip value for a function (where to resume after the function returns)
- **Return value**: The value returned from a function (stored in %rax)

### Remembering Where We Left Off

When calling a function:

```text
Before call:
Stack
...
main()
...

%rsp 0xff20    %rip 0x3021

After push (return address):
Stack
...
main()
...
0x3026         ← return address pushed

%rsp 0xff18    %rip 0x3021

After call (entering foo):
Stack
...
main()
...
0x3026         ← return address

%rsp 0xff08    %rip 0x4058 (foo's address)

After ret (returning to main):
Stack
...
main()
...

%rsp 0xff18    %rip 0x3026
```

### Register Calling Conventions (x86-64)

**Parameters (first 6):**
| Register | Purpose |
|----------|---------|
| %rdi | First argument |
| %rsi | Second argument |
| %rdx | Third argument |
| %rcx | Fourth argument |
| %r8 | Fifth argument |
| %r9 | Sixth argument |
| %rax | Return value |

**Registers beyond 6** are passed on the stack (in the argument build area).

### Caller-Saved vs Callee-Saved Registers

**Caller-owned (callee-saved):**
- Callee must save the existing value and restore it when done
- Caller can store values and assume they will be preserved across function calls
- Examples: %rbx, %rbp, %r12-%r15

**Callee-owned (caller-saved):**
- Callee does not need to save the existing value
- Caller's values could be overwritten by a callee!
- Caller may consider saving values elsewhere before calling functions
- Examples: %r10, %r11


## Arrays in Memory {#arrays}

### Array Allocation

When you declare an array `T A[L]`, a contiguously allocated region of `L * sizeof(T)` bytes is reserved in memory.

```c
char string[12];   // 12 bytes
x → x + 12

int val[5];        // 5 * 4 = 20 bytes
x → x+4 → x+8 → x+12 → x+16 → x+20

double a[3];       // 3 * 8 = 24 bytes
x → x+8 → x+16 → x+24
```

### Array Names as Pointers

**Key fact:** An array name is a pointer to its first element. You cannot reassign it, but you can treat it like a pointer:

```c
int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;  // Equivalent to: int *p = &arr[0]
```

### Array Access Expressions

For `int val[5]` starting at address `x`:

| Expression | Type | Value |
|------------|------|-------|
| `val[4]` | int | 5 |
| `val` | int * | x |
| `val + 1` | int * | x + 4 |
| `&val[2]` | int * | x + 8 |
| `val[5]` | int | ?? (out of bounds) |
| `*(val + 1)` | int | 20 |

### Fundamental Array-Pointer Equivalence

```c
arr[i] == *(arr + i)
```

These two expressions are **exactly the same** — array indexing is pointer arithmetic.

### Pointer Arithmetic

When you add an integer `n` to a pointer, the pointer advances by `n * sizeof(element)` bytes:

```c
int arr[5] = {10, 20, 30, 40, 50};
// If arr starts at 0x1000:
arr + 0  // 0x1000 (arr[0])
arr + 1  // 0x1004 (arr[1])
arr + 2  // 0x1008 (arr[2])
```

**Pointer subtraction** gives the number of elements, not bytes:

```c
int *p = &arr[1];
int *q = &arr[4];
int diff = q - p;  // 3 (not 12 bytes)
```

### Arrays vs Pointers: Key Differences

```c
int arr[5] = {1, 2, 3, 4, 5};
arr = someOtherArray;  // COMPILE ERROR!
arr++;                 // COMPILE ERROR!

int *p = arr;
p = someOtherArray;    // OK
p++;                   // OK
```

**Arrays** are not pointer variables — they refer to fixed blocks of memory.

### Size of Arrays vs Pointers

**Critical trap for exams:**

```c
int arr[5];
int *p = arr;

sizeof(arr);  // 20 (5 * 4 bytes) — THE SIZE OF THE ARRAY
sizeof(p);    // 8 (pointer size) — ALWAYS 8 on 64-bit systems
```

When passed to a function, arrays **decay to pointers**:

```c
void func(int arr[]) {
    sizeof(arr);  // 8, NOT 20! Array has decayed to int *
}
```


## Multidimensional Arrays {#multidimensional-arrays}

### Row-Major Ordering

In C, 2D arrays use **row-major ordering** — elements in each row are stored contiguously.

Declaration: `T A[R][C]`
- R rows, C columns
- Array size: R * C * K bytes (where K = sizeof(T))

```
Memory Layout for int A[3][4]:

A[0][0] A[0][1] A[0][2] A[0][3] | A[1][0] A[1][1] A[1][2] A[1][3] | A[2][0] A[2][1] A[2][2] A[2][3]
```

### Nested Array Access

For `int A[R][C]`:
- `A[i]` is an array of C elements (starting at A + i*C*4)
- `A[i][j]` element address: `A + i * (C * 4) + j * 4` = `A + (i*C + j) * 4`

```c
int matrix[3][4];
// Access element at row i, column j:
matrix[i][j]  // Compiler translates to: *(matrix + i*4 + j)
```

### Nested Array Row Access

```c
zip_dig pgh[4] = {{1,5,2,0,6}, {1,5,2,1,3}, {1,5,2,1,7}, {1,5,2,2,1}};
// pgh[index] is array of 5 int's
// Starting address: pgh + 20*index

// Assembly:
leaq (%rdi,%rdi,4), %rax    // 5 * index
leaq pgh(,%rax,4), %rax     // pgh + (20 * index)
```

### Multi-Level Arrays vs Nested Arrays

**Nested array** (true 2D):
```c
int pgh[4][5];
// Access: Mem[pgh + 20*index + 4*digit]
```

**Multi-level array** (array of pointers):
```c
int *univ[3] = {mit, cmu, ku};
// Access: Mem[Mem[univ + 8*index] + 4*digit]
// Requires two memory reads!
```

Both look similar in C but have very different memory access patterns.

### N × N Matrix Access

**Fixed dimensions (known at compile time):**
```c
#define N 16
int fix_ele(fix_matrix a, size_t i, size_t j) {
    return a[i][j];
}
// Address: A + 64*i + 4*j (since C=16, K=4, so C*K=64)
```

**Variable dimensions:**
```c
int var_ele(size_t n, int a[n][n], size_t i, size_t j) {
    return a[i][j];
}
// Address: A + 4*n*i + 4*j
// Must perform integer multiplication (slower!)
```

### Optimizing Array Access for Locality

The inner loop should have stride-1 access pattern for best cache performance:

```c
// Good: row-wise access (stride-1)
for (i = 0; i < M; i++)
    for (j = 0; j < N; j++)
        sum += a[i][j];  // a[i][0], a[i][1], a[i][2]... consecutive

// Bad: column-wise access (stride-N)
for (j = 0; j < N; j++)
    for (i = 0; i < M; i++)
        sum += a[i][j];  // a[0][j], a[1][j], a[2][j]... spaced N elements apart
```


## Structures {#structures}

### Structure Representation

A structure is a block of memory large enough to hold all fields, with fields ordered according to declaration:

```c
struct rec {
    int a[4];          // 16 bytes
    int i;             // 4 bytes
    struct rec *next;  // 8 bytes
};
```

```
Address:
0    4    8    12   16   20   24   28
┌─────┬─────┬─────┬─────┬─────┬─────┐
│ a[0]│ a[1]│ a[2]│ a[3]│  i  │next │
└─────┴─────┴─────┴─────┴─────┴─────┘
```

### Generating Pointers to Structure Members

Since offset of each member is determined at compile time, we can compute addresses:

```c
int *get_ap(struct rec *r, size_t idx) {
    return &r->a[idx];  // Computed as r + 4*idx
}

// Assembly:
leaq (%rdi,%rsi,4), %rax  // r + 4*idx
ret
```

### Following Linked Lists

```c
void set_val(struct rec *r, int val) {
    while (r) {
        int i = r->i;          // M[r+16]
        r->a[i] = val;         // M[r + 4*i] = val
        r = r->next;           // r = M[r+20]
    }
}

// Assembly:
.L11:
    movslq  16(%rdi), %rax      // i = M[r+16]
    movl    %esi, (%rdi,%rax,4)  // M[r+4*i] = val
    movq    20(%rdi), %rdi       // r = M[r+20]
    testq   %rdi, %rdi           // Test r
    jne     .L11                 // if !=0 goto loop
```


## Structure Alignment {#structure-alignment}

### Alignment Principles

Primitive data types require addresses that are multiples of their size:

| Type | Size | Alignment |
|:------|:------|:---|
| char | 1 byte | Any |
| short | 2 bytes | Multiple of 2 (lowest 1 bit = 0) |
| int, float | 4 bytes | Multiple of 4 (lowest 2 bits = 00) |
| double, long, pointer | 8 bytes | Multiple of 8 (lowest 3 bits = 000) |
| long double | 16 bytes | Multiple of 16 (lowest 4 bits = 0000) |

### Why Alignment Matters

- Memory is accessed by aligned chunks of 4 or 8 bytes
- It's inefficient to load/store data that spans quad word boundaries
- Virtual memory becomes trickier when data spans 2 pages

### Compiler's Role

The compiler inserts gaps (padding) in structures to ensure correct alignment of fields:

```c
struct S1 {
    char c;        // 1 byte
    int i[2];      // 8 bytes (needs alignment at offset 4)
    double v;      // 8 bytes (needs alignment at offset 8)
} *p;
```

Layout with padding:
```
c  3 bytes padding  i[0]    i[1]    v
p+0  p+4              p+8    p+12   p+16   p+24
Multiple of 4 →       Multiple of 8 →        Multiple of 8
```

### Overall Structure Alignment

Each structure has an alignment requirement K equal to the largest alignment of any element. Both the initial address and the total structure length must be multiples of K.

For `struct S2 { double v; int i[2]; char c; }`:
- K = 8 (due to double)
- Layout: v at p+0, i[0] at p+8, i[1] at p+12, c at p+16, 7 bytes padding at p+17
- Total size: 24 bytes (multiple of K=8)

### Saving Space

**Put large data types first** to minimize padding:

```c
// Wasteful (char d leaves 3-byte gap)
struct S4 { char c; int i; char d; };  // 12 bytes (c + 3 pad + i + d + 3 pad)

// Efficient
struct S5 { int i; char c; char d; };   // 8 bytes
```

### Arrays of Structures

When you have an array of structures, each element must satisfy
alignment, and accessing elements is straightforward with consecutive addresses.

```c
struct S2 { double v; int i[2]; char c; } a[10];
// a[0] at a+0, a[1] at a+24, a[2] at a+48...
// Total size: 240 bytes (24 * 10)
```

### Accessing Array Elements

To access element `j` in `a[idx]`, we compute:
- Array offset: `12 * idx` (sizeof(S3) including padding)
- Element offset: 8 (within structure)
- Final address: `a + 12*idx + 8`

```c
short get_j(int idx) {
    return a[idx].j;
}

// Assembly:
leaq (%rdi,%rdi,2),%rax  // 3*idx
movzwl a+8(,%rax,4),%eax  // M[a + 4*(3*idx) + 8]
```


## Memory Layout {#memory-layout}

### x86-64 Linux Memory Layout

The operating system organizes a program's virtual memory into distinct regions:

```
Address Range          Region           Description
00007FFFFFFFFFFF       Stack            Runtime stack (8MB limit), local variables
                                    ↑
Higher Addresses       (grows down)
                                    ↓
00007FFF...            Shared libs      Dynamic linking libraries
                      Heap             Dynamically allocated (malloc/new)
                      Data             Static data: globals, static vars, strings
0000000000400000      Text             Executable code (read-only)
0000000000000000      (unused)
                                    ↑
Lower Addresses        (beginning)
```

### Memory Allocation Example

```c
char big_array[1L<<24];  // 16 MB - goes in Data/Text
char huge_array[1L<<31]; // 2 GB  - too big, goes elsewhere

int main() {
    void *p1 = malloc(1L<<28);  // 256 MB - Heap
    void *p2 = malloc(1L<<8);   // 256 B  - Heap
    // ...
}
```

Typical addresses (from low to high):
- Text segment: 0x400000+
- Data (globals): 0x600000+
- Heap: 0x800000+ (grows upward)
- Stack: 0x7FFE... (grows downward)


## Buffer Overflow {#buffer-overflow}

### The Problem

C does not check array bounds. Many Unix/Linux/C functions don't check argument sizes, allowing overflows (writing past the end of arrays).

**Buffer Overflow** = Writing past the end of an array

### Why It's Dangerous

The traditional Linux memory layout provides opportunities for malicious programs:
- Stack grows "backwards" in memory
- Data and instructions are stored in the same memory space
- Overwriting the return address allows control flow hijacking

### Vulnerable Code Example

```c
/* Echo Line - VULNERABLE! */
void echo() {
    char buf[4];      // Way too small!
    gets(buf);        // No bounds checking!
    puts(buf);
}
```

When called with input longer than 4 bytes, `gets()` writes past `buf` into:
- Saved registers
- Return address
- Caller's stack frame

### Buffer Overflow Stack States

**Before gets():**
```
Stack Frame for call_echo:
... | Return Addr (8 bytes) | ... | buf[3] buf[2] buf[1] buf[0] |
                                          %rsp
```

**After overflow with "0123456789012345678901234":**
```
... | 0x34 0x33 0x32 0x31 0x30 0x39 0x38 0x37 | ...
                               ↑
                               Return addr now 0x37363534
                               When ret executes, jumps to 0x37363534!
```

### Stack Smashing

The classic attack:
1. Attacker provides input containing malicious code (shellcode)
2. Input overwrites return address to point to the shellcode
3. When function returns, execution jumps to attacker-controlled code

```
Stack after gets():
High Addr
┌─────────────────┐
│ Caller's Frame  │  ← Pushed by call
├─────────────────┤
│ Return Address  │  ← Overwritten to point to buffer!
├─────────────────┤
│ Saved %rbp      │
├─────────────────┤
│ ...             │
├─────────────────┤
│ Shellcode       │  ← Malicious code in buf
│ ...             │
├─────────────────┤
│ Buffer          │
└─────────────────┘
Low Addr
```

### Famous Examples

**Morris Internet Worm (1988):**
- Exploited `gets()` in fingerd server
- Sent phony argument with exploit code + new return address
- Infected ~6000 computers in hours (10% of Internet)
- Led to formation of CERT

**IM War (1999):**
- AOL discovered buffer overflow in their own AIM clients
- Exploited it to detect and block Microsoft Messenger clients
- Returned signature bytes to server to identify Microsoft clients

**Car Hacking (2010):**
- UW CSE research demonstrated wirelessly hacking a car
- Overwrote onboard control system's code via buffer overflow
- Could disable brakes, unlock doors, control engine


## Protecting Against Buffer Overflow {#protections}

### 1. Avoid Overflow Vulnerabilities in Code

Use library routines that limit string lengths:

```c
// BAD - no size limit
void echo() {
    char buf[4];
    gets(buf);  // DANGEROUS!
}

// GOOD - use fgets with size limit
void echo() {
    char buf[4];
    fgets(buf, 4, stdin);  // Reads at most 3 chars + null
    puts(buf);
}
```

**Dangerous functions to avoid:**
- `gets()` - no size limit
- `strcpy()` - no size limit
- `strcat()` - no size limit
- `scanf("%s", ...)` - no size limit

**Safer alternatives:**
- `fgets()` instead of `gets()`
- `strncpy()` instead of `strcpy()`
- `strncat()` instead of `strcat()`
- `scanf("%ns", ...)` where n is a limit

### 2. System-Level Protections

**Stack Randomization (ASLR):**
- At start of program, allocate random amount of space on stack
- Shifts stack addresses for entire program
- Makes it difficult for hackers to predict buffer location

```
5 executions of same code may have stack at:
0x7ffe4d3be87c
0x7fff75a4f9fc
0x7ffeadb7c80c
0x7ffeaea2fdac
0x7ffcd452017c
```

**Non-executable Stack:**
- X86-64 allows marking memory regions as non-executable
- Stack is marked as non-executable
- Any attempt to execute code on stack fails

### 3. Stack Canaries

**Idea:** Place a special value ("canary") on stack just beyond the buffer. Check for corruption before exiting the function.

```c
void echo() {
    char buf[4];
    // Compiler adds:
    // movq %fs:40, %rax   // Get canary
    // movq %rax, 8(%rsp)  // Place on stack after buf
    gets(buf);
    puts(buf);
    // movq 8(%rsp), %rax  // Retrieve canary
    // xorq %fs:40, %rax   // Compare
    // je .L6              // If same, OK
    // call __stack_chk_fail // FAIL if corrupted
}
```

When compiled with `-fstack-protector`:
```
$ ./bufdemo-sp
Type a string: 01234567
*** stack smashing detected ***
```

### Return-Oriented Programming (ROP)

Even with stack protection, hackers found alternatives:

**Strategy:**
1. Use existing code from libraries (not injected code)
2. String together fragments ending in `ret` (gadgets)
3. Code positions are fixed (not randomized)
4. Stack canaries still block this attack

Example gadget:
```asm
0x4004d4: lea (%rdi,%rdx,1),%rax  // rax = rdi + rdx
0x4004d8: c3                      // ret
```
Gadget address = 0x4004d4


## Practice Problems {#practice-problems}

### Problem 1: Array Memory Layout

Given the following declarations:
```c
int matrix[3][4] = {{1,2,3,4}, {5,6,7,8}, {9,10,11,12}};
int *p = (int *)matrix;
```

Assume `matrix` starts at address `0x1000`.

**Questions:**
1. What is the value of `matrix[2][1]`?
2. What address does `&matrix[1][3]` point to?
3. What is the difference between `*(p + 5)` and `matrix[1][1]`?

**Answers:**
1. `matrix[2][1]` = 10 (row 2, column 1)
2. `&matrix[1][3]` = 0x1000 + 1*16 + 3*4 = 0x101C
3. Both equal 6 (they're the same element!)

### Problem 2: Structure Alignment

Determine the offset of each field, total size, and alignment requirement:

```c
struct mystruct {
    int *a;      // 8 bytes
    float b;     // 4 bytes
    char c;      // 1 byte
    short d;     // 2 bytes
    float e;     // 4 bytes
    double f;    // 8 bytes
    int g;       // 4 bytes
    char *h;     // 8 bytes
};
```

**Answer:**
```
Field:    *a   b   c   d   e   f   g   *h
Size:      8   4   1   2   4   8   4   8
Offset:    0   8  12  14  16  24  32  36
                         ↑pad ↑     ↑pad
Total: 48 bytes, Alignment: 8
```

Optimized (minimize padding):
```
Field:    *a   f   *h   b   e   g   d   c
Size:      8   8   8   4   4   4   2   1
Offset:    0   8  16  24  28  32  36  38
Total: 40 bytes, Alignment: 8
```

### Problem 3: Buffer Overflow

Given this vulnerable function:
```c
void smash_me() {
    char buf[64];
    gets(buf);
}
```

Assembly shows: `subq $0x40, %rsp` (allocate 64 bytes)

**Question:** How many characters must `gets()` read to overwrite the return address?

**Answer:** 64 (buffer) + 8 (saved return address) = 72 bytes minimum

Since the return address is at `buf + 64`, we need to write past the 64-byte buffer.

### Problem 4: Identifying Vulnerable Code

Find the security issues:

```c
void process_input(char *input) {
    char buffer[128];
    strcpy(buffer, input);  // No size check!
    printf("%s", buffer);
}

int main() {
    char big_input[1000];
    fgets(big_input, 1000, stdin);
    process_input(big_input);  // Potential overflow!
}
```

**Issues:**
1. `strcpy()` has no size limit - buffer overflow possible
2. `buffer` is only 128 bytes but `big_input` is 1000 bytes
3. If `big_input` is > 127 chars, `strcpy` will overflow

**Fix:**
```c
void process_input(char *input) {
    char buffer[128];
    strncpy(buffer, input, 127);  // Copy at most 127 chars
    buffer[127] = '\0';           // Ensure null terminator
    printf("%s", buffer);
}
```


## Common Exam Traps {#common-exam-traps}

### Trap 1: sizeof(array) in Functions

```c
void func(int arr[10]) {
    sizeof(arr);  // 8, NOT 40! arr has decayed to pointer
}

int main() {
    int arr[10];
    sizeof(arr);   // 40 - correct in main
}
```

### Trap 2: Array Parameter Decay

```c
void func(int arr[]) {
    arr = other_arr;  // OK - arr is a pointer
}

int arr[5];
arr = other_arr;  // COMPILE ERROR - arr is not a pointer!
```

### Trap 3: Structure Padding Assumptions

```c
struct S { char a; int b; };
sizeof(struct S);  // 8, NOT 5! (3 bytes padding after a)
```

### Trap 4: Pointer Arithmetic with Different Types

```c
int *p;
char *q;
p + 1  // Advances by 4 bytes
q + 1  // Advances by 1 byte
```

### Trap 5: String Literals vs Arrays

```c
char *s1 = "hello";   // Points to read-only memory
s1[0] = 'H';          // CRASH!

char s2[] = "hello";  // Array on stack
s2[0] = 'H';          // OK
```

### Trap 6: Stack Smashing Protection

```c
// Without -fstack-protector:
void vuln() { gets(buf); }  // No canary check

// With -fstack-protector:
void safe() { gets(buf); }  // Compiler adds canary code
```

### Trap 7: Alignment Requirements

```c
struct S {
    char a;    // 1 byte at offset 0
    double b;  // Needs offset multiple of 8, so 7 bytes padding
};
sizeof(S);  // 16, NOT 9
```


## Final Summary

**Key Takeaways:**

1. **Stack Frame:** %rip tracks instructions, %rsp tracks stack top. Function calls push return addresses, and local variables live in the stack frame.

2. **Arrays:** Contiguous memory, array name is a pointer to first element. Array indexing `arr[i]` equals `*(arr + i)`. Arrays decay to pointers when passed to functions.

3. **Multidimensional Arrays:** Row-major ordering stores rows consecutively. `A[i][j]` address = `A + i*C*4 + j*4` for `int A[R][C]`.

4. **Structures:** Blocks of memory holding fields in declaration order. Compiler inserts padding to satisfy alignment requirements.

5. **Alignment:** Each type requires addresses that are multiples of its size. K = largest alignment of any element in a structure.

6. **Buffer Overflow:** C doesn't check bounds. Overflowing arrays can overwrite return addresses, enabling code injection attacks.

7. **Protections:** Use safe functions (fgets, strncpy), enable stack canaries (-fstack-protector), use ASLR and non-executable stack.

8. **Memory Layout:** Stack grows down, heap grows up. Text contains code, data contains globals, stack contains local variables.

Good luck with your final exam!
