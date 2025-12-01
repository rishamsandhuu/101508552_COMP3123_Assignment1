// src/pages/EmployeeDetail.js
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

// Fetch a single employee by ID
const fetchEmployee = async (id) => {
  const res = await api.get(`/api/backend/emp/employees/${id}`);
  return res.data;
};

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: emp, isLoading, isError } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id)
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !emp) return <p>Employee not found</p>;

  return (
    <div>
      <h2>Employee Detail</h2>

      {emp.profilePicture && (
        <img
          src={`/api/backend${emp.profilePicture}`}
          alt="profile"
          width={100}
          height={100}
        />
      )}

      <p><strong>Name:</strong> {emp.first_name} {emp.last_name}</p>
      <p><strong>Email:</strong> {emp.email}</p>
      <p><strong>Position:</strong> {emp.position}</p>
      <p><strong>Department:</strong> {emp.department}</p>
      <p><strong>Salary:</strong> {emp.salary}</p>
      <p><strong>Date of Joining:</strong> {new Date(emp.date_of_joining).toLocaleDateString()}</p>

      <button onClick={() => navigate('/employees')}>Back to list</button>
    </div>
  );
};

export default EmployeeDetail;