# Macro System Overview

Gene's macro system enables powerful code transformations at compile-time. Thanks to homoiconicity, macros work with the same data structures as regular code, making them intuitive and powerful.

## What are Macros?

Macros are functions that transform code before it's evaluated. They receive unevaluated arguments (raw AST) and return new code to be evaluated in place.

```gene
# Basic macro definition
(macro when [condition & body]
  `(if ,condition
     (do ,@body)))

# Usage
(when (> x 0)
  (print "Positive")
  (increment-counter))

# Expands to:
(if (> x 0)
  (do
    (print "Positive")
    (increment-counter)))
```

## Macro Syntax

### Definition
```gene
(macro name [parameters]
  ^description "Optional description"
  body)
```

### Quasiquote and Unquote

Gene uses quasiquote (`` ` ``) and unquote (`,`) for template construction:

```gene
(macro unless [condition & body]
  `(if (not ,condition)
     (do ,@body)))
```

- **`** - Quasiquote: Treat as literal code template
- **,** - Unquote: Evaluate this expression
- **,@** - Unquote-splicing: Evaluate and splice into list

## Examples

### Simple Transformations

```gene
# Debugging macro
(macro debug [expr]
  `(do
     (print "DEBUG:" ',expr "=")
     (var result ,expr)
     (print result)
     result))

# Usage
(debug (+ 2 3))
# Prints: DEBUG: (+ 2 3) =
#         5
# Returns: 5
```

### Control Flow Extensions

```gene
# Python-like for loop
(macro for [var iterable & body]
  `(each ,var ,iterable
     ,@body))

# Usage
(for item my-list
  (print "Processing:" item)
  (process item))
```

### Domain-Specific Languages

```gene
# HTML DSL macro
(macro defhtml [name args & body]
  `(fn ,name ,args
     ^content-type "text/html"
     (str "<html>"
          ,@body
          "</html>")))

# Usage
(defhtml page [title]
  "<head><title>" title "</title></head>"
  "<body><h1>" title "</h1></body>")
```

## Advanced Features

### Macro Helpers

```gene
# Helper for generating getters/setters
(macro defproperty [name]
  (let [getter-name (symbol (str "get-" name))
        setter-name (symbol (str "set-" name))
        field-name (symbol (str "/" name))]
    `(do
       (fn ,getter-name [obj]
         (,field-name obj))
       (fn ,setter-name [obj value]
         (,field-name obj value)))))

# Usage
(defproperty username)
# Creates: get-username and set-username functions
```

### Conditional Compilation

```gene
# Debug-only code
(macro when-debug [& body]
  (if DEBUG
    `(do ,@body)
    `nil))

# Usage
(when-debug
  (print "Debug mode active")
  (validate-state))
```

## AI-Friendly Aspects

### Predictable Patterns

Macros follow the same structural patterns as regular Gene code:

```gene
# All macros follow this pattern
(macro name [args]
  ^metadata value
  template-body)
```

### Easy Code Generation

AI can easily generate macros because they use the same syntax:

```gene
# AI-generated logging macro
(macro log-calls [& functions]
  ^generated-by "AI-Assistant"
  ^purpose "Add call logging to functions"
  `(do
     ,@(map (fn [f]
              `(macro ,f [& args]
                 `(do
                    (print "Calling" ',f "with" ,@args)
                    (,',f ,@args))))
            functions)))
```

### Template-Based Transformation

The quasiquote system makes it clear what's template and what's code:

```gene
# Template structure is explicit
(macro retry [times expr]
  `(var attempts 0)
  `(while (< attempts ,times)
     (try
       (return ,expr)
       (catch *
         (set attempts (+ attempts 1))))))
```

## Best Practices

### 1. Use Descriptive Names
```gene
# Good
(macro when-authenticated [user & body]
  `(if (authenticated? ,user)
     (do ,@body)))

# Less clear
(macro auth [u & b]
  `(if (authenticated? ,u)
     (do ,@b)))
```

### 2. Add Documentation
```gene
(macro parallel [& exprs]
  ^description "Execute expressions in parallel"
  ^example "(parallel (fetch-user 1) (fetch-user 2))"
  `(map async/await
        (list ,@(map (fn [e] `(async ,e)) exprs))))
```

### 3. Handle Edge Cases
```gene
(macro safe-divide [numerator denominator]
  `(if (zero? ,denominator)
     0
     (/ ,numerator ,denominator)))
```

## Next Steps

- [Gene Data Structure](/docs/language/principles) - Understand the foundation
- [Pattern Matching](/docs/language/pattern-matching) - Advanced destructuring
- [Examples](/examples) - See macros in action