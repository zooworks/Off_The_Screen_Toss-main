import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import svgPaths from "@/imports/svg-k4gtm0rx14";

import TermsModal from './TermsModal';

// ... (Toggle, GoogleLogo, LogoutModal components unchanged)


function GoogleLogo() {
  // ... existing GoogleLogo code ...
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Google Logo">
      <div className="absolute inset-[4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.5142 24">
          <g id="Group">
            <path d={svgPaths.p20e98500} fill="var(--fill-0, #EA4335)" id="Vector" />
            <path d={svgPaths.p301e0a00} fill="var(--fill-0, #4285F4)" id="Vector_2" />
            <path d={svgPaths.pfb24480} fill="var(--fill-0, #34A853)" id="Vector_3" />
            <path d={svgPaths.p26a1e5f0} fill="var(--fill-0, #FBBC04)" id="Vector_4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// ... LogoutModal ...

function LogoutModal({ isOpen, onClose, onConfirm, t }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; t: (key: any) => string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop - blocks interactions */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[20px] w-full max-w-[300px] p-[24px] flex flex-col items-center z-50 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="font-['Pretendard'] font-bold text-[18px] text-[#000000] mb-[8px]">
          {t('logout_confirm_title')}
        </h3>
        <p className="font-['Pretendard'] text-[15px] text-[#3C3C43]/60 mb-[24px]">
          {t('logout_confirm_desc')}
        </p>

        <div className="flex gap-[10px] w-full">
          <button
            onClick={onClose}
            className="flex-1 h-[46px] rounded-[12px] bg-[#F5F5F5] text-[#000000] font-['Pretendard'] font-semibold text-[15px] active:bg-gray-200 transition-colors"
          >
            {t('cancel_action')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-[46px] rounded-[12px] bg-[#5A3D8B] text-white font-['Pretendard'] font-semibold text-[15px] active:bg-[#4a3275] transition-colors"
          >
            {t('logout_action')}
          </button>
        </div>
      </div>
    </div>
  );
}

interface MyInfoViewProps {
  onNoticeClick?: () => void;
}

export default function MyInfoView({ onNoticeClick }: MyInfoViewProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { t } = useLanguage();



  const handleLogout = () => {
    localStorage.removeItem('off_guest_mode');
    localStorage.removeItem('off_access_token');
    localStorage.removeItem('off_refresh_token');
    localStorage.removeItem('off_read_notices');
    window.location.reload();
  };

  const handleDeleteAccount = () => {
    if (confirm(t('delete_account_confirm'))) {
      handleLogout();
    }
  }



  // Common list item container
  const ListItem = ({ children, onClick, isLast = false }: { children: React.ReactNode, onClick?: () => void, isLast?: boolean }) => (
    <div className="relative">
      <div
        onClick={onClick}
        className={`flex items-center justify-between bg-white px-[16px] py-[16px] min-h-[56px] ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}`}
      >
        {children}
      </div>
      {!isLast && (
        <div className="absolute bottom-0 left-[20px] right-[20px] h-[1px] bg-[#E5E5EA]"></div>
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-[#F2F2F7]">


      <div className="p-[16px]">
        {/* Main Menu List */}
        <div className="bg-white rounded-[14px] overflow-hidden">
          {/* Notification */}

          {/* Login Info */}
          <ListItem>
            <span className="font-['Toss Product Sans:Medium',sans-serif] text-[16px] text-[#3b3b3b]">{t('menu_login_info')}</span>
            <div className="flex items-center gap-[8px]">
              {user?.provider === 'google' && <GoogleLogo />}
              <span className="font-['Toss Product Sans:Regular',sans-serif] text-[14px] text-[#3C3C43]">
                {user?.email || t('guest_mode_label')}
              </span>
            </div>
          </ListItem>



          {/* Notice */}
          <ListItem onClick={onNoticeClick}>
            <span className="font-['Toss Product Sans:Medium',sans-serif] text-[16px] text-[#3b3b3b]">{t('menu_notice')}</span>
          </ListItem>



          {/* Terms of Service */}
          <ListItem onClick={() => setIsTermsModalOpen(true)}>
            <span className="font-['Toss Product Sans:Medium',sans-serif] text-[16px] text-[#3b3b3b]">{t('terms_of_service')}</span>
          </ListItem>

          {/* Log Out */}
          <ListItem onClick={() => setIsLogoutConfirmOpen(true)} isLast={true}>
            <span className="font-['Toss Product Sans:Medium',sans-serif] text-[16px] text-[#3b3b3b]">{t('logout')}</span>
          </ListItem>
        </div>

        {/* Delete Account Link */}
        <div className="mt-[24px] flex justify-center">
          <button
            onClick={handleDeleteAccount}
            className="font-['Toss Product Sans:Regular',sans-serif] text-[14px] text-[#8E8E93] underline decoration-[#8E8E93] decoration-1 underline-offset-2"
          >
            {t('delete_account')}
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-[32px] flex flex-col items-center gap-[4px]">
          <p className="font-['Toss Product Sans:Regular',sans-serif] text-[14px] text-[#8E8E93]">
            Off The Screen v 1.0
          </p>
          <p className="font-['Toss Product Sans:Regular',sans-serif] text-[14px] text-[#8E8E93]">
            2026 Off The Screen, All right reserved
          </p>
        </div>
      </div>


      <LogoutModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        t={t}
      />
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
}