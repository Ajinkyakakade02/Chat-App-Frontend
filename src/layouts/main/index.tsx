// @ts-nocheck
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  // No auto-redirect – let the login/register pages render freely.
  return <Outlet />;
};

export default MainLayout;