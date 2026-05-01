/*
FILE: App.tsx

PURPOSE:
Root application component wrapping providers and global layout.

FLOW:
Component -> API Call -> Backend -> Response -> UI Render

USED BY:
main.jsx

NEXT FLOW:
AuthContext, MovieContext, AppRoutes

*/
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import MoviesPage from "./pages/MoviesPage";
import WebSeriesPage from "./pages/WebSeriesPage";
import NewAndPopularPage from "./pages/NewAndPopularPage";
import MyListPage from "./pages/MyListPage";
import MovieInfoPage from "./pages/MovieInfoPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { MovieProvider } from "./context/MovieContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { wakeUpBackend } from "./services/authService";

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "./components/AnimatedPage";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Unauthenticated Routes */}
        <Route path="/login" element={<AuthRedirect><AnimatedPage><LoginPage /></AnimatedPage></AuthRedirect>} />
        <Route path="/signup" element={<AuthRedirect><AnimatedPage><SignupPage /></AnimatedPage></AuthRedirect>} />
        
        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
            <Route path="movies" element={<AnimatedPage><MoviesPage /></AnimatedPage>} />
            <Route path="web-series" element={<AnimatedPage><WebSeriesPage /></AnimatedPage>} />
            <Route path="new" element={<AnimatedPage><NewAndPopularPage /></AnimatedPage>} />
            <Route path="my-list" element={<AnimatedPage><MyListPage /></AnimatedPage>} />
            <Route path="movie/:id" element={<AnimatedPage><MovieInfoPage /></AnimatedPage>} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    wakeUpBackend();
  }, []);

  return (
    <AuthProvider>
      <MovieProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;