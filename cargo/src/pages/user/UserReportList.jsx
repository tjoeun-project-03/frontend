import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getReportUser } from '../../api/login';

export const UserReportList = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [sanctions, setSanctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSanctionHistory = async () => {
      try {
        setLoading(true);
        const response = await getReportUser(id);
        console.log(response);
        setSanctions(Array.isArray(response) ? response : response.data || []);
      } catch (error) {
        console.error('제재 내역을 불러오는데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSanctionHistory();
  }, [id]);

  const translatePenalty = (penalty) => {
    switch (penalty) {
      case 'WARNING': return <span className="text-amber-600 font-bold">경고</span>;
      case 'SUSPENSION_3': return <span className="text-red-500 font-bold">3일 정지</span>;
      case 'SUSPENSION_7': return <span className="text-red-600 font-bold">7일 정지</span>;
      case 'PERMANENT_BAN': return <span className="text-gray-900 font-black">영구 정지</span>;
      default: return penalty;
    }
  };

  return (
    <AdminLayout>
      {/* 💡 상단 헤더 & 뒤로가기 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <button 
              onClick={() => navigate(-1)} 
              className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold text-gray-800">제재 내역 상세</h2>
          </div>
          <p className="text-gray-500 text-sm ml-8">
            <span className="font-bold text-blue-600">{id}</span> 회원의 누적 제재 및 패널티 현황입니다.
          </p>
        </div>
        
        {/* 누적 건수 요약 뱃지 */}
        <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-100">
          <span className="text-red-800 font-bold text-sm">누적 제재: {sanctions.length}건</span>
        </div>
      </div>

      {/* 💡 제재 내역 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">데이터를 불러오는 중입니다...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <tr>
                <th className="p-4 font-bold w-1/6">처리 일자</th>
                <th className="p-4 font-bold w-1/6">제재 수위</th>
                <th className="p-4 font-bold w-2/6">처분 사유 (관리자 메모)</th>
                <th className="p-4 font-bold w-1/6">정지 종료일</th>
                <th className="p-4 font-bold w-1/6 text-center">상태</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
                {sanctions.map((item, index) => {
                    
                    // 💡 1. 상태(Status) 계산기: 오늘 날짜와 종료일(endDate)을 비교합니다.
                    const isWarning = item.penalty === 'WARNING';
                    const isExpired = item.endDate && new Date(item.endDate) < new Date();
                    
                    return (
                    <tr key={index} className="hover:bg-gray-50">
                        
                        {/* 1. 처리 일자 (processedAt 사용) */}
                        <td className="p-4 text-sm text-gray-600">
                        {item.processedAt ? item.processedAt.split('T')[0] : '-'}
                        </td>
                        
                        {/* 2. 제재 수위 */}
                        <td className="p-4">
                        {translatePenalty(item.penalty)}
                        </td>
                        
                        {/* 3. 처분 사유 (신고 내용 + 관리자 코멘트 둘 다 보여주기) */}
                        <td className="p-4">
                        <div className="text-sm font-bold text-gray-800">{item.adminComment || '-'}</div>
                        <div className="text-xs text-gray-500 mt-1">원신고: {item.content || '-'}</div>
                        </td>
                        
                        {/* 4. 종료일 (endDate) */}
                        <td className="p-4 text-sm text-gray-500">
                        {item.endDate ? item.endDate.split('T')[0] : '기한 없음'}
                        </td>
                        
                        {/* 5. 현재 상태 뱃지 (계산 로직 적용) */}
                        <td className="p-4 text-center">
                        {isWarning ? (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                            경고 누적
                            </span>
                        ) : isExpired ? (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                            기간 만료
                            </span>
                        ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                            적용 중
                            </span>
                        )}
                        </td>
                    </tr>
                    );
                })}

                {/* 제재 내역이 없는 경우 */}
                {(sanctions?.length === 0 || !sanctions) && (
                    <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500">
                        <span className="text-3xl block mb-2"></span>
                        과거 제재 내역이 없는 클린한 회원입니다.
                    </td>
                    </tr>
                )}
                </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};