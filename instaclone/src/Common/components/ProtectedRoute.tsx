import { Navigate, Outlet } from "react-router";
// import { useAuth } from "../auth/useAuth";

function ProtectedRoute(props: { ignoreAuth?: boolean }) {
    const { ignoreAuth } = props;
    if (!ignoreAuth) {
        //   const { user, loading } = useAuth();
        const { user, loading } = { user: null, loading: false }; // TODO: implement auth

        if (loading) {
            return <div>Loading...</div>;
        }

        if (!user) {
            return <Navigate to="/login" replace />;
        }
    }

    return <Outlet />;
}

export default ProtectedRoute;