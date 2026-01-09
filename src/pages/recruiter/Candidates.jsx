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
    const [copied, setCopied] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Use candidates from context for persistence
    const { recruiterProfile, candidates, updateCandidate } = useRecruiter();

    // We'll focus on the first candidate for this demo since we don't have full routing for multiple yet
    const candidateData = candidates.find(c => c.id === 1) || candidates[0];

    const navigate = useNavigate();

    const [tempCvText, setTempCvText] = useState('');
    const [editFormData, setEditFormData] = useState({});

    const toggleActions = (id) => {
        if (activeActionId === id) {
            setActiveActionId(null);
        } else {
            setActiveActionId(id);
        }
    };

    const handleViewDetails = () => {
        navigate('/recruiter/candidatos/1', { state: { candidate: candidateData } });
    };

    const handleShareEmail = () => {
        const subject = `Candidato para a vaga de ${candidateData.job}: ${candidateData.name}`;

        const strengthsList = candidateData.strengths.join(', ');
        const gapsList = candidateData.gaps.join(', ');

        const body = `Olá,\n\nEstou compartilhando o perfil do candidato ${candidateData.name} para a vaga de ${candidateData.job}.\n\nRESUMO DA ANÁLISE\nScore de Compatibilidade: ${candidateData.score}\nPontos Fortes: ${strengthsList}\nLacunas: ${gapsList}\n\nCURRÍCULO RESUMIDO\n${candidateData.cvText}\n\n---\nEnviado por: ${recruiterProfile.name} - ${recruiterProfile.company}\nContato: ${recruiterProfile.email} | ${recruiterProfile.phone}`;

        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleShareWhatsApp = () => {
        const strengthsList = candidateData.strengths.join(', ');
        const message = `*Candidato:* ${candidateData.name}\n*Vaga:* ${candidateData.job}\n*Score:* ${candidateData.score}\n\n*Pontos Fortes:* ${strengthsList}\n\n*Resumo CV:*\n${candidateData.cvText.substring(0, 100)}...\n\nEnviado por: ${recruiterProfile.name}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleGeneratePDF = () => {
        const doc = new jsPDF();

        // Header Background
        doc.setFillColor(79, 70, 229); // Indigo 600
        doc.rect(0, 0, 210, 40, 'F');

        // Header Text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("Ficha do Candidato", 20, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Gerado por: ${recruiterProfile.name} | ${recruiterProfile.role} at ${recruiterProfile.company}`, 20, 30);
        doc.text(`Contato: ${recruiterProfile.email} | ${recruiterProfile.phone}`, 20, 35);

        // Basic Info
        doc.setTextColor(30, 41, 59); // Slate 800
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(candidateData.name, 20, 60);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Vaga: ${candidateData.job}`, 20, 70);
        doc.text(`Email: ${candidateData.email}`, 20, 80);
        doc.text(`Telefone: ${candidateData.phone}`, 20, 90);
        doc.text(`Compatibilidade: ${candidateData.score}`, 20, 100);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 110, 190, 110);

        // Analysis Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Análise de Competências", 20, 125);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(22, 163, 74); // Green 600
        doc.text("Pontos Fortes:", 20, 135);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105); // Slate 600
        doc.text(candidateData.strengths.join(', '), 20, 142);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(220, 38, 38); // Red 600
        doc.text("Lacunas:", 20, 155);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(candidateData.gaps.join(', '), 20, 162);

        doc.line(20, 172, 190, 172);

        // CV Text Section
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Resumo do Currículo", 20, 185);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);

        const splitText = doc.splitTextToSize(candidateData.cvText, 170);
        doc.text(splitText, 20, 195);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate 400
        doc.text(`Endereço do Recrutador: ${recruiterProfile.address}`, 20, 280);

        doc.save(`candidato_${candidateData.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };

    const handleUpdateResumeClick = () => {
        setTempCvText(candidateData.cvText);
        setCvModalOpen(true);
    };

    const handleSaveResume = () => {
        updateCandidate(candidateData.id, { cvText: tempCvText });
        setCvModalOpen(false);
    };

    const handleEditClick = () => {
        setEditFormData(candidateData);
        setEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        updateCandidate(candidateData.id, editFormData);
        setEditModalOpen(false);
    };

    const handleReanalyze = async () => {
        setIsAnalyzing(true);
        // Mock job description for re-analysis context
        const mockJobDescription = "Requisitos: Experiência em RH, Recrutamento e Seleção, Inglês Avançado e Power BI.";

        try {
            const result = await analyzeCandidate({ ...candidateData }, mockJobDescription);
            updateCandidate(candidateData.id, {
                score: `${result.score}%`,
                strengths: result.strengths,
                gaps: result.gaps
            });
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getInterviewLink = () => {
        // Always generate based on candidate ID to ensure consistency
        return `${window.location.origin}/interview/${candidateData.id}`;
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(getInterviewLink());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareInterviewWhatsApp = () => {
        const link = getInterviewLink();
        const message = `Olá ${candidateData.name}, gostaríamos de convidá-lo para uma entrevista simulada com nossa IA para a vaga de ${candidateData.job}. Acesse o link: ${link}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleShareInterviewEmail = () => {
        const link = getInterviewLink();
        const subject = `Convite para Entrevista - ${candidateData.job}`;
        const body = `Olá ${candidateData.name},\n\nGostaríamos de convidá-lo para uma entrevista simulada com nossa IA como parte do processo seletivo para a vaga de ${candidateData.job}.\n\nPor favor, acesse o link a seguir para iniciar:\n${link}\n\nBoa sorte!\n\n${recruiterProfile.name}`;
        window.location.href = `mailto:${candidateData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in relative min-h-screen" onClick={() => setActiveActionId(null)}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gerenciar Candidatos</h2>
                    <p className="text-slate-500 text-sm">Visualize e filtre sua base de talentos.</p>
                </div>
            </div>

            {/* Stats/Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4 flex-col md:flex-row">
                <div className="flex-1 relative">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Buscar por Nome</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input className="w-full pl-10 p-2.5 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Rogério Silva" defaultValue="" />
                    </div>
                </div>
                <div className="w-full md:w-64">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Filtrar por Vaga</label>
                    <div className="relative">
                        <Funnel className="absolute left-3 top-3 text-slate-400" size={16} />
                        <select defaultValue="all" className="w-full pl-10 p-2.5 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                            <option value="all">Todas as Vagas</option>
                            <option value="1">Auxiliar de RH</option>
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
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {candidates.map(candidate => (
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
                                    <td className="p-4 text-right relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleActions(candidate.id);
                                            }}
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
                            <h3 className="font-bold text-slate-800">Atualizar Currículo - {candidateData.name}</h3>
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
                            <p className="text-slate-500 text-sm mb-6">Esta ação não pode ser desfeita. Todos os dados e históricos de Roger Santos serão removidos permanentemente.</p>
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
