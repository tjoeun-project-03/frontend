import React, {useState, useEffect} from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { getSurcharge } from '../api/surcharge';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [currentPricing, setCurrentPricing] = useState({});

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const pricing = await getSurcharge(); 
        setCurrentPricing(pricing);
      } catch (error) {
        console.error('수수료 데이터를 불러오는 중 에러 발생:', error);
      }
    };

    fetchPricing();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">관리자 대시보드</h2>
        <p className="text-gray-500 text-sm mt-1">오늘의 운영 현황과 처리해야 할 업무를 확인하세요.</p>
      </div>

      {/* 1. 실무형 요약 카드 영역 (To-Do & 알림 위주) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* onClick 이벤트를 달아서 누르면 바로 해당 메뉴로 이동하게 하면 아주 편합니다! */}
        <StatCard title="정산 대기 (미승인)" value="0 건" color="bg-blue-500" textColor="text-blue-600" onClick={() => navigate('/settlement')} />
        <StatCard title="미처리 신고 접수" value="0 건" color="bg-red-500" textColor="text-red-600" onClick={() => navigate('/report')} />
        <StatCard title="배차 지연 (30분 초과)" value="0 건" color="bg-amber-500" textColor="text-amber-600" />
        <StatCard title="현재 실시간 배송 중" value="0 건" color="bg-green-500" textColor="text-green-600" onClick={() => navigate('/monitoring')} />
      </div>

      {/* 2. 메인 컨텐츠 영역 (좌: 목록, 우: 수수료 정책) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 좌측 (2칸 차지): 실시간 화물 현황 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">실시간 화물 등록 현황</h3>
            <button className="text-sm text-blue-500 hover:underline" onClick={() => navigate('/monitoring')}>전체보기</button>
          </div>
          <div className="border border-dashed border-gray-300 rounded-lg p-4 h-64 flex items-center justify-center text-gray-400 bg-gray-50">
            (여기에 실시간 배차 목록 리스트가 들어옵니다)
          </div>
        </div>

        {/* 우측 (1칸 차지): 💸 수수료 및 할증 현황 위젯 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">현재 수수료·할증 정책</h3>
            <button 
              onClick={() => navigate('/surcharge/manage')}
              className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
            >
              설정 변경
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {/* 기본 수수료 */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-sm font-bold text-gray-700">플랫폼 기본 수수료</span>
              <span className="text-lg font-extrabold text-blue-600">{currentPricing.baseFee}%</span>
            </div>

            {/* 할증 목록 */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <div className="flex justify-between items-center px-2">
                <span className="text-sm text-gray-600">🌧️ 날씨 할증 (눈/비)</span>
                <span className="text-sm font-bold text-gray-800">+{currentPricing.weatherRule}%</span>
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-sm text-gray-600">🌙 심야 할증 (22시~06시)</span>
                <span className="text-sm font-bold text-gray-800">+{currentPricing.nightRule}%</span>
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-sm text-gray-600">📅 공휴일 할증</span>
                <span className="text-sm font-bold text-gray-800">+{currentPricing.holidayRule}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
            <p className="text-xs text-blue-600">현재 적용 가능한 최대 할증 합계</p>
            <p className="text-xl font-black text-blue-700 mt-1">
              +{currentPricing.weatherRule + currentPricing.nightRule + currentPricing.holidayRule}%
            </p>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

// 💡 업그레이드된 통계 카드 (클릭 효과 및 텍스트 색상 추가)
const StatCard = ({ title, value, color, textColor, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''}`}
  >
    <p className="text-gray-500 text-sm mb-2 font-medium">{title}</p>
    <h3 className={`text-2xl font-black ${textColor}`}>{value}</h3>
    <div className={`h-1.5 w-full mt-4 rounded-full bg-gray-100 overflow-hidden`}>
      {/* 바(Bar) 효과 */}
      <div className={`h-full ${color} w-3/4`}></div> 
    </div>
  </div>
);