import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';

export const DashboardPage = () => {
  return (
    <AdminLayout>
      {/* 1. 요약 카드 영역 (통계) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="오늘 배차 완료" value="0 건" color="bg-blue-500" />
        <StatCard title="신규 차주 가입" value="0 명" color="bg-green-500" />
        <StatCard title="배송 중 사고/지연" value="0 건" color="bg-red-500" />
        <StatCard title="이번 달 매출" value="₩ 0" color="bg-purple-500" />
      </div>

      {/* 2. 최근 목록 영역 */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">최근 화물 등록 현황</h3>
        <div className="border rounded-lg p-4 h-64 flex items-center justify-center text-gray-400">
          (여기에 나중에 표나 그래프가 들어갑니다)
        </div>
      </div>
    </AdminLayout>
  );
};

// 간단한 통계 카드 컴포넌트 (여기서만 쓸 거라 파일 안에 만듦)
const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <p className="text-gray-500 text-sm mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    <div className={`h-1 w-full mt-4 rounded ${color}`}></div>
  </div>
);