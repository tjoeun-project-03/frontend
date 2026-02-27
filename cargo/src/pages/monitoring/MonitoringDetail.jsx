import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { Map, MapMarker, Polyline, useKakaoLoader, CustomOverlayMap } from 'react-kakao-maps-sdk';

export const MonitoringDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);

  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["clusterer", "drawing", "services"],
  });

  useEffect(() => {
    // 실제 환경에서는 여기서 API 호출: const res = await getOrderDetail(id);
    // 제공해주신 SQL 데이터(ORDER_DETAIL) 구조를 그대로 매핑
    setOrderDetail({
      orderId: id,
      invoiceNo: 'JIM-260226-A422', // 목록에서 전달받은 번호 가정
      content: '가전',               // CONTENT
      carType: '5t',               // CAR_TYPE
      weight: 1.203747979525862,   // WEIGHT
      freezer: 0,                  // FREEZER
      departure: '대구역',           // DEPARTURE
      arrival: '부산역',             // ARRIVAL
      distance: 124.8,             // DISTANCE
      clientNote: '1234',          // CLIENT_NOTE
      consigneeName: 'ㅇㅇㅇ',       // CONSIGNEE_NAME
      status: 'DELIVERING',
      
      // SQL 좌표 데이터
      startLat: 35.87492772,       // START_LAT
      startLng: 128.59600693,      // START_LNG
      endLat: 35.11554918,         // END_LAT
      endLng: 129.0403223,         // END_LNG
      
      // 실시간 수집 데이터 (백엔드에서 현재 좌표를 보내준다고 가정)
      currentLat: 35.5049, 
      currentLng: 128.8060,
      driverName: '김기사',
      vehicleInfo: '경북 82가 1234'
    });
  }, [id]);

  if (!orderDetail) return <AdminLayout>데이터를 불러오는 중입니다...</AdminLayout>;

  return (
    <AdminLayout>
      {/* 1. 상단 헤더: 제목 및 기본 식별 정보 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <span className="text-xl">←</span>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">배송 상세 관제</h2>
            <p className="text-sm text-gray-500 font-medium">
              주문 ID: {orderDetail.orderId} | 운송장: {orderDetail.invoiceNo}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 2. 왼쪽: DB 리소스 대시보드 */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 경로 정보 카드 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">운송 정보</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">출발지</span>
                <span className="font-bold text-sm text-gray-800">{orderDetail.departure}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">도착지</span>
                <span className="font-bold text-sm text-gray-800">{orderDetail.arrival}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">총 거리</span>
                <span className="font-bold text-sm text-gray-800">{orderDetail.distance}km</span>
              </div>
            </div>
          </div>

          {/* 화물 및 차량 상세 카드 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">화물/차량 정보</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400">품목 / 중량</p>
                <p className="font-bold text-gray-800">
                  {orderDetail.content} / {orderDetail.weight.toFixed(2)}t
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">차량 및 차주</p>
                <p className="font-bold text-gray-800">{orderDetail.driverName}</p>
                <p className="text-xs text-gray-500">{orderDetail.vehicleInfo} ({orderDetail.carType})</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="text-[10px] text-gray-400">냉동 여부</p>
                  <p className="text-xs font-bold">{orderDetail.freezer === 1 ? '냉동' : '상온'}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="text-[10px] text-gray-400">비고</p>
                  <p className="text-xs font-bold">{orderDetail.clientNote || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 오른쪽: 지도 관제 영역 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md border-4 border-white overflow-hidden h-[650px] relative">
            {!loading && (
              <Map 
                center={{ lat: orderDetail.currentLat, lng: orderDetail.currentLng }} 
                style={{ width: "100%", height: "100%" }}
                level={9} 
              >
                {/* 1. 출발지 마커 (Green Label) */}
                <CustomOverlayMap position={{ lat: orderDetail.startLat, lng: orderDetail.startLng }}>
                  <div className="flex flex-col items-center">
                    <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-white mb-1">
                      출발
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                </CustomOverlayMap>

                {/* 2. 도착지 마커 (Red Label) */}
                <CustomOverlayMap position={{ lat: orderDetail.endLat, lng: orderDetail.endLng }}>
                  <div className="flex flex-col items-center">
                    <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-white mb-1">
                      도착
                    </div>
                    <div className="w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                </CustomOverlayMap>

                {/* 현재 위치 마커 */}
                <CustomOverlayMap 
                  position={{ lat: orderDetail.currentLat, lng: orderDetail.currentLng }}
                >
                  {/* 이제 아래 div만 순수하게 화면에 나타납니다 */}
                  <div className="relative flex items-center justify-center">
                    {/* 펄스 애니메이션 */}
                    <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-blue-400 opacity-60"></span>
                    
                    {/* 메인 마커 본체 */}
                    <div className="relative inline-flex items-center space-x-2 bg-blue-600 text-white p-2.5 px-4 rounded-full shadow-lg border-2 border-white">
                      <span className="text-lg">🚚</span> 
                      <span className="text-xs font-bold whitespace-nowrap">현위치</span>
                    </div>
                  </div>
                </CustomOverlayMap>

                {/* 경로 선 (DB의 시작-현재-끝 좌표 연결) */}
                <Polyline
                  path={[
                    { lat: orderDetail.startLat, lng: orderDetail.startLng },
                    { lat: orderDetail.currentLat, lng: orderDetail.currentLng },
                    { lat: orderDetail.endLat, lng: orderDetail.endLng }
                  ]}
                  strokeWeight={5}
                  strokeColor={"#3b82f6"}
                  strokeOpacity={0.7}
                />
              </Map> 
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};