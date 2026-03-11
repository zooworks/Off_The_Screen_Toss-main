import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import authService from "@/services/auth";
import loginLogo from "@/assets/LoginLogo.svg";

interface LoginScreenProps {
    onContinueAsGuest: () => void;
}

export default function LoginScreen({ onContinueAsGuest }: LoginScreenProps) {
    const { refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [agreed, setAgreed] = useState(false);

    const handleTossLogin = async () => {
        try {
            setLoading(true);
            setLoginError(null);

            // @ts-ignore
            if (typeof Toss === 'undefined') {
                console.warn('Toss SDK not loaded. Are you in Toss App?');
                // alert('Toss 앱 내에서만 실행 가능합니다.');
            }

            // @ts-ignore
            Toss.login().then(async (result: any) => {
                console.log('Toss Login Success:', result);
                if (result.code) {
                    const loginResult = await authService.socialLogin('toss', undefined, result.code, result.referrer);
                    console.log("Backend login result (Toss):", loginResult);
                    await refreshUser();
                }
            }).catch((error: any) => {
                console.error('Toss Login Failed:', error);
                setLoginError('Toss 로그인 실패. 잠시 후 다시 시도해주세요.');
                setLoading(false);
            });

        } catch (e) {
            console.error("Toss logic error:", e);
            setLoginError('로그인 중 오류가 발생했습니다.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            {/* Logo Section */}
            <div className="text-center mb-12">
                <img src={loginLogo} alt="OFF THE SCREEN" className="w-[200px] h-auto object-contain mx-auto" />
                <p className="mt-4 text-gray-600 font-['Toss Product Sans',sans-serif] text-sm">
                    Discover hidden gems from your favorite shows.<br />
                    Experience the screen in real life.
                </p>
            </div>

            {/* Login Buttons */}
            <div className="w-full max-w-[360px] space-y-3">
                {/* Terms Agreement Checkbox */}
                <div className="flex items-start gap-2 mb-4 px-1">
                    <div className="pt-0.5">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-[#0064FF] focus:ring-[#0064FF]"
                        />
                    </div>
                    <label htmlFor="terms" className="text-xs text-gray-500 font-['Toss Product Sans',sans-serif]">
                        I agree to the <Link to="/terms" state={{ from: 'intro' }} className="underline text-gray-700 hover:text-black">Terms of Service</Link> and <Link to="/terms" state={{ from: 'intro' }} onClick={() => localStorage.setItem('terms_tab', 'privacy')} className="underline text-gray-700 hover:text-black">Privacy Policy</Link>.
                    </label>
                </div>

                {/* Toss Login */}
                <button
                    onClick={handleTossLogin}
                    disabled={loading || !agreed}
                    className="w-full h-[56px] bg-[#0064FF] rounded-lg flex items-center justify-center gap-3 hover:bg-[#0052cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-6 h-6 shrink-0">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="white" />
                    </svg>
                    <span className="font-['Toss Product Sans',sans-serif] text-[16px] text-white font-medium">
                        Sign Up with Toss
                    </span>
                </button>
            </div>

            {/* Error Message */}
            {loginError && (
                <p className="mt-4 text-red-500 text-sm text-center font-['Toss Product Sans',sans-serif]">{loginError}</p>
            )}

            {/* Continue as Guest */}
            <button
                onClick={onContinueAsGuest}
                className="mt-8 font-['Toss Product Sans',sans-serif] text-[14px] text-gray-400 underline hover:text-gray-600 transition-colors"
            >
                Continue as a guest
            </button>

            {/* Terms of Service Link (Intro Mode) */}
            <div className="mt-8 flex gap-4 text-xs text-gray-400">
                <Link to="/terms" state={{ from: 'intro' }} className="underline hover:text-gray-600">
                    Terms of Service
                </Link>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#735ccc]"></div>
                        <span className="font-['Toss Product Sans',sans-serif] text-gray-700">로그인 중...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
