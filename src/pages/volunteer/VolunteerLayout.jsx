import { useLocation, Navigate } from 'react-router-dom';
import { Package, Map, BarChart2, BookOpen } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import AvailableSurplus from './AvailableSurplus';
import TodayRoute from './TodayRoute';
import DemandForecast from './DemandForecast';
import DistributionLog from './DistributionLog';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: 'available', label: 'Available Surplus', icon: Package },
  { path: 'route',     label: "Today's Route",     icon: Map },
  { path: 'forecast',  label: 'Demand Forecast',   icon: BarChart2 },
  { path: 'log',       label: 'Distribution Log',  icon: BookOpen },
];

export default function VolunteerLayout() {
  const { pathname } = useLocation();
  const { currentUser } = useApp();
  if (currentUser?.role === 'supplier') return <Navigate to="/supplier/log" replace />;
  if (currentUser?.role === 'ops') return <Navigate to="/ops/overview" replace />;
  const sub = pathname.split('/').pop();

  let content;
  if (sub === 'route')    content = <TodayRoute />;
  else if (sub === 'forecast') content = <DemandForecast />;
  else if (sub === 'log') content = <DistributionLog />;
  else                    content = <AvailableSurplus />;

  return (
    <Layout navItems={navItems} basePath="/volunteer">
      {content}
    </Layout>
  );
}
