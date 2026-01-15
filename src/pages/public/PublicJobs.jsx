import React from 'react';
import { useRecruiter } from '../../contexts/RecruiterContext';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const PublicJobs = () => {
    const { jobs } = useRecruiter();

    // Filter only open jobs if you had a status field, for now show all
    const openJobs = jobs.filter(job => job.status !== 'closed');

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 text-white p-2 rounded-lg">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-xl font-bold text-slate-900">Portal de Vagas</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                        Encontre sua próxima oportunidade
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Confira nossas vagas abertas e faça parte do nosso time.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {openJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition group">
                            <div className="flex items-start justify-between mb-4">
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {job.area}
                                </span>
                                <span className="text-slate-400 text-sm">
                                    {new Date(job.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition">
                                {job.title}
                            </h3>

                            <p className="text-slate-500 mb-6 line-clamp-3">
                                {job.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                                <span className="flex items-center gap-1">
                                    <MapPin size={16} /> Remoto/Híbrido
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={16} /> Tempo Integral
                                </span>
                            </div>

                            <Link
                                to={`/jobs/${job.id}/apply`}
                                className="block w-full py-3 text-center bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition"
                            >
                                Candidatar-se
                            </Link>
                        </div>
                    ))}
                </div>

                {openJobs.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        Nenhuma vaga aberta no momento. Volte em breve!
                    </div>
                )}
            </main>
        </div>
    );
};

export default PublicJobs;
