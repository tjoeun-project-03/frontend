import React from 'react';

const Sidebar = () => {
  const menus = [
    { name: "대시보드"},
    { name: "회원 관리"},
    { name: "화물 관리"},
    { name: "정산 관리"},
  ];

  return (
    <div className="w-64 bg-slate-800 text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* 로고 영역 */}
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-slate-700">
        화물 관리자
      </div>

      {/* 메뉴 리스트 */}
      <ul className="flex-1 py-4">
        {menus.map((menu) => (
          <li key={menu.name} className="px-6 py-3 hover:bg-slate-700 cursor-pointer flex items-center gap-3">
            <span>{menu.icon}</span>
            <span>{menu.name}</span>
          </li>
        ))}
      </ul>

      {/* 하단 정보 */}
      <div className="p-4 text-xs text-slate-400 border-t border-slate-700">
        Version 1.0.0
      </div>
    </div>
  );
};

export default Sidebar;