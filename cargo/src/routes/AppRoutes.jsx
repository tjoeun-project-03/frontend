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
import { SurchargeManage } from '../pages/surcharge/Surcharge';
import { RealTimeMonitoring } from '../pages/monitoring/RealTimeMonitoring';
import { SettlementManage } from '../pages/settlement/Settlement';
import { UserManagement } from '../pages/user/User';
import { UserReportList } from '../pages/user/UserReportList';
import { RevenueManage } from '../pages/revenue/Revenue';
import {MonitoringDetail} from '../pages/monitoring/MonitoringDetail';

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
      <Route path="/surcharge/manage" element={<SurchargeManage/>}/>{/* 수수료 및 할증 관리 */}
      <Route path="/monitoring" element={<RealTimeMonitoring/>}/>{/* 실시간 배송 모니터링 */}
      <Route path="/settlement" element={<SettlementManage/>}/>{/* 정산 승인 관리 */}
      <Route path="/user/list" element={<UserManagement/>}/>{/* 회원 관리 */}
      <Route path="/user/reportUser/:id" element={<UserReportList/>}/>{/* 회원 신고 리스트 */}
      <Route path="/revenue" element={<RevenueManage/>}/>{/* 매출 동계 */}
      <Route path="/monitoring/detail/:id" element={<MonitoringDetail />} /> {/* 배송 상세 관제 */}
    </Routes>
  );
};