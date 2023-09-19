# `react-use-debounce`

Several utilities to debounce functions, preventing rapid calling of functions.

## `useDebounce`

Creates a "debounced" version of a function which is only called after the
debounced version is not called for a specified amount of time. Useful for
inputs where the onChange uses a lot of processing.

**Note:** `useDebounce` expects the function to not change frequently. If the
supplied function is a literal, wrap it in `useCallback`.

### Example Usage

```jsx
const handleChange = useDebounce(expensiveSetter, 500);
// `onChange` will only be called if `expensiveSetter`
/// is not called for 500 milliseconds (0.5 seconds)

<input onChange={handleChange} />
```

## `useUnsafeDebounce`

Has the same functionality as `useDebounce` but doesn't call the function if
the component unmounts, in exchange for less overhead.

## `useDebouncedState`

Maintains an internal state that is always up-to-date and debounces it to an
external state. Useful if you need a controlled component but still want to
debounce the state.

### Example Usage

```jsx
const [state, setState] = useDebouncedState(externalState, expensiveSetter, 500);

// ExampleComponent will update with new values but expensiveSetter
// will not be called until it stops being set for 500 milliseconds
<ExampleComponent value={state} onChange={setState} />
```
