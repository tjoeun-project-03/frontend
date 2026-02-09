import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button';
import Input from '../../components/Input'; // 기존 Input 재사용

export const NoticeWrite = () => {
  const navigate = useNavigate();

  // 입력 데이터 관리
  const [form, setForm] = useState({
    title: '',
    content: '',
    isPinned: false, // 상단 고정 여부
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!form.title || !form.content) return alert('제목과 내용을 입력해주세요.');
    
    // API 전송 로직 (생략)
    alert('공지사항이 등록되었습니다.');
    navigate('/support/notice');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">공지사항 등록</h2>
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            취소하고 돌아가기
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          
          {/* 1. 옵션 체크박스 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPinned"
              name="isPinned"
              checked={form.isPinned}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mr-2 cursor-pointer"
            />
            <label htmlFor="isPinned" className="text-gray-700 font-medium cursor-pointer select-none">
              중요 공지로 설정 (상단 고정)
            </label>
          </div>

          {/* 2. 제목 입력 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="공지사항 제목을 입력하세요"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* 3. 내용 입력 (Textarea) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="공지 내용을 자세히 입력하세요..."
              className="w-full h-80 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
            />
          </div>

          <hr className="border-gray-100" />

          {/* 4. 버튼 영역 */}
          <div className="flex justify-end gap-3">
            <Button onClick={handleSubmit}>
              등록 완료
            </Button>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};