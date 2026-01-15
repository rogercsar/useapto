import React from 'react';
import { ArrowLeft, Mail, MessageSquare, Sparkles, Briefcase, ChartNoAxesColumn, X, Save, Share2, Printer } from 'lucide-react';
import { Link, useParams, useLocation } from 'react-router-dom';

import { useRecruiter } from '../../contexts/RecruiterContext';

const CandidateDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const { candidates } = useRecruiter();

    // Use candidate from Context as primary source (for updates), fall back to location state or default
    // We try to find by ID first
    const contextCandidate = candidates.find(c => c.id?.toString() === id || c.id === Number(id));

    // Fallback data if no state is passed
    const defaultCandidate = {
        name: 'Roger Santos',
        job: 'Auxiliar de RH',
        email: 'rogercsar@outlook.com',
        phone: '65992693812',
        score: 9,
        strengths: ['Comunicação', 'Proatividade'],
        gaps: ['Inglês Avançado', 'Power BI'],
        cvText: 'RESUMO PROFISSIONAL\nProfissional com 5 anos de experiência em RH, focado em R&S e DP. \n\nEXPERIÊNCIA\n- Auxiliar de RH | Empresa X (2020-Atual)\n- Assistente Administrativo | Empresa Y (2018-2020)\n\nFORMAÇÃO\n- Gestão de Recursos Humanos | UNIC (2019)'
    };

    const candidate = contextCandidate || location.state?.candidate || defaultCandidate;

    return (
        <div className="flex-1 overflow-x-hidden">
            <div className="p-8 max-w-7xl mx-auto animate-fade-in relative">
                <div className="animate-fade-in max-w-4xl mx-auto">
                    <Link to="/recruiter/vagas/1" className="text-slate-500 mb-6 hover:text-indigo-600 flex items-center gap-2 font-medium w-fit transition-colors">
                        <ArrowLeft size={18} /> Voltar para Vaga
                    </Link>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                        <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 mb-2">{candidate.name}</h2>
                                <div className="flex gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Mail size={16} /> {candidate.email}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare size={16} /> {candidate.phone}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-5xl font-black tracking-tight ${candidate.score > 70 ? 'text-green-500' : candidate.score > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                                    {candidate.score}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Compatibilidade</div>
                            </div>
                        </div>
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
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
                                    <div className="text-sm font-bold text-slate-900 mb-1">Auxiliar de RH</div>
                                    <div className="text-xs text-slate-500 line-clamp-4 leading-relaxed">
                                        Apoiar no processo de recrutamento e seleção para diferentes áreas do shopping...
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-xs text-center text-slate-400">Use os botões de ação na lista para editar ou remover.</p>
                                </div>
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
