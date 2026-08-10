import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

export default function AIConcierge() {
  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        text: "Welcome to DriveFleet AI."
      }
    ]);

  const [input, setInput] =
    useState("");

  const handleSend = () => {

    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: input
      },
      {
        role: "assistant",
        text:
          "AI recommendations coming soon."
      }
    ]);

    setInput("");
  };

  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        p-6
      "
    >

      <div className="flex gap-3 items-center mb-6">

        <Sparkles
          className="text-cyan-400"
        />

        <h2 className="text-white text-xl font-bold">
          AI Concierge
        </h2>

      </div>

      <div
        className="
          h-[350px]
          overflow-y-auto
          space-y-4
        "
      >

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.role === "assistant"
                ? "text-cyan-400"
                : "text-white"
            }
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-4">

        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Ask AI..."
          className="
            flex-1
            bg-slate-800
            text-white
            rounded-xl
            px-4
          "
        />

        <button
          onClick={handleSend}
          className="
            bg-cyan-500
            p-3
            rounded-xl
          "
        >
          <Send />
        </button>

      </div>
    </div>
  );
}
