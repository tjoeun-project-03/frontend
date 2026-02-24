import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getUser } from './../../api/login';
import { useNavigate } from 'react-router-dom';

export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('carrier');
  const [allUsers, setAllUsers] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUser();
        setAllUsers(users);
      } catch (error) {
        console.error("유저 정보를 가져오는데 실패했습니다.", error);
      }
    };
    fetchUsers();
  }, []);

  // 💡 탭 상태에 따라 데이터를 분류합니다. (렌더링 할 때마다 알아서 필터링 됨)
  const displayUsers = allUsers.filter(user => {
    // 대소문자 구분 없이 처리하기 위해 toUpperCase() 사용 (안전빵)
    if (activeTab === 'carrier') return user.role?.toUpperCase() === 'CARRIER';
    if (activeTab === 'shipper') return user.role?.toUpperCase() === 'SHIPPER';
    return false;
  });

  // 날짜 포맷팅 함수 (년-월-일)
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">전체 회원 관리</h2>
        <p className="text-gray-500 text-sm mt-1">플랫폼에 가입한 화주 및 차주 회원을 관리합니다.</p>
      </div>

      {/* 탭(Tab) 버튼 영역 */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('carrier')}
          className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${
            activeTab === 'carrier' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          차주 목록
        </button>
        <button
          onClick={() => setActiveTab('shipper')}
          className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${
            activeTab === 'shipper' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          화주 목록
        </button>
      </div>

      {/* 테이블 영역 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-bold w-1/5">아이디 / 이름</th>
              <th className="p-4 font-bold w-1/5">연락처</th>
              <th className="p-4 font-bold w-1/5">이메일</th>
              <th className="p-4 font-bold w-1/5">가입일</th>
              
              <th className="p-4 font-bold text-center w-[15%]">제재 내역 조회</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {/* 💡 필터링된 displayUsers 배열을 map으로 돌립니다. */}
            {displayUsers.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-semibold text-gray-800">{user.userId}</div>
                  <div className="text-xs text-gray-500">{user.userName}</div>
                </td>
                <td className="p-4 text-sm">{user.phone}</td>
                <td className="p-4 text-sm">{user.email}</td>
                <td className="p-4 text-sm">{formatDate(user.createdAt)}</td>
                <td className="p-4 text-center">
                    <button 
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50" 
                    onClick={() => navigate(`/user/reportUser/${user.userId}`)}
                    >
                    상세
                    </button>
                </td>
              </tr>
            ))}

            {/* 유저가 없을 경우 예외 처리 */}
            {displayUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  조회된 {activeTab === 'carrier' ? '차주' : '화주'} 회원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};