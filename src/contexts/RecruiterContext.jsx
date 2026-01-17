import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, saveData, STORES_ENUM } from '../services/db';

const RecruiterContext = createContext();

export const RecruiterProvider = ({ children }) => {
    const [recruiterProfile, setRecruiterProfile] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultProfile = {
        name: 'Recrutador',
        email: 'contato@empresa.com',
        phone: '(00) 00000-0000',
        company: 'Minha Empresa',
        role: 'Recrutador',
        address: 'Cidade - Estado',
        avatar: null
    };

    const defaultCandidates = [];

    const defaultJobs = [];

    // BroadcastChannel for cross-tab synchronization
    const syncChannel = new BroadcastChannel('apto_sync');

    useEffect(() => {
        const loadData = async () => {
            try {
                const profile = await getData(STORES_ENUM.PROFILE);
                const savedCandidates = await getData(STORES_ENUM.CANDIDATES);
                const savedJobs = await getData(STORES_ENUM.JOBS);

                // If profile exists but name is the old mock name, reset it
                if (profile && profile.name !== 'Roger César') {
                    setRecruiterProfile(profile);
                } else {
                    setRecruiterProfile(defaultProfile);
                    await saveData(STORES_ENUM.PROFILE, defaultProfile);
                }

                if (savedCandidates && savedCandidates.length > 0) {
                    // Filter out the old mock candidate with ID 1 if it matches the name
                    const sanitizedCandidates = savedCandidates
                        .filter(c => !(c.id === 1 && c.name === 'Roger Santos'))
                        .map((c, index) => ({
                            ...c,
                            id: c.id || Date.now() + index // Ensure ID exists
                        }));

                    setCandidates(sanitizedCandidates);
                    await saveData(STORES_ENUM.CANDIDATES, sanitizedCandidates);
                } else {
                    setCandidates(defaultCandidates);
                    await saveData(STORES_ENUM.CANDIDATES, defaultCandidates);
                }

                if (savedJobs && savedJobs.length > 0) {
                    // Filter out the old mock job with ID 1
                    const sanitizedJobs = savedJobs.filter(j => !(j.id === 1 && j.title === 'Auxiliar de RH'));
                    setJobs(sanitizedJobs);
                    await saveData(STORES_ENUM.JOBS, sanitizedJobs);
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
