import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { Map, Polyline, useKakaoLoader, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { getOrderDetail } from '../../api/order';

export const MonitoringDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const [loading] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["clusterer", "drawing", "services"],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrderDetail(id);
        setOrderDetail(response);
        
        const lat = parseFloat(response.currentLat);
        const lng = parseFloat(response.currentLng);
        if (!isNaN(lat) && !isNaN(lng)) {
          setCurrentLocation({ lat, lng });
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const wsUrl = `ws://52.204.62.127:8000/api/v1/tracking/ws/${id}`; 
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log(`관리자 웹소켓 연결 성공! (주문번호: ${id})`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.lat && data.lng) {
          setCurrentLocation({ 
            lat: parseFloat(data.lat), 
            lng: parseFloat(data.lng) 
          });
        }
      } catch (error) {
        console.error("데이터 파싱 에러:", error);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
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
                center={currentLocation 
                  ? { lat: Number(currentLocation.lat), lng: Number(currentLocation.lng) }
                  : { lat: Number(orderDetail.startLat), lng: Number(orderDetail.startLng) }
                }
                style={{ width: "100%", height: "100%" }}
                level={9} 
              >
                {/* 1. 출발지 마커  */}
                <CustomOverlayMap position={{ lat: Number(orderDetail.startLat), lng: Number(orderDetail.startLng) }}>
                  <div className="flex flex-col items-center">
                    <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-white mb-1">
                      출발
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                </CustomOverlayMap>

                {/* 2. 도착지 마커 */}
                <CustomOverlayMap position={{ lat: Number(orderDetail.endLat), lng: Number(orderDetail.endLng) }}>
                  <div className="flex flex-col items-center">
                    <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-white mb-1">
                      도착
                    </div>
                    <div className="w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                </CustomOverlayMap>

                {/* 현재 위치 마커 */}
                {currentLocation && (
                  <CustomOverlayMap 
                  position={{ lat: Number(currentLocation.lat), lng: Number(currentLocation.lng) }}
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
                )}

                {/* 경로 선 (DB의 시작-현재-끝 좌표 연결) */}
                <Polyline
                  path={[
                    { lat: Number(orderDetail.startLat), lng: Number(orderDetail.startLng) },
                    ...(currentLocation ? [{ lat: Number(currentLocation.lat), lng: Number(currentLocation.lng) }] : []),
                    { lat: Number(orderDetail.endLat), lng: Number(orderDetail.endLng) }
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