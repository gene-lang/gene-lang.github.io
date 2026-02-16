# Recent Features & Enhancements

Gene continues to evolve with new features that enhance developer experience and AI-friendliness. Here are the latest additions to the language.

## Function Metadata: ^intent and ^examples

Functions can now include rich metadata that documents their purpose and validates their behavior.

### ^intent Metadata

The `^intent` property provides a human-readable description of what a function does:

```gene
(fn calculate_tax [amount: Float rate: Float] -> Float
  ^description "Calculate tax on an amount"
  ^intent "Multiply amount by tax rate and return result"
  ^complexity "O(1)"
  (amount * rate)
)
```

This metadata is especially useful for:
- **Documentation generation**: Automatically create API docs
- **AI code understanding**: Help AI systems understand function purpose
- **Developer onboarding**: Quick reference for what functions do

### ^examples Metadata

The `^examples` property includes test cases that validate function behavior:

```gene
(fn factorial [n: Int] -> Int
  ^description "Computes factorial recursively"
  ^intent "Calculate n! = n * (n-1) * ... * 1"
  ^examples [
    {^input 0 ^output 1}
    {^input 1 ^output 1}
    {^input 5 ^output 120}
    {^input 10 ^output 3628800}
  ]
  (if (n <= 1)
    1
  else
    (n * (factorial (n - 1)))
  )
)
```

### Running Examples

Use the `gene run-examples` command to validate functions against their examples:

```bash
# Run examples for all functions in a file
gene run-examples factorial.gene

# Output:
# ✓ factorial(0) = 1
# ✓ factorial(1) = 1
# ✓ factorial(5) = 120
# ✓ factorial(10) = 3628800
# All examples passed!
```

This provides:
- **Automatic testing**: Validate functions without writing separate tests
- **Living documentation**: Examples that are guaranteed to work
- **AI-friendly validation**: Easy for AI to generate and verify test cases

## Operator Precedence

Gene now supports standard mathematical and logical operator precedence, making expressions more intuitive:

```gene
# Mathematical precedence (same as standard math)
(println (2 + 3 * 4))      # => 14 (not 20)
(println (10 / 2 + 3))     # => 8
(println ((2 + 3) * 4))    # => 20 (explicit grouping)

# Comparison operators
(println (x > 5 && y < 10))  # AND has lower precedence
(println (a == b || c == d)) # OR has lowest precedence

# Operator precedence levels (highest to lowest):
# 1. * /          (multiplication, division)
# 2. + -          (addition, subtraction)
# 3. < > <= >=    (comparison)
# 4. == !=        (equality)
# 5. &&           (logical AND)
# 6. ||           (logical OR)
```

Benefits:
- **Natural math expressions**: Write `a + b * c` instead of `(+ a (* b c))`
- **AI-friendly**: Standard precedence matches what AI models expect
- **Less parentheses**: Cleaner, more readable code

## Collection Methods

Arrays and maps now have built-in methods for functional programming:

### .map - Transform Elements

```gene
(var numbers [1 2 3 4 5])
(var doubled (numbers .map (fn [x: Int] -> Int (x * 2))))
# => [2 4 6 8 10]

# With inline functions
(var squares (numbers .map (fn [x: Int] -> Int (x * x))))
# => [1 4 9 16 25]
```

### .filter - Select Elements

```gene
(var numbers [1 2 3 4 5 6])
(var large (numbers .filter (fn [x] (x > 3))))
# => [4 5 6]

(var small (numbers .filter (fn [x] (x <= 2))))
# => [1 2]
```

### .reduce - Aggregate Values

```gene
(var numbers [1 2 3 4 5])
(var sum (numbers .reduce 0 (fn [acc: Int x: Int] -> Int (acc + x))))
# => 15

(var product (numbers .reduce 1 (fn [acc: Int x: Int] -> Int (acc * x))))
# => 120
```

### Method Chaining

Chain multiple methods for complex transformations:

```gene
(var data [1 2 3 4 5 6 7 8 9 10])
(var result (data
  .filter (fn [x: Int] -> Bool (x > 3))
  .map (fn [x: Int] -> Int (x * 2))
  .reduce 0 (fn [acc: Int x: Int] -> Int (acc + x))
))
# => 96  (filters >3: [4,5,6,7,8,9,10], doubles: [8,10,12,14,16,18,20], sums)
```

## Dynamic Property and Index Access

Access object properties and array indices dynamically at runtime:

### Dynamic Array Access

```gene
(var arr [10 20 30 40 50])
(var index 2)
(println arr/index)        # => 30 (evaluates index variable)

# Dynamic indexing in loops
(for i in [0 1 2]
  (println "arr/" i "=" arr/i)
)
# Output:
# arr/0 = 10
# arr/1 = 20
# arr/2 = 30
```

### Dynamic Map Access

```gene
(var person {^name "Alice" ^age 30 ^city "NYC"})
(var key `age)
(println person/key)       # => 30

# Multiple dynamic accesses
(var fields [`name `age `city])
(for field in fields
  (println field "=" person/field)
)
```

### Nested Dynamic Access

```gene
(var data {^users [
  {^name "Alice" ^age 30}
  {^name "Bob" ^age 25}
]})

(var userIndex 0)
(var field `name)
(println data/users/userIndex/field)  # => Alice
```

Benefits:
- **Generic code**: Write functions that work with any property name
- **Data-driven logic**: Property names can come from configuration
- **AI-friendly**: Easy for AI to generate data access patterns

## Class Inheritance

Full support for class inheritance with method overriding:

### Basic Inheritance

```gene
# Base class
(class Animal
  (ctor [name: String]
    (/name = name)
  )
  (method speak _
    (println /name "makes a sound")
  )
)

# Derived class
(class Dog < Animal
  (ctor [name: String breed: String]
    (super .ctor name)  # Call parent constructor
    (/breed = breed)
  )
  (method speak _      # Override parent method
    (println /name "barks! Breed:" /breed)
  )
)

(var dog (new Dog "Max" "Golden Retriever"))
(dog .speak)  # => Max barks! Breed: Golden Retriever
```

### Multiple Levels of Inheritance

```gene
(class Mammal
  (method breathe _
    (println "Breathing air")
  )
)

(class Dog < Mammal
  (method speak _
    (println "Bark!")
  )
)

(class ServiceDog < Dog
  (method work _
    (println "Helping people")
  )
)

(var service_dog (new ServiceDog))
(service_dog .breathe)  # Inherited from Mammal
(service_dog .speak)    # Inherited from Dog
(service_dog .work)     # Defined in ServiceDog
```

### Constructor Chaining

```gene
(class Vehicle
  (ctor [wheels: Int]
    (/wheels = wheels)
  )
)

(class Car < Vehicle
  (ctor [wheels: Int brand: String]
    (super .ctor wheels) # Must call super first
    (/brand = brand)
  )
)

(var car (new Car 4 "Toyota"))
(println car/wheels)    # => 4
(println car/brand)     # => Toyota
```

Benefits:
- **Code reuse**: Share functionality between related classes
- **Polymorphism**: Override methods for specialized behavior
- **AI-friendly**: Inheritance patterns are well-understood by AI models

## Type Annotations

Gene now supports optional type annotations for better documentation and tooling:

```gene
# Function with type annotations
(fn add [a: Int b: Int] -> Int
  (a + b)
)

# Class with typed properties
(class Person
  (ctor [name: String age: Int]
    (/name = name)
    (/age = age)
  )
  (method get_age _ -> Int
    /age
  )
)

# Type annotations are optional - gradual typing
(fn flexible [x]
  (x + 1)  # Works with any numeric type
)
```

## Next Steps

- [Language Principles](/docs/language/principles) - Core concepts
- [Core Library](/docs/library/core) - Standard library reference
- [Examples](/examples) - See these features in action
