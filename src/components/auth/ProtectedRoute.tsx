import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading, openLoginModal } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            openLoginModal();
        }
    }, [isLoading, isAuthenticated, openLoginModal]);

    if (isLoading) {
        return null; // Or a centered loading spinner if desired
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
