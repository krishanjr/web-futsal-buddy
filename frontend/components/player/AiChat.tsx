"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { askAiAction } from "@/lib/actions/ai-actions";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const suggestions = [
  "Find nearby matches for a mixed skill team",
  "How can I improve as a midfielder?",
  "What's a good warmup routine before a match?",
];

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Welcome back! I'm Buddy, your futsal AI assistant. Ask me anything about matches, teams, or training.",
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(question: string) {
    if (!question.trim() || pending) return;
    setError("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");

    startTransition(async () => {
      const res = await askAiAction(question);
      if (!res.success || !res.data) {
        setError(res.message || "Something went wrong asking Buddy.");
        return;
      }
      setMessages((m) => [...m, { role: "assistant", text: res.data!.answer }]);
    });
  }

  return (
    <div className="flex flex-col h-full max-h-[70vh] bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
              m.role === "user"
                ? "self-end bg-green-700 text-white rounded-br-sm"
                : "self-start bg-gray-100 text-gray-800 rounded-bl-sm"
            }`}
          >
            {m.text}
          </div>
        ))}
        {pending && (
          <div className="self-start bg-gray-100 text-gray-400 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm">
            Buddy is thinking…
          </div>
        )}
        {error && (
          <div className="self-start text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={pending}
            className="text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="px-5 py-4 border-t border-gray-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Buddy about games, teams, or training…"
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
