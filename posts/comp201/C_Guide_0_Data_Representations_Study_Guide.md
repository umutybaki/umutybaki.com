---
title: "0 - Data Representations — Complete Midterm Study Guide"
date: "2026-04-14"
description: "Complete midterm study guide covering bits & bytes, integers, bitwise operators, and floating point for COMP 201."
---

# 0 - Data Representations — Complete Midterm Study Guide
> **Course:** COMP201: Computer Systems & Programming — KOÇ University, Spring 2026
>
> **Coverage:** Lectures 2, 3, 4 — Bits & Bytes, Integers, Bitwise Operators, Floating Point
>
> This guide is written to be **fully self-contained**. You should be able to sit the midterm having studied only this document. Exam-style worked examples are included throughout, drawn from past COMP201 midterms.


## 1. Bits, Bytes, and Hexadecimal

### Why Binary?

Computers are built on transistors, which have two states: **on** (1) and **off** (0). This is why all data — numbers, text, images, audio — is ultimately stored as sequences of 0s and 1s called **bits**.

A single bit can represent only 2 values. To represent richer data, we group bits together. **8 bits = 1 byte**, and computer memory is a large array of bytes. Memory is **byte-addressable**: you can point to (store the address of) a byte, but not an individual bit.

### Base-2 (Binary) Numbers

In binary, each digit position represents a power of 2 (just as decimal uses powers of 10):

```text
Binary:   1  0  1  1
Position: 3  2  1  0
Value:    8  0  2  1  → 8 + 2 + 1 = 11 (decimal)
```

**Key trick — multiplying/dividing by 2:** Appending a 0 on the right multiplies by 2 (shift left). Removing the rightmost 0 divides by 2 (shift right).

**Converting decimal → binary:** Repeatedly find the largest power of 2 ≤ your number, place a 1, subtract, repeat.

> **Example:** 14 in binary?
> - Largest power of 2 ≤ 14 is $2^3 = 8$ → place 1 at position 3
> - 14 − 8 = 6. Largest power of 2 ≤ 6 is $2^2 = 4$ → place 1 at position 2
> - 6 − 4 = 2. Largest power of 2 ≤ 2 is $2^1 = 2$ → place 1 at position 1
> - 2 − 2 = 0. Done → **1110₂**

**A single byte (8 bits):** can hold values from 0 to $2^8 - 1 = 255$.

### Hexadecimal (Base 16)

When working with 32 or 64 bits, binary is unwieldy. **Hexadecimal (hex)** groups bits in blocks of 4, reducing length by 4×. Each hex digit represents exactly 4 bits.

| Hex | Decimal | Binary |
|:----|--------:|:-------|
| 0   | 0       | 0000   |
| 1   | 1       | 0001   |
| 2   | 2       | 0010   |
| 3   | 3       | 0011   |
| 4   | 4       | 0100   |
| 5   | 5       | 0101   |
| 6   | 6       | 0110   |
| 7   | 7       | 0111   |
| 8   | 8       | 1000   |
| 9   | 9       | 1001   |
| A   | 10      | 1010   |
| B   | 11      | 1011   |
| C   | 12      | 1100   |
| D   | 13      | 1101   |
| E   | 14      | 1110   |
| F   | 15      | 1111   |

In C, hex numbers are prefixed with `0x` (e.g., `0xf5`). Binary is prefixed with `0b`.

**Converting binary → hex:** Group binary digits in blocks of 4 from the right. Convert each group.

> **Example:** `0b1111001010` → group from right: `11 1100 1010` → pad to `0011 1100 1010` → `0x3CA`

**Converting hex → binary:** Replace each hex digit with its 4-bit binary equivalent.

> **Example:** `0x173A` → `0001 0111 0011 1010`

## 2. Integer Representations

### C Type Sizes (64-bit system)

| C Type          | Size (Bytes) | Size (Bits) |
|:----------------|-------------:|------------:|
| `char`          | 1            | 8           |
| `short`         | 2            | 16          |
| `int`           | 4            | 32          |
| `long`          | 8            | 64          |
| `float`         | 4            | 32          |
| `double`        | 8            | 64          |
| `char *` (ptr)  | 8            | 64          |

> **Historical note:** On 32-bit systems (pre-2000s), `char *` and `long` were 4 bytes. The move to 64-bit happened because 32-bit pointers max out at only 4 GB of addressable memory.

### 2.1 Unsigned Integers

An **unsigned integer** stores only non-negative values. With $w$ bits, the representable range is:

$$0 \leq x \leq 2^w - 1$$

The binary-to-value conversion is straightforward positional notation:

$$x = \sum_{i=0}^{w-1} b_i \cdot 2^i$$

where $b_i$ is bit $i$ (0-indexed from the right).

| Type            | Min | Max            |
|:----------------|----:|---------------:|
| `unsigned char`  | 0   | 255            |
| `unsigned short` | 0   | 65,535         |
| `unsigned int`   | 0   | 4,294,967,295  |
| `unsigned long`  | 0   | 18,446,744,073,709,551,615 |

### 2.2 Signed Integers — Two's Complement

**The problem:** How do we represent negative numbers in binary? We need a scheme where regular addition still works.

#### Why not Sign-Magnitude?

One naive idea is to use the most-significant bit (MSB) as a sign bit: 0 = positive, 1 = negative. This is called **sign-magnitude**. For example, in 4 bits:
- `0111` = +7, `1111` = -7
- `0000` = +0, `1000` = -0 ← **two representations for zero!**

This wastes a bit and makes arithmetic hardware more complex. **We don't use it.**

#### Two's Complement

The insight behind two's complement is that we want binary addition to "just work" for any mix of positive and negative numbers. The solution is:

- **Positive numbers** are represented normally (MSB = 0).
- **Negative numbers** are represented as the **bitwise NOT + 1** of their positive counterpart.

$$-x = (\sim x) + 1$$

For a $w$-bit two's complement number, the value is:

$$x = -b_{w-1} \cdot 2^{w-1} + \sum_{i=0}^{w-2} b_i \cdot 2^i$$

The MSB acts as a **sign bit** but contributes $-2^{w-1}$ (negative!) to the value.

**Converting positive → negative (and back):** Two methods, same result:
1. **Invert all bits, then add 1**
2. **Shortcut:** Working from the right, copy all bits through (and including) the first 1, then invert the rest.

> **Example (4-bit):** Convert +5 (`0101`) to −5:
> Method 1: `~0101 = 1010`, then `1010 + 0001 = 1011` → **−5 is `1011`**
> Method 2: Copy rightmost `1`: `_101` → invert rest: `1011` ✓

> **Verify:** `1011` has MSB=1, so value = $-8 + 0 + 2 + 1 = -5$ ✓

**The same formula works to go negative→positive** (two's complement is its own inverse).

#### Min and Max Values for Two's Complement

With $w$ bits:
- **Maximum (TMax):** `0111...1` = $2^{w-1} - 1$
- **Minimum (TMin):** `1000...0` = $-2^{w-1}$

Notice: $|TMin| = |TMax| + 1$. There is **one more negative value than positive**.

| Type    | TMin          | TMax          |
|:--------|---------------:|---------------:|
| `char`  | −128          | 127           |
| `short` | −32,768       | 32,767        |
| `int`   | −2,147,483,648 | 2,147,483,647 |
| `long`  | −9,223,372,036,854,775,808 | 9,223,372,036,854,775,807 |

These are accessible in C via `<limits.h>` as `INT_MIN`, `INT_MAX`, `UINT_MAX`, etc.

#### 4-bit Two's Complement — Full Table

| Binary | Unsigned Value | Signed (Two's Comp) Value |
|:-------|---------------:|-------------------------:|
| 0000   | 0             | 0                        |
| 0001   | 1             | 1                        |
| 0010   | 2             | 2                        |
| 0011   | 3             | 3                        |
| 0100   | 4             | 4                        |
| 0101   | 5             | 5                        |
| 0110   | 6             | 6                        |
| 0111   | 7             | **7 (TMax)**             |
| 1000   | 8             | **−8 (TMin)**            |
| 1001   | 9             | −7                       |
| 1010   | 10            | −6                       |
| 1011   | 11            | −5                       |
| 1100   | 12            | −4                       |
| 1101   | 13            | −3                       |
| 1110   | 14            | −2                       |
| 1111   | 15            | −1                       |

**Key insight:** The bit patterns for small negative numbers (−1, −2, …) look like large unsigned numbers (15, 14, …). Casting just reinterprets the same bits.

#### Two's Complement Arithmetic

Addition works identically for signed and unsigned — just add the bits and discard any carry out of the top bit:

> **Example:** 2 + (−5) in 4-bit:
> `0010 + 1011 = 1101` = −3 ✓

> **Subtraction:** $a - b = a + (-b)$. Negate $b$ using two's complement, then add.

### 2.3 Overflow

**Overflow** happens when a result exceeds the range of the type.

**Unsigned overflow:** If you add 1 to the maximum value, you wrap around to 0. If you subtract 1 from 0, you wrap around to the maximum.

```text
0b1111 + 0b0001 = 0b10000 → (drop the carry) 0b0000
0b0000 - 0b0001 = 0b1111 (wraps to 15 for 4-bit unsigned)
```

Unsigned arithmetic is always modulo $2^w$.

**Signed overflow:**
- Adding two positive numbers → negative result (positive overflow)
- Adding two negative numbers → positive result (negative overflow)

Overflow for signed integers occurs **only** when two numbers of the **same sign** are added and the result has the **opposite sign**. It never happens when adding numbers of different signs.

#### Real-World Overflow Examples

- **YouTube view counter:** Originally stored as a 32-bit integer. "Gangnam Style" exceeded 2,147,483,647 views, forcing YouTube to upgrade to 64-bit integers.
- **Windows 95 crash after 49.7 days:** The `GetTickCount()` function returned milliseconds as a 32-bit unsigned int. $2^{32}$ ms / 86,400,000 ms per day ≈ 49.7 days.
- **Civilization / Gandhi bug:** Gandhi's aggression score was 1. Adopting democracy reduced it by 2, causing unsigned underflow to 255 — making Gandhi very aggressive.
- **Ariane 5 rocket (1996):** $500M rocket exploded 37 seconds after launch due to overflow when converting a 64-bit float to a 16-bit signed integer.

## 3. Casting and Combining Types

### 3.1 Same-Size Casting (Signed ↔ Unsigned)

**The golden rule:** When you cast between signed and unsigned types of the same size, **the bits do not change**. Only the interpretation changes.

```c
int v = -12345;
unsigned int uv = v;         // same bits, different interpretation
printf("v = %d, uv = %u\n", v, uv);
// prints: v = -12345, uv = 4294954951
```

The bits of −12345 in 32-bit two's complement are `0b11111111111111111100111111000111`. Interpreted as an unsigned number, this is 4,294,954,951.

**printf format specifiers:**
- `%d` — signed 32-bit int
- `%u` — unsigned 32-bit int
- `%x` — hex 32-bit int

The format specifier (not the variable type) controls how the value is printed.

### 3.2 Expanding: Zero Extension and Sign Extension

When converting to a **larger** type (e.g., `short` → `int`):

**Unsigned values → Zero extension:** New high-order bits are filled with 0s.
```c
unsigned short s = 4;    // 0000 0000 0000 0100
unsigned int i = s;      // 0000 0000 0000 0000 0000 0000 0000 0100
```

**Signed values → Sign extension:** New high-order bits are filled with the sign bit (the MSB).
```c
short s = 4;    // 0000 0000 0000 0100
int i = s;      // 0000 0000 0000 0000 0000 0000 0000 0100  (sign bit=0, fill with 0s)

short s = -4;   // 1111 1111 1111 1100
int i = s;      // 1111 1111 1111 1111 1111 1111 1111 1100  (sign bit=1, fill with 1s)
```

Both methods preserve the numeric value. Sign extension works because filling with the sign bit maintains the two's complement value.

### 3.3 Truncation

When converting to a **smaller** type, C **drops the higher-order bits** (truncates). This can change the value significantly.

```c
int x = 53191;           // 0000 0000 0000 0000 1100 1111 1100 0111
short sx = x;            // drops top 16 bits → 1100 1111 1100 0111 = -12345 !
int y = sx;              // sign-extends back → 1111 1111 1111 1111 1100 1111 1100 0111 = -12345
```

For unsigned truncation: the result is the original value **mod** $2^k$ where $k$ is the new bit width.
For signed truncation: similar behavior, but the result is then reinterpreted as two's complement.

> **Practice:** `short x = 130; char cx = x;`
> 130 = `0b0000 0000 1000 0010`. Take lowest 8 bits: `1000 0010` = −126 (as `char`). So `cx = -126`.

> **Practice:** `short x = -132; char cx = x;`
> −132 = `0b1111 1111 0111 1100`. Take lowest 8 bits: `0111 1100` = 124. So `cx = 124`.

### 3.4 Mixed-Type Comparisons

**Critical rule:** When C compares a signed and an unsigned integer, it **implicitly casts the signed value to unsigned**, then compares both as non-negative. This leads to very surprising results:

| Expression                       | Type     | Result | Expected? |
|:---|:---|:---:|:---:|
| `0 == 0U`                        | unsigned | 1      | ✓         |
| `-1 < 0`                         | signed   | 1      | ✓         |
| `-1 < 0U`                        | unsigned | **0**  | ✗ (-1 cast to unsigned = huge number) |
| `2147483647U > -2147483647 - 1`  | unsigned | **0**  | ✗         |
| `2147483647 > (int)2147483648U`  | signed   | **1** (wrong!) | ✗ (2147483648U overflows int → TMin) |
| `(unsigned)-1 > -2`              | unsigned | 1      | ✓         |

**The danger:** Any function or comparison that mixes `int` and `unsigned int` may behave incorrectly. Always be intentional about types.

## 4. Byte Ordering (Endianness)

Multi-byte values (e.g., a 4-byte `int`) must be stored somewhere in memory. The question is: in what order are the bytes stored?

**Big Endian:** Most significant byte at the lowest address (the "big end" first). Used by: older SPARC, PowerPC, network protocols.

**Little Endian:** Least significant byte at the lowest address (the "little end" first). Used by: x86, x86-64, most modern processors (ARM in default mode).

> **Example:** `int x = 0x01234567` at address `0x100`:
>
> | Address | Big Endian | Little Endian |
> |:--------|:---------:|:------------:|
> | 0x100   | 01        | 67            |
> | 0x101   | 23        | 45            |
> | 0x102   | 45        | 23            |
> | 0x103   | 67        | 01            |

**Why it matters:** When you send data over a network, or read a binary file from a different architecture, you must handle byte order. Network protocols use Big Endian ("network byte order").

## 5. Bitwise Operators

### 5.1 AND, OR, NOT, XOR

These operators work **bit by bit** on the binary representation of integers.

#### AND (`&`)
Output is 1 only if **both** bits are 1.

| a | b | a & b |
|:---:|:---:|:-----:|
| 0 | 0 | 0     |
| 0 | 1 | 0     |
| 1 | 0 | 0     |
| 1 | 1 | **1** |

Mnemonic: `& 1` lets a bit through; `& 0` forces it to 0 ("zeroing out").

#### OR (`|`)
Output is 1 if **either** bit is 1.

| a | b | a \| b |
|:---:|:---:|:------:|
| 0 | 0 | 0      |
| 0 | 1 | **1**  |
| 1 | 0 | **1**  |
| 1 | 1 | **1**  |

Mnemonic: `| 1` forces a bit to 1 ("turning on"); `| 0` lets a bit through.

#### NOT (`~`)
Unary operator. Flips every bit.

| a | ~a |
|:---:|:---:|
| 0 | 1  |
| 1 | 0  |

#### XOR (`^`)
Output is 1 if **exactly one** bit is 1.

| a | b | a ^ b |
|:---:|:---:|:-----:|
| 0 | 0 | 0     |
| 0 | 1 | **1** |
| 1 | 0 | **1** |
| 1 | 1 | 0     |

Mnemonic: `^ 1` flips a bit; `^ 0` leaves a bit unchanged.

#### Multi-bit Example

```text
AND:          OR:           XOR:          NOT:
  0110 1100     0110 1100     0110 1100    ~1100
& 1010 1010   | 1010 1010   ^ 1010 1010   ------
-----------   -----------   -----------    0011
  0010 1000     1110 1110     1100 0110
```

### 5.2 Bitwise vs. Logical Operators

This is a **very common source of bugs** and exam questions. Do not confuse:

| Bitwise | Logical | Behavior |
|:--------|:--------|:---------|
| `&`     | `&&`    | Bitwise AND vs. "both are nonzero?" |
| `\|`    | `\|\|`  | Bitwise OR vs. "either is nonzero?" |
| `~`     | `!`     | Flip all bits vs. "is this zero?" |

```c
int a = 6;   // 0b0110
int b = 12;  // 0b1100

a & b  = 4   // bitwise: 0b0100
a && b = 1   // logical: both nonzero → true (1)

a | b  = 14  // bitwise: 0b1110
a || b = 1   // logical: either nonzero → true (1)

~b     = ... // flips all 32 bits of 12
!b     = 0   // logical: b is nonzero → false (0)
```

### 5.3 Bitmasks

A **bitmask** is a carefully crafted bit pattern used with bitwise operators to isolate, set, clear, or flip specific bits in a larger value.

**Common operations:**

| Operation                  | How to do it        | Example                      |                   |         |
|:---|:---|:---|:---|:---|
| **Set** bit $k$ to 1       | `x`                 | `= (1 << k)`                 | Turn on bit 3: `x | = 0x08` |
| **Clear** bit $k$ to 0     | `x &= ~(1 << k)`    | Turn off bit 3: `x &= ~0x08` |                   |         |
| **Test** if bit $k$ is set | `if (x & (1 << k))` | Check bit 3: `if (x & 0x08)` |                   |         |
| **Flip** bit $k$           | `x ^= (1 << k)`     | Toggle bit 3: `x ^= 0x08`    |                   |         |
| **Get** lowest byte        | `x & 0xff`          | Mask to 8 bits               |                   |         |
| **Get** second byte        | `(x >> 8) & 0xff`   |                              |                   |         |

**Summary of bitwise tricks:**
- `| 1` → turn bit ON
- `& 0` → turn bit OFF
- `^ 1` → flip bit
- `& mask` → isolate bits (intersection)
- `| mask` → set bits (union)
- `& ~mask` → clear bits

#### Bitmask Example — Bit Vector for Sets

Imagine representing which courses you've taken in a `char` (8 bits), one bit per course:

```c
#define COMP100  0x01  /* 0000 0001 */
#define COMP106  0x02  /* 0000 0010 */
#define COMP201  0x08  /* 0000 1000 */
#define COMP202  0x10  /* 0001 0000 */

char myClasses = 0b00100011;  // taking COMP100, COMP106, COMP291

myClasses |= COMP201;          // add COMP201: OR with its mask
myClasses &= ~COMP100;         // drop COMP100: AND with NOT of its mask
if (myClasses & COMP202) { ... }  // test if COMP202 is set
```

**Check if n is a power of 2 (without loops):**
Any power of 2 has exactly one bit set: `1000...0`. Subtract 1 and you get `0111...1`. Their AND is always 0.
```c
int is_power_of_2 = (n > 0) && !(n & (n - 1));
```

#### Practice: Setting/Reading Bytes of a 32-bit int

```c
int j = ...;
int lowest_byte   = j & 0xff;             // isolate lowest byte
int set_lowest_ff = j | 0xff;             // set lowest byte to all 1s
int flip_all_but_lowest = j ^ ~0xff;      // XOR flips bits where mask is 1
                                          // ~0xff = 0xFFFFFF00 → flips top 3 bytes
```

### 5.4 Bit Shift Operators

#### Left Shift (`<<`)

Shifts bits to the left by $k$ positions. New low-order bits are filled with **0s**. Bits shifted off the left end are discarded.

```c
x << k   // evaluates to x shifted left by k bits
x <<= k  // in-place left shift

// 8-bit examples:
0b00110111 << 2  →  0b11011100
0b10010101 << 4  →  0b01010000  (top bits discarded)
```

**Key insight:** Left-shifting by $k$ is equivalent to multiplying by $2^k$ (as long as no significant bits are lost).

#### Right Shift (`>>`)

Shifts bits to the right by $k$ positions. Bits shifted off the right end are discarded. The key question is: what fills the new **high-order** bits?

There are **two types** of right shift:

**Logical right shift:** Always fills with **0s**. Used for **unsigned** integers.

**Arithmetic right shift:** Fills with the **sign bit** (MSB). Used for **signed** integers.

```c
// Unsigned (logical):
unsigned short x = 2;   // 0000 0000 0000 0010
x >>= 1;                // 0000 0000 0000 0001  (fills with 0)
// x is now 1 ✓

// Signed (arithmetic):
short x = -2;           // 1111 1111 1111 1110
x >>= 1;                // 1111 1111 1111 1111  (fills with sign bit = 1)
// x is now -1 ✓  (preserves sign!)

// Signed logical (WRONG behavior):
short x = -2;           // 1111 1111 1111 1110
// if logical were used: 0111 1111 1111 1111 = +32767  ✗
```

**Why arithmetic right shift?** Right-shifting a signed integer by $k$ is equivalent to dividing by $2^k$ (rounded toward negative infinity). Arithmetic shift preserves this property.

**Rule in C:** The C standard says that right-shifting signed integers is *implementation-defined*, but virtually all modern compilers use arithmetic shift for signed and logical shift for unsigned.

#### Shift Pitfalls

1. **Operator precedence:** `+` and `-` have **higher** precedence than `<<` and `>>`. So `1 << 2 + 3` means `1 << 5 = 32`, not `(1 << 2) + 3 = 7`. **Always use parentheses.**

2. **Shifting by ≥ width:** The result is undefined in C if you shift by a number ≥ the bit width of the type (e.g., shifting a 32-bit int by 32 or more).

3. **Left shift and overflow:** If a left shift causes bits to be lost (overflow), the result is undefined for signed integers.

## 6. Floating Point Numbers

### 6.1 Why Integers Are Not Enough

Integers can't represent numbers like 3.14, 0.001, or $6.02 \times 10^{23}$. We need a way to represent **real numbers**.

The fundamental challenge: between any two real numbers, there are infinitely many others. With a fixed number of bits, we can only represent a finite set of values — so **approximation is inevitable**.

Every number base has numbers that can't be represented exactly:
- Base 10: $1/6 = 0.16666...$
- Base 2: $1/10 = 0.000110011001100...$

So even numbers we can write exactly in decimal (like 0.1) often can't be stored exactly in binary floating point.

### 6.2 Fixed Point (and Why It Fails)

**Fixed point idea:** Designate some bits for the integer part and some for the fractional part, like a decimal point that never moves.

```text
1 0 1 1 . 0 1 1
8s 4s 2s 1s  1/2s 1/4s 1/8s
= 8 + 2 + 1 + 1/4 + 1/8 = 11.375
```

**Problem:** The decimal point is in a fixed position, so you must decide in advance how large and how precise your numbers can be. To represent both $10^{38}$ and $10^{-38}$, you'd need over 200 bits. The range vs. precision tradeoff is terrible.

### 6.3 IEEE 754 Floating Point

The standard approach is to use **scientific notation in binary**. A number is stored as:

$$(-1)^s \times M \times 2^E$$

where:
- $s$ is the **sign bit** (0 = positive, 1 = negative)
- $M$ is the **significand** (mantissa), a number in the range $[1.0, 2.0)$
- $E$ is the **exponent**

#### IEEE 754 Single Precision (32-bit `float`)

```text
[ s | exponent (8 bits) | fraction (23 bits) ]
  1        8                    23             = 32 bits total
```

#### IEEE 754 Double Precision (64-bit `double`)

```text
[ s | exponent (11 bits) | fraction (52 bits) ]
  1        11                    52            = 64 bits total
```

#### The Exponent Field (Biased Representation)

The exponent is **not** stored in two's complement. Instead it uses a **biased (excess)** representation so that:
- Larger exponent bits = larger value
- Unsigned integer comparison works directly on floats

For 32-bit floats (8 exponent bits), the **bias is 127**:

$$E_{actual} = E_{stored} - 127$$

So if the stored exponent bits are `10000000` (= 128 in decimal), the actual exponent is $128 - 127 = 1$.

The stored values `00000000` (0) and `11111111` (255) are **reserved** for special cases (see below), so the range of actual exponents for normalized numbers is **−126 to +127**.

| Stored Exponent | Actual Exponent ($E_{stored} - 127$) |
|:---|:---|
| 11111110 = 254  | +127                                 |
| 11111101 = 253  | +126                                 |
| ...             | ...                                  |
| 10000000 = 128  | +1                                   |
| 01111111 = 127  | 0                                    |
| 01111110 = 126  | -1                                   |
| ...             | ...                                  |
| 00000001 = 1    | -126                                 |
| 00000000 = 0    | RESERVED (denormalized)              |
| 11111111 = 255  | RESERVED (∞ or NaN)                  |

**Bias for $k$-bit exponent field:** $\text{bias} = 2^{k-1} - 1$

So for an 8-bit field: bias = $2^7 - 1 = 127$. For a 4-bit field: bias = $2^3 - 1 = 7$.

#### The Fraction Field (Implicit Leading 1)

In normalized mode, the significand $M$ is always in the range $[1.0, 2.0)$. We can always write it as $1.xxxxx_2$ (one bit to the left of the binary point, which is always 1). Since the leading 1 is implicit, we only store the fractional part $xxx...$

This gives us **one extra bit of precision for free!** A 23-bit fraction field effectively stores 24 bits of precision.

$$M = 1.\underbrace{f_{22}f_{21}...f_1f_0}_{\text{23 fraction bits}}$$

$$\text{Value} = (-1)^s \times 1.\text{frac} \times 2^{E_{actual}}$$

#### Step-by-Step: Encoding a Number

**Example: Encode −0.75 in 32-bit IEEE 754**

1. **Sign:** −0.75 is negative → $s = 1$
2. **Convert to binary:** $0.75 = 0.5 + 0.25 = 2^{-1} + 2^{-2}$ → $0.11_2$
3. **Normalize:** $0.11_2 = 1.1_2 \times 2^{-1}$
4. **Exponent:** $E_{actual} = -1$ → $E_{stored} = -1 + 127 = 126$ → `01111110`
5. **Fraction:** $1.\mathbf{1}000...0$ → store `10000000000000000000000` (just the part after the decimal point)
6. **Result:** `1 01111110 10000000000000000000000`

**Example: Decode `0 10000001 01000000000000000000000`**

1. **Sign:** $s = 0$ → positive
2. **Exponent:** stored = `10000001` = 129 → $E = 129 - 127 = 2$
3. **Fraction:** `01000000000000000000000` → $M = 1.01_2 = 1 + 0.25 = 1.25$
4. **Value:** $1.25 \times 2^2 = 5.0$

### 6.4 Normalized vs. Denormalized Numbers

#### Normalized Numbers (exponent ≠ 0 and ≠ all-1s)

These are the standard numbers. The implicit leading 1 applies:
$$M = 1.\text{frac}, \quad E = E_{stored} - \text{bias}$$

#### Denormalized Numbers (exponent = all 0s)

When the stored exponent is 0, we switch to **denormalized mode**:
- The implicit leading 1 is **dropped** (becomes 0.frac)
- The exponent is treated as $E = 1 - \text{bias}$ (NOT $0 - \text{bias}$)

$$M = 0.\text{frac}, \quad E = 1 - \text{bias}$$

For 32-bit floats: $E = 1 - 127 = -126$

**Why denormalized?** They fill in the gap between 0 and the smallest normalized number. Without them, there'd be a huge jump (underflow cliff). With them, numbers **gradually** get less precise as they approach 0 ("gradual underflow").

If the fraction is also all 0s, the value is **±0** (both positive and negative zero exist).

### 6.5 Special Values (±∞, NaN, ±0)

| Exponent | Fraction | Value |
|:---|:---|:---|
| 0 (all zeros) | 0 (all zeros) | ±0 (based on sign bit) |
| 0 (all zeros) | nonzero | Denormalized number |
| 1–254 | anything | Normalized number |
| 255 (all ones) | 0 (all zeros) | ±∞ (based on sign bit) |
| 255 (all ones) | nonzero | NaN (Not a Number) |

**Infinity (±∞):** Results from dividing by zero or overflow. Useful: `∞ + x = ∞` for any finite x. `∞ - ∞ = NaN`.

**NaN (Not a Number):** Results from undefined operations:
- $\sqrt{-1}$
- $\infty - \infty$
- $\infty / \infty$
- $0 \times \infty$

NaN is "infectious": any operation involving NaN returns NaN.

**Two zeros (±0):** IEEE 754 has both `+0.0` and `-0.0`. They compare as equal: `(+0.0 == -0.0)` is true.

### 6.6 Tiny Floating Point Examples

The exam frequently gives you a **custom small format** and asks you to encode/decode values. Here's how to handle any custom format:

**General formula for a custom N-bit format with k exponent bits and (N-1-k) fraction bits:**
$$\text{bias} = 2^{k-1} - 1$$

**Example: 8-bit format with 4 exponent bits, 3 fraction bits, bias = 7**

Layout: `[s | e3 e2 e1 e0 | f2 f1 f0]`

Let's work out a few values:

| s | exp  | frac | Type         | Value |
|:---:|:----:|:----:|:-------------|:------|
| 0 | 0000 | 000  | +Zero        | 0     |
| 0 | 0000 | 001  | Denormalized | $0.001 \times 2^{-6} = 1/512$ |
| 0 | 0001 | 000  | Normalized   | $1.000 \times 2^{1-7} = 1 \times 2^{-6} = 1/64$ |
| 0 | 0111 | 000  | Normalized   | $1.000 \times 2^{7-7} = 1$ |
| 0 | 0111 | 001  | Normalized   | $1.001 \times 2^0 = 9/8$ |
| 0 | 1110 | 111  | Normalized   | $1.111 \times 2^7 = 15/8 \times 128 = 240$ |
| 0 | 1111 | 000  | +∞           | +∞   |
| 1 | 0000 | 000  | -Zero        | −0   |

**Step-by-step to encode a decimal value in a custom format:**

1. Determine sign bit.
2. Convert the absolute value to binary.
3. Normalize: write as $1.xxx \times 2^E$ (or $0.xxx \times 2^{1-\text{bias}}$ for denormalized).
4. Compute stored exponent: $E_{stored} = E + \text{bias}$.
5. Extract the fraction bits (the part after the binary point in normalized form).

> **Worked example (from past midterm):** 8-bit format: 1 sign bit, 3 exponent bits, 4 fraction bits. Bias = 3. Encode −5/64.
>
> 1. Sign = 1 (negative)
> 2. $5/64 = 5 \times 2^{-6}$. In binary: $5 = 101_2$ so $5/64 = 0.000101_2$
> 3. Normalize: $1.01 \times 2^{-4}$
> 4. Stored exponent: $-4 + 3 = -1$. But stored exponent must be ≥ 1 for normalized. Since $-1 < 1-3 = -2$... let's check: $E_{min} = 1 - \text{bias} = 1 - 3 = -2$. Since $-4 < -2$, this is denormalized.
>    - For denormalized: $E = 1 - 3 = -2$, so value = $(-1)^1 \times 0.\text{frac} \times 2^{-2}$
>    - $5/64 = 0.\text{frac} \times 2^{-2}$ → $0.\text{frac} = 5/64 \times 4 = 5/16 = 0.0101_2$
>    - frac bits = `0101`
> 5. Result: `1 000 0101` → confirms: $V = -1 \times 0.0101 \times 2^{-2} = -0.0101/4 = -5/64$ ✓

### 6.7 Floating Point Arithmetic Pitfalls

#### Floating Point is NOT Associative

```c
float a = 3.14;
float b = 1e20;

(a + b) - b  = 0.0       // loses 3.14 when adding to 1e20
a + (b - b)  = 3.14      // evaluates 1e20 - 1e20 = 0 first
```

**Why?** When adding 3.14 and 1e20, we must align binary points. 3.14 is about $2^1$ while 1e20 is about $2^{66}$. To add them, we shift 3.14's binary point 65 places right — it disappears beyond the 23 fraction bits we have. The result is indistinguishable from 1e20.

The order of operations **matters** for floating point. Never assume associativity.

#### Floating Point Equality is Unreliable

Because of rounding, `0.1 + 0.2` in floating point is not exactly `0.3`. **Never compare floats with `==`.** Use a tolerance check:

```c
// Bad:
if (a == b) { ... }

// Good:
if (fabs(a - b) < 1e-9) { ... }
```

#### Float Puzzles (know these for the exam!)

Assume `int x`, `float f`, `double d` (neither d nor f is NaN):

| Expression | True/False? | Why |
|:---|:---:|:---|
| `x == (int)(float)x` | **Sometimes False** | int → float may round (float has only 24 bits of mantissa) |
| `x == (int)(double)x` | **Always True** | double has 53 mantissa bits, enough for any 32-bit int |
| `f == (float)(double)f` | **Always True** | widening then narrowing float is lossless |
| `d == (float)d` | **Sometimes False** | double → float loses precision |
| `f == -(-f)` | **Always True** | negation just flips sign bit |
| `2/3 == 2/3.0` | **False** | `2/3` is integer division (= 0); `2/3.0` is float (≈ 0.667) |
| `d * d >= 0.0` | **Always True** | squaring a real number is always ≥ 0 (NaN excluded) |
| `(d+f)-d == f` | **Sometimes False** | non-associativity |

### 6.8 Floating Point in C

**C types:**
- `float` → single precision (32-bit)
- `double` → double precision (64-bit)

**Casting behavior:**

| Conversion | Behavior |
|:---|:---|
| `double`/`float` → `int` | Truncates (rounds toward zero). Undefined if out of range or NaN — typically gives TMin |
| `int` → `double` | Exact if int has ≤ 53 bits (always true for 32-bit int) |
| `int` → `float` | May round — float only has 24 bits of mantissa |

**Real-world example:** The Ariane 5 rocket crash (1996) was caused by converting a 64-bit double to a 16-bit signed integer. The value exceeded the 16-bit range, causing overflow and a hardware exception. The software was reused from Ariane 4, which flew slower and never triggered the overflow.

## 7. Key Formulas & Quick Reference

### Integer Quick Reference

| Concept | Formula |
|:---|:---|
| Unsigned range ($w$ bits) | $0$ to $2^w - 1$ |
| Signed range ($w$ bits) | $-2^{w-1}$ to $2^{w-1} - 1$ |
| TMax ($w$ bits) | $2^{w-1} - 1$ |
| TMin ($w$ bits) | $-2^{w-1}$ |
| Negate (two's complement) | $\sim x + 1$ |
| $x + TMax + 1 = x - 1$ mod $2^w$ | (overflow wraps) |

### Floating Point Quick Reference

| Field | 32-bit float | 64-bit double |
|:---|:---|:---|
| Sign bits | 1 | 1 |
| Exponent bits | 8 | 11 |
| Fraction bits | 23 | 52 |
| Bias | 127 | 1023 |
| Normalized exponent range | −126 to 127 | −1022 to 1023 |
| Approximate range | $\pm 1.2 \times 10^{-38}$ to $\pm 3.4 \times 10^{38}$ | $\pm 2.2 \times 10^{-308}$ to $\pm 1.8 \times 10^{308}$ |

### Encoding Summary

| Case | Exponent | Fraction | Value Formula |
|:---|:---|:---|:---|
| Normalized | $1$ to max-1 | any | $(-1)^s \times 1.\text{frac} \times 2^{E-\text{bias}}$ |
| Denormalized | all 0s | nonzero | $(-1)^s \times 0.\text{frac} \times 2^{1-\text{bias}}$ |
| ±0 | all 0s | all 0s | $\pm 0$ |
| ±∞ | all 1s | all 0s | $\pm \infty$ |
| NaN | all 1s | nonzero | NaN |

### Bitwise Operator Summary

| Operator | Symbol | Effect |
|:---|:---|:---|
| AND | `&` | Both bits must be 1 |
| OR | `\|` | At least one bit is 1 |
| XOR | `^` | Exactly one bit is 1 |
| NOT | `~` | Flip all bits |
| Left shift | `<<` | Shift left, fill 0s (× $2^k$) |
| Right shift | `>>` | Shift right (÷ $2^k$), fill 0s (unsigned) or sign bit (signed) |

## 8. Exam-Style Practice Problems

### Problem Set 1: Integer Representations (Like Midterm Q1)

Assume a **10-bit machine** where:
- Two's complement is used for signed integers
- `short` integers are encoded using 5 bits
- Sign extension occurs when `short` is cast to `int`
- All shift operations are arithmetic

```c
short sa = -7;
int b = 2 * sa;
int a = -32;
short sb = (short) a;
unsigned short ua = a + 28;
```

Fill in the table:

| Expression | Decimal | Hex |
|:---|---:|:---|
| Zero | 0 | 0x000 |
| `(short) 1` | 1 | 0x001 |
| `sa` | −7 | ? |
| `b` | −14 | ? |
| `sb` | ? | ? |
| `ua` | ? | ? |
| `a >> 2` | ? | ? |
| `ua >> 2` | ? | ? |
| `b << 3` | ? | ? |
| TMax (short) | ? | ? |

**Solutions:**

- `sa = -7`: In 5-bit two's complement, TMax = 15, TMin = -16. −7 in 5-bit: `11001`. As a 10-bit two's complement value: sign-extend → `1111111001`. Hex of 10-bit: group as `11 1111 1001` → `0x1F9`... wait, we need 10 bits = `11 1111 1001`. In hex (grouping from right, 4+4+2): the 10-bit pattern is `1111111001`. As an unsigned 10-bit value: $512+256+128+64+32+16+8+0+0+1 = 1017$, but as signed 10-bit: $-1024+... = $ actually this is signed. TMin for 10-bit short (5-bit): let me redo.

  Actually, the machine has 10-bit ints and 5-bit shorts. So `short` is 5-bit, `int` is 10-bit.

  `sa = -7` in 5-bit two's complement: TMax₅ = 15, TMin₅ = -16. −7 = 5-bit two's complement: `~7 + 1 = ~00111 + 1 = 11000 + 1 = 11001`. As 10-bit (sign-extended): `1111111001`. Hex of 10-bit value `1111111001` (unsigned) = 0x3F9. As signed 10-bit: $-512 + 256 + 128 + 64 + 32 + 16 + 8 + 0 + 0 + 1 = -7$. So `sa = -7`, hex `0x3F9`.

  `b = 2*sa = -14`. In 10-bit two's complement: `~14 + 1 = ~0000001110 + 1 = 1111110001 + 1 = 1111110010`. Hex: `0x3F2`.

  `sb = (short)a`: `a = -32` in 10-bit. `short` is 5-bit. Truncate to lowest 5 bits. `−32` in 10-bit two's complement: `−32 = ~32+1 = ~0000100000+1 = 1111011111+1 = 1111100000`. Lowest 5 bits: `00000` = 0. `sb = 0`, hex `0x00`.

  `ua = a + 28 = -32 + 28 = -4`. Stored as `unsigned short` (5-bit unsigned). `−4` as 10-bit: `1111111100`. Truncate to 5 bits: `11100` = 28. So `ua = 28`, hex `0x1C`.

  `a >> 2 = -32 >> 2`. Arithmetic right shift: -32 / 4 = -8. `0x3F8`.

  `ua >> 2 = 28 >> 2`. Logical right shift (unsigned): 28 / 4 = 7. `0x007`.

  `b << 3 = -14 << 3 = -14 * 8 = -112`. In 10-bit: `−112`. `0x390`.

  TMax (short, 5-bit): $2^4 - 1 = 15$. `01111` = 15, `0x0F`.

### Problem Set 2: Bitwise Operations (Like Midterm Q1b)

Given `a` is a **32-bit signed int**, classify each expression:
- **Never zero** — always evaluates to nonzero
- **Sometimes zero** — zero for some values of a, nonzero for others
- **Always zero** — always evaluates to zero

| Expression | Answer | Reason |
|:---|:---:|:---|
| `(~a) \| a` | **Never zero** | Every bit of `~a \| a` is 1, regardless of `a`. Result = `0xFFFFFFFF`. |
| `(a << 1) & !!a` | **Sometimes zero** | If `a=0`, then `!!a = 0` → result is 0. If `a=1` (odd), `a<<1=2`, `!!a=1`, result = `2 & 1 = 0`. If `a=2`, result = `4 & 1 = 0`. Hmm. `!!a` is 0 or 1. `(a<<1) & 0 = 0` always when `a=0`. When `a≠0`, `!!a=1`, so result = `(a<<1) & 1`. Left-shifting by 1 makes LSB 0, so `(a<<1) & 1 = 0` always. So this is **always zero**. |
| `(a & 0x00ff) ^ (a & 0xff00)` | **Sometimes zero** | Zero when `a`'s byte 0 equals byte 1 (after XOR). For example, `a = 0x0101` → `(0x01) ^ (0x01<<8)` ... wait, byte masking: `a & 0x00ff` = lowest byte, `a & 0xff00` = second byte. XOR of two different-position values is 0 only when both are 0, i.e., when byte 0 and byte 1 of `a` are both 0. **Sometimes zero** (when `a`'s lowest two bytes are 0). |
| `a & (a << 1)` | **Sometimes zero** | Zero when `a=0`. Nonzero when adjacent bits in `a` are both 1 (e.g., `a=3=0b11`, `(3 << 1)=6=0b110`, `3 & 6 = 2`). **Sometimes zero**. |
| `~a + a + 1` | **Always zero** | `~a + 1 = -a` (two's complement negation). So `~a + a + 1 = (-a) + a = 0`. Always zero (including overflow). |

### Problem Set 3: Floating Point (Like Midterm Q2)

**8-bit floating point** format: 1 sign bit, 3 exponent bits, 4 fraction bits. Bias = 3.

Encode the following values:

| Value | Sign | Stored Exp | Fraction | Binary |
|:---|:---:|:---|:---|:---|
| 0.0 (positive) | 0 | 000 | 0000 | `0 000 0000` |
| 1.0 | 0 | 011 (=3, actual E=0) | 0000 | `0 011 0000` |
| −0.75 | 1 | 010 (=2, actual E=−1) | 1000 (= 0.5) | `1 010 1000` |
| +∞ | 0 | 111 | 0000 | `0 111 0000` |
| NaN | 0 | 111 | 0001 (any nonzero) | `0 111 0001` |
| Smallest pos. normalized | 0 | 001 | 0000 | `0 001 0000` |
| Largest pos. denormalized | 0 | 000 | 1111 | `0 000 1111` |
| Largest pos. normalized | 0 | 110 | 1111 | `0 110 1111` |

**Worked example: Encoding 1.0**
- Sign = 0
- $1.0 = 1.0 \times 2^0$ → E = 0 → stored exponent = 0 + 3 = 3 = `011`
- Fraction = part after implicit 1. = `0000`
- Result: `0 011 0000`

**Worked example: Encoding −0.75**
- Sign = 1 (negative)
- $0.75 = 0.11_2 = 1.1_2 \times 2^{-1}$ → E = −1 → stored = −1 + 3 = 2 = `010`
- Fraction = `1000` (just the `.1000...` part)
- Result: `1 010 1000`

**Worked example: Largest positive denormalized**
- Exponent = `000`, fraction = `1111`
- $M = 0.1111_2 = 15/16$
- $E = 1 - 3 = -2$
- Value = $15/16 \times 2^{-2} = 15/64 \approx 0.234$

**Worked example: Smallest positive normalized**
- Exponent = `001` (= 1 stored, actual E = 1 − 3 = −2), fraction = `0000`
- $M = 1.0000 = 1$
- Value = $1 \times 2^{-2} = 1/4 = 0.25$

Notice: the smallest normalized (0.25) is larger than the largest denormalized (15/64 ≈ 0.234) — there's a small gap filled by denormalized numbers.

### Problem Set 4: Sign Extension and Truncation

```c
// On a standard 64-bit machine:
short x = -132;  // 16-bit: 0b1111 1111 0111 1100
char cx = x;     // truncate to 8 bits: 0111 1100 = ?
```
Answer: `0111 1100` = 124. `cx = 124`.

```c
short x = 390;   // 0b0000 0001 1000 0110
char cx = x;     // truncate to 8 bits: 1000 0110 = ?
```
Answer: `1000 0110` = −122 (as signed char). `cx = -122`.

### Problem Set 5: Casting and Mixed-Type Comparisons

For each expression, give the result (0 = false, 1 = true):

```c
int x = -1;
unsigned int ux = x;  // ux = 4294967295 (UINT_MAX)

x < 0         → 1   (signed comparison)
ux < 0        → 0   (unsigned, can never be negative)
x < ux        → 0   (x cast to unsigned = huge number > 0)
x == ux       → 1   (same bits, == compares bits after type promotion)
(int)ux == x  → 1   (cast ux back to int = -1)
ux == UINT_MAX → 1
```

## Common Exam Traps — Watch Out For These!

1. **TMin is its own negation.** In 32-bit: `~(-2147483648) + 1 = 2147483647 + 1` which overflows back to −2147483648. So `−INT_MIN = INT_MIN`.

2. **Signed overflow is undefined behavior in C.** The compiler can assume it never happens. `INT_MAX + 1` is not `INT_MIN` in well-defined C code (even though it is in practice on most hardware).

3. **Unsigned overflow is well-defined** — it wraps modulo $2^w$.

4. **Left shifting a signed integer can cause undefined behavior** if significant bits are lost.

5. **Float and int are completely different bit layouts** — casting between them does NOT preserve bit patterns. `(float)x` recomputes the value; `*(float *)&x` reinterprets the bits (different operation entirely).

6. **`~a + a + 1 = 0` always** — useful identity. Similarly, `~a = -a - 1`.

7. **Denormalized exponent trick:** When the stored exponent is all zeros, the actual exponent is $1 - \text{bias}$, NOT $0 - \text{bias}$. This ensures a smooth transition between denormalized and normalized numbers.

8. **Two zeros in float:** `+0.0` and `-0.0` have different bit patterns but compare as equal.

9. **NaN is not equal to anything, including itself.** The only way to test for NaN is `isnan(x)` or `x != x`.

10. **Shift by $k \geq$ word size is undefined.** Don't shift a 32-bit int by 32 or more bits.

*These notes cover all material from Lectures 2, 3, and 4 of COMP201. Combined with working through past midterm problems, you should be fully prepared for the Data Representations portion of the exam. Good luck!*
