import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getSanctionedUsers } from '../../api/sanction'; 

export const SanctionList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSanctionList();
  }, []);

  const fetchSanctionList = async () => {
    setIsLoading(true);
    try {
      const data = await getSanctionedUsers();
      console.log(data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("제재 유저 목록 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 백엔드의 banUntil 데이터를 분석해서 예쁜 뱃지로 바꿔주는 함수
  const getSanctionBadge = (banUntil) => {
    if (!banUntil) return <span className="text-gray-500">-</span>;

    const banDate = new Date(banUntil);
    const currentYear = banDate.getFullYear();

    // 백엔드에서 LocalDateTime.MAX를 쓰면 연도가 9999년 등으로 아주 큽니다.
    if (currentYear > 9000) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
          영구 정지
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
          기간 정지
        </span>
      );
    }
  };

  // 날짜 변환 함수 (영구정지면 날짜 대신 '기한 없음' 표시)
  const formatBanDate = (banUntil) => {
    if (!banUntil) return '-';
    const banDate = new Date(banUntil);
    if (banDate.getFullYear() > 9000) return '기한 없음 (영구)';
    
    // 예: 2026. 02. 25. 14:00 까지
    return banDate.toLocaleString() + ' 까지';
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">제재 유저 관리</h2>
        <p className="text-gray-500 mt-1">현재 이용이 제한된 화주 및 차주 목록입니다.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">데이터를 불러오는 중입니다...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b w-16">번호</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b w-32">이름</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b w-64">정지 해제 일시</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">제재 사유</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b text-center w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {/* 3. 컬럼 개수가 줄었으므로 colSpan을 7에서 6으로 변경 */}
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    현재 제재 중인 유저가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600 font-medium">{user.id}</td>
                    <td className="p-4">
                      <p className="text-gray-900 font-bold">{user.reportedUserName}</p>
                    </td>
                    <td className="p-4 text-gray-700 font-medium text-sm">
                      {formatBanDate(user.banUntil)}
                    </td>
                    <td className="p-4 text-gray-600 text-sm truncate max-w-xs" title={user.penalty}>
                      {user.penalty}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => alert('나중에 유저 상세 페이지로 이동시키면 좋습니다!')}
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-white"
                      >
                        상세
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