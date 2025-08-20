import { useEffect, useRef, useState } from "react";

export function useLocalStorage(key, initialValue) {
    const firstRun = useRef(true);

    const [value, setValue] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw !== null ? JSON.parse(raw) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        // evita sobrescrever logo no 1º render caso já exista valor
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch { }
    }, [key, value]);

    return [value, setValue];
}
