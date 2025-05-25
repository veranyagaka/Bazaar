import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

const Chatroom = () => {
  const [role, setRole] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) console.error("Error loading messages:", error);
      else setMessages(data);
    };

    loadMessages();

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        sender_role: role,
        content: input,
      },
    ]);
    if (error) {
      console.error("Insert message error:", error);
    } else {
      setInput("");
    }
  };

  if (!role)
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-xl font-bold">Join as</h1>
        <button
          onClick={() => setRole("farmer")}
          className="px-8 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
        >
          👨‍🌾 Farmer
        </button>
        <button
          onClick={() => setRole("buyer")}
          className="px-8 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          🛒 Buyer
        </button>
      </div>
    );

  return (
    <div className="flex flex-col h-screen p-6 max-w-xl mx-auto bg-gray-50">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Chatroom - You are a {role}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-6 border border-gray-300 p-5 rounded-lg bg-white flex flex-col">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg max-w-xs text-base break-words shadow-sm ${
              m.sender_role === role
                ? "bg-green-200 self-end ml-auto text-gray-900"
                : "bg-blue-200 self-start mr-auto text-gray-900"
            }`}
          >
            <strong className="block mb-1">
              {m.sender_role === "farmer" ? "👨‍🌾 Farmer" : "🛒 Buyer"}:
            </strong>
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          className="flex-1 border border-gray-400 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatroom;
