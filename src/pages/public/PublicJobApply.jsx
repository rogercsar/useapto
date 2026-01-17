import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRecruiter } from '../../contexts/RecruiterContext';
import { extractTextFromPDF } from '../../utils/pdfUtils';
import { analyzeCandidate } from '../../services/analysisService';
import { ArrowLeft, Check, FileText, Upload, Loader2, Send } from 'lucide-react';

const PublicJobApply = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { jobs, setCandidates } = useRecruiter();

    // Find job
    const job = jobs.find(j => j.id.toString() === id);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cvText: ''
    });
    const [fileName, setFileName] = useState('');
    const [isProcessingPdf, setIsProcessingPdf] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!job && jobs.length > 0) {
        return <div className="p-10 text-center">Vaga não encontrada.</div>;
    }

    if (!job) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileName(file.name);

            if (file.type === 'application/pdf') {
                setIsProcessingPdf(true);
                try {
                    const text = await extractTextFromPDF(file);
                    setFormData(prev => ({ ...prev, cvText: text }));
                } catch (error) {
                    alert('Erro ao processar PDF. Tente novamente.');
                } finally {
                    setIsProcessingPdf(false);
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.cvText) return;

        setIsSubmitting(true);
        try {
            // Analyze candidate immediately
            const analysisResult = await analyzeCandidate({ ...formData, job: job.title }, job.description);

            // Create candidate object
            const newCandidate = {
                ...analysisResult,
                id: Date.now(),
                job: job.title,
                jobId: job.id,
                status: 'applied', // Initial status
                appliedAt: new Date().toISOString()
            };

            // Save to context
            setCandidates(prev => [newCandidate, ...prev]);

            setIsSuccess(true);
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Erro ao enviar candidatura. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={32} strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Candidatura Enviada!</h2>
                    <p className="text-slate-600 mb-8">
                        Recebemos seu currículo para a vaga de <strong>{job.title}</strong>.
                        Entraremos em contato em breve.
                    </p>
                    <Link to="/jobs" className="block w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition">
                        Ver outras vagas
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link to="/jobs" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition font-medium">
                    <ArrowLeft size={20} /> Voltar para Vagas
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                            {job.area}
                        </span>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{job.title}</h1>
                        <div className="prose prose-slate max-w-none text-slate-600">
                            <p className="whitespace-pre-line">{job.description}</p>
                        </div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Candidate-se agora</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp / Telefone</label>
                                <input
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Currículo (PDF)</label>
                                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition ${fileName ? 'border-green-300 bg-green-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}>
                                    <input
                                        required
                                        type="file"
                                        id="cv-upload"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                                        {isProcessingPdf ? (
                                            <Loader2 className="animate-spin text-indigo-600" size={32} />
                                        ) : fileName ? (
                                            <Check className="text-green-600" size={32} />
                                        ) : (
                                            <Upload className="text-slate-400" size={32} />
                                        )}

                                        <span className={`font-medium ${fileName ? 'text-green-700' : 'text-slate-600'}`}>
                                            {isProcessingPdf ? "Processando..." : fileName ? fileName : "Clique para fazer upload do seu CV (PDF)"}
                                        </span>
                                    </label>
                                </div>
                                {formData.cvText && !isProcessingPdf && (
                                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                        <Check size={12} /> Currículo processado com sucesso.
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || isProcessingPdf || !formData.cvText}
                                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Enviar Candidatura</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicJobApply;
