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

export const orderCancel = async(id, reason) => {
  const token = localStorage.getItem('token');

  const requestData = {
    canceledReason: reason
  }

  const response = await axios.post(`http://localhost:8080/api/orders/${id}/cancel`,
    requestData,
    {
      headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return response.data;
}