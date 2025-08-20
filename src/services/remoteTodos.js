const BASE = "https://jsonplaceholder.typicode.com";

export async function fetchRemoteTodos(limit = 10) {
    const res = await fetch(`${BASE}/todos?_limit=${limit}`);
    if (!res.ok) throw new Error("Falha ao buscar todos remotos");
    return res.json(); // [{ id, title, completed, userId }]
}

// Exemplos de mutations (JSONPlaceholder não persiste, mas serve para demo):
export async function addRemoteTodo(title) {
    const res = await fetch(`${BASE}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false, userId: 1 }),
    });
    if (!res.ok) throw new Error("Falha ao adicionar remoto");
    return res.json();
}
