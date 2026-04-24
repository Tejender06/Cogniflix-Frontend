import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import MoviesPage from "./pages/MoviesPage";
import TvShowsPage from "./pages/TvShowsPage";
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

function App() {
  useEffect(() => {
    wakeUpBackend();
  }, []);

  return (
    <AuthProvider>
      <MovieProvider>
        <Router>
          <Routes>
            {/* Unauthenticated Routes */}
            <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
            <Route path="/signup" element={<AuthRedirect><SignupPage /></AuthRedirect>} />
            
            {/* Authenticated Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="movies" element={<MoviesPage />} />
                <Route path="tv" element={<TvShowsPage />} />
                <Route path="new" element={<NewAndPopularPage />} />
                <Route path="my-list" element={<MyListPage />} />
                <Route path="movie/:id" element={<MovieInfoPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;