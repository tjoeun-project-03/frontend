import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import {DashboardPage} from '../pages/DashboardPage';
import { InquiryList } from '../pages/inquiry/InquiryList';
import { InquiryDetail } from '../pages/inquiry/InquiryDetail';
import { NoticeWrite } from '../pages/notice/NoticeWrite';
import { NoticeList } from '../pages/notice/NoticeList';
import { NoticeDetail } from '../pages/notice/NoticeDetail';
import { ReportList } from '../pages/report/ReportList';
import { ReportDetail } from '../pages/report/ReportDetail';
import { DriverRequestList } from '../pages/driver/DriverRequestList';
import { SanctionList } from '../pages/sanction/SanctionList';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} /> {/* 로그인 페이지 */}
      <Route path="/dashboard" element={<DashboardPage />} /> {/* 대시보드 (관리자 메인) */}
      <Route path="/inquiry" element={<InquiryList/>}/> {/* 1:1 문의 리스트 */}
      <Route path="/inquiry/:id" element={<InquiryDetail/>}/> {/* 1:1 문의 디테일 */}
      <Route path="/notice" element={<NoticeList/>}/>{/* 공지사항 리스트 */}
      <Route path="/notice/write" element={<NoticeWrite/>}/>{/* 공지사항 작성 */}
      <Route path="/notice/:id" element={<NoticeDetail/>}/>{/* 공지사항 상세보기 */}
      <Route path="/notice/write/:id" element={<NoticeWrite />} /> {/* 공지사항 수정 */}
      <Route path="/report" element={<ReportList/>}/>{/* 신고목록 리스트 */}
      <Route path="/report/:id" element={<ReportDetail/>}/>{/* 신고 상세보기 */}
      <Route path="/driver/request" element={<DriverRequestList/>}/>{/* 차주 신청 리스트 */}
      <Route path="/sanction/list" element={<SanctionList/>}/>{/* 제재 리스트 */}
    </Routes>
  );
};