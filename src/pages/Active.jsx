import { useMemo } from "react";
import { useTodosState } from "../context/TodosContext.jsx";
import TodoItem from "../components/todoItem.jsx";

export default function Active() {
    const tasks = useTodosState();
    const active = useMemo(() => tasks.filter(t => !t.done), [tasks]);

    return (
        <>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 mb-6">
                Pendentes
            </h2>
            <ul className="space-y-3 md:space-y-4">
                {active.length === 0 && <li className="text-gray-500">Nenhuma tarefa pendente ✅</li>}
                {active.map((task) => (
                    <TodoItem key={task.id} task={task} />
                ))}
            </ul>
        </>
    );
}
