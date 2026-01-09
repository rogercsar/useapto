import React from 'react';
import { TrendingUp, Calendar, Share2, Printer, Award, Users, Target } from 'lucide-react';
import { useRecruiter } from '../../contexts/RecruiterContext';

const Reports = () => {
    const { candidates } = useRecruiter();

    // Calculate metrics
    const totalCandidates = candidates.length;
    const scores = candidates.map(c => parseInt(c.score));
    const averageScore = totalCandidates > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / totalCandidates) : 0;

    // Skills distribution
    const allSkills = candidates.flatMap(c => c.strengths || []);
    const skillCounts = allSkills.reduce((acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
    }, {});
    const sortedSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Score distribution
    const distribution = [0, 0, 0, 0]; // 0-50, 50-70, 70-90, 90-100
    scores.forEach(s => {
        if (s < 50) distribution[0]++;
        else if (s < 70) distribution[1]++;
        else if (s < 90) distribution[2]++;
        else distribution[3]++;
    });

    const maxCount = Math.max(...distribution, 1); // Avoid division by zero

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto animate-fade-in print:p-0 print:overflow-visible">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 print:mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="text-indigo-600" size={24} /> Relatórios de Performance
                    </h2>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                        <Calendar size={14} /> Últimos 30 dias
                    </p>
                </div>
                <div className="flex gap-3 print:hidden w-full md:w-auto">
                    <button className="flex-1 md:flex-none justify-center px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition">
                        <Share2 size={18} /> Compartilhar
                    </button>
                    <button className="flex-1 md:flex-none justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition font-medium">
                        <Printer size={18} /> Imprimir
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3 print:gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:border-slate-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Award size={24} />
                        </div>
                        <span className="text-sm font-bold text-amber-500">Médio</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">{averageScore}%</h3>
                    <p className="text-sm text-slate-500">Média de Match dos Candidatos</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:border-slate-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <span className="text-sm font-bold text-green-500">+{totalCandidates} novos</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">{totalCandidates}</h3>
                    <p className="text-sm text-slate-500">Total de Candidatos no Pipeline</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:border-slate-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Target size={24} />
                        </div>
                        <span className="text-sm font-bold text-slate-400">1 Vagas</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">{Math.min(Math.round((totalCandidates / 3) * 100), 100)}%</h3>
                    <p className="text-sm text-slate-500">Cobertura de Vagas (Min 3 Cands)</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:grid-cols-2 print:gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:border-slate-300">
                    <h3 className="font-bold text-slate-800 mb-6">Distribuição de Qualidade (Score)</h3>
                    <div className="flex items-end justify-between h-48 px-4 gap-4">
                        {['0-50%', '50-70%', '70-90%', '90-100%'].map((range, index) => {
                            const bgColors = ['bg-red-400', 'bg-amber-400', 'bg-indigo-500', 'bg-green-500'];
                            const count = distribution[index];
                            const height = (count / maxCount) * 150;

                            return (
                                <div key={index} className="flex flex-col items-center flex-1 group">
                                    <div className="relative w-full flex justify-center">
                                        <div
                                            className={`w-full max-w-[60px] rounded-t-lg transition-all duration-500 group-hover:opacity-80 ${bgColors[index]}`}
                                            style={{ height: `${height}px`, minHeight: '4px' }}
                                        ></div>
                                        <span className="absolute -top-6 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 mt-2 font-medium">{range}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:border-slate-300">
                    <h3 className="font-bold text-slate-800 mb-6">Habilidades Mais Demandadas</h3>
                    <div className="space-y-4">
                        {sortedSkills.map(([skill, count]) => (
                            <div key={skill}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700 capitalize">{skill}</span>
                                    <span className="text-slate-500">{count} cands</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(count / totalCandidates) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto print:border-slate-300">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Top Talentos (Geral)</h3>
                </div>
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Candidato</th>
                            <th className="px-6 py-4">Vaga</th>
                            <th className="px-6 py-4 text-center">Score</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {candidates.slice(0, 5).map(candidate => (
                            <tr key={candidate.id}>
                                <td className="px-6 py-4 font-medium text-slate-900">{candidate.name}</td>
                                <td className="px-6 py-4">{candidate.job}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${parseInt(candidate.score) > 70 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                        {candidate.score}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">Ativo</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="hidden print:block mt-8 text-center text-xs text-slate-400">
                <p>Relatório gerado automaticamente por TechSales AI System</p>
                <p>{new Date().toLocaleDateString('pt-BR')} - Documento Interno Confidencial</p>
            </div>
        </div>
    );
};

export default Reports;
