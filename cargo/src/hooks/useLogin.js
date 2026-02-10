import { useState } from 'react';
import { loginUser, getUserInfo } from '../api/login';

export const useLogin = () => {
  const [formData, setFormData] = useState({
    id: '',
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

    try {
      // API 호출
      const result = await loginUser(formData.id, formData.password);
      if(result) {
        localStorage.setItem('token', result);
      }
      const userData = await getUserInfo(result);
      localStorage.setItem('user', JSON.stringify(userData)); 
      alert('로그인 되었습니다');
      return true;
    } catch (err) {
      console.error('로그인 실패:', err);
      setError('아이디 또는 비밀번호가 틀렸습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit
  };
};