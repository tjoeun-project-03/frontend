import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button';

export const SettlementManage = () => {
  const [settlements, setSettlements] = useState([
    {
      id: 'ORD-260224-001',
      completedDate: '2026-02-23 15:30',
      driverName: '김기사',
      driverAccount: '국민은행 123456-04-789012',
      totalAmount: 150000,   // 화주 결제 금액 (원금)
      fee: 15000,            // 수수료 (10%)
      settleAmount: 135000,  // 최종 정산 금액 (차주 지급액)
      status: 'PENDING',     // PENDING(대기) or COMPLETED(승인 완료)
    },
    {
      id: 'ORD-260224-002',
      completedDate: '2026-02-24 09:15',
      driverName: '박기사',
      driverAccount: '신한은행 110-123-456789',
      totalAmount: 80000,
      fee: 8000,
      settleAmount: 72000,
      status: 'PENDING',
    }
  ]);

  // 개별 정산 승인
  const handleApprove = async (id, settleAmount) => {
    if (window.confirm(`[${id}] 해당 건의 정산금 ${settleAmount.toLocaleString()}원을 차주에게 지급 승인하시겠습니까?`)) {
      try {
        // await axios.patch(`/api/admin/settlements/${id}/approve`);
        alert('정산이 승인되었습니다. (차주 계좌로 송금 진행)');
        
        // 목록에서 승인된 건의 상태를 COMPLETED로 변경 (또는 목록에서 제거)
        setSettlements(settlements.filter(item => item.id !== id));
      } catch (error) {
        console.error('정산 승인 실패:', error);
        alert('정산 처리 중 오류가 발생했습니다.');
      }
    }
  };

  // 일괄 정산 승인 (실무에서 관리자가 제일 좋아하는 기능!)
  const handleBulkApprove = () => {
    if (settlements.length === 0) return alert('정산할 내역이 없습니다.');
    if (window.confirm(`대기 중인 총 ${settlements.length}건의 정산을 일괄 승인하시겠습니까?`)) {
      alert('일괄 정산 승인이 완료되었습니다!');
      setSettlements([]); // 모두 승인 처리되므로 목록 비우기
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">정산 승인 관리</h2>
          <p className="text-gray-500 text-sm mt-1">배송이 완료되어 차주에게 대금을 지급해야 할 내역입니다.</p>
        </div>
        
        {/* 상단 액션 버튼 */}
        <div className="flex space-x-3">
          <button 
            onClick={handleBulkApprove}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            전체 일괄 승인
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-bold">주문번호 / 완료일시</th>
                <th className="p-4 font-bold">차주 정보 (입금 계좌)</th>
                <th className="p-4 font-bold text-right">화주 결제액</th>
                <th className="p-4 font-bold text-right">플랫폼 수수료</th>
                <th className="p-4 font-bold text-right text-blue-700">차주 지급액 (정산금)</th>
                <th className="p-4 font-bold text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {settlements.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* 1. 주문번호 및 날짜 */}
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{item.id}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.completedDate} 배송완료</div>
                  </td>

                  {/* 2. 차주 및 계좌 정보 */}
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{item.driverName} 기사님</div>
                    <div className="text-xs text-gray-500 mt-1 bg-gray-100 inline-block px-2 py-1 rounded">
                      {item.driverAccount}
                    </div>
                  </td>

                  {/* 3. 화주 결제 금액 (원금) */}
                  <td className="p-4 text-right text-sm text-gray-600">
                    {item.totalAmount.toLocaleString()}원
                  </td>

                  {/* 4. 플랫폼 수수료 (공제액) */}
                  <td className="p-4 text-right text-sm text-red-500">
                    - {item.fee.toLocaleString()}원
                  </td>

                  {/* 5. 최종 정산 금액 (차주가 받는 돈) */}
                  <td className="p-4 text-right">
                    <div className="text-lg font-bold text-blue-700">
                      {item.settleAmount.toLocaleString()}원
                    </div>
                  </td>

                  {/* 6. 정산 승인 버튼 */}
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleApprove(item.id, item.settleAmount)}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-900 transition-colors"
                    >
                      정산 승인
                    </button>
                  </td>

                </tr>
              ))}
              
              {/* 내역이 없을 때 */}
              {settlements.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    <div className="text-4xl mb-3">🎉</div>
                    정산 대기 중인 내역이 없습니다. (모두 처리 완료!)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};