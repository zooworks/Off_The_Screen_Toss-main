import { NavLink } from 'react-router-dom';

const menuItems = [
    { path: '/admin/statistics', label: '통계', icon: '📊', disabled: true },
    { path: '/admin/contents', label: '콘텐츠 등록', icon: '📁', disabled: false },
    { path: '/admin/locations', label: '콘텐츠 상세 페이지 등록', icon: '📄', disabled: false },
    { path: '/admin/notices', label: '공지사항 및 알림관리', icon: '📢', disabled: false },
    { path: '/admin/inquiries', label: '문의내역 관리', icon: '💬', disabled: false },
];

export default function AdminSidebar() {
    return (
        <aside className="w-[200px] min-h-screen bg-white border-r border-gray-100 flex flex-col">
            {/* Logo */}
            <div className="px-6 py-8">
                <h1 className="text-xl font-medium text-[#1e1e1e]">OFF THE</h1>
                <h2 className="text-2xl font-bold text-[#1e1e1e]">SCREEN</h2>
                <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.disabled ? '#' : item.path}
                        onClick={(e) => item.disabled && e.preventDefault()}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${isActive && !item.disabled
                                ? 'bg-[#5a3d8b] text-white'
                                : item.disabled
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <span>{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
