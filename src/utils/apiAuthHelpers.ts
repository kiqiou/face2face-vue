import { authFetch } from './authFetch.js';

async function parseOrThrow(response: Response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Ошибка запроса: ${response.status}`);
  }
  if (response.status === 204) return null; 
  return response.json();
}

export async function authFetchJson(url: string) {
  const response = await authFetch(url, { method: 'GET' });
  return parseOrThrow(response);
}

export async function authPostJson(url: string, body: unknown) {
  const response = await authFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseOrThrow(response);
}

export async function authPatchJson(url: string, body: unknown) {
  const response = await authFetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseOrThrow(response);
}

export async function authPostForm(url: string, formData: FormData) {
  const response = await authFetch(url, {
    method: 'POST',
    body: formData,
  });
  return parseOrThrow(response);
}

export async function authPatchForm(url: string, formData: FormData) {
  const response = await authFetch(url, {
    method: 'PATCH',
    body: formData,
  });
  return parseOrThrow(response);
}

export async function authDelete(url: string) {
  const response = await authFetch(url, { method: 'DELETE' });
  return parseOrThrow(response);
}