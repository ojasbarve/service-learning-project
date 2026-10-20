import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import SupplierLayout from './pages/supplier/SupplierLayout';
import VolunteerLayout from './pages/volunteer/VolunteerLayout';
import OpsLayout from './pages/ops/OpsLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Supplier portal — default to /log */}
      <Route path="/supplier" element={<Navigate to="/supplier/log" replace />} />
      <Route path="/supplier/:sub" element={<SupplierLayout />} />

      {/* Volunteer portal — default to /available */}
      <Route path="/volunteer" element={<Navigate to="/volunteer/available" replace />} />
      <Route path="/volunteer/:sub" element={<VolunteerLayout />} />

      {/* Ops dashboard — default to /overview */}
      <Route path="/ops" element={<Navigate to="/ops/overview" replace />} />
      <Route path="/ops/:sub" element={<OpsLayout />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
