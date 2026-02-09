import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import {DashboardPage} from '../pages/DashboardPage';
import { InquiryList } from '../pages/support/InquiryList';
import { InquiryDetail } from '../pages/support/InquiryDetail';
import { NoticeWrite } from '../pages/support/NoticeWrite';
import { NoticeList } from '../pages/support/NoticeList';
import { NoticeDetail } from '../pages/support/NoticeDetail';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} /> {/* 로그인 페이지 */}
      <Route path="/dashboard" element={<DashboardPage />} /> {/* 대시보드 (관리자 메인) */}
      <Route path="/support/inquiry" element={<InquiryList/>}/> {/* 1:1 문의 리스트 */}
      <Route path="/support/inquiry/:id" element={<InquiryDetail/>}/> {/* 1:1 문의 디테일 */}
      <Route path="/support/notice" element={<NoticeList/>}/>{/* 공지사항 리스트 */}
      <Route path="/support/notice/write" element={<NoticeWrite/>}/>{/* 공지사항 작성 */}
      <Route path="/support/notice/:id" element={<NoticeDetail/>}/>{/* 공지사항 상세보기 */}
      {/* (선택사항) 공지사항 수정 - 지금은 등록 페이지를 같이 써도 됩니다 */}
      <Route path="/support/notice/write/:id" element={<NoticeWrite />} />
    </Routes>
  );
};