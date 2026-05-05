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
      const res = await axios.post('http://localhost:5000/api/ia/chat', { messages: nouveauxMessages });
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition flex items-center justify-center z-50">
        {ouvert ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {ouvert && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col" style={{ height: '500px' }}>
          <div className="bg-green-600 text-white px-4 py-3 rounded-t-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <p className="font-semibold text-sm">Assistant e-Mairie</p>
              <p className="text-green-200 text-xs">En ligne</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'user' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chargement && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(delay => (
                      <span key={delay} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {questionsRapides.map((q) => (
                <button key={q} onClick={() => setInput(q)}
                  className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100 transition">
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && envoyerMessage()}
              placeholder="Posez votre question..."
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <button onClick={envoyerMessage} disabled={chargement || !input.trim()}
              className="bg-green-600 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-green-700 disabled:opacity-40 transition">
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
