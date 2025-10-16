import axios from 'axios';

const API = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

export async function aiHealth() {
  try {
    const res = await axios.get(`${API}/api/tags`);
    return { success: true, status: 'healthy', models: (res.data.models || []).length };
  } catch (e: unknown) {
    return { success: false, status: 'unhealthy', error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function listModels() {
  try {
    const res = await axios.get(`${API}/api/tags`);
    return { success: true, models: res.data.models || [] };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function chat(messages: Array<{ role: string; content: string }>, model?: string, options?: Record<string, unknown>) {
  const res = await axios.post(`${API}/api/chat`, { model: model || MODEL, messages, stream: false, ...(options || {}) });
  return { success: true, content: res.data.message?.content, model: res.data.model, done: res.data.done };
}

export async function generate(prompt: string, model?: string, options?: Record<string, unknown>) {
  const res = await axios.post(`${API}/api/generate`, { model: model || MODEL, prompt, stream: false, ...(options || {}) });
  return { success: true, response: res.data.response, model: res.data.model, done: res.data.done };
}
