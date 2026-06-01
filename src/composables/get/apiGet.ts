export async function apiGet(url: string) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...{},
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.error || 'Ошибка запроса');
  }

  return data;
}
