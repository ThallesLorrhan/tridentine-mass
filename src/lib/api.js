const API_BASE = "https://thalleslorrhan.pythonanywhere.com/api/";

export async function fetchChapels() {
  const res = await fetch(`${API_BASE}/chapels/`);
  if (!res.ok) throw new Error("Erro ao buscar capelas");
  return res.json();
}

export async function fetchChapelById(id) {
  const res = await fetch(`${API_BASE}/chapels/${id}/`);
  if (!res.ok) throw new Error("Erro ao buscar capela");
  return res.json();
}
