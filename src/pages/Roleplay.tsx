import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Gamepad2, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "system" | "user";
  content: string;
}

const initialMessages: Message[] = [
  {
    role: "system",
    content:
      "🎭 **Simulation : Incident de sécurité réseau**\n\nVous êtes technicien réseau chez TechCorp. Un employé signale qu'il ne peut plus accéder au serveur de fichiers depuis 30 minutes. D'autres collègues du même étage rencontrent le même problème.\n\nQue faites-vous en premier ?",
  },
];

const Roleplay = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const systemResponse: Message = {
      role: "system",
      content:
        "Bonne initiative. Vous avez vérifié la connectivité réseau du switch d'étage. Le switch répond, mais les logs montrent un pic de trafic anormal sur le port 443.\n\n📊 **Score intermédiaire : 75/100**\n- ✅ Bonne méthodologie de diagnostic\n- ⚠️ Pensez à documenter l'incident avant de poursuivre\n\nQuelle est votre prochaine action ?",
    };
    setMessages([...messages, userMsg, systemResponse]);
    setInput("");
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6 flex flex-col h-[calc(100vh-2rem)]">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Jeu de rôle</h1>
          <p className="text-muted-foreground mt-1">Simulation interactive basée sur vos procédures internes</p>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "system" ? "gradient-primary" : "bg-accent"
              }`}>
                {msg.role === "system" ? (
                  <Bot className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <User className="w-4 h-4 text-accent-foreground" />
                )}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "system"
                  ? "glass-card text-foreground"
                  : "gradient-primary text-primary-foreground"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Votre action ou réponse..."
            className="flex-1"
          />
          <Button onClick={send} className="gradient-primary text-primary-foreground">
            <Send className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Roleplay;
