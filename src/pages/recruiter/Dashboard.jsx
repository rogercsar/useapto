import React from 'react';
import { Briefcase, Users, MessageSquare, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecruiter } from '../../contexts/RecruiterContext';

const Dashboard = () => {
    const { jobs, candidates } = useRecruiter();

    // CALCULATION: Metrics
    const activeJobs = jobs.length;
    const totalCandidates = candidates.length;

    // Potential Interviews: Candidates with score > 70 OR status 'interview'
    const highPotentialCandidates = candidates.filter(c => {
        const scoreVal = parseInt(c.score) || 0;
        return scoreVal >= 70 || c.status === 'interview';
    });
    const potentialInterviews = highPotentialCandidates.length;

    // Average Score
    const averageScoreVal = candidates.length > 0
        ? Math.round(candidates.reduce((acc, c) => acc + (parseInt(c.score) || 0), 0) / candidates.length)
        : 0;

    // Sort jobs by date (newest first)
    const recentJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

    // Candidates per Job Distribution
    const candidatesPerJob = jobs.map(job => {
        const count = candidates.filter(c => c.job === job.title || c.jobId?.toString() === job.id?.toString()).length;
        return { ...job, count };
    }).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5 jobs by candidates

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
                            <TrendingUp size={12} /> Ativas
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-800 mb-1">{activeJobs}</div>
                    <div className="text-sm font-medium text-slate-500">Vagas Abertas</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-rose-500">
                            <Users className="text-white" size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            <TrendingUp size={12} /> Total
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-800 mb-1">{totalCandidates}</div>
                    <div className="text-sm font-medium text-slate-500">Candidatos no Banco</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-amber-500">
                            <MessageSquare className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-800 mb-1">{potentialInterviews}</div>
                    <div className="text-sm font-medium text-slate-500">Entrevistas Potenciais</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-emerald-500">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-800 mb-1">{averageScoreVal}%</div>
                    <div className="text-sm font-medium text-slate-500">Score Médio Geral</div>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Candidatos por Vaga</h3>
                    <div className="space-y-4">
                        {candidatesPerJob.length > 0 ? (
                            candidatesPerJob.map(job => (
                                <div key={job.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">{job.title}</span>
                                        <span className="font-bold text-slate-900">{job.count}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${totalCandidates > 0 ? (job.count / totalCandidates) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-400 py-8">Nenhuma vaga ativa com candidatos.</div>
                        )}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Vagas Recentes</h3>
                        <div className="space-y-3">
                            {recentJobs.length > 0 ? (
                                recentJobs.map(job => (
                                    <div key={job.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer">
                                        <div className="p-2 bg-white rounded-lg border border-slate-200 text-indigo-600">
                                            <Briefcase size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm text-slate-800 truncate">{job.title}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock size={10} /> {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-400 text-sm py-4">Nenhuma vaga criada.</div>
                            )}
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
