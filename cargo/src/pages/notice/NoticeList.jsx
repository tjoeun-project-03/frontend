import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button'; 
import { getNoticeList } from '../../api/notice';

export const NoticeList = () => {
  const navigate = useNavigate();
  
  const [notices, setNotices] = useState([]); // 초기값 (빈 배열)
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 (선택사항) 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getNoticeList();
        setNotices(Array.isArray(data) ? data : []);
      } catch(error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTargetText = (targetCode) => {
    switch (targetCode) {
      case 0:
        return '화주';
      case 1:
        return '차주';
      default:
        return '전체';
    }
  }

  // 날짜 변환 함수
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">공지사항 관리</h2>
          <p className="text-gray-500 mt-1">사용자 앱에 노출될 공지사항을 등록합니다.</p>
        </div>
      </div>

      {/* 2. 테이블 영역 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">데이터를 불러오는 중...</div>
        ) : (
          <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">번호</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">대상자</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b w-1/2">제목</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">작성자</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">등록일</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">조회수</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
              {notices.length === 0 ? (
                /* 데이터 없을 때 */
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              ) : ( 
                /* 데이터 있을 때 (기존 맵핑 코드) */
                notices.map((item) => (
                  
                  <tr 
                    key={item.id} 
                    onClick={() => navigate(`/notice/${item.id}`)}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      item.pinned ? 'bg-red-50/50' : ''
                    }`}
                  >
                    <td className="p-4 text-gray-600">
                      {item.pinned ? (
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">
                          필독
                        </span>
                      ) : (
                        item.id
                      )}
                    </td>
                    <td className="p-4 font-medium">{getTargetText(item.target)}</td>
                    <td className="p-4 text-gray-800 font-medium truncate max-w-xs">{item.title}</td>
                    <td className="p-4 text-gray-600">{item.writerName}</td>
                    <td className="p-4 text-gray-500 text-sm">{formatDate(item.createdAt)}</td>
                    <td className="p-4 text-gray-600">{item.viewCount}</td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => navigate('/notice/write')}>
          공지사항 작성
        </Button>
      </div>

    </AdminLayout>
  );
};