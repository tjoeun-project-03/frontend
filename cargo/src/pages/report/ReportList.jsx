import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getReportList } from '../../api/report';

export const ReportList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useState(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getReportList();
        setReports(Array.isArray(data) ? data : []);
      } catch(error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  },[])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">신고 접수 및 심사</h2>
        <p className="text-gray-500 mt-1">사용자 간의 분쟁 및 신고 내역을 심사하고 처분을 내립니다.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b w-20">번호</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">대상자(피신고인)</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">신고자</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b">접수일</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase border-b text-center">상태</th>
            </tr>
          </thead> 
          <tbody className="divide-y divide-gray-100">
            {reports.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => navigate(`/report/${item.id}`, { state: item })}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="p-4 text-gray-600">{item.id}</td>
                <td className="p-4 text-gray-700 font-medium">{item.reportedUserId}</td>
                <td className="p-4 text-gray-500">{item.reporterId}</td>
                <td className="p-4 text-gray-400 text-sm">{formatDate(item.createdAt)}</td>
                <td className="p-4 text-center">
                  {item.status == 'PENDING' ? (
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">
                      심사 대기
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                      처리 완료
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};