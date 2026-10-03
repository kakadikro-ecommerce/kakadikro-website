import Link from "next/link";

import type { ChatLink, ChatMessage as ChatMessageType } from "@/types/chat";

function AnswerLink({ link }: { link: ChatLink }) {
  const className =
    "text-[#003d4d] underline underline-offset-2 hover:text-[#5f2609]";

  if (link.href.startsWith("/")) {
    return (
      <Link href={link.href} className={className}>
        {link.label}
      </Link>
    );
  }

  return (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  );
}

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-[#7A330F] text-white"
            : "bg-[#FFF9F5] text-[#7A330F]"
        }`}
      >
        <p className="break-words">{message.text}</p>
        {message.links && message.links.length > 0 ? (
          <div className="mt-2 flex flex-col items-start gap-1">
            {message.links.map((link) => (
              <AnswerLink key={`${link.href}-${link.label}`} link={link} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
