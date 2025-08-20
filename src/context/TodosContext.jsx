// src/context/TodosContext.jsx
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

function reducer(state, action) {
    switch (action.type) {
        case "add": {
            const text = String(action.text ?? "").trim();
            if (!text) return state;
            const id =
                globalThis.crypto?.randomUUID?.() ??
                `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            return [...state, { id, text, done: false }];
        }
        case "toggle":
            return state.map(t => (t.id === action.id ? { ...t, done: !t.done } : t));
        case "remove":
            return state.filter(t => t.id !== action.id);
        case "clearCompleted":
            return state.filter(t => !t.done);
        default:
            return state;
    }
}

function initFromStorage(storageKey) {
    try {
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

const TodosStateContext = createContext(null);
const TodosActionsContext = createContext(null);

export function TodosProvider({ children, storageKey = "tasks" }) {
    const [state, dispatch] = useReducer(reducer, storageKey, initFromStorage);

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch { }
    }, [state, storageKey]);

    const actions = useMemo(
        () => ({
            add: (text) => {
                const t = String(text ?? "").trim();
                if (!t) return false;
                dispatch({ type: "add", text: t });
                return true; // <- importante pro input limpar
            },
            toggle: (id) => dispatch({ type: "toggle", id }),
            remove: (id) => dispatch({ type: "remove", id }),
            clearCompleted: () => dispatch({ type: "clearCompleted" }),
        }),
        [dispatch]
    );

    return (
        <TodosStateContext.Provider value={state}>
            <TodosActionsContext.Provider value={actions}>
                {children}
            </TodosActionsContext.Provider>
        </TodosStateContext.Provider>
    );
}

export function useTodosState() {
    const ctx = useContext(TodosStateContext);
    if (ctx === null) throw new Error("useTodosState deve ser usado dentro de <TodosProvider>");
    return ctx;
}

export function useTodosActions() {
    const ctx = useContext(TodosActionsContext);
    if (ctx === null) throw new Error("useTodosActions deve ser usado dentro de <TodosProvider>");
    return ctx;
}

export function useTodosStats() {
    const tasks = useTodosState();
    const total = tasks.length;
    const done = tasks.reduce((acc, t) => acc + (t.done ? 1 : 0), 0);
    const remaining = total - done;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { total, done, remaining, pct };
}
