// src/pages/EmployeeForm.js
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance';

// Fetch a single employee by ID
const fetchEmployee = async (id) => {
  const res = await api.get(`/api/emp/employees/${id}`);
  return res.data;
};

const EmployeeForm = () => {
  const { id } = useParams(); // if present => edit mode
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    salary: '',
    date_of_joining: '',
    department: ''
  });
  const [file, setFile] = useState(null);

  // Load employee data when editing
  const { data: existingEmployee } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id),
    enabled: isEdit
  });

  useEffect(() => {
    if (existingEmployee) {
      setForm({
        first_name: existingEmployee.first_name || '',
        last_name: existingEmployee.last_name || '',
        email: existingEmployee.email || '',
        position: existingEmployee.position || '',
        salary: existingEmployee.salary || '',
        date_of_joining: existingEmployee.date_of_joining
          ? existingEmployee.date_of_joining.substring(0, 10)
          : '',
        department: existingEmployee.department || ''
      });
    }
  }, [existingEmployee]);

  // Create or update employee
  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (file) {
        formData.append('profilePicture', file);
      }

      if (isEdit) {
        await api.put(`/api/emp/employees/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/api/emp/employees', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/employees');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Position</label>
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Salary</label>
          <input
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date of Joining</label>
          <input
            name="date_of_joining"
            type="date"
            value={form.date_of_joining}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Department</label>
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          {mutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;