import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getInquiryList } from '../../api/inquiry';

export const InquiryList = () => {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]); // 초기값 (빈 배열)
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 (선택사항) 
  const [filterStatus, setFilterStatus] = useState('PENDING'); // 필터 상태: ALL, PENDING, COMPLETED

  useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await getInquiryList();
          setInquiries(Array.isArray(data) ? data : []);
        } catch(error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, []);

  const getStatusBadge = (status) => {
    if (status == 'COMPLETED') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          답변완료
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          답변대기
        </span>
      );
    }
  };

  // 날짜 변환 함수
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  }

  // 3. 상세 페이지로 이동 함수
  const handleRowClick = (id, item) => {
    navigate(`/inquiry/${id}`, {state: item});
  };

  // 필터링 로직
  const filteredInquiries = inquiries.filter((item) => {
    if (filterStatus === 'COMPLETED') return item.status === 'COMPLETED';
    if (filterStatus === 'PENDING') return item.status !== 'COMPLETED';
    return true;
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">1:1 문의 관리</h2>
        <p className="text-gray-500 mt-1">접수된 문의를 확인하고 답변을 등록하세요.</p>
      </div>

      {/* 필터 버튼 영역 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterStatus('PENDING')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === 'PENDING'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          답변대기
        </button>
        <button
          onClick={() => setFilterStatus('COMPLETED')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === 'COMPLETED'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          답변완료
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* 1. 로딩 중일 때 처리 */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-16">번호</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-32">카테고리</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">제목</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-32">작성자</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-32">등록일</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-24">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {/* 2. 데이터가 없을 때 처리 */}
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    {filterStatus === 'ALL' ? '접수된 문의가 없습니다.' : '해당 상태의 문의가 없습니다.'}
                  </td>
                </tr>
              ) : (
                /* 3. 안전하게 옵셔널 체이닝(?.) 사용 */
                filteredInquiries?.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => handleRowClick(item.id, item)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="p-4 text-gray-600">{item.id}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.category}</td>
                    <td className="p-4 text-gray-800 font-medium truncate max-w-xs">
                        {item.title}
                    </td>
                    <td className="p-4 text-gray-600">{item.user}</td>
                    
                    {/* 날짜 포맷 적용 */}
                    <td className="p-4 text-gray-500 text-sm">
                        {formatDate(item.createdAt)}
                    </td>
                    
                    <td className="p-4">
                      {getStatusBadge(item.status)}
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