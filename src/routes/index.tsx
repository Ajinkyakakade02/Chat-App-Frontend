// @ts-nocheck
import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";
import MainLayout from "../layouts/main";

// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

// Authentication check
const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user;
};

export default function Router() {
  return useRoutes([
    {
      path: '/auth',
      element: <MainLayout />,
      children: [
        { element: <LoginPage />, path: 'login' },
        { element: <RegisterPage />, path: 'register' },
        { element: <ResetPasswordPage />, path: 'reset-password' },
        { element: <NewPasswordPage />, path: 'new-password' },
      ]
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { 
          element: isAuthenticated() ? <Navigate to={DEFAULT_PATH} replace /> : <Navigate to="/auth/login" replace />, 
          index: true 
        },
        { path: "app", element: isAuthenticated() ? <GeneralApp /> : <Navigate to="/auth/login" replace /> },
        { path: "settings", element: isAuthenticated() ? <Settings /> : <Navigate to="/auth/login" replace /> },
        { path: "group", element: isAuthenticated() ? <GroupPage /> : <Navigate to="/auth/login" replace /> },
        { path: "call", element: isAuthenticated() ? <CallPage /> : <Navigate to="/auth/login" replace /> },
        { path: "profile", element: isAuthenticated() ? <ProfilePage /> : <Navigate to="/auth/login" replace /> },
        { path: "user/:userId", element: isAuthenticated() ? <UserProfilePage /> : <Navigate to="/auth/login" replace /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/chat/:chatId',
      element: isAuthenticated() ? <ChatLayout /> : <Navigate to="/auth/login" replace />,
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

// Lazy imports
const GeneralApp = Loadable(lazy(() => import("../pages/dashboard/GeneralApp")));
const ChatLayout = Loadable(lazy(() => import("../layouts/ChatLayout")));
const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const ResetPasswordPage = Loadable(lazy(() => import("../pages/auth/ResetPassword")));
const NewPasswordPage = Loadable(lazy(() => import("../pages/auth/NewPassword")));
const GroupPage = Loadable(lazy(() => import("../pages/dashboard/Group")));
const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));
const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")));
const ProfilePage = Loadable(lazy(() => import("../pages/dashboard/Profile")));
const UserProfilePage = Loadable(lazy(() => import("../pages/UserProfile")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
