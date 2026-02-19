import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/Button';

export const SurchargeManage = () => {
  const [pricing, setPricing] = useState({
    baseFee: 0,
    weatherRule: 0,
    nightRule: 0,
    holidayRule: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPricing({
      ...pricing,
      [name]: Number(value)
    });
  };

  const handleSave = async () => {
    if (window.confirm('수수료 및 할증 정책을 저장하시겠습니까?')) {
      console.log('서버로 보낼 데이터:', pricing);
      alert('저장되었습니다!');
    }
  };

  // 💡 할증률 합계 계산 로직 (날씨 + 심야 + 휴일)
  const totalSurcharge = pricing.weatherRule + pricing.nightRule + pricing.holidayRule;
  // 예시 운임 (10만 원 기준)
  const exampleBaseFare = 100000;
  const exampleSurchargeAmount = exampleBaseFare * (totalSurcharge / 100);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">수수료 및 할증 관리</h2>
      </div>

      <div className="space-y-6 max-w-4xl">
        
        {/* 1. 기본 수수료 설정 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">기본 수수료 설정</h3>
          <div className="flex items-center space-x-4">
            <label className="w-32 text-sm font-bold text-gray-700">플랫폼 수수료</label>
            <div className="relative flex-1 max-w-xs">
              <input 
                type="number" name="baseFee" value={pricing.baseFee} onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right pr-8"
              />
              <span className="absolute right-3 top-3 text-gray-500">%</span> 
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-36">운송 완료 시 화주가 결제하는 금액에서 공제되는 비율입니다.</p>
        </div>

        {/* 2. 할증 요금 설정 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">상황별 할증 요금 설정</h3>
          
          <div className="space-y-4">
            {/* 날씨 할증 */}
            <div className="flex items-center space-x-4">
              <label className="w-32 text-sm font-bold text-gray-700">날씨 할증</label>
              <div className="relative flex-1 max-w-xs">
                <input type="number" name="weatherRule" value={pricing.weatherRule} onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right pr-8" />
                <span className="absolute right-3 top-3 text-gray-500">%</span>
              </div>
            </div>

            {/* 심야 할증 */}
            <div className="flex items-center space-x-4">
              <label className="w-32 text-sm font-bold text-gray-700">심야 할증</label>
              <div className="relative flex-1 max-w-xs">
                <input type="number" name="nightRule" value={pricing.nightRule} onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right pr-8" />
                <span className="absolute right-3 top-3 text-gray-500">%</span>
              </div>
            </div>

            {/* 휴일 할증 */}
            <div className="flex items-center space-x-4">
              <label className="w-32 text-sm font-bold text-gray-700">휴일 할증</label>
              <div className="relative flex-1 max-w-xs">
                <input type="number" name="holidayRule" value={pricing.holidayRule} onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right pr-8" />
                <span className="absolute right-3 top-3 text-gray-500">%</span>
              </div>
            </div>
          </div>

          {/* 💡 3. 최대 할증률 요약 뷰 (새로 추가된 부분) */}
          <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-blue-800">최대 적용 가능 할증률 (합계)</span>
              <span className="text-2xl font-extrabold text-blue-600">{totalSurcharge}%</span>
            </div>
            <p className="text-sm text-blue-600/80 mt-2">
              비 오는 빨간날 새벽에 배차될 경우, 모든 할증이 중복 적용되어 기본 운임에 <strong className="text-blue-700">최대 {totalSurcharge}%</strong>가 추가됩니다.
              <br/>
              (예시: 기본 운임 100,000원 ➔ 할증 <strong className="text-blue-700">{exampleSurchargeAmount.toLocaleString()}원</strong> 추가)
            </p>
          </div>

        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-8 py-3 text-lg font-bold">
            정책 저장하기
          </Button>
        </div>

      </div>
    </AdminLayout>
  );
};