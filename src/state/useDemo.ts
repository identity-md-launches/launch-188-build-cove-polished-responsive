import { useCallback, useReducer } from "react";
import { INITIAL_POSITION, applyAction, type ActionKind, type Position } from "../lib/lending";

export interface ActivityEntry {
  id: number;
  kind: ActionKind;
  /** Amount in micro-units of the action's token. */
  amount: number;
}

export interface DemoState {
  position: Position;
  activity: ActivityEntry[];
  nextId: number;
  /** Incremented on every reset so dependent UI (the action panel) remounts. */
  epoch: number;
}

type DemoAction = { type: "apply"; kind: ActionKind; amount: number } | { type: "reset" };

export const INITIAL_DEMO: DemoState = { position: INITIAL_POSITION, activity: [], nextId: 1, epoch: 0 };

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "apply": {
      const next = applyAction(action.kind, action.amount, state.position);
      if (next === state.position) return state;
      return {
        ...state,
        position: next,
        activity: [{ id: state.nextId, kind: action.kind, amount: action.amount }, ...state.activity],
        nextId: state.nextId + 1,
      };
    }
    case "reset":
      return { ...INITIAL_DEMO, epoch: state.epoch + 1 };
  }
}

/** In-memory demo state. Nothing is persisted or sent anywhere. */
export function useDemo() {
  const [state, dispatch] = useReducer(reducer, INITIAL_DEMO);
  const apply = useCallback((kind: ActionKind, amount: number) => dispatch({ type: "apply", kind, amount }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  return { state, apply, reset };
}
