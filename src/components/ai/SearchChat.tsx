'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Send, User, Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StreamingText } from './StreamingText';
import { useAIStream } from '@/hooks/useAIStream';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function SearchChat() {
  const t = useTranslations('search');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { text, isStreaming, error, startStream, reset } = useAIStream();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: question }]);

    reset();
    await startStream('/api/ai/search', {
      question,
      context: '',
      history: messages.slice(-10),
    });

    // After streaming completes, add assistant message
    setMessages((prev) => [...prev, { role: 'assistant', content: text || '...' }]);
  };

  const examples = [
    t('example1'),
    t('example2'),
    t('example3'),
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 && !isStreaming && (
          <div className="space-y-4 py-8 text-center">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">{t('subtitle')}</p>
            <div className="mx-auto max-w-sm space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{t('exampleQueries')}</p>
              {examples.map((ex, i) => (
                <button
                  key={i}
                  className="block w-full rounded-lg border p-2 text-left text-sm transition-colors hover:bg-muted"
                  onClick={() => setInput(ex)}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming response */}
          {isStreaming && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2">
                <StreamingText text={text} isStreaming={true} className="text-sm" />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
        <div ref={scrollRef} />
      </ScrollArea>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 flex gap-2 border-t bg-background p-4"
      >
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('placeholder')}
          disabled={isStreaming}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isStreaming || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
