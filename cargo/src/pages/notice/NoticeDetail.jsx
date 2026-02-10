import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button';

export const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const mockNotices = [
      { 
        id: 10, 
        title: '[긴급] 서버 점검 안내 (02/12 00:00 ~ 04:00)', 
        content: `안녕하세요, 화물 관리자 팀입니다.\n\n안정적인 서비스 제공을 위해 아래와 같이 서버 점검이 진행될 예정입니다.\n점검 시간 동안은 서비스 이용이 중단되오니 양해 부탁드립니다.\n\n- 일시: 2026년 2월 12일 00:00 ~ 04:00 (4시간)\n- 대상: 전체 서비스 (PC, 모바일 앱)\n\n감사합니다.`,
        author: '관리자', 
        date: '2026-02-09', 
        views: 0,
        isPinned: true
      },
    ];

    const found = mockNotices.find(n => n.id === parseInt(id));
    setNotice(found);
  }, [id]);

  // 삭제 버튼 핸들러
  const handleDelete = () => {
    if(window.confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
      alert('삭제되었습니다.');
      navigate('/notice');
    }
  };

  if (!notice) return <AdminLayout><div>로딩 중...</div></AdminLayout>;

  return (
    <AdminLayout>
      {/* 1. 상단 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">공지사항 상세</h2>
        <button 
          onClick={() => navigate('/notice')} 
          className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← 목록으로 돌아가기
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* 2. 게시글 헤더 (제목, 날짜 등) */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-3">
            {notice.isPinned && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">
                필독
              </span>
            )}
            <span className="text-sm text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
              공지
            </span>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">{notice.title}</h3>

          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>작성자: <b className="text-gray-700">{notice.author}</b></span>
            <span className="w-px h-3 bg-gray-300"></span>
            <span>등록일: {notice.date}</span>
            <span className="w-px h-3 bg-gray-300"></span>
            <span>조회수: {notice.views}</span>
          </div>
        </div>

        {/* 3. 게시글 본문 */}
        <div className="p-8 min-h-[400px]">
          {/* whitespace-pre-line: 줄바꿈 문자(\n)를 실제 줄바꿈으로 보여줌 */}
          <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
            {notice.content}
          </div>
        </div>

        {/* 4. 하단 버튼 영역 (수정/삭제) */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/30">
        <Button onClick={() => navigate(`/notice/write/${notice.id}`)}>
            수정하기
          </Button>
          <button 
            onClick={handleDelete}
            className="px-6 py-2.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            삭제하기
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};