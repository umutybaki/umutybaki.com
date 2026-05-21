---
title: "7 - Caches, Optimization & Linking — Study Guide"
date: "2026-04-14"
description: "Comprehensive guide to cache memories, code optimization, and program linking in C for the COMP 201 final exam."
---

# 7 - Caches, Optimization & Linking — Study Guide

**A comprehensive guide to understanding cache memories, compiler optimization, and the linking process — everything you need for the final exam.**


## Introduction: Bridging the Speed Gap

Modern computers have a fundamental problem: CPUs are incredibly fast, but memory is slow. This creates a bottleneck that can dramatically affect program performance. The solution is a **memory hierarchy** with fast, small, expensive storage at the top and slow, large, cheap storage at the bottom.

**Key insight:** Programs exhibit locality — they tend to access the same data repeatedly and access nearby data. This property makes caching effective. Understanding caches helps you write faster code.


## The Memory Hierarchy {#memory-hierarchy}

### Why Memory Hierarchies Work

The key properties that make memory hierarchies effective:

1. **Fast storage costs more per byte, has less capacity, requires more power**
2. **The gap between CPU and main memory speed is widening**
3. **Well-written programs tend to exhibit good locality**

These properties complement each other beautifully.

### Levels of the Memory Hierarchy

```
Level          Technology     Typical Size   Access Time
─────────────────────────────────────────────────────────────
L0: Registers  SRAM           < 1 KB          0 cycles
L1 Cache       SRAM           32-64 KB        4 cycles
L2 Cache       SRAM           256 KB-8 MB     10-20 cycles
L3 Cache       SRAM           4-64 MB          30-50 cycles
Main Memory    DRAM           8-64 GB         100-300 cycles
Disk           Magnetic/SSD   TB scale        ms scale
```

**The big idea:** The memory hierarchy creates a large pool of storage that costs as much as cheap storage, but serves data at the rate of fast storage.

### Example: Intel Core i7 Cache Hierarchy

```
Core 0                              Core 3
┌─────────┐  ┌─────────┐           ┌─────────┐  ┌─────────┐
│Regs     │  │L1 i-cache│           │Regs     │  │L1 i-cache│
│         │  │L1 d-cache│           │         │  │L1 d-cache│
│         │  │32KB 8-way│           │         │  │32KB 8-way│
└─────────┘  └─────────┘           └─────────┘  └─────────┘
                 ↓                            ↓
           ┌─────────┐                  ┌─────────┐
           │L2 Cache │                  │L2 Cache │
           │256KB    │                  │256KB    │
           │8-way    │                  │8-way    │
           └─────────┘                  └─────────┘
                                               ↓
                                    ┌─────────────────┐
                                    │L3 Cache (shared)│
                                    │8 MB, 16-way     │
                                    │40-75 cycles     │
                                    └─────────────────┘
                                               ↓
                                    ┌─────────────────┐
                                    │  Main Memory    │
                                    └─────────────────┘
```

**Cache block size:** 64 bytes for all cache levels


## Locality of Reference {#locality}

### Principle of Locality

Programs tend to use data and instructions with addresses near or equal to those they have used recently.

### Two Types of Locality

**Temporal Locality:**
- Recently referenced items are likely to be referenced again soon
- Example: Loop counter used every iteration, function variable accessed repeatedly

**Spatial Locality:**
- Items with nearby addresses tend to be referenced close together in time
- Example: Sequential access through an array, instructions in a loop

### Locality Example

```c
sum = 0;
for (i = 0; i < n; i++)
    sum += a[i];  // a[i] accessed sequentially (spatial)
return sum;        // sum accessed every iteration (temporal)
```

**Data references:**
- `a[i]`: stride-1 access (good spatial locality)
- `sum`: accessed repeatedly (good temporal locality)

**Instruction references:**
- Instructions in sequence (spatial)
- Loop repeats same instructions (temporal)


### Good vs Bad Locality

**Good locality (row-wise access):**
```c
for (i = 0; i < M; i++)
    for (j = 0; j < N; j++)
        sum += a[i][j];  // Consecutive elements
```

Access pattern: a[0][0], a[0][1], a[0][2]... a[1][0], a[1][1]...
- All consecutive in memory
- One cache miss per block load

**Bad locality (column-wise access):**
```c
for (j = 0; j < N; j++)
    for (i = 0; i < M; i++)
        sum += a[i][j];  // Elements spaced N apart
```

Access pattern: a[0][0], a[1][0], a[2][0]... a[0][1], a[1][1]...
- Stride = N elements
- Multiple cache misses per block


## Cache Basics {#cache-basics}

### What is a Cache?

A **cache** is a smaller, faster storage device that acts as a staging area for a subset of the data in a larger, slower device.

**Why caches work:** Because of locality, programs tend to access data at level k more often than data at level k+1.

### Cache Terminology

- **Hit:** Requested data is in the cache
- **Miss:** Requested data is not in cache
- **Hit Rate:** Fraction of accesses that hit (1 - miss rate)
- **Hit Time:** Time to deliver data from cache to processor
- **Miss Penalty:** Additional time when a miss occurs

### Cache Performance Impact

```
Hit time: ~4 cycles (L1)
Miss penalty: ~100-200 cycles (to main memory)
```

A miss can be **50x slower** than a hit!

### Types of Cache Misses

**Cold (Compulsory) Miss:**
- Cache is empty
- First access to any block causes this

**Conflict Miss:**
- Multiple blocks map to same cache location
- E.g., accessing blocks 0, 8, 0, 8 repeatedly misses every time

**Capacity Miss:**
- Working set larger than cache
- Even with good locality, cache can't hold everything


## Cache Organization {#cache-organization}

### Block Size (B)

Unit of transfer between cache and memory. Always a power of 2 (e.g., 64 bytes).

```
Block contains consecutive bytes:
Address: 0x00  0x01  0x02 ... 0x3F (64 bytes)
Block 0: 0x40 ... 0x7F
Block 1: 0x80 ... 0xBF
Block 2:
```

### Address Breakdown

For an m-bit address with block size B = 2^b bytes:

```
┌────────────────────────────────────────────────┐
│  Tag (t bits)  │  Index (s bits)  │  Offset (b bits)  │
└────────────────────────────────────────────────┘
         m - s - b                    log2(B)

- Offset: which byte within the block (b bits)
- Index: which set in the cache (s bits)
- Tag: identifies the block among those that map to same set
```

### Cache Parameters

- **S = 2^s** sets
- **E** lines per set (associativity)
- **B = 2^b** bytes per block
- **Cache size C = S × E × B**

### Direct-Mapped Cache (E = 1)

Each memory block maps to exactly one cache location.

```
Memory                    Cache
Block 0 ──────────────┐    Set 0 ──┐
Block 1 ──────────────┼───> Set 1 ──┤
Block 2 ──────────────┤    Set 2 ──┤
Block 3 ──────────────┘    Set 3 ──┘
   (block % 4 = index)
```

### Set Associative Cache (E > 1)

Each set can hold E blocks. More associativity = fewer conflict misses.

```
2-way associative:
Set 0: [Block] [Block]  ← Two blocks can occupy set 0
Set 1: [Block] [Block]
Set 2: [Block] [Block]
Set 3: [Block] [Block]

4-way associative:
Set 0: [B][B][B][B]  ← Four blocks can occupy set 0
Set 1: [B][B][B][B]
```

### Fully Associative Cache (E = C/B)

Any block can go anywhere. Only practical for small, special-purpose caches (like TLB).

### Associativity Trade-offs

| Type | Speed | Power | Conflict Misses |
|:------|------:|------:|-----------------:|
| Direct-mapped | Fastest | Lowest | High |
| 2-way | Moderate | Moderate | Lower |
| 4-way | Slower | Higher | Even lower |
| 8-way | Slowest | Highest | Lowest |

Higher associativity reduces conflicts but requires more hardware for tag comparison.


## Cache Read Operation {#cache-read}

### Step-by-Step Cache Lookup

1. **Extract index** from address → identifies which set to check
2. **Check all lines in that set** → compare tags
3. **If tag matches AND valid bit is set** → HIT
4. **Extract data** from offset within block

```
Address: 0xBA = 10111010₂

With B=4, C=32 bytes:
- Offset bits (b) = 2
- Index bits (s) = 3
- Tag bits (t) = 3

Breakdown: 101 | 110 | 10
            Tag  Index Offset

Tag = 0x5, Index = 0x6, Offset = 0x2
```

### Cache Line Structure

Each cache line contains:
- **Valid bit:** Is the data meaningful?
- **Tag:** Identifies which memory block
- **Data:** The actual bytes from memory

```
┌──────┬─────┬────────────────────────────────┐
│ Valid│ Tag │          Data (B bytes)        │
└──────┴─────┴────────────────────────────────┘
  1 bit  t bits            B bytes
```


## Cache Write Operations {#cache-write}

### Write-Hit Policies

**Write-through:**
- Write to cache AND main memory immediately
- Simple, always consistent
- Slower (memory write on every store)

**Write-back:**
- Write to cache only
- Set "dirty" bit to indicate modification
- Write to memory only when block is evicted
- Faster but more complex

### Write-Miss Policies

**Write-allocate:**
- Load block into cache on write miss
- Good if more writes to location follow
- Common with write-back

**No-write-allocate:**
- Write directly to memory, don't load into cache
- Good if writes won't be followed by reads
- Common with write-through

### Typical Combinations

- **Write-through + No-write-allocate:** Simple, used for I/O
- **Write-back + Write-allocate:** Most common for CPU caches


## Writing Cache-Friendly Code {#cache-friendly-code}

### Make the Common Case Go Fast

Focus on the inner loops of core functions where:
- Bulk of computations occur
- Bulk of memory accesses occur

### Principles

1. **Maximize temporal locality:** Use data repeatedly once loaded
2. **Maximize spatial locality:** Read data with stride-1 pattern

### Example: Matrix Multiplication

**Naive (ijk) ordering:**
```c
for (i = 0; i < n; i++)
    for (j = 0; j < n; j++) {
        sum = 0;
        for (k = 0; k < n; k++)
            sum += a[i][k] * b[k][j];
        c[i][j] = sum;
    }
```

Misses per iteration: A=0.25, B=1.0, C=0.0 (total 1.25 per iteration)

**Better (kij) ordering:**
```c
for (k = 0; k < n; k++)
    for (i = 0; i < n; i++) {
        r = a[i][k];
        for (j = 0; j < n; j++)
            c[i][j] += r * b[k][j];
    }
```

Misses per iteration: A=0.0, B=0.25, C=0.25 (total 0.5 per iteration)

### Blocking for Cache

Divide matrices into blocks that fit in cache:

```c
for (i = 0; i < n; i += B)
    for (j = 0; j < n; j += B)
        for (k = 0; k < n; k += B)
            // B×B mini matrix multiply
            for (i1 = i; i1 < i+B; i1++)
                for (j1 = j; j1 < j+B; j1++)
                    for (k1 = k; k1 < k+B; k1++)
                        c[i1][j1] += a[i1][k1] * b[k1][j1];
```

Total misses: n³/(4B) vs (9/8)n³ for naive

### The Memory Mountain

A 3D plot of read throughput:
- X-axis: Array size (working set)
- Y-axis: Stride
- Z-axis: Read bandwidth (MB/s)

**Ridges** show temporal locality (constant stride, varying size)
**Slopes** show spatial locality (constant size, varying stride)


## Compiler Optimization {#compiler-optimization}

### GCC Optimization Levels

```bash
gcc -O0    # No optimization (debugging)
gcc -Og    # Like -O0 but better debug info
gcc -O2    # Enable most optimizations
gcc -O3    # More aggressive, may increase size
gcc -Os    # Optimize for size
```

### Constant Folding

Pre-calculates constants at compile time:

```c
int seconds = 60 * 60 * 24 * n_days;
// Compiler calculates 86400 at compile time
// if n_days is a constant or becomes one
```

### Common Subexpression Elimination

Avoids recalculating the same expression:

```c
// Before:
int a = (param2 + 0x201);
int b = param1 * (param2 + 0x201) + a;
return a * (param2 + 0x201) + b * (param2 + 0x201);

// After:
int temp = param2 + 0x201;
int a = temp;
int b = param1 * temp + a;
return a * temp + b * temp;
```

### Dead Code Elimination

Removes code that doesn't affect results:

```c
// Before:
if (param1 < param2 && param1 > param2)  // Always false!
    printf("Never happens\n");
for (int i = 0; i < 1000; i++);  // Empty loop

// After: (entire block removed)
```

### Strength Reduction

Replaces expensive operations with cheaper ones:

```c
// Multiply to shift/add:
int a = param2 * 32;    // → param2 << 5
int b = a * 7;          // → (param2 << 5) * 7

// Division to multiply (unsigned):
unsigned div19(unsigned arg) {
    return arg / 19;
}
// Becomes: multiply by magic constant, then shift
```

### Code Motion

Move invariant code outside loops:

```c
// Before:
for (int i = 0; i < n; i++)
    sum += arr[i] + foo * (bar + 3);

// After (if foo, bar are constant):
int temp = foo * (bar + 3);
for (int i = 0; i < n; i++)
    sum += arr[i] + temp;
```

### Loop Unrolling

Do multiple iterations per loop body:

```c
// Before:
for (int i = 0; i < n; i++)
    sum += arr[i];

// After (4x unrolling):
for (int i = 0; i < n - 3; i += 4) {
    sum += arr[i];
    sum += arr[i+1];
    sum += arr[i+2];
    sum += arr[i+3];
}
// Handle leftovers
```

### Tail Recursion Optimization

Converts tail-recursive functions to iterative:

```c
// Before (recursive):
long factorial(int n) {
    if (n <= 1) return 1;
    else return n * factorial(n - 1);
}

// After (iterative):
long factorial(int n) {
    long result = 1;
    for (int i = 2; i <= n; i++)
        result *= i;
    return result;
}
```

### Limitations of Compiler Optimization

**The compiler can't fix everything:**
```c
int char_sum(char *s) {
    int sum = 0;
    for (size_t i = 0; i < strlen(s); i++)  // strlen called every iteration!
        sum += s[i];
    return sum;
}
```

The compiler can't pull `strlen()` out because `s` changes (potentially).

**You know more than the compiler:**
```c
void lower1(char *s) {
    for (size_t i = 0; i < strlen(s); i++)  // Compiler can't optimize
        if (s[i] >= 'A' && s[i] <= 'Z')
            s[i] -= ('A' - 'a');
}
```

Fix it yourself:
```c
void lower1(char *s) {
    size_t len = strlen(s);  // Calculate once
    for (size_t i = 0; i < len; i++)
        if (s[i] >= 'A' && s[i] <= 'Z')
            s[i] -= ('A' - 'a');
}
```


## Linking {#linking}

### What is Linking?

**Linking** is the process of combining multiple object files to create an executable. It happens at different times:
- **Compile time:** Static linking
- **Load time:** Dynamic linking
- **Run time:** Dynamic library loading

### The Linking Process

```
main.c              sum.c
    │                  │
    ↓                  ↓
cpp, cc1, as      cpp, cc1, as
    ↓                  ↓
main.o             sum.o
    └────────┬─────────┘
             ↓
         Linker (ld)
             ↓
          prog (executable)

Static Linking:
linux> gcc -Og -o prog main.c sum.c
linux> ./prog
```

### Why Linkers?

**Modularity:**
- Write programs as collections of smaller files
- Build libraries of common functions
- Easier to maintain and reuse

**Efficiency:**
- **Time:** Change one file, recompile only that file
- **Space:** Libraries share code across programs


## Object Files {#object-files}

### Three Types of Object Files

| Type | Extension | Purpose |
|:-----|:----------|:-------|
| Relocatable | .o | Can be combined with other .o files |
| Executable | a.out | Can be loaded and run directly |
| Shared | .so | Loaded at runtime (DLL on Windows) |

### ELF Object File Format

ELF = Executable and Linkable Format (standard binary format on Linux)

```
┌────────────────┐
│   ELF Header   │  ← Word size, file type, machine type
├────────────────┤
│ Segment Header │  ← Memory segments for execution
├────────────────┤
│   .text        │  ← Machine code
├────────────────┤
│   .rodata      │  ← Read-only data (jump tables, strings)
├────────────────┤
│   .data        │  ← Initialized globals
├────────────────┤
│   .bss         │  ← Uninitialized globals (no space)
├────────────────┤
│   .symtab      │  ← Symbol table
├────────────────┤
│   .rel.text    │  ← Relocation info for .text
├────────────────┤
│   .rel.data    │  ← Relocation info for .data
├────────────────┤
│   .debug       │  ← Debugging info
├────────────────┤
│ Section Header │  ← Offsets and sizes
└────────────────┘
```


## Symbol Resolution {#symbol-resolution}

### Types of Symbols

**Global symbols:**
- Defined by module m, can be referenced by other modules
- Non-static C functions and non-static global variables

**External symbols:**
- Global symbols referenced by module m but defined elsewhere
- E.g., calling `printf()` from `stdio.h`

**Local symbols:**
- Defined and referenced exclusively by module m
- C functions and global variables with `static` attribute

### Strong vs Weak Symbols

| Type | Definition |
|:------|:------------|
| Strong | Procedures and initialized globals |
| Weak | Uninitialized globals |

### Linker's Symbol Rules

**Rule 1:** Multiple strong symbols are not allowed
- Each item can be defined only once
- Otherwise: Linker error!

**Rule 2:** Given a strong symbol and multiple weak symbols, choose strong
- Weak references resolve to the strong symbol

**Rule 3:** If there are multiple weak symbols, pick an arbitrary one
- Can override with `gcc -fno-common`

### Symbol Resolution Examples

```c
// Example 1: Two strong symbols (ERROR)
int x;
p1() {}
int x;  // ERROR: multiple strong symbols
p2() {}

// Example 2: Strong and weak (OK, weak wins)
int x = 7;
p1() {}
int x;  // x refers to strong definition
p2() {}

// Example 3: Two weak (arbitrary)
int x;
p1() {}
double x;  // Arbitrary choice
p2() {}
// Writes to x might overwrite other variables!
```

### Best Practices for Global Variables

1. **Avoid global variables if possible**
2. **Use `static` if you can**
3. **Initialize if you define a global variable**
4. **Use `extern` if you reference external globals**


## Relocation {#relocation}

### What is Relocation?

After symbol resolution, the linker:
1. Merges separate code and data sections
2. Relocates symbols from relative positions to final addresses
3. Updates all references to reflect new positions

### Relocation Entries

When the assembler can't determine final addresses, it creates relocation entries:

```c
// main.c
int array[2] = {1, 2};
int main() {
    int val = sum(array, 2);
    return val;
}
```

Assembly with relocation info:
```asm
0000000000000000 <main>:
0:  48 83 ec 08       sub    $0x8,%rsp
4:  be 02 00 00 00    mov    $0x2,%esi
9:  bf 00 00 00 00    mov    $0x0,%edi
e:  e8 00 00 00 00    callq  <sum>
                        a: R_X86_64_32  array   // Relocation entry
                        f: R_X86_64_PC32 sum-0x4
13: 48 83 c4 08       add    $0x8,%rsp
17: c3                retq
```

### Relocated Executable

```asm
00000000004004d0 <main>:
4004d0: 48 83 ec 08    sub    $0x8,%rsp
4004d4: be 02 00 00 00 mov    $0x2,%esi
4004d9: bf 18 10 60 00 mov    $0x601018,%edi  // array address
4004de: e8 05 00 00 00 callq  4004e8 <sum>     // sum address
4004e3: 48 83 c4 08    add    $0x8,%rsp
4004e7: c3            retq
```


## Static Libraries {#static-libraries}

### Creating Static Libraries

A **static library** (.a) concatenates related object files with an index:

```
atoi.o  printf.o  random.o
    │       │        │
    └───────┼────────┘
            ↓
   Archiver (ar)
            ↓
       libc.a
```

```bash
unix> ar rs libc.a atoi.o printf.o ... random.o
```

### Using Static Libraries

```bash
unix> gcc -static -o prog main.o -lm
# Links with libm.a
```

**Linker algorithm:**
1. Scan .o and .a files in command line order
2. Keep list of unresolved references
3. When a file resolves references, link it in
4. Error if unresolved references at end

**Important:** Libraries should go at the END of the command line!

```bash
# Correct order:
gcc main.o -lm   # main.o can use math functions

# Wrong order:
gcc -lm main.o   # May fail: libm can't resolve main's symbols
```


## Dynamic Linking {#dynamic-linking}

### Why Dynamic Linking?

**Static library problems:**
- Duplication in stored executables
- Duplication in running executables
- Bug fixes require relinking

### Shared Libraries (.so)

Object files loaded and linked at runtime:
- **Load-time linking:** Executable linked to library when loaded
- **Run-time linking:** Libraries loaded with `dlopen()`

### Dynamic Linking at Load Time

```
main2.c
    ↓
main2.o ─────┐
    ↓        ↓ Linker
prog2l (partially linked)
    ↓
Loader (execve)
    ↓
libc.so + libvector.so (runtime)
```

### Dynamic Linking at Run Time

```c
#include <dlfcn.h>

void *handle = dlopen("./libvector.so", RTLD_LAZY);
// Get function pointer
void (*addvec)(int*, int*, int*, int) = dlsym(handle, "addvec");
// Call it
addvec(x, y, z, 2);
// Unload when done
dlclose(handle);
```

**Uses:**
- Plugin systems
- High-performance web servers
- Runtime library interpositioning


## Loading Executable Files {#loading}

### Memory Layout of Running Program

```
Kernel virtual memory
┌────────────────────────────┐
│        User stack          │  ← Created at runtime
│        (grows down)         │
├────────────────────────────┤
│     Memory-mapped region    │
│     (shared libraries)      │
├────────────────────────────┤
│          heap               │  ← Created by malloc
│        (grows up)           │
├────────────────────────────┤
│     .data  .bss  .text      │  ← From executable
└────────────────────────────┘
         ↓
   0x400000 (text starts here)
```

### How Execution Begins

1. Shell calls `execve()` to load executable
2. Kernel loads program into memory
3. Kernel transfers control to entry point (usually `_start`)
4. `_start` calls `main()`
5. When `main()` returns, `exit()` is called


## Practice Problems {#practice-problems}

### Problem 1: Cache Organization

Given:
- Cache size: 32 bytes
- Block size: 4 bytes
- Direct-mapped

**Question:** For 8-bit address `0x2A`, what are the tag, index, and offset?

**Answer:**
- b = log2(4) = 2 bits offset
- s = log2(32/4) = 3 bits index
- t = 8 - 2 - 3 = 3 bits tag

`0x2A = 00101010₂`
- Offset: `10` = 2
- Index: `010` = 2
- Tag: `001` = 1

### Problem 2: Cache Miss Analysis

Given:
- Array: `int arr[1000]`
- Cache: 64-byte blocks, 4 bytes per int

**Question:** What is the miss rate for:
a) Sequential access: `arr[0], arr[1], arr[2], ...`
b) Stride-4 access: `arr[0], arr[4], arr[8], ...`
c) Stride-250 access: `arr[0], arr[250], arr[500], ...`

**Answer:**
a) Block holds 16 ints (64/4). Sequential: 1 miss per 16 accesses → 6.25% miss rate
b) Block holds 16 ints. Stride-4 accesses every 4th int: 1 miss per 4 accesses → 25% miss rate
c) Stride-250: accesses 0, 250, 500... Each block holds 16 ints, so 250 % 16 = 10, 500 % 16 = 4 → no two accesses in same block → 100% miss rate

### Problem 3: Matrix Multiply Optimization

Given matrices A, B, C where C = A × B.

**Question:** Which loop order has best cache performance?
```c
// Option 1: ijk
for (i) for (j) for (k) c[i][j] += a[i][k] * b[k][j];

// Option 2: kij
for (k) for (i) for (j) c[i][j] += a[i][k] * b[k][j];
```

**Answer:** Option 2 (kij) is better.

- ijk: `b[k][j]` is column-wise (bad spatial locality)
- kij: `a[i][k]` and `b[k][j]` are both row-wise for inner loop (good)

### Problem 4: Symbol Resolution

```c
// main.c
extern int count;
int total = 5;
void main() { ... }

// lib.c
int count = 0;
static int limit = 100;
void process() { ... }
```

**Question:** Classify each symbol.

**Answer:**
- `count` (lib.c): External, referenced by main
- `total` (main.c): Global, defined here
- `limit` (lib.c): Local (static), only in lib.c
- `process` (lib.c): Global, can be called from main


## Common Exam Traps {#common-exam-traps}

### Trap 1: Cache Hit/Miss Timing

```c
int arr[1000];
for (int i = 0; i < 1000; i++)
    x += arr[i];
```

If cache holds 16 ints (64 bytes):
- First access: miss (load block)
- Next 15 accesses: hits
- Miss rate: 1000/16 = 62.5 misses, but only ~63 misses total

### Trap 2: Write-Back Dirty Bit

A dirty block (modified in cache) must be written back to memory before eviction. This adds time to the miss penalty.

### Trap 3: Compiler Optimization Assumptions

The compiler assumes no pointer aliasing (two pointers to same memory) unless told otherwise. With `restrict` keyword:

```c
// Compiler can assume no aliasing:
void copy(int *restrict dst, int *restrict src, int n);

// Must check for overlap:
void copy(void *dst, void *src, int n);
```

### Trap 4: Library Order Matters

```bash
# Wrong:
gcc -lm main.o   # May fail

# Correct:
gcc main.o -lm   # Works
```

### Trap 5: Weak Symbol Resolution

```c
int x;        // Weak (uninitialized)
double x;     // Also weak (uninitialized)
void foo() {} // Strong
```

Two weak symbols: linker picks arbitrarily. Could cause subtle bugs!

### Trap 6: Relocation not for Variables

Code relocation entries tell the linker how to fix up instruction addresses. But variable addresses are resolved directly:

```c
int x = 5;
int *p = &x;  // p = address of x (resolved at link time)
```

### Trap 7: Array Parameter sizeof

```c
void func(int arr[10]) {
    // arr is actually int*
    sizeof(arr);  // 8, not 40!
}
```

### Trap 8: Cache Associativity Confusion

Direct-mapped = 1 line per set
n-way set associative = n lines per set

For same cache size, higher associativity means fewer sets but more lines per set.


## Final Summary {#final-summary}

### Caches

1. **Memory hierarchy:** Fast, small, expensive at top; slow, large, cheap at bottom
2. **Locality:** Programs access same data repeatedly (temporal) and nearby data (spatial)
3. **Cache organization:** Address = tag + index + offset
4. **Direct-mapped:** Each block maps to one location
5. **Set associative:** Each block can go in E locations per set
6. **Write policies:** Write-through/write-back, write-allocate/no-write-allocate

### Writing Cache-Friendly Code

1. **Focus on inner loops**
2. **Stride-1 access for spatial locality**
3. **Use data repeatedly for temporal locality**
4. **Blocking for matrix operations**

### Compiler Optimization

1. **Constant folding:** Pre-calculate constants
2. **Common subexpression elimination:** Don't recalculate
3. **Dead code elimination:** Remove unreachable code
4. **Strength reduction:** Replace expensive ops with cheap ones
5. **Code motion:** Move invariant code out of loops
6. **Loop unrolling:** Reduce loop overhead

### Linking

1. **Symbol resolution:** Match symbol references to definitions
2. **Strong symbols win** over weak symbols
3. **Relocation:** Update addresses after placement
4. **Static libraries:** Archives of .o files
5. **Dynamic linking:** Shared libraries at load or run time
6. **Library order matters** in command line

### Key Insight

Understanding how the system works — memory hierarchy, caches, compilation, linking — lets you write better code by anticipating what the hardware and software will do with your program.

Good luck with your final exam!
