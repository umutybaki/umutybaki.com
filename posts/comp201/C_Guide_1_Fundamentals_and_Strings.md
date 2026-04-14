---
title: "C Fundamentals, Chars & Strings — Study Guide"
date: "2026-04-14"
description: "Comprehensive guide to C basics, characters, and strings from first principles for the COMP 201 midterm."
---

# COMP201 Midterm Study Guide 1: C Fundamentals, Chars & Strings

A comprehensive guide to passing the COMP201 midterm. This guide covers everything you need to know about C basics, characters, and strings from first principles. Read it like a textbook and work through the examples.

---


## C Fundamentals & Program Structure

### What Is C?

**C** is a procedural programming language created in the 1970s. It's small, efficient, and sits close to the hardware. Unlike Python or Java, C doesn't protect you from mistakes—you have direct control over memory, which makes C both powerful and dangerous.

### Your First C Program

Every C program needs a **main function** where execution starts. Here's the minimal program:

```c
#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("Hello, world!\n");
    return 0;
}
```

Let's break this down:

- **`#include <stdio.h>`**: This tells the compiler to include the standard input/output library. The angle brackets mean it's a system library.
- **`int main(...)`**: Every program has a `main` function that returns an integer (0 means "success").
- **`argc` and `argv`**: These are the command-line arguments. We'll explain them later.
- **`printf`**: Prints text to the console.
- **`return 0;`**: Tell the operating system the program ran successfully.

### Comments

In C, you can write comments two ways:

```c
// Single-line comment

/* Multi-line
   comment */
```

---

## Data Types & Variables

### Primitive Types

C has several built-in data types. Here are the main ones you'll use:

| Type | Size | Range | Example |
|------|------|-------|---------|
| `int` | 4 bytes | -2,147,483,648 to 2,147,483,647 | `int x = 42;` |
| `char` | 1 byte | -128 to 127 (or 0-255 unsigned) | `char c = 'A';` |
| `float` | 4 bytes | ~±3.4e38 (6-7 decimal places) | `float pi = 3.14f;` |
| `double` | 8 bytes | ~±1.8e308 (15-17 decimal places) | `double pi = 3.14159;` |
| `short` | 2 bytes | -32,768 to 32,767 | `short x = 100;` |
| `long` | 8 bytes | -9,223,372,036,854,775,808 to ... | `long x = 1000000000L;` |
| `unsigned int` | 4 bytes | 0 to 4,294,967,295 | `unsigned int x = 50;` |

### Size of Types

You can check the size of any type using the **`sizeof` operator**:

```c
#include <stdio.h>

int main() {
    printf("sizeof(int) = %zu bytes\n", sizeof(int));      // usually 4
    printf("sizeof(char) = %zu bytes\n", sizeof(char));    // always 1
    printf("sizeof(double) = %zu bytes\n", sizeof(double));// usually 8
    return 0;
}
```

### Declaring and Initializing Variables

```c
int age = 20;           // declare and initialize
double salary = 50000.50;
char letter = 'A';
int x, y, z;            // declare multiple variables
int a = 5, b = 10;      // initialize while declaring multiple
```

**Exam Trap #1**: Uninitialized variables contain garbage values. Always initialize!

```c
int x;              // Bad: x contains random value
printf("%d", x);    // Unpredictable output
```

---

## Input/Output: printf & scanf

### printf: Formatted Output

**`printf`** lets you print values with format specifiers. The format string tells C what kind of value comes next.

```c
printf("format string with %specifiers", arg1, arg2, ...);
```

### Common Format Specifiers

| Specifier | What It Prints | Example |
|-----------|---|---------|
| `%d` | integer | `printf("%d", 42);` → `42` |
| `%c` | single character | `printf("%c", 'A');` → `A` |
| `%s` | C string | `printf("%s", "hello");` → `hello` |
| `%f` | floating point (default 6 decimals) | `printf("%f", 3.14);` → `3.140000` |
| `%.2f` | floating point with 2 decimals | `printf("%.2f", 3.14159);` → `3.14` |
| `%x` | hexadecimal | `printf("%x", 255);` → `ff` |
| `%X` | uppercase hex | `printf("%X", 255);` → `FF` |
| `%o` | octal | `printf("%o", 8);` → `10` |
| `%p` | memory address (pointer) | `printf("%p", &x);` → `0x7fff5fbff8ac` |
| `%ld` | long integer | `printf("%ld", 1000000L);` → `1000000` |
| `%lu` or `%zu` | unsigned or size_t | `printf("%zu", sizeof(int));` → `4` |

### Practical printf Examples

```c
#include <stdio.h>

int main() {
    int age = 25;
    char grade = 'A';
    double gpa = 3.95;

    printf("Name: %s\n", "Alice");              // Name: Alice
    printf("Age: %d\n", age);                   // Age: 25
    printf("Grade: %c\n", grade);               // Grade: A
    printf("GPA: %.2f\n", gpa);                 // GPA: 3.95
    printf("0xFF in decimal: %d\n", 0xFF);      // 0xFF in decimal: 255

    return 0;
}
```

**Exam Trap #2**: Mismatched format specifiers are a source of bugs. If you printf a `double` with `%d`, you'll get garbage.

```c
double x = 3.14;
printf("%d\n", x);  // WRONG! Prints garbage, not 3
printf("%f\n", x);  // Correct: prints 3.140000
```

### scanf: Formatted Input

**`scanf`** reads formatted input from the keyboard. It's the opposite of printf.

```c
scanf("format string", &variable1, &variable2, ...);
```

**Important**: Notice the `&`. You must pass the *address* of the variable, not the variable itself.

```c
#include <stdio.h>

int main() {
    int age;
    char initial;

    printf("Enter your age: ");
    scanf("%d", &age);          // Read an integer

    printf("Enter your initial: ");
    scanf("%c", &initial);      // Read a character

    printf("You are %d years old, %c.\n", age, initial);

    return 0;
}
```

**Exam Trap #3**: Forgetting the `&` in scanf will cause a segmentation fault.

```c
int x;
scanf("%d", x);   // CRASH! Should be &x
```

---

## Preprocessor Macros

The **preprocessor** runs before compilation and performs text substitution. The most common preprocessor directive is **`#define`**.

### What #define Does

**`#define`** creates a macro—essentially a find-and-replace rule:

```c
#define MAX 100
#define PI 3.14159
#define SQUARE(x) x * x

int main() {
    int arr[MAX];           // Replaced with: int arr[100];
    double area = PI * r * r;  // Replaced with: double area = 3.14159 * r * r;
    int result = SQUARE(5);    // Replaced with: int result = 5 * 5;
    return 0;
}
```

### How Macros Work

The preprocessor is dumb. It does textual replacement:

```c
#define DOUBLE(x) x + x

// This code:
int result = DOUBLE(3);

// Becomes:
int result = 3 + 3;  // = 6
```

### Macro Pitfalls: Operator Precedence

**Exam Trap #4**: Macros don't follow operator precedence. Consider:

```c
#define DOUBLE(x) x + x

// This seems fine:
int result = DOUBLE(5);      // 5 + 5 = 10

// But this breaks:
int result = DOUBLE(2) * 3;
// Gets replaced with: int result = 2 + 2 * 3;
// Due to operator precedence: 2 + (2 * 3) = 2 + 6 = 8
// But we probably wanted: (2 + 2) * 3 = 12
```

**Solution**: Always wrap the parameter and the entire macro in parentheses:

```c
#define DOUBLE(x) ((x) + (x))

// Now:
int result = DOUBLE(2) * 3;
// Gets replaced with: int result = ((2) + (2)) * 3;
// Which correctly evaluates to: (2 + 2) * 3 = 12
```

### Best Practices for Macros

```c
// Good: constants use UPPER_CASE
#define MAX_BUFFER_SIZE 256
#define PI 3.14159

// Good: macro functions are parenthesized
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define ABS(x) ((x) < 0 ? (-(x)) : (x))

// Bad: no parentheses
#define BAD_DOUBLE(x) x + x
```

---

## Control Flow

### if/else Statements

```c
int score = 85;

if (score >= 90) {
    printf("Grade: A\n");
} else if (score >= 80) {
    printf("Grade: B\n");
} else if (score >= 70) {
    printf("Grade: C\n");
} else {
    printf("Grade: F\n");
}
```

### for Loops

```c
// Print numbers 0 to 9
for (int i = 0; i < 10; i++) {
    printf("%d ", i);
}

// Iterate through an array
int arr[] = {1, 2, 3, 4, 5};
for (int i = 0; i < 5; i++) {
    printf("%d ", arr[i]);
}
```

### while Loops

```c
int count = 0;
while (count < 5) {
    printf("%d\n", count);
    count++;
}

// do-while runs at least once
int x = 0;
do {
    printf("%d\n", x);
    x++;
} while (x < 3);
```

### Logical Operators

```c
// AND: &&
if (age >= 18 && hasLicense) {
    printf("Can drive\n");
}

// OR: ||
if (day == 6 || day == 7) {
    printf("Weekend\n");
}

// NOT: !
if (!isRaining) {
    printf("Go outside\n");
}
```

### Boolean Values (stdbool.h)

C doesn't have a native boolean type. Use `stdbool.h`:

```c
#include <stdbool.h>

bool isRaining = true;
bool canDrive = false;

if (isRaining) {
    printf("Bring umbrella\n");
}
```

C also treats integers as boolean: 0 = false, any non-zero = true.

```c
if (5) {                // True (non-zero)
    printf("Yes\n");
}

if (0) {                // False
    printf("No\n");
}
```

---

## Functions

### Function Declaration vs. Definition

**Declaration** tells the compiler a function exists:

```c
int add(int a, int b);  // Declaration (just signature, no body)
```

**Definition** provides the actual code:

```c
int add(int a, int b) {  // Definition
    return a + b;
}
```

In practice, if you define a function before you use it, you don't need a separate declaration:

```c
#include <stdio.h>

int add(int a, int b) {     // Definition
    return a + b;
}

int main() {
    int result = add(3, 4);
    printf("%d\n", result);
    return 0;
}
```

### Pass by Value

In C, all parameters are **pass by value**. The function receives a copy:

```c
void increment(int x) {
    x++;                    // Increments the copy, not the original
}

int main() {
    int num = 5;
    increment(num);
    printf("%d\n", num);    // Still prints 5!
    return 0;
}
```

To modify a variable and have the change persist, we need **pointers** (covered in later guides).

### Functions Returning Different Types

```c
int getInteger() {
    return 42;
}

double getAverage(double a, double b) {
    return (a + b) / 2;
}

void printMessage(char *message) {
    printf("%s\n", message);
    // Functions that return void don't use return
}

char getFirstCharacter(char *str) {
    return str[0];
}
```

---

## Characters in C

### What Is a Char?

A **`char`** is a 1-byte integer that C interprets as a character. When you write `'A'`, C stores the integer 65.

```c
char letter = 'A';          // Stores 65
char digit = '0';           // Stores 48
char space = ' ';           // Stores 32
char newline = '\n';        // Stores 10

// These are all the same:
char x = 65;                // Store the integer 65
char y = 'A';               // Store 'A' which is 65
```

### ASCII: The Character Encoding

**ASCII (American Standard Code for Information Interchange)** maps each character to a number. Here are the important ones:

- Digits: '0' = 48, '1' = 49, ..., '9' = 57
- Uppercase: 'A' = 65, 'B' = 66, ..., 'Z' = 90
- Lowercase: 'a' = 97, 'b' = 98, ..., 'z' = 122
- Special: space = 32, '!' = 33, '\n' = 10

**Key Insight**: Lowercase letters are exactly 32 more than uppercase!

```c
'a' = 97
'A' = 65
97 - 65 = 32

// Therefore:
char lower = upper + 32;
char upper = lower - 32;
```

### Character Arithmetic

Because chars are integers, you can do math with them:

```c
char letter = 'a';
char next = letter + 1;     // 'b'
char prev = letter - 1;     // '`'

// Get alphabetic position (0-25)
int position = letter - 'a';    // 0 for 'a', 1 for 'b', etc.

// Check if it's a digit
bool isDigit = (ch >= '0' && ch <= '9');

// Convert digit character to its value
int value = ch - '0';           // '5' becomes 5
```

### ctype.h Functions

The **`<ctype.h>`** library provides character classification functions. These make your code cleaner:

```c
#include <ctype.h>

char letter = 'A';

isalpha(letter);            // true: is it a letter?
isdigit('5');               // true: is it a digit?
isspace(' ');               // true: is it whitespace?
isupper(letter);            // true: is it uppercase?
islower('a');               // true: is it lowercase?

toupper('a');               // 'A': convert to uppercase
tolower('A');               // 'a': convert to lowercase
```

### Practical Example: Classify Characters

```c
#include <stdio.h>
#include <ctype.h>

int main() {
    char ch = 'x';

    if (isalpha(ch)) {
        if (isupper(ch)) {
            printf("%c is uppercase\n", ch);
        } else if (islower(ch)) {
            printf("%c is lowercase\n", ch);
        }
    } else if (isdigit(ch)) {
        printf("%c is a digit\n", ch);
    } else if (isspace(ch)) {
        printf("Space, tab, or newline\n");
    }

    return 0;
}
```

---

## Strings: The Basics

### What Is a C String?

A **C string** is just an array of characters ending with the **null terminator** `'\0'`. That's it. There's no special "string" type—it's just chars.

```c
char str[] = "hello";
// In memory:
// Index:  0  1  2  3  4  5
// Value: 'h' 'e' 'l' 'l' 'o' '\0'
```

**Critical**: The null terminator `'\0'` marks the end. Every valid C string must have it.

### Why the Null Terminator?

C strings are **not** objects with built-in length information. Functions like `strlen` scan the string looking for `'\0'` to know when to stop. Without it, the function would keep reading garbage memory forever.

```c
char name[6];
strcpy(name, "Alice");     // 5 characters + '\0' = 6 bytes needed
// Memory: 'A' 'l' 'i' 'c' 'e' '\0'
```

### String Literals

When you write a string literal in your code, C stores it as a constant in read-only memory:

```c
char *ptr = "hello";       // Points to read-only memory
ptr[0] = 'H';              // CRASH! Cannot modify read-only memory
```

### String on the Stack

To create a modifiable string, declare a character array with enough space:

```c
char str[6];               // Space for 5 chars + null terminator
strcpy(str, "hello");      // Copy "hello" into str
str[0] = 'H';              // OK! Modifies the copy
printf("%s\n", str);       // Prints: Hello
```

### Calculating String Size

When declaring a string array, remember to include space for the null terminator:

```c
char str[6];               // For a 5-character string
strcpy(str, "hello");      // 'h' 'e' 'l' 'l' 'o' '\0' → needs 6 bytes

char str[5];               // ERROR: Not enough space!
strcpy(str, "hello");      // Buffer overflow!
```

### Difference: char[] vs char*

```c
char str1[10] = "hello";   // Array: owns its memory
str1[0] = 'H';              // OK: can modify

char *str2 = "hello";      // Pointer: points to read-only literal
str2[0] = 'H';              // CRASH: cannot modify read-only memory
```

### String Length with strlen

The **`strlen`** function returns the number of characters *before* the null terminator:

```c
#include <string.h>

char str[] = "hello";
int len = strlen(str);      // Returns 5, not 6!

// In memory:
// 'h' 'e' 'l' 'l' 'o' '\0'
//  0   1   2   3   4   (strlen counts up to but not including '\0')
```

**Exam Trap #5**: `strlen` counts characters, NOT bytes. And it doesn't include '\0'.

```c
char str[20] = "hello";
printf("%zu\n", strlen(str));   // 5
printf("%zu\n", sizeof(str));   // 20 (size of the array)
```

**Exam Trap #6**: Using `sizeof` for string length is wrong!

```c
char str[] = "hello";
printf("%zu\n", sizeof(str));   // 6 (on some systems)
// This is luck! It's the actual size of the array.
// But if str is a parameter (char *str), sizeof returns 8 (pointer size)!
```

### Printing Strings

Use `%s` with printf to print a string:

```c
char str[] = "world";
printf("Hello, %s!\n", str);    // Hello, world!
```

---

## String Library Functions

### Overview

C provides many string functions in `<string.h>`. Here are the most important ones for the midterm.

### strlen(str)

Returns the number of characters in a string (excluding the null terminator).

```c
#include <string.h>

char str[] = "hello";
int len = strlen(str);          // 5

// Implementation (conceptually):
// int strlen(char *s) {
//     int count = 0;
//     while (s[count] != '\0') {
//         count++;
//     }
//     return count;
// }
```

**Common Mistake**: Using `strlen` multiple times in a loop. Save the result:

```c
// Bad: O(n^2)
for (int i = 0; i < strlen(str); i++) {
    // strlen is called n times!
}

// Good: O(n)
int len = strlen(str);
for (int i = 0; i < len; i++) {
    // strlen called once
}
```

### strcmp(s1, s2)

Compares two strings **lexicographically** (dictionary order). Returns:
- 0 if strings are equal
- Negative if s1 comes before s2
- Positive if s1 comes after s2

```c
#include <string.h>

strcmp("alice", "alice");       // 0 (equal)
strcmp("alice", "bob");         // Negative (alice < bob)
strcmp("bob", "alice");         // Positive (bob > alice)

// Correct way to compare:
if (strcmp(str1, str2) == 0) {
    printf("Strings are equal\n");
}
```

**Exam Trap #7**: Using `==` to compare strings compares addresses, not contents!

```c
char *str1 = "hello";
char *str2 = "hello";
if (str1 == str2) {             // WRONG! Compares addresses
    printf("Equal\n");          // Might not print
}

if (strcmp(str1, str2) == 0) {  // CORRECT!
    printf("Equal\n");
}
```

### strncmp(s1, s2, n)

Like strcmp, but compares at most `n` characters:

```c
strncmp("alice", "alice123", 5);    // 0 (first 5 chars match)
strncmp("alice", "alice123", 10);   // Negative (alice < alice123)
```

### strcpy(dst, src)

Copies the source string into the destination. **Assumes dst has enough space!**

```c
char src[] = "hello";
char dst[10];
strcpy(dst, src);               // Copy src into dst
printf("%s\n", dst);            // hello
```

**Exam Trap #8**: Buffer overflow! strcpy doesn't check bounds.

```c
char dst[5];
strcpy(dst, "hello world");     // CRASH! "hello world" is 12 chars + '\0'
```

### strncpy(dst, src, n)

Like strcpy, but copies at most `n` characters. **Pitfall**: Doesn't add '\0'!

```c
char dst[6];
strncpy(dst, "hello world", 5);
// dst is now: 'h' 'e' 'l' 'l' 'o' ???
// No null terminator! This is broken!

// Fix it:
strncpy(dst, "hello world", 5);
dst[5] = '\0';
printf("%s\n", dst);            // hello
```

### strcat(dst, src)

Concatenates src to the end of dst. **Assumes dst has enough space!**

```c
char str1[20] = "hello";
char str2[] = " world";
strcat(str1, str2);             // str1 becomes "hello world"
printf("%s\n", str1);           // hello world
```

**How it works**:
- strcat finds the null terminator in dst
- Copies src characters starting there
- Adds a new null terminator

```c
char str1[20] = "hello";
// Memory: 'h' 'e' 'l' 'l' 'o' '\0' ? ? ? ...
strcat(str1, " world");
// Memory: 'h' 'e' 'l' 'l' 'o' ' ' 'w' 'o' 'r' 'l' 'd' '\0'
```

### strncat(dst, src, n)

Concatenates at most `n` characters from src. **Always adds '\0'**.

```c
char str1[20] = "hello";
strncat(str1, " world is great", 6);
// Adds " world" (6 chars) to str1
printf("%s\n", str1);           // hello world
```

### strchr(str, ch) and strrchr(str, ch)

Finds the first (or last) occurrence of a character in a string. Returns a pointer to it, or NULL if not found.

```c
char str[] = "hello";
char *ptr = strchr(str, 'l');
if (ptr != NULL) {
    printf("%s\n", ptr);        // llo (points to first 'l')
} else {
    printf("Not found\n");
}

char *last_l = strrchr(str, 'l');   // Points to last 'l'
printf("%s\n", last_l);         // lo
```

**Key**: These return a pointer into the original string, not a new string.

### strstr(haystack, needle)

Finds the first occurrence of a substring within a string. Returns a pointer to it, or NULL.

```c
char str[] = "hello world";
char *ptr = strstr(str, "world");
if (ptr != NULL) {
    printf("%s\n", ptr);        // world (points into str)
} else {
    printf("Not found\n");
}
```

### strspn(str, accept)

Returns the length of the initial part of `str` that contains **only** characters in `accept`.

```c
char str[] = "aaabbbccc";
int span = strspn(str, "ab");       // 6
// 'a', 'a', 'a', 'b', 'b', 'b' are all in "ab"
// But 'c' is not in "ab", so we stop there

char str2[] = "hello";
int span = strspn(str2, "aeiou");   // 0
// 'h' is not in "aeiou", so we stop immediately
```

**Think of it as**: "How far can I go while only seeing accepted characters?"

### strcspn(str, reject)

Returns the length of the initial part of `str` that contains **no** characters in `reject`.

```c
char str[] = "hello world";
int span = strcspn(str, " ");       // 5
// 'h', 'e', 'l', 'l', 'o' are all not in " "
// But ' ' is in " ", so we stop there

char str2[] = "abc123def";
int span = strcspn(str2, "0123456789");  // 3
// 'a', 'b', 'c' are not digits
// But '1' is a digit, so we stop
```

**Think of it as**: "How far can I go before hitting a rejected character?"

### strtok(str, delim)

Tokenizes a string (breaks it into pieces) using a delimiter. This is tricky because it uses static state.

**Important**: strtok modifies the string it's tokenizing!

```c
char str[] = "apple,banana,cherry";
char *token = strtok(str, ",");     // "apple"
while (token != NULL) {
    printf("%s\n", token);
    token = strtok(NULL, ",");      // Continue tokenizing
}
```

This prints:
```
apple
banana
cherry
```

**How it works**:
1. First call: `strtok(str, delim)` searches for the delimiter, replaces it with '\0', returns a pointer to the start.
2. Subsequent calls: `strtok(NULL, delim)` continues from where it left off.
3. Returns NULL when there are no more tokens.

**Critical Pitfall**: strtok modifies the original string!

```c
char str[] = "apple,banana,cherry";
char *t1 = strtok(str, ",");       // str is now "apple\0banana,cherry"
// str[5] changed from ',' to '\0'!
```

**Exam Trap #9**: Using strtok on multiple strings at the same time doesn't work (it maintains one static pointer).

```c
char str1[] = "a,b,c";
char str2[] = "x,y,z";
char *t1 = strtok(str1, ",");      // "a"
char *t2 = strtok(str2, ",");      // "x"
char *t3 = strtok(NULL, ",");      // This continues from str2, not str1!
```

### sprintf(dst, fmt, ...)

Like printf, but writes to a string instead of the console. Useful for creating formatted strings.

```c
#include <stdio.h>

char str[50];
int age = 25;
sprintf(str, "I am %d years old", age);
printf("%s\n", str);                // I am 25 years old
```

### atoi(s) and atof(s)

Convert strings to numbers.

```c
#include <stdlib.h>

char str1[] = "42";
int num = atoi(str1);               // 42

char str2[] = "3.14";
double pi = atof(str2);             // 3.14

// If conversion fails, atoi returns 0
int bad = atoi("hello");            // 0
```

---

## Memory Layout of Strings

### Stack vs. Heap vs. Read-Only Memory

Understanding where your strings live is crucial for the midterm.

### String Literal (Read-Only Memory)

```c
char *ptr = "hello";
```

- `"hello"` lives in read-only memory (part of the executable)
- `ptr` is a pointer variable on the stack that holds the address
- You cannot modify the string: `ptr[0] = 'H'` causes a segmentation fault

### Stack-Allocated String

```c
char str[6] = "hello";
```

- The array `str` lives on the stack
- All 6 bytes (including the null terminator) are stored in the array
- You can modify it: `str[0] = 'H'` is fine

### Pointer to String Literal vs. Array

```c
// Pointer to literal (read-only)
char *str1 = "hello";
str1[0] = 'H';              // CRASH

// Array (modifiable)
char str2[] = "hello";
str2[0] = 'H';              // OK: becomes "Hello"

// Array with pointer
char arr[6] = "hello";
char *ptr = arr;            // Points into the array
ptr[0] = 'H';               // OK: modifies the array
```

### Memory Diagram

```c
char str1[] = "hello";
char *str2 = str1;

// Stack:
// str1[0] = 'h'  (address: 0x100)
// str1[1] = 'e'  (address: 0x101)
// str1[2] = 'l'  (address: 0x102)
// str1[3] = 'l'  (address: 0x103)
// str1[4] = 'o'  (address: 0x104)
// str1[5] = '\0' (address: 0x105)
// str2 = 0x100   (address: 0x106) [stores address of str1[0]]

printf("%s\n", str1);       // hello
printf("%s\n", str2);       // hello (points to same location)
```

---

## Exam-Style Practice Problems

### Problem 1: String Tracing

**Question**: What does this program print?

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str[10] = "hello";
    str[1] = 'a';
    str[2] = '\0';
    printf("%s\n", str);
    printf("%zu\n", strlen(str));

    char *ptr = str + 2;
    printf("%s\n", ptr);

    return 0;
}
```

**Answer**:
```
ha
2
(empty line, since str[2] is '\0')
```

**Explanation**:
- `str` starts as: 'h' 'e' 'l' 'l' 'o' '\0'
- After `str[1] = 'a'` and `str[2] = '\0'`: 'h' 'a' '\0' 'l' 'o' '\0'
- First printf: "ha" (stops at the new '\0' at index 2)
- strlen: 2 (counts 'h' and 'a')
- ptr points to str[2], which is '\0', so printing it gives an empty string

### Problem 2: Implementing strspn with a Helper

**Question**: The Fall 2020 midterm asked students to implement `strspn` and `strcspn`. Fill in the function:

```c
// Helper function: returns 1 if ch is in s, 0 otherwise
int strwhere(const char *s, char ch) {
    for (int i = 0; s[i] != '\0'; i++) {
        if (s[i] == ch) {
            return 1;
        }
    }
    return 0;
}

// Implement strspn using strwhere
int my_strspn(const char *str, const char *accept) {
    int count = 0;
    for (int i = 0; str[i] != '\0'; i++) {
        if (!strwhere(accept, str[i])) {
            break;  // Found a character not in accept
        }
        count++;
    }
    return count;
}

// Implement strcspn using strwhere
int my_strcspn(const char *str, const char *reject) {
    int count = 0;
    for (int i = 0; str[i] != '\0'; i++) {
        if (strwhere(reject, str[i])) {
            break;  // Found a character in reject
        }
        count++;
    }
    return count;
}
```

**Test cases**:
```c
int main() {
    printf("%d\n", my_strspn("aaabbc", "ab"));      // 5
    printf("%d\n", my_strcspn("hello", "aeiou"));   // 1 (stops at 'e')
    return 0;
}
```

### Problem 3: Bug Finding

**Question**: This function is supposed to reverse a string. Find and fix the bug.

```c
#include <string.h>

void reverse_string(char *str) {
    int len = strlen(str);
    char temp[len];

    for (int i = 0; i < len; i++) {
        temp[i] = str[len - 1 - i];
    }

    strcpy(str, temp);
}
```

**Bugs**:
1. **VLA (Variable Length Array)**: `char temp[len]` is not standard C (C99 extension). Should be `char temp[strlen(str) + 1]`.
2. **Missing null terminator**: `temp` is never null-terminated, so strcpy will copy garbage.

**Fixed version**:
```c
void reverse_string(char *str) {
    int len = strlen(str);
    char temp[len + 1];  // Space for null terminator

    for (int i = 0; i < len; i++) {
        temp[i] = str[len - 1 - i];
    }
    temp[len] = '\0';  // Add null terminator!

    strcpy(str, temp);
}
```

### Problem 4: Macro Pitfalls

**Question**: What does this program print?

```c
#define SQUARE(x) x * x
#define CUBE(x) ((x) * (x) * (x))

int main() {
    printf("%d\n", SQUARE(2 + 1));      // ?
    printf("%d\n", CUBE(2 + 1));        // ?
    return 0;
}
```

**Answer**:
- First: `SQUARE(2 + 1)` becomes `2 + 1 * 2 + 1` = 2 + 2 + 1 = 5 (wrong!)
- Second: `CUBE(2 + 1)` becomes `((2 + 1) * (2 + 1) * (2 + 1))` = 3 * 3 * 3 = 27 (correct!)

**Lesson**: Always use parentheses in macros!

---

## Common Exam Traps

Here are the 8+ most common ways students lose points on the midterm:

### 1. Using == to Compare Strings
```c
// WRONG
if (str1 == str2) { ... }

// CORRECT
if (strcmp(str1, str2) == 0) { ... }
```
**Why**: `==` compares addresses (pointers), not content.

### 2. Forgetting the Null Terminator
```c
// WRONG
char str[5];
strcpy(str, "hello");  // 6 bytes needed (h,e,l,l,o,\0), only 5 available!

// CORRECT
char str[6];
strcpy(str, "hello");
```

### 3. Using strcpy Without Bounds Checking
```c
// WRONG: dest might not have enough space
strcpy(dest, src);

// BETTER: use strncpy with explicit null termination
strncpy(dest, src, size - 1);
dest[size - 1] = '\0';
```

### 4. Mismatched scanf Format Specifiers
```c
// WRONG
int x;
scanf("%c", &x);    // Reading character into int

// CORRECT
int x;
scanf("%d", &x);
```

### 5. Forgetting the & in scanf
```c
// WRONG: passes the value, not the address
int x;
scanf("%d", x);

// CORRECT
int x;
scanf("%d", &x);
```

### 6. Macros Without Parentheses
```c
// WRONG
#define DOUBLE(x) x + x
DOUBLE(2) * 3  // Evaluates to 2 + 2 * 3 = 8, not 12

// CORRECT
#define DOUBLE(x) ((x) + (x))
DOUBLE(2) * 3  // Evaluates to (2 + 2) * 3 = 12
```

### 7. Using strlen in Array Declaration
```c
// WRONG: strlen not available at compile time
int size = strlen("hello");
char str[size];  // Error!

// CORRECT: use a constant
char str[6];
strcpy(str, "hello");
```

### 8. Using sizeof for String Length
```c
// WRONG
char str[] = "hello";
printf("%zu\n", sizeof(str));  // 6 (size of array), not the string length!

// CORRECT
printf("%zu\n", strlen(str));  // 5
```

### 9. Modifying String Literals
```c
// WRONG: segmentation fault
char *str = "hello";
str[0] = 'H';

// CORRECT: use an array
char str[] = "hello";
str[0] = 'H';
```

### 10. Uninitialized Variables
```c
// WRONG
int x;
printf("%d\n", x);  // Prints garbage

// CORRECT
int x = 0;
printf("%d\n", x);  // Prints 0
```

### 11. strtok Modifies the String
```c
char str[] = "a,b,c";
strtok(str, ",");   // str is now "a\0b,c"
// Original string is destroyed!
```

### 12. strncpy Doesn't Always Null-Terminate
```c
// WRONG
char dest[5];
strncpy(dest, "hello world", 5);
// dest is now "hello" with no '\0'!

// CORRECT
char dest[6];
strncpy(dest, "hello world", 5);
dest[5] = '\0';
```

---

## Final Tips for the Midterm

1. **Practice string manipulation**: The exam heavily tests string functions like strcmp, strcpy, strspn, and strtok.

2. **Understand memory**: Know the difference between stack arrays, heap allocation, and read-only literals.

3. **Test your code**: When you implement a function, test it with multiple cases.

4. **Read error messages carefully**: Segmentation faults usually mean buffer overflow or null pointer dereference.

5. **Use printf debugging**: If you're unsure what a function does, print intermediate values.

6. **Know the standards**: The course uses standard C (C99 minimum). VLAs are non-standard in many compilers.

7. **Review past exams**: The Q3 from Fall 2020 (strspn/strcspn implementation) and Q3 from Spring 2021 (strtok-like parsing) are goldmines for midterm prep.

Good luck on the midterm! You've got this.
