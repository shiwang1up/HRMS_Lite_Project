import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../api';
import type { Employee } from './EmployeeList';

interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: 'Present' | 'Absent';
}

const AttendanceTracking: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all employees for the dropdown
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/employees');
        setEmployees(response.data.data[0] || []);
        if (response.data.data[0]?.length > 0) {
          setSelectedEmployee(response.data.data[0][0].employee_id);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendance(selectedEmployee);
    }
  }, [selectedEmployee]);

  const fetchAttendance = async (empId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance/${empId}`);
      setAttendance(response.data.data[0] || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (status: 'Present' | 'Absent') => {
    if (!selectedEmployee) return alert('Select an employee first');
    
    try {
      await api.post('/attendance', {
        employee_id: selectedEmployee,
        date: selectedDate,
        status
      });
      fetchAttendance(selectedEmployee);
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      alert(error.response?.data?.detail || 'Failed to mark attendance.');
    }
  };

  const currentEmployee = employees.find(e => e.employee_id === selectedEmployee);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Attendance Tracking</h1>
      </div>

      <div className="grid grid-cols-2 gap-6" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)' }}>
        
        {/* Left Col: Mark Attendance Form */}
        <div className="card h-fit">
          <h2 className="page-title mb-4" style={{ fontSize: '1.25rem' }}>Mark Attendance</h2>
          
          <div className="form-group">
            <label className="form-label">Select Employee</label>
            <select 
              className="form-select"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.length === 0 ? (
                <option value="">No employees found</option>
              ) : (
                employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.full_name} ({emp.employee_id})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Attendance Date</label>
            <input 
              type="date" 
              className="form-input" 
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]} // prevent future dates
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              className="btn flex-1" 
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)' }}
              onClick={() => markAttendance('Present')}
              disabled={!selectedEmployee}
            >
              <CheckCircle size={18} /> Mark Present
            </button>
            <button 
              className="btn flex-1"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' }}
              onClick={() => markAttendance('Absent')}
              disabled={!selectedEmployee}
            >
              <XCircle size={18} /> Mark Absent
            </button>
          </div>
        </div>

        {/* Right Col: Personal Records */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="page-title" style={{ fontSize: '1.25rem' }}>
              Attendance Records <span className="text-secondary" style={{ fontSize: '1rem', fontWeight: 400 }}>{currentEmployee ? `- ${currentEmployee.full_name}` : ''}</span>
            </h2>
          </div>
          
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', padding: '2rem' }}>Loading records...</td>
                  </tr>
                ) : attendance.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', padding: '2rem' }}>No attendance records found for this employee.</td>
                  </tr>
                ) : (
                  attendance.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                    <tr key={record.id}>
                      <td style={{ fontWeight: 500 }}>{record.date}</td>
                      <td>
                        <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttendanceTracking;
