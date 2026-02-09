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

    // URL의 id와 일치하는 데이터 찾기
    const found = mockInquiries.find(item => item.id === parseInt(id));
    setInquiry(found);
    
    // 이미 답변이 있으면 답변 칸에 채워두기
    if (found && found.answer) {
      setReply(found.answer);
    }
  }, [id]);

  // 3. 답변 등록 핸들러
  const handleSubmit = () => {
    if (!reply.trim()) return alert('답변 내용을 입력해주세요.');
    
    setIsSubmitting(true);
    
    // 서버에 저장하는 척 1초 대기
    setTimeout(() => {
      alert('답변이 등록되었습니다!');
      setIsSubmitting(false);
      navigate('/support/reports'); // 리스트로 돌아가기
    }, 1000);
  };

  // 로딩 중일 때
  if (!inquiry) return <AdminLayout><div>로딩 중...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">문의 상세 내역</h2>
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          ← 목록으로 돌아가기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 문의 내용 (읽기 전용) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. 질문 카드 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                {inquiry.category}
              </span>
              <span className="text-gray-400 text-sm">{inquiry.date}</span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">{inquiry.title}</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 leading-relaxed whitespace-pre-line min-h-[150px]">
              {inquiry.content}
            </div>

            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="font-semibold mr-2">작성자:</span> {inquiry.author}
            </div>
          </div>

          {/* 2. 답변 작성 영역 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              관리자 답변
              {inquiry.status === 'completed' && <span className="ml-2 text-green-600 text-sm">(답변 완료됨)</span>}
            </h4>
            
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="여기에 답변 내용을 입력하세요..."
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-700"
            />

            <div className="mt-4 flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? '등록 중...' : '답변 등록하기'}
              </Button>
            </div>
          </div>
        </div>

        {/* 오른쪽: 상태 요약 정보 (사이드 패널) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-bold text-gray-800 mb-4">처리 상태</h4>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500">현재 상태</span>
              {inquiry.status === 'completed' ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">답변 완료</span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">답변 대기</span>
              )}
            </div>

            <hr className="my-4 border-gray-100" />
            
            <div className="text-sm text-gray-500 space-y-2">
              <p>• 답변을 등록하면 사용자에게 알림이 전송됩니다.</p>
              <p>• 부적절한 문의는 '사용자 제재' 메뉴에서 처리하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};