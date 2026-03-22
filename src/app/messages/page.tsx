"use client";

import { useEffect, useState } from "react";
import { Conversation } from "@/lib/types";
import ConversationList from "@/components/ConversationList";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await fetch("/api/messages");
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = (await res.json()) as Conversation[];
        setConversations(data);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Loading messages…
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-3.5rem)] lg:h-screen border-x border-gray-200 bg-white">
      <ConversationList conversations={conversations} />
    </div>
  );
}
