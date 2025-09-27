import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to Home page
  return <Navigate to="/" replace />;
};

export default Index;
