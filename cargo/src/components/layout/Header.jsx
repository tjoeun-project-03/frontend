import React from 'react';

const Header = () => {
  const storedUser = localStorage.getItem('user'); 
  const userInfo = JSON.parse(storedUser);
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
      {/* 왼쪽: 현재 페이지 제목 (나중에 동적으로 변경) */}
      <h1 className="text-lg font-bold text-gray-700">대시보드</h1>

      {/* 오른쪽: 사용자 정보 & 로그아웃 */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          <strong className="text-blue-600">{userInfo.userName}</strong>님 환영합니다
        </span>
        <button className="px-3 py-1 text-sm text-red-500 border border-red-200 rounded hover:bg-red-50">
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;