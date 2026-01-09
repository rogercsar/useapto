import React, { useRef, useState } from 'react';
import { User, Camera, Medal, Calendar, SquarePen, X, Save, Building, MapPin, Briefcase, Phone } from 'lucide-react';
import { useRecruiter } from '../../contexts/RecruiterContext';

const Profile = () => {
    const fileInputRef = useRef(null);
    const { recruiterProfile, updateProfile } = useRecruiter();
    const [isEditing, setIsEditing] = useState(false);

    // Local state for the form to handle changes before saving
    const [editForm, setEditForm] = useState(recruiterProfile);

    const handleEditClick = () => {
        setEditForm(recruiterProfile);
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile(editForm);
        setIsEditing(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfile({ avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-4 md:py-8 px-4 animate-fade-in flex-grow w-full relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Perfil do Recrutador</h2>
                    <p className="text-slate-500">Gerencie suas credenciais e visualize seu impacto.</p>
                </div>
                <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                    <SquarePen size={18} /> Editar Perfil
                </button>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 border-slate-200">
                            {recruiterProfile.avatar ? (
                                <img src={recruiterProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-slate-400" size={40} />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity mb-4">
                            <Camera className="text-white" size={24} />
                        </div>
                        <input ref={fileInputRef} accept="image/*" className="hidden" type="file" onChange={handleImageChange} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{recruiterProfile.name}</h3>
                    <p className="text-sm text-slate-500 mb-1">{recruiterProfile.role} at {recruiterProfile.company}</p>
                    <p className="text-xs text-slate-400 mb-4">{recruiterProfile.email}</p>

                    <div className="w-full text-left bg-slate-50 p-4 rounded-xl space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={14} className="text-indigo-500" /> {recruiterProfile.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin size={14} className="text-indigo-500" /> {recruiterProfile.address}
                        </div>
                    </div>

                    <div className="flex gap-4 w-full justify-center">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-indigo-600">1</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Vagas</span>
                        </div>
                        <div className="w-px bg-slate-200"></div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-emerald-600">1</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Candidatos</span>
                        </div>
                    </div>
                </div>

                {/* ... existing stats structure ... */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="h-full flex flex-col justify-center">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Medal className="text-indigo-600" size={20} /> Estatísticas de Impacto
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <div className="text-3xl font-bold text-indigo-700 mb-1">9%</div>
                                <div className="text-sm text-indigo-900 font-medium">Média de Compatibilidade</div>
                                <div className="text-xs text-indigo-400 mt-1">Qualidade do seu pipeline</div>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="text-3xl font-bold text-emerald-700 mb-1 capitalize truncate">Recursos Humanos</div>
                                <div className="text-sm text-emerald-900 font-medium">Área Mais Ativa</div>
                                <div className="text-xs text-emerald-400 mt-1">Onde você mais contrata</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar className="text-slate-500" size={20} /> Atividade Recente da Conta
                </h3>
                <p className="text-slate-500 text-sm">Registro de atividades de recrutamento e gerenciamento.</p>
                <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <div className="text-sm">
                            <span className="font-bold text-slate-700">Nova vaga criada:</span> Auxiliar de RH
                            <span className="text-slate-400 ml-2 text-xs">06/01/2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Editar Perfil</h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Empresa</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            name="company"
                                            value={editForm.company}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cargo</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            name="role"
                                            value={editForm.role}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email (Apenas Leitura)</label>
                                    <div className="relative">
                                        <input
                                            value={editForm.email}
                                            readOnly
                                            className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Endereço</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        name="address"
                                        value={editForm.address}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2">
                                    <Save size={16} /> Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
