// src/pages/Remote.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRemoteTodos, addRemoteTodo } from "../services/remoteTodos";
import { useTodosActions } from "../context/TodosContext.jsx";
import { useState } from "react";

export default function Remote() {
    const qc = useQueryClient();
    const { add } = useTodosActions();
    const [title, setTitle] = useState("");

    // GET remoto com cache, loading e re-fetch
    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["remoteTodos", 10],
        queryFn: () => fetchRemoteTodos(10),
        staleTime: 60_000, // 1 min "fresco"
    });

    // POST remoto com atualização otimista (apenas demo: JSONPlaceholder não persiste)
    const addMutation = useMutation({
        mutationFn: addRemoteTodo,
        onMutate: async (newTitle) => {
            await qc.cancelQueries({ queryKey: ["remoteTodos", 10] });
            const prev = qc.getQueryData(["remoteTodos", 10]);
            // otimista: adiciona item fake
            const optimistic = [
                ...(prev ?? []),
                { id: Math.random(), title: newTitle, completed: false, optimistic: true },
            ];
            qc.setQueryData(["remoteTodos", 10], optimistic);
            return { prev };
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) qc.setQueryData(["remoteTodos", 10], ctx.prev);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["remoteTodos", 10] });
        },
    });

    const handleAddRemote = () => {
        const t = title.trim();
        if (!t) return;
        addMutation.mutate(t);
        setTitle("");
    };

    const importToLocal = (remote) => {
        // converte o modelo remoto {title, completed} para seu local {text, done}
        const ok = add(remote.title);
        // opcional: feedback
        if (!ok) alert("Não foi possível importar (título vazio?)");
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
                    Tarefas do Servidor (React Query)
                </h2>
                <button
                    onClick={() => refetch()}
                    className="rounded-xl px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
                    disabled={isFetching}
                >
                    {isFetching ? "Atualizando…" : "Recarregar"}
                </button>
            </div>

            {/* Adicionar remoto (demo mutation) */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Nova tarefa remota…"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => (e.key === "Enter" ? handleAddRemote() : null)}
                    className="flex-1 h-12 rounded-2xl border border-gray-300 px-5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                />
                <button
                    onClick={handleAddRemote}
                    className="h-12 rounded-2xl px-6 font-medium bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                    disabled={addMutation.isLoading}
                >
                    {addMutation.isLoading ? "Enviando…" : "Adicionar remoto"}
                </button>
            </div>

            {/* Lista remota */}
            {isLoading && <p className="text-gray-500">Carregando…</p>}
            {isError && <p className="text-red-600">Erro: {error.message}</p>}

            <ul className="space-y-3">
                {data?.map((t) => (
                    <li
                        key={t.id}
                        className="flex items-center justify-between rounded-2xl border border-gray-200 px-5 py-4"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className={[
                                    "h-5 w-5 rounded-md border flex items-center justify-center",
                                    t.completed ? "bg-green-600 border-green-600" : "bg-white border-gray-300",
                                ].join(" ")}
                            >
                                {t.completed && (
                                    <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </span>
                            <span className={t.completed ? "line-through text-gray-400" : "text-gray-800"}>
                                {t.title} {t.optimistic && <em className="text-xs text-gray-400">(otimista)</em>}
                            </span>
                        </div>

                        <button
                            onClick={() => importToLocal(t)}
                            className="rounded-xl px-3 py-1.5 text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition"
                            title="Importar para a lista local"
                        >
                            Importar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
