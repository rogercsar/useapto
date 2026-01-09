import React, { useState } from 'react';
import { ArrowLeft, Users, ChartNoAxesColumn, ExternalLink, Cpu, FileText, Check, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { analyzeCandidate } from '../../services/analysisService';
import { useRecruiter } from '../../contexts/RecruiterContext';

const JobDetails = () => {
    const navigate = useNavigate();
    const { candidates, setCandidates } = useRecruiter();
    const [fileName, setFileName] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        email: '',
        cvText: ''
    });

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAnalyze = async () => {
        if (!formData.name || !formData.cvText) {
            alert('Por favor, preencha o nome e o texto do CV.');
            return;
        }

        setIsAnalyzing(true);
        try {
            // Mock job description - in a real app this would come from the job data
            const jobDescription = `
                Apoiar no processo de recrutamento e seleção para diferentes áreas do shopping.
                Acompanhar a admissão de novos colaboradores.
                Auxiliar na gestão de benefícios e controle de ponto.
                Conhecimento em legislação trabalhista e pacote Office.
                Boa comunicação e organização.
            `;

            const result = await analyzeCandidate(formData, jobDescription);

            // Update global context
            setCandidates(prev => [result, ...prev]);

            // Clear form
            setFormData({ name: '', whatsapp: '', email: '', cvText: '' });
            setFileName('');
        } catch (error) {
            console.error('Erro na análise:', error);
            alert('Ocorreu um erro ao analisar o candidato.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex-1 overflow-x-hidden">
            <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
                <div className="h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                        <Link to="/recruiter/vagas" className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 font-medium w-fit transition-colors">
                            <ArrowLeft size={18} /> Voltar
                        </Link>
                        <div className="h-6 w-px bg-slate-300"></div>
                        <h1 className="text-xl font-bold text-slate-800">Auxiliar de RH</h1>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                        <Users size={18} /> Candidatos ({candidates.length})
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {candidates.map((candidate) => (
                                        <div key={candidate.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-white transition flex justify-between items-center group animate-fade-in">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-slate-400">
                                                    {candidate.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{candidate.name}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                                        Match: <span className={`font-bold ${parseInt(candidate.score) > 70 ? 'text-green-600' : parseInt(candidate.score) > 40 ? 'text-amber-600' : 'text-red-500'}`}>
                                                            {candidate.score}
                                                        </span> • {candidate.date || new Date().toLocaleDateString('pt-BR')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <button
                                                    onClick={() => navigate(`/recruiter/candidatos/${candidate.id}`, { state: { candidate } })}
                                                    className="p-2 bg-white text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200"
                                                    title="Ver Análise"
                                                >
                                                    <ChartNoAxesColumn size={18} />
                                                </button>
                                                <button className="p-2 bg-white text-slate-600 rounded-lg hover:bg-green-50 hover:text-green-600 border border-slate-200" title="Link Entrevista">
                                                    <ExternalLink size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Cpu className="text-indigo-600" size={18} /> Analisar Novo Candidato
                                </h3>
                                <div className="space-y-4">
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-slate-50 border rounded-lg text-sm outline-none focus:border-indigo-300"
                                        placeholder="Nome do Candidato"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-slate-50 border rounded-lg text-sm outline-none focus:border-indigo-300"
                                            placeholder="WhatsApp"
                                        />
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-slate-50 border rounded-lg text-sm outline-none focus:border-indigo-300"
                                            placeholder="E-mail"
                                        />
                                    </div>
                                    <textarea
                                        name="cvText"
                                        value={formData.cvText}
                                        onChange={handleInputChange}
                                        className="w-full h-40 p-3 bg-slate-50 border rounded-lg text-sm font-mono outline-none focus:border-indigo-300"
                                        placeholder="Cole o CV aqui ou faça upload do PDF..."
                                    ></textarea>
                                    <div className="relative">
                                        <input accept=".pdf" id="pdf-upload" className="hidden" type="file" onChange={handleFileChange} />
                                        <label htmlFor="pdf-upload" className={`flex items-center justify-center gap-2 w-full py-2 ${fileName ? 'bg-green-50 text-green-700 border-green-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'} font-bold rounded-lg cursor-pointer hover:bg-indigo-100 transition border mb-3`}>
                                            {fileName ? <><Check size={18} /> {fileName}</> : <><FileText size={18} /> Upload PDF</>}
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing}
                                        className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} /> Analisando...
                                            </>
                                        ) : (
                                            'Analisar Compatibilidade'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
