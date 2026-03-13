import axios from 'axios';

export const setSurcharge = async (fee) => {
  const token = localStorage.getItem('token');
  const response = await axios.post('http://52.204.62.127:8080/api/admin/pricing', fee,
    {
        headers: { Authorization: `Bearer ${token}` }
    });
  return response.data;
};

export const getSurcharge = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://52.204.62.127:8080/api/admin/pricing', 
    {
        headers: { Authorization: `Bearer ${token}` }
    });
  return response.data;
}