import React, { useMemo } from 'react';
import { useRecruiter } from '../../contexts/RecruiterContext';
import { DollarSign, TrendingUp, Award, Briefcase } from 'lucide-react';

const Finance = () => {
    const { jobs } = useRecruiter();

    const stats = useMemo(() => {
        const openJobs = jobs.filter(j => j.status !== 'closed');

        const totalMonthlySpend = openJobs.reduce((acc, job) => {
            const salary = parseFloat(job.salary) || 0;
            const benefits = parseFloat(job.benefitsValue) || 0;
            return acc + salary + benefits;
        }, 0);

        const totalSalaries = openJobs.reduce((acc, job) => acc + (parseFloat(job.salary) || 0), 0);
        const avgSalary = openJobs.length ? (totalSalaries / openJobs.length) : 0;

        // Find highest paid job
        const highestPaid = [...openJobs].sort((a, b) => (b.salary || 0) - (a.salary || 0))[0];

        // Find most expensive benefits
        const mostExpensiveBenefits = [...openJobs].sort((a, b) => (b.benefitsValue || 0) - (a.benefitsValue || 0))[0];

        return {
            totalMonthlySpend,
            avgSalary,
            highestPaid,
            mostExpensiveBenefits,
            openJobsCount: openJobs.length
        };
    }, [jobs]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Financeiro</h2>
            <p className="text-slate-500 mb-8">Visão geral dos custos com vagas abertas e benefícios.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Mensal</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.totalMonthlySpend)}</h3>
                    <p className="text-sm text-slate-500 mt-1">Salários + Benefícios (Vagas Abertas)</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Média Salarial</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.avgSalary)}</h3>
                    <p className="text-sm text-slate-500 mt-1">Por vaga aberta</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <Award size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Maior Salário</span>
                    </div>
                    {stats.highestPaid ? (
                        <>
                            <h3 className="text-xl font-bold text-slate-800 truncate" title={stats.highestPaid.title}>
                                {stats.highestPaid.title}
                            </h3>
                            <p className="text-emerald-600 font-bold text-sm mt-1">
                                {formatCurrency(stats.highestPaid.salary || 0)}
                            </p>
                        </>
                    ) : (
                        <p className="text-slate-400">Nenhuma vaga</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Top Benefícios</span>
                    </div>
                    {stats.mostExpensiveBenefits ? (
                        <>
                            <h3 className="text-xl font-bold text-slate-800 truncate" title={stats.mostExpensiveBenefits.title}>
                                {stats.mostExpensiveBenefits.title}
                            </h3>
                            <p className="text-purple-600 font-bold text-sm mt-1">
                                {formatCurrency(stats.mostExpensiveBenefits.benefitsValue || 0)}
                            </p>
                        </>
                    ) : (
                        <p className="text-slate-400">Nenhuma vaga</p>
                    )}
                </div>
            </div>

            {/* Detailed Table (Optional, or just a list of top spenders) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">Detalhamento por Vaga</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold">Vaga</th>
                                <th className="p-4 font-bold">Área</th>
                                <th className="p-4 font-bold">Salário</th>
                                <th className="p-4 font-bold">Benefícios (Est.)</th>
                                <th className="p-4 font-bold">Custo Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {jobs.filter(j => j.status !== 'closed').map((job) => {
                                const salary = parseFloat(job.salary) || 0;
                                const benefits = parseFloat(job.benefitsValue) || 0;
                                return (
                                    <tr key={job.id} className="hover:bg-slate-50 transition">
                                        <td className="p-4 font-bold text-slate-700">{job.title}</td>
                                        <td className="p-4 text-slate-500">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">
                                                {job.area}
                                            </span>
                                        </td>
                                        <td className="p-4 text-emerald-600 font-medium">{formatCurrency(salary)}</td>
                                        <td className="p-4 text-slate-600">{formatCurrency(benefits)}</td>
                                        <td className="p-4 text-slate-800 font-bold">{formatCurrency(salary + benefits)}</td>
                                    </tr>
                                );
                            })}
                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                        Nenhuma vaga cadastrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Finance;
