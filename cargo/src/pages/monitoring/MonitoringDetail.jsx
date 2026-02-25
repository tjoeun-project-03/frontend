import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { Map, MapMarker, useKakaoLoader} from 'react-kakao-maps-sdk';

export const MonitoringDetail = () => {
  const { id } = useParams(); // URL에서 'ORD-260219-001' 같은 ID를 쏙 빼옵니다.
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);

  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY, // .env에 적어둔 키를 리액트 방식으로 가져옴
    libraries: ["clusterer", "drawing", "services"],
  });

  useEffect(() => {
    // 💡 백엔드 통신 위치: id를 가지고 이 배차의 모든 상세 정보와 위경도를 가져옵니다.
    // fetchDetail(id);
    
    // (임시 더미 데이터)
    setOrderDetail({
      id: id,
      status: 'DELIVERING',
      shipperName: '(주)대한물류',
      driverName: '김기사',
      vehicleInfo: '서울 82가 1234 (5톤 윙바디)',
      origin: '경기 파주시',
      destination: '부산 강서구',
      currentLocation: '경부고속도로 천안JC 부근',
      lat: 36.8406, // 백엔드에서 받아온 위도
      lng: 127.1738 // 백엔드에서 받아온 경도
    });
  }, [id]);

  if (!orderDetail) return <AdminLayout>로딩 중...</AdminLayout>;

  return (
    <AdminLayout>
      {/* 상단: 타이틀 및 뒤로가기 */}
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-gray-800">배송 상세 관제</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold ml-2">
          {orderDetail.status === 'DELIVERING' ? '배송 중' : '배차 완료'}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* 1. 상단: 배차 상세 정보 카드 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">주문 번호</p>
            <p className="font-bold text-gray-800 text-lg">{orderDetail.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">경로 (출발 ➔ 도착)</p>
            <p className="font-bold text-gray-800 text-lg">{orderDetail.origin} ➔ {orderDetail.destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">차주 및 차량 정보</p>
            <p className="font-bold text-gray-800 text-lg">{orderDetail.driverName} <span className="text-sm font-normal text-gray-600">({orderDetail.vehicleInfo})</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[500px] relative">
          
          <div className="absolute top-4 left-4 z-10 bg-white/90 p-4 rounded-lg shadow-md backdrop-blur-sm">
            <p className="text-xs text-gray-500 font-bold mb-1">현재 위치 보고</p>
            <p className="text-lg font-bold text-blue-700">{orderDetail.currentLocation}</p>
          </div>

          <Map 
            key={`${orderDetail.lat}-${orderDetail.lng}`} // 💡 좌표 데이터가 로드되면 지도를 강제로 다시 그립니다.
            center={{ lat: orderDetail.lat, lng: orderDetail.lng }} 
            style={{ width: "100%", height: "500px" }}
            level={4} 
          >
            <MapMarker position={{ lat: orderDetail.lat, lng: orderDetail.lng }}>
              <div style={{ padding: "5px", color: "#000" }}>현재 위치</div>
            </MapMarker>
          </Map> 
        </div>
      </div>
    </AdminLayout>
  );
};