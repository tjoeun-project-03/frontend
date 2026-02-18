import axios from 'axios';

export const getSanctionedUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:8080/api/admin/users/sanctioned', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};