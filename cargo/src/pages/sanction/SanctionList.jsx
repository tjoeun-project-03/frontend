import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getSanctionedUsers } from '../../api/sanction'; 

export const SanctionList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

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
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b w-32">유저 정보</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b w-32 text-center">제재 유형</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b w-64">정지 해제 일시</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">제재 사유</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b text-center w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {users.length === 0 ? (
                <tr>
                  {/* 컬럼 개수가 6개로 늘어났으므로 colSpan을 6으로 변경 */}
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    현재 제재 중인 유저가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600 font-medium">{user.id}</td>
                    <td className="p-4">
                      <p className="text-gray-900 font-bold">{user.reportedUserId}</p>
                      <p className="text-xs text-gray-500">{user.reportedUserName}</p>
                    </td>
                    <td className="p-4 text-center">
                      {getSanctionBadge(user.banUntil)}
                    </td>
                    <td className="p-4 text-gray-700 font-medium text-sm">
                      {formatBanDate(user.banUntil)}
                    </td>
                    <td className="p-4 text-gray-600 text-sm truncate max-w-xs" title={user.penalty}>
                      {user.penalty}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        // 💡 수정: 클릭 시 해당 줄의 user 데이터를 selectedUser에 통째로 넣습니다!
                        onClick={() => setSelectedUser(user)} 
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
      {selectedUser && (
        // 뒷배경을 까맣게 덮는 오버레이
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            
            {/* 모달 헤더 */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">제재 상세 정보</h3>
              <button 
                onClick={() => setSelectedUser(null)} 
                className="text-gray-400 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex justify-between items-end border-b pb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">유저 이름 (ID: {selectedUser.id})</p>
                  <p className="text-xl font-bold text-gray-900">{selectedUser.reportedUserName}</p>
                </div>
                {getSanctionBadge(selectedUser.banUntil)}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">정지 해제 일시</p>
                <p className="text-sm font-bold text-red-600">
                  {formatBanDate(selectedUser.banUntil)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">제재 상세 사유</p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 min-h-[80px] whitespace-pre-wrap">
                  {selectedUser.penalty}
                </div>
              </div>
            </div>

            {/* 모달 푸터 (버튼) */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};