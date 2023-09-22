import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Creates a debounced version of a function where the original function is
 * only called after the debounced version has not been called for a certain
 * length of time.<p>
 * 
 * If the component unmounts the function **will not** be called a final time,
 * if this is desired use {@link useDebounce} instead.
 *
 * @param func The function to debounce. This function should not change
 * frequently, so if it is a literal wrap it in {@link useCallback}.
 * @param delay How long before the function should be called, in milliseconds
 * @returns A debounced version of the function
 */
function useUnsafeDebounce<P extends unknown[]>(func: (...args: P) => void, delay: number): (...args: P) => void {
    const timeoutRef = useRef<number>();

    return useCallback((...args: P) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => func(...args), delay);
    }, [delay, func]);
}

/**
 * Creates a debounced version of a function where the original function is
 * only called after the debounced version has not been called for a certain
 * length of time.
 * 
 * If the component unmounts the function **will** be called a final time. If
 * you do not want the overhead use {@link useUnsafeDebounce} instead.
 *
 * @param func The function to debounce. This function should not change
 * frequently, so if it is a literal wrap it in {@link useCallback}.
 * @param delay How long before the function should be called, in milliseconds
 * @returns A debounced version of the function
 */
function useDebounce<P extends unknown[]>(func: (...args: P) => void, delay: number): (...args: P) => void {
    const timeoutRef = useRef<number>();

    const argsRef = useRef<P>();

    const funcRef = useRef<(...args: P) => void>();
    funcRef.current = func;

    useEffect(() => (
        () => {
            argsRef.current !== undefined && funcRef.current?.(...argsRef.current);
        }
    ), []);

    return useCallback((...args: P) => {
        argsRef.current = args;
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => func(...args), delay);
    }, [delay, func])
}

/**
 * Creates a state that debounce syncs with a parent state, so that this state
 * is always up-to-date and the parent state is not changed too frequently.
 * 
 * @param state The parent state
 * @param setState The parent state setter
 * @param delay The delay before the parent state setter should be called
 * @returns A state pair for the child state
 */
function useDebouncedState<S>(state: S, setState: (state: S) => void, delay: number): [S, (value: S) => void] {
    const [internalState, setInternalState] = useState(state);

    const internalStateRef = useRef(internalState);
    internalStateRef.current = internalState;

    const debouncedSetState = useDebounce(setState, delay);

    const handleSetState = useCallback((value: S) => {
        setInternalState(value);
        debouncedSetState(value);
    }, [debouncedSetState]);

    // Handle the state changing externally
    useEffect(() => {
        if (state !== internalStateRef.current) {
            setInternalState(state);
        }
    }, [state]);

    return [internalState, handleSetState];
}


export { useUnsafeDebounce, useDebounce, useDebouncedState };
