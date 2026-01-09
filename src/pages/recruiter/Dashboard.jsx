import React from 'react';
import { Briefcase, Users, MessageSquare, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
                <p className="text-slate-500">Acompanhe seus principais indicadores de recrutamento.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-indigo-500">
                            <Briefcase className="text-white" size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            <TrendingUp size={12} /> +2 essa semana
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-800 mb-1">1</div>
                    <div className="text-sm font-medium text-slate-500">Vagas Ativas</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-rose-500">
                            <Users className="text-white" size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            <TrendingUp size={12} /> +12 novos
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-800 mb-1">1</div>
                    <div className="text-sm font-medium text-slate-500">Total de Candidatos</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-amber-500">
                            <MessageSquare className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-800 mb-1">0</div>
                    <div className="text-sm font-medium text-slate-500">Entrevistas Potenciais</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-emerald-500">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            <TrendingUp size={12} /> +5% vs mês anterior
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-800 mb-1">9%</div>
                    <div className="text-sm font-medium text-slate-500">Score Médio</div>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Candidatos por Vaga</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">Auxiliar de RH</span>
                                <span className="font-bold text-slate-900">1</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Vagas Recentes</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer">
                                <div className="p-2 bg-white rounded-lg border border-slate-200 text-indigo-600">
                                    <Briefcase size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-sm text-slate-800 truncate">Auxiliar de RH</div>
                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock size={10} /> 06/01/2026
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/recruiter/vagas" className="w-full mt-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition flex items-center justify-center gap-2">
                            Ver Todas <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
