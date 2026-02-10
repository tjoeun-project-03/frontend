import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button';

export const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  
  // 심사 결과 관리 (memo: 관리자 메모, penalty: 처벌 수위)
  const [decision, setDecision] = useState({
    memo: '',
    penalty: 'none' // none, warning, suspension_3d, suspension_permanent
  });

  useEffect(() => {
    // 임시 데이터 (실제로는 API 호출)
    const mockData = {
      id: 101,
      targetUser: '박화물(차주)',
      targetUserId: 'user_123',
      reporter: '김화주(화주)',
      date: '2026-02-10 14:30',
      content: '상차지인 부산항에 도착했다고 해놓고 1시간 뒤에 전화하니 잠수를 탔습니다.\n다른 차를 구하느라 손해가 막심합니다. 강력한 제재 부탁드립니다.',
      status: 'pending'
    };
    setReport(mockData);
  }, [id]);

  const handleProcess = () => {
    if (window.confirm('이대로 처분을 확정하시겠습니까?')) {
      alert(`[처리 완료] 대상자에게 '${decision.penalty}' 처분이 내려졌습니다.`);
      navigate('/report');
    }
  };

  if (!report) return <AdminLayout><div>로딩 중...</div></AdminLayout>;

  return (
    <AdminLayout>
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">신고 심사 상세</h2>
        <button onClick={() => navigate(-1)} className="text-gray-500 font-medium">← 목록으로</button>
      </div>

      <div className="space-y-6">
        
        {/* 1. 신고 내용 */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-400 text-sm">{report.date}</span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              신고 대상: <span className="text-red-600 underline">{report.targetUser}</span>
            </h3>
            <p className="text-sm text-gray-500 mb-6">신고자: {report.reporter}</p>

            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line leading-relaxed">
              {report.content}
            </div>
          </div>
        </div>

        {/* 2. 관리자 판결 패널 */}
        <div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">심사 및 처분</h3>

            {/* 처분 선택 */}
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-bold text-gray-700">제재 수위 선택</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={decision.penalty}
                onChange={(e) => setDecision({...decision, penalty: e.target.value})}
              >
                <option value="none">혐의 없음</option>
                <option value="suspension_3d">3일 이용 정지</option>
                <option value="suspension_7d">7일 이용 정지</option>
                <option value="suspension_permanent">영구 이용 정지</option>
              </select>
            </div>

            {/* 관리자 코멘트 */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">처분 사유 / 메모</label>
              <textarea 
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="대상자에게 전달될 사유나 내부 기록용 메모를 작성하세요."
                value={decision.memo}
                onChange={(e) => setDecision({...decision, memo: e.target.value})}
              />
            </div>

            <Button onClick={handleProcess} className="w-full py-3 text-lg font-bold">
              심사 완료 및 처분 적용
            </Button>

            <p className="text-xs text-gray-400 mt-4 text-center">
              처분이 확정되면 대상자에게 알림톡이 발송됩니다.
            </p>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};