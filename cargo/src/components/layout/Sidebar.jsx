import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Link 컴포넌트 추가
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../api/login';


const Sidebar = () => {
  const navigate = useNavigate();
  const menus = [
    {
      name: "운송 관제",
      items: [
        { name: "실시간 모니터링", path: "/monitoring" },
        { name: "할증/수수료 설정", path: "/surcharge/manage" },
      ]
    },
    {
      name: "회원 관리",
      items: [
        { name: "사용자 제재", path: "/sanction/list" },
        { name: "유저 조회", path: "/user/list" },
      ]
    },
    {
      name: "고객 지원",
      items: [
        { name: "1:1 문의 답변", path: "/inquiry"},
        { name: "신고 심사", path: "/report" },
        { name: "공지사항 관리", path: "/notice" },
      ]
    }
  ];

  const handleLogout = async () => {
    if (!window.confirm("로그아웃 하시겠습니까?")) return;

    try {
      await logoutUser(); 
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
      alert('로그아웃 되었습니다.');
      navigate('/'); 
    } catch (error) {
      console.error("서버 로그아웃 통신 실패:", error);
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-50 text-gray-600 flex flex-col fixed left-0 top-0 z-50 border-r border-gray-200 font-sans shadow-xl">
      {/* 1. 로고 영역 */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-white">
        <Link to="/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tight text-gray-800 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-indigo-200 font-serif italic">
            J
          </div>
          <span>Jim<span className="text-indigo-500">Line</span></span>
        </Link>
      </div>

      {/* 2. 메뉴 영역 */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <ul className="space-y-8"> {/* 카테고리 간 간격 넓힘 */}
          
          {menus.map((menu, index) => (
            <li key={index}>
              
              {/* (A) 하위 메뉴가 있는 경우: 제목으로 표시 */}
              {menu.items ? (
                <div>
                  <div className="px-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {menu.name}
                  </div>
                  {/* 소분류 리스트 */}
                  <ul className="space-y-1">
                    {menu.items.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <NavLink 
                          to={subItem.path}
                          className={({ isActive }) => 
                            `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                              isActive 
                                ? "bg-white text-blue-600 shadow-sm translate-x-1" 
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                            }`
                          }
                        >
                          {/* 아이콘 대신 불릿 포인트 활용 */}
                          <span className="w-1.5 h-1.5 rounded-full mr-3 bg-current opacity-40 group-hover:opacity-100 transition-opacity"></span>
                          {subItem.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                /* (B) 하위 메뉴가 없는 경우 (대시보드): 바로 링크 */
                <NavLink 
                  to={menu.path}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                    }`
                  }
                >
                  {menu.icon ? (
                    <span className="mr-3">{menu.icon}</span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full mr-3 bg-current opacity-40"></span>
                  )}
                  {menu.name}
                </NavLink>
              )}
            </li>
          ))}

        </ul>
      </nav>
      
      {/* 3. 하단 로그아웃 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors group"
        >
          <span className="mr-2 group-hover:text-red-400 transition-colors">➔</span>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Sidebar;