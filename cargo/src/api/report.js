import axios from 'axios';

export const getReportList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://52.204.62.127:8080/api/admin/reports',{
        headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
}

export const reportApprove = async (id, data) => {
  const token = localStorage.getItem('token');
  const response = await axios.patch(`http://52.204.62.127:8080/api/admin/reports/${id}/approve`,{
      penaltyDays: data.penalty,
      adminComment: data.memo
    },{
      headers: {
        Authorization: `Bearer ${token}`
      },
  });
  return response.data; 
}