import React from 'react';
import { Award, Sparkles, X, User, Plus } from 'lucide-react';

const Compare = () => {
    return (
        <div className="p-8 h-full flex flex-col animate-fade-in">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Award className="text-indigo-600" size={24} /> Comparador de Candidatos
                    </h2>
                    <p className="text-slate-500 text-sm">Analise perfis lado a lado para tomar a melhor decisão.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    <Sparkles className="text-yellow-300" size={20} />
                    <span>Gerar Análise IA</span>
                </button>
            </div>
            <div className="flex-1 overflow-x-auto pb-6">
                <div className="flex gap-6 min-w-max h-full">
                    <div className="w-[350px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group transition-all hover:shadow-md">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 relative">
                            <button className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100" title="Remover Coluna">
                                <X size={16} />
                            </button>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Selecionar Candidato</label>
                                <select className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="" disabled selected>Escolher da lista...</option>
                                    <option value="1">Roger Santos - 9%</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8 text-center border-t border-slate-50 border-dashed">
                            <User className="mb-4 opacity-20" size={48} />
                            <p className="text-sm">Selecione um candidato acima para visualizar os dados.</p>
                        </div>
                    </div>
                    <div className="w-[350px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group transition-all hover:shadow-md">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 relative">
                            <button className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100" title="Remover Coluna">
                                <X size={16} />
                            </button>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Selecionar Candidato</label>
                                <select className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="" disabled selected>Escolher da lista...</option>
                                    <option value="1">Roger Santos - 9%</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8 text-center border-t border-slate-50 border-dashed">
                            <User className="mb-4 opacity-20" size={48} />
                            <p className="text-sm">Selecione um candidato acima para visualizar os dados.</p>
                        </div>
                    </div>
                    <button className="w-[100px] flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition">
                            <Plus size={24} />
                        </div>
                        <span className="font-bold text-sm">Adicionar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Compare;
