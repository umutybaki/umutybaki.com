---
title: "COMP 202 - Midterm Study Guide"
date: "2026-04-19"
description: "Compiled from four past midterms with new practice problems and full step-by-step solutions."
---

# COMP 202 - Midterm Study Guide

> Compiled from four past midterms: Sample Midterm, Fall 2019 MT1, Fall 2019 MT2, and Fall 2022.
> Contains **original past questions** (with solutions) plus **new practice problems** with full
> step-by-step solutions, organized by topic.
>
> **Excluded topics:** Sorting and Graphs. Past sorting questions are preserved for reference but
> no new sorting/graph practice problems are generated.


## 1. Complexity and Big-O Notation

### Past Questions

**[Fall 2019 MT1 Q2] Big-O of three functions:**

```text
(a) easy(N)
      if(N == 0) return 0
      return N + easy(N/2)

(b) foo(N)
      x = 0
      k = log(N)
      for (i = 0; i < N; i = i+k)
        x = x + easy(N)
      return x

(c) bar(N)
      if(N == 0) return 0
      bar(N/4)
      k = squareRoot(N)
      x = 0
      for (i = 0; i < k; i++) x = x + i
      bar(N/4)
```

**Solution:**

- **(a)** `easy` halves N each call; recurrence `T(N) = T(N/2) + O(1)` → **O(log N)**.
- **(b)** Loop runs N/log(N) times; inside each iteration `easy(N) = O(log N)`. Total = (N/log N) · log N = **O(N)**.
- **(c)** Two recursive calls on N/4 plus √N work per node. Let `N = 2^(2k)`. The recursion tree has `log₄(N) = (log N)/2` levels. At level i there are 2ⁱ nodes, each doing `√(N/4ⁱ) = √N / 2ⁱ` work, so work per level = 2ⁱ · √N / 2ⁱ = √N. Total = **O(√N · log N)**.


### New Practice Questions

**Q1.1** Give the Big-O of the following in terms of n:

```text
fun(n):
  if n <= 1: return 1
  s = 0
  for i = 1 to n:
    for j = i to n:
      s = s + 1
  return s + fun(n - 2)
```

<details>
<summary><b>Solution</b></summary>

The nested loop runs `n + (n-1) + (n-2) + ... + 1 = n(n+1)/2 = O(n²)` per call.
The recurrence is `T(n) = T(n-2) + O(n²)`. Expanding:
`T(n) = O(n²) + O((n-2)²) + ... + O(1) = O(n² + (n-2)² + ... ) = O(n³)` (sum of `n/2` terms each O(n²)).

**Answer:** O(n³)
</details>


**Q1.2** Compare the growth rates and rank from slowest-growing to fastest-growing:

`n log n`, `2ⁿ`, `n²`, `log(n!)`, `n^1.5`, `n`, `n^(log n)`, `(log n)²`

<details>
<summary><b>Solution</b></summary>

Key facts:
- `log(n!) = Θ(n log n)` (Stirling).
- `n^(log n) = 2^((log n)²)` grows faster than any polynomial but slower than 2ⁿ.
- `(log n)²` grows slower than any positive power of n.

**Order:** (slowest → fastest)
`(log n)² < n < n log n ≡ log(n!) < n^1.5 < n² < n^(log n) < 2ⁿ`
</details>


**Q1.3** A function does `f(n) = 3n² + 100n + 50`. Prove formally that `f(n) ∈ O(n²)` using the definition of Big-O.

<details>
<summary><b>Solution</b></summary>

By definition, `f(n) ∈ O(g(n))` iff there exist constants `c > 0` and `n₀ ≥ 0` such that for all `n ≥ n₀`, `f(n) ≤ c · g(n)`.

Pick `g(n) = n²`. For `n ≥ 1`: `100n ≤ 100n²` and `50 ≤ 50n²`, so
`f(n) = 3n² + 100n + 50 ≤ 3n² + 100n² + 50n² = 153n²`.

Choose **c = 153** and **n₀ = 1**. Then `f(n) ≤ 153 · n²` for all `n ≥ 1`. Hence `f(n) ∈ O(n²)`. ∎
</details>


**Q1.4** What is the tightest Big-O bound for the following?

```text
foo(n):
  i = n
  while i > 1:
    j = i
    while j > 1:
      j = j / 2
    i = i / 2
```

<details>
<summary><b>Solution</b></summary>

Outer loop: runs `log₂ n` times (`i` halves each iteration).
Inner loop: runs `log₂ i` times, which for each outer iteration is at most `log₂ n`.
Total work: `log n · log n = (log n)²`.

**Answer:** O((log n)²)
</details>


## 2. Recursion and Recurrence Relations

### Recursion and Recurrence Relations Past Questions

**[Sample Q1] Tree Height - recursive.** Fill in `nodeHeight` for a BST and give Big-O.

<details>
<summary><b>Solution</b></summary>

```java
int nodeHeight(BSTNode n) {
  if (n == null) return 0;
  int lh = nodeHeight(n.left);
  int rh = nodeHeight(n.right);
  return 1 + Math.max(lh, rh);
}
```

Every node is visited exactly once → **O(n)** where n is the number of nodes.
</details>


**[Sample Q2] Recurrence for `bar`:**

```text
bar(a):
  if a.size() == 1: return 1
  else: b = a[0 .. n-2]; return 1 + bar(b)
```

<details>
<summary><b>Solution</b></summary>

Copying the first n−1 elements costs `O(n)`. Recurrence: `T(n) = T(n-1) + O(n)`.
Expand: `T(n) = n + (n-1) + (n-2) + ... + 1 = n(n+1)/2`.

**Formal proof `T(n) ∈ O(n²)`:** choose `c = 1`, `n₀ = 1`; then `T(n) = n(n+1)/2 ≤ n²` for all `n ≥ 1`.

**Answer:** O(n²)
</details>


### Recursion and Recurrence Relations New Practice Questions

**Q2.1** Write a recursive method `sumPositive(int[] a, int i)` that returns the sum of all positive numbers in array `a` starting at index `i`. Give its time complexity.

<details>
<summary><b>Solution</b></summary>

```java
int sumPositive(int[] a, int i) {
  if (i >= a.length) return 0;            // base case
  int rest = sumPositive(a, i + 1);       // recursive call
  return (a[i] > 0 ? a[i] : 0) + rest;
}
```

Call with `sumPositive(a, 0)`. Recurrence: `T(n) = T(n-1) + O(1)` → **O(n)**.
</details>


**Q2.2** Write a recurrence and solve for:

```text
mystery(n):
  if n <= 1: return 1
  x = mystery(n/2)
  y = mystery(n/2)
  return x + y + n
```

<details>
<summary><b>Solution</b></summary>

Two recursive calls of size n/2 and O(n) extra work.
Recurrence: `T(n) = 2 T(n/2) + O(n)`.
By the Master Theorem (case 2), `T(n) = O(n log n)`.

Intuition: this is the merge-sort recurrence pattern.
</details>


**Q2.3** Given a single-linked list, write a recursive method that returns the number of nodes whose values are even. Give the asymptotic complexity.

<details>
<summary><b>Solution</b></summary>

```java
int countEven(Node head) {
  if (head == null) return 0;
  int restCount = countEven(head.next);
  return ((head.value % 2 == 0) ? 1 : 0) + restCount;
}
```

Recurrence `T(n) = T(n-1) + O(1)` → **O(n)** time, **O(n)** space (call stack).
</details>


**Q2.4** Consider:

```text
foo(n):
  if n == 0: return
  for i = 1 to n: print(i)
  foo(n-1)
  foo(n-1)
```

Write the recurrence and find its Big-O.

<details>
<summary><b>Solution</b></summary>

Work at each call: O(n) for the loop plus 2 recursive calls on n−1.
`T(n) = 2 T(n-1) + O(n)`.

Expansion: `T(n) = n + 2(n-1) + 4(n-2) + ... + 2ⁿ·0 ≈ 2ⁿ · (constant)`.
More precisely, `T(n) = O(2ⁿ)` because the 2ⁿ geometric term dominates.

**Answer:** O(2ⁿ)
</details>


## 3. Linked Lists

### Linked Lists Past Questions

**[Sample Q5] `combineDuplicates`** on a singly-linked list. Merge consecutive duplicate values into a single node whose value is the sum.

```text
Input:   {3,3,2,4,4,4,-1,-1,4,12,12,12,12,48,-5,-5}
Output:  {6,2,12,-2,4,48,48,-10}
```

<details>
<summary><b>Solution (one pass, O(n))</b></summary>

```java
void combineDuplicates(Node head) {
  if (head == null) return;
  Node current = head;
  while (current != null &and current.next != null) {
    if (current.value == current.next.value) {
      current.value = current.value + current.next.value;
      current.next = current.next.next;     // skip the duplicate
      // stay on current - we may need to merge another duplicate
    } else {
      current = current.next;               // advance
    }
  }
}
```

Each node is visited at most once (either merged and removed, or advanced past). **O(n)**.
</details>


### Linked Lists New Practice Questions

**Q3.1** Given the head of a **singly-linked list**, write a method `reverse(Node head)` that reverses the list in-place and returns the new head. Analyze time and space complexity.

<details>
<summary><b>Solution</b></summary>

```java
Node reverse(Node head) {
  Node prev = null;
  Node curr = head;
  while (curr != null) {
    Node nxt = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nxt;
  }
  return prev;       // new head
}
```

**Time: O(n)** - one pass.
**Space: O(1)** - constant extra pointers, in-place.
</details>


**Q3.2** Write a method that detects whether a singly-linked list contains a cycle. Analyze time and space.

<details>
<summary><b>Solution (Floyd's tortoise-and-hare)</b></summary>

```java
boolean hasCycle(Node head) {
  Node slow = head, fast = head;
  while (fast != null &and fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
  }
  return false;
}
```

**Time: O(n)**  - if a cycle exists, fast catches up to slow within one cycle length after slow enters the cycle.
**Space: O(1)**.
</details>


**Q3.3** Given the head of a **doubly-linked list**, write a method `isPalindrome(Node head, Node tail)` that returns true iff the sequence of values reads the same forward and backward. Analyze time and space.

<details>
<summary><b>Solution</b></summary>

```java
boolean isPalindrome(Node head, Node tail) {
  Node left = head, right = tail;
  while (left != null &and right != null &and left != right) {
    if (left.value != right.value) return false;
    if (left.next == right) return true;     // adjacent - even length done
    left = left.next;
    right = right.prev;
  }
  return true;
}
```

**Time: O(n)** - pointers meet in the middle after n/2 steps.
**Space: O(1)**.
</details>


**Q3.4** Write a method that removes every node whose value appears more than once in a singly-linked list (i.e., keep only nodes whose value is unique across the entire list). Describe the data structure used and analyze complexity.

<details>
<summary><b>Solution</b></summary>

Use a **HashMap<value, count>** to first count occurrences, then traverse again removing duplicates.

```java
Node removeAllDuplicates(Node head) {
  Map<Integer, Integer> count = new HashMap<>();
  for (Node c = head; c != null; c = c.next)
    count.merge(c.value, 1, Integer::sum);

  // dummy head to simplify deletion of first node
  Node dummy = new Node(0); dummy.next = head;
  Node prev = dummy;
  for (Node c = head; c != null; c = c.next) {
    if (count.get(c.value) > 1) prev.next = c.next;
    else                         prev = c;
  }
  return dummy.next;
}
```

Two passes → **O(n)** expected time (hashing), **O(n)** extra space for the map.
</details>


## 4. Stacks and Queues

### Stacks and Queues Past Questions

**[Sample Q4a] Problem with the following stack copy:**

```java
Stack copyStack(Stack stack) {
  Stack copy = new Stack();
  while (!stack.empty()) copy.push(stack.pop());
  return copy;
}
```

<details>
<summary><b>Solution</b></summary>

Two problems: (1) it **destroys** the original stack (the original is left empty because `pop` is destructive); (2) the returned copy is **reversed** relative to the original - pushing pops in order gives the reverse order.
</details>


**[Sample Q4b] Correct `copyStack` using two auxiliary stacks:**

<details>
<summary><b>Solution</b></summary>

```java
Stack copyStack(Stack stack) {
  Stack copy = new Stack();
  Stack temp = new Stack();

  // Move everything onto temp (reverses order)
  while (!stack.empty()) temp.push(stack.pop());

  // Pour temp back into both stack (restore) and copy (second reversal)
  while (!temp.empty()) {
    Object v = temp.pop();
    stack.push(v);
    copy.push(v);
  }
  // Now copy is reversed vs stack; reverse once more via temp:
  while (!copy.empty()) temp.push(copy.pop());
  while (!temp.empty()) copy.push(temp.pop());
  return copy;
}
```

Alternatively, pop+push twice gives the correct order. **Time: O(n)**.
</details>


**[Fall 2019 MT1 Q4] `expunge(Stack S)`** - remove any element that has a larger element above it, so the final stack is non-decreasing top-to-bottom, using only one auxiliary stack or queue.

<details>
<summary><b>Solution (one auxiliary stack)</b></summary>

```text
expunge(Stack S):
  if S.isEmpty(): return
  Stack S2 = new Stack()
  while not S.isEmpty():
    prev = S.pop()
    while not S.isEmpty() and S.peek() < prev:
      S.pop()
    S2.push(prev)
  while not S2.isEmpty():
    S.push(S2.pop())
```

**Time: O(n)** amortized - each element pushed and popped O(1) times across both stacks.
</details>


### Stacks and Queues New Practice Questions

**Q4.1** Implement a **Queue using two stacks**. Provide `enqueue(x)` and `dequeue()` and analyze their amortized complexity.

<details>
<summary><b>Solution</b></summary>

```java
class MyQueue {
  Stack<Integer> in = new Stack<>();
  Stack<Integer> out = new Stack<>();

  void enqueue(int x) { in.push(x); }

  int dequeue() {
    if (out.isEmpty()) {
      while (!in.isEmpty()) out.push(in.pop());
    }
    return out.pop();
  }
}
```

- `enqueue`: **O(1)**.
- `dequeue`: **O(n) worst case** for a single call (when `out` is empty and we move everything), but **amortized O(1)** - each element is moved from `in` to `out` exactly once in its lifetime.
</details>


**Q4.2** Given a stack of integers, write `sortStack(Stack S)` that sorts the stack so smaller values are at the top, using only **one auxiliary stack** and O(1) additional variables.

<details>
<summary><b>Solution</b></summary>

```text
sortStack(S):
  Stack temp = new Stack()
  while not S.isEmpty():
    v = S.pop()
    while not temp.isEmpty() and temp.peek() > v:
      S.push(temp.pop())
    temp.push(v)
  while not temp.isEmpty():
    S.push(temp.pop())
```

**Time: O(n²)** worst case - each element can cause linear back-and-forth moves (similar to insertion sort).
</details>


**Q4.3** Using a single queue, determine whether a string `s` of parentheses `()[]{}` is balanced. (Traditionally this uses a stack. Is the single-queue approach viable? Justify.)

<details>
<summary><b>Solution</b></summary>

Balanced-parenthesis checking is inherently LIFO: when you see a closing bracket, you need the **most recently opened** unmatched bracket. A queue is FIFO, so it cannot efficiently provide the "last opened" item without being emptied into another structure.

The problem is **not naturally solvable with a single queue alone**. You would need either a stack or two queues to simulate a stack (which defeats the purpose). With a stack:

```java
boolean balanced(String s) {
  Stack<Character> st = new Stack<>();
  Map<Character,Character> match = Map.of(')', '(', ']', '[', '}', '{');
  for (char c : s.toCharArray()) {
    if ("([{".indexOf(c) >= 0) st.push(c);
    else {
      if (st.isEmpty() || st.pop() != match.get(c)) return false;
    }
  }
  return st.isEmpty();
}
```

**Time: O(n)**.
</details>


**Q4.4** You are given a `Queue<Integer>` of length n. Without using any other data structure besides O(1) variables, reverse the first `k` elements of the queue (leaving the rest in original order). Is this possible? What's the constraint?

<details>
<summary><b>Solution</b></summary>

A pure queue only supports enqueue/dequeue; to reverse the first `k` elements we **need LIFO behavior**. You must either use a stack or use recursion (the **call stack is an implicit stack**):

```text
reverseK(Queue q, int k):
  if k == 0: return
  int front = q.dequeue()
  reverseK(q, k - 1)                   // recurse
  q.enqueue(front)                     // now add back at rear

  // After recursion, enqueue (n - k) items then dequeue them to rotate:
  for i in 1..(q.size() - k):
    q.enqueue(q.dequeue())
```

**Time: O(n)**, **Space: O(k)** for recursion - so "O(1) extra space" is impossible in a strict sense because any such solution must store k items somewhere (stack or recursion).
</details>


## 5. Binary Trees and Binary Search Trees

### Binary Trees and Binary Search Trees Past Questions

**[Fall 2019 MT1 Q5] Mirror of a binary tree** - swap left and right of every internal node.

<details>
<summary><b>Solution</b></summary>

```text
mirror(Node node):
  if node == null: return
  mirror(node.left)
  mirror(node.right)
  Node tmp = node.left
  node.left = node.right
  node.right = tmp
```

Every node is visited once → **O(n)** time, **O(h)** space for recursion where h is tree height.
</details>


**[Fall 2019 MT2 Q2a] Build a BST** from `{61, 32, 80, 69, 53, 75, 17, 66, 27, 78}` (inserted in order, no balancing).

<details>
<summary><b>Solution (tree layout)</b></summary>

```text
                 61 (h=5)
                /       \
          32 (h=3)       80 (h=4)
         /       \         /
     17 (h=2)  53(h=1)   69 (h=3)
         \                /    \
        27(h=1)       66(h=1) 75(h=2)
                                  \
                                 78(h=1)
```

Does **not** satisfy AVL property (root's left subtree height 3 vs right 4 is fine, but 80's children have heights 3 and 0 - difference > 1).
</details>


### Binary Trees and Binary Search Trees New Practice Questions

**Q5.1** Write a recursive method `isBST(Node root)` that returns true iff the tree is a valid BST. Analyze complexity.

<details>
<summary><b>Solution</b></summary>

```java
boolean isBST(Node root) {
  return check(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
boolean check(Node n, long lo, long hi) {
  if (n == null) return true;
  if (n.key <= lo || n.key >= hi) return false;
  return check(n.left, lo, n.key) &and check(n.right, n.key, hi);
}
```

Visits each node once → **O(n)** time, **O(h)** space.

> ⚠ Common pitfall: comparing only to direct parent is insufficient; you must pass down valid (lo, hi) bounds.
</details>


**Q5.2** Given a BST, write a method that returns the **k-th smallest** key. Give its time complexity.

<details>
<summary><b>Solution (in-order traversal, stop when k-th visited)</b></summary>

```java
int count = 0, result = -1;
void kthSmallest(Node root, int k) {
  if (root == null || count >= k) return;
  kthSmallest(root.left, k);
  count++;
  if (count == k) { result = root.key; return; }
  kthSmallest(root.right, k);
}
```

**Time: O(h + k)** - we walk down to the smallest, then visit k nodes in order.
For a balanced BST this is **O(log n + k)**; for a skewed BST worst case is O(n).
</details>


**Q5.3** Insert `40, 20, 60, 10, 30, 50, 70, 5, 25` into an initially empty BST (no balancing). Then delete `20` using the **in-order successor** strategy. Draw the final tree and mark each node's height.

<details>
<summary><b>Solution</b></summary>

### After insertions
```text
            40(h=4)
           /      \
       20(h=3)   60(h=2)
       /    \    /    \
    10(h=2) 30  50    70
     /      (h=1)(h=1)(h=1)
    5       
   (h=1)
     …and 25 hangs off 30? No - 25 < 30 so 25 is left child of 30.
```

Cleaner ASCII:
```text
                 40
               /    \
             20      60
            /  \    /  \
           10  30  50  70
           /   /
          5  25
```

Heights (leaf = 1): 5→1, 10→2, 25→1, 30→2, 50→1, 70→1, 60→2, 20→3, 40→4.

**Delete 20** using in-order successor (smallest key in the right subtree of 20) = **25**.
Replace 20's key with 25, then delete 25 from its original position (it was a leaf).

```text
                 40
               /    \
             25      60
            /  \    /  \
           10  30  50  70
           /
          5
```

Heights unchanged at 40, 60; 25 has height 3 (max child height 2 + 1).
</details>


**Q5.4** Write a method `diameter(Node root)` that returns the diameter of a binary tree - the length (edge count) of the longest path between any two nodes.

<details>
<summary><b>Solution</b></summary>

```java
int best = 0;
int height(Node n) {
  if (n == null) return 0;
  int lh = height(n.left);
  int rh = height(n.right);
  best = Math.max(best, lh + rh);      // longest path through n
  return 1 + Math.max(lh, rh);
}
int diameter(Node root) {
  best = 0;
  height(root);
  return best;
}
```

One post-order traversal → **O(n)** time, **O(h)** space.
</details>


## 6. Heaps / Priority Queues

### Heaps / Priority Queues Past Questions

**[Fall 2019 MT1 Q6]** Heap array `[5, 9, 35, 67, 23, 46]`.
- Insert 12 → `[5, 9, 12, 67, 23, 46, 35]`.
- removeMin from that → `[9, 23, 12, 67, 35, 46]`.
- Heapify tree rooted at 75 (`75,30,40,55,20,35,10,15,90,45`) → `[10,15,40,30,20,35,75,55,90,45]`.


**[Fall 2022 Q2a]** Insert `13,10,11,14,5,18,7,8,1` into empty min-heap.

<details>
<summary><b>Solution</b></summary>

Final heap:
```text
              1
           /     \
          5       7
         / \    /  \
        8  13 18   11
       / \
      14 10
```

Array form: `[1, 5, 7, 8, 13, 18, 11, 14, 10]`.
</details>

**[Fall 2022 Q2b]** Two delete-min on that heap:

<details>
<summary><b>Solution</b></summary>

After first delete-min (remove 1, swap 10 to root, down-heap):
```text
              5
           /     \
          8       7
         / \    /  \
        10 13 18   11
       /
      14
```

After second delete-min (remove 5, swap 14 to root, down-heap):
```text
              7
           /     \
          8      11
         / \    /  \
        10 13 18   14
```

Array form: `[7, 8, 11, 10, 13, 18, 14]`.
</details>


### Heaps / Priority Queues New Practice Questions

**Q6.1** Insert `[50, 20, 70, 10, 60, 15, 5, 100, 35, 40]` into an initially empty **max-heap**. Draw the final heap.

<details>
<summary><b>Solution (step by step idea):</b></summary>

Inserting one-by-one with up-heap (max-heap):
- 50 → `[50]`
- 20 → `[50,20]`
- 70 (swap with 50) → `[70,20,50]`
- 10 → `[70,20,50,10]`
- 60 (swap with 20) → `[70,60,50,10,20]`
- 15 → `[70,60,50,10,20,15]`
- 5 → `[70,60,50,10,20,15,5]`
- 100 (bubble up: 100>10, swap; 100>60, swap; 100>70, swap) → `[100,70,50,60,20,15,5,10]`
- 35 (35<60 stop) → `[100,70,50,60,20,15,5,10,35]`
- 40 (40>20 swap; 40<70 stop) → `[100,70,50,60,40,15,5,10,35,20]`

Final array: **`[100, 70, 50, 60, 40, 15, 5, 10, 35, 20]`**

```text
                    100
                 /        \
              70           50
            /    \        /   \
          60      40     15    5
         /  \    /
        10   35 20
```
</details>


**Q6.2** You are given an unsorted array of size n. Describe how to build a min-heap in **O(n)** time (not O(n log n)). Justify the complexity.

<details>
<summary><b>Solution (bottom-up heapify)</b></summary>

```text
heapify(A):
  for i = (A.length/2 - 1) down to 0:
    downHeap(A, i)
```

**Why O(n)?** The cost of `downHeap` for a node at height `h` is `O(h)`. In a complete binary tree, the number of nodes at height h is at most `⌈n / 2^(h+1)⌉`. Summing:
`T(n) ≤ n · Σ_{h=0}^{log n} (h / 2^(h+1))`. The infinite series `Σ h/2^h` converges to 2, so `T(n) = O(n)`.

> In contrast, inserting one-by-one does `n · log n = O(n log n)` because each insertion is O(log n).
</details>


**Q6.3** Given two min-heaps with n total elements, can you merge them into one min-heap in O(n)? Explain.

<details>
<summary><b>Solution</b></summary>

Yes. Concatenate the two underlying arrays (O(n)) and run bottom-up heapify on the combined array (O(n) by Q6.2). Total **O(n)**.

Contrast: inserting each element of heap B into heap A one-at-a-time costs `O(|B| · log(|A|+|B|)) = O(n log n)`.
</details>


**Q6.4** In a min-heap stored as an array with root at index 0, give expressions for a node at index `i`'s parent, left child, and right child. Then explain why `removeMin` is O(log n) and not O(n).

<details>
<summary><b>Solution</b></summary>

- Parent of `i`: `⌊(i − 1) / 2⌋`
- Left child of `i`: `2i + 1`
- Right child of `i`: `2i + 2`

(If root at index 1 instead: parent `⌊i/2⌋`, left `2i`, right `2i+1`.)

**Why `removeMin` is O(log n):** we (1) save `A[0]` as the return value, (2) move the last leaf to the root, and (3) down-heap - which at each step compares with the two children and swaps with the smaller, moving down one level. A complete binary tree has height `⌊log₂ n⌋`, so down-heap does O(log n) swaps/comparisons.
</details>


## 7. Balanced BSTs (AVL and Red-Black)

### Balanced BSTs (AVL and Red-Black) Past Questions

**[Fall 2019 MT2 Q2c] Re-balancing after AVL violation.** After deleting 32 from the BST (see section 5), the tree is not AVL-balanced. Insert two nodes to violate it further (if needed) and perform rotations to restore AVL. Per the solution, a trinode restructuring with (27, 69, 75) gives a balanced tree.

**[Fall 2019 MT2 Q2d] Color the BST as a Red-Black tree.**

<details>
<summary><b>Solution</b></summary>

The tree **cannot** be converted without rotations: Red-Black property bounds the ratio of any two sibling heights by 2 (i.e., `h_longer ≤ 2 · h_shorter`). In the tree from Q2a, node 80's subtree has height 3 while its sibling (32's subtree) has height 3 - ratio OK at root, but at node 80 itself, the left child (69) has height 3 while right child is empty/height 0, violating the rule.
</details>


### Balanced BSTs (AVL and Red-Black) New Practice Questions

**Q7.1** Insert the following keys into an initially empty **AVL tree** in the given order. Show the tree after each rotation and indicate whether the rotation is LL, RR, LR, or RL.

`keys: 30, 20, 10, 25, 27, 40, 35`

<details>
<summary><b>Solution</b></summary>

- Insert 30 → single node.
- Insert 20 → left child of 30. Balanced.
- Insert 10 → left-left of 30. Unbalanced at 30 (bf = +2, left-heavy on left child). **LL rotation** (rotate right around 30):
```text
      20
     /  \
   10    30
```
- Insert 25 → right of 20's right? Wait: 25 > 20, goes right of 20. But 30 is right of 20. 25 < 30 → 25 becomes left child of 30.
```text
      20
     /  \
   10    30
         /
       25
```
Balanced.

- Insert 27 → 27 > 20 → right to 30; 27 < 30 → left to 25; 27 > 25 → right of 25.
```text
      20
     /  \
   10    30
         /
       25
         \
         27
```
Imbalance detected at 30 (bf = +2 at 30: left subtree (rooted 25) height 2, right height 0). Shape is left-right → **LR rotation** around (25, 27, 30):
```text
      20
     /  \
   10    27
         / \
        25  30
```
- Insert 40 → right of 30:
```text
      20
     /  \
   10    27
         / \
        25  30
              \
              40
```
Heights: 40=1, 30=2, 25=1, 27=3, 10=1, 20=4. bf(20) = 1 − 3 = −2. **Violation at 20.** Shape is right-right (40 is in 20.right.right's right chain) → **RR rotation** (left-rotate around 20):
```text
      27
     /  \
   20    30
  /  \     \
 10  25    40
```
Heights now: 27=3, 20=2, 30=2. bf(27) = 0. ✓

- Insert 35 → 35 > 27 right; 35 > 30 right; 35 < 40 left of 40:
```text
      27
     /  \
   20    30
  /  \     \
 10  25    40
           /
         35
```
Heights: 35=1, 40=2, 30=3. bf(30) = 0 − 2 = −2. **Violation at 30.** Shape is right-left → **RL rotation** around (30, 40, 35): first right-rotate around 40, then left-rotate around 30:

After right-rotate around 40:
```text
      27
     /  \
   20    30
  /  \     \
 10  25    35
             \
             40
```
After left-rotate around 30:
```text
      27
     /  \
   20    35
  /  \   / \
 10  25 30 40
```
Final tree is balanced at every node (bf = 0 everywhere). ✓
</details>


**Q7.2** A red-black tree has 20 internal nodes. What is the maximum possible height of the tree? The minimum? Justify.

<details>
<summary><b>Solution</b></summary>

Red-Black tree with n internal nodes satisfies `h ≤ 2 log₂(n+1)`.

- **Max height:** `2 · log₂(21) ≈ 2 · 4.39 ≈ 8.78`, so **h ≤ 8**. Achieved when red nodes are maximally distributed (alternating red-black on the longest path).
- **Min height:** `⌈log₂(21)⌉ = 5` (if all nodes black, the tree is perfectly balanced).

Key intuition: black-height from root to any leaf is identical; a red node cannot have a red parent; so the longest path is at most twice the shortest path.
</details>


**Q7.3** Explain why AVL trees provide better search performance than Red-Black trees in theory. When would you prefer Red-Black?

<details>
<summary><b>Solution</b></summary>

- **AVL** enforces `|h_left − h_right| ≤ 1` everywhere, giving a tighter height bound of `≈ 1.44 log₂(n+2)` vs RBT's `≤ 2 log₂(n+1)`. Searches traverse fewer levels on average.
- **Red-Black** has looser balance but **fewer rotations** on insert/delete (at most 2-3 rotations, often zero for delete rebalancing beyond recoloring).
- **Prefer AVL** when reads (searches) dominate.
- **Prefer Red-Black** when inserts and deletes are frequent (e.g., `java.util.TreeMap` uses red-black).
</details>


**Q7.4** You insert 1, 2, 3, 4, 5, 6, 7 (in order) into an AVL tree. Draw the final tree after every rotation is applied.

<details>
<summary><b>Solution</b></summary>

Inserting in sorted order would make a right-skewed BST; AVL rotations fix this.

- After 1, 2: OK.
- After 3: right-skewed at 1 → LL (actually RR) rotation around 1. Tree:
```text
     2
    / \
   1   3
```
- After 4: balanced (goes right of 3).
- After 5: RR rotation around 3:
```text
     2
    / \
   1   4
      / \
     3   5
```
- After 6: balanced? 4's right subtree height = 2 (5 and 6), left = 1 (3). bf at 2 = right 3, left 1 → height diff 2 at root 2. Rotate... Actually after inserting 6:
```text
     2
    / \
   1   4
      / \
     3   5
          \
           6
```
Imbalance at node 5 (height 2 right, 0 left)? Actually no - the imbalance propagates to the root. At node 2: left height 1, right height 3. Shape right-right → **RR rotation** around root (lift 4 up):
```text
     4
    / \
   2   5
  / \   \
 1   3   6
```
- After 7: goes right of 6. Tree:
```text
     4
    / \
   2   5
  / \   \
 1   3   6
          \
           7
```
Imbalance at 5 (bf right 2, left 0). Right-right → **RR** around 5:
```text
     4
    / \
   2   6
  / \  / \
 1  3 5   7
```
Perfectly balanced final AVL. ✓
</details>


## 8. Hash Tables

### Hash Tables Past Questions

**[Sample Q6]** Insert first 6 characters of your name into a size-10 hash table using **quadratic probing**. Home slot = `letter_value % 10`; on collision try `(h + i²) % 10` for i=1, 2, ...

> This depends on the student's name; the approach is identical for any name. Worked example below.


**[Fall 2019 MT2 Q4] Double hashing, size 13.** Primary `h₁(x) = (3x+7) mod 23`, secondary `d(x) = 11 − (x mod 11)`. After computing `h₁(x) mod 13`, insert 3, 11, 8, 27, 29, 16, 14, 20.

<details>
<summary><b>Final table (index → value):</b></summary>

```text
idx: 0  1  2  3  4  5  6  7  8  9  10 11 12
     -  -  29 3  11 -  27 -  8  16 20 14 -
```
Load factor = 8/13. Same load factor would hold with separate chaining.
</details>


**[Fall 2022 Q3] Chaining vs probing.**

- (a) Primary collisions (two records mapping to same home slot) depend only on the hash function and table size, **not** the collision-resolution strategy. So both have the same number of primary collisions.
- (b) Linear probing is never faster to search than chaining: probing can create secondary collisions (records whose home is elsewhere may still collide), meaning more comparisons.
- (c) Quadratic probing reduces but doesn't eliminate secondary collisions - same conclusion: chaining is at least as fast for search.


### Hash Tables New Practice Questions

**Q8.1** You are inserting into a hash table of size 11 using **linear probing** with hash `h(x) = x mod 11`. Insert `4, 15, 26, 17, 18, 29, 40` and show the final table and number of collisions.

<details>
<summary><b>Solution</b></summary>

| x  | h(x)=x%11 | probes | final idx |
| :--- | :--- | :--- | :--- |
| 4  | 4         | -      | 4         |
| 15 | 4         | collision at 4 → try 5 | 5 |
| 26 | 4         | 4 taken, 5 taken → 6 | 6 |
| 17 | 6         | collision at 6 → try 7 | 7 |
| 18 | 7         | collision at 7 → try 8 | 8 |
| 29 | 7         | 7,8 taken → try 9 | 9 |
| 40 | 7         | 7,8,9 taken → try 10 | 10 |

Total collisions: 1 + 2 + 1 + 1 + 2 + 3 = **10 collisions**.

Final table:
```text
idx: 0  1  2  3  4  5  6  7  8  9  10
     -  -  -  -  4 15 26 17 18 29 40
```
</details>


**Q8.2** What is the **load factor** of a hash table, and how does it affect performance of linear probing vs. separate chaining?

<details>
<summary><b>Solution</b></summary>

**Load factor** `α = n / m` where `n` = number of stored elements, `m` = number of buckets (array slots).

- **Separate chaining:** expected search time is `O(1 + α)`. Load factor can exceed 1 (more elements than buckets); lists just get longer. Performance degrades **linearly** with α.
- **Linear probing:** expected search time is approximately `O(1 / (1 − α))`. As α → 1, performance degrades **catastrophically** (clustering). Load factor must stay < 1 (resize needed well before). Common rule: resize at α = 0.5 or 0.75.
</details>


**Q8.3** In a hash table with **open addressing** (linear probing), why do we need a special "DEFUNCT" marker when deleting? Why don't we need it for separate chaining?

<details>
<summary><b>Solution</b></summary>

With open addressing, a search for key `x` probes slots starting at `h(x)`. It stops when it either finds `x` or hits an **empty** slot. If we simply emptied a slot on delete, a key that originally probed past that slot would later be unfindable (the search would terminate early).

A **DEFUNCT/tombstone** marker lets search continue probing but tells insert that the slot is reusable.

With **separate chaining**, deletion simply unlinks a node from the bucket's list - the bucket is still "occupied" conceptually; there's no probe chain that can be broken.

> ⚠ When resizing an open-addressing table, DEFUNCT entries are **not** copied over (they're artifacts of prior collisions, not real data).
</details>


**Q8.4** Given the primary hash `h₁(x) = x mod 7` and secondary `h₂(x) = 5 − (x mod 5)`, use **double hashing** into a size-7 table. Insert 19, 26, 35, 18, 12. Show probes for collisions.

<details>
<summary><b>Solution</b></summary>

Probe sequence for x at attempt i: `(h₁(x) + i · h₂(x)) mod 7`.

| x  | h₁(x) | h₂(x) | attempts | landed |
| :--- | :--- | :--- | :--- | :--- |
| 19 | 5     | 1     | 5        | 5 |
| 26 | 5     | 4     | collision at 5 → (5+4)%7=2 | 2 |
| 35 | 0     | 5     | 0        | 0 |
| 18 | 4     | 2     | 4        | 4 |
| 12 | 5     | 3     | collision at 5 → (5+3)%7=1 | 1 |

Final table:
```text
idx: 0  1  2  3  4  5  6
    35 12 26  - 18 19  -
```
Collisions: 1 (for 26) + 1 (for 12) = **2 collisions** total.
</details>


## 9. Dynamic Arrays and Amortized Analysis

### Dynamic Arrays and Amortized Analysis Past Questions

**[Fall 2022 Q5a]** Two same-size arrays A (n unsorted items) and B (empty). Insert from A into B one-at-a-time keeping B sorted. Complexity?

<details>
<summary><b>Solution</b></summary>

Inserting the i-th item: finding position by binary search is `O(log i)`, but **shifting** to maintain sorted order is `O(i)` in the worst case. Total: `1 + 2 + … + n = Θ(n²)`. **O(n²)**.
</details>


**[Fall 2022 Q5b]** Vectors A (n items) and B (empty, initial size c, grows by +c when full). Complexity of adding all of A into B?

<details>
<summary><b>Solution</b></summary>

- Copying n items: O(n).
- Resizes happen `n/c` times. On the k-th resize we copy `k·c` elements. Total copy work: `c + 2c + ... + (n/c)·c = c · (n/c)(n/c+1)/2 = O(n²/c)`.

Since this dominates linear work, total = **O(n²/c)**.

**Contrast with doubling:** if B doubles on resize, amortized insert is O(1) - total O(n).
</details>


### Dynamic Arrays and Amortized Analysis New Practice Questions

**Q9.1** A dynamic array doubles its capacity on overflow. Prove that `n` appends cost amortized O(1) each (i.e., total O(n)).

<details>
<summary><b>Solution (aggregate analysis)</b></summary>

Resizes happen when the array becomes full: after inserting 1, 2, 4, 8, …, 2^k items (i.e., when size hits the current capacity). The cost of the k-th resize is `2^k` (copying). Sum of resize costs: `1 + 2 + 4 + … + 2^(⌊log n⌋) = 2^(⌊log n⌋+1) − 1 ≤ 2n`.

Each append itself also costs O(1). Total work for n appends ≤ `n + 2n = O(n)`. Amortized cost per append = **O(1)**.
</details>


**Q9.2** Why do we **double** the capacity instead of growing by a fixed constant c? Give a quantitative argument.

<details>
<summary><b>Solution</b></summary>

With grow-by-c, after inserting n elements the array has been resized `n/c` times. Work per resize grows linearly (`c, 2c, 3c, ...`), summing to `c · (n/c)² / 2 = Θ(n² / c)` → per-insert amortized cost is Θ(n/c), which grows with n.

With doubling, resize costs form a **geometric series** bounded by `2n`, so per-insert amortized cost is `O(1)`, independent of n.

**Conclusion:** Doubling (geometric growth) is the standard because it makes append amortized O(1).
</details>


**Q9.3** Suppose a dynamic array halves its capacity when it becomes ¼ full. What's the amortized cost of a sequence of n appends/removes?

<details>
<summary><b>Solution</b></summary>

Halving when ¼ full (rather than ½ full) leaves a buffer to prevent **thrashing**: after a resize, we need roughly n/2 operations before another resize can happen. This guarantees the amortized cost of both append and remove is **O(1)**.

Naive "halve when ½ full" thrashes: alternating append/remove at the boundary triggers a resize on every operation, giving O(n) amortized cost per op.
</details>


**Q9.4** Arguments for ArrayList vs. DoublyLinkedList for the following access patterns - briefly justify:

(a) Many random-index reads.
(b) Frequent inserts/removes at both ends.
(c) Memory-constrained environment with cache locality mattering.
(d) Frequent inserts in the middle given a pointer to the insertion location.

<details>
<summary><b>Solution</b></summary>

- (a) **ArrayList** - `get(i)` is O(1) vs O(n) for a linked list.
- (b) **DoublyLinkedList** - O(1) at both head and tail; ArrayList is O(n) for head operations.
- (c) **ArrayList** - contiguous memory, better cache locality; linked lists scatter nodes in heap.
- (d) **DoublyLinkedList** - O(1) if you already have the node pointer; ArrayList would need O(n) shifts.
</details>


## 10. Newton's Method

### Newton's Method Past Questions

**[Fall 2022 Q4a] Describe Newton's method.**

<details>
<summary><b>Solution</b></summary>

Newton's method iteratively approximates a root of a differentiable function `f(x)`:

`x_{n+1} = x_n − f(x_n) / f'(x_n)`

Starting from an initial guess `x₀`, each iteration uses the tangent line at `x_n` to estimate where the function crosses zero. Convergence is **quadratic** near a simple root (number of correct digits roughly doubles each iteration) - much faster than bisection's linear convergence.
</details>


**[Fall 2022 Q4b] Approximate √x.** Using Newton's method on `f(y) = y² − x` (whose root is √x), iteration becomes `y_{n+1} = 0.5 (y_n + x/y_n)` - the classic Babylonian method. For n-digit precision, **O(log n)** iterations.

**[Fall 2022 Q4c] Does Newton converge for `f(x) = √x for x≥0, −√(−x) for x<0`?**

<details>
<summary><b>Solution</b></summary>

No. The derivative has a singularity at zero. For any starting guess `h > 0`:
`f'(h) = 1/(2√h)`, so `x₁ = h − √h / (1/(2√h)) = h − 2h = −h`.
By symmetry `x₂ = h`, `x₃ = −h`, ... The iteration **oscillates forever** between `h` and `−h` and never converges.
</details>

**[Fall 2022 Q4d] Find roots of `5x² + 7x + 1 = 0` to n-digit precision.**

<details>
<summary><b>Solution</b></summary>

Two approaches:

1. Apply Newton directly: `x_{n+1} = x_n − (5x_n² + 7x_n + 1) / (10x_n + 7)`.
2. Use the quadratic formula: `x = (−7 ± √(49 − 20)) / 10 = −7/10 ± √29 / 10`. Then apply Newton's method to compute `√29` to n digits.

Both take **O(log n)** iterations.
</details>


### Newton's Method New Practice Questions

**Q10.1** Apply Newton's method to find a positive root of `f(x) = x³ − 20`. Start from `x₀ = 3`. Perform 3 iterations and report the approximation.

<details>
<summary><b>Solution</b></summary>

`f(x) = x³ − 20`, `f'(x) = 3x²`. Iteration: `x_{n+1} = x_n − (x_n³ − 20) / (3x_n²) = (2x_n³ + 20) / (3x_n²)`.

- `x₀ = 3`: `f(3) = 7`, `f'(3) = 27`. `x₁ = 3 − 7/27 ≈ 2.7407`.
- `x₁ ≈ 2.7407`: `x₁³ ≈ 20.582`, `3x₁² ≈ 22.534`. `x₂ ≈ 2.7407 − 0.582/22.534 ≈ 2.7148`.
- `x₂ ≈ 2.7148`: `x₂³ ≈ 20.014`, `3x₂² ≈ 22.110`. `x₃ ≈ 2.7148 − 0.014/22.110 ≈ 2.7144`.

The true value is `∛20 ≈ 2.71442`. After 3 iterations we're within 10⁻⁴.
</details>


**Q10.2** Newton's method can fail to converge. List three failure modes and give a short example of each.

<details>
<summary><b>Solution</b></summary>

1. **Zero or near-zero derivative:** if `f'(x_n) = 0`, the update formula divides by zero. E.g., applying to `f(x) = x²` at `x₀ = 0` - derivative is zero at the root, causing slow/failed convergence (only linear convergence at a double root).
2. **Oscillation / no root nearby:** Fall 2022 Q4c's example - the iteration oscillates between `h` and `−h`.
3. **Divergence due to bad initial guess:** For `f(x) = arctan(x)`, choosing `|x₀|` too large causes the iterates to grow without bound.

Also worth noting: Newton's method assumes `f` is differentiable and `f'` is continuous near the root. For `f(x) = |x|^(1/3)`, derivatives explode and the method diverges.
</details>


**Q10.3** Derive the Newton iteration for finding the reciprocal `1/a` without using division (useful on hardware that has no divider). Give the update formula.

<details>
<summary><b>Solution</b></summary>

We want a root of `f(x) = 1/x − a` (root at x = 1/a). Compute `f'(x) = −1/x²`. Newton:

`x_{n+1} = x_n − (1/x_n − a) / (−1/x_n²) = x_n + x_n² (1/x_n − a) = x_n (2 − a · x_n)`.

**Update: `x_{n+1} = x_n (2 − a · x_n)`** - only multiplications and one subtraction, no division. Converges quadratically given a good initial guess (typically from a lookup table). Used in floating-point hardware and in GPU reciprocal approximations.
</details>


**Q10.4** Explain (with a sketch if helpful) the geometric intuition behind one Newton step. Why does this give quadratic convergence near a simple root?

<details>
<summary><b>Solution</b></summary>

At the current guess `x_n`, draw the **tangent line** to the graph of f at the point `(x_n, f(x_n))`. The tangent has slope `f'(x_n)`. The tangent crosses the x-axis at `x_{n+1} = x_n − f(x_n)/f'(x_n)`. That's one step of Newton.

**Quadratic convergence:** Taylor-expand f around the true root r: `f(x) = f'(r)(x − r) + ½ f''(ξ)(x − r)²`. Plugging into the update:
`x_{n+1} − r ≈ f''(r)/(2 f'(r)) · (x_n − r)²`.
The new error is proportional to the **square** of the old error - each iteration roughly doubles the number of correct digits (provided f'(r) ≠ 0).
</details>


## 11. Short Answer Concepts (compiled)

Rapid-fire conceptual review drawn from all four midterms.

### Access control and Java fundamentals
- **Default (package-private) access:** variables with no modifier are visible to classes in the same package.
- **Primitive types have no constructors.** `int x = 5;` creates a value, not a heap object.

### Complexity nuances
- `O(n^1.01) > O(n log n)` - any polynomial (with power > 1) dominates `n log n`.
- The constant multipliers of a specific algorithm **do depend** on implementation details.
- `log(n!) = Θ(n log n)` (Stirling's approximation).

### Recursion
- **All recursive functions need a base case** - otherwise they don't terminate.
- **Binary search is not binary recursion** - it makes only one recursive call per non-base case (it's linear recursion).

### Lists (for positional access around known elements)
- **ArrayList** exploits **cache locality** → prefer for random-access-heavy workloads.
- **DoublyLinkedList** → prefer for frequent head/middle insert-delete when you already hold the reference.

### Heaps (array-indexed, root at 1)
- Parent of i = `⌊i/2⌋`; left = `2i`; right = `2i+1`.
- An in-place array **can** serve as a heap - no auxiliary array needed for O(n) `heapify`.
- **Heap-sort** is asymptotically fast and in-place, but its dominant cost is the **repeated down-heap**, not the initial heapify.

### Memory management choice
- Remove oldest in full memory → **queue** (FIFO).
- Remove least-used → **priority queue** (min-heap on usage).
- Write most-important to disk → **priority queue** (max-heap on priority).
- Work on most recent → **stack** (LIFO).

### BSTs, AVL, Red-Black
- Traversing any balanced BST is `O(n)` (not `O(log n)`) - you must visit every node.
- AVL with dummy/null leaves has ≈ 2× the node count vs. AVL without.
- Red-Black deletion rebalancing uses **constant** rotations (at most 3) but possibly O(log n) recolors.
- **Prefer AVL** when reads dominate; **prefer Red-Black** when updates dominate.

### BSTs vs. Hashmaps
- **Hashmap advantages:** amortized O(1) ops, simpler code, tolerates non-unique keys with buckets.
- **BST advantages:** ordered traversal, range queries, floor/ceiling, works better under memory fragmentation, no costly resizing.
- Hashmaps with separate chaining **do not** copy DEFUNCT slots on resize (open-addressing only concern).
- Insert into an n-element separate-chaining hashmap of size n with unsorted lists: **O(n)** worst case (walk the chain to check for duplicates).

### Sorting quick facts (for concept questions only - no new practice)
- Quick-sort's theoretical complexity **depends on pivot** (O(n²) worst, O(n log n) average with good pivots).
- Merge-sort is always `Θ(n log n)` but needs O(n) auxiliary space → problematic for huge datasets.
- **Insertion sort is adaptive** → optimal for nearly-sorted input (O(n)).
- **In-place and fast:** quick-sort, heap-sort (for memory-constrained settings).
- Any comparison-based sort can be **made stable** by augmenting keys with their original index and breaking ties via index.

### True/False warnings
- "We need to heapify at every iteration" - **False.** Heap-sort heapifies once; each subsequent swap+down-heap is O(log n), not full heapify.
- "We need a comparator/total order to build a BST" - **True.** Keys must be comparable.


## 12. Past Sorting Questions (reference only)

> Per the user's preferences, sorting and graphs are excluded from new practice questions. These past questions are included here for completeness since they appeared on actual midterms.

### [Fall 2019 MT2 Q3] Sorting (concept questions)

- **(a) Which values could have been the pivot?** Array `[3, 0, 2, 4, 5, 8, 7, 6, 9]`. After partitioning, all elements left of the pivot are ≤ pivot and all right are > pivot. Candidates where this holds: **4, 5, 9**.
- **(b) Library catalog, almost sorted:** use **insertion sort** - it's adaptive (O(n) on nearly-sorted input).
- **(c) Embedded system, 1M integers, tight memory:** use **quick-sort** or **heap-sort** (in-place, fast).
- **(d) Make any comparison sort stable:** pair each element with its original index; tie-break on index.
- **(e) Merge-sort tree:** for `27, 29, 49, 18, 55, 15, 66, 49`, recursive split/merge gives final sorted `[15, 18, 27, 29, 49, 49, 55, 66]`.

### [Fall 2022 Q1] Insertion-sort vs Merge-sort on special inputs

| Input          | Insertion-sort | Merge-sort  |
| :--- | :--- | :--- |
| Already sorted | **O(n)**       | O(n log n)  |
| Reverse sorted | **O(n²)**      | O(n log n)  |
| All equal      | **O(n)**       | O(n log n)  |

Merge-sort is insensitive to input order (always Θ(n log n)); insertion-sort's inner loop exits immediately when `arr[i] ≥ arr[i-1]`.

### [Fall 2019 MT2 Q5] Longest consecutive subsequence

Given unique integers, find longest run of consecutive values (in any order).

### Three approaches
1. Sort then scan - **O(n log n)**.
2. Counting sort (if range is bounded) - O(n + range).
3. **HashSet trick** - **O(n) expected**: add all to a set; for each element that starts a run (i.e., `x-1` not in set), count forward until the run ends. Each element touched O(1) times.


## How to Use This Guide

1. **First pass:** skim Section 11 (short-answer concepts) - these are the highest-density facts.
2. **Topic-by-topic:** work each past question *without looking at the solution first*, then compare.
3. **New practice:** use the new questions (Q*.n* in each section) as simulated exam problems. Try the "hide the solution" approach and only uncover after attempting.
4. **Weak areas:** the topics with most practice questions that trip you up should get a second-round review.

Good luck!
