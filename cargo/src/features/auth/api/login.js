import axios from 'axios';

export const loginUser = async (id, password) => {
  const response = await axios.post('http://localhost:8080/api/auth/login', {
    userId: id,
    userPw: password,
  });
  return response.data;
};