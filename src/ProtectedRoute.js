import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hooks';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAppSelector((state) => state.auth);
  
  if (loading) {
    return (
      <div style={{ 
        padding: 24, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px',
        fontSize: '16px'
      }}>
        Loading...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}



