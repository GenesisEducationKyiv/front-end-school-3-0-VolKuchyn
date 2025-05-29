# ADR 0000: Switching from JavaScript to TypeScript

## Context

We face increasing challenges in maintaining a large codebase written in JavaScript. The main challenges include the lack of type-safety, which causes errors that are only discovered at runtime. There are also significant difficulties with scaling and code refactoring. The absence of explicitly documented APIs (in the form of types) makes communication between developers less efficient. Additionally, the business now demands higher product quality and reliability.

## Decision

We switch from JavaScript to TypeScript in our code base.
We:

+ Initialize the TypeScript configuration with tsconfig.json.

+ We rewrite all js and jsx code to ts and tsx code, respectively

+ Set the types of third-party libraries via @types/....

+ We will teach the team the basics of TS and start using typing in code-review.

## Rationale

TypeScript allows you to:

+ Detect errors at the development stage, not at runtime.

+ Provide auto-completion and type checking in editors.

+ Facilitate code refactoring and maintenance.

+ Improve documentation by using types.

The rejected alternative - to leave JavaScript - does not solve the current problems related to scalability, reliability, and code quality.

## Status

**Pending**

## Consequences

### Positive:

+ Code reliability and error detection speed increase.

+ It's easier for the team to work with other people's code thanks to auto-completion and types.

+ Maintainability improves, especially over the long haul.

+ More space for scaling

### Negatives/challenges:

+ Initial decrease in development speed due to training and refactoring.

+ The need to customize types for third-party libraries.

+ Possible confusion during migration (mixed .js/.ts environment).