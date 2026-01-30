import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
   return (
      <Routes>
         {/* Public Routes */}
         <Route path="/login" element={<SignIn />} />
         <Route path="/signup" element={<SignUp />} />

         {/* Protected Routes - wrap existing routes */}
         {/* Note: In a workshop setting, we might want the dashboard to be visible to guests? 
         The prompt implies "Protected Route" usage. 
         If I wrap Dashboard in ProtectedRoute, guests can't see it.
         But the existing app had 'Guest' login. 
         The workflow explicitly says:
         <Route path="/" element={<ProtectedRoute><MainComponent /></ProtectedRoute>} />
         So I will enforce it.
      */}
         <Route path="/" element={
            <ProtectedRoute>
               <Dashboard />
            </ProtectedRoute>
         } />

         {/* Fallback */}
         <Route path="*" element={<SignIn />} />
      </Routes>
   );
}

export default App;