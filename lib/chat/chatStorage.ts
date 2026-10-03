import type { ChatLink, ChatMessage } from "@/types/chat";

const MESSAGE_KEY = "kaka-dikro-chat";
const SESSION_KEY = "kaka-dikro-chat-session";
const MAX_MESSAGES = 40;

function isLink(value: unknown): value is ChatLink {
  if (!value || typeof value !== "object") return false;
  const link = value as ChatLink;
  return typeof link.href === "string" && typeof link.label === "string";
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as ChatMessage;
  if (message.role !== "user" && message.role !== "bot") return false;
  if (typeof message.id !== "string" || typeof message.text !== "string") return false;
  if (message.links === undefined) return true;
  return Array.isArray(message.links) && message.links.every(isLink);
}

export function nextMessageNumber(messages: ChatMessage[]): number {
  const highest = messages.reduce((max, message) => {
    const match = message.id.match(/(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return highest + 1;
}

export function loadChatMessages(fallback: ChatMessage[]): ChatMessage[] {
  try {
    const sameVisit = sessionStorage.getItem(SESSION_KEY) === "open";
    sessionStorage.setItem(SESSION_KEY, "open");

    if (!sameVisit) {
      localStorage.removeItem(MESSAGE_KEY);
      return fallback;
    }

    const raw = localStorage.getItem(MESSAGE_KEY);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;

    const messages = parsed.filter(isChatMessage);
    return messages.length > 0 ? messages : fallback;
  } catch {
    return fallback;
  }
}

export function saveChatMessages(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(SESSION_KEY, "open");
    const stored =
      messages.length > MAX_MESSAGES
        ? [messages[0], ...messages.slice(messages.length - (MAX_MESSAGES - 1))]
        : messages;
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(stored));
  } catch {
    // Ignore private mode and full storage.
  }
}
