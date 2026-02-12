import axios from 'axios';

export const getReportList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8080/api/admin/reports',{
        headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
}

export const reportApprove = async (id, data) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`http://localhost:8080/api/admin/reports/${id}/approve`,{
      penaltyDays: data.penalty,
      adminComment: data.memo
    },{
      headers: {
        Authorization: `Bearer ${token}`
      },
  });
  return response.data; 
}