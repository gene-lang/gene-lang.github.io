# Gene Data Structure & Principles

Gene is built around a unique, unified data structure that combines three components: **type**, **properties**, and **children**. This design enables powerful homoiconicity and makes Gene ideal for AI code generation and reasoning.

## The Gene Data Structure

Unlike traditional S-expressions or JSON, Gene combines three structural elements into one:

```gene
(type ^prop1 value1 ^prop2 value2 child1 child2 child3)
```

### Components

| Component | Description | Example |
|-----------|-------------|---------|
| **Type** | The first element, identifying what kind of data this is. Can be any Gene data. | `if`, `fn`, `(fn f [a b] (+ a b))` |
| **Properties** | Key-value pairs prefixed with `^`. Keys are strings, values can be any Gene data. | `^name "Alice"`, `^age 30` |
| **Children** | Positional elements after the type. Can be any Gene data. | `child1 child2 child3` |

### Examples

**Data:**
```gene
(var person `(Person ^name "Alice" ^age 30 ^active true))
(var config `(Config ^env "production" ^debug false "database" "cache" "api"))

# Access with / operator
(println person/name)  # => Alice
(println person/age)   # => 30
```

**Code:**
```gene
(fn factorial [n: Int] -> Int
  ^description "Computes factorial recursively"
  ^complexity "O(n)"
  ^intent "Calculate n!"
  (if (n <= 1)
    1
  else
    (n * (factorial (n - 1)))
  )
)
```

## Key Principles

### 1. Homoiconicity

Code and data share the same representation. This means:

- **Code is data**: Programs can manipulate their own source code
- **Data is code**: Data structures can be executed as programs
- **AI-friendly**: Uniform syntax makes it easy for AI to generate and reason about code

```gene
# This is data (use backtick to quote)
(var person `(Person ^name "Alice" ^age 30))

# This is code (same structure!)
(class Person
  (ctor [name: String age: Int]
    (/name = name)
    (/age = age)
  )
  (method greet _
    (println "Hello, I'm" /name)
  )
)
```

### 2. Self-Describing Data

Every Gene structure includes its type information, making data self-documenting:

```gene
# Traditional approach (ambiguous)
["Alice" 30 true]

# Gene approach (self-describing)
(var person `(Person ^name "Alice" ^age 30 ^active true))
(println person/name)   # Access properties with /
(println person/age)
```

### 3. Flexible DSLs

The unified structure enables natural domain-specific languages:

```gene
# HTML-like DSL using Gene structures
(var page `(html ^lang "en"
  (head
    (title "My Page"))
  (body ^class "container"
    (h1 "Welcome")
    (p "Hello, world!"))))

# Configuration DSL
(var config `(server ^port 8080 ^host "localhost"
  (database ^type "postgres" ^url "localhost:5432")
  (cache ^type "redis" ^ttl 3600)))
```

### 4. AI-First Design Benefits

Gene's homoiconic design provides unique advantages for AI development:

#### Easy Code Generation
```gene
# AI can easily generate this pattern
(fn process-user [user: Any]
  ^generated-by "AI"
  ^confidence 0.95
  ^intent "Process user based on active status"
  (if user/active
    (send-welcome user)
  else
    (archive-user user)
  )
)
```

#### Consistent Structure
Every Gene construct follows the same pattern, making it predictable for AI systems:

```gene
# Function definition with types
(fn name [arg: Type] -> ReturnType body)

# Class definition with inheritance
(class Name < Parent
  (ctor [args] body)
  (method name [args] body)
)

# Conditional with elif
(if condition
  then-body
elif another-condition
  elif-body
else
  else-body
)

# Data structure
(Type ^prop value children)
```

#### Code Transformation
Macros can easily transform code because everything is data:

```gene
# Macro to add logging to functions
(macro logged [fn-def]
  (let [name (first (second fn-def))
        args (second (second fn-def))
        body (drop 2 fn-def)]
    `(fn ,name ,args
       ^logged true
       (print "Calling" ',name "with" ,@args)
       ,@body)))

# Usage
(logged
  (fn add [a b]
    (+ a b)))
```

## Next Steps

- [Macro System Overview](/docs/language/macros) - Learn how to transform code
- [Standard Library](/docs/library/core) - Explore built-in functions
- [Examples](/examples) - See Gene in action