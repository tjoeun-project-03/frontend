import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';

export const ReportList = () => {
  const navigate = useNavigate();

  // 임시 데이터 (나중엔 API로 가져옴)
  const [reports] = useState([
    { 
      id: 101, 
      targetUser: '박화물(차주)', // 신고 당한 사람
      reporter: '김화주(화주)',   // 신고한 사람
      date: '2026-02-10', 
      status: 'pending'          // pending: 대기중, done: 처리완료
    },
    { 
      id: 100, 
      targetUser: '이난폭(차주)', 
      reporter: '최물류(주선사)', 
      date: '2026-02-09', 
      status: 'done',
      result: 'suspension' // 제재 내용 (정지)
    },
    { 
      id: 99, 
      targetUser: '김먹튀(주선사)', 
      reporter: '오트럭(차주)', 
      date: '2026-02-08', 
      status: 'pending' 
    },
  ]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">신고 접수 및 심사</h2>
        <p className="text-gray-500 mt-1">사용자 간의 분쟁 및 신고 내역을 심사하고 처분을 내립니다.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b w-20">번호</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">대상자(피신고인)</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">신고자</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">접수일</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b text-center">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => navigate(`/report/${item.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="p-4 text-gray-600">{item.id}</td>
                <td className="p-4 text-gray-700 font-medium">{item.targetUser}</td>
                <td className="p-4 text-gray-500">{item.reporter}</td>
                <td className="p-4 text-gray-400 text-sm">{item.date}</td>
                <td className="p-4 text-center">
                  {item.status === 'pending' ? (
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">
                      심사 대기
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                      처리 완료
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};