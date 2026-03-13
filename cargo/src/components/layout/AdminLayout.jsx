import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

// children: 이 레이아웃 안에 들어올 실제 페이지 내용 (Dashboard, MemberPage 등)
const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. 사이드바 (고정) */}
      <Sidebar />

      {/* 2. 메인 영역 (헤더 + 콘텐츠) */}
      <div className="ml-64"> {/* 사이드바 너비(64)만큼 띄우기 */}
        <Header />
        
        {/* 3. 실제 콘텐츠가 들어가는 곳 */}
        <main className="p-8 mt-16"> {/* 헤더 높이(16)만큼 내리기 */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;