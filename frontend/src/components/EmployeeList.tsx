import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../api';

export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  designation: string;
  date_of_joining: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
    designation: '',
    date_of_joining: ''
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.data[0] || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee.');
      }
    }
  };

  const openFormModal = (emp?: Employee) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData({ ...emp });
    } else {
      setEditingEmployee(null);
      setFormData({
        employee_id: '', full_name: '', email: '',
        department: 'Engineering', designation: '', date_of_joining: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, formData);
      } else {
        await api.post('/employees', formData);
      }
      setIsModalOpen(false);
      fetchEmployees();
    } catch (error: any) {
      console.error('Error saving employee:', error);
      alert(error.response?.data?.detail || 'Failed to save employee.');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter ? emp.department === departmentFilter : true;
    return matchesSearch && matchesDept;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <button className="btn btn-primary" onClick={() => openFormModal()}>
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div className="card mb-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-secondary" size={18} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-64">
            <select 
              className="form-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading employees...</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No employees found.</td>
                </tr>
              ) : (
                filteredEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td><span className="badge badge-neutral">{emp.employee_id}</span></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{emp.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.date_of_joining}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-icon-only text-secondary" onClick={() => openFormModal(emp)}>
                        <Edit2 size={18} />
                      </button>
                      <button className="btn btn-icon-only btn-danger" onClick={() => handleDelete(emp.id)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="page-title mb-4">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group col-span-2 sm:col-span-1">
                  <label className="form-label">Employee ID</label>
                  <input required type="text" className="form-input" value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} disabled={!!editingEmployee} />
                </div>
                <div className="form-group col-span-2 sm:col-span-1">
                  <label className="form-label">Full Name</label>
                  <input required type="text" className="form-input" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Email Address</label>
                  <input required type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group col-span-2 sm:col-span-1">
                  <label className="form-label">Department</label>
                  <select required className="form-select" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group col-span-2 sm:col-span-1">
                  <label className="form-label">Designation</label>
                  <input required type="text" className="form-input" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Date of Joining</label>
                  <input required type="date" className="form-input" value={formData.date_of_joining} onChange={e => setFormData({...formData, date_of_joining: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
