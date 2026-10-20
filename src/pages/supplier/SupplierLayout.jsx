import { useLocation } from 'react-router-dom';
import { ClipboardList, History, User } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import LogSurplus from './LogSurplus';
import SurplusHistory from './SurplusHistory';
import SupplierProfile from './SupplierProfile';

const navItems = [
  { path: 'log',     label: 'Log Surplus',  icon: ClipboardList },
  { path: 'history', label: 'My History',   icon: History },
  { path: 'profile', label: 'My Profile',   icon: User },
];

export default function SupplierLayout() {
  const { pathname } = useLocation();
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
