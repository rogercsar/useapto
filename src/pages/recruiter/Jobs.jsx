import React, { useState } from 'react';
import { Sparkles, Briefcase, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

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
                                    <input className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Senior React Developer" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Área</label>
                                    <select defaultValue="tech" className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="tech">Tech & Dev</option>
                                        <option value="sales">Vendas & CS</option>
                                        <option value="marketing">Marketing Digital</option>
                                        <option value="product">Gestão de Produto</option>
                                        <option value="hr">Recursos Humanos</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Descrição (Job Description)</label>
                                    <textarea className="w-full h-40 p-3 border rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Cole a descrição completa da vaga..."></textarea>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                                        Salvar Vaga
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
                    <div
                        onClick={() => navigate('/recruiter/vagas/1')}
                        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                                <Briefcase size={20} />
                            </div>
                            <span className="text-xs text-slate-400">06/01/2026</span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition">Auxiliar de RH</h3>
                        <p className="text-sm text-slate-500 line-clamp-2">
                            Apoiar no processo de recrutamento e seleção para diferentes áreas do shopping, incluindo triagem de currículos, agendamento e aplicação de entrevistas.
                            • Acompanhar a admissão de novos colaboradores, fazendo o controle da documentação necessária e organizando os processos de integração.
                            • Auxiliar na gestão de benefícios, como vale-transporte, vale-alimentação, assistência médica, entre outros.
                            • Auxiliar no controle de ponto, conferindo registros de jornada, faltas e atrasos.
                            • Prestar suporte na elaboração de relatórios de gestão de pessoas e na análise de indicadores de RH.
                            • Organizar treinamentos e eventos internos, acompanhando a execução e a avaliação das ações realizadas.
                            • Atender aos colaboradores, esclarecendo dúvidas sobre benefícios, folha de pagamento, políticas internas e demais questões relacionadas à área de RH.
                            • Colaborar com as demandas administrativas do departamento, como arquivo de documentos, elaboração de comunicados internos, entre outras atividades.

                            Requisitos e qualificações
                            • Ensino médio completo (preferencialmente com curso superior ou em andamento em Administração, Psicologia, Gestão de RH ou áreas correlatas).
                            • Experiência anterior na área de Recursos Humanos (preferencialmente em ambiente de varejo ou shoppings).
                            • Conhecimento básico em legislação trabalhista e rotinas administrativas de RH.
                            • Habilidade no uso de pacote Office (principalmente Excel e Word).
                            • Boa comunicação, organização e facilidade em trabalhar em equipe.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
