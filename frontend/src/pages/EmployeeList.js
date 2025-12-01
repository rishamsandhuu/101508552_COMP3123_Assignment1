// src/pages/EmployeeList.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance';

// Fetch employees (with optional filters)
const fetchEmployees = async (searchParams) => {
  const { department, position } = searchParams || {};
  const params = {};
  if (department) params.department = department;
  if (position) params.position = position;

  const url = department || position
    ? '/emp/employees/search'
    : '/emp/employees';

  const res = await api.get(url, { params });
  return res.data;
};

// Delete employee by ID
const deleteEmployee = async (id) => {
  await api.delete(`/emp/employees/${id}`);
};

const EmployeeList = () => {
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [search, setSearch] = useState({ department: '', position: '' });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: employees, isLoading, isError } = useQuery({
    queryKey: ['employees', search],
    queryFn: () => fetchEmployees(search)
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch({ department, position });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading employees...</p>;
  if (isError) return <p>Error loading employees</p>;

  return (
    <div>
      <h2>Employee List</h2>

      <button onClick={() => navigate('/employees/new')} style={{ marginBottom: 10 }}>
        Add Employee
      </button>

      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <div>
          <label>Department</label>
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="IT, HR..."
          />
        </div>
        <div>
          <label>Position</label>
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Manager, Developer..."
          />
        </div>
        <button type="submit" style={{ marginTop: 5 }}>Search</button>
      </form>

      <table border="1" cellPadding="5" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Profile</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Date of Joining</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees && employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp._id}>
                <td>
                  {emp.profilePicture && (
                    <img
                      src={`/api${emp.profilePicture}`}
                      alt="profile"
                      width={50}
                      height={50}
                    />
                  )}
                </td>
                <td>{emp.first_name}</td>
                <td>{emp.last_name}</td>
                <td>{emp.email}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{emp.salary}</td>
                <td>{new Date(emp.date_of_joining).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => navigate(`/employees/${emp._id}`)}>View</button>{' '}
                  <button onClick={() => navigate(`/employees/${emp._id}/edit`)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(emp._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;