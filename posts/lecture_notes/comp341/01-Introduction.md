---
title: "01 - Introduction to AI"
date: "2026-02-16"
description: "Koç University | Asst. Prof. Barış Akgün"
---

# 01 - Introduction to AI
**Koç University | Asst. Prof. Barış Akgün**



## 1 What is Artificial Intelligence

Before diving into textbook definitions, it is worth pausing to think about what the term actually means. "Artificial Intelligence" is one of the most overloaded terms in computing - it evokes robots, science fiction, chess computers, voice assistants, and now large language models like ChatGPT. The field itself has undergone such dramatic shifts that even experts struggle to pin it down.

**The key tension**: The field is currently undergoing what the professor calls a "tectonic shift." Before ChatGPT (abbreviated as "B.C." in lecture - Before ChatGPT), AI research was largely dominated by narrow techniques like decision trees, support vector machines, and hand-crafted logic. Post-ChatGPT, the public conversation is dominated by large-scale generative models. This matters because:
- Course material may sometimes feel "old" - because many foundational algorithms predate modern deep learning.
- Course material may sometimes feel "too speculative" - because we genuinely do not know where foundation models will take us.

The honest answer: **AI is an ever-changing field.** Any definition you commit to today may feel incomplete in five years.


## 2 History of AI

Understanding the history of AI is crucial - it explains why the field has the shape it does, why certain ideas resurface, and why hype cycles are a recurring pattern. The history is best understood as a series of waves, each followed by disappointment (called an "AI Winter"), then a rebound.

### 21 AI Before Computation Pre1940s

The *idea* of creating artificial minds is ancient and cultural:

- **Talos** - In Greek mythology, Talos was a giant bronze automaton created by Hephaestus to guard the island of Crete. It represents the earliest human imagining of a constructed being that acts autonomously.
- **Golem** - A figure from Jewish folklore, a creature made from inanimate matter (typically clay or mud) and brought to life through ritual. The Golem of Prague is the most famous example. This represents the idea of creating artificial life through special knowledge.
- **Automatons** - Physical clockwork machines built in the 17th–18th centuries (e.g., the "Digesting Duck" by Vaucanson, or the chess-playing "Turk") that mimicked the behavior of living beings. These were early engineering demonstrations of the concept of a machine imitating life.
- **R.U.R. (Rossum's Universal Robots, 1920)** - A Czech play by Karel Capek that coined the word "robot" (from the Czech word for forced labor). It depicted artificial workers who eventually rebel against their creators - one of the first popular explorations of the ethical and existential questions AI raises.

The common thread: humans have long dreamed of creating thinking, acting artificial beings. The difference is that before the 1940s, there was no mathematical or computational substrate to actually build such things.

### 22 19401950 The Birth of Computation

Two landmark events planted the seeds of modern AI:

**McCulloch & Pitts (1943): The Logical Neuron Model**

Warren McCulloch (a neurophysiologist) and Walter Pitts (a mathematician) proposed the first mathematical model of a neuron. Their insight: a biological neuron "fires" when its inputs exceed a threshold - and this can be modeled as a simple binary threshold function.

Formally, they showed a single neuron could compute logical AND, OR, and NOT operations. This was revolutionary because it suggested that the brain itself might be a kind of logical computing machine, and conversely, that computing machines might be able to exhibit brain-like behavior. This is the conceptual ancestor of every neural network used today.

**Alan Turing (1950): The Turing Test**

Alan Turing, one of the founding figures of computer science, asked the question: *"Can machines think?"* In his 1950 paper "Computing Machinery and Intelligence," he proposed a way to sidestep the philosophical debate and instead define intelligence operationally:

> **The Turing Test**: A human judge conducts a text-based conversation with two participants - one human, one machine - without knowing which is which. If the judge cannot reliably distinguish the machine from the human, the machine is said to have passed the test.

The genius of this framing is that it avoids the hard philosophical question "what is thinking?" and replaces it with a behavioral criterion: acts indistinguishably from a thinking thing. Turing's test represents the "act like a human" school of thought in AI.

Key capabilities required to pass the Turing Test:
- **Natural language processing** - understand and generate human language
- **Knowledge representation** - store and retrieve knowledge
- **Automated reasoning** - use stored knowledge to answer questions
- **Machine learning** - adapt to new situations
- **Computer vision** (for full embodied version) - perceive the visual world
- **Robotics** (for full embodied version) - manipulate objects physically

The Turing Test is elegant but has limitations (discussed more in Section 3). Notably, no machine has truly passed a rigorous version of it, and many argue it is not even the right goal.

### 23 19501960 The Birth of AI as a Discipline

**Dartmouth Meeting, 1956** - This summer workshop at Dartmouth College is considered the official founding event of AI as a field. Organized by John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon, it brought together researchers who believed that "every aspect of learning or any other feature of intelligence can be so precisely described that a machine can be made to simulate it." This meeting **coined the term "Artificial Intelligence."**

The phrase "coined the term AI" is important: before this, the work was described in scattered ways - cybernetics, automata theory, information theory. By naming it, the researchers created a discipline with shared goals and identity.

**Arthur Samuel (1953): Playing Checkers**

Arthur Samuel wrote a checkers-playing program that could improve its own performance over time - one of the first demonstrations of what we now call machine learning. Instead of hard-coding every move, the program learned from experience. The insight that machines could *learn* rather than just *be programmed* is foundational to modern AI.

**The Perceptron (1958): Frank Rosenblatt**

Rosenblatt built on the McCulloch-Pitts neuron to create the Perceptron - a learning algorithm that could adjust its weights based on training examples. The perceptron is the direct ancestor of modern neural networks. It could learn to classify linearly separable patterns and seemed to promise a path toward general artificial intelligence.

### 24 19601970 Logic vs Connectionism and the First AI Winter

**Two camps emerge**:
- **Logicists / Symbolists**: AI through formal logic - represent knowledge as logical statements and use inference rules to derive conclusions.
- **Connectionists**: AI through neural networks - model the brain's structure as a network of simple computing units.

**Robinson's Resolution Algorithm (1965)**: J.A. Robinson developed a complete algorithm for automated theorem proving in first-order logic. This seemed to give the logicist camp a powerful tool - a machine that could rigorously reason about any formally stated problem.

**The Death of Connectionism - Perceptrons Book (1969)**: Minsky and Papert wrote the book "Perceptrons," which proved mathematically that a single-layer perceptron *cannot* learn non-linearly separable functions (the classic example being XOR). This was technically correct but widely interpreted as a death sentence for neural networks as a whole. Funding dried up, researchers moved away.

**A Sneaky Invention: Backpropagation (1970)**

Almost unnoticed at the time, Seppo Linnainmaa described the algorithm that would later become known as backpropagation - a method to efficiently compute how much each weight in a multi-layer neural network contributed to the error. This algorithm, formalized by Rumelhart, Hinton, and Williams in 1986, is the engine behind virtually every deep neural network trained today. It was invented in 1970 but its importance was not recognized for more than a decade.

**The First AI Winter**: By the late 1960s, early promises had not materialized. The UK's Lighthill Report (1973) was particularly damning, describing AI as a failure. Government funding collapsed.

### 25 19701990 Expert Systems and the Second Winter

**Expert Systems**: A major application paradigm emerged - encoding a human expert's knowledge as a database of IF-THEN rules, plus a logical inference engine to apply them. Systems like MYCIN (medical diagnosis), DENDRAL (chemical analysis), and XCON (computer configuration) showed impressive results in narrow domains.

> **Analogy**: Think of an expert system as a flowchart so elaborate and carefully crafted that it captures what an expert would do. "IF patient has fever AND chest X-ray shows opacity THEN consider pneumonia." These systems worked well when the rules were clear and complete.

**Why they failed**: Real-world knowledge is messy, uncertain, and hard to formalize. The "fragility of certainty in logic" became apparent - a system that required perfect, complete logical facts broke down when given incomplete or noisy information. Building and maintaining the rule databases was also extremely expensive.

**Connectionism Rebirth (mid-1980s)**: Rumelhart and Hinton popularized backpropagation for multi-layer networks (multi-layer perceptrons, MLPs). Now you could train networks with hidden layers - bypassing the XOR limitation that killed the single-layer perceptron. Neural networks were back.

**The Second AI Winter**: Despite some successes, neural networks in the 1980s were still limited by the amount of data and computing power available. By the early 1990s, support waned again.

### 26 19902005 Statistical Methods and Machine Learning

**The Probabilistic Turn**: Researchers began framing AI problems in terms of probability and uncertainty rather than certainty. Instead of "IF fact THEN conclusion," the approach became "GIVEN evidence, what is the probability of each hypothesis?" This yielded more robust, practical systems.

**Vapnik's Support Vector Machines (SVMs, 1995)**: Vladimir Vapnik introduced SVMs - a learning method grounded in statistical learning theory that finds the optimal decision boundary between classes. SVMs had strong theoretical guarantees and outperformed neural networks on many tasks, contributing to the "second death" of neural networks.

**Deep Blue (1997)**: IBM's chess computer defeated world champion Garry Kasparov. This was a landmark demonstration of what AI could achieve in a well-defined, high-stakes domain. However, Deep Blue used primarily brute-force search enhanced with hand-crafted evaluation functions - not learning. It raised philosophical questions about whether "just searching" constitutes intelligence.

**Reinforcement Learning**: The 1990s saw formalization of reinforcement learning (RL) - where an agent learns to act by receiving reward signals from the environment. Richard Sutton and Andrew Barto's foundational work in this period laid the groundwork for later breakthroughs like AlphaGo.

### 27 2005Present Big Data Better Hardware Deep Learning

**The bottleneck revealed**: Researchers knew in the 1980s that deeper neural networks would be more powerful. The problem was not the idea - it was the lack of (a) enough training data and (b) fast enough hardware.

By the mid-2000s:
- **Big Data**: The internet generated massive labeled datasets (ImageNet had 14 million labeled images)
- **GPUs**: Graphics processing units, designed for parallel matrix operations, turned out to be perfect for training neural networks - offering 10–100x speedups over CPUs
- **Better algorithms**: Techniques like dropout regularization, better weight initialization, and ReLU activation functions made deep networks trainable

**Deep Learning** - multi-layer neural networks with many hidden layers - exploded in performance. In 2012, AlexNet slashed the ImageNet classification error rate by nearly 40%, starting the deep learning revolution.

**Deep Reinforcement Learning**: Combining deep learning with reinforcement learning produced superhuman game-playing agents. DeepMind's AlphaGo (2016) defeated world Go champion Lee Sedol - a game considered far harder than chess.

### 28 Generative AI 2014Present

**Generative Adversarial Networks (GANs, 2014)**: Ian Goodfellow introduced GANs - two neural networks (a generator and a discriminator) trained adversarially against each other. The generator tries to produce realistic images; the discriminator tries to distinguish real from fake. The result: the generator improves until it produces photorealistic images.

**"This Person Does Not Exist"**: A famous demonstration of GAN capability - a website that generates photorealistic human faces belonging to no real person. The lecture notes that faces are now "pretty good" but there are still issues with "appendages" (hands are notoriously hard to generate correctly).

**Text-to-Image Models**: Stable Diffusion, DALL-E, Midjourney - models that generate high-quality images from text descriptions (the lecture example: "a velvet avocado chair").

**Large Language Models (LLMs)**: GPT-3 (2020), ChatGPT (2022), GPT-4 - models trained on massive text corpora that can answer questions, write code, have conversations, translate languages, and much more.

**Foundation Models**: Large pretrained models that can be fine-tuned for a wide variety of downstream tasks. The lecture suggests self-investigation because this is a rapidly moving space.

**Video Generation (Sora, 2024)**: The lecture includes an example of OpenAI's Sora generating a photorealistic video of a woman walking through Tokyo streets from a text description. This represents the next frontier of generative media.

**Limitations of current generative AI** (critically important):
- **Hallucinations**: Models confidently state false information. They generate text that sounds authoritative but may be factually wrong.
- **Low-resource languages**: Performance is much worse for languages with less training data.
- **Not consistently expert-level (yet)**: Better than average humans in many tasks, but not reliably expert-level.
- **Limited common sense and reasoning**: Struggles with physical intuition, causal reasoning, multi-step logical deduction.
- **Alignment / guardrails**: Models need safety filtering and reinforcement from human feedback (RLHF), which limits some capabilities.
- **Real-world failures**: The lecture cites a case where a delivery firm's AI chatbot went rogue, cursed at a customer, and criticized the company.


## 3 Four Views of AI The 22 Framework

The AIMA textbook (Russell and Norvig, "Artificial Intelligence: A Modern Approach") organizes definitions of AI into a 2×2 matrix along two axes:

|                     | **Humanly**             | **Rationally**              |
| :--- | :--- | :--- |
| **Thinking**        | Think Like a Human      | Think Rationally            |
| **Acting**          | Act Like a Human        | Act Rationally              |

### 31 Think Like a Human Cognitive Science approach

**Goal**: Build AI systems that reason the way humans reason - not just get correct answers, but use the same cognitive processes humans use.

**Foundation**: Cognitive science and neuroscience. To build this kind of AI, you need to understand how the brain works - studying psychology, running experiments on human subjects, and building computational models that replicate human mental processes.

**Example**: If a human solves a math problem by visualizing it geometrically, a "think like a human" AI would also use a geometric mental simulation - not just symbolic algebra.

**Challenge**: We do not fully understand how humans think. The lecture marks this as "too difficult, many unknowns, may not even be the best idea." Neuroscience and cognitive psychology are still evolving, and building AI that mimics processes we do not fully understand is extremely difficult.

### 32 Act Like a Human The Turing Test approach

**Goal**: Build AI that *behaves* indistinguishably from a human - we do not care how it thinks, only that its observable behavior matches human behavior.

**Foundation**: The Turing Test is the canonical formalization of this view.

**Example**: A chatbot that can have a conversation where even expert humans cannot tell it is a machine.

**Challenge**: The lecture notes this is "not very well defined, not leading us to building intelligent machines." Acting human-like can be achieved through statistical pattern matching or deception - without any of the understanding we would normally associate with intelligence. A human actor can convince us they understand quantum physics without actually understanding it. ChatGPT passes many informal Turing-style conversations, but this does not necessarily mean it is "intelligent" in a deep sense.

### 33 Think Rationally Laws of Thought approach

**Goal**: Build AI that reasons *correctly* - that follows the laws of logic and always arrives at provably correct conclusions.

**Foundation**: Dating back to Aristotle's syllogisms, this approach uses formal logic (propositional logic, first-order predicate logic) to represent knowledge and drive inference.

**Example**: Given "All humans are mortal" and "Socrates is human," a rational-thinking system correctly derives "Socrates is mortal."

**Challenge**:
- It is very hard to express all knowledge as formal logical statements. The real world is messy.
- Even if you can formalize the knowledge, logical inference can be computationally intractable.
- Classical logic deals in true/false, but real-world knowledge is often uncertain and probabilistic.

### 34 Act Rationally Rational Agent approach The courses preferred view

**Goal**: Build AI that takes the *best possible action* given available information and resources - where "best" is defined by an external objective measure (utility function).

**Foundation**: Economic theory (utility maximization), decision theory, and operations research.

**Key insight from the lecture**: "At the end of the day, what matters is how you act, not how you think." A thermostat acts rationally (it achieves a goal) without thinking at all. A chess engine plays excellent chess without human-like consciousness. The *process* does not matter - the *outcomes* do.

This view is also more tractable: you do not need to solve philosophy of mind to define a utility function and optimize for it.

**The professor's stated view**: *"AI is the science of making agents that act rationally."*


## 4 The Preferred Definition Acting Rationally

Why does the course settle on "acting rationally" as the defining goal?

1. **Generality**: Any kind of agent - a robot, a software bot, a recommendation algorithm - can be evaluated by whether it achieves its objective.
2. **Measurability**: You can define a performance measure (utility function) and objectively assess whether the agent maximizes it.
3. **Avoids philosophical dead-ends**: You do not need to resolve whether machines can "truly" think or be conscious.
4. **Includes human-like behavior as a special case**: If acting human-like happens to maximize utility in some task, the rational agent will do it. Rationality subsumes mimicry when mimicry is optimal.

**Important caveat**: Rationality does *not* mean "omniscient" or "perfect." A rational agent does the best it can *given what it knows and can compute.* This is called **bounded rationality** - rationality under constraints of limited information and limited computational resources. A chess player who thinks for ten minutes and plays the best move they found is acting rationally, even if a computer with more time would find a better move.


## 5 What is Rationality

The lecture gives a precise characterization:

> **Rationality**: Achieving goals; measured by an external performance measure; being rational means maximizing (expected) utility.

### 51 Utility

**Utility** is a numerical measure of how "good" an outcome is for the agent. The concept comes from economics (Jeremy Bentham's utilitarianism, later formalized by von Neumann and Morgenstern in game theory).

- **Good outcomes** increase utility: performance, reward, success
- **Bad outcomes** decrease utility: cost, risk, failure, danger

The agent's job is to choose actions that maximize its expected utility.

**Why "external"?** If the agent defined its own utility, it could simply declare itself maximally successful without doing anything useful. The performance measure must be defined by the designer or environment, not the agent.

### 52 Example A Cleaning Robot

The lecture's concrete example: a robot tasked with cleaning a kitchen. Its utility function might combine four objectives:
1. **Cleanliness**: How clean is the kitchen at the end? (maximize)
2. **Speed**: How quickly did it finish? (minimize time)
3. **Noise**: How much noise did it make? (minimize)
4. **Energy**: How much power did it use? (minimize)

A single number can combine these:

```
U = alpha * cleanliness - beta * time - gamma * noise - delta * energy
```

A rational agent selects the sequence of cleaning actions that maximizes U. Note that the weights (alpha, beta, gamma, delta) encode the designer's priorities - this is a crucial design choice that cannot be automated away.

### 53 Expected vs Certain Utility

When outcomes are uncertain (stochastic), we cannot know the exact utility in advance. Rational agents maximize **expected utility** - the probability-weighted average of utilities across possible outcomes.

```python
# Simplified expected utility calculation
def expected_utility(action, environment_model):
    total = 0
    for outcome, probability in environment_model.predict(action):
        total += probability * utility(outcome)
    return total

best_action = max(possible_actions, key=lambda a: expected_utility(a, env))
```

**Example**: A robot vacuum considers two paths to reach a dirty spot:
- Path A: short but might get stuck (70% success, 30% stuck)
- Path B: longer but always works (100% success)

If getting stuck has very low utility, Path B might have higher expected utility despite being slower.


## 6 What is an Agent

**Informal intuitions** raised in lecture:
- Secret agent (007): acts autonomously, has objectives, perceives environment, chooses actions
- Travel agent: acts on behalf of someone, takes actions to achieve goals for a client
- Chemical agent: something that causes an effect - a broad meaning

**The generalization**: An agent is a generalization of the word "individual" to non-human things.

**Formal definition**: An **agent** is an autonomous entity that:
- Exists in some kind of **environment**
- **Perceives** the environment through sensors
- **Acts** on the environment through actuators

Agents need not be physical robots - a software agent running on a server is still an agent. A spam filter is an agent. A trading algorithm is an agent. A recommendation system is an agent.

**Examples**:

| Agent | Sensors / Percepts | Actuators / Actions | Environment |
| :--- | :--- | :--- | :--- |
| Chess program | Board state | Choose a move | Chessboard |
| Spam filter | Email content | Classify as spam/not-spam | Email inbox |
| Self-driving car | Cameras, lidar, GPS | Steering, throttle, brake | Road and traffic |
| Stock trader | Market prices, news | Buy, sell, hold | Financial markets |
| Chatbot | Text input | Text output | Conversation |


## 7 The Rational Agent Framework

The lecture formalizes the agent concept into four key components, often summarized as **PEAS** (Performance, Environment, Actuators, Sensors):

```typescript
                    +--------------------+
       Sensors ---> |                    | ---> Actuators
     (Percepts)     |       AGENT        |            (Actions)
                    |                    |
                    +--------------------+
                              |
                         Environment
```

### 71 Sensors and Percepts

- **Sensors**: The agent's input channels (cameras, microphones, keyboard input, API data streams)
- **Percepts**: A single sensor reading at one moment in time
- **Percept history**: The complete sequence of all percepts the agent has ever received

The agent's decision function maps **percept histories to actions**. This is the core mathematical object AI tries to specify:

```python
# The agent function (what AI is trying to build)
def agent_function(percept_history):
    # Some computation here - this is what changes between AI approaches
    return best_action

# The agent loop
percept_history = []
while True:
    percept = sensors.read()
    percept_history.append(percept)
    action = agent_function(percept_history)
    actuators.execute(action)
```

The agent function maps every possible percept history to an action. The space of all possible percept histories is enormous - which is why AI is hard. We cannot write out every case manually; we need algorithms that *learn* or *compute* the best action.

### 72 Actuators and Actions

- **Actuators**: The agent's output channels (wheels, motors, speakers, API calls, display output)
- **Actions**: What the agent can do to affect the environment

The action space can be discrete (move up/down/left/right) or continuous (set motor speed to any value in [0, 100]).

### 73 Environment

The environment is everything outside the agent that the agent interacts with. For a chess program, the environment is the chessboard and opponent. For a self-driving car, the environment is the entire physical world surrounding the car.

### 74 Performance Measure

The external criterion that defines what "good behavior" looks like. Key properties:
- It is *external* - defined by the designer, not the agent
- It quantifies success numerically (utility)
- It captures everything the designer cares about

Designing a good performance measure is harder than it sounds. If you only reward the chess program for capturing opponent pieces, it might sacrifice its own position in ways that hurt it long term. If you only reward the cleaning robot for cleanliness, it might use enormous energy. Good utility design is an art.


## 8 Example PacMan as an Agent

The lecture uses Pac-Man to make PEAS concrete and to introduce environment complexity:

**Basic PEAS decomposition**:
- **Performance/Utility**: Could be score, survival time, fraction of dots eaten, or some combination
- **Environment**: The maze, dots, power pellets, and ghosts
- **Actuators/Actions**: Move up, down, left, right (4 discrete actions)
- **Sensors/Percepts**: In the simplest version, the full game state (all positions visible)

**The lecture then asks**: how does the problem change as we make it more realistic?

| Complication | Environment Property | Why it matters |
| :--- | :--- | :--- |
| Pac-Man has limited view | Partially observable | Must track hidden state; harder to plan |
| Actions non-deterministic | Stochastic | Must reason about probability distributions over outcomes |
| Ghost behavior is strategic | Multi-agent (adversarial) | Cannot treat ghost behavior as random noise; must model opponent |
| Two Pac-Mans coordinate | Multi-agent (cooperative) | Communication and joint planning required |
| Coordinating ghosts | Multi-agent (adversarial + cooperative) | Adversary is now also a multi-agent system |
| Moving walls | Dynamic | Environment changes independently of Pac-Man's actions |

This progression shows that a seemingly simple game can quickly become a highly complex AI problem once realistic constraints are added.


## 9 Problem Types Environment Properties

Understanding the type of environment determines which algorithms apply. The lecture identifies six key binary dimensions. Every AI problem can be characterized along these axes.

### 91 Fully Observable vs Partially Observable

- **Fully observable**: Sensors give complete access to the true state of the environment at all times. Nothing is hidden.
  - Example: Chess (both players see the full board at all times)
  - Simpler: the agent does not need to track what it cannot see

- **Partially observable**: Sensors give incomplete information. Parts of the state are hidden or uncertain.
  - Example: Poker (you do not see opponents' cards), driving (you cannot see around corners), Pac-Man with limited view
  - Much harder: the agent must maintain a **belief state** - a probability distribution over all possible true states of the world
  - Most real-world problems are partially observable

### 92 Deterministic vs Stochastic

- **Deterministic**: The next state is completely determined by the current state and the agent's action. No randomness.
  - Example: A simple sliding puzzle, arithmetic
  - Simpler: you can predict the exact outcome of any action

- **Stochastic**: The outcome of an action has a random component. The same action in the same state can lead to different states.
  - Example: Driving (a tire might slip), robot locomotion (motors are imprecise), backgammon (dice), any game with shuffled cards
  - Note: If the environment is deterministic but partially observable, it *appears* stochastic to the agent - because hidden state creates apparent randomness

### 93 Episodic vs Sequential

- **Episodic**: Each interaction is independent. The agent perceives a situation, acts once, and the episode is done. The current decision does not affect future episodes.
  - Example: Spam classification (each email judged independently), image labeling
  - Simpler: no need to plan ahead; just pick the best action for the current situation

- **Sequential**: Decisions now affect future states and future decisions. The agent must think ahead and plan.
  - Example: Chess, Go, driving, Pac-Man - every action has downstream consequences
  - Much harder: requires planning algorithms that consider future impact

> **Key insight**: Even seemingly episodic tasks can be secretly sequential. A spam filter trained online - where its current classification affects its future training data - is actually sequential.

### 94 Static vs Dynamic

- **Static**: The environment does not change while the agent is deliberating. The world "waits" for the agent to decide.
  - Example: A crossword puzzle, a turn-based board game
  - Simpler: the agent can take as long as it needs to think

- **Dynamic**: The environment changes while the agent is computing. Time passes, other agents act, things move.
  - Example: Driving (other cars keep moving while you think), stock trading (prices change), real-time video games
  - Harder: the agent must make fast decisions even with incomplete analysis

- **Semidynamic**: The environment itself is static, but the performance measure changes with time.
  - Example: A timed exam - the questions do not change, but time ticking away affects your score

### 95 Discrete vs Continuous

- **Discrete**: A finite (or countable) number of distinct states, actions, and percepts.
  - Example: Chess (finite board positions, finite legal moves), text classification (finite vocabulary)
  - Amenable to combinatorial algorithms, table lookups, symbolic reasoning

- **Continuous**: States, actions, or percepts are real-valued and potentially infinite.
  - Example: Robot arm control (joint angles are real numbers), stock prices, autonomous driving (vehicle positions)
  - Requires different mathematical tools: calculus, continuous optimization, differential equations, function approximation

Most real-world problems are continuous, but many are discretized to make them tractable.

### 96 SingleAgent vs MultiAgent

- **Single-agent**: Only one decision-making agent operating in the environment.
  - Example: Solving a maze alone, image classification, route planning
  - The only source of complexity is the environment itself

- **Multi-agent**: Multiple agents share an environment, and their actions can affect each other.
  - **Cooperative**: Agents share a goal and help each other (multi-robot warehouse, autonomous vehicle platoons)
  - **Competitive**: Agents have opposing goals (chess, poker, auctions, adversarial cybersecurity)
  - **Mixed**: Some cooperation, some competition (most real-world scenarios - traffic involves both cooperative and competitive dynamics)
  - Requires game-theoretic reasoning: other agents are strategic and adaptive, not just obstacles

**Summary table**:

| Problem | Observable | Deterministic | Episodic | Static | Discrete | Agents |
| :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| Chess | Full | Det. | Sequential | Static | Discrete | 2 |
| Poker | Partial | Stoch. | Sequential | Static | Discrete | Multi |
| Driving | Partial | Stoch. | Sequential | Dynamic | Continuous | Multi |
| Spam filter | Full | Det. | Episodic | Static | Discrete | 1 |
| Pac-Man (basic) | Full | Det. | Sequential | Static | Discrete | Multi |


## 10 Current Landscape Modern AI Applications

The lecture surveys what modern AI can currently do. Understanding this landscape motivates the technical content of the course.

### 101 Natural Language Processing NLP and Audio

The lecture lists the following capabilities:
- **Speech Recognition and Understanding**: Convert spoken audio to text; understand intent (Siri, Google Assistant, Alexa)
- **Text-to-Speech**: Convert text to natural-sounding voice (used in accessibility, navigation, virtual assistants)
- **Sentiment Detection**: Is this text positive, negative, or neutral? Does this speaker sound angry or happy?
- **Text Generation**: LLMs writing coherent paragraphs, essays, code (ChatGPT, Claude, Gemini)
- **Speech Generation / Song Generation**: AI models now generate music and singing (Suno, Udio)
- **Extremely Capable Chatbots**: Systems like ChatGPT that can hold meaningful conversations, answer complex questions, and assist with many tasks
- **Personal Assistants**: Integrated AI assistants for productivity
- **Translation**: Machine translation (Google Translate, DeepL) now approaches human quality for high-resource language pairs

### 102 Computer Vision

- **Object Detection**: Identify and locate objects in images/video (YOLO, Faster R-CNN - used in autonomous driving, security)
- **Object Tracking**: Follow objects across video frames
- **Pose Estimation**: Determine body/hand/face pose from images (used in fitness apps, AR/VR, motion capture)
- **Demographics Prediction**: Estimate age, gender, emotion from face images (controversial privacy implications)
- **Anomaly Detection**: Flag unusual patterns in surveillance or industrial monitoring
- **Medical Decision Aids**: Detect cancer in radiology images, diabetic retinopathy in eye scans - often matching or exceeding human radiologists in narrow tasks
- **Image Generation**: Stable Diffusion, DALL-E, Midjourney - generate photorealistic images from text
- **Image Enhancement**: Upscaling, denoising, colorization of old photos

### 103 Game Playing

Game playing has been a major AI benchmark because rules are perfectly specified, success is objectively measurable, and the games require sophisticated planning and reasoning. Key milestones:
- Deep Blue defeats Kasparov at chess (1997) - brute-force search with hand-crafted evaluation
- Watson defeats humans at Jeopardy (2011) - NLP + knowledge retrieval
- AlphaGo defeats world Go champion Lee Sedol (2016) - deep RL + Monte Carlo tree search
- OpenAI Five defeats professional Dota 2 teams (2019) - deep RL at massive scale
- AlphaStar defeats professional StarCraft II players (2019) - imperfect information, long time horizons

Each required qualitatively different approaches, showing that "game playing" is not a solved monolithic problem.

### 104 Autonomous Driving

One of the most complex real-world AI deployments. It combines:
- **Perception**: Computer vision and lidar to detect other cars, pedestrians, traffic signals, lane markings
- **Prediction**: What will other agents (cars, cyclists, pedestrians) do in the next few seconds?
- **Planning**: What path should the vehicle follow? How should it handle intersections, merges, and unexpected obstacles?
- **Control**: Converting high-level plans into steering angles and pedal commands

Autonomous driving is a partially observable, stochastic, sequential, dynamic, continuous, multi-agent problem - essentially the hardest combination of all six dimensions.

### 105 Generative AI Examples Visual

The lecture illustrates:
- **Face generation**: Photorealistic fake human faces (GAN-based, "This Person Does Not Exist")
- **Text-to-image**: "Avocado chair" - generating an object that does not exist from a description
- **Style transfer**: Apply the artistic style of one image to another (e.g., a photo rendered in Van Gogh's style)
- **Video generation**: Sora generating a cinematic video from a text prompt
- **Code generation and debugging**: ChatGPT writing and fixing code


## 11 Scope of This Course

**Important clarification from the lecture**: If you want to learn deep learning and machine learning in depth, COMP341 is the wrong class. See ENGR421 (Machine Learning) and COMP441 for those topics.

**What COMP341 covers**: A broad overview of AI, including:
- **Search algorithms**: Uninformed search (BFS, DFS), informed search (A*, heuristics), adversarial search (Minimax, Alpha-Beta)
- **Constraint satisfaction problems**: Formulating and solving problems as constraint networks
- **Logical reasoning**: Propositional and first-order logic, inference, knowledge representation
- **Probabilistic reasoning**: Bayesian networks, uncertainty, probabilistic inference
- **Decision-making under uncertainty**: MDPs, value iteration, policy iteration
- **Reinforcement learning**: Learning from reward signals - "getting back to decision-making roots"
- **Machine learning basics**: Enough to understand modern AI, not to become an ML practitioner
- **Modern AI/speculative topics**: Foundation models, where AI is headed

**Why breadth-first?** Modern AI practitioners who only know deep learning are poorly equipped to reason about agent design, planning under uncertainty, or the philosophical questions underlying AI. This course provides the conceptual scaffolding that makes it possible to understand, evaluate, and extend any AI system - not just the current fashionable ones.

The course explicitly acknowledges it may feel "old" sometimes (the algorithms are foundational, not cutting-edge) and "too speculative" other times (the frontier is genuinely unclear). This is an honest description of where AI stands.


## Key Concepts Quick Reference

| Term | Definition |
| :--- | :--- |
| **Agent** | Autonomous entity that perceives an environment through sensors and acts through actuators |
| **Percept** | A single sensor reading at one point in time |
| **Percept history** | The complete sequence of all percepts the agent has ever received |
| **Rational agent** | An agent that selects actions to maximize expected utility |
| **Utility** | Numerical measure of outcome quality; what the rational agent maximizes |
| **PEAS** | Performance, Environment, Actuators, Sensors - the four design dimensions of any agent |
| **Turing Test** | Behavioral test: can a machine fool a human judge into thinking it is human? |
| **Four views of AI** | Think humanly, act humanly, think rationally, act rationally |
| **Bounded rationality** | Acting as well as possible given limited information and computation |
| **AI Winter** | Period of reduced funding and interest following overpromised AI results |
| **Expert system** | AI system encoding expert knowledge as IF-THEN rules with a logic inference engine |
| **Backpropagation** | Algorithm for computing gradients in multi-layer neural networks (enables learning) |
| **Deep learning** | Neural networks with many hidden layers; dominant modern approach |
| **Generative AI** | AI that creates new content (images, text, audio, video) from prompts |
| **Hallucination** | When an LLM confidently produces false or fabricated information |
| **Foundation model** | Large pretrained model fine-tunable for many downstream tasks |


## Further Reading

- Russell, S. & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach* (4th edition). Pearson. Chapter 1 (Introduction) and Chapter 2 (Intelligent Agents).
- Turing, A. (1950). "Computing Machinery and Intelligence." *Mind*, 59(236), 433–460.
- McCulloch, W.S. & Pitts, W. (1943). "A logical calculus of the ideas immanent in nervous activity." *Bulletin of Mathematical Biophysics*, 5(4), 115–133.
- Goodfellow, I. et al. (2014). "Generative Adversarial Nets." *NeurIPS*.
- Self-study recommended by professor: Search "Foundation Models" and "Transformer architecture" to understand the technical basis of modern LLMs.
