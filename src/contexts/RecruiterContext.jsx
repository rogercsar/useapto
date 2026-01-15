import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, saveData, STORES_ENUM } from '../services/db';

const RecruiterContext = createContext();

export const RecruiterProvider = ({ children }) => {
    const [recruiterProfile, setRecruiterProfile] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultProfile = {
        name: 'Roger César',
        email: 'rogercsardev@gmail.com',
        phone: '65999999999',
        company: 'Apto',
        role: 'Tech Recruiter',
        address: 'Av. Paulista, 1000 - São Paulo, SP',
        avatar: null
    };

    const defaultCandidates = [{
        id: 1,
        name: 'Roger Santos',
        job: 'Auxiliar de RH',
        email: 'rogercsar@outlook.com',
        phone: '65992693812',
        score: '9%',
        strengths: ['Comunicação', 'Proatividade'],
        gaps: ['Inglês Avançado', 'Power BI'],
        cvText: 'RESUMO PROFISSIONAL\nProfissional com 5 anos de experiência em RH, focado em R&S e DP. \n\nEXPERIÊNCIA\n- Auxiliar de RH | Empresa X (2020-Atual)\n- Assistente Administrativo | Empresa Y (2018-2020)\n\nFORMAÇÃO\n- Gestão de Recursos Humanos | UNIC (2019)',
        interview: {
            status: 'pending', // pending, completed
            score: null,
            summary: null,
            transcription: []
        }
    }];

    const defaultJobs = [
        {
            id: 1,
            title: "Auxiliar de RH",
            area: "hr",
            description: "Apoiar no processo de recrutamento e seleção para diferentes áreas do shopping...",
            createdAt: new Date().toISOString()
        }
    ];

    // BroadcastChannel for cross-tab synchronization
    const syncChannel = new BroadcastChannel('apto_sync');

    useEffect(() => {
        const loadData = async () => {
            try {
                const profile = await getData(STORES_ENUM.PROFILE);
                const savedCandidates = await getData(STORES_ENUM.CANDIDATES);
                const savedJobs = await getData(STORES_ENUM.JOBS);

                if (profile) {
                    setRecruiterProfile(profile);
                } else {
                    setRecruiterProfile(defaultProfile);
                    await saveData(STORES_ENUM.PROFILE, defaultProfile);
                }

                if (savedCandidates && savedCandidates.length > 0) {
                    // SANITIZATION: Ensure all candidates have IDs to prevent crashes
                    const sanitizedCandidates = savedCandidates.map((c, index) => ({
                        ...c,
                        id: c.id || Date.now() + index // Ensure ID exists
                    }));
                    setCandidates(sanitizedCandidates);

                    // If we found candidates without IDs, save the fixed version immediately
                    if (JSON.stringify(sanitizedCandidates) !== JSON.stringify(savedCandidates)) {
                        await saveData(STORES_ENUM.CANDIDATES, sanitizedCandidates);
                    }
                } else {
                    setCandidates(defaultCandidates);
                    await saveData(STORES_ENUM.CANDIDATES, defaultCandidates);
                }

                if (savedJobs && savedJobs.length > 0) {
                    setJobs(savedJobs);
                } else {
                    setJobs(defaultJobs);
                    await saveData(STORES_ENUM.JOBS, defaultJobs);
                }
            } catch (error) {
                console.error("Failed to load data from DB", error);
                setRecruiterProfile(defaultProfile);
                setCandidates(defaultCandidates);
                setJobs(defaultJobs);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        // Listen for sync messages from other tabs
        syncChannel.onmessage = (event) => {
            if (event.data === 'update_candidates') {
                console.log("Received sync event in this tab, reloading candidates...");
                getData(STORES_ENUM.CANDIDATES).then(saved => {
                    if (saved) setCandidates(saved);
                });
            } else if (event.data === 'update_jobs') {
                getData(STORES_ENUM.JOBS).then(saved => {
                    if (saved) setJobs(saved);
                });
            }
        };

        return () => syncChannel.close();
    }, []);

    const updateProfile = async (newData) => {
        const updated = { ...recruiterProfile, ...newData };
        setRecruiterProfile(updated);
        await saveData(STORES_ENUM.PROFILE, updated);
    };

    const updateCandidate = async (id, newData) => {
        // Ensure ID types match (string vs number)
        const updatedCandidates = candidates.map(cand => {
            // Loose comparison or explicit conversion
            if (cand.id.toString() === id.toString()) {
                return { ...cand, ...newData };
            }
            return cand;
        });

        setCandidates(updatedCandidates);
        await saveData(STORES_ENUM.CANDIDATES, updatedCandidates);
        syncChannel.postMessage('update_candidates');
    };

    const setCandidatesAndSave = async (newCandidatesOrUpdater) => {
        let updatedCandidates;
        if (typeof newCandidatesOrUpdater === 'function') {
            updatedCandidates = newCandidatesOrUpdater(candidates);
        } else {
            updatedCandidates = newCandidatesOrUpdater;
        }
        setCandidates(updatedCandidates);
        await saveData(STORES_ENUM.CANDIDATES, updatedCandidates);
    };

    const deleteCandidate = async (id) => {
        const updatedCandidates = candidates.filter(c => c.id !== id);
        setCandidates(updatedCandidates);
        await saveData(STORES_ENUM.CANDIDATES, updatedCandidates);
        syncChannel.postMessage('update_candidates');
    };

    const addJob = async (newJob) => {
        const jobWithId = { ...newJob, id: Date.now(), createdAt: new Date().toISOString() };
        const updatedJobs = [jobWithId, ...jobs];
        setJobs(updatedJobs);
        await saveData(STORES_ENUM.JOBS, updatedJobs);
        syncChannel.postMessage('update_jobs');
        return jobWithId;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Carregando dados...</div>;
    }

    return (
        <RecruiterContext.Provider value={{
            recruiterProfile,
            updateProfile,
            candidates,
            updateCandidate,
            setCandidates: setCandidatesAndSave,
            jobs,
            addJob,
            deleteCandidate
        }}>
            {children}
        </RecruiterContext.Provider>
    );
};

export const useRecruiter = () => useContext(RecruiterContext);
