import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ProviderDashboard from './ProviderDashboard';
import CustomerDashboard from './CustomerDashboard';
import CompleteProfile from '../../components/CompleteProfile';

export default function Dashboard() {
  const { isAuthenticated, role, provider } = useSelector(s => s.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'provider') {
    // Check if provider has completed their profile
    if (!provider?.isVerified) {
      return <CompleteProfile />;
    }
    return <ProviderDashboard />;
  }

  // default: customer
  return <CustomerDashboard />;
}
