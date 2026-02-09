import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout'; // 레이아웃 감싸기

export const InquiryList = () => {
  const navigate = useNavigate();

  // 임시 데이터 (나중에 DB에서 가져올 부분)
  const [inquiries] = useState([
    { 
      id: 1, 
      category: '배차 문의',
      title: '배차 취소는 어떻게 하나요?', 
      author: '김차주', 
      date: '2026-02-09', 
      status: 'pending' // 답변전
    },
    { 
      id: 2, 
      category: '정산 문의',
      title: '이번 달 정산 금액이 안 들어왔습니다.', 
      author: '박운송', 
      date: '2026-02-08', 
      status: 'completed' // 답변완료
    },
  ]);

  // 2. 상태에 따른 뱃지 디자인 함수
  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          답변완료
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          답변대기
        </span>
      );
    }
  };

  // 3. 상세 페이지로 이동 함수
  const handleRowClick = (id) => {
    navigate(`/support/inquiry/${id}`);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">1:1 문의 관리</h2>
        <p className="text-gray-500 mt-1">접수된 문의를 확인하고 답변을 등록하세요.</p>
      </div>

      {/* 테이블 영역 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* 테이블 헤더 */}
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">번호</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">카테고리</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-1/2">제목</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">작성자</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">등록일</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">상태</th>
            </tr>
          </thead>

          {/* 테이블 바디 */}
          <tbody className="divide-y divide-gray-100">
            {inquiries.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => handleRowClick(item.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="p-4 text-gray-600">{item.id}</td>
                <td className="p-4 text-gray-600 font-medium">{item.category}</td>
                <td className="p-4 text-gray-800 font-medium truncate max-w-xs">
                    {item.title}
                </td>
                <td className="p-4 text-gray-600">{item.author}</td>
                <td className="p-4 text-gray-500 text-sm">{item.date}</td>
                <td className="p-4">
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};