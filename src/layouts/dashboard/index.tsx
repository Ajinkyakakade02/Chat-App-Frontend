// @ts-nocheck
import { Navigate, Outlet } from "react-router-dom";
import { Stack } from '@mui/material';
import SideBar from "./SideBar";

const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user;
};

const DashboardLayout = () => {
  if (!isAuthenticated()) {
    return <Navigate to='/auth/login' replace />;
  }

  return (
    <Stack direction='row'>
      <SideBar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
