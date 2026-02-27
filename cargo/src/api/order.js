import axios from 'axios';

export const getOrderList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8080/api/orders/available',{
        headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
}