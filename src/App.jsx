import { NavLink, Routes, Route, Outlet, useLocation } from "react-router-dom";
import All from "./pages/All.jsx";
import Active from "./pages/Active.jsx";
import Completed from "./pages/Completed.jsx";
import Settings from "./pages/Settings.jsx";
import Remote from "./pages/remote.jsx"; // ✅ NOVO
import { useTodosStats } from "./context/TodosContext.jsx";
import { useDocumentTitle } from "./hooks/useDocumentTitle";

function useSectionLabel() {
  const { pathname } = useLocation();
  if (pathname === "/") return "Todas";
  if (pathname.startsWith("/active")) return "Pendentes";
  if (pathname.startsWith("/completed")) return "Concluídas";
  if (pathname.startsWith("/remote")) return "Remoto";          // ✅ NOVO
  if (pathname.startsWith("/settings")) return "Configurações";
  return "Página";
}

export default function App() {
  const stats = useTodosStats();
  const section = useSectionLabel();
  useDocumentTitle(`To-Do — ${section} (${stats.pct}%)`);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <nav className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-2">
          <h1 className="mr-auto text-lg font-bold select-none">📝 To-Do</h1>
          <Tab to="/">Todas</Tab>
          <Tab to="/active">Pendentes</Tab>
          <Tab to="/completed">Concluídas</Tab>
          <Tab to="/remote">Remoto</Tab> {/* ✅ NOVO */}
          <Tab to="/settings">Configurações</Tab>
        </nav>
      </header>

      {/* Conteúdo das rotas */}
      <main className="mx-auto max-w-3xl p-6">
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<All />} />
            <Route path="active" element={<Active />} />
            <Route path="completed" element={<Completed />} />
            <Route path="remote" element={<Remote />} /> {/* ✅ NOVO */}
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-xl px-3 py-1.5 text-sm font-medium transition",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
          isActive ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100",
        ].join(" ")
      }
      end={to === "/"}
    >
      {children}
    </NavLink>
  );
}

function Shell() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-base md:text-lg">
      <Outlet />
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-gray-600">
      <p className="mb-2">Página não encontrada.</p>
      <NavLink to="/" className="text-blue-600 hover:underline">Voltar para a lista</NavLink>
    </div>
  );
}
