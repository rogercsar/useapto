import React, { useState } from 'react';
import { Sparkles, Globe, ChevronDown, Menu, Play, Shield, Database, TrendingUp, Zap, FileText, Mic, BookOpen, CircleCheck, Check, Twitter, Linkedin, Github, Users, Search, Target, PieChart, Briefcase, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const LandingPage = () => {
    const { language, setLanguage, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('candidate'); // 'candidate' or 'company'

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-indigo-100 selection:text-indigo-900 w-full overflow-x-hidden font-sans">
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-white/20 supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <img alt="Apto Logo" className="h-20 w-auto" src="/assets/logo-CTLpmGEx.png" />
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="font-semibold text-sm text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wide">{t('nav.features')}</a>
                            <a href="#plans" className="font-semibold text-sm text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wide">{t('nav.plans')}</a>
                            <a href="#about" className="font-semibold text-sm text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wide">{t('nav.about')}</a>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="relative w-auto">
                                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                <select
                                    className="appearance-none cursor-pointer bg-transparent border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pl-10 pr-8"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="pt">🇧🇷 Português</option>
                                    <option value="en">🇺🇸 English</option>
                                    <option value="es">🇪🇸 Español</option>
                                    <option value="fr">🇫🇷 Français</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                            </div>
                            <Link to="/login" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0">
                                {t('nav.login')}
                            </Link>
                        </div>
                        <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 relative px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 transform translate-y-0 opacity-100">
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-8 shadow-sm animate-bounce-slow">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('hero.version')}</span>
                    </div>
                    {activeTab === 'candidate' ? (
                        <>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8 tracking-tight h-[160px] md:h-auto">
                                <span className="block animate-fade-in">{t('hero.candidate.title1')}</span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{t('hero.candidate.title2')}</span>
                            </h1>
                            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto">
                                {t('hero.candidate.subtitle')}
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8 tracking-tight h-[160px] md:h-auto">
                                <span className="block animate-fade-in">{t('hero.company.title1')}</span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{t('hero.company.title2')}</span>
                            </h1>
                            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto">
                                {t('hero.company.subtitle')}
                            </p>
                        </>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2">
                            <Sparkles className="fill-current" size={20} /> {activeTab === 'candidate' ? t('hero.candidate.ctaDisplay') : t('hero.company.ctaDisplay')}
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                            <Play className="fill-current" size={20} /> {activeTab === 'candidate' ? t('hero.candidate.ctaDemo') : t('hero.company.ctaDemo')}
                        </button>
                    </div>
                    <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-400 font-medium">
                        <Shield className="text-green-500" size={16} /> {t('hero.security')}
                    </div>
                </div>
            </div>

            <div id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12 max-w-3xl mx-auto">
                        <div className="inline-flex bg-slate-100 p-1 rounded-xl mb-8">
                            <button
                                onClick={() => setActiveTab('candidate')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'candidate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Para Candidatos
                            </button>
                            <button
                                onClick={() => setActiveTab('company')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'company' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Para Empresas (RH)
                            </button>
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 animate-fade-in">{t('features.title')}</h2>
                        <p className="text-lg text-slate-500 animate-fade-in">{t('features.subtitle')}</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                        {activeTab === 'candidate' ? (
                            <>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <Database className="text-indigo-600" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.candidate.db.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.candidate.db.desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <TrendingUp className="text-emerald-500" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.candidate.ab.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.candidate.ab.desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <Zap className="text-amber-500" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.candidate.local.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.candidate.local.desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <FileText className="text-blue-500" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.candidate.match.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.candidate.match.desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <Mic className="text-rose-500" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.candidate.sim.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.candidate.sim.desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <BookOpen className="text-purple-500" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.candidate.study.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.candidate.study.desc')}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <Target className="text-indigo-600" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.company.ranking.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.company.ranking.desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <Search className="text-emerald-500" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.company.search.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.company.search.desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <Users className="text-amber-500" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.company.fit.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.company.fit.desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <Code className="text-blue-500" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.company.tests.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.company.tests.desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <PieChart className="text-rose-500" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.company.dash.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.company.dash.desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left h-full shadow-sm">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                        <Briefcase className="text-purple-500" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{t('features.company.jobs.title')}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{t('features.company.jobs.desc')}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div id="plans" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">{t('plans.title')}</h2>
                        <p className="text-slate-500">{t('plans.subtitle')}</p>
                    </div>
                    <div className={`grid gap-8 mx-auto transition-all duration-300 ${activeTab === 'candidate' ? 'md:grid-cols-2 max-w-4xl' : 'md:grid-cols-3 max-w-6xl'}`}>
                        {activeTab === 'candidate' ? (
                            <>
                                {/* Starter Plan */}
                                <div className="p-8 rounded-3xl border flex flex-col relative overflow-hidden text-left h-full transition-all duration-300 bg-white border-slate-200 shadow-sm hover:shadow-md">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t('plans.candidate.starter.name')}</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-extrabold text-slate-900">{t('plans.candidate.starter.price')}</span>
                                    </div>
                                    <ul className="space-y-4 mb-8 flex-1">
                                        {t('plans.candidate.starter.features').map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                                                <CircleCheck className="text-slate-400" size={16} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-4 rounded-xl font-bold transition-all transform active:scale-95 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200">
                                        {t('plans.candidate.starter.btn')}
                                    </button>
                                </div>

                                {/* Pro Plan */}
                                <div className="p-8 rounded-3xl border flex flex-col relative overflow-hidden text-left h-full transition-all duration-300 bg-white border-indigo-200 shadow-xl scale-105 z-10 ring-4 ring-indigo-50">
                                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t('plans.candidate.pro.name')}</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-extrabold text-slate-900">{t('plans.candidate.pro.price')}</span>
                                        <span className="text-slate-500">{t('plans.candidate.pro.period')}</span>
                                    </div>
                                    <ul className="space-y-4 mb-8 flex-1">
                                        {t('plans.candidate.pro.features').map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                                                <CircleCheck className="text-indigo-600" size={16} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-4 rounded-xl font-bold transition-all transform active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                                        {t('plans.candidate.pro.btn')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Recruiter Plan - Centered or taking up space? */}
                                <div className="md:col-start-2 p-8 rounded-3xl border flex flex-col relative overflow-hidden text-left h-full transition-all duration-300 bg-white border-indigo-200 shadow-xl ring-4 ring-indigo-50">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t('plans.company.recruiter.name')}</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-extrabold text-slate-900">{t('plans.company.recruiter.price')}</span>
                                        <span className="text-slate-500">{t('plans.company.recruiter.period')}</span>
                                    </div>
                                    <ul className="space-y-4 mb-8 flex-1">
                                        {t('plans.company.recruiter.features').map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                                                <CircleCheck className="text-indigo-600" size={16} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-4 rounded-xl font-bold transition-all transform active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                                        {t('plans.company.recruiter.btn')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div id="about" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl rotate-3 hover:rotate-6 transition">
                        <Sparkles size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('about.title')}</h2>
                    <p className="text-lg text-slate-500 leading-loose mb-12">
                        {t('about.subtitle')}
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-slate-50 rounded-2xl">
                            <h4 className="font-bold text-slate-900 mb-2">{t('about.cards.privacy.title')}</h4>
                            <p className="text-sm text-slate-500">{t('about.cards.privacy.desc')}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl">
                            <h4 className="font-bold text-slate-900 mb-2">{t('about.cards.results.title')}</h4>
                            <p className="text-sm text-slate-500">{t('about.cards.results.desc')}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl">
                            <h4 className="font-bold text-slate-900 mb-2">{t('about.cards.multidisciplinary.title')}</h4>
                            <p className="text-sm text-slate-500">{t('about.cards.multidisciplinary.desc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800 mt-auto w-full">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="mb-4">
                                <div className="bg-white rounded-lg p-1.5 inline-block">
                                    <img alt="Apto" className="h-12 w-auto" src="/assets/logo-CTLpmGEx.png" />
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-500 mb-6">
                                {t('footer.description')}
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition">
                                    <Twitter size={16} />
                                </a>
                                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition">
                                    <Linkedin size={16} />
                                </a>
                                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition">
                                    <Github size={16} />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-wider">{t('footer.product.title')}</h4>
                            <ul className="space-y-3 text-sm">
                                {t('footer.product.items').map((item, idx) => (
                                    <li key={idx}><a href="#" className="hover:text-indigo-400 transition">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-wider">{t('footer.resources.title')}</h4>
                            <ul className="space-y-3 text-sm">
                                {t('footer.resources.items').map((item, idx) => (
                                    <li key={idx}><a href="#" className="hover:text-indigo-400 transition">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-wider">{t('footer.legal.title')}</h4>
                            <ul className="space-y-3 text-sm">
                                {t('footer.legal.items').map((item, idx) => (
                                    <li key={idx}><a href="#" className="hover:text-indigo-400 transition">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <span>{t('footer.copyright')}</span>
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> v4.3 Stable</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
