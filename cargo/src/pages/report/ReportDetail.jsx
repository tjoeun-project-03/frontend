import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button';
import { reportApprove } from '../../api/report';

const penaltyChange = (penaltyValue) => {
  if (penaltyValue === 'NONE') return '9999';
  if (penaltyValue === 'WARNING') return '0';
  if (penaltyValue === 'SUSPENSION_3') return '3';
  if (penaltyValue === 'SUSPENSION_7') return '7';
  if (penaltyValue === 'PERMANENT_BAN') return '-1';
}

export const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = useLocation().state;
  const isProcessed = report?.status === 'PROCESSED';
  const [decision, setDecision] = useState({
    memo: report?.adminComment || '',
    penalty: penaltyChange(report?.penalty) 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

      } catch (error) { 
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  const handleProcess = async () => {
    const confirmMessage = isProcessed ? '수정하시겠습니까?' : '확정하시겠습니까?';
    if (window.confirm(confirmMessage)) {
      try {
        await reportApprove(id, decision);
        alert(`완료`);
        navigate('/report');
      } catch (error) {
        console.error(error);
      }
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
              신고 대상: <span className="text-red-600 underline">{report.reportedUserId}</span>
            </h3>
            <p className="text-sm text-gray-500 mb-6">신고자: {report.reporterId}</p>

            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line leading-relaxed">
              {report.content}
            </div>
          </div>
        </div>

        {/* 2. 관리자 판결 패널 */}
        <div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">심사 및 처분</h3>

            <div className="space-y-4 mb-6">
              <label className="block text-sm font-bold text-gray-700">제재 수위 선택</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={decision.penalty}
                onChange={(e) => setDecision({...decision, penalty: e.target.value})}
              >
                <option value="9999">혐의 없음</option>
                <option value="0">경고</option>
                <option value="3">3일 이용 정지</option>
                <option value="7">7일 이용 정지</option>
                <option value="-1">영구 이용 정지</option>
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