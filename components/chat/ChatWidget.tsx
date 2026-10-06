"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import ChatPanel from "@/components/chat/ChatPanel";
import { loadChatMessages, nextMessageNumber, saveChatMessages } from "@/lib/chat/chatStorage";
import { greeting, quickReplies } from "@/lib/chat/knowledge";
import { matchQuestion } from "@/lib/chat/matchQuestion";
import type { ChatLink, ChatMessage } from "@/types/chat";

const openingMessage: ChatMessage = { id: "greeting", role: "bot", text: greeting };
const REPLY_DELAY_MS = 1300;
const TEASER_RETURN_MS = 20000;
const teaserLines = ["Hi there", "How can I help you today?"];

interface PendingReply {
  id: string;
  text: string;
  links?: ChatLink[];
}

interface PanelFrame {
  top: number;
  height: number;
  keyboardOpen: boolean;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([openingMessage]);
  const [storageReady, setStorageReady] = useState(false);
  const [wobble, setWobble] = useState(false);
  const [panelFrame, setPanelFrame] = useState<PanelFrame | null>(null);
  const [typing, setTyping] = useState(false);
  const [teaserLine, setTeaserLine] = useState(0);
  const [teaserRun, setTeaserRun] = useState(0);
  const idRef = useRef(1);
  const pendingRef = useRef<PendingReply[]>([]);
  const replyTimer = useRef<number | null>(null);
  const replyingRef = useRef(false);
  const teaserTimers = useRef<number[]>([]);
  const teaserReturnTimer = useRef<number | null>(null);

  const clearTeaserTimers = () => {
    teaserTimers.current.forEach((id) => window.clearTimeout(id));
    teaserTimers.current = [];
  };

  useEffect(() => {
    const stored = loadChatMessages([openingMessage]);
    setMessages(stored);
    idRef.current = nextMessageNumber(stored);
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    saveChatMessages(messages);
  }, [messages, storageReady]);

  useEffect(() => {
    if (open) {
      setWobble(false);
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    let stopWobble = 0;
    const play = () => {
      setWobble(true);
      window.clearTimeout(stopWobble);
      stopWobble = window.setTimeout(() => setWobble(false), 900);
    };

    const first = window.setTimeout(play, 2800);
    const repeat = window.setInterval(play, 14000);

    return () => {
      window.clearTimeout(first);
      window.clearTimeout(stopWobble);
      window.clearInterval(repeat);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPanelFrame(null);
      return;
    }

    const viewport = window.visualViewport;
    if (!viewport) return;

    const safeArea = (name: "top" | "bottom") => {
      const probe = document.createElement("div");
      probe.style.position = "fixed";
      probe.style.visibility = "hidden";
      probe.style.paddingTop = `env(safe-area-inset-${name})`;
      document.body.appendChild(probe);
      const value = Number.parseFloat(window.getComputedStyle(probe).paddingTop) || 0;
      probe.remove();
      return value;
    };

    const update = () => {
      const isNarrow = window.matchMedia("(max-width: 639px)").matches;
      const inset = Math.max(0, window.innerHeight - viewport.offsetTop - viewport.height);
      const keyboardOpen = inset > 120;
      const browserChrome = isNarrow && (viewport.offsetTop > 1 || inset > 1);

      if (!keyboardOpen && !browserChrome) {
        setPanelFrame(null);
        return;
      }

      const safeTop = keyboardOpen ? 0 : safeArea("top");
      const safeBottom = keyboardOpen ? 0 : safeArea("bottom");
      const topGap = 12 + safeTop;
      const bottomGap = keyboardOpen ? 12 : 16 + 56 + 12 + safeBottom;

      setPanelFrame({
        top: Math.round(viewport.offsetTop + topGap),
        height: Math.max(0, Math.round(viewport.height - topGap - bottomGap)),
        keyboardOpen,
      });
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTeaserLine(0);
      clearTeaserTimers();
      if (teaserReturnTimer.current) {
        window.clearTimeout(teaserReturnTimer.current);
        teaserReturnTimer.current = null;
      }
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const firstDelay = reduceMotion ? 400 : 1200;
    const secondDelay = reduceMotion ? 0 : 850;
    clearTeaserTimers();
    teaserTimers.current = [
      window.setTimeout(() => setTeaserLine(1), firstDelay),
      window.setTimeout(() => setTeaserLine(2), firstDelay + secondDelay),
    ];

    return () => clearTeaserTimers();
  }, [open, teaserRun]);

  useEffect(
    () => () => {
      if (replyTimer.current) window.clearTimeout(replyTimer.current);
      if (teaserReturnTimer.current) window.clearTimeout(teaserReturnTimer.current);
    },
    [],
  );

  const playNextReply = () => {
    const next = pendingRef.current.shift();
    if (!next) {
      replyingRef.current = false;
      setTyping(false);
      return;
    }

    replyingRef.current = true;
    setTyping(true);
    replyTimer.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: next.id, role: "bot", text: next.text, links: next.links },
      ]);
      playNextReply();
    }, REPLY_DELAY_MS);
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const answer = matchQuestion(trimmed);
    const userId = `user-${idRef.current++}`;
    const botId = `bot-${idRef.current++}`;

    setMessages((current) => [...current, { id: userId, role: "user", text: trimmed }]);
    pendingRef.current.push({ id: botId, text: answer.text, links: answer.links });
    if (!replyingRef.current) playNextReply();
  };

  const dismissTeaser = () => {
    clearTeaserTimers();
    setTeaserLine(0);
    if (teaserReturnTimer.current) window.clearTimeout(teaserReturnTimer.current);
    teaserReturnTimer.current = window.setTimeout(() => {
      teaserReturnTimer.current = null;
      setTeaserRun((run) => run + 1);
    }, TEASER_RETURN_MS);
  };

  const openChat = () => {
    setTeaserLine(0);
    setOpen(true);
  };

  return (
    <>
      {open ? (
        <div
          id="kaka-dikro-chat"
          className="fixed z-[60] flex min-h-0 flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl left-3 right-3 bottom-[calc(16px+3.5rem+12px+env(safe-area-inset-bottom))] h-[calc(100dvh-6rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] sm:left-auto sm:w-[380px] sm:right-[calc(16px+env(safe-area-inset-right))] sm:h-[min(560px,calc(100dvh-6rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))]"
          style={
            panelFrame
              ? {
                  top: panelFrame.top,
                  height: panelFrame.height,
                  maxHeight: panelFrame.height,
                  bottom: "auto",
                }
              : undefined
          }
        >
          <ChatPanel
            messages={messages}
            quickReplies={quickReplies}
            typing={typing}
            onClose={() => setOpen(false)}
            onSend={sendMessage}
          />
        </div>
      ) : null}

      {!open && teaserLine > 0 ? (
        <div className="fixed z-[60] bottom-[calc(16px+3.5rem+12px+env(safe-area-inset-bottom))] right-[calc(16px+env(safe-area-inset-right))] flex max-w-[min(240px,calc(100vw-5rem))] flex-col items-end gap-2">
          <div className="relative flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={dismissTeaser}
              aria-label="Close greeting"
              className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-orange-100 bg-white text-[#7A330F] shadow-md hover:bg-[#FFF9F5]"
            >
              <X size={14} aria-hidden="true" />
            </button>
            {teaserLines.slice(0, teaserLine).map((line) => (
              <button
                key={line}
                type="button"
                onClick={openChat}
                className="chat-teaser-in max-w-full rounded-2xl rounded-br-md border border-orange-100 bg-white px-3 py-2 text-left text-sm leading-snug text-[#7A330F] shadow-lg"
              >
                {line}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {panelFrame?.keyboardOpen ? null : (
        <button
          type="button"
          aria-label={open ? "Close chat" : "Open chat"}
          aria-expanded={open}
          aria-controls="kaka-dikro-chat"
          onClick={() => setOpen((current) => !current)}
          className={`fixed z-[60] flex h-14 w-14 origin-center items-center justify-center overflow-hidden rounded-full bg-[#7A330F] text-white shadow-lg ring-2 ring-white hover:bg-[#5f2609] bottom-[calc(16px+env(safe-area-inset-bottom))] right-[calc(16px+env(safe-area-inset-right))] ${wobble && !open ? "chat-launcher-wobble" : ""}`}
        >
          {open ? (
            <X size={26} aria-hidden="true" />
          ) : (
            <img
              src="/assets/chatbot.webp"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          )}
        </button>
      )}
    </>
  );
}
