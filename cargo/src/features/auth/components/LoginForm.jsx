// src/features/auth/components/LoginForm.jsx
import React from 'react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useLogin } from '../hooks/useLogin'; // 뇌(Hook) 가져오기

const LoginForm = () => {
  // 복잡한 코드는 다 사라지고, 딱 한 줄로 기능 장착!
  const { 
    formData, 
    error, 
    isLoading, 
    handleChange, 
    handleSubmit 
  } = useLogin();

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">관리자 로그인</h2>
        <p className="text-gray-500 mt-2">화물 운송 관리 시스템</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="아이디"
          name="username"
          placeholder="아이디"
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          label="비밀번호"
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
        />
        
        <div className="mt-6">
          <Button type="submit" className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}>
            {isLoading ? '로그인 중...' : '로그인 하기'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;