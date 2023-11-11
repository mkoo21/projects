import { Dispatch } from 'react';
type SET_TIMER_ACTION = {
    type: "set_timer";
    payload: () => void;
}
export type FPS_ACTION = {
    type: "increment" | "tick";
} | SET_TIMER_ACTION;

export type STATE_TYPE = {
    framesSinceLastTick: number;
    measuredFrameRate: number | null;
    timerId: ReturnType<typeof setInterval> | null;
};

export const FPS_INITIAL_VALUE: STATE_TYPE = {
    framesSinceLastTick: 0,
    measuredFrameRate: null,
    timerId: null,
};


export default (state: STATE_TYPE, action: FPS_ACTION) => {
    switch(action.type) {
        case "increment": 
            const newFrameCount = state.framesSinceLastTick + 1;
            return {
                ...state,
                framesSinceLastTick: newFrameCount,
            }
        case "tick":
            const measuredFrameRate = state.framesSinceLastTick;
            return {
                ...state,
                framesSinceLastTick: 0,
                measuredFrameRate,
            }
        case "set_timer":
            if(state.timerId) {
                return state;
            }
            return {
                ...state,
                timerId: setInterval(action.payload, 1000),
            }
    }
};
