---
title: "Advanced C — void*, Generics, Function Pointers, and Structs"
date: "2026-04-14"
description: "Comprehensive guide to advanced C topics including void pointers, generics, function pointers, and structs for COMP 201."
---

# Guide 4: Advanced C — void*, Generics, Function Pointers, const, and Structs

> **Course:** COMP201: Computer Systems & Programming — Koç University
>
> These notes are written to be **self-contained**: you should be able to master every
> concept from scratch just by reading them. This guide covers the advanced C topics
> you'll need for your midterm exam and beyond.

---


## 1. Introduction: Why Advanced C?

When you first learned C, you worked with familiar types: `int`, `double`, `char`. Each type had its own functions and operations. But what happens when you want to write a sorting function that works for *any* type? Or a data structure that can hold *any* kind of object?

This is where advanced C comes in. The topics in this guide—void pointers, function pointers, const qualifiers, and structures—are the tools that let you write **generic, flexible code** that works across different types and use cases. They're also the concepts that trip up students on exams, so we'll be thorough.

Here's the big picture: In C, there's no built-in concept of generics like in Java or C++. There's no `template<typename T>`. Instead, C gives you powerful, low-level tools to build that genericity yourself. This guide teaches you how to use those tools correctly and confidently.

---

## 2. void Pointers and Generic Programming

### 2.1 What is a void Pointer?

Imagine you're writing a library that needs to work with data of *any* type. You have integers, characters, structs—you name it. How do you write a function that accepts all of them?

A **void pointer** (`void*`) is C's answer. It's a pointer that doesn't know—or doesn't care—what type of data it points to. When you declare `void *ptr;`, you're saying: "This pointer can point to any type of data. I'll figure out what it actually points to at runtime."

Here's the formal definition:

- A `void*` pointer can be assigned a value from any pointer type without an explicit cast.
- Conversely, any pointer type can be converted to `void*` without an explicit cast.
- However, before you *use* a `void*` pointer (read from it, write to it), you must **cast it to a specific pointer type**.

Why? Because the compiler needs to know how many bytes to read. If `ptr` is `void*` and points to an integer, the compiler can't read from it directly—it doesn't know if the integer is 2 bytes, 4 bytes, or 8 bytes. You must cast it first: `int value = *(int*)ptr;`

### 2.2 Syntax: Declaring and Using void Pointers

```c
void *ptr;                    // Declare a void pointer
int x = 42;
ptr = &x;                     // Assign int pointer to void* (no cast needed)

int *int_ptr = (int*)ptr;    // Cast void* to int* to use it
int value = *(int*)ptr;      // Dereference: cast and dereference in one line

char buffer[100];
ptr = buffer;                 // Assign char array to void* (no cast needed)
char *ch = (char*)ptr;       // Now treat it as char*
```

The key insight: **assignment to void* is easy, but usage requires explicit casting**.

### 2.3 Why void Pointers? Intuition

Think of a void pointer as a **labeled storage box**. The box doesn't care what's inside—a book, a toy, a coin. The box just stores the address. But when you want to actually *use* what's inside, you need to look at the label (the cast) to know how to treat it.

Real-world example: Imagine a generic mailbox system that delivers mail to addresses worldwide. The mailbox doesn't care what's inside each envelope—it just needs the address. But when you retrieve your mail, you need to know whether you're getting a letter (read it as text), a photo (look at it as an image), or a package (handle it carefully). The void pointer is like the address; the cast is like understanding what kind of mail you have.

### 2.4 Example: Swapping Any Two Values

Let's say you want to write a function that swaps two integers. Easy:

```c
void swap_int(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
```

But what if tomorrow you need to swap two doubles? You'd write another function. And then doubles in a different format... This doesn't scale.

With void pointers, you can write one function that swaps *any* two values of the *same size*:

```c
void swap(void *a, void *b, size_t size) {
    // Create a temporary buffer to hold one element
    char *temp = malloc(size);

    // Copy size bytes from a to temp
    memcpy(temp, a, size);

    // Copy size bytes from b to a
    memcpy(a, b, size);

    // Copy size bytes from temp to b
    memcpy(b, temp, size);

    free(temp);
}
```

**Why does this work?**

- `memcpy(dest, src, size)` copies `size` bytes from `src` to `dest`. It doesn't care what type the data is—it just moves raw bytes.
- We treat `a` and `b` as `void*` pointers (they can point to anything).
- We copy 3 times: `a` → `temp`, `b` → `a`, `temp` → `b`. The result is a swap.
- `size` tells us how many bytes to copy. For `int`, it's `sizeof(int)` (usually 4). For `double`, it's `sizeof(double)` (usually 8).

**Using the function:**

```c
int x = 5, y = 10;
swap(&x, &y, sizeof(int));
// x is now 10, y is now 5

double a = 3.14, b = 2.71;
swap(&a, &b, sizeof(double));
// a is now 2.71, b is now 3.14
```

**Key point:** The function never cares what types x, y, a, b actually are. It just moves bytes around. This is the power of void pointers—you write the function once, and it works for any type.

### 2.5 memcpy vs. memmove

Both functions copy bytes, but they handle overlapping memory differently.

- **`memcpy(dest, src, n)`**: Copies `n` bytes from `src` to `dest`. If the regions overlap, behavior is undefined. Use this when you're sure `dest` and `src` don't overlap.

- **`memmove(dest, src, n)`**: Also copies `n` bytes, but handles overlapping regions correctly. If regions overlap, it copies in the right direction to avoid corruption. Use this when you're not sure about overlap.

**Example:**

```c
int arr[] = {1, 2, 3, 4, 5};

// Shift elements right: arr[1..4] becomes arr[2..5]
// This overlaps! The source (arr+1) and dest (arr+2) overlap
memmove(arr + 2, arr + 1, 4 * sizeof(int));
// Result: {1, 1, 2, 3, 4}

// If we used memcpy here, the result would be unpredictable
// because of the overlap.
```

**When to use what:**
- Overlapping regions → always use `memmove`
- Non-overlapping → either works, but `memcpy` can be slightly faster
- If unsure → use `memmove` to be safe

### 2.6 Why You Can't Dereference void*

Here's a common mistake:

```c
void *ptr = malloc(10);
int x = *ptr;  // COMPILE ERROR
```

This won't compile. The compiler doesn't know how many bytes to read from `ptr`. Is it 1 byte (char)? 4 bytes (int)? 8 bytes (long)? You must tell it by casting:

```c
void *ptr = malloc(10);
int x = *(int*)ptr;  // OK: cast to int*, then dereference
char c = *(char*)ptr;  // OK: cast to char*, then dereference
```

The cast tells the compiler "treat the bytes at this address as an integer" or "as a character". Then it knows exactly how many bytes to read.

---

## 3. Generics: Writing Type-Agnostic Code

### 3.1 What Are Generics in C?

In Java, you write `ArrayList<Integer>` and the type system ensures type safety. C doesn't have that. But C lets you build genericity manually using void pointers and function pointers. When done right, your code works for any type.

**Generics in C means:** A single function or data structure that works correctly for many different types of data.

### 3.2 Generic Bubble Sort

Let's build a classic: a generic bubble sort that works for any array of any type.

**The idea:**
- You have an array of unknown type: `void *arr`
- You know how many elements: `int n`
- You know the size of each element in bytes: `int elem_size_bytes`
- You have a comparison function that tells you whether two elements should be swapped: `int (*compar)(void*, void*)`

The comparison function is key. You call it to compare two elements; it returns:
- A negative value if the first element is "less than" the second
- Zero if they're equal
- A positive value if the first is "greater than" the second

**Pseudocode:**

```
FUNCTION bubble_sort(arr, n, elem_size, compar)
    FOR i = 0 TO n-1
        FOR j = 0 TO n-i-2
            a = address of element at index j
            b = address of element at index j+1
            IF compar(a, b) > 0
                swap a and b using memcpy and temp buffer
            END IF
        END FOR
    END FOR
END FUNCTION
```

**C Implementation:**

```c
void bubble_sort(void *arr, int n, int elem_size_bytes,
                 int (*compar)(void *, void *)) {
    char *base = (char *)arr;  // Cast to char* for pointer arithmetic

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            // Compute addresses of elements at indices j and j+1
            void *elem_j = base + j * elem_size_bytes;
            void *elem_j_plus_1 = base + (j + 1) * elem_size_bytes;

            // Compare them
            if (compar(elem_j, elem_j_plus_1) > 0) {
                // Swap using memcpy
                char *temp = malloc(elem_size_bytes);
                memcpy(temp, elem_j, elem_size_bytes);
                memcpy(elem_j, elem_j_plus_1, elem_size_bytes);
                memcpy(elem_j_plus_1, temp, elem_size_bytes);
                free(temp);
            }
        }
    }
}
```

**Why the cast to char*?**

Pointer arithmetic: if `ptr` is `int*` and you do `ptr + 1`, you move forward by `sizeof(int)` bytes (usually 4). But we don't know the actual type, so we can't use normal pointer arithmetic. We cast to `char*` because `char` is 1 byte, so `(char*)ptr + k` moves forward by exactly `k` bytes. Then we can calculate element addresses as `base + j * elem_size_bytes`.

**Example: Sorting integers**

```c
// Comparison function for integers
int compare_int(void *a, void *b) {
    int val_a = *(int *)a;
    int val_b = *(int *)b;

    if (val_a < val_b) return -1;
    if (val_a > val_b) return 1;
    return 0;
}

int main() {
    int arr[] = {5, 2, 8, 1, 9};
    int n = 5;

    bubble_sort(arr, n, sizeof(int), compare_int);

    // arr is now {1, 2, 5, 8, 9}
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}
```

**Example: Sorting strings (char pointers)**

```c
int compare_string(void *a, void *b) {
    char *str_a = *(char **)a;  // a points to a char* element
    char *str_b = *(char **)b;
    return strcmp(str_a, str_b);
}

int main() {
    char *words[] = {"zebra", "apple", "banana"};
    int n = 3;

    bubble_sort(words, n, sizeof(char*), compare_string);
    // words is now {"apple", "banana", "zebra"}

    return 0;
}
```

**Note the double dereference in compare_string:** The array `words` contains pointers to strings. When `bubble_sort` passes the address of an element (e.g., `&words[0]`), it's passing a pointer to a `char*`. So in the comparison function, you dereference once to get the `char*`, then dereference again if you need the actual character.

### 3.3 Generic Stack Implementation

Let's implement a simple stack that can hold any type of data:

```c
typedef struct {
    void *data;        // Array of elements
    int size;          // Current number of elements
    int capacity;      // Total space allocated
    int elem_size;     // Size of one element in bytes
} GenericStack;

// Initialize an empty stack
GenericStack* stack_create(int capacity, int elem_size) {
    GenericStack *s = malloc(sizeof(GenericStack));
    s->data = malloc(capacity * elem_size);
    s->size = 0;
    s->capacity = capacity;
    s->elem_size = elem_size;
    return s;
}

// Push an element onto the stack
void stack_push(GenericStack *s, void *element) {
    if (s->size >= s->capacity) {
        // Resize: double capacity
        s->capacity *= 2;
        s->data = realloc(s->data, s->capacity * s->elem_size);
    }
    // Copy element into the stack
    void *dest = (char *)s->data + s->size * s->elem_size;
    memcpy(dest, element, s->elem_size);
    s->size++;
}

// Pop an element from the stack
void stack_pop(GenericStack *s, void *dest) {
    if (s->size > 0) {
        s->size--;
        void *src = (char *)s->data + s->size * s->elem_size;
        memcpy(dest, src, s->elem_size);
    }
}

// Cleanup
void stack_free(GenericStack *s) {
    free(s->data);
    free(s);
}
```

**Usage example: Stack of integers**

```c
int main() {
    GenericStack *s = stack_create(10, sizeof(int));

    int a = 5, b = 10, c = 15;
    stack_push(s, &a);
    stack_push(s, &b);
    stack_push(s, &c);

    int popped;
    stack_pop(s, &popped);
    printf("%d\n", popped);  // Prints 15

    stack_free(s);
    return 0;
}
```

The beauty here is the same stack works for doubles, structs, or anything else—just call `stack_create` with the appropriate `elem_size`.

### 3.4 Writing Predicates: Generic Filtering

A **predicate** is a function that returns true or false for a given element. You can use predicates to filter arrays generically.

```c
// Predicate type: function that takes a void* and returns int (0 = false, nonzero = true)
typedef int (*Predicate)(void *);

// Count how many elements satisfy the predicate
int count_matches(void *arr, int n, int elem_size, Predicate pred) {
    int count = 0;
    char *base = (char *)arr;

    for (int i = 0; i < n; i++) {
        void *elem = base + i * elem_size;
        if (pred(elem)) {
            count++;
        }
    }

    return count;
}

// Example predicate: is the integer even?
int is_even(void *element) {
    int val = *(int *)element;
    return val % 2 == 0;
}

int main() {
    int numbers[] = {1, 2, 3, 4, 5, 6};
    int n = 6;

    int even_count = count_matches(numbers, n, sizeof(int), is_even);
    printf("Even numbers: %d\n", even_count);  // Prints 3

    return 0;
}
```

This pattern—passing a predicate function—is foundational for generic data processing in C.

---

## 4. Function Pointers

### 4.1 What Are Function Pointers?

A **function pointer** is a variable that stores the address of a function. In C, functions are just code sitting in memory at a certain address. You can get that address and call the function through a pointer.

**Intuition:** If variables are post offices and values are the mail, then function pointers are like business cards with a phone number. Instead of going to the office in person, you call the number (invoke the pointer) and the function executes remotely.

### 4.2 Declaring Function Pointers

The syntax is a bit tricky, so let's go slowly.

**Basic function:**

```c
int add(int a, int b) {
    return a + b;
}
```

**Function pointer that can point to add:**

```c
int (*func_ptr)(int, int);
```

Let's parse this:
- `func_ptr` is a pointer (the `*` tells you that)
- It points to a function that takes two `int` arguments and returns an `int`
- The parentheses around `*func_ptr` are crucial—they group the pointer declaration

**Assigning a function to the pointer:**

```c
func_ptr = add;        // Assign the function
func_ptr = &add;       // Also OK: explicitly take the address
```

In C, a function name automatically decays to a function pointer, so both work. By convention, most people just write `func_ptr = add;`

**Calling through the pointer:**

```c
int result = func_ptr(3, 5);     // Dereference and call: result = 8
int result = (*func_ptr)(3, 5);  // Also OK: explicit dereference
```

Both syntaxes work. The first is more common.

### 4.3 Arrays of Function Pointers

You can create arrays where each element is a function pointer:

```c
// Array of 5 function pointers, each pointing to a function of type:
//   void func(void)
void (*func_array[5])(void);

// or

// Array of 3 function pointers, each pointing to a function of type:
//   char* func(char*, char*)
char* (*string_ops[3])(char *, char *);
```

This is useful when you want to dispatch to different functions based on input.

**Example: A calculator with operation pointers**

```c
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }
int div(int a, int b) { return (b != 0) ? a / b : 0; }

int main() {
    // Array of function pointers
    int (*ops[4])(int, int) = {add, sub, mul, div};

    // Use them
    printf("%d\n", ops[0](10, 5));  // Calls add: 15
    printf("%d\n", ops[1](10, 5));  // Calls sub: 5
    printf("%d\n", ops[2](10, 5));  // Calls mul: 50
    printf("%d\n", ops[3](10, 5));  // Calls div: 2

    return 0;
}
```

### 4.4 Typedef for Function Pointers

Declaring function pointers is verbose. Use typedef to create an alias:

```c
// Define a type "Comparator" as: pointer to function taking two void*
typedef int (*Comparator)(void *, void *);
```

Now instead of writing `int (*compar)(void*, void*)` every time, you just write `Comparator compar`. Much cleaner.

**Full example with typedef:**

```c
typedef int (*Comparator)(void *, void *);

int compare_int(void *a, void *b) {
    int val_a = *(int *)a;
    int val_b = *(int *)b;
    return val_a - val_b;
}

void bubble_sort(void *arr, int n, int elem_size, Comparator compar) {
    // ... (same as before)
}

int main() {
    int arr[] = {5, 2, 8, 1};
    bubble_sort(arr, 4, sizeof(int), compare_int);
    return 0;
}
```

Much more readable.

### 4.5 Comparator Functions and qsort

The C standard library provides `qsort` (quicksort), which is the professional way to sort:

```c
#include <stdlib.h>

void qsort(void *base, size_t nmemb, size_t size,
           int (*compar)(const void *, const void *));
```

- `base`: pointer to the array
- `nmemb`: number of elements
- `size`: size of each element in bytes
- `compar`: comparison function

**Important:** The comparison function takes `const void*` arguments (you can't modify them in the function).

**Example: Sorting integers with qsort**

```c
int compare_int(const void *a, const void *b) {
    int val_a = *(const int *)a;
    int val_b = *(const int *)b;
    return val_a - val_b;
}

int main() {
    int arr[] = {5, 2, 8, 1, 9};
    qsort(arr, 5, sizeof(int), compare_int);

    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    // Output: 1 2 5 8 9
    return 0;
}
```

**Example: Sorting strings**

```c
int compare_string(const void *a, const void *b) {
    const char *str_a = *(const char **)a;
    const char *str_b = *(const char **)b;
    return strcmp(str_a, str_b);
}

int main() {
    char *words[] = {"dog", "cat", "ant", "bear"};
    qsort(words, 4, sizeof(char*), compare_string);

    for (int i = 0; i < 4; i++) {
        printf("%s ", words[i]);
    }
    // Output: ant bear cat dog
    return 0;
}
```

### 4.6 bsearch: Binary Search with Comparators

Once your array is sorted, use `bsearch` for fast searching:

```c
#include <stdlib.h>

void *bsearch(const void *key, const void *base, size_t nmemb, size_t size,
              int (*compar)(const void *, const void *));
```

Returns a pointer to the found element, or `NULL` if not found.

**Example:**

```c
int main() {
    int arr[] = {1, 2, 5, 8, 9};  // Must be sorted!

    int target = 5;
    int *result = (int *)bsearch(&target, arr, 5, sizeof(int), compare_int);

    if (result != NULL) {
        printf("Found %d\n", *result);
    } else {
        printf("Not found\n");
    }
    return 0;
}
```

### 4.7 Spring 2021 Exam Pattern: Function Pointer Arrays

A common exam question: Given an array of function pointers, and an array of data, write code to apply a filter.

**Example scenario:**

```c
// Suppose we have predicates (filters) that select certain integers
int is_even(void *elem) {
    return (*(int *)elem) % 2 == 0;
}

int is_positive(void *elem) {
    return (*(int *)elem) > 0;
}

int is_square(void *elem) {
    int val = *(int *)elem;
    int sq = (int)sqrt(val);
    return sq * sq == val;
}

// Array of predicates
typedef int (*Predicate)(void *);
Predicate filters[3] = {is_even, is_positive, is_square};

// Apply a filter
int main() {
    int numbers[] = {1, 2, 3, 4, 5, 6, 9, 16};
    int n = 8;

    // Count matches for filter 0 (is_even)
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (filters[0](&numbers[i])) {
            count++;
        }
    }
    printf("Even numbers: %d\n", count);

    return 0;
}
```

The pattern: Create an array of function pointers, then index into it (`filters[i]`) to call different functions. This is dispatch—you select which function to run based on a condition.

---

## 5. const Qualifiers and Const-Correctness

### 5.1 Understanding const

The `const` qualifier means "this cannot be modified." But when combined with pointers, it can be confusing. The key insight:

**Read the declaration right-to-left.**

This simple rule will untangle any const declaration.

### 5.2 const with Values

```c
const int x = 5;
```

Reading right-to-left: "x is an int, const" = "x is a const integer". You cannot modify x.

```c
x = 10;  // Compile error
```

### 5.3 const with Pointers

Here's where it gets tricky. There are two places the `const` can go:

**Case 1: const before the type**

```c
const int *ptr;
```

Reading right-to-left: "ptr is a pointer to a const int". You cannot modify what `ptr` points to.

```c
int x = 5;
const int *ptr = &x;

*ptr = 10;  // Error: cannot modify what ptr points to
ptr = &some_other_int;  // OK: you can change what ptr points to
```

**Case 2: const after the pointer symbol**

```c
int * const ptr;
```

Reading right-to-left: "ptr is a const pointer to int". You cannot change where `ptr` points, but you can modify the int it points to.

```c
int x = 5, y = 10;
int * const ptr = &x;

*ptr = 20;  // OK: modify what ptr points to
ptr = &y;   // Error: cannot change what ptr points to
```

**Case 3: const on both sides**

```c
const int * const ptr;
```

Reading right-to-left: "ptr is a const pointer to a const int". You can do neither: cannot change where it points, cannot modify what it points to.

```c
const int * const ptr = &x;

*ptr = 20;  // Error
ptr = &y;   // Error
```

### 5.4 The "Read Right-to-Left" Rule

Here's the mnemonic that saves lives on exams:

**Start at the variable name, read right first, then left.**

```c
int * const ptr;
↑
Start here. "ptr is a const" (right) "pointer" (then left) "to int" (leftmost).

const int *ptr;
↑
Start here. "ptr is a pointer" (right) "to const" (left) "int" (leftmost).
```

With this rule, you can decode any declaration instantly.

### 5.5 const with Function Parameters

When a function takes a pointer parameter, const tells the caller: "I promise not to modify what this pointer points to."

```c
int strlen_const(const char *str) {
    // We can read str, but cannot modify it
    int len = 0;
    while (*str != '\0') {
        len++;
        str++;  // OK: move the pointer
    }
    return len;
}
```

**Why use const?** It's a contract. It tells the caller: "You can safely pass me a pointer to data you care about; I won't accidentally modify it."

**Example: Function that modifies**

```c
void uppercase(char *str) {
    // No const: we're allowed (expected) to modify str
    while (*str != '\0') {
        *str = toupper(*str);
        str++;
    }
}

int main() {
    char word[] = "hello";
    uppercase(word);  // word is now "HELLO"
    return 0;
}
```

**Const functions are safer:**

```c
int count_vowels(const char *str) {
    // Caller knows we won't modify str
    int count = 0;
    while (*str != '\0') {
        char c = tolower(*str);
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            count++;
        }
        str++;
    }
    return count;
}
```

### 5.6 Common const Patterns

| Declaration | Meaning |
|---|---|
| `const int x;` | x is a const integer |
| `const int *p;` | p is a pointer to a const int |
| `int * const p;` | p is a const pointer to an int |
| `const int * const p;` | p is a const pointer to a const int |
| `const char *str;` | str is a pointer to const char (string you won't modify) |
| `char * const str;` | str is a const pointer to char (can modify the char, not the pointer) |

### 5.7 Const Correctness in Comparators

When writing comparison functions, use const:

```c
int compare_int(const void *a, const void *b) {
    int val_a = *(const int *)a;
    int val_b = *(const int *)b;
    return val_a - val_b;
}
```

This tells qsort and bsearch: "I won't modify the data you pass me; I only read it." That's the contract.

---

## 6. Structures and Compound Types

### 6.1 What Are Structures?

A **structure** (struct) is a way to group multiple pieces of data of different types into a single unit. Instead of having separate variables `name`, `age`, `gpa`, you bundle them into a `Student` struct.

```c
struct Student {
    char name[50];
    int age;
    double gpa;
};
```

This creates a new type `struct Student`. Each Student object contains all three fields.

### 6.2 Declaring and Using Structs

**Declaration:**

```c
struct Student {
    char name[50];
    int age;
    double gpa;
};

// Create a variable of this type
struct Student alice;
alice.name = "Alice";  // Wait, this is wrong! See below.
```

**Accessing members:** Use the dot operator `.` for direct access:

```c
struct Student alice;
strcpy(alice.name, "Alice");  // Copy string into the array
alice.age = 20;
alice.gpa = 3.9;

printf("%s is %d years old\n", alice.name, alice.age);
```

**Note on strings:** If `name` is an array `char name[50]`, you can't assign directly with `=`. You must use `strcpy` to copy a string into the array, or initialize at declaration.

### 6.3 Pointers to Structs

Often you'll work with pointers to structs:

```c
struct Student *ptr = &alice;
```

To access members through a pointer, use the arrow operator `->`:

```c
ptr->age = 21;
printf("%s\n", ptr->name);
```

This is equivalent to `(*ptr).age` but much more readable.

**malloc and structs:**

```c
struct Student *alice = malloc(sizeof(struct Student));
alice->age = 20;
strcpy(alice->name, "Alice");
alice->gpa = 3.9;

// Later:
free(alice);
```

### 6.4 typedef with Structs

Repeatedly writing `struct Student` is tedious. Use typedef:

```c
typedef struct {
    char name[50];
    int age;
    double gpa;
} Student;

// Now you can write:
Student alice;
alice.age = 20;
```

**With a named struct:**

```c
typedef struct Student {
    char name[50];
    int age;
    double gpa;
} Student;
```

This gives you both the typename `struct Student` and the typedef alias `Student`.

### 6.5 Nested Structures

Structs can contain other structs:

```c
struct Date {
    int year;
    int month;
    int day;
};

typedef struct {
    char name[50];
    int age;
    struct Date birth_date;
} Student;

// Usage:
Student alice;
alice.birth_date.year = 2004;
alice.birth_date.month = 3;
alice.birth_date.day = 15;

printf("Born: %d-%d-%d\n", alice.birth_date.year,
       alice.birth_date.month, alice.birth_date.day);
```

### 6.6 Structs with Function Pointers

A struct can contain function pointers—this is how you build objects in C:

```c
typedef int (*Operation)(int, int);

typedef struct {
    char name[50];
    Operation func;
} MathOp;

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int main() {
    MathOp ops[2];

    strcpy(ops[0].name, "add");
    ops[0].func = add;

    strcpy(ops[1].name, "subtract");
    ops[1].func = sub;

    printf("%s(5, 3) = %d\n", ops[0].name, ops[0].func(5, 3));
    // Output: add(5, 3) = 8

    return 0;
}
```

This is a crude form of encapsulation. You're bundling data (the operation name) with behavior (the function).

### 6.7 Structs with Arrays

Structs can contain arrays:

```c
typedef struct {
    int student_id;
    int grades[10];  // Up to 10 grades
    int num_grades;  // How many are actually filled
} StudentRecord;

int main() {
    StudentRecord record;
    record.student_id = 12345;
    record.grades[0] = 85;
    record.grades[1] = 90;
    record.num_grades = 2;

    printf("Student %d has %d grades\n", record.student_id, record.num_grades);
    return 0;
}
```

### 6.8 Memory Layout

Structs in memory are stored sequentially—members lay out in order:

```c
struct Student {
    char name[50];   // Bytes 0-49
    int age;         // Bytes 50-53
    double gpa;      // Bytes 54-61
};
```

So `sizeof(struct Student)` is at least 50 + 4 + 8 = 62 bytes (may be more due to alignment padding).

You can see the actual layout with:

```c
printf("Offset of name: %lu\n", offsetof(struct Student, name));
printf("Offset of age: %lu\n", offsetof(struct Student, age));
printf("Offset of gpa: %lu\n", offsetof(struct Student, gpa));
printf("Total size: %lu\n", sizeof(struct Student));
```

---

## 7. Practical Patterns: Combining Concepts

### 7.1 Generic Filter with Structures

Let's combine everything: generic filtering, predicates, and structs.

```c
typedef struct {
    int id;
    char name[50];
    int score;
} Student;

// Predicate: score >= 80
int is_high_scorer(void *elem) {
    const Student *s = (const Student *)elem;
    return s->score >= 80;
}

// Predicate: name starts with 'A'
int name_starts_with_A(void *elem) {
    const Student *s = (const Student *)elem;
    return s->name[0] == 'A';
}

// Generic filter
int count_matches(void *arr, int n, int elem_size,
                  int (*pred)(void *)) {
    int count = 0;
    char *base = (char *)arr;
    for (int i = 0; i < n; i++) {
        void *elem = base + i * elem_size;
        if (pred(elem)) {
            count++;
        }
    }
    return count;
}

int main() {
    Student students[] = {
        {1, "Alice", 85},
        {2, "Bob", 72},
        {3, "Amy", 92},
        {4, "Charlie", 88}
    };

    int high_scorers = count_matches(students, 4, sizeof(Student), is_high_scorer);
    printf("High scorers: %d\n", high_scorers);  // 3

    int a_names = count_matches(students, 4, sizeof(Student), name_starts_with_A);
    printf("Names starting with A: %d\n", a_names);  // 2

    return 0;
}
```

### 7.2 Sorting Structs

Sort your struct array using qsort:

```c
int compare_students_by_score(const void *a, const void *b) {
    const Student *s1 = (const Student *)a;
    const Student *s2 = (const Student *)b;
    return s2->score - s1->score;  // Descending order
}

int main() {
    Student students[] = {
        {1, "Alice", 85},
        {2, "Bob", 72},
        {3, "Amy", 92}
    };

    qsort(students, 3, sizeof(Student), compare_students_by_score);

    // Now sorted by score (descending):
    for (int i = 0; i < 3; i++) {
        printf("%s: %d\n", students[i].name, students[i].score);
    }
    // Amy: 92
    // Alice: 85
    // Bob: 72

    return 0;
}
```

### 7.3 Polymorphism via Function Pointers in Structs

In C, you can simulate methods by storing function pointers in structs:

```c
typedef struct {
    char name[50];
    int (*speak)(void);  // Function pointer for behavior
} Animal;

int dog_speak(void) {
    printf("Woof!\n");
    return 0;
}

int cat_speak(void) {
    printf("Meow!\n");
    return 0;
}

int main() {
    Animal dog;
    strcpy(dog.name, "Rex");
    dog.speak = dog_speak;

    Animal cat;
    strcpy(cat.name, "Whiskers");
    cat.speak = cat_speak;

    dog.speak();  // Woof!
    cat.speak();  // Meow!

    return 0;
}
```

This is the foundation of object-oriented programming in C. You bundle data with behavior.

---

## 8. Exam-Style Practice Problems

### Problem 1: Generic Array Statistics

Write a function that computes the sum of all elements in an array of unknown type, using a generic approach.

```c
/*
 * Compute the sum of elements using a combiner function.
 *
 * arr: pointer to array
 * n: number of elements
 * elem_size: size of each element in bytes
 * combiner: function that takes (accumulated_value_ptr, element_ptr)
 *           and updates accumulated_value based on element
 */
void compute_aggregate(void *arr, int n, int elem_size,
                       void (*combiner)(void *, void *),
                       void *initial_result) {
    char *base = (char *)arr;
    for (int i = 0; i < n; i++) {
        void *elem = base + i * elem_size;
        combiner(initial_result, elem);
    }
}

// Combiner for summing integers
void sum_combiner_int(void *result, void *elem) {
    int *r = (int *)result;
    int val = *(int *)elem;
    *r += val;
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int sum = 0;

    compute_aggregate(arr, 5, sizeof(int), sum_combiner_int, &sum);
    printf("Sum: %d\n", sum);  // Expected: 15

    return 0;
}
```

**Your task:** Extend this to compute the sum of `double` array. Write a `sum_combiner_double` function and test it.

---

### Problem 2: Sorting and Searching Structs

Given an array of employees, sort them by salary, then search for employees earning above a certain threshold.

```c
typedef struct {
    int id;
    char name[50];
    double salary;
} Employee;

// Write:
// 1. A comparison function for qsort (sort by salary, ascending)
// 2. A predicate function to identify high earners
// 3. Test code using qsort and count_matches
```

**Solution outline:**

```c
int compare_by_salary(const void *a, const void *b) {
    const Employee *e1 = (const Employee *)a;
    const Employee *e2 = (const Employee *)b;
    return (e1->salary > e2->salary) - (e1->salary < e2->salary);
}

int is_high_earner(void *elem) {
    Employee *e = (Employee *)elem;
    return e->salary > 80000;
}

int main() {
    Employee employees[] = {
        {1, "Alice", 75000},
        {2, "Bob", 95000},
        {3, "Amy", 85000}
    };

    qsort(employees, 3, sizeof(Employee), compare_by_salary);

    int high_earners = count_matches(employees, 3, sizeof(Employee),
                                      is_high_earner);
    printf("Employees earning >80k: %d\n", high_earners);

    return 0;
}
```

---

### Problem 3: Function Pointer Dispatch

Write a calculator that uses an array of function pointers to perform operations. The user selects an operation (0=add, 1=subtract, 2=multiply), and the correct function is dispatched.

```c
// Solution outline:
typedef int (*BinaryOp)(int, int);

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

int main() {
    BinaryOp ops[3] = {add, sub, mul};

    int a = 10, b = 3;

    for (int op_id = 0; op_id < 3; op_id++) {
        printf("Result of op %d: %d\n", op_id, ops[op_id](a, b));
    }
    // Output:
    // Result of op 0: 13
    // Result of op 1: 7
    // Result of op 2: 30

    return 0;
}
```

---

### Problem 4: Generic Stack with Structs

Implement a generic stack (as shown in Section 3.3), then create a stack of `Date` structs (with year, month, day fields). Push three dates, then pop them back and print.

```c
typedef struct {
    int year;
    int month;
    int day;
} Date;

int main() {
    GenericStack *stack = stack_create(10, sizeof(Date));

    Date d1 = {2024, 3, 15};
    Date d2 = {2024, 6, 20};
    Date d3 = {2024, 12, 25};

    stack_push(stack, &d1);
    stack_push(stack, &d2);
    stack_push(stack, &d3);

    Date popped;
    stack_pop(stack, &popped);
    printf("Popped: %d-%d-%d\n", popped.year, popped.month, popped.day);
    // Expected: 2024-12-25

    stack_free(stack);
    return 0;
}
```

---

## 9. Common Exam Traps

### Trap 1: Forgetting to Cast void* Before Dereferencing

**Error:**
```c
void *ptr = ...;
int x = *ptr;  // COMPILER ERROR
```

**Fix:**
```c
int x = *(int *)ptr;  // Cast first, then dereference
```

**Why:** The compiler doesn't know how many bytes to read from void*. You must tell it by casting to a specific type.

---

### Trap 2: Double-Dereference Confusion with Function Pointers

**Error:**
```c
typedef int (*Comparator)(void *, void *);

Comparator *comp_array[3];  // Array of pointers to Comparator
comp_array[0] = &compare_int;  // Wrong: compare_int is already a function pointer
```

**Fix:**
```c
Comparator comp_array[3];  // Array of Comparator (which are already pointers)
comp_array[0] = compare_int;  // Correct
```

**Why:** `Comparator` is already defined as a pointer type. Creating an array of `Comparator*` gives you pointers to pointers, which is confusing and almost never what you want.

---

### Trap 3: Confusion Between const int* and int* const

**Error:**
```c
void modify(const int *ptr) {
    *ptr = 10;  // ERROR: cannot modify const data
}
```

**Fix (if you want to modify):**
```c
void modify(int *ptr) {
    *ptr = 10;  // OK
}
```

**Or fix (if you want const but can change pointer):**
```c
void iterate(const int *ptr) {
    ptr++;  // OK: can move the pointer
}
```

**Why:** `const int*` means you can't modify the data, but you can move the pointer. If you need both const data and const pointer, use `const int* const`.

---

### Trap 4: Forgetting Size Parameter in Generics

**Error:**
```c
void bubble_sort(void *arr, int n, int (*compar)(void *, void *)) {
    // No elem_size_bytes!
    // How do we know how many bytes each element takes?
}
```

**Fix:**
```c
void bubble_sort(void *arr, int n, int elem_size_bytes,
                 int (*compar)(void *, void *)) {
    // Now we can compute element addresses
}
```

**Why:** Without knowing the element size, you can't use pointer arithmetic correctly. Always pass `sizeof(element_type)` or `elem_size_bytes`.

---

### Trap 5: String vs. String Pointer in qsort

**Error (sorting array of strings):**
```c
char *words[] = {"dog", "cat", "ant"};

int compare(const void *a, const void *b) {
    return strcmp((const char *)a, (const char *)b);  // WRONG
}

qsort(words, 3, sizeof(char*), compare);
```

**Fix:**
```c
int compare(const void *a, const void *b) {
    const char *str_a = *(const char **)a;  // Double dereference
    const char *str_b = *(const char **)b;
    return strcmp(str_a, str_b);
}

qsort(words, 3, sizeof(char*), compare);
```

**Why:** The array `words` contains pointers to strings. When qsort passes elements to the comparison function, it passes the address of each element (i.e., the address of a `char*`). So you dereference once to get the `char*`, then use it.

---

### Trap 6: Uninitialized Struct Members

**Error:**
```c
struct Student s;
printf("%d\n", s.age);  // Garbage value!
```

**Fix:**
```c
struct Student s = {0};  // Zero-initialize all members
printf("%d\n", s.age);  // Now it's 0

// Or explicit initialization:
struct Student s = {"Alice", 20, 3.9};
```

**Why:** Automatic (stack) structs are not automatically initialized. Use `= {0}` for safety, or initialize explicitly.

---

### Trap 7: Array vs. Pointer to Array in Struct Size

**Error:**
```c
struct Student s;
char *name = malloc(50);  // Allocate separately

s.name = name;  // ERROR: name is char[50], not char*
```

**Fix (if struct should store pointer):**
```c
typedef struct {
    char *name;      // Pointer to string
    int age;
} Student;

Student s;
s.name = malloc(50);
strcpy(s.name, "Alice");
```

**Or fix (if struct should embed array):**
```c
typedef struct {
    char name[50];   // Embedded array
    int age;
} Student;

Student s;
strcpy(s.name, "Alice");  // No malloc needed
```

**Why:** Structs can embed arrays or store pointers. The semantics are very different. Embedded arrays mean the memory is part of the struct; pointers mean you allocate separately.

---

### Trap 8: Comparison Function Return Value

**Error:**
```c
int compare(const void *a, const void *b) {
    int val_a = *(const int *)a;
    int val_b = *(const int *)b;

    if (val_a < val_b) return 1;     // WRONG: backwards!
    if (val_a > val_b) return -1;
    return 0;
}
```

This sorts in *descending* order (opposite of usual), confusing both you and graders.

**Fix:**
```c
int compare(const void *a, const void *b) {
    int val_a = *(const int *)a;
    int val_b = *(const int *)b;

    return val_a - val_b;  // Ascending: a < b → negative
}

// Or explicit:
if (val_a < val_b) return -1;  // Correct order
if (val_a > val_b) return 1;
return 0;
```

**Why:** Comparators should return negative if first < second (ascending order). It's easy to flip the logic under exam pressure.

---

## Summary & Comparison Table

Here's a quick reference for all the major concepts:

| Concept | Purpose | Key Syntax | Complexity |
|---------|---------|-----------|-----------|
| **void*** | Generic pointer, works for any type | `void *ptr = &x;` then cast to use | Medium |
| **Generic sorting** | Sort array of unknown type | Pass `elem_size`, comparator function | High |
| **Generic stack** | Container for any data type | Use `memcpy` to store/retrieve | High |
| **Function pointers** | Call different functions dynamically | `int (*func)(int, int);` | Medium |
| **Typedef function pointers** | Make function pointer declarations readable | `typedef int (*Comp)(void*, void*);` | Low |
| **Comparators (qsort)** | Custom sort order | Return negative/zero/positive | Medium |
| **const int*** | Pointer to const data (can move pointer) | `const int *p;` | Medium |
| **int* const** | Const pointer to data (can modify data) | `int * const p;` | Medium |
| **Structs** | Bundle multiple fields into one type | `typedef struct { ... } Name;` | Low |
| **Nested structs** | Struct containing another struct | `struct A { struct B nested; };` | Medium |
| **Function pointers in structs** | Simulate methods/polymorphism | `int (*func)(void);` inside struct | High |

---

## Final Exam Tips

1. **Read declarations right-to-left** for const qualifiers. This one rule solves 80% of const confusion.

2. **Always pass sizeof()** when writing generic functions. The size parameter is non-negotiable.

3. **Test with qsort early**. If your comparator works with qsort, it likely works everywhere.

4. **Be careful with string arrays**. Double-dereference when comparing strings in qsort: `*(const char **)a`.

5. **Check your casts**. When using void*, every dereference needs a cast first.

6. **Draw memory diagrams** if you're confused about pointer arithmetic. Visualizing helps.

7. **Practice the swap function**. It's a classic that combines void*, memcpy, and pointer arithmetic in one place.

These notes cover all material from COMP201 lectures 10, 11, and 12. You now have the foundation to handle advanced C confidently. Practice these concepts with the exam problems above, and you'll be well-prepared. Good luck studying!

*These notes are designed to teach you from scratch. If you find sections unclear, re-read them carefully—the repetition helps concepts stick. Remember: C gives you power, but with that power comes responsibility to manage memory and types correctly.*
