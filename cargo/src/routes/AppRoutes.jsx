import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import {DashboardPage} from '../pages/DashboardPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route path="/" element={<LoginPage />} />
      
      {/* 대시보드 (관리자 메인) */}
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};