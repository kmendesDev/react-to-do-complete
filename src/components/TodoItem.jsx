import { memo } from "react";

function TodoItem({ task, onToggle, onDelete }) {
    return (
        <li
            className={`group flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 transition
        ${task.done ? "bg-gray-50" : "bg-white hover:shadow-sm"}`}
        >
            <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-3 text-left"
                title="Alternar concluída"
                aria-pressed={task.done}
            >
                <span
                    className={`h-5 w-5 rounded-md border flex items-center justify-center transition
            ${task.done ? "bg-green-600 border-green-600" : "bg-white border-gray-300 group-hover:border-gray-400"}`}
                >
                    {task.done && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </span>
                <span className={`select-none ${task.done ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {task.text}
                </span>
            </button>

            {onDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="opacity-70 hover:opacity-100 text-red-600 hover:text-red-700 active:text-red-800 transition"
                    title={`Excluir tarefa "${task.text}"`}
                    aria-label={`Excluir tarefa "${task.text}"`}
                >
                    ❌
                </button>
            )}
        </li>
    );
}

export default memo(TodoItem);
