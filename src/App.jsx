import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import RecruiterLayout from './layouts/RecruiterLayout';
import Dashboard from './pages/recruiter/Dashboard';
import Jobs from './pages/recruiter/Jobs';
import Candidates from './pages/recruiter/Candidates';
import Compare from './pages/recruiter/Compare';
import Reports from './pages/recruiter/Reports';
import Profile from './pages/recruiter/Profile';
import JobDetails from './pages/recruiter/JobDetails';
import CandidateDetails from './pages/recruiter/CandidateDetails';
import Interview from './pages/candidate/Interview';
import PublicJobs from './pages/public/PublicJobs';
import PublicJobApply from './pages/public/PublicJobApply';

import { RecruiterProvider } from './contexts/RecruiterContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <RecruiterProvider>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/interview/:candidateId" element={<Interview />} />

          {/* Public Job Board */}
          <Route path="/jobs" element={<PublicJobs />} />
          <Route path="/jobs/:id/apply" element={<PublicJobApply />} />

          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vagas" element={<Jobs />} />
            <Route path="vagas/:id" element={<JobDetails />} />
            <Route path="candidatos" element={<Candidates />} />
            <Route path="candidatos/:id" element={<CandidateDetails />} />
            <Route path="comparar" element={<Compare />} />
            <Route path="relatorios" element={<Reports />} />
            <Route path="perfil" element={<Profile />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </RecruiterProvider>
  );
}

export default App;
