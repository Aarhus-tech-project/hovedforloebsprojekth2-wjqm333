// Sender requests til backend API
const API = "/api";

export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!res.ok) throw new Error(typeof data === "string" ? data : data?.message || "Fejl");
    return data;
}
