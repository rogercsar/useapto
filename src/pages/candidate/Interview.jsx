import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Mic, Play, Monitor, User, Bot, AlertCircle } from 'lucide-react';
import { useRecruiter } from '../../contexts/RecruiterContext';

const Interview = () => {
    const { candidateId } = useParams();
    // In a real app we'd fetch candidate, but for simulation we might mock or use context if it was a candidate facing app. 
    // Assuming this runs on the same domain for demo purposes.
    const { candidates, updateCandidate } = useRecruiter();

    // Find candidate - or mock if not found (since this might be visited by "candidate" without context)
    // For this demo, let's assume we are simulating it from the same browser session or we just use local state if not found.
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [step, setStep] = useState(0);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        const candidate = candidates?.find(c => c.id.toString() === candidateId || c.id === Number(candidateId));
        if (candidate) {
            const name = candidate.name.split(' ')[0];
            const job = candidate.job;
            const strengths = candidate.strengths?.length > 0 ? candidate.strengths.join(' e ') : 'sua proatividade';
            const gaps = candidate.gaps?.length > 0 ? candidate.gaps.join(' e ') : 'novos desafios';

            const dynamicQuestions = [
                `Olá ${name}! Sou a IA da Apto. Vamos começar sua entrevista para a vaga de ${job}. Primeiro, poderia me contar um pouco sobre sua trajetória profissional até aqui?`,
                `Interessante. Pensando especificamente na vaga de ${job}, qual foi o projeto ou responsabilidade mais relevante que você já assumiu?`,
                `Para esta posição, o domínio de certas ferramentas e processos é crucial. Como você se sente trabalhando com as principais demandas de um ${job}?`,
                `Notei em seu perfil que você se destaca em ${strengths}. Pode me dar um exemplo real de como aplicou essas habilidades para gerar um resultado positivo?`,
                `Ao analisarmos os requisitos, identificamos que ${gaps} podem ser áreas de desenvolvimento para você. Como você pretende superar esses desafios técnicos?`,
                `O que mais te atrai na nossa cultura e nessa oportunidade específica de ${job}?`,
                `Em um ambiente dinâmico, as prioridades podem mudar rapidamente. Pode me contar uma situação onde você teve que lidar com uma mudança brusca de última hora?`,
                `Excelente. Para encerrarmos, qual a sua expectativa de aprendizado e contribuição nos seus primeiros meses aqui conosco?`,
                `Perfeito, ${name}. Obrigado por compartilhar tanto conosco. Vou processar suas respostas e gerar o relatório para o recrutador agora.`
            ];
            setQuestions(dynamicQuestions);
        } else {
            setQuestions([
                "Olá! Sou a IA da Apto. Vamos começar sua entrevista. Primeiro, poderia me contar um pouco sobre sua última experiência profissional?",
                "Interessante. E qual foi o maior desafio que você enfrentou nessa função e como resolveu?",
                "Para esta vaga, buscamos alguém com fortes habilidades de comunicação. Como você avaliaria essas suas competências?",
                "Pode me falar sobre seus principais pontos fortes e como eles agregam valor?",
                "E sobre pontos a desenvolver, no que você está focando atualmente?",
                "O que te motiva a buscar essa nova oportunidade conosco?",
                "Como você lida com situações de alta pressão ou prazos curtos?",
                "Quais são seus planos de carreira para os próximos anos?",
                "Perfeito. Obrigado por suas respostas. Vou gerar seu relatório de perfil agora."
            ]);
        }
    }, [candidates, candidateId]);

    useEffect(() => {
        if (!hasStarted.current && questions.length > 0 && messages.length === 0) {
            hasStarted.current = true;
            simulateAIResponse(questions[0]);
            setStep(1);
        }
    }, [questions, messages.length]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (questions.length > 0 && step === questions.length) {
            finishInterview();
        }
    }, [step, questions]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const simulateAIResponse = (text) => {
        setIsThinking(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'ai', text }]);
            setIsThinking(false);
        }, 1500);
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        // User message
        const userMsg = { sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Move to next step
        if (step < questions.length) {
            simulateAIResponse(questions[step]);
            setStep(prev => prev + 1);
        }
    };

    const calculateInterviewResult = (transcription, jobRole) => {
        let totalScore = 0;
        // Base score for simply completing the interview
        totalScore = 20;

        const candidateMessages = transcription.filter(m => m.sender === 'user');
        const totalAnswers = candidateMessages.length;

        if (totalAnswers === 0) return { score: 0, summary: "Candidato não respondeu às perguntas." };

        // Generic positive keywords
        const BASE_KEYWORDS = [
            'experiência', 'trabalhei', 'desafio', 'resolvi', 'equipe', 'projeto', 'resultado',
            'ferramenta', 'evoluir', 'aprendi', 'liderei', 'colaborei', 'organização', 'prazo',
            'meta', 'cliente', 'processo', 'melhoria', 'sistema', 'técnica', 'habilidade',
            'comunicação', 'gestão', 'análise', 'desenvolvimento', 'suporte', 'atendimento'
        ];

        // Role-specific keywords
        const ROLE_KEYWORDS_MAP = {
            'rh': ['triagem', 'entrevista', 'seleção', 'candidato', 'processo seletivo', 'vaga', 'cultura', 'comportamental', 'feedback'],
            'tech': ['código', 'desenvolvimento', 'react', 'javascript', 'api', 'banco de dados', 'deploy', 'git', 'agile', 'scrum'],
            'dev': ['código', 'desenvolvimento', 'react', 'javascript', 'api', 'banco de dados', 'deploy', 'git', 'agile', 'scrum'],
            'vendas': ['meta', 'prospecção', 'fechamento', 'negociação', 'funil', 'crm', 'cliente', 'venda', 'resultado'],
            'comercial': ['meta', 'prospecção', 'fechamento', 'negociação', 'funil', 'crm', 'cliente', 'venda', 'resultado'],
            'administrativo': ['organização', 'planilha', 'excel', 'financeiro', 'relatório', 'processo', 'agenda', 'gestão']
        };

        // Determine applicable specific keywords
        let specificKeywords = [];
        if (jobRole) {
            const roleLower = jobRole.toLowerCase();
            for (const [key, words] of Object.entries(ROLE_KEYWORDS_MAP)) {
                if (roleLower.includes(key)) {
                    specificKeywords = [...specificKeywords, ...words];
                }
            }
        }

        let wordCountScore = 0;
        let keywordScore = 0;
        let compatibilityScore = 0;

        candidateMessages.forEach(msg => {
            const textLower = msg.text.toLowerCase();
            const words = msg.text.trim().split(/\s+/);

            // 1. Length Score
            if (words.length > 20) wordCountScore += 15;
            else if (words.length > 10) wordCountScore += 8;
            else if (words.length > 3) wordCountScore += 2;
            else wordCountScore -= 5;

            // 2. Base Keyword Score
            const foundBase = BASE_KEYWORDS.filter(k => textLower.includes(k));
            keywordScore += foundBase.length * 2;

            // 3. Compatibility Score (Specific Role Keywords)
            if (specificKeywords.length > 0) {
                const foundSpecific = specificKeywords.filter(k => textLower.includes(k));
                compatibilityScore += foundSpecific.length * 5; // Higher weight for role-specific
            } else {
                // If no specific role map found, generic keywords count double for compatibility proxy
                keywordScore += foundBase.length * 1;
            }
        });

        totalScore += wordCountScore + keywordScore + compatibilityScore;

        // Cap at 98, Min at 30
        if (totalScore > 98) totalScore = 98;
        if (totalScore < 30) totalScore = 30;

        // Generate Summary based on Compatibility
        const roleLabel = jobRole ? `para a vaga de ${jobRole}` : "para a vaga";
        let summary = "";

        if (totalScore <= 45) {
            summary = `O candidato apresenta baixa compatibilidade ${roleLabel}. As respostas foram superficiais e não demonstraram domínio dos conceitos-chave ou experiência relevante esperada.`;
        } else if (totalScore <= 65) {
            summary = `O candidato apresenta compatibilidade média ${roleLabel}. Embora tenha respondido às questões, faltou aprofundamento técnico e uso de terminologia específica da área.`;
        } else if (totalScore <= 85) {
            summary = `O candidato apresenta boa compatibilidade ${roleLabel}. Demonstrou conhecimento sólido e experiência alinhada, utilizando vocabulário adequado. Poderia detalhar mais alguns resultados práticos.`;
        } else {
            summary = `O candidato apresenta alta compatibilidade ${roleLabel}! Demonstrou excelente domínio técnico, citou experiências extremamente relevantes e utilizou terminologia específica da área com propriedade.`;
        }

        return { score: totalScore, summary };
    };

    const finishInterview = async () => {
        // Fetch candidate to get job role
        const candidate = candidates?.find(c => c.id.toString() === candidateId || c.id === Number(candidateId));
        const jobRole = candidate ? candidate.job : "";

        const { score, summary } = calculateInterviewResult(messages, jobRole);

        const interviewData = {
            status: 'completed',
            score: score,
            summary: summary,
            transcription: messages,
            date: new Date().toISOString()
        };

        if (candidate) {
            await updateCandidate(candidate.id, {
                interview: interviewData,
                status: 'interview_completed'
            });
        } else {
            console.warn("Candidate not found in context for update, or running in standalone mode.");
        }
    };

    const handleClose = () => {
        window.location.href = '/';
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh]">
                {/* Header */}
                <div className="bg-indigo-600 p-6 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                            <Monitor size={24} />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Entrevista Inteligente</h1>
                            <p className="text-indigo-200 text-xs">Apto AI Interviewer</p>
                        </div>
                    </div>
                    {questions.length > 0 && step >= questions.length && (
                        <span className="bg-green-400 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full">
                            Concluída
                        </span>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[80%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[80%] gap-3 flex-row">
                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-100">
                    {questions.length > 0 && step < questions.length ? (
                        <div className="flex gap-2 relative">
                            <input
                                type="text"
                                className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Digite sua resposta..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isThinking}
                            />
                            <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                                <Mic size={20} />
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!inputText.trim() || isThinking}
                                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center p-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Entrevista Finalizada!</h3>
                            <p className="text-slate-500 text-sm mb-4">Suas respostas foram enviadas para análise. O recrutador entrará em contato em breve.</p>
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 transition"
                            >
                                Fechar Janela
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Interview;
