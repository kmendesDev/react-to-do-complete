// pages/All.jsx
import { useMemo, useRef, useState } from "react";
import { useTodosState, useTodosActions, useTodosStats } from "../context/TodosContext.jsx";
import TodoItem from "../components/todoItem.jsx";

// custom hooks:
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useAutoFocus } from "../hooks/useAutoFocus";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";

export default function All() {
    const tasks = useTodosState();
    const { add, clearCompleted } = useTodosActions();
    const stats = useTodosStats();

    const [newTask, setNewTask] = useState("");
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebouncedValue(query, 300); // <= debounce da busca

    const newTaskRef = useRef(null);
    const searchRef = useRef(null);

    useAutoFocus(newTaskRef, [], { select: true }); // <= foca ao montar

    // atalhos globais:
    useKeyboardShortcut("mod+k", () => newTaskRef.current?.focus(), { preventDefault: true });
    useKeyboardShortcut("/", () => searchRef.current?.focus(), { preventDefault: true });
    useKeyboardShortcut("mod+enter", () => addTask(), { preventDefault: true });
    useKeyboardShortcut("mod+shift+c", () => clearCompleted(), { preventDefault: true });

    const addTask = () => {
        if (add(newTask)) {
            setNewTask("");
            newTaskRef.current?.focus();
        }
    };

    const visibleTasks = useMemo(() => {
        const q = debouncedQuery.trim().toLowerCase(); // <= usa valor “estabilizado”
        const list = q ? tasks.filter(t => t.text.toLowerCase().includes(q)) : tasks;
        return [...list].sort((a, b) => Number(a.done) - Number(b.done));
    }, [tasks, debouncedQuery]);

    return (
        <>
            {/* header, badges e barra de progresso… (igual) */}

            {/* Busca + Nova tarefa + Ações */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8">
                <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search… (/)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="sm:w-1/3 h-12 md:h-14 rounded-2xl border border-gray-300 px-5 md:px-6
                     outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                />
                <div className="flex-1 flex flex-col sm:flex-row gap-3 md:gap-4">
                    <input
                        ref={newTaskRef}
                        type="text"
                        placeholder="New Task… (⌘/Ctrl + K)"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => (e.key === "Enter" ? addTask() : null)}
                        className="flex-1 h-12 md:h-14 rounded-2xl border border-gray-300 px-5 md:px-6
                       outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                    />
                    <button
                        onClick={addTask}
                        className="h-12 md:h-14 rounded-2xl px-6 md:px-8 font-medium
                       bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
                       focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                    >
                        Add
                    </button>
                    <button
                        onClick={clearCompleted}
                        className="h-12 md:h-14 rounded-2xl px-5 md:px-6 font-medium
                       bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300
                       focus:outline-none focus:ring-4 focus:ring-gray-200 transition"
                    >
                        Clean Concluded
                    </button>
                </div>
            </div>

            {/* Lista */}
            <ul className="space-y-3 md:space-y-4">
                {visibleTasks.length === 0 && (
                    <li className="text-sm md:text-base text-gray-500">Nada por aqui… ✨</li>
                )}
                {visibleTasks.map((task) => (
                    <TodoItem key={task.id} task={task} />
                ))}
            </ul>
        </>
    );
}
