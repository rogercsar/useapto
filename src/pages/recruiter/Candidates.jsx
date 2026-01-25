import React, { useState } from 'react';
import { Search, Funnel, EllipsisVertical, Eye, SquarePen, Share2, Trash2, X, Save, Printer, Mail, MessageSquare, FileText, RefreshCw, Sparkles, Loader2, Link, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecruiter } from '../../contexts/RecruiterContext';
import { analyzeCandidate } from '../../services/analysisService';
import jsPDF from 'jspdf';

const Candidates = () => {
    const [activeActionId, setActiveActionId] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [cvModalOpen, setCvModalOpen] = useState(false);
    const [interviewModalOpen, setInterviewModalOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [copied, setCopied] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobFilter, setJobFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Use candidates from context for persistence
    const { recruiterProfile, candidates, updateCandidate, jobs } = useRecruiter();

    // removing lines

    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJob = jobFilter === 'all' || c.job === jobFilter;
        const matchesStatus = statusFilter === 'all' || (c.status || 'applied') === statusFilter;
        return matchesSearch && matchesJob && matchesStatus;
    });

    // List of candidates is already filtered above

    const navigate = useNavigate();

    const [tempCvText, setTempCvText] = useState('');
    const [editFormData, setEditFormData] = useState({});


    const toggleActions = (e, candidate) => {
        e.stopPropagation();
        if (activeActionId === candidate.id) {
            setActiveActionId(null);
            setSelectedCandidate(null);
        } else {
            setActiveActionId(candidate.id);
            setSelectedCandidate(candidate);
        }
    };

    const handleViewDetails = () => {
        if (!selectedCandidate) return;
        navigate(`/recruiter/candidatos/${selectedCandidate.id}`, { state: { candidate: selectedCandidate } });
    };

    const handleShareEmail = () => {
        if (!selectedCandidate) return;
        const subject = `Candidato para a vaga de ${selectedCandidate.job}: ${selectedCandidate.name}`;
        const strengthsList = selectedCandidate.strengths.join(', ');
        const gapsList = selectedCandidate.gaps.join(', ');
        const body = `Olá,\n\nEstou compartilhando o perfil do candidato ${selectedCandidate.name} para a vaga de ${selectedCandidate.job}.\n\nRESUMO DA ANÁLISE\nScore de Compatibilidade: ${selectedCandidate.score}\nPontos Fortes: ${strengthsList}\nLacunas: ${gapsList}\n\nCURRÍCULO RESUMIDO\n${selectedCandidate.cvText}\n\n---\nEnviado por: ${recruiterProfile.name} - ${recruiterProfile.company}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleShareWhatsApp = () => {
        if (!selectedCandidate) return;
        const strengthsList = selectedCandidate.strengths.join(', ');
        const message = `*Candidato:* ${selectedCandidate.name}\n*Vaga:* ${selectedCandidate.job}\n*Score:* ${selectedCandidate.score}\n\n*Pontos Fortes:* ${strengthsList}\n\nEnviado por: ${recruiterProfile.name}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleGeneratePDF = () => {
        if (!selectedCandidate) return;
        const doc = new jsPDF();
        doc.setFillColor(79, 70, 229);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Ficha do Candidato", 20, 20);
        doc.setTextColor(30, 41, 59);
        doc.text(selectedCandidate.name, 20, 60);
        doc.save(`candidato_${selectedCandidate.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };

    const handleUpdateResumeClick = () => {
        if (!selectedCandidate) return;
        setTempCvText(selectedCandidate.cvText);
        setCvModalOpen(true);
    };

    const handleSaveResume = () => {
        if (!selectedCandidate) return;
        updateCandidate(selectedCandidate.id, { cvText: tempCvText });
        setCvModalOpen(false);
    };

    const handleEditClick = () => {
        if (!selectedCandidate) return;
        setEditFormData(selectedCandidate);
        setEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (!selectedCandidate) return;
        updateCandidate(selectedCandidate.id, editFormData);
        setEditModalOpen(false);
    };

    const handleReanalyze = async () => {
        if (!selectedCandidate) return;
        setIsAnalyzing(true);

        // Find actual job linked to this candidate
        const linkedJob = jobs.find(j =>
            j.id.toString() === selectedCandidate.jobId?.toString() ||
            j.title === selectedCandidate.job
        );

        const jobDescription = linkedJob?.description || "Requisitos: Experiência na área, proatividade e boa comunicação.";

        try {
            const result = await analyzeCandidate({ ...selectedCandidate }, jobDescription);
            updateCandidate(selectedCandidate.id, {
                score: result.score,
                strengths: result.strengths,
                gaps: result.gaps,
                seniority: result.seniority,
                suggestedRole: result.suggestedRole,
                observation: result.observation,
                recommendations: result.recommendations,
                analyzedAt: result.analyzedAt
            });
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getInterviewLink = () => {
        return selectedCandidate ? `${window.location.origin}/interview/${selectedCandidate.id}` : '';
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(getInterviewLink());
        setCopied(true);
        if (selectedCandidate) {
            updateCandidate(selectedCandidate.id, { status: 'interview_released' });
        }
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareInterviewWhatsApp = () => {
        if (!selectedCandidate) return;
        const link = getInterviewLink();
        const message = `Olá ${selectedCandidate.name}, gostaríamos de convidá-lo para uma entrevista simulada com nossa IA para a vaga de ${selectedCandidate.job}. Acesse o link: ${link}`;
        updateCandidate(selectedCandidate.id, { status: 'interview_released' });
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleShareInterviewEmail = () => {
        if (!selectedCandidate) return;
        const link = getInterviewLink();
        const subject = `Convite para Entrevista - ${selectedCandidate.job}`;
        const body = `Olá ${selectedCandidate.name},\n\nGostaríamos de convidá-lo para uma entrevista simulada com nossa IA como parte do processo seletivo para a vaga de ${selectedCandidate.job}.\n\nPor favor, acesse o link a seguir para iniciar:\n${link}\n\nBoa sorte!\n\n${recruiterProfile.name}`;
        updateCandidate(selectedCandidate.id, { status: 'interview_released' });
        window.location.href = `mailto:${selectedCandidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in relative min-h-screen" onClick={() => setActiveActionId(null)}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Banco de Talentos</h2>
                    <p className="text-slate-500 text-sm">Visualize e filtre sua base de talentos.</p>
                </div>
            </div>

            {/* Stats/Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4 flex-col md:flex-row">
                <div className="flex-1 relative">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Buscar por Nome</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                            className="w-full pl-10 p-2.5 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ex: Rogério Silva"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Filtrar por Vaga</label>
                    <div className="relative">
                        <Funnel className="absolute left-3 top-3 text-slate-400" size={16} />
                        <select
                            value={jobFilter}
                            onChange={(e) => setJobFilter(e.target.value)}
                            className="w-full pl-10 p-2.5 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                        >
                            <option value="all">Todas as Vagas</option>
                            {[...new Set(candidates.map(c => c.job))].map(jobTitle => (
                                <option key={jobTitle} value={jobTitle}>{jobTitle}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todos</option>
                            <option value="applied">Novo / Aplicou</option>
                            <option value="interview">Entrevista</option>
                            <option value="interview_released">Entrevista IA Liberada</option>
                            <option value="interview_completed">Entrevista IA Finalizada</option>
                            <option value="documents">Docs Pendentes</option>
                            <option value="hired">Contratado</option>
                            <option value="rejected">Rejeitado</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                <div className="overflow-x-auto min-h-[400px] mb-20">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidato</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vaga Aplicada</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Score</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCandidates.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">Nenhum candidato encontrado.</td>
                                </tr>
                            )}

                            {filteredCandidates.map(candidate => (
                                <tr key={candidate.id} className="hover:bg-slate-50 transition group">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{candidate.name}</div>
                                        <div className="text-xs text-slate-400">{candidate.email} • {candidate.phone}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">{candidate.job}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-lg font-bold text-sm ${parseInt(candidate.score) > 70 ? 'bg-green-100 text-green-700' : parseInt(candidate.score) > 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                            {candidate.score}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${candidate.status === 'hired' ? 'bg-green-100 text-green-700' :
                                            candidate.status === 'interview' ? 'bg-indigo-100 text-indigo-700' :
                                                candidate.status === 'interview_released' ? 'bg-purple-100 text-purple-700' :
                                                    candidate.status === 'interview_completed' ? 'bg-emerald-100 text-emerald-700' :
                                                        candidate.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            candidate.status === 'documents' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                            {candidate.status === 'hired' ? 'Contratado' :
                                                candidate.status === 'interview' ? 'Entrevista' :
                                                    candidate.status === 'interview_released' ? 'Entrevista IA Liberada' :
                                                        candidate.status === 'interview_completed' ? 'Entrevista IA Finalizada' :
                                                            candidate.status === 'rejected' ? 'Rejeitado' :
                                                                candidate.status === 'documents' ? 'Docs Pendentes' :
                                                                    'Novo / Aplicou'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right relative">
                                        <button
                                            onClick={(e) => toggleActions(e, candidate)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition"
                                        >
                                            <EllipsisVertical size={18} />
                                        </button>
                                        {activeActionId === candidate.id && (
                                            <div className="absolute right-8 top-8 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-fade-in overflow-hidden text-left">
                                                <button
                                                    onClick={handleViewDetails}
                                                    className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 border-b border-slate-50 transition-colors"
                                                >
                                                    <Eye size={16} /> Ver Detalhes
                                                </button>
                                                <button
                                                    onClick={handleEditClick}
                                                    className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 border-b border-slate-50 transition-colors"
                                                >
                                                    <SquarePen size={16} /> Editar Dados
                                                </button>
                                                <button
                                                    onClick={handleUpdateResumeClick}
                                                    className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 border-b border-slate-50 transition-colors"
                                                >
                                                    <FileText size={16} /> Atualizar Currículo
                                                </button>
                                                <button
                                                    onClick={handleReanalyze}
                                                    className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-2 border-b border-slate-50 transition-colors"
                                                >
                                                    <RefreshCw size={16} /> Reanalisar
                                                </button>
                                                <button
                                                    onClick={() => setShareModalOpen(true)}
                                                    className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 border-b border-slate-50 transition-colors"
                                                >
                                                    <Share2 size={16} /> Compartilhar
                                                </button>
                                                <button
                                                    onClick={() => setInterviewModalOpen(true)}
                                                    className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 border-b border-slate-50 transition-colors"
                                                >
                                                    <Link size={16} /> Link de Entrevista
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModalOpen(true)}
                                                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
                                                >
                                                    <Trash2 size={16} /> Excluir
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Analysis Loading Modal */}
            {isAnalyzing && (
                <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm w-full">
                        <div className="relative w-16 h-16 mb-4">
                            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                            <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Analisando Perfil</h3>
                        <p className="text-slate-500 text-center text-sm">
                            Nossa IA está lendo o novo currículo e recalculando a compatibilidade com a vaga...
                        </p>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Editar Candidato</h3>
                            <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome Completo</label>
                                <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                                    <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" type="email" defaultValue={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WhatsApp</label>
                                    <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={editFormData.phone} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2">
                                    <Save size={16} /> Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Resume Modal */}
            {cvModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Atualizar Currículo - {selectedCandidate?.name}</h3>
                            <button onClick={() => setCvModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-4 flex gap-3 text-amber-700 text-sm">
                                <FileText size={20} className="shrink-0" />
                                <p>Atualizar o texto do currículo afetará futuras análises. Certifique-se de clicar em "Reanalisar Candidato" após salvar para atualizar o Score e as Competências.</p>
                            </div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Texto do Currículo (Conteúdo Extraído)</label>
                            <textarea
                                className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed resize-none"
                                value={tempCvText}
                                onChange={(e) => setTempCvText(e.target.value)}
                                placeholder="Cole aqui o conteúdo textual do currículo..."
                            />
                        </div>
                        <div className="px-6 py-4 border-t border-slate-50 flex justify-end gap-3 bg-white">
                            <button onClick={() => setCvModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                            <button onClick={handleSaveResume} className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2">
                                <Save size={16} /> Salvar Currículo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {shareModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Compartilhar Perfil</h3>
                            <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-3">
                            <p className="text-sm text-slate-600 mb-4">Escolha como deseja compartilhar os detalhes deste candidato.</p>
                            <button
                                onClick={handleShareEmail}
                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition text-left group"
                            >
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition"><Mail size={20} /></div>
                                <div>
                                    <div className="font-bold text-slate-800">Enviar por Email</div>
                                    <div className="text-xs text-slate-500">Escolher destinatário</div>
                                </div>
                            </button>
                            <button
                                onClick={handleShareWhatsApp}
                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-green-50 hover:border-green-200 transition text-left group"
                            >
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition"><MessageSquare size={20} /></div>
                                <div>
                                    <div className="font-bold text-slate-800">Enviar por WhatsApp</div>
                                    <div className="text-xs text-slate-500">Escolher contato</div>
                                </div>
                            </button>
                            <button
                                onClick={handleGeneratePDF}
                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition text-left group"
                            >
                                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition"><Printer size={20} /></div>
                                <div>
                                    <div className="font-bold text-slate-800">Gerar PDF</div>
                                    <div className="text-xs text-slate-500">Baixar relatório com seus dados</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Interview Link Modal */}
            {interviewModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex justify-between items-center">
                            <h3 className="font-bold text-green-800 flex items-center gap-2">
                                <Sparkles size={18} /> Entrevista com IA
                            </h3>
                            <button onClick={() => setInterviewModalOpen(false)} className="text-green-500 hover:text-green-700 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-slate-600">Compartilhe este link com o candidato para iniciar a simulação de entrevista.</p>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-2">
                                <span className="text-xs text-slate-500 truncate flex-1 font-mono bg-white p-1 rounded border border-slate-100">
                                    {getInterviewLink()}
                                </span>
                                <button
                                    onClick={handleCopyLink}
                                    className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600'}`}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={handleShareInterviewWhatsApp}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition text-sm"
                                >
                                    <MessageSquare size={16} /> WhatsApp
                                </button>
                                <button
                                    onClick={handleShareInterviewEmail}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition text-sm"
                                >
                                    <Mail size={16} /> Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="font-bold text-xl text-slate-800 mb-2">Excluir Candidato?</h3>
                            <p className="text-slate-500 text-sm mb-6">Esta ação não pode ser desfeita. Todos os dados e históricos de {selectedCandidate?.name} serão removidos permanentemente.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">Cancelar</button>
                                <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition">Sim, Excluir</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;
