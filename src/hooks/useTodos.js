import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

function safeId() {
    return (globalThis.crypto?.randomUUID?.()) ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useTodos(storageKey = "tasks") {
    const [tasks, setTasks] = useLocalStorage(storageKey, []);

    const add = useCallback((text) => {
        const t = String(text ?? "").trim();
        if (!t) return false;
        setTasks(prev => [...prev, { id: safeId(), text: t, done: false }]);
        return true;
    }, [setTasks]);

    const toggle = useCallback((id) => {
        setTasks(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
    }, [setTasks]);

    const remove = useCallback((id) => {
        setTasks(prev => prev.filter(item => item.id !== id));
    }, [setTasks]);

    const clearCompleted = useCallback(() => {
        setTasks(prev => prev.filter(item => !item.done));
    }, [setTasks]);

    const stats = useMemo(() => {
        const total = tasks.length;
        const done = tasks.reduce((acc, t) => acc + (t.done ? 1 : 0), 0);
        const remaining = total - done;
        const pct = total ? Math.round((done / total) * 100) : 0;
        return { total, done, remaining, pct };
    }, [tasks]);

    return { tasks, add, toggle, remove, clearCompleted, stats };
}
