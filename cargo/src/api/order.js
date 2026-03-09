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

export const getOrderDetail = async(id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/orders/id/${id}`,{
        headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
} 

export const orderCancel = async(id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`http://localhost:8080/api/orders/${id}/delete`,{
      headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return response.data;
}