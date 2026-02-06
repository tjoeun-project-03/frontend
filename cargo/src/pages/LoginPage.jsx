import React from 'react';
import LoginForm from '../features/auth/components/LoginForm';

export const LoginPage = () => {
  return (
    // 화면 전체를 회색(bg-gray-100)으로 칠하고 정중앙 정렬
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
};