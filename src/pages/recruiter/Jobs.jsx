import React, { useState } from 'react';
import { Sparkles, Briefcase, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecruiter } from '../../contexts/RecruiterContext';

const Jobs = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { jobs, addJob } = useRecruiter();
    const navigate = useNavigate();

    // Form State
    const [title, setTitle] = useState('');
    const [area, setArea] = useState('tech');
    const [description, setDescription] = useState('');

    const handleSaveJob = async () => {
        if (!title || !description) return;

        setIsSaving(true);
        try {
            await addJob({
                title,
                area,
                description,
                status: 'open'
            });
            setIsCreating(false);
            // Reset form
            setTitle('');
            setArea('tech');
            setDescription('');
        } catch (error) {
            console.error("Failed to save job", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isCreating) {
        return (
            <div className="flex-1 overflow-x-hidden">
                <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
                    <div className="max-w-3xl mx-auto">
                        <button
                            onClick={() => setIsCreating(false)}
                            className="text-slate-500 mb-6 hover:text-indigo-600 flex items-center gap-2 font-medium w-fit transition-colors"
                        >
                            <ArrowLeft size={18} /> Voltar para Vagas
                        </button>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-2xl font-bold mb-6 text-slate-800">Criar Nova Vaga</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Título da Vaga</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ex: Senior React Developer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Área</label>
                                    <select
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="tech">Tech & Dev</option>
                                        <option value="sales">Vendas & CS</option>
                                        <option value="marketing">Marketing Digital</option>
                                        <option value="product">Gestão de Produto</option>
                                        <option value="hr">Recursos Humanos</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Descrição (Job Description)</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full h-40 p-3 border rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Cole a descrição completa da vaga..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveJob}
                                        disabled={isSaving || !title || !description}
                                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Vaga'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Vagas Abertas</h2>
                        <p className="text-slate-500 text-sm">Gerencie suas oportunidades e candidatos.</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        <Sparkles size={16} /> Nova Vaga
                    </button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => navigate(`/recruiter/vagas/${job.id}`)}
                            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                                    <Briefcase size={20} />
                                </div>
                                <span className="text-xs text-slate-400">
                                    {new Date(job.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition">{job.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
                                {job.description}
                            </p>

                            {/* Tags or Footer info (Optional) */}
                            <div className="pt-4 border-t border-slate-50 mt-auto flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span className="bg-slate-100 px-2 py-1 rounded">{job.area}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Jobs;
