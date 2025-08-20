import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import TodoItem from "./components/todoItem.jsx";

function safeId() {
  return (globalThis.crypto?.randomUUID?.()) ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  // useState: estados da lista, input e busca
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [query, setQuery] = useState("");

  // useRef: pegar o input para focar automaticamente
  const inputRef = useRef(null);

  // useEffect (1): carregar do localStorage ao montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tasks");
      if (raw) setTasks(JSON.parse(raw));
    } catch { }
    inputRef.current?.focus();
  }, []);

  // useEffect (2): salvar no localStorage sempre que tasks mudar
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // useEffect (3): refletir progresso no título da aba
  useEffect(() => {
    const done = tasks.filter(t => t.done).length;
    const total = tasks.length || 1;
    document.title = `To-Do (${Math.round((done / total) * 100)}%)`;
  }, [tasks]);

  // useCallback: handlers estáveis (evita recriar funções desnecessariamente)
  const addTask = useCallback(() => {
    const text = newTask.trim();
    if (!text) return;
    setTasks(prev => [...prev, { id: safeId(), text, done: false }]);
    setNewTask("");
    inputRef.current?.focus();
  }, [newTask]);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => !t.done));
  }, []);

  // useMemo: derivados (contadores, % e lista filtrada)
  const { total, done, remaining, pct } = useMemo(() => {
    const total = tasks.length;
    const done = tasks.reduce((acc, t) => acc + (t.done ? 1 : 0), 0);
    return { total, done, remaining: total - done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? tasks.filter(t => t.text.toLowerCase().includes(q)) : tasks;
    // opcional: ordenar pendentes primeiro
    return [...list].sort((a, b) => Number(a.done) - Number(b.done));
  }, [tasks, query]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl md:max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">📝 To-Do List</h1>
            <span className="text-sm text-gray-500 tabular-nums">{pct}%</span>
          </div>

          {/* contador */}
          <div className="w-full flex flex-wrap items-center gap-x-4 gap-y-3 md:gap-x-6 md:gap-y-4 mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-medium">
              Total: {total}
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-xl bg-green-50 text-green-700 font-medium">
              Concluídas: {done}
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-50 text-amber-700 font-medium">
              Pendentes: {remaining}
            </span>
            <span className="inline-flex items-center text-sm text-gray-500 tabular-nums w-full md:w-auto md:ml-auto">
              Aproveitamento: {pct}%
            </span>
          </div>

          {/* barra de progresso */}
          <div className="h-2 w-full bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-green-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>

          {/* busca + entrada + ações */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Buscar…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="sm:w-1/3 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
            />
            <div className="flex-1 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Nova tarefa…"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? addTask() : null)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              />
              <button
                onClick={addTask}
                className="rounded-xl px-5 py-3 font-medium bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
              >
                Adicionar
              </button>
              <button
                onClick={clearCompleted}
                className="rounded-xl px-4 py-3 font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 transition"
              >
                Limpar concluídas
              </button>
            </div>
          </div>

          {/* lista */}
          <ul className="space-y-2">
            {visibleTasks.length === 0 && (
              <li className="text-sm text-gray-500">Nada por aqui…</li>
            )}
            {visibleTasks.map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </ul>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">React + Vite + Tailwind</p>
      </div>
    </div>
  );
}
