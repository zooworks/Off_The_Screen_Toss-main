import { useNavigate } from 'react-router-dom';

// Header Component
export default function Header() {
    const navigate = useNavigate();
    return (
        <div className="w-full bg-white px-[16px] py-[10px]">
            <div className="max-w-7xl mx-auto flex items-center justify-start">
                <button
                    onClick={() => navigate('/')}
                    className="text-[18px] font-bold text-[#333D48]"
                >
                    Off The Screen
                </button>
            </div>
        </div>
    );
}
