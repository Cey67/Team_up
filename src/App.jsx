import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage/HomePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MatchesPage from './pages/match/MatchesPage';
import MatchDetailPage from './pages/match/MatchDetailPage';
import EffectifPage from './pages/effectif/EffectifPage';
import StatistiquesPage from './pages/statistiques/StatistiquesPage';
import PresencesPage from './pages/presences/PresencesPage';
import MessageriePage from './pages/messagerie/MessageriePage';
import ProfilPage from './pages/profil/ProfilPage';
import ParametresPage from './pages/parametres/ParametresPage';
import Layout from './components/layout/Layout';

/**
 * Composant principal de l'application Team Up
 * Gère le routage avec et sans sidebar selon les pages
 * La sidebar n'est pas affichée sur les pages d'authentification (login/register)
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes sans sidebar (authentification) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Routes avec sidebar (pages principales) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/match" element={<MatchesPage />} />
          <Route path="/match/:id" element={<MatchDetailPage />} />
          <Route path="/effectif" element={<EffectifPage />} />
          <Route path="/statistiques" element={<StatistiquesPage />} />
          <Route path="/presences" element={<PresencesPage />} />
          <Route path="/messagerie" element={<MessageriePage />} />
          <Route path="/parametres" element={<ParametresPage />} />
          <Route path="/profil" element={<ProfilPage />} />
        </Route> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
