import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Header from './components/layout/Header/Header';
import Landing from './pages/Landing/Landing';
import Onboarding from './pages/Onboarding/Onboarding';
import ProfileResults from './pages/ProfileResults/ProfileResults';
import Community from './pages/Community/Community';
import Profile from './pages/Profile/Profile';
import Auth from './pages/Auth/Auth';
import Admin from './pages/Admin/Admin';
import Learn from './pages/Learn/Learn';
import ArticlePage from './pages/Learn/ArticlePage';

function HomeRoute() {
  const { user } = useUser();
  if (user) return <Navigate to="/community" replace />;
  return <Landing />;
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/results" element={<ProfileResults />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:id" element={<ArticlePage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
