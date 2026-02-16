import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Header from './components/layout/Header/Header';
import Landing from './pages/Landing/Landing';
import Onboarding from './pages/Onboarding/Onboarding';
import ProfileResults from './pages/ProfileResults/ProfileResults';
import Community from './pages/Community/Community';
import Profile from './pages/Profile/Profile';
import Auth from './pages/Auth/Auth';
import Admin from './pages/Admin/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/results" element={<ProfileResults />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
