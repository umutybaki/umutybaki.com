---
title: "3 - Memory Management - Stack, Heap, and Memory Bugs"
date: "2026-04-14"
description: "Comprehensive guide to stack, heap, dynamic allocation, and memory bug categories for the COMP 201 midterm."
---

# 3 - Memory Management - Stack, Heap, and Memory Bugs

## Introduction

Memory management is one of the most heavily tested topics on COMP201 midterms. This guide covers the stack, heap, dynamic allocation functions (malloc, calloc, realloc, strdup), freeing memory, and the 13 critical memory bug categories that appear repeatedly in exam problems. Understanding these concepts deeply-not just memorizing them-is essential for success.


## Part 1: The Stack

The **stack** is the portion of memory automatically managed by the processor. It stores:
- Local variables declared inside functions
- Function parameters
- Return addresses for function calls

**Automatic Management**: When you declare a local variable in C, it automatically gets allocated when the function is called and deallocated when the function returns.

```c
void example() {
    int x = 42;        // allocated on stack
    char buffer[100];  // allocated on stack
}  // x and buffer automatically freed here
```

**LIFO (Last-In-First-Out)**: The stack grows downward as functions are called, and shrinks as they return. Each function call creates a **stack frame** containing its local variables.

**Fixed Size**: The total stack size is fixed, typically 8MB on modern systems. Large allocations can cause a **stack overflow**.

**Speed**: Stack allocation/deallocation is extremely fast-just a pointer adjustment.

**Type Safety**: The compiler checks variable types on the stack.

### Stack Frames and Function Calls

When a function is called, a new frame is pushed onto the stack:

```text
STACK MEMORY (grows downward)
┌─────────────────┐
│     main        │ ← main's frame
│  x = 10         │   (contains local vars)
├─────────────────┤
│  factorial      │ ← factorial's frame (first call)
│  n = 5          │
├─────────────────┤
│  factorial      │ ← factorial's frame (second call)
│  n = 4          │
├─────────────────┤
│      ...        │
└─────────────────┘
```

When `factorial(5)` returns, its frame is freed. When `factorial(4)` returns, its frame is freed. The stack automatically cleans up.

### Critical Stack Danger: Returning Pointer to Local Variable

This is a classic exam bug:

```c
char *create_string(char ch, int num) {
    char new_str[num + 1];     // allocates on STACK
    for (int i = 0; i < num; i++) {
        new_str[i] = ch;
    }
    new_str[num] = '\0';
    return new_str;            // DANGER! Returning pointer to stack memory
}

int main() {
    char *str = create_string('a', 4);
    printf("%s", str);         // UNDEFINED BEHAVIOR
                               // new_str's stack frame was freed when
                               // create_string returned!
}
```

**What goes wrong**: When `create_string()` returns, its stack frame is destroyed. The local variable `new_str` no longer exists. The pointer `str` in main now points to freed (recycled) memory. Accessing it is undefined behavior-it might print garbage, crash, or appear to work by coincidence.

**Why it happens**: `new_str` is an array on the stack, not a pointer. It's not allocated with `malloc()`, so we can't return it.

**The fix**: Allocate the string on the **heap** instead, which persists until explicitly freed.


## Part 2: The Heap

The **heap** is a portion of memory that you (the programmer) manage explicitly. The operating system provides memory blocks when requested via `malloc()`, `calloc()`, and `realloc()`. You're responsible for freeing memory with `free()`.

**Manual Management**: You control when memory is allocated and freed.

**Grows Upward**: Unlike the stack, the heap grows upward as more memory is allocated.

**Plentiful**: The heap can grow very large (limited mainly by available RAM).

**Slow**: Heap allocation/deallocation is slower than stack allocation.

**No Type Safety**: Heap memory is returned as `void *`. You're responsible for using it correctly.

**Lifetime Control**: Memory persists until you explicitly call `free()`.

### Memory Layout (Simplified 64-bit Linux)

```text
HIGH ADDRESSES
    (reserved)

8MB
    STACK (grows downward)  ↓

    (unallocated gap)

    HEAP (grows upward)     ↑
    Global data
    Text (code)

LOW ADDRESSES
```

### The Heap Solution to Returning Strings

```c
char *create_string(char ch, int num) {
    char *new_str = malloc(sizeof(char) * (num + 1));
    // new_str points to heap memory that PERSISTS

    for (int i = 0; i < num; i++) {
        new_str[i] = ch;
    }
    new_str[num] = '\0';
    return new_str;  // Now safe! Heap memory persists
}

int main() {
    char *str = create_string('a', 4);
    printf("%s", str);  // Works correctly! Prints "aaaa"
    free(str);          // OUR responsibility to free it
    return 0;
}
```

**Key insight**: With the heap, we explicitly allocate memory that outlives the function, return a pointer to it, and trust the caller to free it when done.


## Part 3: Dynamic Memory Allocation Functions

### malloc() - Memory Allocate

**Signature**:
```c
void *malloc(size_t size);
```

**Purpose**: Allocates `size` bytes of uninitialized memory on the heap.

**Returns**:
- A `void *` pointer to the starting address of the allocated block
- `NULL` if allocation fails (out of memory)

**Memory Content**: The allocated memory is **not zeroed out**. It contains whatever garbage was previously in that memory location.

**Example**:
```c
int *nums = malloc(10 * sizeof(int));  // allocate space for 10 ints
assert(nums != NULL);                   // check for allocation failure
nums[0] = 42;
nums[1] = 99;
// ... use the array ...
free(nums);  // MUST free when done
```

**Common Mistake**: Forgetting to multiply by `sizeof()`:
```c
int *arr = malloc(100);        // WRONG! Only 100 bytes, not 100 ints
int *arr = malloc(100 * sizeof(int));  // Correct on most systems
```

### calloc() - Cleared Allocate

**Signature**:
```c
void *calloc(size_t nmemb, size_t size);
```

**Purpose**: Allocates memory for `nmemb` elements of size `size` each, and **zero-initializes all bytes**.

**Equivalent to**:
```c
// These are roughly equivalent:
int *arr1 = calloc(20, sizeof(int));

int *arr2 = malloc(20 * sizeof(int));
for (int i = 0; i < 20; i++) arr2[i] = 0;
```

**When to use**: When you need all values initialized to 0. Useful for:
- Allocating arrays of structs where you want fields to start at 0/NULL
- Allocating boolean arrays where false=0
- Any situation where uninitialized data would be problematic

**Performance note**: `calloc()` is slower than `malloc()` because it must zero every byte. Only use when you actually need zeroed memory.

**Example**:
```c
int *scores = calloc(100, sizeof(int));
// All 100 ints are now 0
free(scores);
```

### realloc() - Resize Allocation

**Signature**:
```c
void *realloc(void *ptr, size_t new_size);
```

**Purpose**: Resize a previously allocated block to a new size.

**Behavior**:
1. If there's enough space after the existing block, simply extend it
2. If not, allocate new memory at a different location, copy old data, free the old block, return pointer to new location

**Critical Point**: `realloc()` may **move your memory**. The returned pointer might be different from the input pointer.

**Danger**: Naive code that doesn't save the return value leaks memory on failure:

```c
// WRONG - can leak memory:
int *arr = malloc(100 * sizeof(int));
arr = realloc(arr, 200 * sizeof(int));  // if realloc fails, returns NULL
                                         // arr is now NULL, original memory leaked!
```

**Correct Pattern**:
```c
int *arr = malloc(100 * sizeof(int));
int *temp = realloc(arr, 200 * sizeof(int));
if (temp == NULL) {
    // realloc failed, arr still points to original memory
    free(arr);
    printf("Allocation failed\n");
    return;
}
arr = temp;  // now safe to use arr
```

**Example: Growing a Dynamic String**:
```c
char *str = strdup("Hello");
assert(str != NULL);

// Want to make it hold "Hello world!"
char *addition = " world!";
size_t new_size = strlen(str) + strlen(addition) + 1;
char *temp = realloc(str, new_size);
assert(temp != NULL);
str = temp;

strcat(str, addition);
printf("%s\n", str);  // prints "Hello world!"
free(str);
```

### strdup() - String Duplicate

**Signature**:
```c
char *strdup(const char *s);
```

**Purpose**: Allocate a new string on the heap that's a copy of the input string.

**Equivalent to**:
```c
// These are equivalent:
char *copy = strdup("Hello");

char *copy = malloc(strlen("Hello") + 1);
strcpy(copy, "Hello");
```

**Returns**: A pointer to the new heap-allocated string, or `NULL` on failure.

**Example**:
```c
char *original = "Hello, World!";
char *copy = strdup(original);
assert(copy != NULL);

copy[0] = 'J';  // modify the copy
printf("%s\n", original);  // "Hello, World!" - unchanged
printf("%s\n", copy);      // "Jello, World!" - changed
free(copy);
```

**When to use**:
- When you receive a string pointer you don't own (like a function parameter)
- When you need to modify the string
- When the original string might be deallocated before you're done using it


## Part 4: Freeing Memory

### free() - Deallocate

**Signature**:
```c
void free(void *ptr);
```

**Purpose**: Deallocate memory previously allocated by `malloc()`, `calloc()`, or `realloc()`.

**Critical Rules**:
1. **Exactly Once**: Each allocated block must be freed exactly once
2. **Starting Address**: You must free the pointer you received from allocation (for malloc'd memory)
3. **NULL Safe**: Calling `free(NULL)` is safe-it does nothing

**Example**:
```c
char *bytes = malloc(4);
// ... use bytes ...
free(bytes);     // correct
free(bytes);     // ERROR! Double-free (undefined behavior)

int *arr = malloc(100 * sizeof(int));
free(arr + 5);   // ERROR! Not the starting address
free(arr);       // if above didn't catch the error, error here too
```

### Memory Cleanup Patterns

**Pattern 1: Simple Allocation and Free**
```c
char *str = malloc(100);
assert(str != NULL);
// ... use str ...
free(str);
```

**Pattern 2: Strdup and Free**
```c
char *copy = strdup("Hello");
assert(copy != NULL);
// ... use copy ...
free(copy);
```

**Pattern 3: Array of Pointers**
```c
char **strings = malloc(10 * sizeof(char *));
assert(strings != NULL);

for (int i = 0; i < 10; i++) {
    strings[i] = strdup("test");
    assert(strings[i] != NULL);
}

// MUST free in right order:
for (int i = 0; i < 10; i++) {
    free(strings[i]);  // free each string first
}
free(strings);         // then free the array
```

### Memory Leak

**Definition**: A memory leak occurs when you allocate memory but fail to free it.

```c
void leak_example() {
    char *str = malloc(100);
    // ... use str ...
    return;  // str not freed! Memory leaked.
}
```

**Consequences**:
- In long-running programs, leaked memory accumulates
- Eventually the program runs out of heap space
- malloc() fails, returning NULL

**Important Note**: Memory leaks are generally **less critical** than other bugs. A program with leaks often runs fine until it accumulates enough leaked memory. However, exam problems often test memory leaks because they demonstrate understanding of memory management responsibility.

### Valgrind: Mental Model

Valgrind is a tool that tracks every malloc and free call. It reports:
- **Still reachable**: Memory allocated but not freed (leaks)
- **Definitely lost**: Memory allocated and pointer was lost (likely bug)
- **Invalid free**: free() called on non-heap memory or already-freed memory

For the exam, understand the **concept**: Valgrind is tracking whether every allocation has a matching free.


## Part 5: Stack vs Heap Comparison

| Characteristic | Stack | Heap |
| :--- | :--- | :--- |
| **Management** | Automatic | Manual (programmer) |
| **Speed** | Very fast | Slower |
| **Size** | Fixed (~8MB default) | Large (limited by RAM) |
| **Grows** | Downward | Upward |
| **Lifetime** | Until function returns | Until `free()` called |
| **Type Safety** | Checked by compiler | No safety |
| **Scope** | Function scope | Unlimited scope |
| **Can overflow** | Stack overflow | Fails malloc, returns NULL |
| **Use When** | Fixed-size local data | Variable-size, long-lived, or returned data |

### When to Use Each

**Prefer Stack When**:
- You know the size at compile time
- Data is only needed within one function
- Data doesn't need to outlive the function
- You want automatic cleanup

**Need Heap When**:
- Size determined at runtime
- Data must outlive the function that creates it
- You need a very large allocation (would overflow stack)
- You need to resize memory

**General Principle**: Unless a situation requires heap allocation, stack allocation is preferred. However, many programs mix both-using the stack for fixed-size structures and the heap for dynamically-sized data.


## Part 6: The 13 Memory Bug Types

This is the most heavily tested section. Understand not just the name but the intuition, the formal definition, code examples, what goes wrong, and how to fix it.

### Bug 1: Memory Leak

**Intuition**: You ask for memory but never return it to the system.

**Definition**: Allocating memory with `malloc()`, `calloc()`, or `realloc()` but failing to call `free()` on that memory, causing it to remain allocated until program termination.

**Example**:
```c
void process_file(const char *filename) {
    FILE *fp = fopen(filename, "r");
    char *buffer = malloc(1024);

    // Read from file into buffer
    // ... work with buffer ...

    fclose(fp);
    // BUG: buffer not freed!
    // If process_file is called many times, memory leaks accumulate
}
```

**What goes wrong**: Each call to `process_file()` leaves 1024 bytes allocated. After 1000 calls, 1MB is leaked. The heap fills up, malloc eventually returns NULL, and the program crashes.

**Fix**:
```c
void process_file(const char *filename) {
    FILE *fp = fopen(filename, "r");
    char *buffer = malloc(1024);

    // ... work ...

    fclose(fp);
    free(buffer);  // FIXED
}
```

### Bug 2: Use After Free

**Intuition**: You return a pointer to memory to the system, then try to use it.

**Definition**: Accessing heap memory via a pointer after that memory has been freed via `free()`.

**Example**:
```c
char *str = malloc(10);
strcpy(str, "hello");
free(str);

printf("%s\n", str);  // BUG: Use after free
str[0] = 'H';         // BUG: Use after free
```

**What goes wrong**: After `free()`, the memory is returned to the heap allocator and may be reused for other allocations. Reading from the freed memory might show:
- Garbage
- Data from another part of the program (information leak!)
- Stale data that looks "correct" by coincidence

Writing to freed memory corrupts other allocated blocks.

**Fix**: Set pointer to NULL after freeing, then check before use:
```c
char *str = malloc(10);
strcpy(str, "hello");
free(str);
str = NULL;
if (str != NULL) {
    printf("%s\n", str);  // Safe: won't execute
}
```

### Bug 3: Double Free

**Intuition**: You return the same memory to the system twice.

**Definition**: Calling `free()` on the same pointer twice (or on multiple pointers to the same block).

**Example**:
```c
char *str = malloc(10);
strcpy(str, "hello");
free(str);
free(str);  // BUG: Double free
```

**What goes wrong**: The heap allocator's internal structures become corrupted. The second `free()` tries to return already-returned memory to the free list, causing:
- Immediate crash (most likely)
- Silent corruption that causes crashes later
- Security vulnerabilities

**Fix**: After freeing, set pointer to NULL:
```c
char *str = malloc(10);
strcpy(str, "hello");
free(str);
str = NULL;
free(str);  // Safe: free(NULL) does nothing
```

Or use pointers more carefully in functions returning pointers:
```c
char *str = malloc(10);
// ... use str ...
// Return to caller; let THEM free it
return str;
// Don't free here!
```

### Bug 4: Freeing Unallocated Storage

**Intuition**: You try to return memory to the system that never came from malloc/calloc/realloc.

**Definition**: Calling `free()` on a pointer that was never returned by `malloc()`, `calloc()`, or `realloc()`.

**Example**:
```c
// Stack variable
int arr[100];
free(arr);  // BUG: arr is on stack, not heap

// Function parameter
void process(char *str) {
    free(str);  // BUG if caller passed stack-allocated string
}

int main() {
    char buf[100] = "hello";
    process(buf);  // Crashes in process()
}

// Literal string
char *msg = "hello";  // points to read-only string literal
free(msg);  // BUG: can't free literal strings
```

**What goes wrong**: The heap allocator's bookkeeping is violated. It tries to mark memory that was never allocated as free, corrupting the free list. Usually crashes immediately with "corrupt heap" error.

**Fix**: Only free memory from malloc/calloc/realloc:
```c
// Right: allocate then free
char *msg = malloc(10);
strcpy(msg, "hello");
free(msg);

// Right: let caller manage
char buf[100] = "hello";
process(buf);  // no free needed

// Right: don't free literals
char *msg = "hello";  // don't free this
```

### Bug 5: Freeing Stack Space

**Intuition**: A specific case of freeing unallocated storage-trying to free a stack variable.

**Definition**: Calling `free()` on a pointer to a stack-allocated variable.

**Example**:
```c
void process_data() {
    int data[1000];  // Stack allocated
    int *ptr = data;

    // ... use ptr ...

    free(ptr);  // BUG: data is on stack!
}
```

**What goes wrong**: Same as "Freeing Unallocated Storage"-heap corruption, crash.

**Fix**: Don't free stack memory:
```c
void process_data() {
    int data[1000];  // Stack allocated
    int *ptr = data;

    // ... use ptr ...

    // Don't free; ptr is destroyed automatically
}
```

### Bug 6: Dangling Pointer

**Intuition**: You have a pointer to memory that's been freed (or gone out of scope).

**Definition**: A pointer that refers to memory that's no longer valid-either freed or stack-allocated that's gone out of scope.

**Example**:
```c
char *get_temp() {
    char buf[100] = "temporary";  // Stack allocated
    return buf;  // BUG: Returning dangling pointer
}

int main() {
    char *ptr = get_temp();
    printf("%s\n", ptr);  // UNDEFINED: buf is gone
}
```

```c
char *ptr;
{
    char *temp = malloc(50);
    strcpy(temp, "test");
    ptr = temp;
    free(temp);  // ptr now dangling
    temp = NULL;
}
printf("%s\n", ptr);  // UNDEFINED: dangling pointer
```

**What goes wrong**: Accessing the pointer reads undefined memory-garbage, crashed program, or security vulnerability.

**Fix**: Either return new heap memory, or adjust lifetime:
```c
// Fix 1: Return heap memory
char *get_temp() {
    char *buf = malloc(100);
    strcpy(buf, "temporary");
    return buf;  // Caller must free
}

// Fix 2: Use stack return value (requires caller to copy)
int process(char *dest, size_t size) {
    snprintf(dest, size, "temporary");
    return 0;
}

int main() {
    char buf[100];
    process(buf, sizeof(buf));
}
```

### Bug 7: Returning Pointer to Local Variable

**Intuition**: A specific dangling pointer case-returning stack variable's address.

**Definition**: A function returns a pointer to a local variable (stack-allocated). When the function returns, the local variable's memory is freed, and the returned pointer becomes invalid.

**Example** (classic exam question):
```c
int *get_number() {
    int x = 42;
    return &x;  // BUG: Returning pointer to stack variable
}

int main() {
    int *ptr = get_number();
    printf("%d\n", *ptr);  // UNDEFINED: x no longer exists
}
```

More subtle:
```c
char *create_string(char ch, int num) {
    char new_str[num + 1];  // Stack allocated
    for (int i = 0; i < num; i++) {
        new_str[i] = ch;
    }
    new_str[num] = '\0';
    return new_str;  // BUG: Returning pointer to local array
}

int main() {
    char *str = create_string('a', 4);
    printf("%s\n", str);  // UNDEFINED
}
```

**What goes wrong**: The stack frame is destroyed when the function returns. The array/variable no longer exists. The returned pointer points to memory that's now unallocated and will be reused by future function calls. Reading it returns whatever is currently on the stack. Writing to it corrupts other function's data.

**Fix**: Use heap allocation:
```c
char *create_string(char ch, int num) {
    char *new_str = malloc(num + 1);  // Heap allocated
    for (int i = 0; i < num; i++) {
        new_str[i] = ch;
    }
    new_str[num] = '\0';
    return new_str;  // Safe: heap memory persists
}

int main() {
    char *str = create_string('a', 4);
    printf("%s\n", str);  // Works: "aaaa"
    free(str);  // Caller's responsibility
}
```

### Bug 8: Buffer Overflow / Insufficient Space

**Intuition**: Writing more data to a buffer than it can hold.

**Definition**: Writing past the end of an allocated buffer, corrupting memory beyond the buffer.

**Example**:
```c
// Static buffer too small
char buf[5];
strcpy(buf, "hello, world");  // BUG: "hello, world" is 12 chars + null
                              // buf only has 5 chars; overflow!

// Malloc'd buffer too small
char *str = malloc(10);
strcpy(str, "this is a very long string");  // BUG: overflow

// Array index out of bounds
int arr[10];
for (int i = 0; i <= 10; i++) {  // BUG: should be i < 10
    arr[i] = 0;  // arr[10] is out of bounds
}
```

**What goes wrong**: Data is written past the end of the buffer, corrupting whatever follows in memory:
- Other local variables get overwritten
- Heap bookkeeping data gets corrupted
- Return addresses on the stack get overwritten
- The program crashes with no clear indication of why

This is a classic security vulnerability.

**Fix**:
```c
// Use strncpy to limit copying
char buf[10];
strncpy(buf, "hello", sizeof(buf) - 1);
buf[sizeof(buf) - 1] = '\0';

// Allocate enough space
char *str = malloc(strlen("long string") + 1);
strcpy(str, "long string");

// Use bounds checking in loops
for (int i = 0; i < 10; i++) {  // correct: <, not <=
    arr[i] = 0;
}
```

### Bug 9: Uninitialized Pointer Dereference

**Intuition**: Using a pointer before assigning it a valid address.

**Definition**: Dereferencing a pointer that hasn't been initialized (or set to an invalid address), causing access to undefined memory.

**Example**:
```c
int *ptr;        // Uninitialized!
*ptr = 42;       // BUG: ptr points to random memory

char *str;       // Uninitialized!
strcpy(str, "hello");  // BUG: str points to random memory

int arr[10];
int *p = arr;
p++;
p++;
int *q;  // Uninitialized!
*q = *p;  // BUG: q is uninitialized
```

**What goes wrong**: The pointer contains whatever garbage was in that memory location. Dereferencing it accesses random memory, likely causing:
- Immediate crash (segmentation fault)
- Subtle memory corruption

**Fix**: Always initialize pointers:
```c
int *ptr = NULL;  // Initialized to NULL
if (something) {
    ptr = malloc(sizeof(int));
    assert(ptr != NULL);
    *ptr = 42;
}
free(ptr);

char *str = NULL;  // Initialized
if (need_string) {
    str = malloc(100);
    strcpy(str, "hello");
}
free(str);
```

### Bug 10: NULL Dereference

**Intuition**: Following a NULL pointer.

**Definition**: Dereferencing a pointer that has the value NULL, causing an invalid memory access.

**Example**:
```c
int *ptr = malloc(10);
if (ptr == NULL) {
    printf("Allocation failed\n");
    // ptr is NULL here
}

*ptr = 42;  // BUG: NULL dereference if allocation failed

char *str = strdup("hello");
// No assert! strdup could have failed
printf("%s\n", str);  // BUG: if str is NULL, crash

int *arr[10];
arr[0] = NULL;
printf("%d\n", *arr[0]);  // BUG: NULL dereference
```

**What goes wrong**: Dereferencing NULL is undefined behavior. On most systems, address 0 is not accessible, causing:
- Immediate crash (segmentation fault)
- In some contexts, memory corruption

**Fix**: Always check for NULL:
```c
int *ptr = malloc(10);
if (ptr == NULL) {
    fprintf(stderr, "Allocation failed\n");
    return -1;
}
*ptr = 42;

char *str = strdup("hello");
assert(str != NULL);  // Crash if NULL; better than silent bug
printf("%s\n", str);

int *arr[10] = {NULL};
if (arr[0] != NULL) {
    printf("%d\n", *arr[0]);
}
```

### Bug 11: Array Index Out of Bounds

**Intuition**: Accessing an array element that doesn't exist.

**Definition**: Using an array index outside the valid range (0 to size-1), accessing invalid memory.

**Example**:
```c
int arr[10];
arr[10] = 42;  // BUG: Valid indices are 0-9, not 0-10

char str[5] = "hello";  // Valid indices 0-4 (including '\0' at position 4)
printf("%c\n", str[5]);  // BUG: out of bounds

for (int i = 0; i <= 10; i++) {  // BUG: should be < 10
    arr[i] = i;
}
```

**What goes wrong**: Accessing memory beyond the array corrupts other data or crashes.

**Fix**:
```c
int arr[10];
for (int i = 0; i < 10; i++) {  // < not <=
    arr[i] = i;
}

arr[9] = 42;  // Valid

// For dynamic arrays, track size
int *dyn = malloc(10 * sizeof(int));
for (int i = 0; i < 10; i++) {
    dyn[i] = i;
}
```

### Bug 12: Assignment of Incompatible Types

**Intuition**: Treating one type of pointer as another type.

**Definition**: Assigning or casting pointers of incompatible types, leading to misinterpretation of data.

**Example**:
```c
char *str = "hello";
int *as_int = (int *) str;
printf("%d\n", *as_int);  // BUG: interpreting char data as int

double *d = (double *) malloc(10 * sizeof(int));
// BUG: allocated int space but using as double pointer

struct Point { int x; int y; };
struct Point *p = (struct Point *) malloc(10 * sizeof(int));
// BUG: not enough space for struct
```

**What goes wrong**: Data is misinterpreted. Reading an int from char data reads garbage. Writing to misaligned memory corrupts neighboring data.

**Fix**:
```c
char *str = malloc(10);
strcpy(str, "hello");
// char *str = (char *) str;  // Don't cast
// int *as_int = (int *) str;  // Wrong

double *d = malloc(10 * sizeof(double));  // Allocate right type

struct Point *p = malloc(10 * sizeof(struct Point));  // Right size
```

### Bug 13: Incorrect Pointer Arithmetic

**Intuition**: Moving a pointer wrong number of bytes.

**Definition**: Adding/subtracting from a pointer using the wrong scale, causing the pointer to land at unintended addresses.

**Important**: C's pointer arithmetic **scales by the type's size**:
```c
int *p;
p += 1;      // Moves by 1 * sizeof(int) = 4 bytes (on 32-bit)

char *c;
c += 1;      // Moves by 1 * sizeof(char) = 1 byte

double *d;
d += 1;      // Moves by 1 * sizeof(double) = 8 bytes
```

**Example** (classic exam bug):
```c
int *nums = malloc(10 * sizeof(int));
// nums[0] is at address, say, 0x1000
// nums[1] is at address 0x1004 (4 bytes later)

int *p = nums;
p++;  // Moves to 0x1004 (nums[1]) - CORRECT by accident!

// But accessing wrong element:
*(p + 3);  // Moves from current to +3*4=+12 bytes
           // This is nums[1] + 3 = nums[4]

// Common bug: confusing array index with pointer arithmetic
int *arr = nums + 1;  // arr points to nums[1]
arr[0] = 42;  // Same as nums[1] = 42
arr[1] = 99;  // Same as nums[2] = 99
// This is easy to get confused about!
```

**What goes wrong**: The pointer lands at the wrong address, corrupting or reading unintended data.

**Fix**: Be very careful with pointer arithmetic; use array indexing when possible:
```c
int *nums = malloc(10 * sizeof(int));

// Right: array indexing
nums[3] = 42;
nums[4] = 99;

// Also right: careful pointer arithmetic
*(nums + 3) = 42;
*(nums + 4) = 99;

// Wrong: forgetting scale
// *(nums + 12) = 42;  // Moves 12 elements, not 12 bytes!
```


## Part 7: Stack vs Heap: Common Exam Patterns

### Pattern 1: Function Returns Data

**Question**: When should a function return stack vs heap?

**Stack Return**:
```c
// Return simple types directly (value, not pointer)
int get_count() {
    int count = 100;
    return count;  // Correct: return by value
}
```

**Heap Return** (when caller needs dynamic memory):
```c
// Return pointer to heap memory when size is variable
char *read_line(FILE *fp) {
    char *line = malloc(256);
    fgets(line, 256, fp);
    return line;  // Caller must free
}
```

**Wrong** (returns pointer to local variable):
```c
char *get_message() {
    char buf[100] = "hello";
    return buf;  // BUG: dangling pointer!
}
```

### Pattern 2: Array Allocation

**Stack when size is known**:
```c
void process_data() {
    int scores[100];  // Fixed size, stack
    // ... use scores ...
}  // Automatically freed
```

**Heap when size is runtime-determined**:
```c
int *allocate_scores(int n) {
    int *scores = malloc(n * sizeof(int));
    // ... fill scores ...
    return scores;  // Caller must free
}
```

### Pattern 3: Function Parameters

**Stack data passed by value or reference**:
```c
void update_buffer(char *buf) {
    // buf points to data allocated by caller
    // Don't free it here! Caller manages lifetime
    strcpy(buf, "new value");
}

int main() {
    char mybuf[100];
    update_buffer(mybuf);  // Pass pointer to stack data
    // mybuf still valid here
}
```

**Caller's responsibility when function returns heap**:
```c
char *create_string() {
    char *s = malloc(50);
    strcpy(s, "hello");
    return s;  // Caller owns it now
}

int main() {
    char *str = create_string();
    // ... use str ...
    free(str);  // Caller must free
}
```


## Part 8: Common Exam Traps

### Trap 1: Malloc returns NULL on failure

```c
int *arr = malloc(size);
arr[0] = 42;  // BUG if malloc returned NULL!
```

**Fix**: Always check
```c
int *arr = malloc(size);
if (arr == NULL) {
    fprintf(stderr, "Out of memory\n");
    return -1;
}
arr[0] = 42;
```

### Trap 2: Forgetting to add 1 for null terminator

```c
char *str = malloc(strlen("hello"));  // BUG: off-by-one!
strcpy(str, "hello");  // Buffer overflow!
```

**Fix**:
```c
char *str = malloc(strlen("hello") + 1);  // +1 for '\0'
strcpy(str, "hello");  // Correct
```

### Trap 3: Pointer to pointer confusion

```c
int **ptr_to_ptr = malloc(sizeof(int*));
*ptr_to_ptr = malloc(sizeof(int));
**ptr_to_ptr = 42;

// Must free in right order:
free(*ptr_to_ptr);  // Free the int
free(ptr_to_ptr);   // Free the pointer
```

### Trap 4: Lost pointers

```c
char *str = malloc(100);
str = malloc(100);  // BUG: Original 100 bytes leaked!

// Fix: free before reallocating
char *str = malloc(100);
free(str);
str = malloc(100);

// Or use realloc:
str = realloc(str, 200);  // Safely resizes and preserves data
```

### Trap 5: Modifying loop variable

```c
char *arr = malloc(10 * sizeof(char*));
for (int i = 0; i < 10; i++) {
    arr[i] = malloc(50);
}

// Wrong: can't free properly if arr is modified
// arr = arr + 5;  // arr no longer points to start!

// Correct: keep original pointer
char *start = arr;
// ... use arr ...
for (int i = 0; i < 10; i++) {
    free(arr[i]);
}
free(start);
```

### Trap 6: sizeof confusion

```c
char *buf = malloc(100);  // Correct: 100 bytes

char *buf = malloc(sizeof(char) * 100);  // Also correct

int *nums = malloc(10 * sizeof(int));  // Correct

int *nums = malloc(10 * sizeof(int*));  // BUG: allocates pointers!
```

### Trap 7: Function modifying pointers

When passing a pointer to a function, the function gets a **copy** of the pointer:

```c
void reset(int *ptr) {
    ptr = NULL;  // Changes the local copy, not the original!
}

int main() {
    int *p = malloc(10);
    reset(p);
    *p = 42;  // p is NOT NULL; still valid
}
```

If the function needs to modify the pointer itself, need a pointer-to-pointer:

```c
void reset(int **ptr) {
    free(*ptr);
    *ptr = NULL;  // Changes the original
}

int main() {
    int *p = malloc(10);
    reset(&p);
    *p = 42;  // ERROR: p is NULL now
}
```

### Trap 8: realloc failures leak memory

```c
char *arr = malloc(100);
arr = realloc(arr, 200);  // If fails, arr becomes NULL and 100 bytes leak!

// Right pattern:
char *temp = realloc(arr, 200);
if (temp == NULL) {
    free(arr);
    return -1;
}
arr = temp;
```

### Trap 9: Strdup on NULL

```c
char *str = NULL;
char *copy = strdup(str);  // Undefined behavior
```

### Trap 10: Free order in structs

```c
struct Node {
    char *data;
    int value;
};

struct Node *node = malloc(sizeof(struct Node));
node->data = malloc(50);

// Wrong order:
free(node);     // Free the struct first
free(node->data);  // Can't access node->data now! Error.

// Right order:
free(node->data);  // Free the contained data first
free(node);        // Then free the struct
```


## Part 9: Exam-Style Practice Problems

### Problem 1: String Manipulation with Multiple Allocations

**Question**: Write a function that concatenates two strings and returns the result. The input strings are read-only (owned by caller). Your function must allocate new memory, and the caller will free it.

```c
// Your implementation:
char *concat(const char *s1, const char *s2) {
    // TODO: implement this
}

// Test code:
int main() {
    char *result = concat("hello", " world");
    assert(result != NULL);
    printf("%s\n", result);  // Should print "hello world"
    free(result);
    return 0;
}
```

**Solution**:
```c
char *concat(const char *s1, const char *s2) {
    // Calculate size needed (include null terminator)
    size_t size = strlen(s1) + strlen(s2) + 1;

    // Allocate memory
    char *result = malloc(size);
    assert(result != NULL);

    // Copy both strings
    strcpy(result, s1);
    strcat(result, s2);

    return result;
}
```

**Exam variations**:
- What if s1 or s2 is NULL? (Check before using)
- What if malloc fails? (Return NULL and let caller check)
- What if the strings are very large? (Still works; malloc handles it)


### Problem 2: Array of Strings

**Question**: Write a function that takes an array of strings and a count, and returns a new array with copies of those strings. You must allocate the new array and all its strings.

```c
char **copy_strings(const char *const *strings, int count) {
    // TODO: implement this
}

// Test:
int main() {
    const char *original[] = {"apple", "banana", "cherry"};
    char **copy = copy_strings(original, 3);

    for (int i = 0; i < 3; i++) {
        printf("%s\n", copy[i]);
    }

    // Free: must free in right order
    for (int i = 0; i < 3; i++) {
        free(copy[i]);
    }
    free(copy);
}
```

**Solution**:
```c
char **copy_strings(const char *const *strings, int count) {
    // Allocate array of pointers
    char **result = malloc(count * sizeof(char *));
    assert(result != NULL);

    // Allocate and copy each string
    for (int i = 0; i < count; i++) {
        result[i] = strdup(strings[i]);
        assert(result[i] != NULL);
    }

    return result;
}
```

**Exam variations**:
- What if count is 0? (malloc(0) is implementation-defined; check it)
- What if one of the original strings is NULL? (Handle it or document assumptions)
- What if strdup fails? (Cleanup partially allocated strings)


### Problem 3: Dynamic Array Growth with Realloc

**Question**: Implement a simple dynamic array that starts small and grows as needed. Implement `add()` function.

```c
typedef struct {
    int *data;
    int size;      // Number of elements currently stored
    int capacity;  // Allocated space
} IntArray;

IntArray *create_array() {
    IntArray *arr = malloc(sizeof(IntArray));
    arr->data = malloc(10 * sizeof(int));
    arr->size = 0;
    arr->capacity = 10;
    return arr;
}

void add(IntArray *arr, int value) {
    // TODO: If size == capacity, reallocate with double capacity
    // Then add the value
}

void free_array(IntArray *arr) {
    // TODO: implement
}
```

**Solution**:
```c
void add(IntArray *arr, int value) {
    // Check if we need to grow
    if (arr->size == arr->capacity) {
        arr->capacity *= 2;
        int *temp = realloc(arr->data, arr->capacity * sizeof(int));
        assert(temp != NULL);
        arr->data = temp;
    }

    // Add the value
    arr->data[arr->size] = value;
    arr->size++;
}

void free_array(IntArray *arr) {
    free(arr->data);
    free(arr);
}
```

**Exam variations**:
- What if realloc fails? (Don't modify arr, return error)
- What if we shrink? (Similar logic, but half capacity)


### Problem 4: Memory Bug Identification

**Question**: Identify all memory bugs in this code:

```c
char *concat_with_separator(const char *s1, const char *s2, char sep) {
    char *result = malloc(strlen(s1) + strlen(s2));  // Line 1
    strcpy(result, s1);
    result[strlen(s1)] = sep;
    strcpy(result + strlen(s1) + 1, s2);
    return result;
}

int main() {
    char *str = concat_with_separator("hello", "world", '-');
    printf("%s\n", str);
    char *copy = str;
    free(copy);
    free(str);  // Line 11
    return 0;
}
```

**Answer**:
1. **Line 1**: Insufficient space. Need `strlen(s1) + strlen(s2) + 2` (for separator and null terminator).
2. **Line 11**: Double free. `str` and `copy` point to the same memory; freeing both is a double free.

**Fixed version**:
```c
char *concat_with_separator(const char *s1, const char *s2, char sep) {
    size_t size = strlen(s1) + strlen(s2) + 2;  // +1 for sep, +1 for null
    char *result = malloc(size);
    assert(result != NULL);
    strcpy(result, s1);
    result[strlen(s1)] = sep;
    strcpy(result + strlen(s1) + 1, s2);
    return result;
}

int main() {
    char *str = concat_with_separator("hello", "world", '-');
    printf("%s\n", str);
    free(str);  // Only free once
    return 0;
}
```


## Conclusion

Master these concepts:
1. **Stack**: Automatic, fast, fixed size, automatic cleanup
2. **Heap**: Manual, slower, flexible, explicit cleanup required
3. **Allocation functions**: malloc (uninitialized), calloc (zeroed), realloc (resize), strdup (string copy)
4. **free()**: Exactly once, starting address, NULL-safe
5. **13 Bug types**: Understand the intuition, definition, example, and fix for each

The key to exam success is not memorizing, but deeply understanding when to use each approach and why certain patterns lead to bugs. Trace through code carefully: What is allocated? Where? When is it freed? Do all allocations have matching frees?

Memory management is difficult because errors are often silent-they corrupt memory elsewhere. The fix is always vigilance: check malloc returns, free exactly once, use tools like Valgrind, and practice.
