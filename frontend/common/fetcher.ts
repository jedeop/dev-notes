export default async function fetcher<Response>(url: string): Promise<Response> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`An error occurred while fetching the data: ${res.status} ${await res.text()}`)
  }

  return res.json()
};

export async function fetcherWithToken<Response>([url, token]: [string, string]): Promise<Response> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  if (!res.ok) {
    throw new Error(`An error occurred while fetching the data: ${res.status} ${await res.text()}`)
  }

  return res.json()
};