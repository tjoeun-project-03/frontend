import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button'; 

export const InquiryDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // 1. 상태 관리
  const [inquiry, setInquiry] = useState(null); 
  const [reply, setReply] = useState('');       
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 임시 데이터 (실제로는 API 호출)
    const mockInquiries = [
      { 
        id: 1, 
        category: '배차 문의',
        title: '배차 취소는 어떻게 하나요?', 
        content: '실수로 배차를 잘못 신청했습니다. 취소 버튼이 안 보이는데 어떻게 해야 하나요? 급합니다 ㅠㅠ',
        author: '김차주', 
        date: '2026-02-09', 
        status: 'pending' 
      },
      { 
        id: 2, 
        category: '정산 문의',
        title: '이번 달 정산 금액이 안 들어왔습니다.', 
        content: '원래 10일에 들어오는 거 아닌가요? 확인 부탁드립니다.',
        author: '박운송', 
        date: '2026-02-08', 
        status: 'completed',
        answer: '안녕하세요. 확인 결과 은행 전산 장애로 지연되었습니다. 오늘 중으로 입금 예정입니다.'
      },
    ];

    const found = mockInquiries.find(item => item.id === parseInt(id));
    setInquiry(found);
    
    if (found && found.answer) {
      setReply(found.answer);
    }
  }, [id]);

  const handleSubmit = () => {
    if (!reply.trim()) return alert('답변 내용을 입력해주세요.');
    setIsSubmitting(true);
    setTimeout(() => {
      alert('답변이 등록되었습니다!');
      setIsSubmitting(false);
      navigate('/support/reports');
    }, 1000);
  };

  if (!inquiry) return <AdminLayout><div>로딩 중...</div></AdminLayout>;

  return (
    <AdminLayout>
      {/* 1. 상단 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">문의 상세 내역</h2>
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← 목록으로 돌아가기
        </button>
      </div>

      {/* 🌟 수정 포인트: Grid 제거하고 최대 너비(max-w-4xl) 설정으로 중앙 정렬 */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 2. 질문 카드 (여기에 상태 뱃지 통합) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* 헤더 영역: 카테고리 + 날짜 + 상태뱃지 */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {/* 카테고리 뱃지 */}
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold">
                {inquiry.category}
              </span>
              
              {/* 🌟 상태 뱃지 */}
              {inquiry.status === 'completed' ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1">
                  ✅ 답변 완료
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1">
                  🔥 답변 대기
                </span>
              )}
            </div>

            {/* 날짜 & 작성자 */}
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{inquiry.author}</p>
              <p className="text-xs text-gray-400 mt-1">{inquiry.date}</p>
            </div>
          </div>
          
          {/* 질문 본문 */}
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{inquiry.title}</h3>
          <div className="bg-gray-50 p-6 rounded-xl text-gray-700 leading-relaxed whitespace-pre-line text-base">
            {inquiry.content}
          </div>
        </div>

        {/* 3. 답변 작성 영역 (화살표 아이콘으로 연결 느낌) */}
        <div className="flex justify-center text-gray-300">
          <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>

        <div className={`rounded-xl shadow-sm border p-8 transition-colors ${
           inquiry.status === 'completed' ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-200'
        }`}>
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>💬 관리자 답변</span>
          </h4>
          
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="사용자가 기다리고 있습니다. 친절하게 답변해 주세요."
            className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-700 bg-white"
          />

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? '등록 중...' : '답변 등록하기'}
            </Button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};