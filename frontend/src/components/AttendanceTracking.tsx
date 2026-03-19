import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Calendar, CalendarClock } from 'lucide-react';
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Attendance</h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage daily employee attendance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Mark Attendance Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CalendarClock size={100} />
            </div>
            
            <h2 className="text-lg font-bold text-slate-900 mb-6 relative z-10">Mark Attendance</h2>
            
            <div className="space-y-4 relative z-10">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Select Member</label>
                <select 
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.7rem] bg-[position:right_1rem_center] bg-no-repeat pr-8"
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

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => markAttendance('Present')}
                  disabled={!selectedEmployee}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={18} />
                  <span>Present</span>
                </button>
                <button 
                  onClick={() => markAttendance('Absent')}
                  disabled={!selectedEmployee}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={18} />
                  <span>Absent</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Stats or Extra Info */}
          {currentEmployee && (
            <div className="bg-gradient-to-br from-indigo-500 to-primary-600 p-6 rounded-2xl shadow-sm text-white">
              <h3 className="font-semibold text-lg opacity-90 mb-1">Selected Member</h3>
              <p className="text-2xl font-bold mb-1">{currentEmployee.full_name}</p>
              <p className="text-primary-100 text-sm mb-4">{currentEmployee.designation} • {currentEmployee.department}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Total Present</p>
                  <p className="text-xl font-bold">{attendance.filter(a => a.status === 'Present').length}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Total Absent</p>
                  <p className="text-xl font-bold">{attendance.filter(a => a.status === 'Absent').length}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Personal Records */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-primary-600">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Attendance Log</h2>
              {currentEmployee && (
                <p className="text-sm text-slate-500">Showing records for <span className="font-medium text-slate-700">{currentEmployee.full_name}</span></p>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <p>Loading records...</p>
                      </div>
                    </td>
                  </tr>
                ) : attendance.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <div className="bg-slate-50 p-4 rounded-full mb-2">
                          <Calendar size={28} className="text-slate-400" />
                        </div>
                        <p className="font-medium text-slate-700">No records found</p>
                        <p className="text-sm">This employee has no attendance history.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  attendance.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">
                          {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                          ${record.status === 'Present' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-red-50 text-red-700 border-red-200'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${record.status === 'Present' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
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
