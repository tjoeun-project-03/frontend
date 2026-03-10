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
        { name: "신고 심사", path: "/report" },
        { name: "1:1 문의 답변", path: "/inquiry"},
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
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* 1. 로고 영역 */}
      <div className="p-6 text-center border-b border-slate-800">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-400 block hover:text-blue-300 transition-colors">
          화물 관리자
        </Link>
      </div>

      {/* 2. 메뉴 영역 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-6"> {/* 카테고리 간 간격 */}
          
          {menus.map((menu, index) => (
            <li key={index}>
              
              {/* (A) 하위 메뉴가 있는 경우: 제목으로 표시 */}
              {menu.items ? (
                <div>
                  <div className="flex items-center text-slate-400 text-sm font-bold mb-2 px-2 uppercase tracking-wider">
                    <span className="mr-2"></span>
                    {menu.name}
                  </div>
                  {/* 소분류 리스트 */}
                  <ul className="space-y-1 pl-4 border-l border-slate-700 ml-2">
                    {menu.items.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <NavLink 
                          to={subItem.path}
                          className={({ isActive }) => 
                            `block px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive 
                                ? "bg-blue-600 text-white font-medium" 
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`
                          }
                        >
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
                    `flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <span className="mr-3">{menu.icon}</span>
                  {menu.name}
                </NavLink>
              )}
            </li>
          ))}

        </ul>
      </nav>
      
      {/* 3. 하단 로그아웃 */}
      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Sidebar;