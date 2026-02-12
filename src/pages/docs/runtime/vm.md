# Bytecode VM Internals

Gene's virtual machine is a stack-based bytecode interpreter implemented in Nim. It provides high performance (~3.8M function calls/sec) while maintaining the flexibility needed for homoiconic languages.

## Architecture Overview

### Stack-Based Design

The Gene VM uses a stack-based architecture with the following components:

- **Operand Stack**: 256 values per frame for expression evaluation
- **Call Stack**: Function call frames with local variable storage
- **Heap**: Managed objects and data structures
- **Instruction Pointer**: Points to the current bytecode instruction

```
┌─────────────────┐
│   Call Stack    │ ← Current Frame
├─────────────────┤
│  Operand Stack  │ ← Expression Evaluation
├─────────────────┤
│     Heap        │ ← Objects & Data
├─────────────────┤
│   Bytecode      │ ← Instructions
└─────────────────┘
```

### Value Representation

Gene uses **NaN-boxed values** for efficient 8-byte representation:

```nim
# Nim implementation (simplified)
type
  GeneValue* = distinct uint64

# Value encoding:
# - Integers: Direct encoding
# - Floats: IEEE 754 double
# - Objects: Pointer with tag bits
# - Booleans: Special NaN values
```

This design enables:
- **Fast arithmetic**: Direct CPU operations on numbers
- **Efficient storage**: All values fit in 8 bytes
- **Type dispatch**: Quick type checking via bit patterns

## Instruction Set

### Core Instructions

| Instruction | Description | Stack Effect |
|-------------|-------------|--------------|
| `LOAD_CONST` | Push constant to stack | `→ value` |
| `LOAD_VAR` | Push variable value | `→ value` |
| `STORE_VAR` | Pop and store in variable | `value →` |
| `CALL` | Call function | `fn args → result` |
| `RETURN` | Return from function | `value → [return]` |
| `JUMP` | Unconditional jump | `→` |
| `JUMP_IF_FALSE` | Conditional jump | `value →` |

### Example Bytecode

```gene
# Source code
(fn add [a b]
  (+ a b))

# Compiled bytecode
LOAD_VAR   a      # Push 'a' onto stack
LOAD_VAR   b      # Push 'b' onto stack
CALL       +      # Call '+' function with 2 args
RETURN            # Return result
```

## Compilation Pipeline

### 1. Parse → AST
```gene
(+ 1 2)
```
↓
```
Call(
  fn: Symbol(+),
  args: [Number(1), Number(2)]
)
```

### 2. AST → Bytecode
```
LOAD_CONST  1
LOAD_CONST  2
CALL        +, 2
```

### 3. Execute
Stack-based evaluation with computed-goto dispatch for performance.

## Memory Management

### Reference Counting

Gene uses manual memory management with reference counting:

```nim
type
  GeneObject* = ref object
    refCount*: int
    # object data...

proc incRef*(obj: GeneObject) =
  inc obj.refCount

proc decRef*(obj: GeneObject) =
  dec obj.refCount
  if obj.refCount == 0:
    deallocate(obj)
```

### Scope Lifetime Management

Critical for async blocks and closures:

```gene
# Scope lifetime correctly managed
(async fn process []
  (var data (load-data))    # Reference counted
  (await (save-data data))  # Scope preserved across await
  data)                     # Properly cleaned up
```

## Performance Optimizations

### 1. Computed Goto Dispatch

```nim
# Fast instruction dispatch
when defined(gcc) or defined(clang):
  var dispatchTable = [
    &&LOAD_CONST,
    &&LOAD_VAR,
    &&CALL,
    # ...
  ]

  DISPATCH:
    goto dispatchTable[instruction]

  LOAD_CONST:
    # instruction implementation
    goto DISPATCH
```

### 2. NaN-Boxing Benefits

- **No boxing overhead**: Integers stored directly
- **Fast type checks**: Single bit mask operation
- **Cache efficiency**: Compact value representation

### 3. Instruction Caching

Gene IR (GIR) caches compiled bytecode:

```bash
# First run: parse + compile + execute
./bin/gene run program.gene

# Subsequent runs: load cached bytecode
./bin/gene run program.gene  # Much faster
```

## Async Runtime Integration

### Event Loop Integration

```gene
# Real async/await support
(async fn fetch-data [url]
  (var response (await (http/get url)))  # Suspends execution
  (json/parse response))                 # Resumes when complete
```

The VM integrates with the event loop:

1. **Suspend**: Save current frame state
2. **Schedule**: Register continuation with event loop
3. **Resume**: Restore frame and continue execution

### Async Implementation

```nim
# Simplified async implementation
proc asyncCall*(fn: GeneFunction, args: seq[GeneValue]): Future[GeneValue] =
  result = newFuture[GeneValue]()

  # Create suspended frame
  var frame = newFrame(fn, args)
  frame.continuation = result

  # Schedule execution
  eventLoop.schedule(frame)
```

## Debug Support

### Instruction Tracing

```bash
# Enable VM tracing
./bin/gene run program.gene --debug

# Output:
LOAD_CONST  1       | Stack: [1]
LOAD_CONST  2       | Stack: [1, 2]
CALL        +, 2    | Stack: [3]
RETURN              | Stack: []
```

### Debug Information

Compiled bytecode includes source mapping:

```nim
type
  Instruction* = object
    opcode*: OpCode
    operand*: uint32
    sourcePos*: SourcePos  # For debugging
```

## Performance Benchmarks

Latest measurements (2025, macOS ARM64):

- **Function calls**: ~3.8M calls/sec
- **Arithmetic**: ~15M ops/sec
- **Object creation**: ~2M objects/sec
- **GC overhead**: < 5% with reference counting

Compared to other languages:
- **Python**: ~25M function calls/sec
- **JavaScript (V8)**: ~50M function calls/sec
- **Gene VM**: ~3.8M function calls/sec

## Future Optimizations

### Planned Improvements

1. **JIT compilation**: Hot path optimization
2. **Inline caching**: Method dispatch optimization
3. **Escape analysis**: Stack allocation for short-lived objects
4. **SIMD operations**: Vector processing support

### AI-Specific Optimizations

Gene's homoiconic design enables AI-specific optimizations:

1. **Code pattern recognition**: Common AI-generated patterns
2. **Template specialization**: Optimize repeated structures
3. **Predictive compilation**: Pre-compile likely code paths

## Next Steps

- [GIR Format](/docs/runtime/gir) - Understand the intermediate representation
- [Performance Tuning](/docs/runtime/performance) - Optimization strategies
- [Examples](/examples) - See the VM in action