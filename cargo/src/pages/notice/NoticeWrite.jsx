import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button';
import { createNotice, updateNotice } from '../../api/notice';

export const NoticeWrite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const detailData = location.state;
  const isEditMode = Boolean(id);

  // useState 초기값 함수에서 조건에 따라 초기 상태를 설정 (Lazy Initialization)
  const [form, setForm] = useState(() => {
    if (isEditMode && detailData) {
      return {
        title: detailData.title,
        content: detailData.content,
        target: detailData.target,
        pinned: detailData.pinned,
      };
    }
    return { title: '', content: '', target: 0, pinned: false };
  });

  useEffect(() => {
    // 수정 모드인데 데이터가 없는 경우(새로고침 등) 예외 처리
    if (isEditMode && !detailData) {
      alert("잘못된 접근이거나 데이터가 없습니다.");
      navigate('/notice');
    }
  }, [isEditMode, detailData, navigate]);

  // 2. 핸들러 수정 (숫자 변환 로직 추가)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked 
            : name === 'target' ? parseInt(value) 
            : value
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content) return alert('제목과 내용을 입력해주세요.');
    try {
      if(isEditMode){
        await updateNotice(form, id);
        alert("공지사항이 수정되었습니다.");
        navigate('/notice');
      } else {
        await createNotice(form);
        alert('공지사항이 등록되었습니다.');
        navigate('/notice'); 
      }
    } catch (err) {
      console.error(err);
      alert('등록에 실패했습니다.');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {form ? '공지사항 수정' : '공지사항 등록'}
            {isEditMode ? '공지사항 수정' : '공지사항 등록'}
          </h2>
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            취소하고 돌아가기
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-6">
          
          {/* 옵션 영역 (중요 공지 + 대상 선택) */}
          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            
            {/* 1. 중요 공지 체크박스 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pinned"
                name="pinned"
                checked={form.pinned}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mr-2 cursor-pointer"
              />
              <label htmlFor="pinned" className="text-gray-700 font-bold cursor-pointer select-none">
                상단 고정 (중요 공지)
              </label>
            </div>

            <hr className="border-gray-200" />

            {/* 2. 대상 선택 (라디오 버튼) 추가됨 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">공지 대상</label>
              <div className="flex items-center gap-6">

                {/* 전체 (Value: 2) */}
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="target"
                    value={2}
                    checked={form.target === 2}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 group-hover:text-blue-600 font-medium">
                    전체
                  </span>
                </label>
                
                {/* 화주 (Value: 0) */}
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="target"
                    value={0}
                    checked={form.target === 0}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 group-hover:text-blue-600 font-medium">
                    화주
                  </span>
                </label>

                {/* 차주 (Value: 1) */}
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="target"
                    value={1}
                    checked={form.target === 1}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-gray-700 group-hover:text-green-600 font-medium">
                    차주
                  </span>
                </label>

              </div>
            </div>
          </div>

          {/* 3. 제목 입력 */}
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

          {/* 4. 내용 입력 */}
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
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/30">
            <Button onClick={handleSubmit}>
              {isEditMode ? '수정 완료' : '등록 완료'}
            </Button>
            <button 
              onClick={() => navigate(-1)}
              className="
                h-11 px-6 rounded-lg border border-gray-300 
                text-gray-700 font-medium 
                hover:bg-white hover:border-gray-400 transition-colors
                flex items-center justify-center 
                whitespace-nowrap"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};