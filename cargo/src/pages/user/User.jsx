import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getUser } from './../../api/login';
import { useNavigate } from 'react-router-dom';

export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('carrier');
  const [allUsers, setAllUsers] = useState([]); 
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가

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

  // 💡 탭과 검색어에 따라 데이터를 분류합니다.
  const displayUsers = allUsers
    .filter(user => {
      // 1. 탭 필터링
      if (activeTab === 'carrier') return user.role?.toUpperCase() === 'CARRIER';
      if (activeTab === 'shipper') return user.role?.toUpperCase() === 'SHIPPER';
      return false;
    })
    .filter(user => {
      // 2. 검색어 필터링
      if (!searchTerm) return true; // 검색어가 없으면 모두 통과
      const term = searchTerm.toLowerCase();
      const userId = user.userId?.toLowerCase() || '';
      const userName = user.userName?.toLowerCase() || '';
      return userId.includes(term) || userName.includes(term);
    });

  // 페이지네이션 계산
  const totalPages = Math.ceil(displayUsers.length / ITEMS_PER_PAGE);
  const currentUsers = displayUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // 페이지 번호 그룹 계산 (10개씩 표시)
  const PAGE_GROUP_SIZE = 10;
  const startPage = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

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

      {/* 탭 & 검색 영역 */}
      <div className="flex justify-between items-center mb-6">
        {/* 탭(Tab) 버튼 영역 */}
        <div className="flex space-x-1 bg-blue-100/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => { setActiveTab('carrier'); setCurrentPage(1); }}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${
              activeTab === 'carrier' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            차주 목록
          </button>
          <button
            onClick={() => { setActiveTab('shipper'); setCurrentPage(1); }}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${
              activeTab === 'shipper' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            화주 목록
          </button>
        </div>

        {/* 검색창 */}
        <div className="relative">
          <input
            type="text"
            placeholder="아이디 또는 이름으로 검색"
            value={searchTerm}
            
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // 검색 시 1페이지로 초기화
            }}
            className="w-60 p-2 pl-8 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none text-sm"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-50/50 border-b border-blue-100 text-slate-600 text-sm">
            <tr>
              <th className="p-4 font-bold w-1/5">아이디 / 이름</th>
              <th className="p-4 font-bold w-1/5">연락처</th>
              <th className="p-4 font-bold w-1/5">이메일</th>
              <th className="p-4 font-bold w-1/5">가입일</th>
              
              <th className="p-4 font-bold text-center w-[15%]">제재 내역 조회</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-blue-50">
            {/* 💡 페이지네이션 적용된 currentUsers 배열을 map으로 돌립니다. */}
            {currentUsers.map((user) => (
              <tr key={user.userId} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-gray-800">{user.userId}</div>
                  <div className="text-xs text-gray-500">{user.userName}</div>
                </td>
                <td className="p-4 text-sm">{user.phone}</td>
                <td className="p-4 text-sm">{user.email}</td>
                <td className="p-4 text-sm">{formatDate(user.createdAt)}</td>
                <td className="p-4 text-center">
                    <button 
                    className="px-3 py-1 border border-blue-200 text-blue-600 rounded text-sm hover:bg-blue-50 bg-white" 
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
        
        {/* 페이지네이션 컨트롤 */}
        {displayUsers.length > 0 && (
          <div className="flex justify-center items-center p-4 space-x-2 border-t border-blue-100 bg-blue-50/30">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-blue-200 bg-white text-slate-600 disabled:opacity-50 text-sm hover:bg-blue-50 transition-colors"
            >
              이전
            </button>
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border text-sm transition-colors ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                    : 'bg-white text-slate-600 border-blue-200 hover:bg-blue-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-blue-200 bg-white text-slate-600 disabled:opacity-50 text-sm hover:bg-blue-50 transition-colors"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};