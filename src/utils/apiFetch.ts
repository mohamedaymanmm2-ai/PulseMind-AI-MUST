export async function postJsonWithRetry<T>(
  url: string,
  body: unknown,
  options?: { timeoutMs?: number; retries?: number }
): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? 55000;
  const maxRetries = options?.retries ?? 1;

  let lastError: Error = new Error('Request failed. Please try again.');

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const rawText = await response.text();
      let parsed: Record<string, unknown> | null = null;
      if (rawText) {
        try {
          parsed = JSON.parse(rawText) as Record<string, unknown>;
        } catch {
          parsed = null;
        }
      }

      if (!response.ok) {
        const serverErr =
          typeof parsed?.error === 'string' && parsed.error.trim()
            ? parsed.error
            : `Server error (${response.status})`;
        const isTransientStatus =
          response.status === 502 || response.status === 503 || response.status === 504 || response.status === 429;
        lastError = new Error(serverErr);
        if (isTransientStatus && attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 600));
          continue;
        }
        throw lastError;
      }

      if (!parsed) {
        throw new Error('Invalid response format received from server.');
      }

      return parsed as T;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        lastError = new Error('Request timed out. Please try again.');
      } else if (err instanceof Error) {
        lastError = err;
      }

      const isNetworkOrTimeout =
        /timed out|failed to fetch|networkerror|load failed|network request failed/i.test(
          lastError.message
        );
      if (isNetworkOrTimeout && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 600));
        continue;
      }
      throw lastError;
    } finally {
      window.clearTimeout(timer);
    }
  }

  throw lastError;
}
