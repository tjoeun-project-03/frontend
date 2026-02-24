import axios from 'axios';

export const loginUser = async (id, password) => {
  const response = await axios.post('http://localhost:8080/api/auth/login', {
    userId: id,
    userPw: password,
  });
  return response.data;
};

export const getUserInfo = async (token) => {
  const result = await axios.get('http://localhost:8080/api/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  return result.data;
};

// 전체 유저 조회
export const getUser = async () => {
  const token = localStorage.getItem('token');
  const result = await axios.get('http://localhost:8080/api/users', {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  return result.data;
};

// 유저 제재 리스트
export const getReportUser = async (id) => {
  const token = localStorage.getItem('token');
  const result = await axios.get(`http://localhost:8080/api/admin/users/${id}/sanctions`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  return result.data;
}