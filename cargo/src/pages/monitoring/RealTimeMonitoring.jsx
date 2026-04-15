import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getOrderList, orderCancel } from '../../api/order';

export const RealTimeMonitoring = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  // 1. 모달 상태 관리 (열림 여부, 취소할 주문 ID)
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });
  // 2. 입력받을 취소 사유 상태
  const [cancelReason, setCancelReason] = useState('');

  // 3. 리스트에서 '취소' 버튼을 눌렀을 때 모달을 여는 함수
  const handleOpenCancelModal = (id) => {
    setCancelModal({ isOpen: true, orderId: id });
    setCancelReason(''); // 모달 열 때 이전 입력값 초기화
  };

  // 4. 모달을 닫는 함수
  const handleCloseCancelModal = () => {
    setCancelModal({ isOpen: false, orderId: null });
    setCancelReason('');
  };

  // 5. 모달 안에서 '확인'을 눌렀을 때 실행될 실제 취소 로직 (기존 코드 변형)
  const executeCancel = async () => {
    // 방어 코드: 사유를 입력하지 않았을 때
    if (!cancelReason.trim()) {
      alert("취소 사유를 반드시 입력해주세요.");
      return;
    }

    try {
      // cancelModal.orderId 에 저장해둔 ID를 꺼내서 씁니다.
      await orderCancel(cancelModal.orderId, cancelReason);
      
      alert('배차가 취소되었습니다.');
      setOrders(orders.filter(order => order.orderId !== cancelModal.orderId));
      
      handleCloseCancelModal(); // 성공 후 모달 닫기
    } catch (error) {
      console.error('취소 실패:', error);
      alert('취소 처리 중 오류가 발생했습니다.');
    }
  };

  // 2. 데이터 페칭 (ISO 날짜 처리 포함)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrderList();
        setOrders(Array.isArray(response) ? response : []);
        console.log(response);
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
                        onClick={() => handleOpenCancelModal(order.orderId)}
                        className="w-full max-w-[90px] px-3 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        배차 취소
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 배차 취소 모달창 */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            
            {/* 헤더 */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">배차 취소</h3>
              <button 
                onClick={handleCloseCancelModal}
                className="text-gray-400 hover:text-gray-800 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* 본문 */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-700 font-medium">
                [주문번호: <span className="text-blue-600">{cancelModal.orderId}</span>] 해당 배차를 정말 취소하시겠습니까?
              </p>
              
              <div>
                <label className="block text-xs text-gray-500 mb-2">취소 사유</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="관리자 취소 사유를 상세히 입력해주세요."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* 푸터 (버튼 영역) */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50">
              <button 
                onClick={handleCloseCancelModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={executeCancel}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
            
          </div>
        </div>
      )}
    </AdminLayout>
  );
};