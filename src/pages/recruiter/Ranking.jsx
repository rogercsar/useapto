import React from 'react';
import { Crown } from 'lucide-react';
import { useRecruiter } from '../../contexts/RecruiterContext';

const Ranking = () => {
    const { candidates } = useRecruiter();

    // Calculate Combined Score
    const getOverallScore = (candidate) => {
        const cvScore = parseInt(candidate.score || 0);
        const interviewScore = candidate.interview?.score || 0;

        // If interview not done, use just CV score (or weigh it differently? For now, let's just 60/40 if present)
        if (!candidate.interview?.status || candidate.interview?.status === 'pending') {
            return cvScore;
        }

        return Math.round((cvScore * 0.6) + (interviewScore * 0.4));
    };

    // Sort candidates by Overall Score (descending)
    const sortedCandidates = [...candidates].sort((a, b) => {
        return getOverallScore(b) - getOverallScore(a);
    });

    const getRankIcon = (index) => {
        if (index === 0) return <span className="text-2xl drop-shadow-sm">🥇</span>;
        if (index === 1) return <span className="text-2xl drop-shadow-sm">🥈</span>;
        if (index === 2) return <span className="text-2xl drop-shadow-sm">🥉</span>;
        return <span className="font-bold text-slate-400 text-lg">#{index + 1}</span>;
    };

    const getScoreColor = (score) => {
        if (score > 70) return 'bg-green-100 text-green-700';
        if (score > 40) return 'bg-amber-100 text-amber-700';
        return 'bg-red-100 text-red-700';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Crown className="text-yellow-500" size={24} /> Ranking de Talentos
                    </h2>
                    <p className="text-slate-500 text-sm">Os melhores candidatos de todas as suas vagas, ordenados por compatibilidade geral.</p>
                </div>
                <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                    <option value="all">Todas as Vagas</option>
                    <option value="1">Auxiliar de RH</option>
                </select>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-20">Rank</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidato</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vaga</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Score CV</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Interview</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Geral</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedCandidates.map((candidate, index) => {
                            const cvScore = parseInt(candidate.score || 0);
                            const interviewScore = candidate.interview?.score;
                            const overallScore = getOverallScore(candidate);

                            return (
                                <tr key={candidate.id} className="hover:bg-slate-50 transition group bg-slate-50/30">
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center">
                                            {getRankIcon(index)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{candidate.name}</div>
                                        <div className="text-xs text-slate-400">{candidate.date || new Date().toLocaleDateString('pt-BR')}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">{candidate.job}</td>
                                    <td className="p-4 text-center text-sm text-slate-500">
                                        {cvScore}%
                                    </td>
                                    <td className="p-4 text-center">
                                        {candidate.interview?.status === 'completed' ? (
                                            <span className={`px-2 py-1 rounded-md font-bold text-xs ${getScoreColor(interviewScore)}`}>
                                                {interviewScore}%
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Pendente</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full font-bold text-sm ${getScoreColor(overallScore)}`}>
                                            {overallScore}%
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {sortedCandidates.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-400">
                                    Nenhum candidato encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Ranking;
