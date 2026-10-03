import type { QuickReply } from "@/types/chat";

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (prompt: string) => void;
}

export default function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  return (
    <div className="flex shrink-0 flex-wrap gap-2 px-3 pb-2">
      {replies.map((reply) => (
        <button
          key={reply.id}
          type="button"
          onClick={() => onSelect(reply.prompt)}
          className="min-h-11 shrink-0 rounded-full border border-orange-100 bg-white px-3 text-sm text-[#003d4d] transition-colors hover:bg-[#FFF9F5]"
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
}
