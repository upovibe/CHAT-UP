import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import MainLayout from "./components/layouts/MainLayout";
import Friends from "./pages/Friends";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import { useAuth } from "./store/useAuth";
import Loading from "./components/ui/Loading";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <Loading />;
  };

  return (
    <>
    <div>
      <Routes>
        {/* Signup route: Only accessible if the user is not logged in */}
        <Route 
          path="/signup" 
          element={!authUser ? <SignUp /> : <Navigate to="/" />} 
        />

        {/* Login route: Accessible to all users */}
        <Route 
          path="/login" 
          element={<Login />} 
        />

        {/* Home route: Only accessible if logged in */}
        <Route 
          path="/" 
          element={authUser ? <MainLayout><Home /></MainLayout> : <Navigate to="/login" />} 
        />

        {/* Protected routes: Only accessible if logged in */}
        <Route 
          path="/profile" 
          element={authUser ? <MainLayout><Profile /></MainLayout> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/friends" 
          element={authUser ? <MainLayout><Friends /></MainLayout> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/settings" 
          element={authUser ? <MainLayout><Settings /></MainLayout> : <Navigate to="/login" />} 
        />
        
      </Routes>
    <Toaster />
    </div>
    </>
  );
};

export default App;
