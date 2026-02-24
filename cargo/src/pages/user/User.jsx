import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getUser } from './../../api/login';


export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('carrier');
  const shippers = [
    { userId: 'dbsdbfla', userName: '남꿍화주', companyName: '(주)짐라인운송', phone: '010-1111-2222', corpReg: '123-45-67890' }
  ];
  
  const carriers = [
    { userId: 'skarnddydwls1', userName: '남꿍차주', car: '현대 포터', carType: '1톤 카고', carNum: '12가3456', phone: '010-9999-8888', isApproved: true }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
        try{
            const users = await getUser();

        }catch(error){

        }
    }
  },[])

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">전체 회원 관리</h2>
        <p className="text-gray-500 text-sm mt-1">플랫폼에 가입한 화주 및 차주 회원을 관리합니다.</p>
      </div>

      {/* 💡 탭(Tab) 버튼 영역 */}
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

      {/* 💡 탭에 따라 다른 테이블 렌더링 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
            <tr>
              {/* 공통 열 */}
              <th className="p-4 font-bold w-1/5">아이디 / 이름</th>
              <th className="p-4 font-bold w-1/5">연락처</th>
              
              {/* 조건부 열: 차주일 때와 화주일 때 다르게 보여줌! */}
              {activeTab === 'carrier' ? (
                <>
                  <th className="p-4 font-bold w-1/4">차량 정보 (차종/번호)</th>
                  <th className="p-4 font-bold w-1/5">서류 승인 상태</th>
                </>
              ) : (
                <>
                  <th className="p-4 font-bold w-1/4">회사명</th>
                  <th className="p-4 font-bold w-1/5">사업자등록번호</th>
                </>
              )}
              <th className="p-4 font-bold text-center w-[15%]">관리</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {activeTab === 'carrier' && carriers.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-semibold text-gray-800">{user.userId}</div>
                  <div className="text-xs text-gray-500">{user.userName}</div>
                </td>
                <td className="p-4 text-sm">{user.phone}</td>
                <td className="p-4">
                  <span className="font-medium text-blue-600">{user.carType}</span>
                  <span className="text-sm text-gray-600 ml-2">({user.carNum})</span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">승인 완료</span>
                </td>
                <td className="p-4 text-center">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">상세</button>
                </td>
              </tr>
            ))}

            {activeTab === 'shipper' && shippers.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-semibold text-gray-800">{user.userId}</div>
                  <div className="text-xs text-gray-500">{user.userName}</div>
                </td>
                <td className="p-4 text-sm">{user.phone}</td>
                <td className="p-4 font-medium text-gray-800">{user.companyName}</td>
                <td className="p-4 text-sm text-gray-500">{user.corpReg}</td>
                <td className="p-4 text-center">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">상세</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};