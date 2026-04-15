import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getOrderDetail } from '../../api/order';

export const MonitoringDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // 지도 인스턴스, 오버레이 ref로 직접 관리
  const mapContainerRef = useRef(null); // div 참조
  const mapRef = useRef(null);          // 지도 인스턴스
  const overlayRef = useRef(null);      // 현위치 오버레이

  // 1. 주문 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrderDetail(id);
        setOrderDetail(response);

        const lat = parseFloat(response.startLat || response.startLat);
        const lng = parseFloat(response.startLng || response.startLng);

        if (!isNaN(lat) && !isNaN(lng)) {
          setCurrentLocation({ lat, lng });
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error.message, error);
      }
    };
    fetchData();
  }, [id]);

  // 2. 지도 인스턴스 - 딱 1번만 생성
  useEffect(() => {
    if (!orderDetail || !mapContainerRef.current) return;
    if (mapRef.current) return; // 이미 생성됐으면 스킵

    // 방어 코드 1: 카카오맵이 아직 다운로드 안 됐으면 이 함수를 멈추고 기다림
    if(!window.kakao || !window.kakao.maps) return;

    // 방어 코드 2: 카카오 맵 객체가 '완전히 로드된 후'에 지도를 그리도록 보장
    setTimeout(() => {
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapContainerRef.current, {
          center: new window.kakao.maps.LatLng(
            Number(orderDetail.startLat),
            Number(orderDetail.startLng)
          ),
          level: 9
        });
        mapRef.current = map;

        // 출발지 오버레이 - 고정이라 지도 생성 시 한번만 추가
        new kakao.maps.CustomOverlay({
          map: map,
          position: new kakao.maps.LatLng(
            Number(orderDetail.startLat),
            Number(orderDetail.startLng)
          ),
          content: `
            <div style="display:flex; flex-direction:column; align-items:center;">
              <div style="background:#10b981; color:white; font-size:10px; 
                          font-weight:bold; padding:4px 8px; border-radius:4px;">출발</div>
              <div style="width:8px; height:8px; background:#10b981; border-radius:50%;"></div>
            </div>
          `
        });

        // 도착지 오버레이 - 고정이라 지도 생성 시 한번만 추가
        new kakao.maps.CustomOverlay({
          map: map,
          position: new kakao.maps.LatLng(
            Number(orderDetail.endLat),
            Number(orderDetail.endLng)
          ),
          content: `
            <div style="display:flex; flex-direction:column; align-items:center;">
              <div style="background:#f43f5e; color:white; font-size:10px; 
                          font-weight:bold; padding:4px 8px; border-radius:4px;">도착</div>
              <div style="width:8px; height:8px; background:#f43f5e; border-radius:50%;"></div>
            </div>
          `
        });
      })
    }, 100)
  }, [orderDetail]); // orderDetail 로드 후 지도 생성

  // 3. 현위치 오버레이만 갱신 - 지도는 건드리지 않음
  useEffect(() => {
    if (!mapRef.current || !currentLocation) return;

    const currentPosition = new window.kakao.maps.LatLng(
      Number(currentLocation.lat),
      Number(currentLocation.lng)
    );

    // 기존 현위치 오버레이 제거
    if (overlayRef.current) {
      overlayRef.current.setPosition(currentPosition);
    } else {
      const newOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(
          Number(currentLocation.lat),
          Number(currentLocation.lng)
        ),
        content: `
          <div style="position:relative; display:flex; align-items:center; justify-content:center;">
            <div style="background:#2563eb; color:white; padding:8px 14px; 
                        border-radius:9999px; font-size:12px; font-weight:bold;
                        border:2px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3);">
              🚚 현위치
            </div>
          </div>
        `
      });
      newOverlay.setMap(mapRef.current); // 지도에만 붙임
      overlayRef.current = newOverlay;   // ref에 저장
    }

    mapRef.current.panTo(currentPosition);

  }, [currentLocation]); // 위치 바뀔 때만 실행

  // 4. WebSocket 연결
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

    // 5. 언마운트 시 정리
    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
      if (overlayRef.current) overlayRef.current.setMap(null); // 오버레이 정리
    };
  }, [id]);


  if (!orderDetail) return <AdminLayout>데이터를 불러오는 중입니다...</AdminLayout>;

  return (
    <AdminLayout>
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

        {/* 왼쪽 대시보드 - 기존과 동일 */}
        <div className="lg:col-span-1 space-y-6">
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

        {/* 오른쪽 지도 - div로 직접 참조 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md border-4 border-white overflow-hidden h-[650px] relative">
            {/* Map 컴포넌트 대신 div에 ref 연결 */}
            <div
              ref={mapContainerRef}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};