import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getOrderList } from '../../api/order';

export const RealTimeMonitoring = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // 1. 배차 취소 로직
  const handleCancelDispatch = (id) => {
    if (window.confirm(`[주문번호: ${id}] 해당 배차를 정말 취소하시겠습니까?`)) {
      try {
        // 실제 운영 시: await cancelOrder(id);
        alert('배차가 취소되었습니다.');
        setOrders(orders.filter(order => order.orderId !== id));
      } catch (error) {
        console.error('취소 실패:', error);
      }
    }
  };

  // 2. 데이터 페칭 (ISO 날짜 처리 포함)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrderList();
        // 데이터가 배열인지 확인 후 저장
        setOrders(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchData();
  }, []);

  // 3. 날짜 포맷 함수 (ISO String -> 읽기 쉬운 형태)
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">실시간 배송 모니터링</h2>
          <p className="text-gray-500 text-sm mt-1">현재 접수 및 운송 중인 전체 목록입니다.</p>
        </div>
        <div className="flex space-x-2">
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">
            총 {orders.length}건
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-bold">운송장 번호</th>
                <th className="p-4 font-bold">상태</th>
                <th className="p-4 font-bold">화물 정보</th>
                <th className="p-4 font-bold">경로 (출발 ➔ 도착)</th>
                <th className="p-4 font-bold">금액 및 시간</th>
                <th className="p-4 font-bold text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                  
                  {/* 1. 운송장 번호 (invoiceNo) */}
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">{order.invoiceNo}</p>
                    <p className="text-xs text-gray-400 mt-0.5">ID: {order.orderId}</p>
                  </td>
                  
                  {/* 2. 상태 배지 (CREATED, DELIVERING 등 대응) */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'CREATED' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status === 'CREATED' ? '접수 완료' : '배송 중'}
                    </span>
                  </td>

                  {/* 3. 화물 정보 (Content, Weight) */}
                  <td className="p-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">{order.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        중량: {order.weight?.toFixed(2)}t / {order.freezer === 1 ? '냉동' : '상온'}
                      </p>
                    </div>
                  </td>

                  {/* 4. 경로 (Departure, Arrival) */}
                  <td className="p-4">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <span className="bg-gray-100 px-2 py-1 rounded">{order.departure}</span>
                      <span className="text-gray-400">➔</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{order.arrival}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">거리: {order.distance}km</p>
                  </td>

                  {/* 5. 금액 및 시간 (Price, Created) */}
                  <td className="p-4 text-sm">
                    <p className="font-bold text-gray-700">{order.price?.toLocaleString()}원</p>
                    <p className="text-xs text-gray-400 mt-1">등록: {formatDateTime(order.created)}</p>
                  </td>

                  {/* 6. 관리 버튼 */}
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <button 
                        onClick={() => navigate(`/monitoring/detail/${order.orderId}`)}
                        className="w-full max-w-[90px] px-3 py-2 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        상세/지도
                      </button>
                      <button 
                        onClick={() => handleCancelDispatch(order.orderId)}
                        className="w-full max-w-[90px] px-3 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};