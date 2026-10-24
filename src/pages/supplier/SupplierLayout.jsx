import { useLocation, Navigate } from 'react-router-dom';
import { ClipboardList, History, User } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import LogSurplus from './LogSurplus';
import SurplusHistory from './SurplusHistory';
import SupplierProfile from './SupplierProfile';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: 'log',     label: 'Log Surplus',  icon: ClipboardList },
  { path: 'history', label: 'My History',   icon: History },
  { path: 'profile', label: 'My Profile',   icon: User },
];

export default function SupplierLayout() {
  const { pathname } = useLocation();
  const { currentUser } = useApp();
  if (currentUser?.role === 'volunteer') return <Navigate to="/volunteer/available" replace />;
  const sub = pathname.split('/').pop();

  let content;
  if (sub === 'history') content = <SurplusHistory />;
  else if (sub === 'profile') content = <SupplierProfile />;
  else content = <LogSurplus />;

  return (
    <Layout navItems={navItems} basePath="/supplier">
      {content}
    </Layout>
  );
}
