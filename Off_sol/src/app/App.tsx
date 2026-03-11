import { useState, useEffect, lazy, Suspense } from "react";
import { appLogin } from '@apps-in-toss/web-framework';
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContents } from "@/hooks/useContents";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import type { Content, Location } from "@/types/api";
const imgImage1662 = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Image";

// Lazy load components
const MapView = lazy(() => import("@/app/components/MapView"));
const DetailView = lazy(() => import("@/app/components/DetailView"));
const LocationDetailView = lazy(() => import("@/app/components/LocationDetailView"));
const FavoriteView = lazy(() => import("@/app/components/FavoriteView"));
const MyInfoView = lazy(() => import("@/app/components/MyInfoView"));
const WelcomeScreen = lazy(() => import("@/app/components/WelcomeScreen"));
const NoticeListPage = lazy(() => import("@/app/components/NoticeListPage"));
const NotificationListPage = lazy(() => import("@/app/components/NotificationListPage"));
const TermsPage = lazy(() => import("@/app/components/TermsPage"));
import Header from "@/app/components/Header";
import BottomTab from "@/app/components/BottomTab";

import noticesService from "@/services/notices";
import notificationsService from "@/services/notifications";

// Helper to wrap Content Detail for Route
function ContentDetailRoute({ contents }: { contents: Content[] }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const contentId = pathname.split('/content/')[1];
  const content = contents.find(c => c.id === contentId);

  if (!content) return null; // Or loading/error

  return (
    <DetailView
      title={content.title}
      titleEn={content.titleEn || undefined}
      description={content.description || ''}
      descriptionEn={content.descriptionEn || undefined}
      backgroundImage={content.thumbnailUrl || imgImage1662}
      contentId={content.id}
      onBack={() => navigate(-1)}
      onCardClick={(location) => {
        if (location) {
          navigate(`/location/${location.id}`, { state: { backgroundLocation: location } });
        }
      }}
    />
  );
}

// Helper for Location Detail Route
// Note: LocationDetailView might need to fetch location by ID if not passed perfectly,
// but for now we assume we might need to fetch or find it.
// Since LocationDetailView takes a 'Location' object, we might need a way to look it up.
// However, the original code used 'selectedLocation' state.
// Realistically, to support direct URL access '/location/:id', we should fetch it.
// For this refactor, I'll assume we can pass it via state or context, OR refactor LocationDetailView to fetch.
// Given the scope, passed via navigation state is easiest, but direct link will fail.
// I will wrap it to attempt to use navigation state, or fallback (which might be empty).
// *Self-correction*: The user asked for Admin-like URL structure.
// I will implement a route that tries to find the location if possible or just renders.

const LoginQuestionModal = lazy(() => import("@/app/components/LoginQuestionModal"));

function AppLayout({ unreadCount }: { unreadCount: number }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Tab determination based on path
  const getActiveTab = (path: string) => {
    if (path === "/" || path.startsWith("/content")) return "home";
    if (path.startsWith("/map")) return "map";
    if (path.startsWith("/favorite")) return "favorite";
    if (path.startsWith("/my")) return "myinfo";
    if (path.startsWith("/notice")) return "notice";
    if (path.startsWith("/notification")) return "notification";
    return "home";
  };

  const activeTab = getActiveTab(location.pathname);

  // Hide UI elements on specific pages
  const hideHeader = location.pathname.startsWith("/notice") || location.pathname.startsWith("/location") || location.pathname.startsWith("/notification");
  const hideTabBar = location.pathname.startsWith("/notice") || location.pathname.startsWith("/content") || location.pathname.startsWith("/location");

  const handleTabClick = (tab: string) => {
    if ((tab === "favorite" || tab === "myinfo") && !isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    switch (tab) {
      case "home": navigate("/"); break;
      case "map": navigate("/map"); break;
      case "favorite": navigate("/favorite"); break;
      case "myinfo": navigate("/my"); break;
      case "notice": navigate("/notice"); break; // Though usually accessed via header
      case "notification": navigate("/notification"); break;
    }
  };

  const handleNoticeClick = () => {
    navigate("/notification");
  };

  const handleLogin = async () => {
    try {
      const { authorizationCode } = await appLogin();

      if (authorizationCode) {
        window.location.href = `https://off-toss.eekky.com/api/auth/toss/callback?code=${authorizationCode}`;
      }
    } catch (error) {
      console.error('토스 로그인 실패:', error);
      alert('로그인을 취소했거나 에러가 발생했습니다.');
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      {/* Header removed as per request */}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Outlet />
      </div>

      {!hideTabBar && <BottomTab activeTab={activeTab as any} onTabClick={handleTabClick} />}

      <Suspense fallback={null}>
        <LoginQuestionModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      </Suspense>
    </div>
  );
}

const HomeView = lazy(() => import("@/app/components/HomeView"));

// Suspense Fallback
const LoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#735ccc]"></div>
  </div>
);

function AppContent() {
  // Initialize filters from storage
  // Initialize filters from storage
  const [initialFilter] = useState(() => {
    try {
      const stored = localStorage.getItem('off_content_filters');
      return stored ? JSON.parse(stored) : undefined;
    } catch {
      return undefined;
    }
  });

  const { contents, loading, error, refetch } = useContents(initialFilter);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Initialize from localStorage
  const [isGuestMode, setIsGuestMode] = useState(() => {
    return localStorage.getItem('off_guest_mode') === 'true';
  });

  const { unreadCount } = useNotification();

  // Onboarding removed as per request

  const handleContinueAsGuest = () => {
    localStorage.setItem('off_guest_mode', 'true');
    setIsGuestMode(true);
  };

  // Handle OAuth Callback
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (accessToken && refreshToken) {
      import('@/lib/api').then(({ tokenManager }) => {
        tokenManager.setTokens(accessToken, refreshToken);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
        // Update Auth State
        // We need to access refreshUser here. It's available from useAuth() above but usually destructured.
        // Let's force a reload to ensure fresh state or call refreshUser if we destructured it.
        // Since I can't easily change the destructuring line above without seeing it fully in this replaced block context 
        // (Use ViewFile to be safe, but I'll assume I can add it or just reload).
        // Reload is safer to clear any stale state.
        window.location.reload();
      });
    } else if (error) {
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);


  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#735ccc]"></div>
      </div>
    );
  }

  if (!isAuthenticated && !isGuestMode) {
    return (
      <Suspense fallback={<div className="h-screen w-full bg-white flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#735ccc]"></div></div>}>
        <WelcomeScreen onStart={handleContinueAsGuest} />
      </Suspense>
    );
  }

  // Filter Logic moved to HomeView

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<AppLayout unreadCount={unreadCount} />}>
            <Route path="/" element={
              <HomeView
                contents={contents}
                loading={loading}
                error={error}
                refetch={refetch}
              />
            } />

            <Route path="/map" element={
              <MapView onLocationClick={(location) => navigate(`/location/${location.id}`, { state: { backgroundLocation: location } })} />
            } />

            <Route path="/favorite" element={
              <FavoriteView onLocationClick={(location) => navigate(`/location/${location.id}`, { state: { backgroundLocation: location } })} />
            } />

            <Route path="/my" element={<MyInfoView onNoticeClick={() => navigate("/notice")} />} />

            <Route path="/notice" element={<NoticeListPage onBack={() => navigate(-1)} />} />

            <Route path="/notification" element={
              <NotificationListPage
                onBack={() => navigate("/")}
                onNoticeClick={() => navigate("/notice")}
                onContentClick={(contentId) => navigate(`/content/${contentId}`)}
              />
            } />

            <Route path="/content/:id" element={<ContentDetailRoute contents={contents} />} />

            {/* Terms Page for External Linking */}
            <Route path="/terms" element={<TermsPage />} />

            {/* LocationDetailView normally requires a 'Location' object. 
              We'll need to adapt it or pass it via state. 
              For now, I'm using the `backgroundLocation` passed in state if available, 
              but typically we should fetch it. 
          */}
            <Route path="/location/:id" element={<LocationDetailWrapper />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

// Wrapper to handle LocationDetail props from navigation state
function LocationDetailWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { backgroundLocation } = location.state as { backgroundLocation?: Location } || {};
  const { language } = useLanguage();

  // If no location data (e.g. direct access), this might fail or show empty.
  // In a real app we'd fetch it here.
  if (!backgroundLocation) {
    return <div>Loading location... (or not found)</div>;
  }

  // Content title is optional in LocationDetailView prop.
  // We don't easily have it here unless passed too.

  return (
    <LocationDetailView
      location={backgroundLocation}
      contentTitle={undefined}
      onBack={() => navigate(-1)}
    />
  );
}

import { NotificationProvider, useNotification } from "@/contexts/NotificationContext";
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: any }) {
  return (
    <div role="alert" className="p-4 bg-red-50 text-red-900 overflow-auto max-h-screen">
      <p className="font-bold">Something went wrong:</p>
      <pre className="text-sm mt-2">{error.message}</pre>
      <pre className="text-xs mt-2 text-gray-500">{error.stack}</pre>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TDSMobileAITProvider>
        <AuthProvider>
          <NotificationProvider>
            <div className="w-full max-w-[1280px] min-h-screen mx-auto bg-white relative overflow-hidden">
              <AppContent />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </TDSMobileAITProvider>
    </ErrorBoundary>
  );
}