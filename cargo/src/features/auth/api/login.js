import axios from 'axios';

export const loginUser = async (id, password) => {
  const response = await axios.post('http://localhost:8080/api/auth/login', {
    id: id,
    password: password
  });

  return response.data; // 서버 응답을 가지고 useLogin으로 복귀
};