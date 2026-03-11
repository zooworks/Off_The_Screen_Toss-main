import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, removeAdminToken } from '@/services/admin';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import ContentList from './pages/ContentList';
import ContentCreate from './pages/ContentCreate';
import ContentEdit from './pages/ContentEdit';
import NoticeList from './pages/NoticeList';
import NoticeCreate from './pages/NoticeCreate';
import NoticeEdit from './pages/NoticeEdit';
import InquiryList from './pages/InquiryList';
import LocationContentSelect from './pages/LocationContentSelect';
import LocationSelection from './pages/LocationSelection';
import LocationEditor from './pages/LocationEditor';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    if (!isAdminLoggedIn()) {
        return <Navigate to="/admin" replace />;
    }
    return <>{children}</>;
}

export default function AdminApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(isAdminLoggedIn());
    const navigate = useNavigate();

    // 401 에러 시 로그아웃 이벤트 감지
    useEffect(() => {
        const handleLogout = () => {
            setIsLoggedIn(false);
            navigate('/admin');
        };

        window.addEventListener('admin-logout', handleLogout);
        return () => window.removeEventListener('admin-logout', handleLogout);
    }, [navigate]);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        navigate('/admin/contents');
    };

    // 로그인 상태가 아니면 로그인 페이지 표시
    if (!isLoggedIn) {
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/admin/contents" replace />} />
            <Route
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/contents" element={<ContentList />} />
                <Route path="/contents/create" element={<ContentCreate />} />
                <Route path="/contents/:id/edit" element={<ContentEdit />} />
                {/* 공지사항 */}
                <Route path="/notices" element={<NoticeList />} />
                <Route path="/notices/create" element={<NoticeCreate />} />
                <Route path="/notices/:id/edit" element={<NoticeEdit />} />
                {/* Placeholder pages - UI only */}
                <Route path="/statistics" element={<div className="text-gray-400">통계 페이지 (준비중)</div>} />
                <Route path="/locations" element={<LocationContentSelect />} />
                <Route path="/locations/:contentId" element={<LocationSelection />} />
                <Route path="/locations/:contentId/create" element={<LocationEditor />} />
                <Route path="/locations/:contentId/:locationId" element={<LocationEditor />} />
                {/* 문의내역 */}
                <Route path="/inquiries" element={<InquiryList />} />
            </Route>
        </Routes>
    );
}


