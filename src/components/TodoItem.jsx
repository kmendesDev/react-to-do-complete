import { memo } from "react";
import { useTodosActions } from "../context/TodosContext.jsx";

function TodoItem({ task }) {
    const { toggle, remove } = useTodosActions();

    return (
        <li
            className={`group flex items-center justify-between rounded-2xl border border-gray-200
                  px-5 md:px-6 py-4 md:py-5 text-base md:text-lg transition
                  ${task.done ? "bg-gray-50" : "bg-white hover:shadow-sm"}`}
        >
            <button
                type="button"
                onClick={() => toggle(task.id)}
                className="flex items-center gap-4 text-left"
                aria-pressed={task.done}
                title="Alternar concluída"
            >
                <span
                    className={`h-6 w-6 rounded-md border flex items-center justify-center transition
                      ${task.done ? "bg-green-600 border-green-600"
                            : "bg-white border-gray-300 group-hover:border-gray-400"}`}
                >
                    {task.done && (
                        <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </span>
                <span className={task.done ? "line-through text-gray-400" : "text-gray-800"}>
                    {task.text}
                </span>
            </button>

            <button
                type="button"
                onClick={() => remove(task.id)}
                className="opacity-80 hover:opacity-100 text-red-600 hover:text-red-700 active:text-red-800 text-xl transition"
                aria-label={`Excluir tarefa "${task.text}"`}
                title={`Excluir tarefa "${task.text}"`}
            >
                ❌
            </button>
        </li>
    );
}

export default memo(TodoItem);
