import React from 'react';
import { ArrowRight, Mail, Lock, User, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 w-full">
            <div className="bg-white w-full max-w-md p-10 rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-slate-800 transition p-2 hover:bg-slate-50 rounded-full">
                    <ArrowRight className="rotate-180" size={24} />
                </Link>
                <div className="text-center mb-10 mt-4">
                    <div className="mx-auto mb-6 flex justify-center">
                        <img alt="Apto" className="h-16 w-auto" src="/assets/logo-CTLpmGEx.png" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Crie sua conta</h2>
                    <p className="text-slate-500 text-sm">Comece a acelerar sua carreira hoje.</p>
                </div>
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1 tracking-wider ml-1">Nome Completo</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <input className="w-full pl-12 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 transition-all" placeholder="Seu nome" type="text" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1 tracking-wider ml-1">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <input className="w-full pl-12 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 transition-all" placeholder="nome@exemplo.com" type="email" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1 tracking-wider ml-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <input className="w-full pl-12 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 transition-all" placeholder="••••••••" type="password" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <input id="isHR" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" type="checkbox" />
                        <label htmlFor="isHR" className="text-sm text-slate-600 font-medium select-none cursor-pointer">Conta para Recrutadores (RH)</label>
                    </div>
                    <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 border border-red-100 animate-pulse">
                        <TriangleAlert size={18} /> Preencha todos os campos.
                    </div>
                    <Link to="/recruiter/dashboard" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none mt-2 flex items-center justify-center">
                        Criar Conta Grátis
                    </Link>
                </form>
                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                    <Link to="/login" className="text-sm text-indigo-600 font-bold hover:text-indigo-800 transition hover:underline">Já tem conta? Faça login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
