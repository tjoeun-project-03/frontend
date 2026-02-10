import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button'; 

export const NoticeList = () => {
  const navigate = useNavigate();

  

  const [notices] = useState([
    { 
      id: 10, 
      title: '[긴급] 서버 점검 안내 (02/12 00:00 ~ 04:00)', 
      author: '관리자', 
      date: '2026-02-09', 
      views: 0,
      isPinned: true
    },
    { 
      id: 9, 
      title: '설 연휴 정산 일정 변경 안내', 
      author: '운영팀', 
      date: '2026-02-01', 
      views: 0,
      isPinned: true 
    },
    { 
      id: 8, 
      title: '2월 유류비 지원 정책 변경사항', 
      author: '관리자', 
      date: '2026-01-28', 
      views: 0,
      isPinned: false
    },
    { 
      id: 7, 
      title: '앱 업데이트 안내 (v2.1.0)', 
      author: '개발팀', 
      date: '2026-01-20', 
      views: 0,
      isPinned: false
    },
  ]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">공지사항 관리</h2>
          <p className="text-gray-500 mt-1">사용자 앱에 노출될 공지사항을 등록합니다.</p>
        </div>
      </div>

      {/* 2. 테이블 영역 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-16">번호</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">제목</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-32">작성자</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-32">등록일</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-24">조회수</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {notices.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => navigate(`/notice/${item.id}`)}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  item.isPinned ? 'bg-red-50/30' : ''
                }`}
              >
                <td className="p-4 text-gray-600">
                  {item.id}
                </td>
                <td className="p-4">
                  {item.isPinned && (
                    <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded mr-2 align-middle">
                      필독
                    </span>
                  )}
                  <span className={`align-middle ${item.isPinned ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
                    {item.title}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">{item.author}</td>
                <td className="p-4 text-gray-500 text-sm">{item.date}</td>
                <td className="p-4 text-gray-400 text-sm">{item.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => navigate('/notice/write')}>
          공지사항 작성
        </Button>
      </div>

    </AdminLayout>
  );
};