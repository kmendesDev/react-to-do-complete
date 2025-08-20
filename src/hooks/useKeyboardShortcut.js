import { useEffect } from "react";

/**
 * Registra atalhos de teclado globais.
 * @param {string|string[]} combo - ex.: "mod+k", "mod+enter", "escape", "/"
 *   - "mod" = Command no macOS, Ctrl no Windows/Linux
 * @param {(KeyboardEvent)=>void} handler
 * @param {object} options
 *   - target: elemento para ouvir (default: window)
 *   - preventDefault: boolean
 *   - stopPropagation: boolean
 *   - enabled: boolean
 */
export function useKeyboardShortcut(
    combo,
    handler,
    { target = window, preventDefault = false, stopPropagation = false, enabled = true } = {}
) {
    useEffect(() => {
        if (!enabled || !target) return;

        const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);
        const combos = Array.isArray(combo) ? combo : [combo];

        const parse = (c) => {
            const parts = String(c).toLowerCase().split("+").map(s => s.trim()).filter(Boolean);
            let key = parts.pop() || "";
            // aliases comuns
            if (key === "esc") key = "escape";
            if (key === "return") key = "enter";

            return {
                key,
                ctrl: parts.includes("ctrl") || (parts.includes("mod") && !isMac),
                meta: parts.includes("meta") || (parts.includes("mod") && isMac),
                alt: parts.includes("alt") || parts.includes("option"),
                shift: parts.includes("shift"),
            };
        };

        const parsed = combos.map(parse);

        const matches = (e, cfg) =>
            e.key?.toLowerCase() === cfg.key &&
            !!e.ctrlKey === !!cfg.ctrl &&
            !!e.metaKey === !!cfg.meta &&
            !!e.altKey === !!cfg.alt &&
            !!e.shiftKey === !!cfg.shift;

        const onKeyDown = (e) => {
            for (const cfg of parsed) {
                if (matches(e, cfg)) {
                    if (preventDefault) e.preventDefault();
                    if (stopPropagation) e.stopPropagation();
                    handler(e);
                    break;
                }
            }
        };

        target.addEventListener("keydown", onKeyDown);
        return () => target.removeEventListener("keydown", onKeyDown);
    }, [combo, handler, target, preventDefault, stopPropagation, enabled]);
}
