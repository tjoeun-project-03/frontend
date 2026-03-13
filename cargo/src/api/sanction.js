import axios from 'axios';

export const getSanctionedUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://52.204.62.127:8080/api/admin/reports/users/banned', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};