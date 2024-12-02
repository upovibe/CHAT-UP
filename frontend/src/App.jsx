import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import MainLayout from "./components/layouts/MainLayout";
import Friends from "./pages/Friends";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useAuth } from "./store/useAuth";
import Loading from "./components/ui/Loading";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <Loading />;
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">

      <Routes>
        {/* Signup route: Only accessible if the user is not logged in */}
        <Route 
          path="/signup" 
          element={!authUser ? <SignUp /> : <Navigate to="/" />} 
        />

        {/* Login route: Accessible to all users */}
        <Route 
          path="/login" 
          element={!authUser  ? <Login /> : <Navigate to="/" />} 
        />

        {/* Home route: Only accessible if logged in */}
        <Route 
          path="/" 
          element={authUser ? <MainLayout><Home /></MainLayout> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/friends" 
          element={authUser ? <MainLayout><Friends /></MainLayout> : <Navigate to="/login" />} 
        />
        
      </Routes>
    <Toaster/>
    </ThemeProvider>
  );
};

export default App;
