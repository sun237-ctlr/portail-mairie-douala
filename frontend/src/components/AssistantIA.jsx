import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export default function AssistantIA() {
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis l\'assistant de la e-Mairie Douala. Comment puis-je vous aider ?' }
  ]);
  const [input, setInput] = useState('');
  const [chargement, setChargement] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const envoyerMessage = async () => {
    if (!input.trim() || chargement) return;
    const nouveauMessage = { role: 'user', content: input };
    const nouveauxMessages = [...messages, nouveauMessage];
    setMessages(nouveauxMessages);
    setInput('');
    setChargement(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await axios.post(`${apiBase}/api/ia/chat`, { messages: nouveauxMessages });
      setMessages([...nouveauxMessages, { role: 'assistant', content: res.data.message }]);
    } catch {
      setMessages([...nouveauxMessages, { role: 'assistant', content: 'Désolé, une erreur est survenue.' }]);
    } finally {
      setChargement(false);
    }
  };

  const questionsRapides = [
    'Documents pour acte de naissance ?',
    'Comment faire une demande ?',
    'Délai de traitement ?',
  ];

  return (
    <>
      <button onClick={() => setOuvert(!ouvert)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-2xl hover:bg-green-700 transition flex items-center justify-center z-50">
        {ouvert ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {ouvert && (
        <div className="fixed bottom-24 right-6 w-[calc(100vw-32px)] max-w-[26rem] md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          style={{ height: '520px' }}>

          <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white px-4 py-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm tracking-wide">Assistant e-Mairie</p>
              <p className="text-2xs text-green-200">Besoin d'aide ? Posez votre question.</p>
            </div>
            <button onClick={() => setOuvert(false)} className="text-white/90 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%]">
                  <div className={`flex items-center gap-2 mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${msg.role === 'user' ? 'justify-end text-emerald-600' : 'justify-start text-slate-500'}`}>
                    {msg.role === 'user' ? 'Vous' : 'Assistant'}
                  </div>
                  <div className={`rounded-[28px] px-4 py-3 text-sm leading-6 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-[8px] rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px]'
                      : 'bg-white text-slate-900 rounded-bl-[8px] rounded-tr-[20px] rounded-tl-[20px] rounded-br-[20px] border border-slate-200'
                  }`}>
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {chargement && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-3xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2">
                    {[0, 120, 240].map(delay => (
                      <span key={delay} className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 pb-3 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {questionsRapides.map((q) => (
                <button key={q} onClick={() => setInput(q)}
                  className="text-xs text-slate-700 bg-slate-100 border border-slate-200 px-3 py-2 rounded-2xl text-left hover:bg-slate-200 transition">
                  {q}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && envoyerMessage()}
                placeholder="Posez votre question..."
                className="flex-1 min-w-0 border border-slate-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <button onClick={envoyerMessage} disabled={chargement || !input.trim()}
                className="w-11 h-11 bg-green-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 disabled:opacity-40 transition">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
