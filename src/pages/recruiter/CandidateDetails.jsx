import React from 'react';
import { ArrowLeft, Mail, MessageSquare, Sparkles, Briefcase, ChartNoAxesColumn, X, Save, Share2, Printer, TrendingUp, Target, Info } from 'lucide-react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

import { useRecruiter } from '../../contexts/RecruiterContext';

const CandidateDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { candidates, jobs, recruiterProfile } = useRecruiter();

    // Use candidate from Context as primary source (for updates), fall back to location state or default
    // We try to find by ID first
    const contextCandidate = candidates.find(c => c.id?.toString() === id || c.id === Number(id));

    // Fallback data if no state is passed
    const defaultCandidate = {
        name: 'Candidato não encontrado',
        job: '-',
        email: '-',
        phone: '-',
        score: 0,
        strengths: [],
        gaps: [],
        cvText: 'Nenhum dado disponível.'
    };

    const candidate = contextCandidate || location.state?.candidate || defaultCandidate;

    const handleShareEmail = () => {
        const subject = `Relatório de Candidato: ${candidate.name} - ${candidate.job}`;
        const body = `Olá,\n\nSegue o relatório detalhado do candidato ${candidate.name} para a vaga de ${candidate.job}.\n\nScore de Compatibilidade: ${candidate.score}\n\nEnviado por: ${recruiterProfile.name} via UseApto.`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleShareWhatsApp = () => {
        const message = `*Relatório de Candidato*\n\n*Nome:* ${candidate.name}\n*Vaga:* ${candidate.job}\n*Score:* ${candidate.score}\n\nVisualizado via UseApto.`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handlePrint = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(79, 70, 229);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text("Relatório de Candidato - UseApto", 20, 20);

        // Content
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.text(candidate.name, 20, 50);
        doc.setFontSize(12);
        doc.text(`Vaga: ${candidate.job}`, 20, 60);
        doc.text(`Score: ${candidate.score}`, 20, 70);
        doc.text(`Email: ${candidate.email}`, 20, 80);

        doc.text("Pontos Fortes:", 20, 100);
        candidate.strengths?.slice(0, 5).forEach((s, i) => {
            doc.text(`- ${s}`, 25, 110 + (i * 7));
        });

        doc.save(`${candidate.name.replace(/\s+/g, '_')}_Relatorio.pdf`);
    };

    return (
        <div className="flex-1 overflow-x-hidden">
            <div className="p-8 max-w-7xl mx-auto animate-fade-in relative">
                <div className="animate-fade-in max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 font-medium w-fit transition-colors"
                        >
                            <ArrowLeft size={18} /> Voltar
                        </button>

                        <div className="flex gap-2">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                                title="Gerar PDF"
                            >
                                <Printer size={18} /> <span>PDF</span>
                            </button>
                            <button
                                onClick={handleShareWhatsApp}
                                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-xl text-sm font-bold hover:bg-green-100 transition-all shadow-sm"
                            >
                                <MessageSquare size={18} /> <span>WhatsApp</span>
                            </button>
                            <button
                                onClick={handleShareEmail}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm"
                            >
                                <Share2 size={18} /> <span>Compartilhar</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                        <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 mb-2">{candidate.name}</h2>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Mail size={16} /> {candidate.email}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare size={16} /> {candidate.phone}
                                    </span>
                                    {candidate.seniority && (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${candidate.seniority === 'senior' || candidate.seniority === 'gestao' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                                            }`}>
                                            Nível Detected: {candidate.seniority}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-5xl font-black tracking-tight ${candidate.score > 70 ? 'text-green-500' : candidate.score > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                                    {candidate.score}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Compatibilidade</div>
                            </div>
                        </div>

                        {/* Enhanced Insights Section */}
                        {(candidate.observation || candidate.suggestedRole) && (
                            <div className="px-8 py-6 bg-indigo-600 text-white flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-indigo-200 flex items-center gap-2">
                                        <Target size={14} /> Enquadramento de Perfil
                                    </h3>
                                    <p className="text-lg font-medium leading-relaxed">
                                        "{candidate.observation || `O perfil demonstra competências para o nível ${candidate.seniority}.`}"
                                    </p>
                                </div>
                                {candidate.suggestedRole && candidate.suggestedRole.toLowerCase() !== candidate.job.toLowerCase() && (
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-w-[240px]">
                                        <div className="text-[10px] font-bold text-indigo-200 uppercase mb-2">Recomendamos para:</div>
                                        <div className="text-xl font-black">{candidate.suggestedRole}</div>
                                        <div className="text-[10px] text-indigo-300 mt-2 italic">*Baseado na maturidade técnica detectada</div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="p-8 grid md:grid-cols-2 gap-10">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Sparkles className="text-indigo-500" size={18} /> Análise de Competências
                                </h3>
                                <div className="mb-6">
                                    <div className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Pontos Fortes</div>
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.strengths && candidate.strengths.length > 0 ? (
                                            candidate.strengths.map((strength, index) => (
                                                <span key={index} className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 text-xs font-bold rounded-md uppercase">
                                                    {strength}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-400 italic">Nenhum ponto forte identificado automaticamente.</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Lacunas Identificadas</div>
                                    <div className="space-y-3">
                                        {candidate.gaps && candidate.gaps.length > 0 ? (
                                            candidate.gaps.map((gap, index) => (
                                                <div key={index} className="text-sm bg-red-50 p-2 rounded-lg border border-red-100">
                                                    <span className="font-bold text-red-500 uppercase text-xs block mb-1">{gap}</span>
                                                    <span className="text-slate-600 leading-relaxed">Não encontrado no currículo.</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-400 italic">Nenhuma lacuna crítica identificada.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Briefcase className="text-indigo-500" size={18} /> Vaga Relacionada
                                </h3>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6 text-left">
                                    <div className="text-sm font-bold text-slate-900 mb-1">{candidate.job}</div>
                                    <div className="text-xs text-slate-500 line-clamp-4 leading-relaxed">
                                        {jobs.find(j => j.title === candidate.job)?.description || "Descrição da vaga não disponível."}
                                    </div>
                                </div>

                                {candidate.recommendations && (
                                    <div className="mt-8">
                                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <TrendingUp className="text-emerald-500" size={18} /> Insights e Recomendações
                                        </h3>
                                        <div className="space-y-3">
                                            {candidate.recommendations.map((rec, idx) => (
                                                <div key={idx} className="flex gap-3 text-sm p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                                                    <Info size={18} className="shrink-0 mt-0.5 text-emerald-500" />
                                                    <p>{rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Interview Report Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <MessageSquare size={18} /> Relatório de Entrevista com IA
                            </span>
                            {candidate.interview?.status === 'completed' && (
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${candidate.interview.score > 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    Score: {candidate.interview.score}/100
                                </span>
                            )}
                        </div>
                        <div className="p-8">
                            {!candidate.interview || candidate.interview.status === 'pending' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <Sparkles size={24} />
                                    </div>
                                    <h3 className="text-slate-800 font-bold mb-2">Entrevista não realizada</h3>
                                    <p className="text-slate-500 text-sm mb-4">O candidato ainda não completou a simulação de entrevista.</p>
                                    <Link to="/recruiter/candidatos" className="text-indigo-600 font-bold text-sm hover:underline">
                                        Enviar Link Agora
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                                        <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                            <Sparkles size={16} /> Resumo do Recrutador IA
                                        </h4>
                                        <p className="text-indigo-800 text-sm leading-relaxed">
                                            {candidate.interview.summary || "Resumo não disponível."}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Transcrição Completa</h4>
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                            {candidate.interview.transcription?.map((msg, idx) => (
                                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${msg.sender === 'user'
                                                        ? 'bg-slate-100 text-slate-700 rounded-tr-none'
                                                        : 'bg-white border border-slate-200 text-slate-600 rounded-tl-none shadow-sm'
                                                        }`}>
                                                        <div className="text-xs font-bold mb-1 opacity-50 uppercase">
                                                            {msg.sender === 'user' ? candidate.name : 'Recrutador IA'}
                                                        </div>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2">
                            <ChartNoAxesColumn size={18} /> Currículo Original
                        </div>
                        <div className="p-0">
                            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-600 p-8 max-h-[500px] overflow-y-auto leading-relaxed">
                                {candidate.cvText}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetails;
