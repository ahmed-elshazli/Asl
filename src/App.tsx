import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  // حالة تسجيل الدخول الأساسية فقط
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <AppRoutes 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated} 
      />
    </Router>
  );
}