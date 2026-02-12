import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getDriverRequests, approveDriver, rejectDriver } from '../../api/driver';

export const DriverRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 데이터 불러오기
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const data = await getDriverRequests();
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("차주 요청 목록 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

    // 승인 처리 
  const handleApprove = async (id, name) => {
    if (window.confirm(`${name} 차주의 가입을 승인하시겠습니까?`)) {
      try {
        await approveDriver(id);
        alert('승인되었습니다.');
        setRequests(prev => prev.filter(req => req.userId !== id));
      } catch (error) {
        alert('승인 처리에 실패했습니다.');
      }
    }
  };

  // 거절 처리
  const handleReject = async (id, name) => {
    if (window.confirm(`${name} 차주의 가입을 거절하시겠습니까?`)) {
      try {
        await rejectDriver(id);
        alert('거절되었습니다.');
        setRequests(prev => prev.filter(req => req.userId !== id));
      } catch (error) {
        alert('거절 처리에 실패했습니다.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">차주 가입 승인</h2>
          <p className="text-gray-500 mt-1">새로 가입 신청한 차주 목록입니다.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">데이터를 불러오는 중...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">이름</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">차량번호</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">차종</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    대기 중인 가입 신청이 없습니다.
                  </td>
                </tr>
              ) : (
                requests.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{item.userName}</td>
                    <td className="p-4 text-blue-600 font-medium">{item.carNum}</td>
                    <td className="p-4 text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-bold">
                        {item.carType}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button 
                        onClick={() => handleApprove(item.userId, item.userName)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-bold rounded hover:bg-blue-100 transition-colors"
                      >
                        승인
                      </button>
                      <button 
                        onClick={() => handleReject(item.userId, item.userName)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-bold rounded hover:bg-red-100 transition-colors"
                      >
                        거절
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};