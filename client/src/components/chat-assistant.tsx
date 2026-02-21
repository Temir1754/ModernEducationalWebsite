import { useState, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

export default function ChatAssistant() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    question: ""
  });

  // Load user name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("chatUserName");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `Сәлем 👋 Мен – FGS мектебінің виртуалды көмекшісімін!\nМен сізге кесте, асхана мәзірі, UPay жүйесі және басқа ақпаратты табуға көмектесемін.\nТағы да сұрақтарыңыз болса — мен әрқашан дайынмын 💡`,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const playNotificationSound = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwPUKnl77RgGwU7k9n0zHkpBSh+zPLaizsKGGS65+ynWBUIR6Df8bxrHgQtgM3y2Io2Bxpqve/mnU0MD1Cp5e60XxsFO5PZ9M15KAUnfszx2owyChReteznplYVCUef4PK8aB8EKX/O8tmJNgcbarz05p1OCw9Rq+bvs18cBT2U2fTNeSYEKYDN8d2PPgsXZbzr66ZXFQlHn+Hyu2geBCqAzvLZiTYHG2u97eadTwwOUKvm8LJeHAU+lNr0z3koBCuBzvLci0ALFmW96+ylVhUJRp/h8bxoHgQpf87y2Yk2Bhpqve3mnU4LD1Co5u+0YBwGPpTa9M15KQUrgs/y2os4ChVlvOznpVYWCUef4PG8aR4EKn/O8tmJNgYba77t5p1ODBBQ");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const addMessage = (text: string, sender: "bot" | "user") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    if (sender === "bot") {
      playNotificationSound();
    }
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case "📅 Расписание":
        setIsOpen(false);
        setLocation("/schedule");
        break;
      case "🍽 Асхана мәзірі":
        setIsOpen(false);
        setLocation("/canteen");
        break;
      case "💰 UPay жүйесі":
        setIsOpen(false);
        setLocation("/students");
        break;
      case "🧑‍🏫 Оқушылар мен ұстаздар":
        setIsOpen(false);
        setLocation("/students");
        break;
      case "🏫 Байланыс":
        setIsOpen(false);
        setLocation("/contact");
        break;
      case "📲 Оставить заявку":
        addMessage(action, "user");
        setTimeout(() => {
          setShowRequestForm(true);
          addMessage("Өтініш қалдыру үшін төмендегі форманы толтырыңыз 📝", "bot");
        }, 500);
        break;
      default:
        addMessage(action, "user");
        setTimeout(() => {
          addMessage("Бұл сұрақ бойынша мен ақпаратты нақтылап жатырмын. Төменде байланыс үшін өтініш қалдырыңыз 💬", "bot");
        }, 500);
    }
  };

  const handleSubmitQuestion = () => {
    if (inputValue.trim()) {
      addMessage(inputValue, "user");
      setInputValue("");
      
      setTimeout(() => {
        addMessage("Бұл сұрақ бойынша мен ақпаратты нақтылап жатырмын. Төменде байланыс үшін өтініш қалдырыңыз 💬", "bot");
      }, 500);
    }
  };

  const handleSubmitRequest = () => {
    if (formData.name && formData.role && formData.question) {
      // Save user name for future
      localStorage.setItem("chatUserName", formData.name);
      setUserName(formData.name);

      // Create message for Telegram/WhatsApp
      const message = `🎓 Жаңа өтініш FGS мектебінен:\n\n👤 Аты: ${formData.name}\n📝 Рөлі: ${formData.role}\n💬 Сұрақ: ${formData.question}`;
      
      // Send to WhatsApp
      const whatsappUrl = `https://wa.me/77757906363?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      addMessage(`✅ Рақмет! Сіздің өтінішіңіз Telegram немесе WhatsApp арқылы жіберілді.\nБіз жақында сізге жауап береміз.`, "bot");
      
      setShowRequestForm(false);
      setFormData({ name: "", role: "", question: "" });
    }
  };

  const quickActions = [
    "📅 Расписание",
    "🍽 Асхана мәзірі",
    "💰 UPay жүйесі",
    "🧑‍🏫 Оқушылар мен ұстаздар",
    "🏫 Байланыс",
    "📲 Оставить заявку"
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#00bfff] dark:to-[#a855f7] rounded-full shadow-lg hover:shadow-xl dark:shadow-[#00bfff]/20 transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
        style={{
          animation: isOpen ? 'none' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
        data-testid="button-chat-toggle"
        aria-label="Чат көмекшісі"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[380px] h-[500px] max-h-[calc(100vh-120px)] bg-gray-50 dark:bg-[#181a20] shadow-2xl dark:shadow-[#00bfff]/10 rounded-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300 border border-gray-200 dark:border-gray-800" data-testid="chat-window">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#00bfff] dark:to-[#a855f7] text-white p-4 rounded-t-2xl flex items-center space-x-3">
            <div className="w-10 h-10 bg-white dark:bg-[#1a1c23] rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-600 dark:text-[#00bfff]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">FGS Көмекші</h3>
              <p className="text-xs text-blue-100 dark:text-gray-300">Виртуалды ассистент</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.sender === "user"
                      ? "bg-blue-600 dark:bg-[#00bfff] text-white dark:shadow-[#00bfff]/30 shadow-md"
                      : "bg-white dark:bg-[#1a1c23] text-gray-800 dark:text-[#e5e7eb] shadow-md dark:shadow-[#00bfff]/10"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Request Form */}
          {showRequestForm ? (
            <div className="p-4 bg-white dark:bg-[#1a1c23] border-t border-gray-200 dark:border-gray-800 space-y-3">
              <Input
                placeholder="Атыңыз"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-request-name"
                className="dark:bg-[#0f1116] dark:border-gray-700 dark:text-[#e5e7eb] dark:placeholder-gray-500"
              />
              <Input
                placeholder="Класс / Рөл (оқушы, ата-ана, ұстаз)"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                data-testid="input-request-role"
                className="dark:bg-[#0f1116] dark:border-gray-700 dark:text-[#e5e7eb] dark:placeholder-gray-500"
              />
              <Textarea
                placeholder="Сұрағыңыз немесе хабарламаңыз"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                rows={3}
                data-testid="textarea-request-question"
                className="dark:bg-[#0f1116] dark:border-gray-700 dark:text-[#e5e7eb] dark:placeholder-gray-500"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleSubmitRequest}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-[#00bfff] dark:hover:bg-[#00a0d9]"
                  data-testid="button-submit-request"
                >
                  📤 Жіберу
                </Button>
                <Button
                  onClick={() => setShowRequestForm(false)}
                  variant="outline"
                  data-testid="button-cancel-request"
                  className="dark:border-gray-700 dark:text-[#e5e7eb] dark:hover:bg-[#0f1116]"
                >
                  Болдырмау
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Quick Actions */}
              <div className="p-3 bg-white dark:bg-[#1a1c23] border-t border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action}
                      onClick={() => handleQuickAction(action)}
                      variant="outline"
                      className="text-xs h-auto py-2 hover:bg-blue-50 dark:hover:bg-[#0f1116] hover:text-blue-600 dark:hover:text-[#00bfff] hover:border-blue-300 dark:hover:border-[#00bfff] dark:border-gray-700 dark:text-[#e5e7eb]"
                      data-testid={`button-quick-${action.split(" ")[1]}`}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-3 bg-white dark:bg-[#1a1c23] border-t border-gray-200 dark:border-gray-800">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Сұрағыңызды жазыңыз..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmitQuestion()}
                    data-testid="input-chat-message"
                    className="dark:bg-[#0f1116] dark:border-gray-700 dark:text-[#e5e7eb] dark:placeholder-gray-500"
                  />
                  <Button
                    onClick={handleSubmitQuestion}
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-[#00bfff] dark:hover:bg-[#00a0d9]"
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}
