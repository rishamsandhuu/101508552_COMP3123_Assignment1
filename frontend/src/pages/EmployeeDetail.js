// src/pages/EmployeeDetail.js
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

// Fetch a single employee by ID
const fetchEmployee = async (id) => {
  const res = await api.get(`/emp/employees/${id}`);
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
    <div className="detail-card">
  <h2>Employee Detail</h2>

  {emp.profilePicture && (
    <img
      src={`https://one01508552-comp3123-assignment1.onrender.com${emp.profilePicture}`}
      width={120}
      height={120}
      className="profile-img"
    />
  )}

  <p><strong>Name:</strong> {emp.first_name} {emp.last_name}</p>
  <p><strong>Email:</strong> {emp.email}</p>
  <p><strong>Position:</strong> {emp.position}</p>
  <p><strong>Department:</strong> {emp.department}</p>
  <p><strong>Salary:</strong> {emp.salary}</p>
  <p><strong>Date:</strong> {new Date(emp.date_of_joining).toLocaleDateString()}</p>

  <button onClick={() => navigate('/employees')}>Back</button>
</div>
  );
};

export default EmployeeDetail;