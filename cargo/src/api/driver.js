import axios from 'axios';

// 1. 가입 대기 중인 차주 목록 조회
export const getDriverRequests = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:8080/api/admin/carriers/pending', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 2. 가입 승인 (수락)
export const approveDriver = async (driverId) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`http://localhost:8080/api/admin/carriers/${driverId}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 3. 가입 거절
export const rejectDriver = async (driverId) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`http://localhost:8080/api/admin/carriers/${driverId}/reject`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};