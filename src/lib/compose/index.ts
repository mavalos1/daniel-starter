import { useEffect, useReducer, useRef } from "react";

export type State = Record<string, unknown>;
export type GetState<T extends State> = () => T;
export type SetState<T extends State> = <
  K1 extends keyof T,
  K2 extends keyof T = K1,
  K3 extends keyof T = K2,
  K4 extends keyof T = K3
>(
  partial:
    | (Pick<T, K1> | Pick<T, K2> | Pick<T, K3> | Pick<T, K4> | T)
    | ((state: T) => Pick<T, K1> | Pick<T, K2> | Pick<T, K3> | Pick<T, K4> | T),
  replace?: boolean
) => void;

export type StateComposer<T extends State> = (
  setState: SetState<T>,
  getState: GetState<T>
) => T;

export type StateSelector<T extends State, U> = (state: T) => U;
export type IsEqualChecker<T> = (state: T, nextState: T) => boolean;

export type Destroy = () => void;
export type StateListener<T> = (state: T, prevState: T) => void;
export interface StateSubscriber<T extends State> {
  (listener: StateListener<T>): () => void;
  <S>(
    listener: StateListener<T>,
    selector?: StateSelector<T, S>,
    isEqual?: IsEqualChecker<S>
  ): () => void;
}

export type Store<T extends State> = {
  setState: SetState<T>;
  getState: GetState<T>;
  subscribe: StateSubscriber<T>;
  destroy: Destroy;
};

// create a store object that keeps a state with exposed set/get
// the object is subscribeable to track changes
function composeStore<T extends State>(
  composeState: StateComposer<T>
): Store<T> {
  let state: T;
  const listeners: Set<StateListener<T>> = new Set();

  const setState: SetState<T> = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (nextState !== state) {
      const prevState = state;
      state = replace ? prevState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, prevState));
    }
  };

  const getState: GetState<T> = () => state;

  const subscribeWithSelector = <S>(
    listener: StateListener<S>,
    selector: StateSelector<T, S> = getState as any,
    isEqual: IsEqualChecker<S> = Object.is
  ) => {
    let currentSlice: S = selector(state);
    function listenerToAdd() {
      const nextSlice = selector(state);
      if (!isEqual(currentSlice, nextSlice)) {
        const previousSlice = currentSlice;
        listener((currentSlice = nextSlice), previousSlice);
      }
    }

    listeners.add(listenerToAdd);
    // Unsubscribe
    return () => listeners.delete(listenerToAdd);
  };

  const subscribe: StateSubscriber<T> = <S>(
    listener: StateListener<T> | StateListener<S>,
    selector?: StateSelector<T, S>,
    isEqual?: IsEqualChecker<S>
  ) => {
    if (selector || isEqual) {
      return subscribeWithSelector(
        listener as StateListener<S>,
        selector,
        isEqual
      );
    }
    listeners.add(listener as StateListener<T>);
    // Unsubscribe
    return () => listeners.delete(listener as StateListener<T>);
  };

  const destroy: Destroy = () => listeners.clear();

  const store = { setState, getState, subscribe, destroy };
  state = composeState(setState, getState);

  return store;
}

export type ComposedStore<T extends State> = Store<T> & {
  (): T;
  <S>(selector: StateSelector<T, S>, isEqual?: IsEqualChecker<S>): S;
};

// first compose a store to keep state, and expose set/get
// second keep track of the selected states and trigger state change when store changes
function compose<T extends State>(
  composeState: StateComposer<T>
): ComposedStore<T> {
  const store = composeStore(composeState);

  const useStore: any = <S>(
    selector: StateSelector<T, S> = store.getState() as any,
    isEqual: IsEqualChecker<S> = Object.is
  ) => {
    const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void];

    const state = store.getState();
    const stateRef = useRef(state);
    const selectorRef = useRef(selector);
    const isEqualRef = useRef(isEqual);

    // get the current slice of state
    const currSelectedState = useRef<S>();
    if (currSelectedState.current === undefined) {
      currSelectedState.current = selector(state);
    }

    let newSelectedState: S | undefined;
    let hasNewSelectedState = false;

    if (
      stateRef.current !== state ||
      selectorRef.current !== selector ||
      isEqualRef.current !== isEqual
    ) {
      newSelectedState = selector(state);
      hasNewSelectedState = !isEqual(
        newSelectedState,
        currSelectedState.current as S
      );
    }

    useEffect(() => {
      if (hasNewSelectedState) {
        currSelectedState.current = newSelectedState;
      }

      stateRef.current = state;
      selectorRef.current = selector;
      isEqualRef.current = isEqual;
    });

    useEffect(() => {
      const listener = () => {
        try {
          const nextState = store.getState();
          const nextSelectedState = selectorRef.current(nextState);

          if (
            !isEqualRef.current(
              currSelectedState.current as S,
              nextSelectedState
            )
          ) {
            stateRef.current = nextState;
            currSelectedState.current = nextSelectedState;

            forceUpdate();
          }
        } catch (error) {
          forceUpdate();
        }
      };

      const unsubscribe = store.subscribe(listener);
      return unsubscribe;
    }, []);

    return hasNewSelectedState ? newSelectedState : currSelectedState.current;
  };

  useStore[Symbol.iterator] = function () {
    const items = [useStore, store];
    return {
      next() {
        const done = items.length <= 0;
        return { value: items.shift(), done };
      },
    };
  };

  Object.assign(useStore, store);
  return useStore;
}

export default compose;
