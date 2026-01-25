import React, { useState } from 'react';
import { Sparkles, Briefcase, Clock, ArrowLeft, Loader2, EllipsisVertical, Pencil, Trash2, Copy, Share2, MessageSquare, ExternalLink, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecruiter } from '../../contexts/RecruiterContext';
import { analyzeCandidate } from '../../services/analysisService';

const Jobs = () => {
    // UI States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeActionId, setActiveActionId] = useState(null);

    // Share Modal
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [jobToShare, setJobToShare] = useState(null);
    const [copied, setCopied] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const { jobs, addJob, updateJob, deleteJob, candidates, setCandidates } = useRecruiter();
    const navigate = useNavigate();

    // Form State
    const [title, setTitle] = useState('');
    const [area, setArea] = useState('tech');
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [benefitsValue, setBenefitsValue] = useState('');
    const [benefitsDescription, setBenefitsDescription] = useState('');

    const resetForm = () => {
        setTitle('');
        setArea('tech');
        setDescription('');
        setSalary('');
        setBenefitsValue('');
        setBenefitsDescription('');
        setIsEditing(false);
        setEditingId(null);
    };

    const handleOpenCreateVector = () => {
        resetForm();
        setIsFormOpen(true);
    };

    const handleSaveJob = async () => {
        if (!title || !description) return;

        setIsSaving(true);
        try {
            const jobData = {
                title,
                area,
                description,
                salary: parseFloat(salary) || 0,
                benefitsValue: parseFloat(benefitsValue) || 0,
                benefitsDescription,
                status: 'open'
            };

            let savedJobId;

            if (isEditing && editingId) {
                await updateJob(editingId, jobData);
                savedJobId = editingId;
            } else {
                const newJob = await addJob(jobData);
                savedJobId = newJob.id;

                // --- Talent Pool Autoscan (Only for New Jobs) ---
                const uniqueCandidatesMap = new Map();
                candidates.forEach(c => {
                    if (c.status !== 'hired' && !uniqueCandidatesMap.has(c.email)) {
                        uniqueCandidatesMap.set(c.email, c);
                    }
                });

                const poolCandidates = Array.from(uniqueCandidatesMap.values());
                const analysisPromises = poolCandidates.map(async (candidate) => {
                    try {
                        const result = await analyzeCandidate(candidate, description);
                        if ((parseInt(result.score) || 0) >= 60) {
                            return {
                                ...candidate,
                                id: Date.now() + Math.random(),
                                job: title,
                                jobId: savedJobId,
                                status: 'suggested',
                                origin: 'talent_pool',
                                score: result.score,
                                strengths: result.strengths,
                                gaps: result.gaps,
                                seniority: result.seniority,
                                suggestedRole: result.suggestedRole,
                                observation: `[Auto - Sugestão] ${result.observation} `,
                                recommendations: result.recommendations,
                                analyzedAt: new Date().toISOString()
                            };
                        }
                    } catch (err) { console.error("Autoscan error for candidate", candidate.name, err); }
                    return null;
                });

                const results = await Promise.all(analysisPromises);
                const matches = results.filter(r => r !== null);

                if (matches.length > 0) {
                    await setCandidates([...candidates, ...matches]);
                    console.log(`Autoscan: Added ${matches.length} candidates from talent pool.`);
                }
            }

            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to save job", error);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleActions = (e, id) => {
        e.stopPropagation();
        setActiveActionId(activeActionId === id ? null : id);
    };

    const handleEdit = (e, job) => {
        e.stopPropagation();
        setTitle(job.title);
        setArea(job.area);
        setDescription(job.description);
        setSalary(job.salary);
        setBenefitsValue(job.benefitsValue);
        setBenefitsDescription(job.benefitsDescription);

        setIsEditing(true);
        setEditingId(job.id);
        setIsFormOpen(true);
        setActiveActionId(null);
    };

    const handleDuplicate = async (e, job) => {
        e.stopPropagation();
        if (confirm(`Deseja duplicar a vaga "${job.title}" ? `)) {
            await addJob({
                ...job,
                title: `${job.title} (Cópia)`,
                id: undefined, // Ensure new ID is generated
                createdAt: undefined // Ensure new createdAt is generated
            });
            setActiveActionId(null);
        }
    };

    const handleDelete = async (e, job) => {
        e.stopPropagation();
        if (confirm(`Tem certeza que deseja excluir a vaga "${job.title}" ? `)) {
            await deleteJob(job.id);
        }
        setActiveActionId(null);
    };

    const handleShare = (e, job) => {
        e.stopPropagation();
        setJobToShare(job);
        setShareModalOpen(true);
        setActiveActionId(null);
    };

    const getJobLink = () => {
        if (!jobToShare) return '';
        return `${window.location.origin}/jobs/${jobToShare.id}/apply`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getJobLink());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWhatsApp = () => {
        if (!jobToShare) return;
        const link = getJobLink();
        const text = `Confira esta vaga de ${jobToShare.title}: ${link}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    };


    if (isFormOpen) {
        return (
            <div className="flex-1 overflow-x-hidden">
                <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
                    <div className="max-w-3xl mx-auto">
                        <button
                            onClick={() => { setIsFormOpen(false); resetForm(); }}
                            className="text-slate-500 mb-6 hover:text-indigo-600 flex items-center gap-2 font-medium w-fit transition-colors"
                        >
                            <ArrowLeft size={18} /> Voltar para Vagas
                        </button>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-2xl font-bold mb-6 text-slate-800">{isEditing ? 'Editar Vaga' : 'Criar Nova Vaga'}</h2>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Área</label>
                                        <select
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                            className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            <option value="tech">Tech & Dev</option>
                                            <option value="sales">Vendas & CS</option>
                                            <option value="finance">Finanças & Contabilidade</option>
                                            <option value="legal">Jurídico</option>
                                            <option value="admin">Administrativo / Operacional</option>
                                            <option value="marketing">Marketing Digital</option>
                                            <option value="product">Gestão de Produto</option>
                                            <option value="hr">Recursos Humanos</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Salário Mensal (R$)</label>
                                        <input
                                            type="number"
                                            value={salary}
                                            onChange={(e) => setSalary(e.target.value)}
                                            className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Ex: 5000"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <h3 className="text-sm font-bold text-indigo-900 mb-3">Benefícios</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-700 mb-1">Valor Estimado (R$)</label>
                                            <input
                                                type="number"
                                                value={benefitsValue}
                                                onChange={(e) => setBenefitsValue(e.target.value)}
                                                className="w-full p-2 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                                placeholder="Custo total estimado dos benefícios"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-700 mb-1">Descrição dos Benefícios</label>
                                            <textarea
                                                value={benefitsDescription}
                                                onChange={(e) => setBenefitsDescription(e.target.value)}
                                                className="w-full h-20 p-2 border border-indigo-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                placeholder="Liste os benefícios: VA, VR, Plano de Saúde, Gympass..."
                                            ></textarea>
                                        </div>
                                    </div>
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
                                        onClick={() => { setIsFormOpen(false); resetForm(); }}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveJob}
                                        disabled={isSaving || !title || !description}
                                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : (isEditing ? 'Salvar Alterações' : 'Criar Vaga')}
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
        <div className="p-6 max-w-7xl mx-auto animate-fade-in" onClick={() => setActiveActionId(null)}>
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Vagas Abertas</h2>
                        <p className="text-slate-500 text-sm">Gerencie suas oportunidades e candidatos.</p>
                    </div>
                    <button
                        onClick={handleOpenCreateVector}
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
                            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col h-full relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                                    <Briefcase size={20} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">
                                        {new Date(job.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                                    </span>
                                    <button
                                        onClick={(e) => toggleActions(e, job.id)}
                                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition"
                                    >
                                        <EllipsisVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Action Menu */}
                            {activeActionId === job.id && (
                                <div className="absolute right-4 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-fade-in overflow-hidden text-left" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={(e) => handleEdit(e, job)}
                                        className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 border-b border-slate-50 transition-colors"
                                    >
                                        <Pencil size={16} /> Editar
                                    </button>
                                    <button
                                        onClick={(e) => handleDuplicate(e, job)}
                                        className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 border-b border-slate-50 transition-colors"
                                    >
                                        <Copy size={16} /> Duplicar
                                    </button>
                                    <button
                                        onClick={(e) => handleShare(e, job)}
                                        className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 border-b border-slate-50 transition-colors"
                                    >
                                        <Share2 size={16} /> Compartilhar
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, job)}
                                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={16} /> Excluir
                                    </button>
                                </div>
                            )}

                            <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition">{job.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
                                {job.description}
                            </p>

                            <div className="pt-4 border-t border-slate-50 mt-auto flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span className="bg-slate-100 px-2 py-1 rounded">{job.area}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Share Modal */}
            {shareModalOpen && jobToShare && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShareModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                <Share2 size={18} /> Compartilhar Vaga
                            </h3>
                            <button onClick={() => setShareModalOpen(false)} className="text-indigo-400 hover:text-indigo-700 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-slate-600">Compartilhe o link da vaga <b>{jobToShare.title}</b> para atrair candidatos.</p>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-2">
                                <span className="text-xs text-slate-500 truncate flex-1 font-mono bg-white p-1 rounded border border-slate-100">
                                    {getJobLink()}
                                </span>
                                <button
                                    onClick={copyToClipboard}
                                    className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600'}`}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>

                            <button
                                onClick={shareWhatsApp}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-green-100"
                            >
                                <MessageSquare size={18} /> Compartilhar no WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;
