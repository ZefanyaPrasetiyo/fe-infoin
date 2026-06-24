export async function api(path: string, options: RequestInit = {}){
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = process.env.NEXT_PUBLIC_API_KEY

    const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    "Authorization": `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const finalHeaders = {
    ...headers,
    ...options.headers,
  };

    const res = await fetch(`${baseUrl}${path}`, {
        ...options,
    headers: finalHeaders,
    })
     if (!res.ok) {
    const text = await res.text();
    console.error("Fetch error:", res.status, text);
    throw new Error(`HTTP ${res.status}: ${text}`);
    
  }

  return res.json();
}