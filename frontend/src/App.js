// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetail from './pages/EmployeeDetail';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div style={{ padding: 20 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<EmployeeList />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/employees/new" element={<EmployeeForm />} />
                <Route path="/employees/:id" element={<EmployeeDetail />} />
                <Route path="/employees/:id/edit" element={<EmployeeForm />} />
              </Route>

              {/* fallback */}
              <Route path="*" element={<Login />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;