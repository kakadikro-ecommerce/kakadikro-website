"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";

import ChatMessage from "@/components/chat/ChatMessage";
import QuickReplies from "@/components/chat/QuickReplies";
import type { ChatMessage as ChatMessageType, QuickReply } from "@/types/chat";

interface ChatPanelProps {
  messages: ChatMessageType[];
  quickReplies: QuickReply[];
  typing: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="flex items-center gap-1 rounded-2xl bg-[#FFF9F5] px-3 py-3"
        role="status"
        aria-label="Assistant is typing"
      >
        <span className="chat-typing-dot" />
        <span className="chat-typing-dot [animation-delay:150ms]" />
        <span className="chat-typing-dot [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default function ChatPanel({
  messages,
  quickReplies,
  typing,
  onClose,
  onSend,
}: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (window.matchMedia("(min-width: 640px)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <div
      role="dialog"
      aria-label="Kaka Dikro chat"
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 bg-[#7A330F] px-4 py-3 text-white">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/assets/chatbot.webp"
            alt=""
            aria-hidden="true"
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white/30"
          />
          <div className="min-w-0">
            <p id="kaka-dikro-chat-title" className="text-base font-semibold leading-tight">
              Kaka Dikro
            </p>
            <p className="text-xs text-[#FFF9F5]/90">Ask us anything</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-[#5f2609]"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-3 py-3"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {typing ? <TypingIndicator /> : null}
      </div>

      <QuickReplies replies={quickReplies} onSelect={onSend} />

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2 border-t border-orange-100 p-3"
      >
        <label htmlFor="kaka-dikro-chat-input" className="sr-only">
          Message
        </label>
        <input
          id="kaka-dikro-chat-input"
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask a question"
          enterKeyHint="send"
          className="h-11 min-w-0 flex-1 rounded-full border border-orange-100 bg-white px-4 text-base text-[#003d4d] outline-none placeholder:text-[#003d4d]/50 focus:border-[#7A330F]"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7A330F] text-white hover:bg-[#5f2609]"
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
