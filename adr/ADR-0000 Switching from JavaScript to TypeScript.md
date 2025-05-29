# ADR 0000: Switching from JavaScript to TypeScript

## Context

We face increasing challenges in maintaining a large codebase written in JavaScript. The main challenges include:

+ Lack of type-safety, which causes errors that are only discovered at runtime.

+ Difficulties with scaling and code refactoring.

+ Reduced efficiency of communication between developers due to the lack of explicitly documented APIs (types).

+ Increased requirements for product quality and reliability from the business.

## Decision

We switch from JavaScript to TypeScript in our code base.
We:

+ Initialize the TypeScript configuration with tsconfig.json.

+ Allow a mixed environment (allowJs) for a gradual migration.

+ Let's start with utilities, then redux, API, and then components.

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

Pending

## Consequences

### Positive:

+ Code reliability and error detection speed increase.

+ It's easier for the team to work with other people's code thanks to auto-completion and types.

+ Maintainability improves, especially over the long haul.

### Negatives/challenges:

+ Initial decrease in development speed due to training and refactoring.

+ The need to customize types for third-party libraries.

+ Possible confusion during migration (mixed .js/.ts environment).