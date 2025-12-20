
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Trash2, Zap } from 'lucide-react';
import { askBot } from '../services/geminiService';
import { getTools } from '../tools-config';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface BotUsage {
    date: string;
    count: number;
}

const DAILY_LIMIT = 5;

const getInitialBotMessage = (language: 'fr' | 'en'): Message => ({
  role: 'bot',
  content:
    language === 'fr'
      ? "Salut ! Je suis **SimpleBot**. Je connais les 50+ outils du site. Tu cherches quoi ? (ex: *'Un truc pour Instagram'* ou *'Aide moi à coder'*)"
      : "Hi! I'm **SimpleBot**. I know all the tools on the site. What are you looking for? (e.g. *'something for Instagram'* or *'help me code'*)",
});

export const SimpleBot: React.FC = () => {
  const { language } = useTranslation();
  const tools = React.useMemo(() => getTools(language), [language]);
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialisation de l'état avec le localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [getInitialBotMessage(language)];
    const saved = window.localStorage.getItem(`simplebot_history_${language}`);
    return saved ? JSON.parse(saved) : [getInitialBotMessage(language)];
  });

  // Gestion du quota (INDÉPENDANT de l'état utilisateur - utilise uniquement localStorage)
  // La limite de 5 messages/jour est appliquée à tous les utilisateurs, connectés ou non
  const [usage, setUsage] = useState<BotUsage>(() => {
      if (typeof window === 'undefined') return { date: new Date().toDateString(), count: 0 };
      const savedUsage = window.localStorage.getItem(`simplebot_usage_${language}`);
      const today = new Date().toDateString();
      if (savedUsage) {
          const parsed = JSON.parse(savedUsage);
          if (parsed.date === today) return parsed;
      }
      return { date: today, count: 0 };
  });

  // Reload per-language history/quota when language changes
  useEffect(() => {
    const saved = window.localStorage.getItem(`simplebot_history_${language}`);
    setMessages(saved ? JSON.parse(saved) : [getInitialBotMessage(language)]);

    const savedUsage = window.localStorage.getItem(`simplebot_usage_${language}`);
    const today = new Date().toDateString();
    if (savedUsage) {
      const parsed = JSON.parse(savedUsage);
      setUsage(parsed.date === today ? parsed : { date: today, count: 0 });
    } else {
      setUsage({ date: today, count: 0 });
    }
  }, [language]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Vérification de la date au montage et après chaque refresh
  useEffect(() => {
    const today = new Date().toDateString();
    if (usage.date !== today) {
      setUsage({ date: today, count: 0 });
    }
  }, []); // Exécuté une seule fois au montage

  // Sauvegarde automatique
  useEffect(() => {
    window.localStorage.setItem(`simplebot_history_${language}`, JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isOpen, language]);

  useEffect(() => {
      window.localStorage.setItem(`simplebot_usage_${language}`, JSON.stringify(usage));
  }, [usage, language]);

  // Fonction pour vider la mémoire
  const clearHistory = () => {
    const initialMsg: Message[] = [
      {
        role: 'bot',
        content:
          language === 'fr'
            ? 'Mémoire effacée ! On repart à zéro. Que puis-je faire ?'
            : 'Memory cleared! Starting fresh—how can I help?',
      },
    ];
    setMessages(initialMsg);
    window.localStorage.setItem(`simplebot_history_${language}`, JSON.stringify(initialMsg));
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    // Vérification Quota
    const today = new Date().toDateString();
    if (usage.date !== today) {
        setUsage({ date: today, count: 0 });
    } else if (usage.count >= DAILY_LIMIT) {
        setMessages(prev => [...prev, 
            { role: 'user', content: input },
            {
              role: 'bot',
              content:
                language === 'fr'
                  ? "🚫 **Quota journalier atteint.** \n\nJe suis un petit robot coûteux ! Revenez demain pour discuter ou utilisez directement les outils."
                  : "🚫 **Daily limit reached.** \n\nI'm a tiny (and expensive) robot. Come back tomorrow or use the tools directly.",
            }
        ]);
        setInput('');
        return;
    }

    const userMsg = input;
    setInput('');
    
    // Ajout immédiat du message utilisateur
    const newHistory = [...messages, { role: 'user', content: userMsg } as Message];
    setMessages(newHistory);
    setLoading(true);
    
    // Incrément du quota
    setUsage(prev => ({ ...prev, count: prev.count + 1 }));

    try {
      // On prépare le contexte avec la liste des outils
      const toolsContext = tools
        .map((t) => `- ${t.title} (ID: ${t.id}, Category: ${t.category}): ${t.description}`)
        .join('\n');
      
      // On récupère les 5 derniers échanges pour donner du contexte à l'IA (Mémoire court terme)
      const recentHistory = newHistory.slice(-6).map(m => 
        `${m.role === 'user' ? 'UTILISATEUR' : 'SIMPLEBOT'}: ${m.content.replace(/\n/g, ' ')}`
      ).join('\n');

      const systemPrompt =
        language === 'fr'
          ? `
CONTEXTE : Tu es SimpleBot, l'assistant virtuel intelligent du site "SimplePlate".
TA MISSION : Aider l'utilisateur à trouver l'outil parfait parmi la liste ci-dessous ou répondre à ses questions sur le fonctionnement du site.

LISTE DES OUTILS DISPONIBLES :
${toolsContext}

CONSIGNES :
1. Sois bref, serviable et un peu "geek/cool".
2. Tu as une mémoire : base-toi sur l'HISTORIQUE DE CONVERSATION ci-dessous pour répondre de manière cohérente.
3. Si tu recommandes un outil, tu DOIS utiliser ce format exact pour créer un lien interne : [Nom de l'outil](/tool/ID_DE_L_OUTIL).
4. Réponds en Français.

---
HISTORIQUE DE CONVERSATION :
${recentHistory}
---

NOUVELLE QUESTION UTILISATEUR : "${userMsg}"
RÉPONSE DE SIMPLEBOT :
`
          : `
CONTEXT: You are SimpleBot, the smart virtual assistant for the "SimplePlate" website.
MISSION: Help the user find the best tool from the list below or answer questions about how the site works.

AVAILABLE TOOLS:
${toolsContext}

RULES:
1. Be brief, helpful, and a bit geek/cool.
2. You have memory: use the CONVERSATION HISTORY below to answer consistently.
3. If you recommend a tool, you MUST use this exact format for an internal link: [Tool Name](/tool/TOOL_ID).
4. Respond in English.

---
CONVERSATION HISTORY:
${recentHistory}
---

NEW USER QUESTION: "${userMsg}"
SIMPLEBOT ANSWER:
`;

      const response = await askBot(systemPrompt);
      
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content:
            language === 'fr' ? 'Oups, mes circuits ont surchauffé. Réessaie plus tard !' : 'Oops, my circuits overheated. Try again later!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="mb-4 w-[90vw] md:w-80 h-96 bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200">
          {/* Header */}
          <div className="bg-neo-black dark:bg-white text-white dark:text-black p-3 flex justify-between items-center border-b-2 border-black dark:border-gray-300">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neo-green rounded-full animate-pulse"></div>
                    <span className="font-bold font-display tracking-wide text-sm">SimpleBot</span>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                    {language === 'fr'
                      ? `${DAILY_LIMIT - usage.count} msg${DAILY_LIMIT - usage.count > 1 ? 's' : ''} restant${DAILY_LIMIT - usage.count > 1 ? 's' : ''}`
                      : `${DAILY_LIMIT - usage.count} msg${DAILY_LIMIT - usage.count > 1 ? 's' : ''} left`}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button
                  onClick={clearHistory}
                  title={language === 'fr' ? 'Effacer la mémoire' : 'Clear memory'}
                  className="hover:text-neo-red transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:text-neo-yellow dark:hover:text-neo-violet transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-600">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[85%] p-3 text-sm rounded-md border border-black dark:border-gray-500
                  ${msg.role === 'user' 
                    ? 'bg-white text-black rounded-br-none' 
                    : 'bg-neo-yellow text-black rounded-bl-none'}
                `}>
                  {msg.role === 'bot' ? (
                     <div className="prose prose-sm prose-p:my-0 prose-a:text-purple-900 prose-a:font-extrabold prose-a:underline prose-a:decoration-2 break-words">
                        <ReactMarkdown 
                            components={{
                                a: ({node, href, children, ...props}) => {
                                    if (!href) {
                                        return <span {...props}>{children}</span>;
                                    }
                                    const isInternal = href.startsWith('/') || href.startsWith('#');
                                    if (isInternal) {
                                        return (
                                            <Link to={href} {...props} onClick={() => setIsOpen(false)}>
                                                {children}
                                            </Link>
                                        );
                                    }
                                    return (
                                        <a href={href} target="_blank" rel="noreferrer" {...props}>
                                            {children}
                                        </a>
                                    );
                                }
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                     </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md rounded-bl-none border border-black dark:border-gray-500 flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
                   <span className="text-xs font-bold dark:text-white">
                    {language === 'fr' ? 'SimpleBot réfléchit...' : 'SimpleBot is thinking...'}
                   </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-2 border-t-2 border-black dark:border-white bg-white dark:bg-gray-600 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                usage.count >= DAILY_LIMIT
                  ? language === 'fr'
                    ? 'Quota épuisé'
                    : 'Limit reached'
                  : language === 'fr'
                    ? 'Posez votre question...'
                    : 'Ask your question...'
              }
              disabled={usage.count >= DAILY_LIMIT}
              className="flex-1 p-2 text-base border border-gray-300 dark:border-white rounded focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-500 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-400 disabled:cursor-not-allowed"
              autoFocus
              style={{ fontSize: '16px' }} // Prevents iOS zoom
            />
            <button 
              type="submit"
              disabled={loading || !input.trim() || usage.count >= DAILY_LIMIT}
              className="p-2 bg-neo-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 bg-neo-black dark:bg-white text-white dark:text-black rounded-full border-2 border-black dark:border-white flex items-center justify-center hover:-translate-y-1 transition-all"
        >
          <Bot className="w-7 h-7 group-hover:text-neo-yellow dark:group-hover:text-neo-violet transition-colors" />
          
          {/* Notification Badge (Fake) */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-neo-red border border-black rounded-full animate-bounce"></span>
        </button>
      )}
    </div>
  );
};
