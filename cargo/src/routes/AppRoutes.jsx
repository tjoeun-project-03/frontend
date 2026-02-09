import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import {DashboardPage} from '../pages/DashboardPage';
import { InquiryList } from '../pages/support/InquiryList';
import { InquiryDetail } from '../pages/support/InquiryDetail';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} /> {/* 로그인 페이지 */}
      <Route path="/dashboard" element={<DashboardPage />} /> {/* 대시보드 (관리자 메인) */}
      <Route path="/support/inquiry" element={<InquiryList/>}/> {/* 1:1 문의 리스트 */}
      <Route path="/support/inquiry/:id" element={<InquiryDetail/>}/> {/* 1:1 문의 디테일 */}
    </Routes>
  );
};