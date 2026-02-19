import axios from 'axios';

export const getSanctionedUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:8080/api/admin/reports/users/banned', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log(response.data);
  return response.data;
};