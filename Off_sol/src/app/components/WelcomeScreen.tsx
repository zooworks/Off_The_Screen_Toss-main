import {
    Asset,
    FixedBottomCTA,
    ListHeader,
    Spacing,
    StepperRow,
    Text,
    Top,
} from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import loginIcon from '@/assets/login_icon.svg';
import step1Icon from '@/assets/welcome_step1.svg';
import step2Icon from '@/assets/welcome_step2.svg';
import step3Icon from '@/assets/welcome_step3.svg';

interface WelcomeScreenProps {
    onStart?: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleNext = () => {
        if (onStart) {
            onStart();
        } else {
            navigate('/');
        }
    };

    return (
        <>
            <div className="w-full h-[110px]">
                <Top
                    title={
                        <Top.TitleParagraph size={22} color={adaptive.grey900}>
                            {t('welcome_title') || "오프더스크린을 통해 화면 밖 진짜 세상을\n만나보세요"}
                        </Top.TitleParagraph>
                    }
                />
            </div>

            <div className="flex justify-center">
                <Asset.Image
                    frameShape={{ width: 240, height: 240 }}
                    src={loginIcon}
                    aria-hidden={true}
                    style={{ objectFit: 'contain' }}
                />
            </div>

            <Spacing size={12} />

            <Spacing size={24} />

            <StepperRow
                className="w-full h-[60px]"
                left={<StepperRow.NumberIcon number={1} />}
                center={
                    <StepperRow.Texts
                        type="A"
                        title={t('welcome_step1') || "내가 좋아하는 콘텐츠를 찾아요."}
                        description=""
                    />
                }
            />
            <StepperRow
                className="w-full h-[60px]"
                left={<StepperRow.NumberIcon number={2} />}
                center={
                    <StepperRow.Texts
                        type="A"
                        title={t('welcome_step2') || "찜을 눌러 방문할 장소를 저장해요."}
                        description=""
                    />
                }
            />
            <StepperRow
                className="w-full h-[60px]"
                left={<StepperRow.NumberIcon number={3} />}
                center={
                    <StepperRow.Texts
                        type="A"
                        title={t('welcome_step3') || "장소에 방문해요."}
                        description=""
                    />
                }
                hideLine={true}
            />

            {/* @ts-ignore: framer-motion v12 type incompatibility with @toss/tds-mobile */}
            <FixedBottomCTA onClick={handleNext}>
                {t('next') || "다음"}
            </FixedBottomCTA>
        </>
    );
}
