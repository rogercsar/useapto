import React, { useState } from 'react';
import { Award, Sparkles, X, User, Plus, Loader2 } from 'lucide-react';

const CandidateComparator = ({ candidates }) => {
    const [selectedIds, setSelectedIds] = useState([null, null]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleGenerateAnalysis = () => {
        const selectedCandidates = candidates.filter(c => selectedIds.includes(c.id.toString()));
        if (selectedCandidates.length < 2) {
            alert("Selecione pelo menos 2 candidatos para comparar.");
            return;
        }

        setIsAnalyzing(true);
        // Simulate AI multi-profile analysis
        setTimeout(() => {
            const bestCandidate = [...selectedCandidates].sort((a, b) => parseInt(b.score) - parseInt(a.score))[0];
            const result = {
                title: "Veredito da IA: Comparativo de Talentos",
                summary: `Após analisar os perfis lado a lado, o candidato ${bestCandidate.name} se destaca como o mais preparado para os desafios técnicos da posição, especialmente em ${bestCandidate.strengths?.slice(0, 2).join(' e ')}.`,
                ranking: selectedCandidates.sort((a, b) => parseInt(b.score) - parseInt(a.score)),
                overallInsight: "O grupo apresenta boa senioridade técnica, mas há uma carência comum em ferramentas específicas de gestão de dados entre os perfis menos experientes.",
                recommendation: `Avançar com ${bestCandidate.name} para a etapa de entrevista técnica focada em arquitetura.`
            };
            setAnalysisResult(result);
            setIsAnalyzing(false);
        }, 2000);
    };

    const handleSelectChange = (index, value) => {
        const newIds = [...selectedIds];
        newIds[index] = value;
        setSelectedIds(newIds);
    };

    const removeColumn = (index) => {
        const newIds = [...selectedIds];
        const filteredIds = selectedIds.filter((_, i) => i !== index);
        // Ensure at least 2 columns are visible if desired, or just allow removal
        if (filteredIds.length < 2) {
            setSelectedIds([...filteredIds, null]);
        } else {
            setSelectedIds(filteredIds);
        }
    };

    const addColumn = () => {
        if (selectedIds.length < 4) { // Limit to 4 for layout reasons
            setSelectedIds([...selectedIds, null]);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Award className="text-indigo-600" size={20} /> Comparativo Direto
                    </h3>
                    <p className="text-xs text-slate-500">Selecione candidatos para comparar competências e match lado a lado.</p>
                </div>
                <button
                    onClick={handleGenerateAnalysis}
                    disabled={isAnalyzing || selectedIds.filter(id => id).length < 2}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-bold hover:shadow-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    <span>{isAnalyzing ? 'Analisando...' : 'Resumo Multi-Perfil'}</span>
                </button>
            </div>

            <div className="p-6 overflow-x-auto">
                <div className="flex gap-4 min-w-max pb-4">
                    {selectedIds.map((selectedId, idx) => {
                        const candidate = candidates.find(c => c.id.toString() === selectedId?.toString());

                        return (
                            <div key={idx} className="w-[280px] flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden relative group transition-all hover:border-indigo-200">
                                <div className="p-3 bg-slate-50/50 border-b border-slate-100 relative">
                                    <button
                                        onClick={() => removeColumn(idx)}
                                        className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                    <select
                                        value={selectedId || ""}
                                        onChange={(e) => handleSelectChange(idx, e.target.value)}
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                    >
                                        <option value="" disabled>Selecionar...</option>
                                        {candidates.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.score})</option>
                                        ))}
                                    </select>
                                </div>

                                {candidate ? (
                                    <div className="p-4 flex-1 space-y-4 animate-fade-in">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm shrink-0">
                                                {candidate.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-800 text-sm truncate">{candidate.name}</div>
                                                <div className={`text-[10px] font-bold uppercase ${parseInt(candidate.score) > 70 ? 'text-green-600' : 'text-amber-600'}`}>
                                                    Match {candidate.score}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Maturidade</h4>
                                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase">
                                                    {candidate.seniority || 'Não detectado'}
                                                </span>
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Fortalezas</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {candidate.strengths?.slice(0, 3).map((s, i) => (
                                                        <span key={i} className="px-1.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[9px]">{s}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">IA Insight</h4>
                                                <p className="text-[11px] text-slate-600 leading-tight italic line-clamp-3">
                                                    "{candidate.observation || "Sem observações."}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8 text-center min-h-[180px]">
                                        <User className="mb-2 opacity-10" size={32} />
                                        <p className="text-[10px] uppercase font-bold tracking-wider">Aguardando seleção</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {selectedIds.length < 4 && (
                        <button
                            onClick={addColumn}
                            className="w-[60px] flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-slate-50 transition-all shrink-0"
                            title="Adicionar Comparativo"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>
            </div>
            {/* AI Summary Modal */}
            {analysisResult && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slide-up">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <Sparkles size={24} className="text-yellow-300" />
                                {analysisResult.title}
                            </h3>
                            <button onClick={() => setAnalysisResult(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                                <p className="text-indigo-900 leading-relaxed font-medium">
                                    {analysisResult.summary}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                        Veredito Técnico (Score)
                                    </h4>
                                    <div className="space-y-2">
                                        {analysisResult.ranking.map((cand, i) => (
                                            <div key={cand.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <span className="text-sm font-bold text-slate-700">{i + 1}. {cand.name}</span>
                                                <span className="text-sm font-black text-indigo-600">{cand.score}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                                        Ponto de Atenção
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {analysisResult.overallInsight}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex gap-4">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900">Recomendação da IA</h4>
                                    <p className="text-sm text-emerald-700">{analysisResult.recommendation}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setAnalysisResult(null)}
                                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateComparator;
