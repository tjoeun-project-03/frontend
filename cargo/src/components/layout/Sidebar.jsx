import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink는 현재 페이지 표시할 때 유용함

const Sidebar = () => {
  const menus = [
    {
      name: "운송 관제",
      items: [
        { name: "실시간 모니터링", path: "/" },
        { name: "할증/수수료 설정", path: "/" },
        { name: "배차 강제 취소", path: "/" },
      ]
    },
    {
      name: "회원 관리",
      items: [
        { name: "차주 가입 심사", path: "/" },
        { name: "사용자 제재", path: "/" },
      ]
    },
    {
      name: "재무/정산",
      items: [
        { name: "매출 통계", path: "/" },
        { name: "차주 정산 승인", path: "/" },
      ]
    },
    {
      name: "고객 지원",
      items: [
        { name: "신고 심사", path: "/" },
        { name: "1:1 문의 답변", path: "/"},
        { name: "공지사항 관리", path: "/" },
      ]
    }
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* 1. 로고 영역 */}
      <div className="p-6 text-center border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400" to={"/"}>화물 관리자</h1>
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
        <button className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Sidebar;