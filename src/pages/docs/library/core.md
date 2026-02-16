# Core Library Reference

Gene's standard library provides essential functions for working with data structures, control flow, I/O, and more. The library is designed to be both AI-friendly and performance-oriented.

## Data Types

### Numbers

Gene supports integers and floating-point numbers with automatic conversion:

```gene
# Integer arithmetic with standard operators
(println (1 + 2 + 3))      # => 6
(println (4 * 5))          # => 20
(println (10 / 3))         # => 3.333...
(println (2 + 3 * 4))      # => 14 (operator precedence)

# Type checking (built-in predicates)
(println (42 .is_int))     # => true
(println (3.14 .is_float)) # => true
```

### Strings

String manipulation and formatting:

```gene
# String operations with method calls
(var s "Hello, Gene!")
(println s/.length)           # => 12
(println s/.to_upper)         # => "HELLO, GENE!"
(println ("42" .to_i))        # => 42 (string to integer)
(println ("hello" .append " world"))  # => "hello world"
```

### Collections

#### Arrays
```gene
# Creation and access with / operator
(var arr [1 2 3 4 5])
(println "Array:" arr)
(println "First:" arr/0)      # => 1
(println "Last:" arr/4)       # => 5

# Array modification
(arr/0 = 10)
(println "Modified:" arr/0)   # => 10

# Collection methods
(var doubled (arr .map (fn [x: Int] -> Int (x * 2))))
(var evens (arr .filter (fn [x: Int] -> Bool ((x % 2) == 0))))
```

#### Maps
```gene
# Creation and access with / operator
(var m {^name "Alice" ^age 30 ^city "NYC"})
(println "Name:" m/name)      # => Alice
(println "Age:" m/age)        # => 30

# Map modification
(m/age = 31)
(m/email = "alice@example.com")
(println "Updated:" m)
```

## Control Flow

### Conditionals

```gene
# Basic if-else with standard operators
(if (x > 0)
  (println "positive")
else
  (println "non-positive")
)

# Multiple conditions with elif
(if (x < 0)
  (println "negative")
elif (x > 0)
  (println "positive")
else
  (println "zero")
)

# Boolean operations
(println (true && false))     # => false
(println (true || false))     # => true
```

### Loops

```gene
# Loop with break
(var count 0)
(loop
  (count += 1)
  (if (count >= 5)
    (break)
  )
)

# For each
(for item in [1 2 3 4]
  (println "Item:" item)
)

# Collection methods
(var numbers [1 2 3 4 5])
(var doubled (numbers .map (fn [x: Int] -> Int (x * 2))))
(var evens (numbers .filter (fn [x: Int] -> Bool ((x % 2) == 0))))
(var sum (numbers .reduce 0 (fn [acc: Int x: Int] -> Int (acc + x))))
```

## Functions

### Definition and Calls

```gene
# Simple function with types
(fn add [a: Int b: Int] -> Int
  (a + b)
)

# Function with metadata
(fn factorial [n: Int] -> Int
  ^description "Computes factorial recursively"
  ^complexity "O(n)"
  ^intent "Calculate n!"
  ^examples [{^input 5 ^output 120}]
  (if (n <= 1)
    1
  else
    (n * (factorial (n - 1)))
  )
)

# Anonymous functions
(var square (fn [x: Int] -> Int (x * x)))
(println (square 5))          # => 25
```

### Higher-Order Functions

```gene
# Function that returns a function
(fn make-adder [n: Int] -> Any
  (fn [x: Int] -> Int (x + n))
)

(var add5 (make-adder 5))
(println (add5 10))           # => 15

# Function that takes functions
(fn apply-twice [f: Any x: Int] -> Int
  (f (f x))
)

(var result (apply-twice (fn [x: Int] -> Int (x * 2)) 3))
(println result)              # => 12
```

## I/O Operations

### Console I/O

```gene
# Output
(print "Hello, World!")
(println "With newline")
(printf "Name: %s, Age: %d" name age)

# Input
(var name (read-line))        ; Read line from stdin
(var number (read-number))    ; Read and parse number
```

### File I/O

```gene
# Synchronous file operations
(io/read "file.txt")          ; Read entire file
(io/write "file.txt" content) ; Write to file
(io/append "log.txt" entry)   ; Append to file

# File predicates
(io/exists? "file.txt")       ; Check if file exists
(io/directory? "path")        ; Check if directory
```

### Async I/O

```gene
# Async file operations
(async fn load-config []
  (var content (await (io/read-async "config.json")))
  (json/parse content))

# Async HTTP (when available)
(async fn fetch-data [url]
  (var response (await (http/get url)))
  (json/parse response))
```

## Error Handling

### Try-Catch

```gene
# Basic error handling
(try
  (/ 10 0)                    ; This will error
  (catch *                    ; Catch any error
    (print "Division by zero!")
    0))

# Specific error types
(try
  (parse-number "not-a-number")
  (catch ParseError e
    (print "Parse failed:" e)
    nil))
```

### Assertions

```gene
# Runtime assertions
(assert (> x 0) "x must be positive")
(assert-type x Number "x must be a number")
```

## Type System

### Type Checking

```gene
# Basic type predicates
(type? x Number)              ; Check if x is a Number
(number? x)                   ; Equivalent shorthand
(string? "hello")             ; → true
(list? [1 2 3])               ; → true

# Gene-specific types
(gene? (Person ^name "Alice" 30))  ; → true
(symbol? 'hello)                   ; → true
```

### Type Conversion

```gene
# Number conversions
(int 3.14)                    ; → 3
(float 42)                    ; → 42.0

# String conversions
(str 42)                      ; → "42"
(parse-number "42")           ; → 42

# Collection conversions
(vec [1 2 3])                 ; List to vector
(list #{1 2 3})               ; Set to list
```

## Metaprogramming

### Code Manipulation

```gene
# Generate code dynamically
(var code '(+ 1 2))
(eval code)                   ; → 3

# Inspect code structure
(first '(+ 1 2))              ; → +
(rest '(+ 1 2))               ; → (1 2)

# Build code programmatically
(var operation '+)
(var args [1 2 3])
(eval (cons operation args))  ; → 6
```

### Macros

```gene
# Define macros for code transformation
(macro when [condition & body]
  `(if ,condition
     (do ,@body)))

# Use macros
(when (> x 0)
  (print "Positive")
  (increment x))
```

## AI-Friendly Features

### Uniform API Design

All core functions follow consistent patterns:

```gene
# Predicate functions end with ?
(number? x)
(empty? collection)
(exists? path)

# Conversion functions are named by target type
(str x)         ; Convert to string
(int x)         ; Convert to integer
(list x)        ; Convert to list
```

### Self-Documenting Code

```gene
# Functions can include metadata
(fn process-user [user]
  ^description "Process user registration"
  ^example "(process-user {:name \"Alice\" :email \"alice@example.com\"})"
  ^returns "User ID or nil if validation fails"
  (if (valid-user? user)
    (save-user user)
    nil))
```

### Code Generation Helpers

```gene
# Easy code generation for AI
(fn generate-getter [field-name]
  `(fn ,(symbol (str "get-" field-name)) [obj]
     (get obj ,(keyword field-name))))

# Generate multiple functions
(map generate-getter ["name" "age" "email"])
```

## Performance Notes

### Efficient Operations

- **Number arithmetic**: Direct CPU operations with NaN-boxing
- **String operations**: Optimized string handling in VM
- **Collection access**: O(1) for vectors, O(log n) for maps
- **Function calls**: ~3.8M calls/sec with bytecode VM

### Memory Management

- **Reference counting**: Automatic memory management
- **Scope lifetime**: Proper cleanup in async contexts
- **Object pooling**: Reuse common objects

## Next Steps

- [Async & I/O](/docs/library/async) - Asynchronous programming
- [Language Principles](/docs/language/principles) - Understanding Gene's design
- [Examples](/examples) - See the library in action