import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
// import Button from '../../components/Button'; // 기존에 쓰시던 버튼 컴포넌트가 있다면 유지
import { useNavigate } from 'react-router-dom'; // 💡 페이지 이동을 위한 훅 임포트!

export const RealTimeMonitoring = () => {
  const navigate = useNavigate(); // 💡 선언해 줍니다.

  // 💡 더미 데이터: 실제로는 백엔드에서 status가 'BEFORE_DELIVERY', 'DELIVERING'인 것만 가져옵니다.
  const [activeOrders, setActiveOrders] = useState([
    {
      id: 'ORD-260219-001',
      status: 'DELIVERING',
      shipperName: '(주)대한물류',
      driverName: '김기사',
      vehicleInfo: '서울 82가 1234 (5톤 윙바디)',
      origin: '경기 파주시',
      destination: '부산 강서구',
      currentLocation: '경부고속도로 천안JC 부근',
    },
    {
      id: 'ORD-260219-002',
      status: 'BEFORE_DELIVERY',
      shipperName: '제일농산',
      driverName: '박기사',
      vehicleInfo: '경기 99나 5678 (1톤 카고)',
      origin: '강원 춘천시',
      destination: '서울 송파구',
      currentLocation: '상차지 대기 중',
    }
  ]);

  // 💡 배차 취소 핸들러
  const handleCancelDispatch = async (id, status) => {
    if (window.confirm(`[${id}] 해당 배차를 정말 취소하시겠습니까?\n취소 시 차주에게 알림이 발송됩니다.`)) {
      try {
        // await axios.post(`/api/admin/dispatch/${id}/cancel`);
        alert('배차가 취소되었습니다.');
        setActiveOrders(activeOrders.filter(order => order.id !== id));
      } catch (error) {
        console.error('취소 실패:', error);
        alert('취소 처리 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">실시간 배송 모니터링 🛰️</h2>
          <p className="text-gray-500 text-sm mt-1">현재 배차 완료 및 배송 중인 화물 목록입니다.</p>
        </div>
        <div className="flex space-x-2">
          {/* 전체 건수 요약 등 */}
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">
            진행 중: {activeOrders.length}건
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-bold">주문번호</th>
                <th className="p-4 font-bold">상태</th>
                <th className="p-4 font-bold">화주 / 차주 정보</th>
                <th className="p-4 font-bold">경로 (출발 ➔ 도착)</th>
                <th className="p-4 font-bold text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* 1. 주문번호 */}
                  <td className="p-4">
                    <span className="font-semibold text-gray-800">{order.id}</span>
                  </td>
                  
                  {/* 2. 상태 배지 */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'DELIVERING' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status === 'DELIVERING' ? '배송 중' : '배차 완료'}
                    </span>
                  </td>

                  {/* 3. 화주/차주 정보 */}
                  <td className="p-4">
                    <div className="text-sm">
                      <p><span className="text-gray-500 mr-1">화주:</span> <span className="font-medium text-gray-800">{order.shipperName}</span></p>
                      <p className="mt-1"><span className="text-gray-500 mr-1">차주:</span> <span className="font-medium text-gray-800">{order.driverName}</span></p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.vehicleInfo}</p>
                    </div>
                  </td>

                  {/* 4. 운송 경로 */}
                  <td className="p-4">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <span className="bg-gray-100 px-2 py-1 rounded">{order.origin}</span>
                      <span className="text-gray-400">➔</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{order.destination}</span>
                    </div>
                  </td>

                  {/* 6. 관리 버튼 영역 (상세보기 추가!) - 세로 배치로 변경 */}
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      
                      {/* 💡 새로운 버튼: 클릭 시 /monitoring/detail/주문번호 로 이동합니다. */}
                      <button 
                        onClick={() => navigate(`/monitoring/detail/${order.id}`)}
                        className="px-4 py-2 rounded-lg text-sm font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        지도/상세
                      </button>

                      {/* 기존 배차 취소 버튼 */}
                      <button 
                        onClick={() => handleCancelDispatch(order.id, order.status)}
                        className="px-4 py-2 rounded-lg text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        배차 취소
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {activeOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    현재 진행 중인 배송 건이 없습니다.
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