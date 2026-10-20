import { useLocation } from 'react-router-dom';
import { LayoutDashboard, Navigation, Map, Building2, Users, FileBarChart } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import OpsOverview from './OpsOverview';
import OpsVolunteerRoutes from './OpsVolunteerRoutes';
import OpsSupplyMap from './OpsSupplyMap';
import OpsPartners from './OpsPartners';
import OpsProfiles from './OpsProfiles';
import OpsReports from './OpsReports';

const navItems = [
  { path: 'overview', label: 'Overview', icon: LayoutDashboard },
  { path: 'routes', label: 'Volunteer Routes', icon: Navigation },
  { path: 'map', label: 'Supply Map', icon: Map },
  { path: 'partners', label: 'NGO Partners', icon: Building2 },
  { path: 'profiles', label: 'User Directory', icon: Users },
  { path: 'reports', label: 'Reports', icon: FileBarChart },
];

export default function OpsLayout() {
  const { pathname } = useLocation();
  const sub = pathname.split('/').pop();

  let content;
  if (sub === 'routes') content = <OpsVolunteerRoutes />;
  else if (sub === 'map') content = <OpsSupplyMap />;
  else if (sub === 'partners') content = <OpsPartners />;
  else if (sub === 'profiles') content = <OpsProfiles />;
  else if (sub === 'reports') content = <OpsReports />;
  else content = <OpsOverview />;

  return (
    <Layout navItems={navItems} basePath="/ops">
      {content}
    </Layout>
  );
}
