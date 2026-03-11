import { useLanguage } from '@/contexts/LanguageContext';

import { Button } from '@toss/tds-mobile';

interface LoginQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}

export default function LoginQuestionModal({ isOpen, onClose, onLogin }: LoginQuestionModalProps) {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-[320px] rounded-[16px] p-6 flex flex-col items-center shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-[18px] font-bold text-[#191F28] mb-2 text-center whitespace-pre-wrap font-['Toss Product Sans']">
                    {t('login_required_title') || "로그인이 필요해요"}
                </h3>

                <div className="flex gap-3 w-full">
                    <Button
                        onClick={onClose}
                        color="light"
                        variant="fill"
                        className="flex-1 py-[14px] rounded-[24px] text-[15px] font-semibold"
                    >
                        {t('cancel') || "취소"}
                    </Button>
                    <Button
                        onClick={onLogin}
                        color="primary"
                        variant="fill"
                        className="flex-1 py-[14px] rounded-[24px] text-[15px] font-semibold"
                    >
                        {t('login') || "로그인"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
