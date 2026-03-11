import React from 'react';
import { logoutUser } from '../../api/login';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user'); 
  const userInfo = storedUser ? JSON.parse(storedUser) : {};

  const handleLogout = async () => {
    if (!window.confirm("로그아웃 하시겠습니까?")) return;

    try {
      await logoutUser(); 
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
      alert('로그아웃 되었습니다.');
      navigate('/'); 
    } catch (error) {
      console.error("서버 로그아웃 통신 실패:", error);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40">
      <h1 className="text-lg font-bold text-gray-700">대시보드</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          <strong className="font-bold text-indigo-500">{userInfo?.userName || '관리자'}</strong>님 환영합니다
        </span>
        <button 
          className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors" 
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;