# Core Library Reference

Gene's standard library provides essential functions for working with data structures, control flow, I/O, and more. The library is designed to be both AI-friendly and performance-oriented.

## Data Types

### Numbers

Gene supports integers and floating-point numbers with automatic conversion:

```gene
# Integer arithmetic
(+ 1 2 3)          ; → 6
(* 4 5)            ; → 20
(/ 10 3)           ; → 3.333...

# Type checking
(int? 42)          ; → true
(float? 3.14)      ; → true
(number? "hello")  ; → false
```

### Strings

String manipulation and formatting:

```gene
# Basic operations
(str "Hello" " " "World")     ; → "Hello World"
(length "Gene")               ; → 4
(substring "Programming" 0 4) ; → "Prog"

# String predicates
(string? "hello")             ; → true
(empty? "")                   ; → true
(starts-with? "Gene" "G")     ; → true
```

### Collections

#### Lists
```gene
# Creation and access
(list 1 2 3 4)        ; → [1 2 3 4]
(first [1 2 3])       ; → 1
(rest [1 2 3])        ; → [2 3]
(nth [1 2 3] 1)       ; → 2

# Manipulation
(cons 0 [1 2 3])      ; → [0 1 2 3]
(append [1 2] [3 4])  ; → [1 2 3 4]
(reverse [1 2 3])     ; → [3 2 1]
```

#### Maps
```gene
# Creation and access
(map :name "Alice" :age 30)  ; → {:name "Alice" :age 30}
(get my-map :name)           ; → "Alice"
(keys my-map)                ; → [:name :age]
(values my-map)              ; → ["Alice" 30]

# Manipulation
(assoc my-map :city "NYC")   ; Add key-value pair
(dissoc my-map :age)         ; Remove key
```

## Control Flow

### Conditionals

```gene
# Basic if-else
(if (> x 0)
  "positive"
  "non-positive")

# Multiple conditions
(cond
  (< x 0) "negative"
  (> x 0) "positive"
  :else   "zero")

# Boolean operations
(and true false)      ; → false
(or true false)       ; → true
(not false)           ; → true
```

### Loops

```gene
# While loop
(var i 0)
(while (< i 5)
  (print i)
  (set i (+ i 1)))

# For each
(each item [1 2 3 4]
  (print "Item:" item))

# Map over collection
(map (fn [x] (* x 2)) [1 2 3 4])  ; → [2 4 6 8]

# Filter collection
(filter odd? [1 2 3 4 5])          ; → [1 3 5]
```

## Functions

### Definition and Calls

```gene
# Simple function
(fn add [a b]
  (+ a b))

# Function with metadata
(fn factorial [n]
  ^description "Computes factorial recursively"
  ^complexity "O(n)"
  (if (< n 2)
    1
    (* n (factorial (- n 1)))))

# Anonymous functions
(fn [x] (* x x))              ; Square function
((fn [x] (* x x)) 5)          ; → 25
```

### Higher-Order Functions

```gene
# Function that returns a function
(fn make-adder [n]
  (fn [x] (+ x n)))

(var add5 (make-adder 5))
(add5 10)                     ; → 15

# Function that takes functions
(fn apply-twice [f x]
  (f (f x)))

(apply-twice (fn [x] (* x 2)) 3)  ; → 12
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