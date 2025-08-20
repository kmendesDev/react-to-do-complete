import { useEffect } from "react";

/**
 * Foca o elemento referenciado.
 * - Por padrão foca uma vez ao montar.
 * - Se passar `deps`, vai refocar quando qualquer dependência mudar.
 * - options:
 *    - select: true => seleciona o texto após focar (útil para inputs)
 *    - delay: ms para atrasar o foco (evita "corrida" em transições)
 */
export function useAutoFocus(ref, deps = [], { select = false, delay = 0 } = {}) {
    useEffect(() => {
        const doFocus = () => {
            const el = ref?.current;
            if (!el) return;
            el.focus?.();
            if (select && el.select) el.select();
        };

        if (delay > 0) {
            const id = setTimeout(doFocus, delay);
            return () => clearTimeout(id);
        }

        doFocus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
