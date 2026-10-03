export type ChatRole = "user" | "bot";

export interface ChatLink {
  href: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  links?: ChatLink[];
}

export interface ChatAnswer {
  text: string;
  links?: ChatLink[];
}

export interface QuickReply {
  id: string;
  label: string;
  prompt: string;
}
