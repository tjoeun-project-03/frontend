import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button';
import { deleteNotice, getNoticeDetail } from '../../api/notice';

export const NoticeDetail = () => {
  const { id } = useParams(); // url에서 id 가져오기
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => { 
      try {
        const data = await getNoticeDetail(id);
        setNotice(data);
      } catch(error) {

      } finally {
        setIsLoading(false);
      }
    };

    if(id) fetchDetail();
  }, [id, navigate]);

  const getTargetText = (targetCode) => {
    switch (targetCode) {
      case 0:
        return '화주';
      case 1:
        return '차주';
      default:
        return '전체';
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  const handleDelete = () => {
    if(window.confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
      deleteNotice(id);
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
            
            {/* 1. [필독] 뱃지 (기존 코드) */}
            {notice.pinned ? (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">
                필독
              </span> 
            ): ''}

            <span className={`px-2 py-1 text-xs font-bold rounded ${
              notice.target == 1 
                ? 'bg-blue-100 text-blue-700'   // 1: 화주 (파랑)
                : notice.target == 0 
                ? 'bg-green-100 text-green-700' // 0: 차주 (초록)
                : 'bg-gray-200 text-gray-600'   // 그외: 전체 (회색)
            }`}>
              {getTargetText(notice.target)}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">{notice.title}</h3>

          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>작성자: <b className="text-gray-700">{notice.writerName}</b></span>
            <span className="w-px h-3 bg-gray-300"></span>
            <span>등록일: {formatDate(notice.createdAt)}</span>
            <span className="w-px h-3 bg-gray-300"></span>
            <span>조회수: {notice.viewCount}</span>
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
        <Button onClick={() => navigate(`/notice/write/${notice.id}`, {
          state: notice, // 보낼 때 형식은 이렇게 해야 되는건가? 원래 이렇게 했나?
        })}>
            수정하기
          </Button>
          <button 
            onClick={handleDelete}
            className="
              h-11 px-6 rounded-lg border border-red-200    
              flex items-center justify-center           
              text-red-600 font-medium 
              hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            삭제하기
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};