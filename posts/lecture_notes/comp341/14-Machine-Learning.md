---
title: "14 - Machine Learning"
date: "2026-05-18"
description: "> Course: COMP341 Intro to AI | Koç University | Asst. Prof. Barış Akgün"
---

# 14 - Machine Learning

> **Course**: COMP341 Intro to AI | Koç University | Asst. Prof. Barış Akgün
> **Target**: CS student with strong programming background, zero prior AI/ML experience.



## 1 What is Machine Learning

Before anything else, let us be honest about what ML is and what it is not.

### Definitions

The lecture presents three complementary definitions:

- **Arthur Samuel (1959)**: "Field of study that gives computers the ability to learn without being explicitly programmed."
- **Oxford Dictionary**: "The capacity of a computer to modify its processing on the basis of newly acquired information."
- **Jordan and Mitchell (2015)**: "Improving some measure of performance for a given task given training experience."

Each definition captures something different. Samuel emphasizes *not* writing explicit rules. Oxford emphasizes *adaptation*. Jordan and Mitchell are the most precise: there is a **task**, a **performance measure**, and **experience (data)** that causes improvement.

### The Core Intuition

Traditional programming looks like this:

```text
Rules + Data → Computer Program → Answers
```

Machine learning flips it:

```text
Data + Answers → ML Algorithm → Rules (a model)
```

You do not hand-craft every decision. Instead, you show the computer many examples and let it figure out the pattern.

**Analogy**: Teaching a child to recognize dogs. You do not give them a rulebook ("ears must be floppy OR pointy, tail must wag at 2–5 Hz..."). You show them many dogs (and many non-dogs) and they learn the pattern. ML algorithms do the same thing, but with mathematical optimization instead of neurons.

### Historical note

The term "AI" was coined in 1956, and "machine learning" in 1959 by Arthur Samuel himself. Samuel was not just a theorist - he built a checkers-playing program that *learned* by playing itself, eventually beating its own creator. When he demonstrated it on TV, IBM stock rose 15 points overnight.


## 2 Brief History of ML

Understanding the history helps you understand *why* certain techniques exist and why the field has had "boom-bust" cycles.

| Year | Milestone |
| :--- | :--- |
| 1763 | Bayes' Theorem foundations |
| 1805 | Least Squares (Gauss/Legendre) |
| 1896 | Linear Regression foundations |
| 1950 | Turing's predictions about thinking machines |
| 1951 | First neural network hardware |
| 1957 | Perceptron (Rosenblatt) - first learning algorithm |
| 1967 | Nearest Neighbors algorithm |
| Late 1960s | Perceptron book: proved perceptrons can't learn XOR - "1st death of NNs" |
| 1970 | Backpropagation derived |
| 1986 | Backpropagation popularized - "rebirth of NNs" |
| 1989 | Reinforcement Learning formalized |
| 1995 | Support Vector Machines - "2nd death of NNs" (SVMs outperformed NNs on many tasks) |
| 1997 | LSTM (Long Short-Term Memory) for sequence NNs |
| 2012 | Deep Learning wins ImageNet - "2nd rebirth of NNs" |
| 2013 | Deep RL plays Atari games |
| 2014 | Generative Adversarial Networks (GANs) |
| 2016 | AlphaGo beats world champion (deep RL) |
| 2017 | Transformers ("Attention is All You Need") |

**Key takeaway**: The field has gone through cycles of hype and disappointment, largely driven by whether compute and data matched the ambition of the algorithms. Deep learning's 2012 comeback was not a new idea - it was old ideas (backprop, NNs from the 1980s) with much more data and GPU compute.

**Samuel's ML ideas for Checkers** are historically instructive:

1. **Rote Learning**: Memorize every board state and its game outcome. Pure lookup table - no generalization.
2. **Self-Learning**: Play against itself and tune the weights of an evaluation function `J(x) = w₁f₁(x) + w₂f₂(x) + ... + wₙfₙ(x)`. The weights (how important is piece count vs king count vs center control?) were learned, not hand-coded. This is the first instance of what we would now call supervised learning or reinforcement learning.


## 3 ML in the Agent Framework

COMP341 is structured around the *rational agent* model. An agent perceives its environment through sensors and acts through actuators, trying to maximize utility. The question is: where does ML fit?

### What we had before ML

- **Search / Adversarial Search**: We hand-wrote evaluation functions and heuristics.
- **CSPs / Local Search**: We hand-wrote constraints and objectives.
- **Bayesian Networks / HMMs**: We hand-designed the structure and provided the CPTs.

In all these cases, a *human* provided the knowledge. The agent was not learning anything - it was executing a human-engineered procedure.

### What ML adds

ML asks: can we *acquire* the knowledge from data instead of from a human designer?

Specifically, for an agent with policy π (mapping states to actions):

1. **Can we learn a model of the environment from data?** (so we can do planning without a hand-crafted model)
2. **Can we learn heuristics/evaluation functions from data?** (so we don't need a chess expert to write an evaluation function)
3. **Can we learn π directly from data/experience?** (behavioral cloning, imitation learning, RL)
4. **Can we learn useful features from raw sensor input?** (e.g., detecting pedestrians from raw camera pixels)

ML is needed when:
- The environment is unknown and can't be modeled by hand
- The designer can't anticipate all situations
- You want to directly program by example instead of by rules
- The task is too complex for explicit rules (face recognition, language understanding)


## 4 What Can Be Learned

Not all ML is the same kind of learning. The lecture distinguishes three categories:

### Learning Parameters

Assume you already know the *structure* or *form* of your model, but you need to find the right numerical values.

- **Example**: You know the conditional probability tables (CPTs) in a Bayesian Network exist, but you want to estimate the probabilities from data.
- **Example**: You know your model is a polynomial, but you need to find the coefficients.
- **Example**: You know your neural network has a fixed architecture, but you need to find all the weights.

This is the most common type of ML. The "learning" is optimization over a fixed model family.

### Learning Structure

Learn the *relationships* between variables - not just the numbers, but the graph topology or model architecture itself.

- **Example**: Learning the Bayesian Network topology (which variables depend on which) from data.
- **Example**: Learning the transition model of a Hidden Markov Model.
- This is harder and less common in intro courses.

### Learning Patterns Unsupervised

Discover structure in data without any labels or predefined model form.

- **Example**: Clustering - find groups of similar items.
- **Example**: Dimensionality reduction - find a compact representation of high-dimensional data.


## 5 Types of Machine Learning

The lecture uses a running example of coins (Turkish lira coins) to illustrate the different types. This is a brilliant pedagogical device - the same object leads to four different ML problem types.

```text
1. What is the monetary value of a coin?     → Supervised Learning (Classification/Regression)
2. Which coins are similar to each other?    → Unsupervised Learning (Clustering)
3. How can I maximize my coins?              → Reinforcement Learning
4. Create a new coin for me.                 → Generative Models
```

### 51 Supervised Learning

**Core idea**: You have **labeled** training data - input/output pairs - and you want to learn a function that maps inputs to outputs. You can then use this function on new, unseen inputs.

```typescript
Training data: (x₁, y₁), (x₂, y₂), ..., (xₙ, yₙ)
Goal: Learn h such that h(x) ≈ f(x) for new x
```

Where:
- `x` is the input (e.g., image of a coin, measurements of a coin)
- `y` is the target label/value (e.g., "1 TL", or diameter in mm)
- `f` is the true (unknown) function we are trying to approximate
- `h` is our learned hypothesis

**Two flavors**:

| Type | Output type | Example |
| :--- | :--- | :--- |
| **Classification** | Discrete class label | Coin → "1 TL", "50 kuruş", etc. Spam → "spam" or "not spam" |
| **Regression** | Continuous value | Coin → monetary value (a number). Predict tomorrow's stock price |

The key: we "minimize the loss" between the target output y and our predicted output ŷ.

### 52 Unsupervised Learning

**Core idea**: You have **unlabeled** data and want to find inherent structure or patterns.

You bring assumptions about what "pattern" means, and the algorithm searches for it. Common tasks:

- **Clustering**: Group similar data points together (e.g., group Turkish coins by similarity without telling the algorithm which coin is which)
- **Anomaly Detection**: Find data points that don't fit the pattern (e.g., counterfeit coins)
- **Dimensionality Reduction / Representation Learning**: Find a compressed representation of data (e.g., reduce 1000-pixel image to 20 numbers that still identify the coin)
- **Density Estimation**: Learn the probability distribution of the data (e.g., "what does a typical coin look like?")

The performance metric depends on your assumptions (e.g., for clustering: minimize distance from each point to its cluster center).

### 53 Reinforcement Learning

**Core idea**: An agent interacts with an environment, receives **reward** (or penalty) for its actions, and learns a **policy** π that maps states to actions to maximize total reward.

```typescript
State (s) → Agent (π) → Action (a) → Environment → New State + Reward
```

Key distinction from supervised learning: **there are no labeled correct actions**. The agent only knows if the overall outcome was good or bad, not what the correct action at each step was.

**Example**: A robot learning to walk. Nobody tells it "at time step 3, move left leg 15 degrees." Instead, it gets a reward for staying upright and moving forward, a penalty for falling. It figures out the rest through trial and error.

RL can learn without any training data (pure self-play/exploration), though it can also incorporate prior data.


## 6 Features and Representations

Before applying any ML algorithm, you must decide *how to represent your data*.

### What is a feature

A **feature** is a measurable property or characteristic of the thing you are trying to classify or predict.

For coins:
- Size (diameter)
- Shape (circular? how circular?)
- Weight
- Luster (shininess)
- Color (silver, gold, bicolor)
- Edge type (smooth, reeded)

### Why features matter

The features must be:
- **Informative**: Correlated with the output you are trying to predict
- **Discriminative**: Different classes should have different feature values

**Example**: Shape is not very discriminative for Turkish coins (they are all circles). Diameter is much more discriminative because different denominations have different sizes.

A bad feature: "number of sides" - all Turkish coins have infinite sides (circles). Completely non-discriminative.
A good feature: "diameter in mm" - 1 kuruş is ~14mm, 50 kuruş is ~21.5mm, 1 TL is ~26mm.

### The input is a vector

Mathematically, we usually represent each example as a vector:

```text
x = [x₁, x₂, ..., xd]  ← d-dimensional feature vector
```

For a coin: `x = [diameter, weight, luster_score]` = a 3D vector.

### Feature engineering vs feature learning

Traditionally, domain experts hand-crafted features. Deep Learning has largely replaced this with *feature learning* - the network learns to extract useful features from raw input (e.g., pixels) automatically.


## 7 Supervised Learning The Core Idea

### The hypothesis and consistency

Given a training set `D = {(x₁, f(x₁)), ..., (xₙ, f(xₙ))}`, our goal is to find a hypothesis `h` such that:

```text
h ≈ f   (h is "consistent" if h(xᵢ) = f(xᵢ) for all training examples)
```

The lecture uses **curve fitting** as the canonical illustration:

Imagine you have 10 data points scattered on a 2D plane. You want to find a curve that passes through (or near) them.

- **Hypothesis 1**: `h = ax + b` (a line) - simple, might not fit well
- **Hypothesis 2**: `h = ax² + bx + c` (quadratic) - more flexible
- **Hypothesis 3**: `h = Σ aₙxⁿ` (high-degree polynomial) - very flexible
- **Hypothesis 4**: A zigzag curve that passes through every single data point exactly - perfectly consistent!

Which one is best? Intuitively, hypothesis 4 is terrible - it memorized the noise in the data and will not generalize to new points.

### Ockhams Razor

> Among competing hypotheses, prefer the simplest one consistent with the data.

This principle, from 14th century philosopher William of Ockham, is foundational to ML. In practice it means: **maximize both consistency (fit) and simplicity (don't be unnecessarily complex)**.

The spectrum from the lecture:
```text
Less consistent ←------------------→ More consistent
More simple    ←------------------→ Less complex

h = ax + b                         (line - simple, less consistent)
h = ax² + bx + c                   (quadratic - medium)
h = Σ aₙxⁿ                        (high polynomial - complex, consistent)
h = noisy_zigzag(x)                (memorized - most consistent, worst generalization)
```


## 8 Overfitting Underfitting and Ockhams Razor

This is one of the most important topics in all of ML. Understanding overfitting is necessary to understand why regularization, cross-validation, and train/test splits exist.

### Underfitting

Your model is **too simple** to capture the true pattern in the data.

- The hypothesis `h` cannot represent the true function `f`
- Poor performance on *both* training data *and* new test data
- Also called **high bias** - the model has a systematic error regardless of how much data you give it

**Example**: Trying to fit a straight line through data that has a clear U-shape (quadratic). The line will always be wrong, no matter how much data you collect.

Signs of underfitting:
- Training error is high
- Validation error is also high (and similar to training error)

### Overfitting

Your model is **too complex** and has fit the noise or peculiarities of the training data rather than the true underlying pattern.

- The hypothesis `h` performs perfectly on training data but poorly on new test data
- Also called **high variance** - small changes in the training set cause large changes in the learned model

**Example**: Using a degree-9 polynomial to fit 10 noisy points. The curve passes through every point exactly, including the ones that were just noise, producing wild oscillations between data points.

Signs of overfitting:
- Training error is very low (near 0)
- Validation/test error is much higher than training error

### The BiasVariance Tradeoff

Every model has two sources of error:

| | Description | Caused by |
| :--- | :--- | :--- |
| **Bias** | Systematic error from wrong assumptions in the model | Too simple model (underfitting) |
| **Variance** | Sensitivity to fluctuations in the training set | Too complex model (overfitting) |

The total expected error is approximately:

```text
Total Error ≈ Bias² + Variance + Irreducible Noise
```

As model complexity increases:
- Bias decreases (the model can capture more patterns)
- Variance increases (the model becomes more sensitive to noise)

There is a **sweet spot** in the middle - a model complex enough to capture the signal, but simple enough to ignore the noise.

```text
Error
  |
  |\                                      Total Error
  | \                                    /
  |  \  Bias²                           /
  |   \                      Variance  /
  |    \                    __________/
  |     \__________________/
  |
  +--------------------> Model Complexity
              ^
         Sweet Spot (minimum total error)
```

### Solutions to overfitting

The lecture names three main solutions:

1. **Regularization**: Add a penalty for model complexity directly to the loss function. Forces the learned model to be simpler. (Covered in Section 13)
2. **Cross-Validation**: Use held-out data to estimate test performance and select the right model complexity. (Section 10)
3. **Train-Validate-Test split**: Reserve data for unbiased performance evaluation. (Section 10)


## 9 KNearest Neighbors kNN

k-NN is described as "a top contender for the easiest ML algorithm." It requires no explicit training phase - you just store the training data and classify new points at query time.

### The core idea

**1-Nearest Neighbor**: For a new query point `x`, find the training point `xᵢ` that is closest to `x` (by some distance measure), and predict the same label as `xᵢ`.

**k-Nearest Neighbors**: Find the `k` closest training points, and predict by **majority vote** among their labels.

**Intuition**: If you want to know if a mushroom is edible, look at the k most similar mushrooms you have already classified. If most of them were edible, predict edible.

### Algorithm for KNearest Neighbors kNN

```text
Input: Training set D = {(x₁, y₁), ..., (xₙ, yₙ)}, query point x, integer k
Output: Predicted label h(x)

1. For each training point xᵢ, compute distance dᵢ = d(xᵢ, x)
2. Sort training points by distance (ascending)
3. Take the top k points (smallest distances)
4. h(x) = mode of their labels  (majority class among k neighbors)
```

In Python:

```python
import numpy as np
from collections import Counter

def knn_predict(X_train, y_train, x_query, k):
    # Step 1: Compute all distances
    distances = [np.linalg.norm(x_train - x_query) for x_train in X_train]
    
    # Step 2: Sort by distance, get top k indices
    sorted_indices = np.argsort(distances)[:k]
    
    # Step 3: Get labels of k nearest neighbors
    k_labels = [y_train[i] for i in sorted_indices]
    
    # Step 4: Return majority vote
    return Counter(k_labels).most_common(1)[0][0]
```

### Distance measures

The choice of distance metric matters enormously:

- **Euclidean distance** (L2): `d(x, xᵢ) = sqrt(Σ(xⱼ - xᵢⱼ)²)` - most common
- **Manhattan distance** (L1): `d(x, xᵢ) = Σ|xⱼ - xᵢⱼ|` - less sensitive to outliers
- **Cosine similarity**: Used for text/high-dimensional data

### Effect of k

- **k = 1**: Very sensitive to noise. Any mislabeled training point will cause wrong predictions near it. Low bias, high variance (overfitting).
- **k = n** (all points): Always predicts the most frequent class. High bias, zero variance (underfitting).
- **k in between**: The sweet spot. Typically odd to avoid ties in binary classification.

**Decision boundaries**: As k increases, the decision boundary becomes smoother. k=1 produces jagged, irregular boundaries. Large k produces smooth, simple boundaries.

### Strengths and weaknesses

| Strength | Weakness |
| :--- | :--- |
| No training time | Slow prediction (must compute all distances at query time) |
| Naturally handles multi-class | High memory usage (store all training data) |
| Simple to implement | Performance degrades in high dimensions ("curse of dimensionality") |
| No assumptions about data distribution | Sensitive to irrelevant/noisy features |

### kNN is nonparametric

The entire training set is used at prediction time. The "model" *is* the training data. The number of parameters grows with the dataset size. This is the definition of a **non-parametric** method.


## 10 Hyperparameter Selection and CrossValidation

### What is a hyperparameter

A **hyperparameter** is a setting of the learning algorithm itself (not a parameter learned from data).

- For k-NN: `k` is a hyperparameter
- For linear regression: the regularization strength `λ` is a hyperparameter
- For neural networks: number of layers, learning rate, etc.

Hyperparameters control the behavior of learning, so they must be selected *before* training. But how do you choose the right value?

### Why not use training data to evaluate

If you tune k by checking performance on the training set, k=1 always wins (it memorizes the training data perfectly with 0 error on its own training examples). This tells you nothing about generalization.

**The fundamental rule**: Never evaluate your model on data it was trained on, and never tune hyperparameters on data you will use for final evaluation.

### The TrainValidateTest Split

Split your dataset into three disjoint parts:

```typescript
All data
├── Training Set    (e.g., 70%) - learn model parameters
├── Validation Set  (e.g., 15%) - tune hyperparameters, select model
└── Test Set        (e.g., 15%) - final, unbiased performance estimate
```

Workflow:
1. Train model on training set for each candidate hyperparameter value
2. Evaluate on validation set
3. Pick the hyperparameter with best validation performance
4. **Report performance on test set only once, at the very end**

**Critical rule**: Never peek at the test set! If you look at the test set to guide decisions, it becomes de facto part of your model selection process, and you no longer have an unbiased estimate of generalization.

### CrossValidation kFold CV

The problem with a single train/validate split: your results might be specific to that particular split. Maybe validation happened to contain easy examples, giving you a misleadingly optimistic hyperparameter choice.

**k-fold cross-validation** solves this:

```
1. Divide training data into k equal "folds"
2. For i = 1 to k:
   a. Use fold i as validation, remaining k-1 folds as training
   b. Train model, record validation performance
3. Average performance across k folds
4. Use full training data with best hyperparameter; evaluate once on test set
```

Illustration (k=5):

```
Fold 1: [VAL] [TRN] [TRN] [TRN] [TRN]
Fold 2: [TRN] [VAL] [TRN] [TRN] [TRN]
Fold 3: [TRN] [TRN] [VAL] [TRN] [TRN]
Fold 4: [TRN] [TRN] [TRN] [VAL] [TRN]
Fold 5: [TRN] [TRN] [TRN] [TRN] [VAL]
```

Each data point is used as validation exactly once. Average the 5 performance scores.

**This technique is universal** - it works with any ML method, not just k-NN.

### Combining CV with hyperparameter search

```python
# Pseudocode for k-NN hyperparameter selection
best_k = None
best_val_accuracy = 0

for k in [1, 3, 5, 7, 11, 15]:
    # 5-fold cross-validation
    val_accuracies = []
    for fold in range(5):
        X_train_fold, X_val_fold = split_fold(X_train, fold)
        acc = knn_evaluate(X_train_fold, X_val_fold, k)
        val_accuracies.append(acc)
    
    avg_acc = mean(val_accuracies)
    if avg_acc > best_val_accuracy:
        best_val_accuracy = avg_acc
        best_k = k

# Final evaluation on test set (only once)
final_acc = knn_evaluate(X_train_all, X_test, best_k)
```

Note: CV with deep learning is often not feasible (training takes too long). A single large validation split is used instead.


## 11 Parametric vs NonParametric Methods

This is a conceptual distinction that applies to all ML methods.

### Parametric Methods

- **Fixed number of parameters** regardless of dataset size
- At training time: learn the parameters from data
- At prediction time: only the parameters are needed (not the training data)
- **Examples**: Linear regression (parameters = weights), logistic regression, neural networks

Once trained, you can throw away the training data. The model is fully described by its parameters.

```typescript
Training data (n=10,000) → Learning → Parameters (100 weights) → Model
```

### NonParametric Methods

- **Flexible/growing number of parameters** - can grow with the dataset
- The name is misleading: these methods *do* have parameters; there are just no fixed number of them
- **k-NN**: The entire training set IS the model. n=10,000 data points → 10,000 stored vectors
- **Decision Trees**: The tree can grow as large as needed to fit the data

**Trade-off**:

| | Parametric | Non-Parametric |
| :--- | :--- | :--- |
| Memory | Small (fixed params) | Large (grows with data) |
| Prediction speed | Fast | Slow (k-NN must search all data) |
| Flexibility | Limited by model form | Can fit arbitrary functions |
| Training | Often slower (optimization) | k-NN: instant (just store data) |


## 12 Linear Regression

Linear regression is one of the oldest and most important ML methods. Despite its simplicity, it is still widely used and forms the basis for more complex methods.

### The model Linear Regression

Given n training pairs `{(xᵢ, yᵢ)}`, find a linear function:

```
ŷ = w₀ + w₁x₁ + w₂x₂ + ... + wdxd = wᵀf(x)
```

Where:
- `w = [w₀, w₁, ..., wd]` are the **weights** (parameters to learn)
- `f(x) = [1, x₁, x₂, ..., xd]` is the **feature vector** (with a 1 prepended for the bias term `w₀`)
- `ŷ` (y-hat) is the prediction

The `f(xᵢ)` functions can be nonlinear transformations of the input - the model is "linear" only in the **weights** `w`, not necessarily in the raw inputs.

**Example**: Predicting coin value from diameter and weight:
```typescript
ŷ = w₀ + w₁·(diameter) + w₂·(weight)
```

### The loss function

We want to find weights that make predictions as close as possible to the true values. Define the **total squared error** (also called the **sum of squared residuals**):

```typescript
J(D, w) = Σᵢ (yᵢ - ŷᵢ)² = Σᵢ (yᵢ - wᵀf(xᵢ))²
```

Why squared error? Several reasons:
1. Penalizes large errors more than small ones (squaring amplifies big mistakes)
2. Differentiable everywhere (unlike absolute value)
3. Has a closed-form solution (unique minimum for linear models)
4. Corresponds to Maximum Likelihood under Gaussian noise assumption

### Solving for w Least Squares

To minimize J, take the derivative with respect to w and set it to zero:

```text
dJ/dw = 0   →   w* = (XᵀX)⁻¹XᵀY
```

Where:
- `X` is the `n × (d+1)` design matrix (each row is a feature vector f(xᵢ))
- `Y` is the `n × 1` vector of target values

This is the **closed-form** or **normal equations** solution.

```python
import numpy as np

def linear_regression_train(X, y):
    # Add bias column (column of 1s)
    X_aug = np.column_stack([np.ones(len(X)), X])
    # Compute closed-form solution: w = (XᵀX)⁻¹XᵀY
    w = np.linalg.lstsq(X_aug, y, rcond=None)[0]
    return w

def linear_regression_predict(X, w):
    X_aug = np.column_stack([np.ones(len(X)), X])
    return X_aug @ w
```

### Nonlinear features

The key insight: even though the model is linear in w, the features f(x) can be anything:

- `f(x) = [1, x, x²]` → fits a parabola
- `f(x) = [1, x, sin(x)]` → fits a sinusoidal trend
- `f(x) = [1, x₁, x₂, x₁x₂]` → includes interaction terms

This makes linear regression surprisingly powerful. The burden is on **feature engineering** - choosing the right transformations.

When f(x, w) is nonlinear in w (e.g., neural networks), the closed-form solution no longer works. You must use iterative optimization (gradient descent, covered next).


## 13 Regularization Preventing Overfitting

When features are many or the model is flexible (high-degree polynomials), weights can become very large, causing overfitting.

### The intuition

Large weights mean the model is highly sensitive to small changes in the input. This leads to wild oscillations - the hallmark of overfitting.

**Regularization** adds a penalty for large weights directly to the loss function, forcing the model to keep weights small and smooth.

### Ridge Regression L2 regularization

```text
J(D, w) = Σᵢ (yᵢ - wᵀf(xᵢ))² + λ·wᵀw
```

The term `λwᵀw = λ||w||²` is the L2 norm squared of the weights.

- `λ` (lambda) is the **regularization hyperparameter**
  - `λ = 0`: No regularization (plain least squares)
  - Large `λ`: Strong regularization (weights shrink toward zero, model is smoother)
  - How to choose? Cross-validation!

Closed-form solution with regularization:
```text
w* = (XᵀX + λI)⁻¹XᵀY
```

Where `I` is the identity matrix. (Adding `λI` also makes the matrix more numerically stable and always invertible.)

### Lasso Regression L1 regularization

```text
J(D, w) = Σᵢ (yᵢ - wᵀf(xᵢ))² + λ·||w||₁
```

L1 norm = sum of absolute values of weights. This tends to produce **sparse** solutions - many weights become exactly 0. Useful for feature selection (automatically tells you which features are irrelevant).

### Elastic Net

Combines L1 and L2:
```text
J(D, w) = Σᵢ (yᵢ - wᵀf(xᵢ))² + λ₁||w||₁ + λ₂||w||₂²
```

### General principle

The regularization idea generalizes: add a term that penalizes model complexity to any loss function. This "smoothing" principle applies to Naive Bayes (Laplace smoothing), neural networks (weight decay), and others.


## 14 Gradient Descent

When the model is nonlinear in w (e.g., neural networks), there is no closed-form solution. We need **iterative optimization**.

### The idea

If J(w) is the loss function (objective to minimize), and we can compute its gradient `∇J(w)` (the direction of steepest ascent), then we can move w in the *opposite* direction to reduce J.

```typescript
w(t+1) = w(t) - α·∇J(w(t))
```

Where:
- `α` (alpha) is the **learning rate** (step size) - a hyperparameter
- `∇J(w)` is the gradient vector `[∂J/∂w₁, ..., ∂J/∂wₐ]`

**Analogy**: You are blindfolded on a hilly landscape, trying to find the lowest valley. You can feel the slope under your feet (the gradient). Always step in the downhill direction. With a good step size, you eventually reach a valley (minimum).

### Algorithm for Gradient Descent

```python
def gradient_descent(initial_w, grad_J, alpha=0.01, max_iter=1000, tol=1e-6):
    w = initial_w
    for t in range(max_iter):
        gradient = grad_J(w)
        w_new = w - alpha * gradient
        
        # Check convergence
        if np.linalg.norm(w_new - w) < tol:
            break
        
        w = w_new
    return w
```

### Stopping criteria

- Maximum number of iterations reached
- Change in w is less than a tolerance: `|w(t+1) - w(t)| < epsilon`
- Change in loss is very small

### The learning rate matters

- Too large `α`: Overshoots the minimum, oscillates or diverges
- Too small `α`: Converges correctly but very slowly
- Adaptive methods (Adam, RMSProp, AdaGrad) automatically tune the learning rate per parameter

### General objective with regularization

```text
J(D, w) = Σᵢ ℓD(yᵢ, f(xᵢ, w)) + λ·ℓw(w)
```

Where:
- `ℓD` is the data-dependent loss (e.g., squared error for regression, log-loss for classification)
- `ℓw` is the weight regularization term (e.g., L2 norm)

As long as both terms are differentiable, gradient descent applies.

### Variants

| Variant | How | Property |
| :--- | :--- | :--- |
| Batch GD | Gradient over entire dataset | Stable, slow per step for large datasets |
| Stochastic GD (SGD) | Gradient on single random sample | Noisy but fast per step, escapes local minima |
| Mini-batch GD | Gradient on a batch (e.g., 32 samples) | Best of both worlds - used in deep learning |


## 15 Logistic Regression

### The problem Classification with a linear model

Linear regression outputs a real number `(-∞, +∞)`. For binary classification (output 0 or 1), we need to squash this into [0, 1] and interpret it as a probability.

### The sigmoid logistic function

```text
σ(x) = 1 / (1 + e^(-x))
```

Properties:
- Output is always between 0 and 1 - perfect for probabilities
- `σ(0) = 0.5` - the decision boundary
- `σ(+∞) → 1`, `σ(-∞) → 0`
- Smooth and differentiable everywhere
- Derivative: `σ'(x) = σ(x)(1 - σ(x))`

The slope (steepness of the transition) is controlled by the weight `w₁`: larger `|w₁|` creates a sharper boundary.

### The model Logistic Regression

```text
ŷ = g(wᵀf(x)) = 1 / (1 + exp(-wᵀf(x)))
```

Interpreted as `P(y=1|x)` - probability the class is 1 given input x.

Classification rule: predict class 1 if `ŷ > 0.5`, else predict class 0.

### The loss function Logloss binary crossentropy

Squared error is not ideal for probabilities (it leads to a non-convex optimization). Use **log-loss** (negative log-likelihood):

```text
ℓ(yᵢ, f(xᵢ)) = -yᵢ·log(ŷᵢ) - (1 - yᵢ)·log(1 - ŷᵢ)
```

This comes from information theory (entropy) and MLE. Intuition:
- If the true label `yᵢ = 1` and we predict `ŷᵢ = 0.99`: loss ≈ -log(0.99) ≈ 0.01 (very small - we were right and confident)
- If the true label `yᵢ = 1` and we predict `ŷᵢ = 0.01`: loss ≈ -log(0.01) ≈ 4.6 (large - we were confidently wrong)
- This heavily penalizes confident wrong predictions.

### Learning

No closed form solution. Use gradient descent on the total log-loss:

```text
Total Loss = Σᵢ [-yᵢ·log(g(wᵀf(xᵢ))) - (1-yᵢ)·log(1 - g(wᵀf(xᵢ)))]
```

Add regularization (e.g., `+ λ||w||²`) to prevent overfitting.

Despite the name "regression", logistic regression is a **classification** method.


## 16 Discriminative vs Generative Models

This is a fundamental distinction in how ML models approach classification.

### The classification formula

We want: `argmax_y P(y|x)` - the most likely class given the input.

### Discriminative approach

**Learn P(y|x) directly.**

- Directly models the probability of a class given the input
- No need to model the input distribution P(x)
- Examples: Logistic regression, SVMs, k-NN, neural network classifiers

Simpler and usually more accurate when data is plentiful.

### Generative approach

**Learn P(x|y) and P(y), then apply Bayes' theorem.**

By Bayes' theorem:
```text
P(y|x) = P(x|y)·P(y) / P(x)  ∝  P(x|y)·P(y)
```

Since P(x) is the same for all y, we just need to compare `P(x|y)·P(y)` across classes.

Generative models can:
- Classify (using the above formula)
- **Generate** new samples from each class (by sampling from P(x|y))
- Detect outliers (if P(x) is very low for a new point)
- Work with missing features

Examples: Naive Bayes, Gaussian discriminant analysis, GANs, LLMs

### Which is better

Discriminative models usually achieve better classification accuracy when you have enough data. Generative models are more data-efficient and offer additional capabilities (synthesis, anomaly detection).


## 17 Naive Bayes Classifier

### Motivation

We want to use the generative approach for classification. We need to model `P(x|y)` and `P(y)`.

Problem: x is high-dimensional (e.g., a 1000-pixel image). Modeling a full joint distribution `P(x₁, x₂, ..., x₁₀₀₀ | y)` would require an astronomically large table - intractable.

### The Naive Bayes assumption

**Assume all features are conditionally independent given the class label y.**

```text
P(y|x) ∝ P(y) · P(x₁|y) · P(x₂|y) · ... · P(xd|y)
           = P(y) · Π_j P(xⱼ|y)
```

This is "naive" because features are almost never truly independent (e.g., adjacent pixels in an image are highly correlated). But despite the wrong assumption, NB works remarkably well in practice - especially for text classification.

### The Bayesian Network interpretation

The assumption corresponds to a specific BN structure: y is the root node, and all features x₁, ..., xd are children of y with no edges between them.

```
         y (class label)
        / | \
       /  |  \
      /   |   \
    x₁   x₂   x₃  ... xd
```

This structure dramatically reduces the number of parameters to estimate.

### What to learn

Only two things:
1. `P(y)` - prior probability of each class (just count class frequencies in training data)
2. `P(xⱼ|y)` for each feature j and each class y (conditional probability tables, one per feature per class)

### Learning from data counts

Given training examples, estimate probabilities by counting:

```
P(y = c) = (# examples with class c) / (# total examples)

P(xⱼ = v | y = c) = (# examples with class c and xⱼ = v) 
                     / (# examples with class c)
```

### Worked example from the lecture

The table (Y = output, X₁ and X₂ = binary features):

| X₁ | X₂ | Y | Count |
| ---: | ---: | ---: | ---: |
| 1  | 1  | 1  | 20    |
| 1  | 1  | 0  | 0     |
| 1  | 0  | 1  | 3     |
| 1  | 0  | 0  | 12    |
| 0  | 1  | 1  | 0     |
| 0  | 1  | 0  | 14    |
| 0  | 0  | 1  | 8     |
| 0  | 0  | 0  | 1     |

Total: 58 examples. Positives (Y=1): 20+3+8 = 31. Negatives (Y=0): 27.

To classify a new point (X₁=1, X₂=0):
```text
P(Y=1|(1,0)) ∝ P(Y=1)·P(X₁=1|Y=1)·P(X₂=0|Y=1)
             = (31/58) · (23/31) · (11/31)

P(Y=0|(1,0)) ∝ P(Y=0)·P(X₁=1|Y=0)·P(X₂=0|Y=0)
             = (27/58) · (12/27) · (13/27)
```

Compare the two values (no need to divide by P(X₁=1, X₂=0) since it's the same for both). The higher one is the predicted class.

### The overfitting problem zero probabilities

If a feature value never appeared with a certain class in training, `P(xⱼ=v|y=c) = 0`. This **zero probability propagates through the product** and kills the entire class probability!

Example: If the word "lottery" never appeared in training spam emails, then:
```text
P("lottery"|spam) = 0
→ P(spam|email containing "lottery") ∝ 0 × ... = 0
```
This is wrong - the presence of "lottery" should increase the spam probability.

**Solution: Laplace Smoothing**

Add a small count (typically 1) to every frequency before normalizing:

```
P(xⱼ = v | y = c) = (count(xⱼ=v, y=c) + 1) 
                     / (count(y=c) + |number of possible values of xⱼ|)
```

This ensures no probability is ever exactly 0, which fixes both the zero-probability problem and reduces overfitting.

### Naive Bayes for continuous features

For continuous inputs, instead of a probability table, model `P(xⱼ|y)` as a Gaussian:
```typescript
P(xⱼ|y=c) = N(μⱼc, σⱼc²)
```

Where μⱼc and σⱼc² are the mean and variance of feature j among class-c examples. Easy to estimate from data.

### Why NB works despite the naive assumption

Even if the independence assumption is wrong, the *ranking* of class probabilities is often correct. For classification, we only need the correct argmax, not the exact probabilities. So NB's wrong probability estimates still give the right predicted class much of the time.


## 18 Parameter Estimation and Maximum Likelihood

### Maximum Likelihood Estimation MLE

When learning parameters (like P(y) and P(xⱼ|y) in Naive Bayes, or weights in linear regression), the principled approach is **Maximum Likelihood Estimation**.

**Setup**:
- A parameterized distribution P(x; w) (where w are the parameters)
- Data D = {x₁, ..., xₙ} assumed independently drawn from P(x; w) (i.i.d. assumption)

**Goal**: Find w that makes the observed data most probable.

**Likelihood**:
```
L(D, w) = Π_i P(xᵢ; w)
```

Since products of many small numbers underflow numerically, maximize the **log-likelihood**:
```typescript
log L(D, w) = Σᵢ log P(xᵢ; w)
```

The MLE solution:
```text
w* = argmax_w Σᵢ log P(xᵢ; w)
```

### Connection to other methods

- **Linear regression with Gaussian noise** → MLE gives the least squares solution (minimizing squared error = maximizing Gaussian log-likelihood)
- **Logistic regression** → MLE gives the log-loss minimization solution
- **Naive Bayes** → MLE gives the frequency-counting solution

The different "loss functions" in ML are often derivable from MLE under different noise/distribution assumptions.

### Learning parameters for Gaussian distributions

If `P(x|y) = N(μ_y, Σ_y)` (Gaussian with class-specific mean and covariance), MLE gives:

```text
μ_y = (1/nᵧ) · Σ_{i: yᵢ=y} xᵢ     ← sample mean of class-y examples
Σ_y = (1/nᵧ) · Σ_{i: yᵢ=y} (xᵢ - μ_y)(xᵢ - μ_y)ᵀ  ← sample covariance
```

Simply compute the sample mean and covariance within each class. Intuitive and fast.


## 19 Generative Models and LLMs

### Generative models beyond classification

Generative models do not just classify - they model P(x) or P(x|y) and can *generate* new samples.

**Examples**:
- **Gaussian Mixture Model (GMM)**: Model P(x) as a mixture of k Gaussians. Useful for clustering and density estimation.
- **Bayesian Networks and HMMs**: Capture complex joint distributions over structured variables/sequences.
- **Series Forecasting**: Given a history of inputs, predict the next value. The model learns `P(xₜ | xₜ₋ₙ, ..., xₜ₋₁)`. Used for stock price prediction, weather prediction, etc.
- **VAEs and GANs**: Generate realistic images, audio, video.

### Large Language Models

LLMs are fundamentally **generative models of text sequences**:

```text
P(xₜ | xₜ₋ᵥ:ₜ₋₁, θ)
```

Where:
- `xₜ` is the next **token** to generate (a token ≈ word or sub-word, ~a few characters)
- `xₜ₋ᵥ:ₜ₋₁` are the previous tokens (context window - can be thousands of tokens)
- `θ` are the model parameters (billions of weights)

The model simply predicts the probability distribution over the next word given what came before. Sample from this distribution repeatedly to generate text.

This is why some people call LLMs "statistical parrots" - at their core, they are predicting the next word in a sequence based on patterns in training data.

**The surprise**: This simple objective, scaled to enormous datasets (trillions of tokens) and model sizes (billions of parameters), produces systems that can reason, write code, translate languages, and answer questions.

**Multi-modal models** extend this to multiple input/output types (text + images + audio + video), using the same fundamental principle.


## 20 ML Pipelines and Best Practices

### The ML Pipeline

A complete ML system involves more than just training a model:

**Training pipeline**:
```
Raw Data
   ↓
Preprocessing      (handle missing values, normalize, clean outliers)
   ↓
Feature Extraction (transform raw data into useful numeric vectors)
   ↓
Train Model        (fit parameters on training set)
   ↓
Evaluate           (measure performance on held-out validation/test)
   ↓
Deploy / Iterate
```

**Inference pipeline** (when the trained model is used in production):
```text
New Data → Preprocess → Extract Features → Model → Output
```

**Important tip**: If preprocessing and feature extraction are slow (e.g., computing spectrograms from audio), **save the extracted features after the first pass**. Don't recompute them every time you change the model.

### The feedback loop when performance is bad

```text
Not good enough?
├── Features not informative/discriminative → engineer better features
├── Data too noisy → preprocess better
├── Model not appropriate for problem → try different algorithm
├── Not enough data → collect more, or use data augmentation
├── Overfitting (train good, test bad) → regularize, reduce complexity, more data
└── Underfitting (train bad) → more complex model, more features
```

**Never tune based on the test set.** If you keep tweaking until the test set score improves, the test set is no longer a valid estimate of generalization.

### Performance Metrics

Beyond just accuracy:

| Metric | Formula | Use when |
|--------|---------|----------|
| **Accuracy** | (TP + TN) / Total | Balanced classes |
| **Precision** | TP / (TP + FP) | False positives are costly (flagging good emails as spam) |
| **Recall** | TP / (TP + FN) | False negatives are costly (missing cancer diagnosis) |
| **F1 Score** | 2·P·R / (P + R) | Imbalanced classes, need balance of precision and recall |
| **Log-likelihood** | Σ log P(yᵢ|xᵢ) | Probabilistic models |
| **MSE / RMSE** | Mean of (yᵢ - ŷᵢ)² | Regression |

Where: TP = true positive, TN = true negative, FP = false positive, FN = false negative.

### Baselines

Before building a complex system, always establish a **baseline**:

1. **Random classifier**: Predict class uniformly at random. If you can't beat this, the problem is impossible or your features are useless.
2. **Most frequent class classifier**: Always predict the most common class. Crucial for imbalanced datasets - if 99% of emails are not spam, a trivial classifier gets 99% accuracy. Your model must beat this!
3. **Simple ML baselines**: k-NN, Decision Trees, Naive Bayes, Linear/Logistic Regression.
4. **Established strong baselines**: SVMs, Random Forests, Gradient Boosted Trees - these remain very competitive on tabular data.

The lecture also notes: **tune hyperparameters for your baselines too**. A k-NN with wrong k is not a fair baseline.

### Hyperparameter selection summary

| What | How to determine |
| :--- | :--- |
| Model parameters (w) | MLE / minimize loss on training data |
| Hyperparameters (k, λ, learning rate) | Cross-validation on validation set |
| Final performance estimate | Report once on test set, never look at it again afterward |


## 21 Other ML Model Families Overview

The lecture closes by listing other important ML model families. These are directions for further study (not required for the math portions of the exam, but conceptual awareness is expected).

### TreeBased Methods

**Decision Trees**: Recursively partition the feature space. At each node, choose the feature and threshold that best splits the data (e.g., maximizes information gain). Leaves contain class predictions. Highly interpretable but prone to overfitting.

**Random Forests**: Train many decision trees, each on a random subset of data (bagging) and random subset of features. Combine by majority vote. Dramatically reduces overfitting through averaging.

**Gradient Boosted Trees** (XGBoost, LightGBM, CatBoost): Train trees sequentially, each one correcting the errors of the previous. Currently state-of-the-art on structured/tabular data.

### Support Vector Machines SVMs

Find the **maximum margin hyperplane** that separates classes. The "support vectors" are the training points closest to the boundary; they determine the hyperplane.

The **kernel trick** allows SVMs to handle nonlinear boundaries by implicitly mapping to a high-dimensional feature space without computing the mapping explicitly:
```typescript
K(xᵢ, xⱼ) = φ(xᵢ)ᵀφ(xⱼ)   (kernel evaluates dot product in feature space)
```

SVMs were dominant from ~1995–2012, when deep learning overtook them on image and text tasks.

### Kernel Methods

A broader family including SVMs. The **kernel function** `K(xᵢ, xⱼ)` measures similarity without explicitly computing features. Common kernels: linear, polynomial, RBF (Gaussian/radial basis function).

### Probabilistic Graphical Models

Bayesian Networks, Hidden Markov Models, Conditional Random Fields - already covered in COMP341. These represent complex joint distributions with explicit independence assumptions. Useful when domain knowledge about structure is available.

### Neural Networks and Deep Learning

**The core idea**: Stack multiple layers of linear transformations followed by nonlinear activations. Each layer learns progressively more abstract features.

```text
Input → [Linear + Activation] → [Linear + Activation] → ... → Output
```

With enough layers and neurons, a neural network can approximate any continuous function (Universal Approximation Theorem). "Deep" learning = many layers.

Training uses **backpropagation** (chain rule of calculus to compute gradients through all layers) + gradient descent.

**Key architectures**:
- **MLP (Multi-layer Perceptron)**: Fully connected layers, general purpose
- **CNN (Convolutional Neural Network)**: Exploits spatial structure for images
- **RNN / LSTM**: Exploits temporal structure for sequences
- **Transformer**: Self-attention mechanism - currently dominant for language, vision, and more

The 2012 ImageNet breakthrough (AlexNet) used a deep CNN trained on GPUs with 1.2M images. It wasn't a new algorithm - it was old ideas with unprecedented scale.


## Summary Key Relationships

```text
                    Machine Learning
                   /        |        \
          Supervised   Unsupervised  Reinforcement
          Learning      Learning      Learning
         /        \
  Classification  Regression

Supervised Learning Methods:
  Non-parametric:  k-NN (stores all training data, no explicit training)
  Parametric:
    Linear models: Linear Regression, Logistic Regression
    Probabilistic: Naive Bayes
    Kernel:        SVMs
    Trees:         Decision Trees, Random Forests, Gradient Boosting
    Neural Nets:   MLPs, CNNs, RNNs, Transformers

Shared Concerns (apply to ALL methods):
  - Overfitting vs Underfitting (Bias-Variance Tradeoff)
  - Regularization (L1/L2 penalties on weights)
  - Hyperparameter Tuning (use Cross-Validation, not test data)
  - Train / Validate / Test Splits (never peek at the test set)
  - Feature Engineering / Feature Learning
  - Performance Metrics (accuracy, precision, recall, F1, MSE, etc.)
  - Baselines (always compare against simple methods first)
```


## Quick Reference Formulas

| Concept | Formula |
|---------|---------|
| Linear regression prediction | `ŷ = wᵀf(x)` |
| Linear regression loss (MSE) | `J = Σ(yᵢ - ŷᵢ)²` |
| Ridge regression loss | `J = Σ(yᵢ - ŷᵢ)² + λ‖w‖²` |
| Closed-form linear regression | `w* = (XᵀX)⁻¹XᵀY` |
| Ridge closed-form | `w* = (XᵀX + λI)⁻¹XᵀY` |
| Gradient descent update | `w ← w - α·∇J(w)` |
| Sigmoid | `σ(x) = 1/(1 + e⁻ˣ)` |
| Log-loss | `ℓ = -y·log(ŷ) - (1-y)·log(1-ŷ)` |
| Naive Bayes prediction | `ŷ = argmax_y P(y)·Πⱼ P(xⱼ|y)` |
| MLE objective | `w* = argmax_w Σᵢ log P(xᵢ; w)` |
| Bayes' theorem for classification | `P(y|x) ∝ P(x|y)·P(y)` |
| Precision | `TP / (TP + FP)` |
| Recall | `TP / (TP + FN)` |
| F1 Score | `2·P·R / (P + R)` |


*End of Lecture 14 Notes - Machine Learning*
