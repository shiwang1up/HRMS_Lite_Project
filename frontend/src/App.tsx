import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeList from './components/EmployeeList';
import AttendanceTracking from './components/AttendanceTracking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/employees" replace />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="attendance" element={<AttendanceTracking />} />
          <Route path="*" element={<Navigate to="/employees" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
