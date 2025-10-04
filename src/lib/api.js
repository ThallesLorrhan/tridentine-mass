const API_BASE = "https://thalleslorrhan.pythonanywhere.com/api";

export async function fetchChapels() {
  try {
    const res = await fetch(`${API_BASE}/chapels/`);
    if (!res.ok) {
      const errorText = await res.text(); // mostra o conteúdo do erro do backend
      throw new Error(`Erro ao buscar capelas: ${res.status} - ${errorText}`);
    }
    return res.json();
  } catch (err) {
    console.error("fetchChapels erro:", err);
    throw err;
  }
}

export async function fetchChapelById(id) {
  try {
    const res = await fetch(`${API_BASE}/chapels/${id}/`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erro ao buscar capela: ${res.status} - ${errorText}`);
    }
    return res.json();
  } catch (err) {
    console.error("fetchChapelById erro:", err);
    throw err;
  }
}
