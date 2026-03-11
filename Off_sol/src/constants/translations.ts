export type Language = 'ko' | 'en';

export const translations = {
    ko: {
        // Navigation
        nav_home: '홈',
        nav_map: '지도',
        nav_saved: '관심',
        nav_my: '내 정보',

        // Home
        home_banner_title: '어디를 가볼까요?',
        home_banner_desc: '미디어에서 봤던 많은 장소를 방문해보세요!',

        // Common
        confirm: '확인',
        cancel: '취소',
        loading: '로딩 중...',
        error: '오류가 발생했습니다.',

        // Filter
        filter_title: '필터',
        filter_reset: '초기화',
        filter_apply: '적용하기',

        // Auth
        login_required: '로그인이 필요합니다.',
        login_button: '로그인',
        login: '로그인',
        logout: '로그아웃',

        // Login Flow
        login_required_title: '로그인이 필요해요',
        login_required_desc: '이 기능을 사용하려면\n로그인이 필요합니다.',
        welcome_title: '오프더스크린을 통해 화면 밖\n진짜 세상을 만나보세요',
        welcome_step1: '내가 좋아하는 콘텐츠를 찾아요.',
        welcome_step2: '찜을 눌러 방문할 장소를 저장해요.',
        welcome_step3: '장소에 방문해요.',
        next: '다음',
        agree_and_continue: '동의하고 계속하기',

        // My Info
        my_profile: '내 프로필',
        language_setting: '언어 설정',
        language_ko: '한국어',
        language_en: 'English',
        menu_notification: '알림',
        menu_login_info: '로그인 정보',
        guest_mode_label: '게스트 모드',
        menu_notice: '공지사항',
        menu_qna: '문의하기',
        delete_account: '회원 탈퇴',
        delete_account_confirm: '정말로 탈퇴하시겠습니까?',
        notice_empty: '등록된 공지사항이 없습니다.',

        // Search
        search_placeholder: '컨텐츠를 검색해보세요',
        no_content_available: '콘텐츠가 없습니다',

        // Customer Service
        customer_service: '고객센터',
        contact_us: '문의하기',
        my_inquiries: '내 문의 내역',
        guest_login_desc: '로그인하면 더 많은 기능을 이용할 수 있습니다',
        inquiry_success: '문의가 등록되었습니다.',
        logout_confirm_title: '로그아웃',
        logout_confirm_desc: '로그아웃 하시겠습니까?',
        logout_action: '로그아웃',
        cancel_action: '취소하기',

        // Inquiry Form
        inquiry_title_label: '문의 제목',
        inquiry_title_placeholder: '제목을 입력해주세요.',
        inquiry_content_label: '문의 내용',
        inquiry_content_placeholder: '문의 내용을 작성해주세요.',
        inquiry_image_label: '사진 첨부',
        inquiry_image_helper: '5MB 이하의 jpg, gif 파일 5개까지 업로드 가능합니다.',
        inquiry_submitting: '등록 중...',
        inquiry_submit_button: '문의하기',
        inquiry_error_required: '제목과 내용을 모두 입력해주세요.',

        inquiry_error_failed: '문의 등록에 실패했습니다. 다시 시도해주세요.',
        inquiry_confirm_desc: '문의를 전송할까요?',

        // Image Uploader
        image_button: '사진첨부',
        inquiry_image_limit_error: '이미지는 최대 5장까지 첨부할 수 있습니다.',
        inquiry_image_upload_failed: '이미지 업로드에 실패했습니다.',
        uploading: '이미지 업로드 중...',

        // Localization for Search Placeholder (Requested specifically)
        search_interest_area: '어디를 가볼까요?',

        // My Inquiry List
        inquiry_empty: '등록된 문의가 없습니다.',
        inquiry_status_pending: '접수완료',
        inquiry_status_progress: '진행중',
        inquiry_status_completed: '답변완료',
        inquiry_delete: '삭제하기',
        inquiry_delete_confirm_desc: '문의를 삭제하시겠습니까?',
        inquiry_admin_reply: '운영자 답변',
        inquiry_reply_pending: '답변이 준비중입니다.',

        // Terms
        terms_and_policies: '약관 및 정책',
        terms_of_service: '이용약관',
        privacy_policy: '개인정보 처리방침',
        close: '닫기',
        terms_service_content: '오프더스크린 서비스 이용약관\n\n제1장 총칙\n\n제1조 (목적)\n이 「오프더스크린 서비스 이용약관」(이하 "이 약관")은 오프더스크린(이하 "회사"라 합니다)이 애플리케이션(이하 "앱")을 통하여 회원에게 제공하는 오프더스크린 서비스와 관련하여 회사와 회원의 권리ㆍ의무 및 책임사항, 서비스 이용에 따른 이용조건 및 절차 등 기타 필요한 사항을 규정함을 목적으로 합니다.\n\n제2조 (용어의 정의)\n① 이 약관에서 사용하는 용어의 정의는 다음과 같습니다.\n1. "서비스"란 회사가 앱을 통하여 회원에게 제공하는 서비스(촬영지 정보, 콘텐츠 정보, 지도 서비스 등)를 의미합니다.\n2. "회원"이란 이 약관에 따라 이용계약을 체결하고 회원으로 가입한 자로서, 회사가 제공하는 서비스를 이용하는 자를 의미합니다.\n② 이 약관에서 사용하는 용어의 정의는 제1항에서 정하는 것을 제외하고는 관계법령, 운영정책 및 상관례에 따릅니다.\n\n제3조 (약관의 효력 및 변경)\n① 회사는 이 약관의 내용을 회원이 알 수 있도록 앱 내 설정 화면 또는 그 연결화면에 게시하거나 기타의 방법으로 회원에게 공지합니다.\n② 회사가 이 약관을 개정할 경우에는 적용일자 및 개정내용, 개정 사유 등을 명시하여 최소한 그 적용일 7일 이전부터 회원에게 공지합니다. 다만, 변경된 내용이 회원에게 불리하거나 중대한 사항의 변경인 경우에는 그 시행일 30일 이상의 사전 유예기간을 두고 제8조의 방법으로 회원에게 공지 또는 통지합니다.\n③ 회원은 이 약관의 변경과 관련하여 이의가 있는 경우 회원 탈퇴를 할 수 있습니다. 단, 회원이 제2항의 공지 또는 통지일로부터 개정 약관의 시행 직전 일까지 이의를 제기하거나 회원 탈퇴를 하지 않은 경우 개정 약관에 동의한 것으로 봅니다.\n\n제2장 회원가입 및 탈퇴 등\n\n제5조 (회원가입)\n① 회원이 되고자 하는 자는 본 약관과 개인정보 처리방침에 동의하고, 회사가 정한 가입 절차(소셜 로그인 등)를 완료함으로써 회원가입을 신청합니다.\n② 회사는 관련 법령 위반, 부정한 용도 사용 등 명백한 가입 거절 사유가 있는 경우 회원가입을 승낙하지 않을 수 있습니다.\n\n제6조 (회원정보의 변경)\n① 회원은 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다.\n② 회원은 정보가 변경되었을 경우 이를 회사에 알려야 하며, 변경하지 않아 발생한 불이익에 대하여 회사는 책임지지 않습니다.\n\n제10조 (회원탈퇴)\n① 회원은 언제든지 앱 내 기능을 통하여 회원 탈퇴를 요청할 수 있습니다.\n② 회원 탈퇴 시 회원의 개인정보는 개인정보 처리방침 및 관련 법령에 따라 파기되거나 보관됩니다.\n\n제3장 서비스 이용\n\n제15조 (서비스의 제공)\n회사는 회원에게 다음과 같은 서비스를 제공합니다.\n1. 영화/드라마 촬영지 정보 제공 서비스\n2. 지도 기반 위치 확인 및 탐색 서비스\n3. 콘텐츠 즐겨찾기 및 리뷰 서비스\n4. 기타 회사가 정하는 서비스\n\n제19조 (서비스의 이용시간)\n서비스 이용은 회사의 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간을 원칙으로 합니다. 다만, 정기 점검 등 필요에 따라 회사가 정한 날이나 시간은 제외됩니다.\n\n제4장 기타\n\n제23조 (지식재산권의 귀속)\n① 회사가 제공하는 서비스 및 관련 저작물에 대한 지식재산권은 회사에 귀속됩니다.\n② 회원은 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.\n\n제26조 (관할법원)\n서비스 이용과 관련하여 회사와 회원 간에 발생한 분쟁에 대해서는 대한민국 법률을 적용하며, 민사소송법에 따른 관할 법원에서 해결합니다.\n\n부칙\n이 약관은 2026년 2월 1일부터 시행합니다.',
        terms_privacy_content: '1. 개인정보 수집 항목\n회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.\n\n(본 내용은 예시이며 실제 개인정보 처리방침 내용으로 대체되어야 합니다.)',

        // Location Detail
        location_detail_title: '상세 정보',
        views: '조회수',
        about_location: '장소 소개',
        owner: '셰프의 한마디',
        // on_the_screen: 'On the screen',
        visitor_information: '방문 정보',
        opening_hours: '영업 시간',
        price: '가격',
        accessibility: '접근성/편의',
        parking: '주차',
        location_header: '위치',
        get_direction: '길찾기',
        address_not_available: '주소 정보가 없습니다.',
        copy_address_success: '주소가 복사되었습니다.',
        no_description: '설명이 없습니다.',
        no_owner_desc: '사장님 한마디가 없습니다.',
        no_scene_desc: '장면 설명이 없습니다.',
        free: '무료',
        enabled: '좋음',
        disabled: '나쁨',
        no_info: '정보 없음',
        always_open: '24시간',
    },
    en: {
        // Navigation
        nav_home: 'Home',
        nav_map: 'Map',
        nav_saved: 'Favorite',
        nav_my: 'My',

        // Home
        home_banner_title: 'Place to Visit',
        home_banner_desc: 'Lots of place where in a media!',

        // Common
        confirm: 'Confirm',
        cancel: 'Cancel',
        loading: 'Loading...',
        error: 'An error occurred.',

        // Filter
        filter_title: 'Filter',
        filter_reset: 'Reset',
        filter_apply: 'Apply',

        // Auth
        login_required: 'Login required.',
        login_button: 'Login',
        login: 'Login',
        logout: 'Logout',

        // Login Flow
        login_required_title: 'Login Required',
        login_required_desc: 'You need to login\nto use this feature.',
        welcome_title: 'Discover the real world\noutside the screen',
        welcome_step1: 'Find your favorite content.',
        welcome_step2: 'Save locations to visit.',
        welcome_step3: 'Visit the saved places.',
        next: 'Next',
        agree_and_continue: 'Agree and Continue',

        // My Info
        my_profile: 'My Profile',
        language_setting: 'Language',
        language_ko: 'Korean',
        language_en: 'English',
        menu_notification: 'Notification',
        menu_login_info: 'Login Info',
        guest_mode_label: 'Guest Mode',
        menu_notice: 'Notice',
        menu_qna: 'Q&A',
        delete_account: 'Delete My Account',
        delete_account_confirm: 'Are you sure you want to delete your account?',
        notice_empty: 'No notices found.',

        // Search
        search_placeholder: 'What content are you looking for?',
        no_content_available: 'No content available',

        // Customer Service
        customer_service: 'Customer Service',
        contact_us: 'Contact Us',
        my_inquiries: 'My Inquiries',
        guest_login_desc: 'Login to access more features',
        inquiry_success: 'Inquiry submitted successfully.',
        logout_confirm_title: 'Log Out',
        logout_confirm_desc: 'Are you sure you want to log out?',
        logout_action: 'Log Out',
        cancel_action: 'Cancel',

        // Inquiry Form
        inquiry_title_label: 'Inquiry Title',
        inquiry_title_placeholder: 'Please enter a title.',
        inquiry_content_label: 'Inquiry Content',
        inquiry_content_placeholder: 'Please enter your inquiry.',
        inquiry_image_label: 'Attach Images',
        inquiry_image_helper: 'Up to 5 files (jpg, gif) under 5MB.',
        inquiry_submitting: 'Submitting...',
        inquiry_submit_button: 'Submit Inquiry',
        inquiry_error_required: 'Please enter both title and content.',

        inquiry_error_failed: 'Failed to submit inquiry. Please try again.',
        inquiry_confirm_desc: 'Do you want to submit this inquiry?',

        // Image Uploader
        image_button: 'image_button',
        inquiry_image_limit_error: 'You can upload up to 5 images.',
        inquiry_image_upload_failed: 'Image upload failed.',
        uploading: 'Uploading...',

        // Localization for Search Placeholder
        search_interest_area: 'Where do you want to go?',

        // My Inquiry List
        inquiry_empty: 'No inquiries found.',
        inquiry_status_pending: 'Pending',
        inquiry_status_progress: 'In Progress',
        inquiry_status_completed: 'Answered',
        inquiry_delete: 'Delete',
        inquiry_delete_confirm_desc: 'Do you want to delete this inquiry?',
        inquiry_admin_reply: 'Admin Reply',
        inquiry_reply_pending: 'No reply yet.',

        // Terms
        terms_and_policies: 'Terms & Policies',
        terms_of_service: 'Terms of Service',
        privacy_policy: 'Privacy Policy',
        close: 'Close',
        terms_service_content: 'Article 1 (Purpose)\nThese terms and conditions generally apply to the service provided by Off The Screen.\n\n(This is placeholder text.)',
        terms_privacy_content: '1. Information Collection\nWe collect information to provide better services to our users.\n\n(This is placeholder text.)',

        // Location Detail
        location_detail_title: 'Location Detail',
        views: 'Views',
        about_location: 'About This Location',
        owner: 'Owner',
        // on_the_screen: 'On the screen', // User requested to exclude this
        visitor_information: 'Visitor information',
        opening_hours: 'Opening hours',
        price: 'Price',
        accessibility: 'Accessibility',
        parking: 'Parking',
        location_header: 'Location',
        get_direction: 'Get direction',
        address_not_available: 'Address not available',
        copy_address_success: 'Address copied.',
        no_description: 'No description available.',
        no_owner_desc: 'No owner description available.',
        no_scene_desc: 'No scene description available.',
        free: 'Free',
        enabled: 'Good',
        disabled: 'Bad',
        no_info: 'No info',
        always_open: '24 Hours',
    },
};
