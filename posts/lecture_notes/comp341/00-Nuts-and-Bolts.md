---
title: "Lecture 0 Nuts and Bolts COMP341 Introduction to AI"
date: "2026-02-09"
description: "Koç University | Asst. Prof. Barış Akgün"
---

# Lecture 0 Nuts and Bolts COMP341 Introduction to AI

**Koç University | Asst. Prof. Barış Akgün**

## 1 Course Overview

COMP341 is Koç University's foundational undergraduate course in Artificial Intelligence. Unlike specialized follow-on courses that dive deep into a single sub-field (e.g., deep learning, robotics, NLP), this course is intentionally broad: it is designed to give you an engineer's map of the entire AI landscape so that, regardless of which corner of AI you eventually specialize in, you understand how the pieces fit together.

A crucial framing note from the instructor: **modern commercial AI is overwhelmingly powered by Deep Learning**, but this course does NOT focus on deep learning in depth. Instead, it prioritizes the classical, mathematically grounded foundations - search algorithms, constraint satisfaction, probabilistic reasoning, and decision-making - that underlie or contextualize virtually everything that happens in deep learning as well. You will get a conceptual introduction to deep learning, but the heavy engineering detail is left for follow-on courses. This is a deliberate pedagogical choice: you cannot understand why deep learning works (or fails) without understanding search, probability, and the agent framework it operates within.


## 2 Instructor and Teaching Assistants

**Instructor**: Asst. Prof. Barış Akgün
- Personal e-mail: baakgun@ku.edu.tr
- Course e-mail (for logistical questions): comp341-tas-group@ku.edu.tr
- Office: Engineering Building, Room 273
- Office Hours: TBD; individual appointments are possible

**Teaching Assistants**:

| Name | E-mail | Office Hours |
| :--- | :--- | :--- |
| Aydın Ahmadi | aahmadi22@ku.edu.tr | By appointment |
| Alper Saydam | asaydam21@ku.edu.tr | By appointment |
| Eren Gökmenler | egokmenler21@ku.edu.tr | By appointment |

For all course-related questions - homework clarifications, grade queries, logistics - use the shared TA group address: **comp341-tas-group@ku.edu.tr**. This ensures the fastest response since any available TA can reply, and it creates a record visible to the whole team.


## 3 Textbook

The official textbook is:

> **Russell & Norvig, *Artificial Intelligence: A Modern Approach* (AIMA)**

Both the **3rd edition** and the **4th edition** are acceptable. The chapter mapping is slightly different between editions (see the topic table in Section 8 below), but the core content is equivalent. The 4th edition reorganizes some material and adds more modern content, but either will serve you well. The instructor follows additional sources beyond AIMA, so slides and lecture notes are essential - the textbook is a companion, not a replacement for attending class.

**Why AIMA?** It has been the definitive AI textbook for three decades. Written by Stuart Russell (UC Berkeley) and Peter Norvig (former Google Research director), it is both rigorous and readable. It covers the classical AI curriculum more completely than any other single text, and its treatment of search, probability, and agents is considered the gold standard.


## 4 Assessment and Grading

### Breakdown

| Component | Weight | Minimum Requirement |
|:---|---:|:---|
| Midterm 1 | 20% | - |
| Midterm 2 | 20% | - |
| Final Exam | 40% | 10 out of 40 points |
| Homeworks (×4 planned) | 20% | 8 out of 20 points |
| Exams combined (MTs + Final) | 80% | 32 out of 80 points |

More precisely, the minimum requirements are:
- Each midterm contributes 20% of your grade
- Final contributes 40%; you need at least **10/40** from the final alone
- Total exam points: at least **32/80** from all three exams combined
- Homeworks: at least **8/20**

**What does a minimum requirement mean?** It means you can fail the course even with a numerically passing total if you do not meet these per-component floors. For example, if you ace every homework but consistently skip exams, you will fail regardless of your total score. These requirements exist to ensure you actually demonstrate competence in the core examined material.

### Homework Details
- **4 planned homeworks** worth a combined 20%
- Additional homeworks may appear - these will either be graded as extra credit or as replacements for a regular homework
- **Late policy**: approximately 1% reduction per hour late. This is relatively strict. Partial credit on time is almost always better than full credit late.

### Exam Policies

**Make-up exams**: There is no make-up for make-up exams (i.e., if you miss the make-up, that is final). The final exam make-up follows the university-scheduled make-up days.

**Remedial exam**: There is no remedial exam in this course.

**Early final**: If you are participating in an exchange program and need to leave before the final exam period, you may take an early final exam. This counts in place of the regular final. No make-up is available for the early final. You **must** communicate this need to the instructor before Week 10 of the semester.


## 5 Programming Homeworks Pacman Projects

The programming homeworks use the **UC Berkeley Pacman Projects** - a well-known suite of AI exercises built around the classic Pacman game. These projects have been used at Berkeley and dozens of other universities for over a decade, and they are excellent: they force you to implement real AI algorithms (search, minimax, reinforcement learning, etc.) in a concrete, interactive environment where you can see your agent's behavior directly.

### What to Expect
- You will implement algorithms that control a Pacman agent navigating a maze
- The projects include **autograders** - automated test suites that score your implementation against known-correct behavior
- The instructor's note is direct: "If you dislike autograders then you should just audit this class." This is a signal that autograder performance is the primary evaluation criterion for homework, not manual rubric-based grading

### Why the Pacman Framework Is Effective for Learning AI
The Pacman environment is deceptively simple to look at but requires genuine algorithmic thinking to solve. Consider:
- **Search homework**: You implement BFS, DFS, A*, and greedy search to navigate Pacman through mazes. The maze is a graph - nodes are positions, edges are valid moves. Your search algorithm must find optimal or near-optimal paths.
- **Adversarial search homework**: Ghost agents actively try to eat Pacman. You implement minimax and alpha-beta pruning - the same algorithms used in chess engines - to make Pacman plan ahead against adversaries.
- **Reinforcement learning homework**: Pacman learns by trial and error, earning rewards for eating food and penalties for dying. You implement Q-learning, a foundational RL algorithm.

Each homework makes an abstract algorithm concrete and testable. You know immediately whether your implementation is right because the autograder tells you, and you can watch Pacman's behavior in the game window.

### Technical Setup
Before next week, install a Python environment. Recommended options:
- **Direct install + a text editor** (VS Code, etc.) - lightweight, flexible
- **Anaconda + Spyder IDE** - batteries-included data science environment
- **PyCharm IDE** - full-featured Python IDE with debugging support

**Important**: Jupyter Notebooks are **not supported** for homework submissions. The Pacman projects use graphical output that does not work inside notebooks. You must submit `.py` files. If your entire Python workflow has been in Jupyter, now is the time to get comfortable with running scripts from the command line.


## 6 LLM and Generative AI Policy

This is one of the most important sections of the course logistics because it reflects a thoughtful, nuanced stance on AI tools that many courses have not yet worked out.

### What Is Allowed
You **may** use large language models (LLMs) - such as ChatGPT, GitHub Copilot, Claude, etc. - to help you write code for homeworks. The course does not penalize you for using these tools.

### The Citation Requirement
If you use an LLM, you must **cite your usage**. Failing to cite LLM usage is treated the same as plagiarism or academic dishonesty. The course dedicates a full slide to the question "What does it mean to 'cite'?" - check the syllabus or Learn Hub for the specific format expected (likely a comment block in your code naming the tool and describing what it generated).

### Why This Policy Makes Sense and Why You Should Be Careful

The instructor's warning is worth taking seriously: **LLMs hallucinate**. An LLM will generate code or explanations that look completely plausible and confident while being factually wrong or subtly broken. This is not a rare edge case - it happens regularly, especially for nuanced algorithmic questions.

Consider what this means practically:
1. If you ask an LLM to implement A* search and it gives you a slightly wrong heuristic, the autograder will catch it - and those lost points are yours to own
2. If you submit LLM-generated code that contains a bug, **the mistake is your mistake**, not the LLM's
3. To spot LLM hallucinations, you need to actually understand the subject matter - which is exactly why you are taking this course

The policy is therefore self-reinforcing: using LLMs as a shortcut without learning the material will backfire when the autograder (and later exams) test your actual understanding. The recommended approach is to use LLMs as a knowledgeable assistant you can dialogue with, not as an oracle that produces correct answers.

**Prompt engineering** - the skill of crafting effective prompts to get good results from an LLM - is explicitly mentioned as something you will need. This is itself a practical, modern skill. Getting an LLM to produce a correct Pacman agent requires you to understand what a correct Pacman agent should do, which requires understanding the underlying AI algorithms.

### A Practical Example of LLM Danger in This Course

Suppose you ask an LLM: "Implement A* search in Python for the Pacman project." The LLM might return:

```python
# WARNING: This is an example of what an LLM might produce incorrectly
def aStarSearch(problem, heuristic):
    frontier = PriorityQueue()
    frontier.push(problem.getStartState(), 0)
    visited = set()
    while not frontier.isEmpty():
        state = frontier.pop()
        if state in visited:
            continue
        visited.add(state)
        if problem.isGoalState(state):
            return []  # BUG: returns empty path instead of actual path
        for successor, action, cost in problem.getSuccessors(state):
            if successor not in visited:
                frontier.push(successor, cost + heuristic(successor, problem))
```

This code looks reasonable but has multiple bugs: it does not track the path back to the start, and the priority does not include the accumulated cost `g(n)` - only the heuristic `h(n)`, making it greedy search, not A*. If you submitted this, the autograder would fail you, and the mistake is yours. Knowing enough to catch this requires understanding what A* actually does - exactly the content of Lecture 4.


## 7 Course Management and Communication

All course management runs through **Learn Hub** (Koç University's LMS). The following materials will be posted there:

- Lecture slides and course content
- E-mail announcements (check your email frequently)
- Extra reading material and useful external links
- Past exams and their solutions
- Code exercises
- Homework assignments and submission portals
- Grades

The expectation is that you **check your email frequently** - announcements about deadlines, corrections to homework specs, or exam logistics will come via Learn Hub email notifications. Missing an announcement is not an acceptable excuse for missing a deadline.


## 8 Tentative Topics What You Will Learn

This is the intellectual heart of the course logistics. Below is the full topic map with both textbook edition references and a thorough explanation of what each topic actually is - since the slides name the topics but a first-year AI student may not yet know what these terms mean.

### Topic 1 Introduction Chapters 12 both editions
**What it covers**: The definition and history of artificial intelligence, the concept of an intelligent agent, and the basic vocabulary of the field.

**What is AI?** AI is the field of study concerned with building systems that act intelligently. "Intelligence" is deliberately left broad - it encompasses the ability to perceive an environment, reason about it, plan actions, learn from experience, and communicate. The history of AI goes back to Alan Turing's 1950 paper proposing the "imitation game" (now called the Turing Test), through the symbolic AI era of the 1960s–80s, through the AI winters caused by over-promising, through the machine learning renaissance of the 1990s–2000s, to the current deep learning era.

**What is an agent?** An agent is anything that perceives its environment through sensors and acts on it through actuators. A thermostat is an agent (sensor: thermometer; actuator: heater switch). A chess program is an agent (sensor: board state; actuator: move selection). A self-driving car is an agent. This framing - the agent/environment interface - is the unifying framework for all of AI.

**Why it matters**: Without shared definitions, "AI" means everything and nothing. The agent framework gives you a precise vocabulary.


### Topic 2 Search Chapters 35 in 3e Chapters 3 4 6 in 4e
**What it covers**: Uninformed search (BFS, DFS, iterative deepening), informed search (A*, greedy best-first), local search (hill climbing, simulated annealing, genetic algorithms), and adversarial search (minimax, alpha-beta pruning for two-player games).

**What is search in AI?** Many AI problems can be framed as: "I am in some state. I want to reach some goal state. I have a set of actions that transition between states. What sequence of actions gets me to the goal?" This is a search problem. The "state space" is a graph - nodes are states, edges are actions.

- **Uninformed search** (BFS, DFS) explores the graph without any domain knowledge about which states are "closer" to the goal. BFS is guaranteed to find the shortest path (in terms of number of steps) but uses lots of memory. DFS uses little memory but may follow very long paths.
- **Informed search** (A*) uses a heuristic function `h(n)` that estimates the distance from state `n` to the goal. A* combines this with the actual cost so far `g(n)` to prioritize promising paths. A* is optimal if the heuristic is admissible (never overestimates).
- **Local search** (hill climbing, simulated annealing) is used when you don't need the path to the goal - just the goal itself (e.g., "find me a configuration that maximizes this score"). These methods start from a random state and iteratively improve it.
- **Adversarial search** (minimax) handles two-player zero-sum games where one agent's gain is the other's loss. The minimax algorithm looks ahead to model what the opponent will do and chooses the action that maximizes your minimum outcome.

**Why it matters**: The Pacman projects are almost entirely search problems. Search is also the foundation of planning in robotics, game AI, and combinatorial optimization.


### Topic 3 Constraint Satisfaction Problems CSPs Chapter 6 in 3e Chapter 5 in 4e
**What it covers**: Formalizing problems as sets of variables with domains and constraints, solving them with backtracking search and local search methods.

**What is a CSP?** A CSP has three components:
- **Variables**: X₁, X₂, ..., Xₙ - things you need to assign values to
- **Domains**: For each variable, the set of legal values (e.g., {red, green, blue})
- **Constraints**: Rules that must hold among subsets of variables (e.g., "adjacent regions must have different colors")

A classic CSP example is **map coloring**: assign colors to Australian states so that no two bordering states share a color. Variables = states, domains = {red, green, blue}, constraints = "adjacent states differ."

Another classic: **Sudoku** - variables are the 81 cells, domains are {1–9}, constraints are "no row/column/box has repeated digits."

CSP solvers use backtracking (try a value, check constraints, backtrack if violated) enhanced with constraint propagation (when you assign a value, immediately eliminate impossible values from neighboring variables' domains - this prunes the search space dramatically).

**Why it matters**: Scheduling (assign tasks to time slots without conflict), configuration (build a product from parts without incompatible components), and resource allocation are all naturally CSPs.


### Topic 4 Uncertainty Probabilistic Reasoning Chapters 1315 in 3e Chapters 1215 in 4e
**What it covers**: Probability primer, Bayesian networks, independence, exact inference, approximate inference, Hidden Markov Models (HMMs).

**Why probability?** The real world is uncertain. A robot's sensor reading might be wrong. A medical test might produce false positives. Tomorrow's weather is unknown. The classical AI approach (logic, rule systems) assumed perfect knowledge - which is usually false. Probability provides the mathematically correct framework for reasoning when you are uncertain.

**Bayes' Theorem** is the foundational tool:

$$P(H | E) = \frac{P(E | H) \cdot P(H)}{P(E)}$$

Read: "The probability of hypothesis H given evidence E equals the likelihood of observing E if H were true, times the prior probability of H, divided by the overall probability of E." This lets you update your beliefs when new evidence arrives.

**Bayesian Networks** are directed acyclic graphs (DAGs) where:
- Each node represents a random variable (e.g., "Rain", "Traffic", "Late")
- Each edge represents a direct probabilistic dependency (Rain → Traffic → Late)
- Each node stores a conditional probability table (CPT) encoding P(node | parents)

Bayesian networks are compact representations of joint probability distributions over many variables - instead of storing 2ⁿ numbers for n binary variables, you store only the CPTs (which are much smaller when variables are conditionally independent of most others).

**Hidden Markov Models (HMMs)** extend Bayesian networks to model systems evolving over time. The "hidden" part means the true state is not directly observable - only noisy measurements are. Classic applications: speech recognition (true phonemes are hidden; acoustic signals are observed) and robot localization (true position is hidden; sensor readings are observed).

**Why it matters**: Probabilistic reasoning is used in spam filters, medical diagnosis systems, speech recognition, self-driving car perception, and recommendation systems. It is also the theoretical foundation for modern machine learning.


### Topic 5 Machine Learning Chapters 18 20 in 3e Chapters 19 21 in 4e
**What it covers**: Introduction to ML concepts, performance testing methodologies (train/test split, cross-validation), parameter selection, and several classical ML methods.

**What is machine learning?** Traditional programming: human writes rules → computer applies rules to data → output. Machine learning: data + desired outputs → algorithm learns rules → those rules can be applied to new data. The system learns from examples rather than following hand-coded logic.

**Key concepts you will cover**:
- **Supervised learning**: Training examples have known labels. The algorithm learns to predict the label for new, unseen examples. (e.g., "given pixel values, predict whether this email is spam")
- **Unsupervised learning**: No labels. The algorithm finds structure in the data. (e.g., "cluster these customers into groups")
- **Overfitting**: When a model memorizes training data so well that it performs poorly on new data. Like a student who memorizes practice exam answers but cannot solve novel problems.
- **Train/test split**: Hold out a portion of data to evaluate generalization. The model never sees test data during training.
- **Cross-validation**: Rotate which portion is held out to get more reliable performance estimates.

**Important scope note**: Deep learning is only covered conceptually. You will understand what neural networks do at a high level, why they are powerful, and what their limitations are - but you will not implement or train them in this course.

**Why it matters**: ML is the engine of virtually every modern AI application - image recognition, language models, medical diagnosis, fraud detection. Understanding the foundational concepts makes you a better user and evaluator of ML systems even without being an ML engineer.


### Topic 6 Decision Making Chapters 16 17 21 in 3e Chapters 16 23 in 4e
**What it covers**: Markov Processes, Markov Decision Processes (MDPs), solving MDPs (value iteration, policy iteration), Reinforcement Learning (RL), and RL solution methods.

**What is an MDP?** A Markov Decision Process is the formal framework for sequential decision-making under uncertainty. Unlike simple search (where actions have deterministic outcomes), an MDP acknowledges that actions may have uncertain outcomes. The formal definition:
- **States**: The set of possible situations the agent can be in
- **Actions**: What the agent can do in each state
- **Transition model**: P(s' | s, a) - the probability of ending up in state s' after taking action a in state s
- **Reward function**: R(s, a, s') - the numerical reward received after each transition
- **Discount factor γ**: How much future rewards are worth relative to immediate rewards (γ = 0.9 means a reward one step away is worth 90% of the same reward now)

The agent's goal is to find a **policy** π(s) - a mapping from states to actions - that maximizes expected cumulative discounted reward.

**Value Iteration** is an algorithm that computes the optimal policy by iteratively refining estimates of how much long-run reward you can expect from each state.

**Reinforcement Learning** generalizes MDPs to the case where the agent does not know the transition model or reward function in advance - it must discover them by interacting with the environment. The agent takes actions, observes outcomes, and updates its policy based on the rewards it receives. This is how AlphaGo learned to play Go, how OpenAI Five learned to play Dota 2, and how robotic arms learn to manipulate objects.

**Why it matters**: RL is the frontier of AI for autonomous decision-making. It is the theoretical foundation for game-playing AI, robotic control, recommendation systems, and large language model fine-tuning (RLHF - Reinforcement Learning from Human Feedback, which is what makes ChatGPT follow instructions rather than just predict text).


### Topic 7 Logic Optional Chapters 79 both editions
**What it covers**: Concepts of logic, knowledge representation, propositional logic, first-order logic.

**What is logic-based AI?** The early AI paradigm held that intelligence could be encoded as explicit logical rules. Propositional logic uses statements that are either true or false and combines them with AND, OR, NOT, IMPLIES. First-order logic (also called predicate logic or FOL) extends this with variables, predicates, and quantifiers (∀, ∃), allowing statements like "For all x, if x is human, then x is mortal" - which is much more expressive.

A knowledge base is a set of logical sentences representing facts about the world. An inference engine derives new facts by applying logical rules. This was the architecture of "expert systems" in the 1980s - programs that encoded domain expertise as rules.

**Why it is optional**: Logic-based AI fell out of favor as the difficulty of encoding real-world knowledge became apparent (the "knowledge acquisition bottleneck") and as probabilistic and learning-based approaches proved more effective for uncertain, noisy real-world domains. However, logic remains important in formal verification, theorem proving, and hybrid AI systems.


## 9 Prerequisites You Need

The "What about you?" slide asks students to self-assess on four dimensions. These are the actual prerequisites the course relies on:

### Linear Algebra
You will encounter vectors and matrices in the probability and machine learning sections. Specifically:
- Dot products and matrix multiplication (used in belief propagation and ML models)
- Eigenvalues/eigenvectors (appear in some ML and MDP contexts)
- **Review now if rusty**: matrix multiplication, linear transformations, and the concept of a vector space.

### Probability
The probability section covers roughly one-third of the course material. Required background:
- Basic probability rules: P(A ∩ B), P(A ∪ B), P(A | B)
- Bayes' theorem (ideally, you have seen it before)
- Random variables, probability distributions
- Conditional independence
- **If you have not taken a probability course**: begin reviewing these now. The course will not re-teach introductory probability from scratch.

### Python
All programming homeworks are in Python. You need comfort with:
- Writing functions, classes, and modules
- Standard library data structures: lists, dicts, sets, `collections.deque` (queues)
- Running `.py` files from the command line (`python3 script.py`)
- Reading and modifying an existing codebase (the Pacman framework is thousands of lines of existing code you will modify)
- Basic algorithmic thinking (recursion, loops, graph traversal)

### Attitude Toward Autograders
Not exactly a prerequisite, but worth naming: if you have only ever submitted code that was manually graded with partial credit for "showing your approach," autograders will be an adjustment. They run your code against test cases and assign points based on correctness. An incorrect implementation earns zero on those test cases, regardless of how close it was. This is closer to industry practice than manual grading - the program either works or it doesn't.


## 10 Key Takeaways for Week 1

1. **Install Python before next class.** Test that you can run a `.py` file from the terminal, not just in a Jupyter notebook.

2. **Locate the textbook (AIMA 3rd or 4th edition).** Both editions work; the chapter references are mapped in the topic table above.

3. **Join Learn Hub and verify you receive email announcements.** Check your email frequently throughout the semester.

4. **Understand the grading minimums.** You need at least 32/80 on exams total, 10/40 on the final alone, and 8/20 on homeworks. You cannot compensate for exam failure with homework performance.

5. **LLM policy in one sentence**: You may use LLMs, you must cite usage, and every mistake in your submission is your mistake. Use them as a learning aid, not a shortcut.

6. **If you need an early final** (exchange program, etc.): communicate this before Week 10.

7. **Scope expectation**: This course is broad by design. You will get rigorous treatment of classical AI (search, CSPs, probability, MDPs/RL) and a conceptual introduction to ML and deep learning. Deep learning engineering depth is left for follow-on courses. Do not be frustrated that you are not implementing transformers - the foundations you build here are what make that work possible.

8. **The course is hard but fair.** It covers a large amount of material. The Pacman autograder is unforgiving. Start homeworks early, attend office hours, and use the TA group email proactively. The exam minimums mean you need to keep up with material throughout the semester rather than cramming at the end.


*Notes compiled from Lecture 0 slides: "Nuts and Bolts" - COMP341, Koç University. Instructor: Asst. Prof. Barış Akgün.*
