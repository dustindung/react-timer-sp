import { type ReactNode, createContext, useContext, useReducer } from "react";

export type Timer = {
  name: string;
  duration: number;
};

type TimersState = {
  isRunning: boolean;
  timers: Timer[];
};

const initialState: TimersState = { isRunning: false, timers: [] };

type TimersContext = TimersState & {
  addTimer: (timer: Timer) => void;
  startTimer: () => void;
  stopTimer: () => void;
};

const TimersContext = createContext<TimersContext | null>(null);

export function useTimersContext() {
  const timersCtx = useContext(TimersContext);

  if (timersCtx === null) throw new Error("TimersContext should not be null");

  return timersCtx;
}

type TimersContextProviderProps = {
  children: ReactNode;
};

type AddTimerAction = {
  type: "ADD_TIMER";
  payload: Timer;
};

type StartTimerAction = {
  type: "START_TIMERS";
};

type StopTimerAction = {
  type: "STOP_TIMERS";
};

type Action = AddTimerAction | StartTimerAction | StopTimerAction;

function timersReducer(timersState: TimersState, action: Action): TimersState {
  if (action.type === "START_TIMERS") {
    return {
      ...timersState,
      isRunning: true,
    };
  }
  if (action.type === "STOP_TIMERS") {
    return {
      ...timersState,
      isRunning: false,
    };
  }
  if (action.type === "ADD_TIMER") {
    return {
      ...timersState,
      timers: [
        ...timersState.timers,
        {
          name: action.payload.name,
          duration: action.payload.duration,
        },
      ],
    };
  }

  return timersState;
}

export default function TimersContextProvider({
  children,
}: TimersContextProviderProps) {
  const [timersState, dispatch] = useReducer(timersReducer, initialState);

  const ctx: TimersContext = {
    isRunning: timersState.isRunning,
    timers: timersState.timers,
    addTimer(timer) {
      dispatch({ type: "ADD_TIMER", payload: timer });
    },
    startTimer() {
      dispatch({ type: "START_TIMERS" });
    },
    stopTimer() {
      dispatch({ type: "STOP_TIMERS" });
    },
  };

  return (
    <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
  );
}
