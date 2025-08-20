import { useMemo } from "react";
import { useTodosState } from "../context/TodosContext.jsx";
import TodoItem from "../components/todoItem.jsx";

export default function Completed() {
    const tasks = useTodosState();
    const done = useMemo(() => tasks.filter(t => t.done), [tasks]);

    return (
        <>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 mb-6">
                Concluídas
            </h2>
            <ul className="space-y-3 md:space-y-4">
                {done.length === 0 && <li className="text-gray-500">Nada concluído ainda 😉</li>}
                {done.map((task) => (
                    <TodoItem key={task.id} task={task} />
                ))}
            </ul>
        </>
    );
}
