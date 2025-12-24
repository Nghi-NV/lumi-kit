# API Documentation Template

## API: [ModuleName]

### Overview
- **File:** `path/to/module.ext`
- **Exports:** [count] functions

### Quick Reference
| Function | Params | Returns | Description |
|----------|--------|---------|-------------|
| func1() | (a, b) | Type | brief description |
| func2() | (x) | Type | brief description |

---

### Functions

#### `functionName(p1, p2)`

**Signature:**
```typescript
function functionName(p1: Type1, p2: Type2): ReturnType
```

**Description:** 
[Detailed description of what this function does]

**Parameters:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| p1 | Type1 | Yes | - | [description] |
| p2 | Type2 | No | null | [description] |

**Returns:** 
`ReturnType` - [Description of return value]

**Throws:**
| Error | When |
|-------|------|
| ValidationError | Invalid parameters |
| NotFoundError | Resource not found |

**Example:**
```javascript
// Basic usage
const result = functionName(value1, value2);

// With error handling
try {
  const result = functionName(value1, value2);
  console.log(result);
} catch (error) {
  console.error(error);
}
```

**Source:** `module.ext:L10-L25`

---

#### `anotherFunction(param)`

[Repeat the same structure for each exported function]

---

### Types

#### `TypeName`
```typescript
interface TypeName {
  property1: string;
  property2: number;
}
```

### Constants

| Name | Value | Description |
|------|-------|-------------|
| CONST_NAME | value | description |
