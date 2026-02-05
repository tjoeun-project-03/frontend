// src/features/auth/hooks/useLogin.js
import { useState } from 'react';
// import { loginUser } from '../api/login';

export const useLogin = () => {
  // 1. 상태 관리 (데이터)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. 입력 핸들러 (기능)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. 제출 핸들러 (기능)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // try {
    //   // API 호출
    //   const result = await loginUser(formData.username, formData.password);
    //   console.log('로그인 성공:', result);
    //   alert('로그인 되었습니다!');
    //   // 성공 시 true 반환 (나중에 페이지 이동에 씀)
    //   return true;

    // } catch (err) {
    //   console.error('로그인 실패:', err);
    //   setError('아이디 또는 비밀번호가 틀렸습니다.');
    //   return false;

    // } finally {
    //   setIsLoading(false);
    // }
  };

  // 4. 컴포넌트가 쓸 수 있게 포장해서 내보내기
  return {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit
  };
};