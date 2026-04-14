---
title: "Pointers & Arrays — Study Guide"
date: "2026-04-14"
description: "Comprehensive guide to memory, pointers, and arrays in C for the COMP 201 midterm."
---

# COMP201 Study Guide 2: Pointers & Arrays

**A comprehensive guide to understanding memory, pointers, and arrays in C — everything you need for the midterm.**




## Introduction: Why Pointers Matter {#introduction}

Pointers are one of the most fundamental concepts in C, and they're essential for understanding how the language works. Think of a pointer like a mailbox number — it doesn't hold your mail, but it tells you exactly where to find it. In programming, pointers store memory addresses instead of values, letting you navigate memory and share data between functions.

**Key insight:** C uses **pass-by-value semantics**. This means when you pass a variable to a function, the function gets a copy, not the original. If you want a function to modify the original variable, you must pass the **address** of that variable using pointers.



## Pointers Fundamentals {#pointers-fundamentals}

### What is a Pointer?

A **pointer** is a variable that stores a memory address. That's it. A pointer doesn't know or care what type of value is at that address — it just holds the address itself.

**Analogy:** If memory is a big apartment building, a pointer is like an apartment number. The pointer doesn't live in the apartment; it just tells you where the apartment is.

### Declaring Pointers

The `*` symbol in a pointer declaration is **part of the type**, not an operator:

```c
int *p;      // p is a pointer to an int
char *str;   // str is a pointer to a char
double *d;   // d is a pointer to a double
```

Read `int *p` as "p is a pointer to an int," not "int times pointer."

### The Address-of Operator: `&`

The `&` operator gets the address of a variable:

```c
int x = 42;
int *p = &x;  // p now holds the address of x
```

This reads as: "p is a pointer to int, initialized to the address of x."

### The Dereference Operator: `*`

The `*` operator (when used on a pointer) follows the pointer to get or set the value at that address:

```c
int x = 42;
int *p = &x;
printf("%d\n", *p);  // prints 42 (follows p to get value at that address)
*p = 100;            // changes x to 100 (modifies value at address p)
```

**Key distinction:**
- `p` is the address
- `*p` is the value at that address

### NULL Pointers

A **NULL pointer** is a pointer that doesn't point anywhere — it's a special value (usually 0) that means "no address."

```c
int *p = NULL;  // p doesn't point to anything
*p = 5;         // CRASH! You can't dereference a NULL pointer
```

Always check for NULL before dereferencing:

```c
if (p != NULL) {
    printf("%d\n", *p);
}
```

### Printing Pointers

Use the `%p` format specifier to print a pointer's address:

```c
int x = 42;
int *p = &x;
printf("Address: %p\n", p);  // prints something like: Address: 0x7ffe00ff
printf("Value: %d\n", *p);   // prints: Value: 42
```

### Size of Pointers

**On 64-bit systems, every pointer is 8 bytes**, regardless of what it points to:

```c
int *p;
char *q;
double *r;
printf("%ld\n", sizeof(p));      // 8 bytes
printf("%ld\n", sizeof(q));      // 8 bytes
printf("%ld\n", sizeof(r));      // 8 bytes
```

This is a **critical exam fact** — the type a pointer points to doesn't affect the pointer's size.



## Memory Diagrams {#memory-diagrams}

Let's visualize what's happening in memory. Memory diagrams are essential for understanding pointers.

### Simple Pointer Example

```c
int x = 42;
int *p = &x;
```

Memory diagram:

```
Address:  0x1000    0x1008
Content:  42        0x1000
Variable: x         p
```

Here:
- Variable `x` is stored at address 0x1000 and contains the value 42
- Variable `p` is stored at address 0x1008 and contains 0x1000 (the address of x)
- When we write `*p`, we follow the pointer: start at p's value (0x1000), and read the value there (42)

### Modifying Through a Pointer

```c
int x = 42;
int *p = &x;
*p = 100;  // Changes x to 100
```

After the assignment:

```
Address:  0x1000    0x1008
Content:  100       0x1000
Variable: x         p
```

The pointer `p` still stores 0x1000, but now the value at that address is 100.

### Another Example with Multiple Variables

```c
int x = 42;
int y = 17;
int *p = &x;
int *q = &y;
```

Memory diagram:

```
Address:  0x1000    0x1004    0x1008    0x1010
Content:  42        17        0x1000    0x1004
Variable: x         y         p         q
```

Notice:
- `p` points to `x` (0x1000)
- `q` points to `y` (0x1004)
- `*p` gives us 42
- `*q` gives us 17



## Pointers and Parameters: Pass by Value {#pointers-and-parameters}

### The Problem: Pass by Value

C **always** passes parameters by value. This means the function receives a *copy* of the value, not the original variable:

```c
void increment(int x) {
    x++;  // Increments the COPY, not the original
}

int main() {
    int num = 5;
    increment(num);
    printf("%d\n", num);  // Still prints 5!
}
```

After calling `increment(num)`:
- The function creates a local copy of `num` (the copy starts as 5)
- It increments the copy to 6
- The copy is destroyed when the function returns
- The original `num` is still 5

### The Solution: Pass a Pointer

To let a function modify a variable, pass the address of that variable:

```c
void increment(int *x) {
    *x = *x + 1;  // Increments the VALUE at address x
}

int main() {
    int num = 5;
    increment(&num);  // Pass the address of num
    printf("%d\n", num);  // Prints 6!
}
```

Now:
- We pass the address of `num` (e.g., 0xffed)
- The function receives a copy of that address
- But both copies point to the same memory location (the original `num`)
- When we dereference with `*x`, we modify the original

### Memory Diagram: The Swap Problem

**Broken version** (doesn't work):

```c
void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}
```

Why it doesn't work: When we call `swap(x, y)`, the function receives *copies* of x and y. Swapping the copies doesn't affect the originals.

Memory during `swap(5, 10)`:

```
main's stack:           swap's stack:
Address: 0x100          Address: 0x200
Value: 5 (x)           Value: 5 (a, copy of x)
        0x104                   0x204
Value: 10 (y)          Value: 10 (b, copy of y)
```

**Correct version** (using pointers):

```c
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(&x, &y);  // Pass addresses
    printf("%d %d\n", x, y);  // Prints: 10 5
}
```

Now when we dereference `*a` and `*b`, we're working with the actual memory locations of the originals.



## Double Pointers {#double-pointers}

A **double pointer** is a pointer to a pointer. It's written as `int **pp` (read as "pp is a pointer to a pointer to int").

### What is a Double Pointer?

Think of it as a two-level indirection:
- A single pointer `*p` stores an address
- A double pointer `**pp` stores the address of a pointer

### Example

```c
int x = 5;
int *p = &x;        // p points to x
int **pp = &p;      // pp points to p
```

Memory diagram:

```
Address:  0x1000    0x1008    0x1010
Content:  5         0x1000    0x1008
Variable: x         p         pp
```

Walking through the pointers:
- `pp` contains 0x1008 (the address of p)
- `*pp` contains 0x1000 (the address of x, since pp points to p)
- `**pp` contains 5 (the value at x, since *pp points to x)

### When Do You Need Double Pointers?

The most common use is when a function needs to **modify a pointer variable**. For example, allocating memory in a function:

```c
void allocateArray(int **arr, int size) {
    *arr = (int *)malloc(size * sizeof(int));
    // *arr now points to the allocated memory
}

int main() {
    int *myArray;
    allocateArray(&myArray, 10);  // Pass address of the pointer
    // Now myArray points to dynamically allocated memory
    free(myArray);
}
```

Why this works:
- We pass `&myArray` (the address of the pointer)
- Inside the function, `arr` is a pointer to `myArray`
- When we assign `*arr = ...`, we're modifying the original `myArray`

### Dereferencing Double Pointers

When you have `int **pp`:
- `pp` is the address of a pointer
- `*pp` is the pointer itself (one level of dereferencing)
- `**pp` is the value (two levels of dereferencing)

```c
int x = 5;
int *p = &x;
int **pp = &p;

printf("%p\n", pp);   // Address of p (e.g., 0x1008)
printf("%p\n", *pp);  // Value of p, which is address of x (e.g., 0x1000)
printf("%d\n", **pp); // Value at address *pp, which is x (5)
```

### Complex Double Pointer Expressions

The key to reading these is to work **from right to left**:

```c
int **pp = ...;
int val = **pp;        // Dereference twice
int *q = *pp;          // Dereference once, get a pointer
pp++;                  // Move pp itself forward (pointer to pointer arithmetic)
(*pp)++;               // Increment the pointer that pp points to
(**pp)++;              // Increment the value that *pp points to
```



## Arrays in Memory {#arrays-in-memory}

### Arrays Are Contiguous Memory

When you declare an array, the compiler allocates a **contiguous block of memory**:

```c
int arr[5];  // Allocates 5 * 4 = 20 bytes (assuming 4-byte ints)
```

Memory diagram:

```
Address:  0x1000   0x1004   0x1008   0x100C   0x1010
Index:    [0]      [1]      [2]      [3]      [4]
Content:  ???      ???      ???      ???      ???
```

Each element is 4 bytes apart (because `sizeof(int) == 4`).

### Arrays as Pointers

Here's a crucial fact: **an array name is a pointer to its first element**. You can't reassign this pointer, but you can treat it like one:

```c
int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;  // arr automatically converts to a pointer to arr[0]
```

This is **equivalent** to:

```c
int arr[5] = {10, 20, 30, 40, 50};
int *p = &arr[0];  // Explicitly take address of first element
```

### Key Difference: Arrays vs Pointers

**Arrays** are NOT pointer variables:

```c
int arr[5] = {1, 2, 3, 4, 5};
arr = someOtherArray;  // COMPILE ERROR! Can't reassign array name
arr++;                 // COMPILE ERROR! Can't increment array name
```

**Pointers** are variables:

```c
int *p = arr;
p = someOtherArray;  // OK! Pointers can be reassigned
p++;                 // OK! Pointers can be incremented
```

### Size of Arrays vs Pointers

This is a **critical exam trap**:

```c
int arr[5];
int *p = arr;

printf("%ld\n", sizeof(arr));  // 20 (5 elements * 4 bytes each)
printf("%ld\n", sizeof(p));    // 8 (pointer size on 64-bit system)
```

When you pass an array to a function, it **decays to a pointer**:

```c
void printArray(int arr[]) {
    printf("%ld\n", sizeof(arr));  // 8, NOT the array size!
                                   // arr has decayed to a pointer
}

int main() {
    int arr[5];
    printArray(arr);  // arr decays to int *
}
```



## Pointer-Array Equivalence {#pointer-array-equivalence}

### Array Indexing is Pointer Arithmetic

The fundamental equivalence in C:

```c
arr[i] == *(arr + i)
```

These two expressions are **exactly the same**:

```c
int arr[5] = {10, 20, 30, 40, 50};
printf("%d\n", arr[2]);       // prints 30
printf("%d\n", *(arr + 2));   // also prints 30
```

### How Pointer Arithmetic Works

When you do `arr + i`, the compiler adds `i * sizeof(element)` bytes:

```c
int arr[5] = {10, 20, 30, 40, 50};
// Assume arr starts at 0x1000

arr + 0  // 0x1000 (0 * 4)
arr + 1  // 0x1004 (1 * 4)
arr + 2  // 0x1008 (2 * 4)
arr + 3  // 0x100C (3 * 4)
arr + 4  // 0x1010 (4 * 4)
```

### Using Pointers for Array Access

You can use any pointer like an array:

```c
int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;

printf("%d\n", p[0]);  // 10
printf("%d\n", p[1]);  // 20
printf("%d\n", p[2]);  // 30
```

This works because array indexing `p[i]` is automatically converted to `*(p + i)`.

### Negative Indexing

You can even use negative indices with pointers:

```c
int arr[5] = {10, 20, 30, 40, 50};
int *p = &arr[3];  // Point to arr[3] (40)

printf("%d\n", p[0]);   // 40 (arr[3])
printf("%d\n", p[1]);   // 50 (arr[4])
printf("%d\n", p[-1]);  // 30 (arr[2]) — VALID!
printf("%d\n", p[-2]);  // 20 (arr[1]) — VALID!
printf("%d\n", p[-3]);  // 10 (arr[0]) — VALID!
```

This is valid as long as you don't go out of bounds. Exam questions love this!



## Pointer Arithmetic {#pointer-arithmetic}

### Adding Integers to Pointers

When you add an integer `n` to a pointer, the pointer advances by `n * sizeof(element)` bytes:

```c
int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;

p + 0  // Points to arr[0]
p + 1  // Points to arr[1]
p + 2  // Points to arr[2]
```

### Char Pointer Arithmetic (Byte-Level)

With `char *`, arithmetic moves 1 byte at a time:

```c
char str[10] = "hello";
char *p = str;

*(p + 0)  // 'h'
*(p + 1)  // 'e'
*(p + 2)  // 'l'
```

This is why `char *` is often used for generic byte-level memory operations.

### Pointer Subtraction

You can subtract two pointers to find the number of elements between them:

```c
int arr[5] = {10, 20, 30, 40, 50};
int *p = &arr[1];
int *q = &arr[4];

int diff = q - p;  // 3 (not 12 bytes, but 3 elements)
```

**Important:** Subtraction gives the number of elements, not bytes. This is different from addition!

### Practical Example: Pointer Arithmetic

```c
int arr[6] = {4, 8, 15, 16, 23, 42};
int *p = arr;

// These are all equivalent:
printf("%d\n", arr[2]);      // 15
printf("%d\n", *(arr + 2));  // 15
printf("%d\n", p[2]);        // 15
printf("%d\n", *(p + 2));    // 15

// Moving the pointer
p = arr + 3;
printf("%d\n", *p);          // 16
p++;
printf("%d\n", *p);          // 23
```



## Arrays of Pointers {#arrays-of-pointers}

### What is an Array of Pointers?

An **array of pointers** is an array where each element is a pointer:

```c
char *words[5];  // Array of 5 char pointers (e.g., 5 strings)
int *ptrs[10];   // Array of 10 int pointers
```

### Common Use: Array of Strings

```c
char *words[3] = {
    "apple",
    "banana",
    "cherry"
};
```

Memory diagram:

```
words array (on stack):
words[0]: 0x2000 > 'a' 'p' 'p' 'l' 'e' '\0' (data segment)
words[1]: 0x3000 > 'b' 'a' 'n' 'a' 'n' 'a' '\0' (data segment)
words[2]: 0x4000 > 'c' 'h' 'e' 'r' 'r' 'y' '\0' (data segment)
```

Each element of the array is a pointer. The actual strings live in read-only memory (data segment).

### Accessing Elements

```c
char *words[3] = {"apple", "banana", "cherry"};

printf("%s\n", words[0]);      // apple
printf("%c\n", words[0][0]);   // a (first char of first string)
printf("%c\n", words[1][2]);   // n (third char of "banana")
```

### argc/argv: Command-Line Arguments

The classic example is the `main` function:

```c
int main(int argc, char *argv[])
```

Here:
- `argc` is the number of arguments
- `argv` is an array of strings (char pointers)
- `argv[0]` is the program name
- `argv[1]`, `argv[2]`, etc. are the actual arguments

Example run:

```bash
./myprogram hello world
```

Inside main:
- `argc` is 3
- `argv[0]` is "./myprogram"
- `argv[1]` is "hello"
- `argv[2]` is "world"



## Strings in Memory {#strings-in-memory}

### What is a String in C?

A string in C is just characters stored in memory, ending with a **null terminator** (`'\0'`). The null terminator is how C knows when the string ends.

Memory representation of "hello":

```
Address:  0x1000   0x1001   0x1002   0x1003   0x1004   0x1005
Content:  'h'      'e'      'l'      'l'      'o'      '\0'
```

### Stack Strings (Modifiable)

When you create a string with `char[]`, it lives on the stack and you own it:

```c
char str[6] = "hello";  // Allocates 6 bytes on stack
str[0] = 'H';           // OK! You can modify it
printf("%s\n", str);    // Hllo
```

Memory diagram:

```
STACK:
Address:  0x7ffd   0x7ffe   0x7fff   0x8000   0x8001   0x8002
Content:  'H'      'e'      'l'      'l'      'o'      '\0'
Variable: str[0]   str[1]   str[2]   str[3]   str[4]   str[5]
```

### String Literals (Read-Only)

When you create a pointer to a string literal, it points to read-only memory (data segment):

```c
char *str = "hello";  // Points to string constant
str[0] = 'H';         // CRASH! Segmentation fault
```

Memory diagram:

```
STACK:                        DATA SEGMENT:
Address:  0x7ffd             Address:  0x2000
Content:  0x2000             Content:  'h' 'e' 'l' 'l' 'o' '\0'
Variable: str                Variable: string constant
```

### Key String Behaviors

1. **`char []` (array):** You own the memory, you can modify it. Cannot reassign.
2. **`char *` (pointer to literal):** Points to read-only memory. Cannot modify. Can reassign.
3. **`char *` (pointer to stack array):** Points to stack memory you own. Can modify. Can reassign.

Example:

```c
char buf[10];
strcpy(buf, "hello");      // OK! buf is stack memory
char *str = buf;
str[0] = 'H';              // OK! Modifying stack memory
str = "world";             // OK! str is reassigned
str[0] = 'W';              // CRASH! "world" is a string literal
```

### Strings as Parameters

When you pass a `char *` to a function, the function sees the same memory:

```c
void modifyString(char *str) {
    str[0] = 'X';
}

int main() {
    char buf[10] = "hello";
    modifyString(buf);
    printf("%s\n", buf);  // Xello
}
```

Changes in the function persist because both the caller and the function point to the same memory.



## Practice Problems {#practice-problems}

### Problem 1: Memory Diagram Tracing

**Question:** Trace through this code and draw the memory state after each line. What is the final output?

```c
int x = 10;
int y = 20;
int *p = &x;
int *q = &y;
*p = 15;
p = q;
*p = 25;
printf("%d %d\n", x, y);
```

**Solution:**

Line by line:

```c
int x = 10;      // x @ 0x100 = 10
int y = 20;      // y @ 0x104 = 20
int *p = &x;     // p @ 0x108 = 0x100
int *q = &y;     // q @ 0x110 = 0x104
```

Memory state after declarations:

```
Address:  0x100   0x104   0x108   0x110
Content:  10      20      0x100   0x104
Variable: x       y       p       q
```

Continuing:

```c
*p = 15;         // x = 15 (dereference p, which points to x)
```

Memory after `*p = 15`:

```
Address:  0x100   0x104   0x108   0x110
Content:  15      20      0x100   0x104
Variable: x       y       p       q
```

```c
p = q;           // p is reassigned to point to y
```

Memory after `p = q`:

```
Address:  0x100   0x104   0x108   0x110
Content:  15      20      0x104   0x104
Variable: x       y       p       q
```

```c
*p = 25;         // y = 25 (dereference p, which now points to y)
```

Memory after `*p = 25`:

```
Address:  0x100   0x104   0x108   0x110
Content:  15      25      0x104   0x104
Variable: x       y       p       q
```

**Final Output:** `15 25`



### Problem 2: Double Pointer Tracing

**Question:** What does this code print?

```c
int a = 5;
int *b = &a;
int **c = &b;
*b = 10;
**c = 20;
(*b)++;
printf("%d %d %d\n", a, *b, **c);
```

**Solution:**

Line by line:

```c
int a = 5;
int *b = &a;      // b points to a
int **c = &b;     // c points to b
```

Memory state:

```
Address:  0x100   0x108   0x110
Content:  5       0x100   0x108
Variable: a       b       c
```

Continuing:

```c
*b = 10;          // Follow b to get a, set a = 10
```

Memory:

```
Address:  0x100   0x108   0x110
Content:  10      0x100   0x108
Variable: a       b       c
```

```c
**c = 20;         // Follow c to b, then follow b to a, set a = 20
```

Memory:

```
Address:  0x100   0x108   0x110
Content:  20      0x100   0x108
Variable: a       b       c
```

```c
(*b)++;           // Follow b to get a, increment a to 21
```

Memory:

```
Address:  0x100   0x108   0x110
Content:  21      0x100   0x108
Variable: a       b       c
```

**Final Output:** `21 21 21`

All three expressions evaluate to the same value because:
- `a` is 21
- `*b` is 21 (b points to a)
- `**c` is 21 (c points to b, which points to a)



### Problem 3: Pointer Arithmetic

**Question:** Given this array and pointers, evaluate each expression:

```c
int arr[] = {4, 8, 15, 16, 23, 42};
int *p = arr;
int *q = &arr[3];
```

Evaluate:
1. `arr[2]`
2. `*(p + 2)`
3. `*(arr + 4)`
4. `q[-1]`
5. `*(q + 1)`
6. `q - p`

**Solution:**

Memory diagram (assuming arr starts at 0x1000):

```
Address:  0x1000   0x1004   0x1008   0x100C   0x1010   0x1014
Index:    [0]      [1]      [2]      [3]      [4]      [5]
Content:  4        8        15       16       23       42
```

Pointer positions:
- `p = 0x1000` (points to arr[0])
- `q = 0x100C` (points to arr[3])

Evaluating:

1. `arr[2]` = `15` (array indexing)
2. `*(p + 2)` = `*(0x1000 + 2*4)` = `*(0x1008)` = `15`
3. `*(arr + 4)` = `*(0x1000 + 4*4)` = `*(0x1010)` = `23`
4. `q[-1]` = `*(q - 1)` = `*(0x100C - 4)` = `*(0x1008)` = `15`
5. `*(q + 1)` = `*(0x100C + 4)` = `*(0x1010)` = `23`
6. `q - p` = `(0x100C - 0x1000) / 4` = `3` (number of elements, not bytes)



### Problem 4: Find and Fix the Bug

**Question:** This function is supposed to increment a number, but it doesn't work. Find the bug and fix it.

```c
void increment(int x) {
    x = x + 1;
}

int main() {
    int num = 5;
    increment(num);
    printf("%d\n", num);  // Prints 5, should print 6!
}
```

**Problem:** The function receives a *copy* of `num`, not the original. Incrementing the copy doesn't affect the original.

**Fix:** Pass a pointer to the variable:

```c
void increment(int *x) {
    *x = *x + 1;  // Dereference to modify the original
}

int main() {
    int num = 5;
    increment(&num);  // Pass the address
    printf("%d\n", num);  // Now prints 6!
}
```

**Explanation:**
- In the broken version, `increment(num)` passes 5 (the value)
- In the fixed version, `increment(&num)` passes the address of `num`
- Inside the function, `*x` dereferences the pointer to modify the actual `num`



## Common Exam Traps {#common-exam-traps}

### Trap 1: sizeof(array) vs sizeof(pointer)

```c
int arr[10];
int *p = arr;

sizeof(arr);  // 40 (10 * 4 bytes) — THE SIZE OF THE ARRAY
sizeof(p);    // 8 (pointer size) — ALWAYS 8 on 64-bit systems
```

When passed to a function, arrays decay to pointers:

```c
void func(int arr[]) {
    sizeof(arr);  // 8, NOT 40! The array has decayed to a pointer
}
```

### Trap 2: Array Names Are Not Assignable

```c
int arr[5];
int other[5];
arr = other;   // COMPILE ERROR!
arr++;          // COMPILE ERROR!
```

Array names refer to fixed blocks of memory; they can't be reassigned.

### Trap 3: Returning Pointers to Local Variables

```c
int *makeArray() {
    int arr[5] = {1, 2, 3, 4, 5};
    return arr;  // DANGEROUS! arr is on the stack
}

int main() {
    int *p = makeArray();
    printf("%d\n", *p);  // p points to deallocated memory (dangling pointer)
}
```

The array `arr` is local to `makeArray`. When the function returns, the stack frame is destroyed, and `arr` no longer exists. The pointer is **dangling**.

**Fix:** Allocate on the heap:

```c
int *makeArray() {
    int *arr = (int *)malloc(5 * sizeof(int));
    arr[0] = 1;
    arr[1] = 2;
    // ... etc
    return arr;  // OK! Memory persists
}
```

### Trap 4: Off-by-One in Pointer Arithmetic

```c
char str[6] = "hello";  // Includes null terminator
char *p = str;

p + 5;   // Points to the null terminator
p + 6;   // OUT OF BOUNDS!
```

Array bounds:
```
Address:  0x100   0x101   0x102   0x103   0x104   0x105
Content:  'h'     'e'     'l'     'l'     'o'     '\0'
Index:    [0]     [1]     [2]     [3]     [4]     [5]
```

Valid pointers: `p + 0` through `p + 5`. Accessing `p + 6` is undefined behavior.

### Trap 5: `*p++` vs `(*p)++`

These are different!

```c
int arr[3] = {10, 20, 30};
int *p = arr;

*p++;       // Same as *(p++), increments p, then dereferences
            // Because ++ has higher precedence, binds tighter

(*p)++;     // Increments the value p points to
```

Example:

```c
int arr[3] = {10, 20, 30};
int *p = arr;

(*p)++;     // Increments arr[0] to 11, p still points to arr[0]
*p++;       // Returns arr[0], then p moves to arr[1]
```

### Trap 6: String Literals vs Arrays

```c
char *str = "hello";      // Points to read-only memory
str[0] = 'H';             // CRASH!

char str2[6] = "hello";   // Array on stack
str2[0] = 'H';            // OK!
```

String literals (`"hello"`) are const. Pointers to them point to read-only memory.

### Trap 7: Pointer Size is Independent of Type

A common misconception:

```c
int *p;       // sizeof(p) == 8
char *q;      // sizeof(q) == 8
double *r;    // sizeof(r) == 8
```

**All pointers are 8 bytes on 64-bit systems**, regardless of what they point to. The type only matters for arithmetic.

### Trap 8: NULL Check Before Dereferencing

```c
int *p = NULL;
printf("%d\n", *p);  // CRASH! Dereferencing NULL is undefined
```

Always check:

```c
int *p = NULL;
if (p != NULL) {
    printf("%d\n", *p);
}
```

A safe pattern:

```c
if (p == NULL) {
    // Handle error
    return;
}
// Use p safely
```



## Final Summary

**Key Takeaways:**

1. **Pointers store addresses**, not values.
2. **`&` gets the address**, `*` dereferences (follows the pointer).
3. **C is always pass-by-value**; use pointers to modify original variables.
4. **Double pointers** are pointers to pointers; use when a function needs to modify a pointer.
5. **Arrays are contiguous memory**; the array name is a pointer to the first element.
6. **Array indexing and pointer arithmetic are equivalent**: `arr[i] == *(arr + i)`.
7. **Pointer arithmetic scales by element size**: `p + i` moves `i * sizeof(*p)` bytes.
8. **Watch your memory locations**: strings in the data segment are read-only; stack arrays you own.
9. **Sizes matter for exams**: `sizeof(arr)` is the total size; `sizeof(ptr)` is always 8 on 64-bit systems.
10. **Arrays decay to pointers** when passed to functions.

Good luck with your midterm!
