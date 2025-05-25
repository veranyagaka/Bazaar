import { useState } from "react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
  if (!isOpen && messages.length === 0) {
    setMessages([
      {
        role: "assistant",
        content:
          "👋 Hi there! I'm Bazaar AI — your smart assistant. Ask me anything about products, sellers, or how The Bazaar works.",
      },
    ]);
  }
  setIsOpen(!isOpen);
};

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error getting reply." }]);
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-2xl hover:bg-purple-700 transition"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white shadow-2xl rounded-xl flex flex-col border border-gray-200">
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${
                  m.role === "user"
                    ? "bg-purple-100 self-end text-right ml-auto"
                    : "bg-gray-100 self-start text-left mr-auto"
                }`}
              >
                <span className="text-sm text-gray-800">{m.content}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 p-2 flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-purple-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-purple-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
