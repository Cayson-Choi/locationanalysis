'use client';

import { useState, useCallback } from 'react';

interface AIStreamState {
  text: string;
  isStreaming: boolean;
  error: string | null;
  data: Record<string, unknown> | null;
}

export function useAIStream() {
  const [state, setState] = useState<AIStreamState>({
    text: '',
    isStreaming: false,
    error: null,
    data: null,
  });

  const startStream = useCallback(async (url: string, body: Record<string, unknown>) => {
    setState({ text: '', isStreaming: true, error: null, data: null });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.text) {
                fullText += parsed.text;
                setState((prev) => ({ ...prev, text: fullText }));
              }
              if (parsed.done) {
                // Try to parse JSON from the full text
                try {
                  const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/) ||
                    fullText.match(/\{[\s\S]*\}/);
                  if (jsonMatch) {
                    const jsonStr = jsonMatch[1] || jsonMatch[0];
                    const data = JSON.parse(jsonStr);
                    setState((prev) => ({ ...prev, data }));
                  }
                } catch {
                  // Not valid JSON, that's fine
                }
              }
              if (parsed.error) {
                setState((prev) => ({ ...prev, error: parsed.error }));
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Stream failed',
      }));
    } finally {
      setState((prev) => ({ ...prev, isStreaming: false }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({ text: '', isStreaming: false, error: null, data: null });
  }, []);

  return { ...state, startStream, reset };
}
