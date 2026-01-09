import React, { useState } from 'react';
import { LayoutDashboard, Briefcase, Users, Trophy, Columns2, ChartPie, CircleUser, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const RecruiterLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white';
    };

    const getIconColor = (path) => {
        return location.pathname === path ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors';
    };

    const menuItems = [
        { path: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/recruiter/vagas', label: 'Vagas', icon: Briefcase },
        { path: '/recruiter/candidatos', label: 'Candidatos', icon: Users },
        { path: '/recruiter/ranking', label: 'Ranking Geral', icon: Trophy },
        { path: '/recruiter/comparar', label: 'Comparador', icon: Columns2 },
        { path: '/recruiter/relatorios', label: 'Relatórios', icon: ChartPie },
        { path: '/recruiter/perfil', label: 'Perfil', icon: CircleUser },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans relative">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white z-50 px-4 py-3 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <img alt="Apto" className="h-8 w-auto bg-white rounded-lg p-1" src="/assets/logo-CTLpmGEx.png" />
                    <span className="text-sm font-bold">Portal RH</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300 hover:text-white">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-screen transition-transform duration-300 transform 
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 shadow-2xl md:shadow-none
            `}>
                <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
                    <div>
                        <div className="bg-white rounded-lg p-2 mb-1 inline-block">
                            <img alt="Apto" className="h-8 w-auto" src="/assets/logo-CTLpmGEx.png" />
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Portal RH</p>
                    </div>
                </div>

                {/* Mobile Menu Header inside Sidebar (optional duplication for style or just allow flow) */}
                <div className="md:hidden p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white rounded-lg p-2 inline-block">
                            <img alt="Apto" className="h-8 w-auto" src="/assets/logo-CTLpmGEx.png" />
                        </div>
                        <span className="font-bold">Portal RH</span>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)}`}
                        >
                            <item.icon className={getIconColor(item.path)} size={20} />
                            <span className="font-medium text-sm">{item.label}</span>
                            {location.pathname === item.path && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                            )}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-all duration-200">
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Sair</span>
                    </Link>
                </div>
            </div>

            <main className="flex-1 overflow-x-hidden pt-16 md:pt-0">
                <Outlet />
            </main>
        </div>
    );
};

export default RecruiterLayout;
