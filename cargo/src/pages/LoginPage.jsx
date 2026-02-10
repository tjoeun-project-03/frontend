import React from 'react'; // useState 제거됨 (훅 안에 있으니까)
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useLogin } from '../hooks/useLogin'; 

export const LoginPage = () => {
  const navigate = useNavigate();

  // 2. 훅을 실행해서 필요한 것들만 쏙 빼옵니다.
  const { 
    formData, 
    error, 
    isLoading, 
    handleChange, 
    handleSubmit // 훅 안에 있는 handleSubmit을 가져옴
  } = useLogin();

  // 3. 페이지 전용: "로그인 성공 후 이동"만 담당하는 함수
  const onLoginProcess = async (e) => {
    // 훅에 있는 handleSubmit을 실행하고 결과를 기다림
    const isSuccess = await handleSubmit(e);
    
    // 훅이 "true(성공)"를 줬을 때만 이동
    if (isSuccess) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">관리자 로그인</h2>
          <p className="text-gray-500 mt-2">화물 운송 관리 시스템</p>
        </div>

        {/* 4. form의 onSubmit에 우리가 만든 연결 함수(onLoginProcess)를 넣습니다 */}
        <form onSubmit={onLoginProcess}>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="아이디"
              name="id"
              value={formData.id}
              onChange={handleChange}
            />
            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="mt-8">
            <Button 
              type="submit" 
              className={`w-full py-3 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인 하기'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};