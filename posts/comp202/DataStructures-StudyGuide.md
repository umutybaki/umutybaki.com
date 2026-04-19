---
title: "COMP202 - Data Structures Study Guide"
date: "2026-04-19"
description: "A concise, exam-oriented reference covering every data type from the course up to (but not including) Graphs."
---

# COMP202 - Data Structures Study Guide

A concise, exam-oriented reference covering every data type from the course up to (but not including) Graphs. For each: definition, operations, Java implementation, complexity, use cases, and trade-offs.

## 1. Arrays

### Definition

An **array** is the most fundamental data structure in computer science: a fixed-size, contiguous block of memory that stores elements of the same type, indexed from `0` to `n-1`. "Contiguous" means the elements are stored in consecutive memory addresses - the address of element `i` is computed as `base_address + i × element_size`. This formula is why **random access** (jumping directly to any index) takes constant time: it is a single arithmetic calculation followed by a single memory access, regardless of the array's size.

Because the size of an array is fixed at creation time, it cannot grow or shrink. This is both its greatest strength (predictable memory layout) and its primary limitation (inflexibility).

### Key Operations

- **access(i)** - retrieve `A[i]` directly via address arithmetic.
- **set(i, x)** - write `x` into `A[i]` directly.
- **search(x)** - scan linearly for target `x`; no shortcut without sorting.
- **insert(i, x)** - place `x` at index `i`, shifting elements at indices `i` through `n-1` one position to the right.
- **remove(i)** - delete `A[i]`, shifting elements at indices `i+1` through `n-1` one position to the left.

### Time & Space Complexity

| Operation | Time | Why |
| :--- | :--- | :--- |
| access / set | O(1) | Address arithmetic: `base + i × size` is a single calculation regardless of `n`. |
| search | O(n) | Without any ordering guarantee, every element may need to be checked. |
| insert at end (if capacity) | O(1) | Simply write to `A[n]` - no shifting needed. |
| insert/remove at arbitrary `i` | O(n) | In the worst case (inserting at index 0), all `n` elements must be shifted by one position. On average, ~n/2 elements are shifted. |

**Space:** O(n) - the array itself occupies memory proportional to its capacity, with no additional per-element overhead.

### Use Cases

Lookup tables, matrix representations, buffers, foundation for ArrayList/Heap/Hashtable.

### Advantages

Fastest random access, cache-friendly (contiguous memory layout means sequential elements are loaded into CPU cache together), minimal memory overhead (no pointers or metadata per element).

### Drawbacks

Fixed size (must know capacity at creation), expensive insertions/removals at arbitrary positions (shifting), wasted space if over-allocated.

### Special Concept - Growable Arrays

Two resizing strategies when full:
- **Incremental (`+c`):** resize by a constant → O(n²) total for n pushes. Each resize copies all existing elements, and over n insertions, you resize ~n/c times, each costing O(n) - summing to O(n²).
- **Doubling (`×2`):** geometric growth → **O(n) total**, amortized **O(1)** per push. The total copy work across all resizes is `1 + 2 + 4 + ... + n ≈ 2n`, which is O(n). This is why `ArrayList` uses doubling.


## 2. Singly Linked Lists

### Singly Linked Lists Definition

A **singly linked list** is a linear data structure composed of a chain of **nodes**, where each node stores two things: an element (the data) and a reference (`next` pointer) to the subsequent node. The list is accessed exclusively through a `head` reference pointing to the first node; the last node's `next` is `null`, signaling the end of the chain.

Unlike arrays, nodes are scattered throughout memory - they are **not contiguous**. This means there is no address arithmetic to jump to the i-th element; you must follow the chain of `next` pointers from the head, one hop at a time. However, this scattered allocation means the list can grow and shrink dynamically by simply creating or discarding individual nodes - no resizing or copying required.

```text
head → [A|•] → [B|•] → [C|•] → null
```

### Singly Linked Lists Key Operations

- **addFirst(e)** - create a new node pointing to the current head, then update head to the new node.
- **addLast(e)** - traverse from head to the last node, then attach a new node after it.
- **removeFirst()** - save head's element, advance head to `head.next`, return the saved element.
- **removeLast()** - requires traversing to the **second-to-last** node (since there's no backward pointer), then setting its `next` to `null`.
- **size / isEmpty / traversal** - walk the chain via `next` pointers.

### Java Implementation

```java
private static class Node<E> {
    E element;
    Node<E> next;
    Node(E e, Node<E> n) { element = e; next = n; }
}

private Node<E> head = null;
private int size = 0;

public void addFirst(E e) {
    head = new Node<>(e, head);
    size++;
}

public E removeFirst() {
    if (head == null) return null;
    E ans = head.element;
    head = head.next;
    size--;
    return ans;
}

public void addLast(E e) {
    if (head == null) { addFirst(e); return; }
    Node<E> walk = head;
    while (walk.next != null) walk = walk.next;
    walk.next = new Node<>(e, null);
    size++;
}
```

### Singly Linked Lists Time & Space Complexity

| Operation | Time | Why |
| :--- | :--- | :--- |
| addFirst / removeFirst | O(1) | Only the head pointer is updated - no traversal needed. |
| addLast (without tail pointer) | O(n) | Must walk through all `n` nodes to find the last one. |
| addLast (with tail pointer) | O(1) | A maintained `tail` reference gives direct access to the last node. |
| removeLast | O(n) | Even with a tail pointer, you must find the **predecessor** of the tail by traversing from head, because there is no backward pointer. |
| search / access by index | O(n) | No random access - must follow `next` pointers from head sequentially. |

**Space:** O(n) - each node stores one extra pointer (`next`), so total memory is `n × (element_size + pointer_size)`.

### Singly Linked Lists Use Cases

Stack/Queue implementation, undo chains, adjacency lists.

### Advantages vs Arrays

Dynamic size (grows/shrinks by individual nodes), O(1) head insert/remove (no shifting), no wasted capacity.

### Singly Linked Lists Drawbacks

No random access (must traverse sequentially), cache-unfriendly (nodes are scattered in memory), `removeLast` is O(n) because there is no backward pointer to find the predecessor, extra memory for one pointer per node.

### Special Concepts

- **Tail pointer** enables O(1) `addLast`, but `removeLast` still needs O(n) because after removing the tail, you need to update `tail` to its predecessor - and there's no `prev` pointer to find it.
- Serves as the backbone for stack (push/pop at head) and queue (enqueue at tail, dequeue at head) linked implementations.


## 3. Doubly Linked Lists

### Doubly Linked Lists Definition

A **doubly linked list** extends the singly linked list by giving each node **two pointers**: `prev` (pointing to the preceding node) and `next` (pointing to the following node). This bidirectional linkage means you can traverse the list in both directions and, critically, you can remove any node in O(1) time if you already have a reference to it - something impossible in a singly linked list where you need to find the predecessor first.

In practice, doubly linked lists use **header and trailer sentinel nodes** - dummy nodes that bracket the real data. The header's `next` points to the first real element, and the trailer's `prev` points to the last. The sentinels themselves hold no data; they exist solely to eliminate null-checking edge cases at the boundaries of the list. With sentinels, every real node is guaranteed to have non-null `prev` and `next`, so insertions and deletions never need special logic for "is this the first or last node?"

```text
header ⇄ [A] ⇄ [B] ⇄ [C] ⇄ trailer
```

### Key Operations (all O(1) given a node reference)

- **addFirst / addLast / addBetween / addBefore / addAfter**
- **removeFirst / removeLast / remove(node)**
- Traversal in both directions via `next`/`prev`.

### Doubly Linked Lists Java Implementation

```java
private static class Node<E> {
    E element; Node<E> prev, next;
    Node(E e, Node<E> p, Node<E> n) { element = e; prev = p; next = n; }
}

private Node<E> header, trailer;  // sentinels
// constructor: header = new Node<>(null,null,null);
//              trailer = new Node<>(null,header,null);
//              header.next = trailer;

private void addBetween(E e, Node<E> pred, Node<E> succ) {
    Node<E> newest = new Node<>(e, pred, succ);
    pred.next = newest;
    succ.prev = newest;
    size++;
}

private E remove(Node<E> node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    size--;
    return node.element;
}
```

### Doubly Linked Lists Time & Space Complexity

| Operation | Time | Why |
| :--- | :--- | :--- |
| addFirst / addLast | O(1) | Insert between header/trailer and the first/last node - just rewire 4 pointers. |
| addBetween / addBefore / addAfter | O(1) | Given predecessor and successor references, creating and linking a new node is pointer arithmetic only. |
| remove(node) | O(1) | With both `prev` and `next` available, you simply bypass the node: `node.prev.next = node.next` and `node.next.prev = node.prev`. |
| search / access by index | O(n) | Still no random access - must traverse from header or trailer. |

**Space:** O(n) with ~2 pointers overhead per node (roughly double the pointer overhead of a singly linked list).

### Doubly Linked Lists Use Cases

Deques, LRU caches, text editors (cursor movement in both directions), backbone of `PositionalList` and `java.util.LinkedList`.

### Advantages vs Singly Linked

O(1) `removeLast` (the `prev` pointer provides direct access to the predecessor), bidirectional traversal, simpler insertion/deletion with a known node reference.

### Doubly Linked Lists Drawbacks

Higher memory overhead (two pointers per node instead of one), slightly more pointer bookkeeping on each insert/remove (4 pointer updates instead of 2).

### Special Concept - Sentinels

Header/trailer dummy nodes remove "is this the first/last?" checks. Every real node is guaranteed non-null `prev` and `next`, so one `addBetween` method handles every insertion case uniformly. This eliminates a whole class of null-pointer bugs.


## 4. ArrayList (Dynamic Array)

### ArrayList (Dynamic Array) Definition

An **ArrayList** (also called a **dynamic array**) implements the **List ADT** on top of a resizable array. It stores `n` elements at indices `[0, n-1]` in a backing array whose capacity may be larger than `n`. When the number of elements reaches the backing array's capacity, the ArrayList allocates a **new, larger array** (typically double the size), copies all existing elements into it, and discards the old array. This gives the ArrayList the random-access speed of a plain array while allowing it to grow dynamically.

The key insight is that although an individual resize operation is expensive (O(n) to copy everything), resizes happen so infrequently (capacity doubles each time) that the cost, **amortized** over all insertions, is O(1) per insertion.

### ArrayList (Dynamic Array) Key Operations

- **get(i) / set(i, e)** - direct indexing into the backing array.
- **add(i, e)** - shift elements right to make room, possibly triggering a resize.
- **add(e)** - append at the end (no shifting, possible resize).
- **remove(i)** - shift elements left to fill the gap.
- **size / isEmpty**.

### Java Implementation (Doubling)

```java
private E[] data;
private int size = 0;

public void add(int i, E e) {
    if (size == data.length) resize(2 * data.length);  // doubling
    for (int k = size - 1; k >= i; k--) data[k+1] = data[k];
    data[i] = e;
    size++;
}

public E remove(int i) {
    E ans = data[i];
    for (int k = i; k < size - 1; k++) data[k] = data[k+1];
    data[--size] = null;
    return ans;
}

@SuppressWarnings("unchecked")
private void resize(int cap) {
    E[] temp = (E[]) new Object[cap];
    for (int k = 0; k < size; k++) temp[k] = data[k];
    data = temp;
}
```

### ArrayList (Dynamic Array) Time & Space Complexity

| Operation | Time | Why |
| :--- | :--- | :--- |
| get / set | O(1) | Direct index into the backing array - same as a plain array. |
| add at end (doubling) | O(1) amortized | Most appends just write to `data[size]`. Resizes (copying all n elements) happen only when capacity is full, and because capacity doubles, the total copy cost across n insertions is O(n), giving O(1) per insertion amortized. |
| add at end (incremental +c) | O(n) amortized | Resizes happen every `c` insertions, each copying all existing elements. Over n insertions, total copy cost is O(n²), so per-insertion cost is O(n). |
| add(i, e) / remove(i) | O(n) | Elements after index `i` must be shifted right (insert) or left (remove). Worst case is index 0, shifting all n elements. |

**Space:** O(n) - though the backing array may have unused capacity (up to ~2× the number of stored elements with doubling).

### Amortized Analysis Sketch

With doubling, across `n` pushes, the total copy work is `1 + 2 + 4 + ... + n = 2n − 1 = O(n)`, so per-push cost is O(1). With incremental growth by `c`, you perform `n/c` resizes, each copying O(n) elements, giving O(n²/c) = O(n²) total.

### ArrayList (Dynamic Array) Use Cases

Default "list" when random access and appending matter more than middle-insertion. Used as `java.util.ArrayList`.

### ArrayList (Dynamic Array) Advantages

O(1) random access; amortized O(1) append; cache-friendly (contiguous memory); simple API.

### ArrayList (Dynamic Array) Drawbacks

O(n) arbitrary-position insert/remove (shifting); occasional resize cost spikes (though amortized away); some unused space from over-allocation.


## 5. Positional List

### Positional List Definition

A **Positional List** is a list ADT where elements are referenced by **Positions** - opaque tokens that represent a location in the list - rather than by integer indices. A `Position<E>` is an abstract handle that remains valid even as other elements are inserted or removed elsewhere in the list; it is invalidated only when the specific element it refers to is removed.

The motivation is simple: in an index-based list, inserting an element at position 3 silently shifts every element after it - any variable holding index 5 now refers to a different element. Positions don't suffer from this: a position always refers to the same element regardless of what happens around it. This makes positions ideal for iterators, cursors in text editors, or any scenario where you need a stable, long-lived reference to a specific location.

### Why Positions Over Indices?

Indices shift whenever you insert/delete anywhere before them. Positions don't - they act like pointers into the list structure. This makes them ideal for iterators, cursors in editors, and any pointer-like reference you want to keep live across structural modifications.

### Key Operations (all O(1))

`first()`, `last()`, `before(p)`, `after(p)`, `addFirst(e)`, `addLast(e)`, `addBefore(p, e)`, `addAfter(p, e)`, `set(p, e)`, `remove(p)`.

### Positional List Java Implementation

Built on a **doubly linked list with sentinels** where each internal `Node` implements the `Position` interface (so the node *is* the position).

```java
public interface Position<E> { E getElement() throws IllegalStateException; }

// Node implements Position; getElement() throws if node has been removed.
private Node<E> validate(Position<E> p) {
    if (!(p instanceof Node)) throw new IllegalArgumentException("Invalid p");
    Node<E> node = (Node<E>) p;
    if (node.next == null) throw new IllegalArgumentException("p is no longer in the list");
    return node;
}
```

### Positional List Time & Space Complexity

| Operation | Time | Why |
| :--- | :--- | :--- |
| first / last / before / after | O(1) | Direct pointer traversal - follow one `next` or `prev` link. |
| addBefore / addAfter / addFirst / addLast | O(1) | Built on the doubly linked list's `addBetween` - just pointer rewiring. |
| set(p, e) / remove(p) | O(1) | Direct access to the node via the position token - no searching needed. |
| find by value (not a standard op) | O(n) | Without an index or hash, you must traverse the list linearly. |

**Space:** O(n). Each node carries two pointers (`prev`, `next`) plus the element.

### Positional List Use Cases

Text editors (cursor/bookmarks), stable iterators that survive structural changes, undo/redo systems, the natural replacement for indices when you need references that don't become stale.

### Positional List Advantages

O(1) insert/remove anywhere given a position; positions never shift and remain valid across modifications.

### Positional List Drawbacks

No random access by index (to reach the k-th element, you must traverse from the head/tail); extra pointer memory per node; cache-unfriendly due to non-contiguous node allocation.


## 6. Stack

### Stack Definition

A **Stack** is a **LIFO** (Last-In, First-Out) collection - the most recently added element is the first one to be removed. All insertions and removals happen at a single end called the **top**. You can think of it like a stack of plates: you can only add or remove the plate on the very top.

The stack is one of the simplest and most widely used abstract data types. Despite its simplicity (it supports only `push`, `pop`, and `peek`), it is foundational to computing - function call execution itself relies on a stack (the "call stack"), and many algorithms convert recursion into an explicit stack.

### Stack Key Operations (all O(1))

- **push(e)** - add element to the top.
- **pop()** - remove and return the top element (null or exception if empty).
- **top() / peek()** - inspect the top element without removing it.
- **size / isEmpty**.

### Java Implementation - Array-Based

```java
public class ArrayStack<E> {
    private E[] S;
    private int t = -1;  // index of top

    @SuppressWarnings("unchecked")
    public ArrayStack(int capacity) { S = (E[]) new Object[capacity]; }

    public void push(E e) {
        if (t == S.length - 1) throw new IllegalStateException("Stack full");
        S[++t] = e;
    }
    public E pop() {
        if (t < 0) return null;
        E e = S[t]; S[t--] = null; return e;
    }
    public E top() { return t < 0 ? null : S[t]; }
    public int size() { return t + 1; }
    public boolean isEmpty() { return t < 0; }
}
```

### Java Implementation - Linked

```java
public class LinkedStack<E> {
    private SinglyLinkedList<E> list = new SinglyLinkedList<>(); // assumes a singly linked list
    public void push(E e) { list.addFirst(e); }
    public E pop() { return list.removeFirst(); }
    public E top() { return list.first(); }
    public int size() { return list.size(); }
    public boolean isEmpty() { return list.isEmpty(); }
}
```

Use a singly linked list; `push` = `addFirst`, `pop` = `removeFirst` - both O(1). Grows dynamically without any capacity limit (other than available heap memory).

### Stack Time & Space Complexity

| Operation | Time | Why |
| :--- | :--- | :--- |
| push | O(1) | Array: increment index and write. Linked: create node and update head pointer. |
| pop | O(1) | Array: read and decrement index. Linked: save head's data and advance head. |
| top / peek | O(1) | Simply read `S[t]` (array) or `head.element` (linked) - no modification. |
| size / isEmpty | O(1) | Maintained as a counter or computed from the top index. |

**Space:** O(n). Array version has fixed capacity; linked version uses per-node pointer overhead.

### Stack Use Cases

Function call stack, undo/redo, browser back button, matching parentheses/HTML tags, postfix expression evaluation, reversing a sequence, DFS traversal (explicit stack replaces recursion).

### Advantages / Drawbacks

**Array:** compact, cache-friendly, fixed capacity → `FullStackException`.
**Linked:** grows dynamically, no overflow (until heap exhaustion), but pointer overhead and worse cache behavior.


## 7. Queue

### Queue Definition

A **Queue** is a **FIFO** (First-In, First-Out) collection - elements enter at the **rear** and leave at the **front**, like a line of people waiting. The first person to join the line is the first to be served.

Queues are essential for any scenario involving fairness or order-preservation: process scheduling, print spooling, breadth-first search, and producer-consumer buffering. The key design challenge is implementing FIFO behavior efficiently on a fixed-size array, which is solved by the **circular array** technique.

### Queue Key Operations (all O(1))

- **enqueue(e)** - add element to the rear.
- **dequeue()** - remove and return the front element (null or exception if empty).
- **first() / peek()** - inspect the front element without removing it.
- **size / isEmpty**.

### Java Implementation - Circular Array

The key trick: use modular arithmetic so the queue wraps around the array, avoiding the need to shift elements on every dequeue.

```java
private E[] Q;
private int f = 0;   // index of front
private int sz = 0;  // number of elements

public void enqueue(E e) {
    if (sz == Q.length) throw new IllegalStateException("Queue full");
    int r = (f + sz) % Q.length;   // rear index
    Q[r] = e;
    sz++;
}

public E dequeue() {
    if (sz == 0) return null;
    E ans = Q[f];
    Q[f] = null;
    f = (f + 1) % Q.length;
    sz--;
    return ans;
}

public E first()   { return sz == 0 ? null : Q[f]; }
public int size()  { return sz; }
public boolean isEmpty() { return sz == 0; }
```

A naïve left-to-right array would force O(n) shifting on every `dequeue` (to move all remaining elements towards index 0); the **wrap-around** avoids this entirely.

### Queue Java Implementation - Linked

```java
public class LinkedQueue<E> {
    // Singly linked list with both head and tail pointers
    private SinglyLinkedList<E> list = new SinglyLinkedList<>();
    public void enqueue(E e) { list.addLast(e); }
    public E dequeue() { return list.removeFirst(); }
    public E first() { return list.first(); }
    public int size() { return list.size(); }
    public boolean isEmpty() { return list.isEmpty(); }
}
```

Singly linked list with both `head` and `tail` pointers: `enqueue` = append at tail (O(1) with tail pointer), `dequeue` = remove from head (O(1)). Note: `removeFirst` is used for dequeue (not `removeLast`), which is why a singly linked list suffices - no backward pointer needed.

### Queue Time & Space Complexity

| Operation | Time | Why |
| :--- | :--- | :--- |
| enqueue | O(1) | Circular array: compute rear index with modular arithmetic and write. Linked: append at tail pointer. |
| dequeue | O(1) | Circular array: read and advance front index with modular arithmetic. Linked: advance head pointer. |
| first / peek | O(1) | Read `Q[f]` or `head.element` directly. |
| size / isEmpty | O(1) | Maintained as a counter. |

**Space:** O(n) - circular array has fixed capacity; linked list has per-node pointer overhead.

### Queue Use Cases

Printer queues, CPU scheduling (Round-Robin), BFS, buffer between producer/consumer, level-order tree traversal, simulation of waiting lines.

### Queue Advantages / Drawbacks

Circular array: O(1) ops, no shifting, but fixed capacity. Linked: dynamic size, extra pointer overhead.

### Note - Deque (Double-Ended Queue)

Supports `addFirst / addLast / removeFirst / removeLast / first / last` - all O(1) on a doubly linked list. A deque generalizes both stacks and queues: you can use it as either. (The Ch06 slides focus on Stack/Queue; Deque is a natural extension.)


## 8. Priority Queue

### Priority Queue Definition

A **Priority Queue (PQ)** is a collection of **entries `(key, value)`** where retrieval is governed by **priority** (defined by the key), not by insertion order. The key represents the priority; the value is the associated payload. The entry with the **smallest key** (highest priority, in a min-PQ) is always the one accessible for removal.

Unlike a stack (LIFO) or queue (FIFO), a priority queue imposes no ordering based on when elements arrived - it always serves the most "urgent" element first. This makes it the ideal structure for any scenario where tasks or events have varying importance: process scheduling, event-driven simulation, shortest-path algorithms, etc.

### Priority Queue Key Operations

- **insert(k, v)** - add a new entry with key `k` and value `v`.
- **removeMin()** - remove and return the entry with the smallest key.
- **min()** - inspect the minimum-key entry without removing it.
- **size / isEmpty**.
- Uses an **`Entry<K, V>`** abstraction: `getKey()`, `getValue()`.

### Java Implementation - Unsorted List

```java
public void insert(K k, V v) { data.addLast(new MapEntry<>(k, v)); }  // O(1)

public Entry<K,V> removeMin() {
    if (data.isEmpty()) return null;
    Position<Entry<K,V>> bestPos = data.first();
    for (Position<Entry<K,V>> p : data.positions()) {
        if (comp.compare(p.getElement().getKey(), bestPos.getElement().getKey()) < 0) {
            bestPos = p;
        }
    }
    return data.remove(bestPos); // O(n)
}
```

### Java Implementation - Sorted List

```java
// Assuming a PositionalList (doubly-linked) backing structure
private PositionalList<Entry<K,V>> data = new LinkedPositionalList<>();

public void insert(K k, V v) {
    Entry<K,V> newest = new MapEntry<>(k, v);
    Position<Entry<K,V>> walk = data.last();
    // Traverse backward across larger keys
    while (walk != null && comp.compare(newest.getKey(), walk.getElement().getKey()) < 0) {
        walk = data.before(walk);
    }
    if (walk == null) data.addFirst(newest);
    else data.addAfter(walk, newest);
}

public Entry<K,V> removeMin() {
    if (data.isEmpty()) return null;
    return data.remove(data.first()); // O(1) removal of the lowest key
}
```

`insert` walks to the correct position to maintain sorted order - **O(n)** because it may need to scan all existing entries. `removeMin` just removes the first element - **O(1)** because the minimum is always at the front.

### Complexity Comparison

| Implementation | insert | removeMin | min | Why |
| :--- | :--- | :--- | :--- | :--- |
| Unsorted list | O(1) | O(n) | O(n) | Insert just appends (no ordering maintained). Finding min requires scanning every element. |
| Sorted list | O(n) | O(1) | O(1) | Insert must find the correct position to maintain order (linear scan). Min is always at the front. |
| **Heap** | **O(log n)** | **O(log n)** | **O(1)** | The heap's tree shape has height O(log n), and both insert/remove traverse at most one root-to-leaf path. Min is always at the root. |

Space O(n) in all cases.

### Priority Queue Use Cases

Event-driven simulation, OS process scheduling, ER triage, Dijkstra / Prim, Huffman coding, top-k selection.

### Priority Queue Advantages / Drawbacks

- Unsorted list: cheap insert, expensive min-extraction - good when insertions dominate and removals are rare.
- Sorted list: opposite trade-off - good when you frequently need the min but rarely insert.
- **Heap balances both** - O(log n) for each, making it the default choice for general use.

### Priority Queue Special Concepts

- **Comparator / Comparable.** A `Comparator<K>` defines a **total order** on keys. A total order must be **antisymmetric** (if `a ≤ b` and `b ≤ a`, then `a = b`), **transitive** (if `a ≤ b` and `b ≤ c`, then `a ≤ c`), and **total** (for any `a, b`, either `a ≤ b` or `b ≤ a`). These properties are required for the priority queue to behave correctly - without them, the notion of "smallest key" is undefined.
- **PQ-Sort:** insert all `n` elements, then `removeMin` `n` times → sorted output.
  - Unsorted PQ ⇒ **Selection Sort** (O(n²)): each `removeMin` scans the unsorted list.
  - Sorted PQ ⇒ **Insertion Sort** (O(n²)): each `insert` finds the correct sorted position.
  - Heap PQ ⇒ **Heap Sort** (O(n log n)): each operation is O(log n).


## 9. Tree

### Tree Definition

A **Tree** is a hierarchical (non-linear) data structure where elements are organized in a parent-child relationship. Unlike linear structures (arrays, linked lists), trees model **one-to-many** relationships: a single parent can have multiple children, but each child has exactly one parent (except the **root**, which has no parent).

Key terminology:
- **Root:** the unique top-level node with no parent. Every tree has exactly one root.
- **Internal node:** a node with ≥ 1 child.
- **External node / leaf:** a node with 0 children (the "endpoints" of the tree).
- **Depth(v):** the number of ancestors of node `v` (equivalently, the number of edges on the path from the root to `v`). The root has depth 0.
- **Height(T):** the maximum depth of any leaf in tree `T`. An empty tree has height 0 (or -1, depending on convention); a single-node tree has height 0.
- **Subtree rooted at v:** the tree consisting of `v` and all its descendants.

**Binary Tree:** a tree where each node has **at most 2 children**, distinguished as **left** and **right**. This left/right distinction is what makes binary trees "ordered" - it matters which child is which.

**Binary Search Tree (BST):** a binary tree with the **BST property**: for every node `v`, all keys in the left subtree are **less than** `key(v)`, and all keys in the right subtree are **greater than** `key(v)`. This structural invariant enables efficient searching by eliminating half the remaining nodes at each step.

### Tree Key Operations

`root()`, `parent(p)`, `children(p)`, `numChildren(p)`, `isInternal(p)`, `isExternal(p)`, `isRoot(p)`, `size()`, `isEmpty()`, `height(p)`, `depth(p)`. BST adds `get(k)`, `put(k, v)`, `remove(k)`.

### Tree Java Implementation

### General tree (linked)
```java
class Node<E> { E element; Node<E> parent; List<Node<E>> children; }
```

### Binary tree (linked)
```java
class Node<E> { E element; Node<E> parent, left, right; }
```

**Binary tree (array):** Store node at index `i`; `left(i) = 2i+1`, `right(i) = 2i+2`, `parent(i) = (i-1)/2`. Efficient for **complete** trees (used by heaps); wasteful for sparse/unbalanced ones because missing nodes leave gaps in the array.

### BST search
```java
Node<K,V> treeSearch(K k, Node<K,V> v) {
    if (v == null) return null;          // key not found
    int cmp = k.compareTo(v.key);
    if (cmp == 0) return v;
    return cmp < 0 ? treeSearch(k, v.left) : treeSearch(k, v.right);
}
```
**BST insert:** run `treeSearch`; if not found, attach new leaf where the search fell off (at the null position where the search terminated).

### Tree Time & Space Complexity

| Operation | Complexity | Why |
| :--- | :--- | :--- |
| root / parent / left / right | O(1) | Direct pointer access - each node stores references to parent and children. |
| children(p) | O(c_p) | Must enumerate all children of node `p`; `c_p` is the number of children. |
| depth(v) | O(d_v) | Walk from `v` to the root, following `parent` pointers - the number of steps equals the depth. |
| height(T) | O(n) | Must visit every node to find the deepest leaf (recursive: each node's height = 1 + max child height). |
| BST `get / put / remove` | O(h): O(log n) balanced, O(n) worst | Each operation follows one root-to-leaf path. In a balanced tree, `h = O(log n)`; in a degenerate tree (every node has one child), `h = n − 1`. |

**Space:** O(n) - one node per element, each with a constant number of pointers.

### Traversals - In Detail

**(a) Preorder - Root → Left → Right.** Visit the node *before* recursing into its children.
```java
void preOrder(Node<E> v) {
    if (v == null) return;
    visit(v);
    preOrder(v.left);
    preOrder(v.right);
}
```
Uses: print outline/document structure, serialize a tree (the preorder sequence + structure info can reconstruct the tree), copy tree, prefix notation of expressions.

**(b) Postorder - Left → Right → Root.** Visit the node *after* recursing into its children.
```java
void postOrder(Node<E> v) {
    if (v == null) return;
    postOrder(v.left);
    postOrder(v.right);
    visit(v);
}
```
Uses: compute subtree size/height (you need children's results first), evaluate expression trees (compute operands before applying operator), delete tree safely (delete children before parent), postfix notation.

### (c) Inorder - Left → Root → Right (binary trees only)
```java
void inOrder(Node<E> v) {
    if (v == null) return;
    inOrder(v.left);
    visit(v);
    inOrder(v.right);
}
```
Uses: print BST keys in **sorted order** - this is the BST's defining benefit. Inorder traversal of a BST visits keys in ascending order because: all left-subtree keys (visited first) are smaller, then the current key, then all right-subtree keys (visited last) which are larger.

**(d) Level-order (BFS).** Uses a queue, not recursion.
```java
void levelOrder(Node<E> root) {
    Queue<Node<E>> q = new LinkedList<>();
    if (root != null) q.add(root);
    while (!q.isEmpty()) {
        Node<E> v = q.remove();
        visit(v);
        if (v.left  != null) q.add(v.left);
        if (v.right != null) q.add(v.right);
    }
}
```
Uses: shortest path in unweighted graphs/trees, layer-by-layer printing, finding the minimum-depth leaf.

### Traversal complexities
- **Time:** All traversals are **O(n)** - each node is visited exactly once.
- **Space:** Recursive traversals (pre/in/post) use **O(h)** stack space, where `h` is the height of the tree (each recursive call adds one frame, and the maximum nesting depth equals the height). Level-order uses **O(w)** queue space, where `w` is the **maximum width** (the largest number of nodes at any single level). For a complete binary tree, `w` can be up to `n/2` (the last level), making this O(n) in the worst case.

### Tree Use Cases

File systems, HTML/XML DOM, expression trees, BSTs for ordered data, decision trees, compiler syntax trees.

### Tree Advantages / Drawbacks

Natural for hierarchical data; balanced BST gives O(log n) search/insert/remove. But an **unbalanced BST degrades to O(n)** - a sequence of sorted insertions produces a linear chain. This motivates self-balancing variants (AVL, Red-Black, 2-4 trees; covered more deeply later).

### Tree Special Concepts

- **Euler tour:** generic framework unifying pre/in/post orders. A single walk around the tree touching each node up to three times (left visit = preorder, bottom visit = inorder, right visit = postorder).
- **Proper (full) binary tree:** every internal node has exactly 2 children. Property: `# leaves = # internal nodes + 1`.
- **Complete binary tree:** every level is completely filled except possibly the last, which fills left-to-right. This is the shape used by heaps; it guarantees height `⌊log₂ n⌋`.
- **Why inorder is for binary trees only:** inorder requires visiting the left subtree, then the node, then the right subtree - this "left vs right" distinction is only meaningful when there are exactly two distinguished children. For a general tree with an arbitrary number of children, there is no natural point to visit the parent "between" the children.


## 10. Heap

### Heap Definition

A **binary heap** is a specialized binary tree that satisfies two invariants simultaneously:

1. **Heap-order property (min-heap):** for every non-root node `v`, `key(parent(v)) ≤ key(v)`. This means the smallest key percolates up to the root - the root always holds the global minimum. Note: unlike a BST, there is **no ordering constraint between siblings or between left and right subtrees**. The left child may be larger or smaller than the right child.

2. **Complete binary tree shape:** every level is completely filled except possibly the last, which fills strictly left-to-right. This shape constraint guarantees the height is exactly `⌊log₂ n⌋`, which is what makes heap operations O(log n).

**Contrast with BST:** a BST enforces a global ordering (left < parent < right at every level), enabling sorted traversal but not guaranteeing shape. A heap enforces shape and parent-child ordering only, giving O(1) access to the minimum but no sorted traversal capability.

### Heap Key Operations

- **insert(entry)** - append the new entry at the **next available position** (the leftmost open spot on the last level, maintaining completeness), then **up-heap (sift-up)** to restore heap-order by repeatedly swapping the entry with its parent while it is smaller.
- **removeMin()** - return the root (the minimum), replace the root with the **last entry** (rightmost on the last level), then **down-heap (sift-down)** to restore heap-order by repeatedly swapping with the smaller child.
- **min()** - O(1) peek at root.
- **heapify(array)** - build a heap from an unordered array in **O(n)** using bottom-up down-heap calls.
- Helpers: **upheap / sift-up**, **downheap / sift-down**.

### Array-Based Heap (the common form)

For node at index `i`: left = `2i+1`, right = `2i+2`, parent = `(i-1)/2`. The complete tree shape means no gaps in the array - indices `0` through `n-1` are all occupied.

```java
private List<Entry<K,V>> heap = new ArrayList<>();
private Comparator<K> comp;

public Entry<K,V> insert(K k, V v) {
    Entry<K,V> e = new MapEntry<>(k, v);
    heap.add(e);
    upheap(heap.size() - 1);
    return e;
}

private void upheap(int j) {
    while (j > 0) {
        int p = (j - 1) / 2;
        if (comp.compare(heap.get(j).getKey(), heap.get(p).getKey()) >= 0) break;
        swap(j, p);
        j = p;
    }
}

public Entry<K,V> removeMin() {
    if (heap.isEmpty()) return null;
    Entry<K,V> ans = heap.get(0);
    Entry<K,V> last = heap.remove(heap.size() - 1);
    if (!heap.isEmpty()) {
        heap.set(0, last);
        downheap(0);
    }
    return ans;
}

private void downheap(int j) {
    int n = heap.size();
    while (2*j + 1 < n) {
        int left = 2*j + 1, right = 2*j + 2, small = left;
        if (right < n && comp.compare(heap.get(right).getKey(), heap.get(left).getKey()) < 0)
            small = right;
        if (comp.compare(heap.get(j).getKey(), heap.get(small).getKey()) <= 0) break;
        swap(j, small);
        j = small;
    }
}

// Bottom-up heap construction - O(n)
private void heapify() {
    for (int i = (heap.size() - 2) / 2; i >= 0; i--) downheap(i);
}
```

### Heap Time & Space Complexity

| Operation | Complexity | Why |
| :--- | :--- | :--- |
| min | O(1) | The minimum is always at the root (index 0) - just read it. |
| insert | O(log n) | The new entry may need to up-heap from the last level to the root - at most `h = ⌊log₂ n⌋` swaps. |
| removeMin | O(log n) | The replacement entry at the root may need to down-heap from the root to a leaf - at most `h` swaps. |
| upheap / downheap | O(log n) | Both traverse at most one root-to-leaf path, whose length is bounded by the tree height `h = O(log n)`. |
| **heapify (bottom-up)** | **O(n)** | Not O(n log n) as one might expect. Most nodes are near the leaves and require very few swaps: leaf nodes need 0 swaps, their parents need ≤ 1 swap, etc. The total work is Σ over all nodes of (height of that node), which sums to O(n) by the geometric series convergence. |

**Space:** O(n); **no pointer overhead** in array form - parent/child relationships are implicit via index arithmetic.

### Heap Sort

1. `heapify` the input → O(n).
2. Repeatedly `removeMax` (for max-heap) and place the extracted element at the end of the array → n × O(log n).

**Total: O(n log n)**. Can be **in-place** with O(1) extra space (use a max-heap, extract elements from the back of the array).

### Heap Use Cases

Priority queue implementation (the standard backing structure), Heap Sort, Dijkstra / Prim, top-k selection (use a min-heap of size k), **running median** (min-heap + max-heap), event simulation, Huffman coding.

### Heap Advantages / Drawbacks

O(log n) for both `insert` and `removeMin` (beats both list-based PQs). Array form is cache-friendly and pointer-free. Downsides: no efficient sorted iteration (unlike BST); higher constant factors than `QuickSort` in practice for sorting; not stable (equal-priority elements may not preserve insertion order).

### Heap Special Concepts

- **Last-node trick:** `insert` places the new entry at the end of the array (the unique correct spot for a complete tree), then up-heaps. `removeMin` swaps root with last, removes last, then down-heaps. This maintains the complete tree shape invariant.
- **Min-heap vs max-heap:** same algorithms, reversed comparison. Min-heap has the smallest key at the root; max-heap has the largest.
- **Height is O(log n)** because a complete binary tree with n nodes has height `⌊log₂ n⌋` - each level doubles the number of nodes, so `log₂ n` levels are needed to hold `n` nodes.


## 11. Map

### Map Definition

A **Map ADT** (also known as an associative array, symbol table, or dictionary in common usage) stores **entries `(key, value)`** with the constraint that **keys must be unique** - each key maps to at most one value. You retrieve, update, or delete values by providing their associated key.

The uniqueness constraint is what distinguishes a Map from a Multimap or Dictionary ADT: calling `get(k)` is always unambiguous because there is at most one entry with key `k`. If you call `put(k, v)` with a key that already exists, the old value is **overwritten** (not duplicated).

Maps are arguably the most frequently used data structure in software engineering. They provide the abstraction of "looking something up by name" - symbol tables in compilers, caches, configuration stores, and database indices are all maps at their core.

### Map Key Operations

- **get(k)** - return the value associated with key `k`, or null if absent.
- **put(k, v)** - insert the entry `(k, v)`, or overwrite the existing value for key `k`; return the old value or null.
- **remove(k)** - remove the entry with key `k` and return its value, or null if absent.
- **size / isEmpty / entrySet / keySet / values**.

### Java Implementation - Unsorted List Map

```java
public V get(K key) {
    for (Entry<K,V> e : entries)
        if (e.getKey().equals(key)) return e.getValue();
    return null;
}

public V put(K key, V value) {
    for (Entry<K,V> e : entries)
        if (e.getKey().equals(key)) {
            V old = e.getValue();
            ((MapEntry<K,V>)e).setValue(value);
            return old;
        }
    entries.add(new MapEntry<>(key, value));
    return null;
}
```

### Java Implementation - Sorted Search Table (Array-Based)

```java
private ArrayList<MapEntry<K,V>> table = new ArrayList<>();

// Returns index of key, or the index where it should be inserted
private int findIndex(K key) {
    int low = 0, high = table.size() - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        int comp = key.compareTo(table.get(mid).getKey());
        if (comp == 0) return mid;     // found
        else if (comp < 0) high = mid - 1;
        else low = mid + 1;
    }
    return low; // not found, insertion point
}

public V get(K key) {
    int j = findIndex(key);
    if (j == table.size() || key.compareTo(table.get(j).getKey()) != 0) return null;
    return table.get(j).getValue();
}
```

Other implementations: **sorted search table** (binary search on a sorted array), **hashtable**, **balanced BST**, **skip list**.

### Map Time & Space Complexity

| Implementation | get / put / remove | Why |
| :--- | :--- | :--- |
| Unsorted list | O(n) | Every operation must scan the list linearly to find the key - no ordering to exploit. |
| Sorted search table | O(log n) search, O(n) modify | Binary search finds the key in O(log n), but inserting/removing requires shifting array elements. |
| **Hashtable** | **O(1) average, O(n) worst** | Hash function maps keys to array indices in O(1). Worst-case O(n) occurs when all keys collide into the same bucket. |
| Balanced BST | O(log n) | The balanced tree height is O(log n), and every operation traverses one root-to-leaf path. |

**Space:** O(n).

### Map Use Cases

Symbol tables (compilers), caches (URL → page), DB indices, frequency counters, config systems, any "look up a value by key" problem.

### Map Advantages / Drawbacks

Natural key/value semantics; hash-backed maps give near-O(1) access. Drawbacks: no inherent ordering unless using a sorted implementation (sorted table or BST); worst-case O(n) for hashtables if hash function is poor.

### Map Special Concepts

- **`Entry<K, V>`** abstraction: `getKey()`, `getValue()`, `setValue()`.
- **Unique keys required** so that `get(k)` is unambiguous. Need duplicates? Use a **Multimap** or **Dictionary** ADT.
- Map, Set, Dictionary are siblings: Set = keys only (no values); Dictionary = may allow duplicate keys; Multimap = one key → many values.


## 12. Hashtable

### Hashtable Definition

A **Hashtable** is a concrete implementation of the Map ADT that achieves **O(1) average-case** performance for `get`, `put`, and `remove`. It works by storing entries in a **bucket array** `A` of size `N` and using a **hash function** `h: Keys → [0, N−1]` to compute an array index for each key. Instead of searching for a key, you *compute* where it should be - this is the fundamental insight that makes hashing fast.

The trade-off is that the hash function may map different keys to the same index (a **collision**), requiring a collision-resolution strategy. The performance guarantee is average-case only - in the worst case (all keys collide), performance degrades to O(n).

### Hash Functions (Two Stages)

**Stage 1 - Hash code** `h₁(k)`: keys → integers. Examples: memory address, integer cast, component sum (for `long`, `double`), **polynomial accumulation** (strings): `p(z) = a₀ + a₁z + a₂z² + ...` where each `aᵢ` is the character code and `z` is a constant (commonly 31 or 33).

**Stage 2 - Compression** `h₂(y)`: integer → `[0, N-1]`:
- **Division:** `y mod N` (use **prime `N`** to spread keys well - primes avoid patterns with common factors).
- **MAD (Multiply-Add-Divide):** `((a·y + b) mod p) mod N`, with random `a, b`, `p` prime, `a mod p ≠ 0`. Provides stronger, more uniform distribution than simple division.

A good hash function is **fast** (constant time to compute), **deterministic** (same key always produces the same hash), and **uniformly distributing** (spreading distinct keys evenly across `[0, N-1]` to minimize collisions).

### Collision Handling

Collisions occur when `h(k₁) = h(k₂)` for distinct keys `k₁ ≠ k₂`. Two main strategies:

### (a) Separate Chaining

Each bucket holds a small list/map (called a "chain") of all entries that hashed to that index.

```java
public V get(K key) {
    List<MapEntry<K,V>> chain = table[hash(key)];
    if (chain == null) return null;
    for (MapEntry<K,V> e : chain)
        if (e.getKey().equals(key)) return e.getValue();
    return null;
}

public V put(K key, V value) {
    int i = hash(key);
    if (table[i] == null) table[i] = new ArrayList<>();
    for (MapEntry<K,V> e : table[i])
        if (e.getKey().equals(key)) return e.setValue(value);
    table[i].add(new MapEntry<>(key, value));
    size++;
    return null;
}
```

- Simple; deletion is trivial (just remove from the chain); tolerates load factor λ > 1.
− Pointer overhead (each chain is a separate list); poor cache locality (chains are scattered in memory).

### (b) Open Addressing - Linear Probing

All entries live directly in the bucket array (no separate lists). On collision, probe the **next** slots: `A[(i+1) mod N], A[(i+2) mod N], ...` until finding the key, an empty cell (key not found), or exhausting the table.

```java
private int findSlot(K key) {
    int N = table.length;
    int i = hash(key), firstDefunct = -1;
    for (int j = 0; j < N; j++) {
        if (table[i] == null)
            return firstDefunct >= 0 ? firstDefunct : -(i+1); // not found
        if (table[i] == DEFUNCT) {
            if (firstDefunct < 0) firstDefunct = i;
        } else if (table[i].getKey().equals(key)) {
            return i; // found
        }
        i = (i + 1) % N;
    }
    return firstDefunct >= 0 ? firstDefunct : -1;
}
```

**Primary clustering:** contiguous runs of filled cells grow and merge, forming long clusters that slow future probes. The longer a cluster, the more likely a new key hashes into it and extends it further.
**Deletion:** don't leave a `null` - it would break later probe sequences (a search would stop at the null, missing entries that were placed beyond it). Use a **tombstone (`DEFUNCT`)** marker; searches skip over it, inserts may overwrite it.

- Cache-friendly (sequential memory access), no pointer overhead.
− Clustering degrades performance, needs tombstones (which can accumulate and slow probing), load factor must stay well below 1.

### (c) Quadratic Probing

Probe `A[(h(k) + j²) mod N]` for `j = 0, 1, 2, ...`. Reduces primary clustering because colliding keys jump to non-contiguous slots. However, keys that hash to the **same initial slot** still follow the identical probe sequence - this is called **secondary clustering**. Requires `N` prime and `λ < 0.5` to guarantee that a free cell is found.

### (d) Double Hashing

Use a **secondary hash function** `d(k)` as the step size: probe `A[(h(k) + j · d(k)) mod N]`. A common choice: `d(k) = q − (k mod q)` with `q` prime, `q < N`. Because different keys get different step sizes, their probe sequences diverge - this avoids both primary and secondary clustering.
`d(k)` must be nonzero and ideally coprime to `N` (guaranteed if `N` is prime) so the full table is probed.

### Load Factor & Rehashing

**Load factor** `λ = n/N` (number of entries / table capacity).

| Scheme | Typical threshold |
| :--- | :--- |
| Separate chaining | λ ≤ ~0.9 |
| Linear probing | λ ≤ ~0.5–0.75 |
| Double hashing | λ ≤ ~0.75 |

When exceeded, **rehash**: allocate a new (typically doubled and kept prime) table and reinsert every entry. This is O(n) per rehash, but amortized O(1) per insertion if you double the table size each time (same argument as ArrayList doubling).

### Hashtable Time & Space Complexity

| | Average | Worst | Why |
| :--- | :--- | :--- | :--- |
| get / put / remove | **O(1)** | O(n) | Average: hash computation + constant expected probing (with good hash and low λ). Worst: all keys hash to the same slot, degenerating to a linear scan of a list or a full probe sequence. |
| space | O(N + n) | - | The bucket array occupies O(N) space, plus O(n) for the entries themselves. With rehashing, N = O(n). |

### Hashtable Use Cases

Compiler symbol tables, caches, DB indices, DNS, spell-checking, frequency counting, set membership, backing store for `HashSet` and `HashMap`.

### Hashtable Advantages / Drawbacks

| Scheme | + | − |
| :--- | :--- | :--- |
| Chaining | simple, high λ ok, easy delete | pointer overhead, cache-unfriendly |
| Linear probing | cache-friendly, no pointers | primary clustering, tombstones needed |
| Double hashing | no clustering | two hash computations, more complex |

### Hashtable Special Concepts

- **`hashCode() / equals()` contract:** if `a.equals(b)`, then `a.hashCode() == b.hashCode()`. Violating this breaks hashtables - two "equal" keys could hash to different buckets, so `get` wouldn't find an entry that `put` stored.
- **Rehashing** is triggered by load factor exceeding the threshold - or by tombstone buildup that degrades probing performance.
- **Bad hash functions** (constant, poorly mixed, or not utilizing all key bits) collapse performance to O(n) by concentrating entries in a few buckets.


## 13. Set

### Set Definition

A **Set** is an unordered collection of **unique elements** - it models the mathematical concept of a set. Conceptually, a set is a Map that stores only keys (with no associated values, or equivalently, with a dummy value). The defining property is **uniqueness**: adding an element that is already present has no effect.

Sets answer the fundamental question: "Is this element present?" They provide no ordering, no indexing, and no duplicates.

### Set Key Operations

- **add(e)** - insert element if absent; do nothing if already present.
- **remove(e)** - delete element if present.
- **contains(e)** - membership test: is `e` in the set?
- **size / isEmpty**.
- Set-algebra: **union** (A ∪ B), **intersection** (A ∩ B), **difference** (A \ B).

### Java Implementation - Map-Backed (HashSet / TreeSet)

```java
public class MapSet<E> {
    // Underlying map (e.g., HashMap) with dummy values
    private Map<E, Object> map = new HashMap<>();
    private static final Object PRESENT = new Object();

    public boolean add(E e) { return map.put(e, PRESENT) == null; }
    public boolean remove(E e) { return map.remove(e) != null; }
    public boolean contains(E e) { return map.containsKey(e); }
    public int size() { return map.size(); }
}
```

`HashSet` wraps a `HashMap` (element = key, dummy constant = value); `TreeSet` wraps a Red-Black tree (a balanced BST). All set operations are forwarded to the underlying map's key operations.

### Java Implementation - List-Backed (Unsorted Array)

```java
public class ListSet<E> {
    private ArrayList<E> list = new ArrayList<>();

    public boolean add(E e) {
        if (contains(e)) return false; // Enforce uniqueness
        list.add(e);
        return true;
    }
    public boolean remove(E e) { return list.remove(e); }
    public boolean contains(E e) { return list.contains(e); }
}
```

The List-backed Set checks every element on `add` to ensure uniqueness, resulting in O(n) additions.

### Set Time & Space Complexity

| Implementation | add / remove / contains | Why |
| :--- | :--- | :--- |
| HashSet | O(1) average | Delegates to HashMap - hash computation + constant expected probing. |
| TreeSet | O(log n) | Delegates to Red-Black tree - operations traverse a balanced tree of height O(log n). |

**Space:** O(n).

### Set Use Cases

De-duplication, membership queries, mathematical set operations, uniqueness constraints, graph algorithms (visited-node tracking).

### Set Advantages / Drawbacks

Use a Set when you only care about presence/absence. If you need associated values → Map. If you need duplicates → Multiset/Bag. If you need insertion order → `LinkedHashSet`. `TreeSet` provides sorted iteration; `HashSet` does not.

### Special Concepts - Set Operations on Sorted Sets (Generic Merge)

Two-pointer linear sweep through two sorted sets A, B:
- **Union:** Compare current elements. Emit the smaller element and advance its pointer. If elements are equal, emit one and advance both pointers.
- **Intersection:** Compare current elements. If they are equal, emit the element and advance both. Otherwise, advance the pointer of the smaller element (do not emit).
- **Difference (A \ B):** Compare current elements. If A's element is strictly smaller, emit it and advance A. If B's element is smaller, advance B. If they are equal, advance both (do not emit).

All run in **O(|A| + |B|)** on sorted sets. Hash-based sets achieve the same expected time on average.

**Set vs Multiset (Bag):** a set stores each element at most once; a multiset tracks multiplicities (e.g., `{a, a, b}` has `a` with count 2).


## 14. Multimap

### Multimap Definition

A **Multimap** is a generalization of the Map ADT that allows **multiple values to be associated with the same key**. In a standard Map, `put(k, v)` would overwrite any existing value for key `k`; in a Multimap, `put(k, v)` **adds** a new `(k, v)` entry alongside any existing entries with the same key.

Conceptually, `Multimap<K, V> ≈ Map<K, Collection<V>>`, but a Multimap provides a cleaner API with built-in collection management - you don't have to manually check for null, create empty lists, or remove empty collections.

### Multimap Key Operations

- **put(k, v)** - add the entry `(k, v)`. Does **not** overwrite existing values for `k`; adds alongside them.
- **get(k)** - return the **collection** of all values associated with key `k` (empty collection if key absent).
- **remove(k, v)** - remove one specific `(k, v)` pair.
- **removeAll(k)** - remove every entry with key `k`.
- **entries() / keys() / keySet()**.

### Multimap Java Implementation

```java
private Map<K, List<V>> data = new HashMap<>();

public void put(K key, V value) {
    data.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
}

public List<V> get(K key) {
    return data.getOrDefault(key, Collections.emptyList());
}

public boolean remove(K key, V value) {
    List<V> list = data.get(key);
    if (list == null) return false;
    boolean ok = list.remove(value);
    if (list.isEmpty()) data.remove(key);
    return ok;
}
```

### Multimap Time & Space Complexity

| Operation | Time | Why |
| :--- | :--- | :--- |
| put(k, v) | O(1) average | HashMap lookup for the key's bucket is O(1); appending to the value list is O(1). |
| get(k) | O(1) average | HashMap lookup returns the value list directly. (Iterating the returned list is O(s) where s = number of values.) |
| remove(k, v) | O(s) average | HashMap lookup is O(1), but finding and removing `v` from the value list requires O(s) scanning, where `s` is the number of values for key `k`. |

**Space:** O(n) across all entries (sum of all key-value pairs stored).

### Multimap Use Cases

Grouping (students by major), **inverted indexes** (word → documents), **graph adjacency lists** (vertex → neighbors), phone directory (name → numbers), book indexes (term → page numbers).

### Multimap Advantages / Drawbacks

Cleaner API than manual `Map<K, List<V>>`: no null-check boilerplate, no forgetting to create an empty list. Slight memory overhead from maintaining a list even when a key has just one value.

### Special Concept - Multimap vs Multiset

- **Multimap:** key → many values (structured one-to-many relationship).
- **Multiset (Bag):** element → frequency count (just tracks how many times each element appears, with no associated values).


## 15. Dictionary

### Dictionary Definition

A **Dictionary ADT** is a searchable collection of key-value entries that **permits multiple entries with the same key**. While the term "dictionary" is used colloquially (and in Python) as a synonym for "map," the course distinguishes them: a Map enforces unique keys, whereas a Dictionary allows duplicate keys.

In practice, a Dictionary is functionally equivalent to a **Multimap** - both allow multiple entries per key. The distinction is largely historical/terminological and varies across textbooks.

### Dictionary Key Operations

- **find(k)** - return **a single** entry with key `k` (or null if none exist).
- **findAll(k)** - return **all** entries with key `k`.
- **insert(k, v)** - add a new entry `(k, v)`. Duplicate keys are permitted - this never overwrites.
- **remove(e)** - remove a specific entry `e` (not by key alone, since the key may not be unique).

### Java Implementation - Unordered Dictionary (List-based)

```java
private List<Entry<K,V>> data = new ArrayList<>();

public Entry<K,V> find(K key) {
    for (Entry<K,V> e : data)
        if (e.getKey().equals(key)) return e;
    return null;
}

public Iterable<Entry<K,V>> findAll(K key) {
    List<Entry<K,V>> matches = new ArrayList<>();
    for (Entry<K,V> e : data)
        if (e.getKey().equals(key)) matches.add(e);
    return matches;
}

public void insert(K key, V value) {
    data.add(new MapEntry<>(key, value)); // Duplicates are allowed
}
```

- **Unordered (hashtable-backed):** O(1) average find/insert/remove. Effectively a multimap built on a hashtable where each bucket can hold multiple entries with the same key.
- **Ordered (sorted search table):** entries kept sorted by key; `find` is O(log n) via binary search, `findAll(k)` is O(log n + s) where `s` is the number of matches (binary search to find one, then scan adjacent entries). Insert/remove cost O(n) from shifting.

### Dictionary Time & Space Complexity

| Implementation | find | findAll | insert | remove | Why |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Unordered (hash) | O(1) avg | O(1 + s) avg | O(1) avg | O(1) avg | Hash function maps to the bucket in O(1); scanning within a bucket is proportional to entries there. `s` is the number of entries with that key. |
| Ordered (sorted table) | O(log n) | O(log n + s) | O(n) | O(n) | Binary search locates the key in O(log n). Insert/remove require shifting array elements to maintain sorted order. |

**Space:** O(n).

### Dictionary Use Cases

Language dictionaries (word → many definitions), bibliographic records, DNS when multiple IPs per domain, phone books (multiple numbers per person), database records with repeated keys.

### Advantages vs Map

Natively supports one-to-many key-value relationships without requiring the caller to manage collections of values.

### Dictionary Special Concepts

- **Ordered vs unordered:** ordered dictionaries support **range queries** (`findAll keys in [a, b]`) and sorted traversal; unordered prioritize raw speed.
- **Dictionary ≈ Multimap** in modern terminology - the ADT concepts overlap heavily.
- **Note on naming:** Java's `java.util.Dictionary` is an obsolete abstract class from Java 1.0 - modern code uses `Map` / `HashMap`. The ADT term still appears in textbooks (including this course's).


## Quick-Reference Complexity Summary

| Structure | Access/Find | Insert | Delete | Min | Space |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Array | O(1) by index | O(n) | O(n) | O(n) | O(n) |
| Singly LL | O(n) | O(1) head | O(1) head / O(n) tail | O(n) | O(n) |
| Doubly LL | O(n) | O(1) w/ node ref | O(1) w/ node ref | O(n) | O(n) |
| ArrayList | O(1) by index | O(1) amort end / O(n) mid | O(n) | O(n) | O(n) |
| Positional List | O(1) w/ position / O(n) by value | O(1) | O(1) | O(n) | O(n) |
| Stack | O(1) top only | O(1) | O(1) | - | O(n) |
| Queue | O(1) front only | O(1) | O(1) | - | O(n) |
| PQ (sorted list) | O(1) min | O(n) | O(1) min | O(1) | O(n) |
| PQ (unsorted list) | O(n) min | O(1) | O(n) min | O(n) | O(n) |
| Heap | O(1) min only | O(log n) | O(log n) min | O(1) | O(n) |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Hashtable | O(1) avg | O(1) avg | O(1) avg | O(n) | O(n) |
