import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import adminService, { CreateLocationRequest } from '@/services/admin';
import ImageUploader from '../components/ImageUploader';
import LocationDetailView from '@/app/components/LocationDetailView'; // Import regular view for preview

export default function LocationEditor() {
    const { contentId, locationId } = useParams();
    const navigate = useNavigate();
    const locationState = useLocation().state as { contentTitle?: string };

    const isEditMode = !!locationId;
    const [isLoading, setIsLoading] = useState(false);
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [contentTitle, setContentTitle] = useState(locationState?.contentTitle || '');
    const [displayLang, setDisplayLang] = useState<'kr' | 'en'>('kr'); // Language toggle
    const [showPreview, setShowPreview] = useState(false); // Preview panel toggle
    const [formData, setFormData] = useState<CreateLocationRequest>({
        contentId: contentId || '',
        name: '',
        nameEn: '',
        description: '',
        descriptionEn: '',
        address: '',
        addressEn: '',
        displayAddress: '',
        displayAddressEn: '',
        latitude: 37.5665, // Default Seoul
        longitude: 126.9780,
        thumbnailUrl: '',
        chefImageUrl: '',
        offTheScreenImageUrl: '',

        ownerDescription: '',
        ownerDescriptionEn: '',
        onScreen: '',
        onScreenEn: '',

        isChef: false,
        isOffTheScreen: false,
        hasVisitorInfo: false,

        openingHours: '',
        price: '',
        accessibility: '',
        accessibilityEn: '',
        parking: '',
        parkingEn: '',
        isActive: true,
    });

    const tempSaveKey = `temp_location_${contentId}_${locationId || 'new'}`;

    const formDataRef = useRef(formData);

    // Sync ref with state for auto-save
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    // Auto-save every 1 minute
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (formDataRef.current) {
                // Determine searchName for check
                const name = displayLang === 'kr' ? formDataRef.current.name : formDataRef.current.nameEn;
                // Only auto-save if there is at least a name or address (some content)
                if (name || formDataRef.current.address) {
                    try {
                        localStorage.setItem(tempSaveKey, JSON.stringify(formDataRef.current));
                        console.log('Auto-saved to', tempSaveKey);
                    } catch (e) {
                        console.error('Auto-save failed', e);
                    }
                }
            }
        }, 60000); // 1 minute

        return () => clearInterval(intervalId);
    }, [tempSaveKey, displayLang]);

    const handleTempSave = () => {
        try {
            localStorage.setItem(tempSaveKey, JSON.stringify(formData));
            alert('임시 저장되었습니다.');
        } catch (e) {
            console.error('Failed to save to localStorage', e);
            alert('임시 저장에 실패했습니다. (용량 초과 등)');
        }
    };

    useEffect(() => {
        const init = async () => {
            if (contentId && !contentTitle) {
                try {
                    const content = await adminService.getContentById(contentId);
                    setContentTitle(content.title);
                } catch (e) {
                    console.error('Failed to fetch content info', e);
                }
            }

            if (isEditMode && locationId) {
                try {
                    setIsLoading(true);
                    const location = await adminService.getLocationById(locationId);
                    setFormData({
                        contentId: location.contentId,
                        name: location.name,
                        nameEn: location.nameEn || '',
                        description: location.description || '',
                        descriptionEn: location.descriptionEn || '',
                        address: location.address,
                        addressEn: location.addressEn || '',
                        displayAddress: location.displayAddress || '',
                        displayAddressEn: location.displayAddressEn || '',
                        latitude: location.latitude,
                        longitude: location.longitude,
                        thumbnailUrl: location.thumbnailUrl || '',
                        chefImageUrl: location.chefImageUrl || '',
                        offTheScreenImageUrl: location.offTheScreenImageUrl || '',

                        ownerDescription: location.ownerDescription || '',
                        ownerDescriptionEn: location.ownerDescriptionEn || '',
                        onScreen: location.onScreen || '',
                        onScreenEn: location.onScreenEn || '',

                        isChef: location.isChef || false,
                        isOffTheScreen: location.isOffTheScreen || false,
                        hasVisitorInfo: location.hasVisitorInfo || false,

                        openingHours: location.openingHours || '',
                        price: location.price || '',
                        accessibility: location.accessibility || '',
                        accessibilityEn: location.accessibilityEn || '',
                        parking: location.parking || '',
                        parkingEn: location.parkingEn || '',
                        isActive: location.isActive ?? true,
                    });
                } catch (error) {
                    console.error('Failed to fetch location:', error);
                    alert('촬영지 정보를 불러오는데 실패했습니다.');
                } finally {
                    setIsLoading(false);
                }
            } else if (contentId) {
                setFormData(prev => ({ ...prev, contentId }));
            }

            // Check for temporary save
            const savedData = localStorage.getItem(tempSaveKey);
            if (savedData) {
                if (window.confirm('임시 저장된 내용이 있습니다. 불러오시겠습니까?')) {
                    try {
                        const parsed = JSON.parse(savedData);
                        setFormData(parsed);
                        // Delete from localStorage after loading as requested
                        localStorage.removeItem(tempSaveKey);
                    } catch (e) {
                        console.error('Failed to parse saved data', e);
                    }
                }
            }
        };

        init();
    }, [contentId, locationId, isEditMode]);

    const handleChange = (field: keyof CreateLocationRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // AI 검색 핸들러 (Refine 모드 지원)
    // targetFields가 있으면 해당 필드만 업데이트 (없으면 전체 업데이트)
    const handleAiSearch = async (userHints?: Record<string, string>, targetFields?: (keyof CreateLocationRequest)[]) => {
        const searchName = displayLang === 'kr' ? formData.name : formData.nameEn;
        // Refine 모드(targetFields 존재)일 때 검색어가 없으면, 주소를 검색어로 사용할 수도 있음.
        // 하지만 기본적으로 장소명은 필수.
        if (!searchName && !formData.address) {
            alert('장소명 또는 주소를 입력해주세요.');
            return;
        }

        setIsAiSearching(true);
        try {
            // 1. Google Places API로 정확한 위치/주소 검색
            // Refine 모드이고, 'address'가 타겟이 아니라면(즉 주소 고정), 굳이 이름으로 다시 검색해서 주소를 덮어쓸 필요? 
            // 하지만 좌표(latitude, longitude)는 업데이트해야 할 수 있음.
            // 사용자가 "여기에 적힌 걸 기반으로 찾아"라고 했으므로, Refine 시에는 'formData.address'를 힌트로 강하게 사용해야 함.

            let googlePlaceResult: { address: string; lat: number; lng: number; name: string } | null = null;
            const query = (targetFields && formData.address) ? formData.address : (searchName || formData.address || '');

            if (window.google && window.google.maps && window.google.maps.places) {
                const mapDiv = document.createElement('div');
                const service = new window.google.maps.places.PlacesService(mapDiv);

                const findPlace = () => new Promise<any>((resolve, reject) => {
                    const request = {
                        query: query,
                        fields: ['name', 'geometry', 'formatted_address', 'place_id'] // Added place_id
                    };
                    service.findPlaceFromQuery(request, (results, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                            resolve(results[0]);
                        } else {
                            resolve(null);
                        }
                    });
                });

                const place = await findPlace();
                if (place) {
                    // 1-1. Fetch English Address using Geocoding API
                    let englishAddress = '';
                    if (place.place_id) {
                        try {
                            const geocodeRes = await fetch(
                                `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place.place_id}&language=en&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`
                            );
                            const geocodeData = await geocodeRes.json();
                            if (geocodeData.status === 'OK' && geocodeData.results?.[0]) {
                                englishAddress = geocodeData.results[0].formatted_address;
                                console.log('Fetched English Address:', englishAddress);
                            }
                        } catch (err) {
                            console.error('Failed to fetch English address:', err);
                        }
                    }

                    googlePlaceResult = {
                        address: place.formatted_address || '',
                        lat: place.geometry?.location?.lat() || 37.5665,
                        lng: place.geometry?.location?.lng() || 126.9780,
                        name: place.name || searchName
                    };

                    // 즉시 업데이트 (Refine 모드여도 좌표는 업데이트 해야 함)
                    setFormData(prev => {
                        const newData = { ...prev };
                        const fieldsToUpdate: (keyof CreateLocationRequest)[] = targetFields || ['address', 'addressEn', 'latitude', 'longitude'];

                        // address는 targetFields에 포함되어 있을 때만 업데이트
                        // [USER REQUEST]: 한글로 타이핑한 주소는 바꾸지 말라 (Don't overwrite Korean address)
                        // This logic is flawed if we want to preserve USER input.
                        // if (!targetFields || targetFields.includes('address')) {
                        //     if (googlePlaceResult?.address) newData.address = googlePlaceResult.address;
                        // }

                        // New: Initialize displayAddress if it was empty, using the found address as a starting point? 
                        // User said: "Output is output, map is map". 
                        // Maybe we shouldn't touch displayAddress automatically on finding map location if user wants full control.
                        // But for new entries, it's helpful.
                        // Let's leave it manual for now or rely on the aiEnrich logic below which might fill it.

                        // Always update addressEn if found
                        // [USER REQUEST]: 영문 주소도 직접 입력하겠다고 함 (Don't overwrite English address automatically)
                        // Gemini/Google results can be inaccurate, so user wants full control over text.
                        // if (englishAddress && (!targetFields || targetFields.includes('addressEn'))) {
                        //     newData.addressEn = englishAddress;
                        // }

                        if (fieldsToUpdate.includes('latitude') && googlePlaceResult?.lat) newData.latitude = googlePlaceResult.lat;
                        if (fieldsToUpdate.includes('longitude') && googlePlaceResult?.lng) newData.longitude = googlePlaceResult.lng;

                        return newData;
                    });
                }
            }

            // 2. AI Enrich call (Metadata)
            const combinedHints = {
                ...userHints,
                ...(googlePlaceResult ? {
                    officialAddress: googlePlaceResult.address,
                    officialCoordinates: `${googlePlaceResult.lat},${googlePlaceResult.lng}`
                } : {}),
                // Refine 모드일 때 현재 입력된 주소도 힌트로 제공
                ...(targetFields && formData.address ? { currentAddressInput: formData.address } : {})
            };

            // 검색어는 Refine 모드면 주소, 아니면 이름 (이름 없으면 주소)
            const finalSearchTerm = (targetFields && formData.address) ? formData.address : (searchName || formData.address || '');

            const result = await adminService.aiEnrich(finalSearchTerm, contentTitle, combinedHints);

            // AI 결과로 폼 업데이트 (TargetFields 필터링)
            setFormData(prev => {
                const newData = { ...prev };

                const formatAvailability = (value: any): string | undefined => {
                    if (value === true || String(value).toLowerCase() === 'true') return 'Available';
                    if (value === false || String(value).toLowerCase() === 'false') return 'Not available';
                    return value;
                };

                // 업데이트할 소스 데이터 매핑
                const updateSource: Partial<CreateLocationRequest> = {
                    name: result.name,
                    nameEn: result.nameEn,
                    description: result.description,
                    descriptionEn: result.descriptionEn,
                    address: googlePlaceResult?.address || result.address, // [Updated]: Auto-fill Map Address for accurate pin/preview
                    addressEn: result.addressEn, // [Updated]: Auto-fill English Map Address
                    // displayAddress: result.displayAddress || (googlePlaceResult?.address || result.address), // [USER REQUEST]: Keep Display Address manual
                    // displayAddressEn: result.displayAddressEn || result.addressEn, // [USER REQUEST]: Keep English Display Address manual
                    latitude: googlePlaceResult?.lat || result.latitude,
                    longitude: googlePlaceResult?.lng || result.longitude,
                    ownerDescription: result.ownerDescription,
                    ownerDescriptionEn: result.ownerDescriptionEn,
                    onScreen: result.onScreen,
                    onScreenEn: result.onScreenEn,
                    openingHours: result.openingHours,
                    price: result.price,
                    accessibility: result.accessibility,
                    accessibilityEn: result.accessibilityEn,
                    parking: formatAvailability(result.parking),
                    parkingEn: formatAvailability(result.parkingEn),
                    isChef: result.isChef,
                    isOffTheScreen: result.isOffTheScreen,
                    hasVisitorInfo: result.hasVisitorInfo,
                };

                // 키 순회하며 업데이트
                (Object.keys(updateSource) as (keyof CreateLocationRequest)[]).forEach(key => {
                    // 값 존재 여부 체크
                    const value = updateSource[key];
                    if (value === undefined || value === null) return;

                    // TargetFields 체크
                    if (targetFields) {
                        if (targetFields.includes(key)) {
                            // @ts-ignore
                            newData[key] = value;
                        }
                    } else {
                        // 전체 업데이트 모드에서도 기존 값이 있고 AI가 빈 값이면 유지하는 로직이 있었음 (prev.name 등)
                        // 위 updateSource 구성 시 prev를 안 썼으므로 여기서 처리 필요.
                        // 하지만 기존 로직: `name: result.name || prev.name` 방식이었음.
                        // 간단히: 값이 Truthy일 때만 덮어쓰기 (빈 문자열은 덮어쓰지 않음)
                        if (value) {
                            // @ts-ignore
                            newData[key] = value;
                        }
                    }
                });

                return newData;
            });

            alert(googlePlaceResult
                ? '구글 지도 기반 정확한 위치와 AI 정보를 찾았습니다!'
                : 'AI가 정보를 찾았습니다. 내용을 확인해주세요!');
        } catch (error) {
            console.error('AI search failed:', error);
            alert('AI 검색에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsAiSearching(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            alert('필수 정보(이름)를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            // Save Location
            const dataToSave = { ...formData };

            if (isEditMode && locationId) {
                await adminService.updateLocation(locationId, dataToSave);
            } else {
                await adminService.createLocation(dataToSave);
            }

            // Clear temp save on success
            localStorage.removeItem(tempSaveKey);

            navigate(`/admin/locations/${contentId}`);
        } catch (error) {
            console.error('Failed to save location:', error);
            alert('저장에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            {/* Header matches reference: Title and Save button aligned */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="text-gray-500 text-sm mb-1">OTT 상세 페이지 등록 &gt; {(contentTitle)}</div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {contentTitle}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* KR/EN Language Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setDisplayLang('kr')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${displayLang === 'kr'
                                ? 'bg-white text-[#5a3d8b] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            KR
                        </button>
                        <button
                            onClick={() => setDisplayLang('en')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${displayLang === 'en'
                                ? 'bg-white text-[#5a3d8b] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            EN
                        </button>
                    </div>
                    {/* Preview Button */}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-4 py-2.5 rounded-lg transition-colors font-medium flex items-center gap-2 ${showPreview
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        👁️ {showPreview ? '미리보기 닫기' : '미리보기'}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-8 py-2.5 bg-[#5a3d8b] text-white rounded-lg hover:bg-[#4a2d7b] transition-colors font-medium disabled:opacity-50"
                    >
                        {isLoading ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            </div>

            {/* Preview Panel - Slides from right */}
            {showPreview && (
                <div className="fixed right-0 top-0 h-full w-[375px] bg-white shadow-2xl z-50 overflow-y-auto border-l">
                    {/* Mobile Preview Header - Overlay */}
                    <div className="absolute top-0 right-0 z-50 p-2">
                        <button
                            onClick={() => setShowPreview(false)}
                            className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Actual User View Component */}
                    <div className="w-full min-h-screen bg-white">
                        <LocationDetailView
                            location={{
                                ...formData,
                                id: locationId || 'preview-id',
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                viewCount: 0,
                                reviewCount: 0,
                                rating: 0,
                                isActive: true,
                                // Handle bilingual fields based on toggle
                                name: displayLang === 'kr' ? formData.name : (formData.nameEn || formData.name),
                                description: displayLang === 'kr' ? formData.description : (formData.descriptionEn || formData.description),
                                address: displayLang === 'kr' ? formData.address : (formData.addressEn || formData.address),
                                displayAddress: displayLang === 'kr' ? formData.displayAddress : (formData.displayAddressEn || formData.displayAddress),
                                ownerDescription: displayLang === 'kr' ? formData.ownerDescription : (formData.ownerDescriptionEn || formData.ownerDescription),
                                onScreen: displayLang === 'kr' ? formData.onScreen : (formData.onScreenEn || formData.onScreen),
                            } as any}
                            contentTitle={contentTitle}
                            onBack={() => setShowPreview(false)}
                        />
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Location Name Section */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="block text-lg font-bold text-gray-800">
                            Location {displayLang === 'en' && <span className="text-sm font-normal text-gray-500">(English)</span>}
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">{formData.isActive ? 'Public' : 'Private'}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.isActive ?? true}
                                    onChange={(e) => handleChange('isActive', e.target.checked)}
                                />
                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5a3d8b]"></div>
                            </label>
                            <button
                                onClick={handleTempSave}
                                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium ml-2"
                            >
                                임시 저장
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={displayLang === 'kr' ? formData.name : formData.nameEn}
                            onChange={(e) => handleChange(displayLang === 'kr' ? 'name' : 'nameEn', e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                            placeholder={displayLang === 'kr' ? '장소명을 입력하세요' : 'Enter location name'}
                        />
                        <button
                            onClick={() => handleAiSearch()}
                            disabled={isAiSearching}
                            className={`px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${isAiSearching ? 'bg-purple-200 text-purple-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {isAiSearching ? '🔄 검색중...' : '찾기 🔍'}
                        </button>
                    </div>
                </div>

                {/* Picture Section */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Picture</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!!formData.thumbnailUrl}
                                readOnly // No changes needed if duplicates are gone.
                            // I will skip this action and rely on previous fix verification.nce usually, or manually? Reference implies toggle. Let's make it toggle for UI but logic relies on url.
                            // Actually, let's treat it as "Enabled" toggle for visual consistency, even if always true for main pic.
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5a3d8b]"></div>
                        </label>
                    </div>
                    <div className="p-6 bg-gray-50 min-h-[300px]">
                        <ImageUploader
                            value={formData.thumbnailUrl}
                            onChange={(url) => handleChange('thumbnailUrl', url)}
                            aspectRatio={375 / 280}
                            className="w-full shrink-0 rounded-[10px]"
                        />
                    </div>
                </div>

                {/* About This Location */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">About This Location</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={true} readOnly />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5a3d8b]"></div>
                        </label>
                    </div>
                    <div className="p-6 bg-gray-50">
                        <textarea
                            value={displayLang === 'kr' ? formData.description : formData.descriptionEn}
                            onChange={(e) => handleChange(displayLang === 'kr' ? 'description' : 'descriptionEn', e.target.value)}
                            className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                            placeholder={displayLang === 'kr' ? '장소 설명을 입력하세요...' : 'Location description...'}
                        />
                    </div>
                </div>

                {/* Chef's Pick Section */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Chef</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.isChef}
                                onChange={(e) => handleChange('isChef', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5a3d8b]"></div>
                        </label>
                    </div>
                    {formData.isChef && (
                        <div className="p-6 bg-gray-50 space-y-4">
                            <div className="min-h-[200px]">
                                <div className="relative mb-4">
                                    <textarea
                                        className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                                        placeholder={displayLang === 'kr' ? '셰프의 코멘트를 입력하세요 (최대 100자)...' : "Chef's comment or description (max 100 chars)..."}
                                        value={displayLang === 'kr' ? formData.ownerDescription : formData.ownerDescriptionEn}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.length <= 100) {
                                                handleChange(displayLang === 'kr' ? 'ownerDescription' : 'ownerDescriptionEn', val);
                                            }
                                        }}
                                        maxLength={100}
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-1 rounded">
                                        {(displayLang === 'kr' ? formData.ownerDescription : formData.ownerDescriptionEn)?.length || 0}/100
                                    </div>
                                </div>
                                <ImageUploader
                                    value={formData.chefImageUrl}
                                    onChange={(url) => handleChange('chefImageUrl', url)}
                                    aspectRatio={1}
                                    className="size-[100px] shrink-0 rounded-[10px]"
                                    previewImageClassName="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Off the screen Section */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Off the screen</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.isOffTheScreen}
                                onChange={(e) => handleChange('isOffTheScreen', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5a3d8b]"></div>
                        </label>
                    </div>
                    {formData.isOffTheScreen && (
                        <div className="p-6 bg-gray-50 space-y-4">
                            <div className="relative mb-4">
                                <textarea
                                    value={displayLang === 'kr' ? formData.onScreen : formData.onScreenEn}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val.length <= 100) {
                                            handleChange(displayLang === 'kr' ? 'onScreen' : 'onScreenEn', val);
                                        }
                                    }}
                                    className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                                    placeholder={displayLang === 'kr' ? '화면에 등장한 장면 설명 (최대 100자)...' : 'Description for Off the screen (max 100 chars)...'}
                                    maxLength={100}
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-1 rounded">
                                    {(displayLang === 'kr' ? formData.onScreen : formData.onScreenEn)?.length || 0}/100
                                </div>
                            </div>
                            <ImageUploader
                                value={formData.offTheScreenImageUrl}
                                onChange={(url) => handleChange('offTheScreenImageUrl', url)}
                                aspectRatio={1.5}
                                className="w-[150px] shrink-0 rounded-[10px]"
                                previewImageClassName="absolute inset-0 max-w-none object-50%-50% object-cover size-full"
                            />
                        </div>
                    )}
                </div>

                {/* Visitor Information Section */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Visitor information</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.hasVisitorInfo}
                                onChange={(e) => handleChange('hasVisitorInfo', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5a3d8b]"></div>
                        </label>
                    </div>
                    {formData.hasVisitorInfo && (
                        <div className="p-6 bg-gray-50 space-y-4">
                            {/* 4 horizontal rows */}
                            {[
                                { label: 'Opening hours', icon: '⏰', field: 'openingHours' },
                                { label: 'Price', icon: '💰', field: 'price' },
                                { label: 'Accessibility', icon: '♿', field: 'accessibility' },
                                { label: 'Parking', icon: '🅿️', field: 'parking' }
                            ].map((item) => {
                                // Determine field name based on lang for parking (others are shared/single or bool? accessibility is bool in schema but handled as string here?)
                                // Actually accessibility is string in this editor state?
                                // Let's check formData definition.
                                // For parking and accessibility, we now have EN versions.
                                let fieldName = item.field;
                                if (displayLang === 'en') {
                                    if (item.field === 'parking') fieldName = 'parkingEn';
                                    if (item.field === 'accessibility') fieldName = 'accessibilityEn';
                                }

                                return (
                                    <div key={item.label} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="w-32 font-medium text-gray-700">{item.label} {displayLang === 'en' && item.field === 'parking' ? '(EN)' : ''}</span>
                                        <input
                                            type="text"
                                            value={String(formData[fieldName as keyof CreateLocationRequest] || '')}
                                            onChange={(e) => handleChange(fieldName as keyof CreateLocationRequest, e.target.value)}
                                            className="flex-1 text-right outline-none text-gray-600 placeholder-gray-300"
                                            placeholder="Enter details"
                                        />
                                        {/* AI Refine Button specific for Parking */}
                                        {item.field === 'parking' && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const hint = `Find parking for this location. Current Address: ${formData.address}. Check if this address is correct and refine coordinates.`;
                                                    // Only update parking and coordinates. Preserve Address text!
                                                    handleAiSearch({ [item.field]: hint }, ['parking', 'parkingEn', 'latitude', 'longitude']);
                                                }}
                                                disabled={isAiSearching}
                                                className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                                                title="AI Refine: 입력한 내용을 바탕으로 다시 검색"
                                            >
                                                {isAiSearching ? '⏳' : '🤖'}
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Location (Address & Coordinates) Section */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Location</h3>
                    </div>
                    <div className="p-6 bg-gray-50 space-y-4">

                        {/* Display Address (Output) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">화면 표시용 주소 (Display Address) - 실제 출력되는 텍스트</label>
                            <input
                                type="text"
                                value={displayLang === 'kr' ? formData.displayAddress : formData.displayAddressEn}
                                onChange={(e) => handleChange(displayLang === 'kr' ? 'displayAddress' : 'displayAddressEn', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                                placeholder={displayLang === 'kr' ? '화면에 표시할 주소를 입력하세요 (지도 검색용 주소와 다를 수 있음)' : 'Enter address for display'}
                            />
                        </div>

                        {/* Map Address (Internal/Geocoding) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">지도 검색용 주소 (Map Address) - 핀 위치 검색용</label>
                            <input
                                type="text"
                                value={displayLang === 'kr' ? formData.address : formData.addressEn}
                                onChange={(e) => handleChange(displayLang === 'kr' ? 'address' : 'addressEn', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                                placeholder={displayLang === 'kr' ? '지도 검색을 위한 주소 (정확한 위치 찾기용)' : 'Enter address for map search'}
                            />
                        </div>

                        {/* Coordinates */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">위도 (Latitude)</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={formData.latitude}
                                    onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">경도 (Longitude)</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={formData.longitude}
                                    onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                                />
                            </div>
                        </div>

                        {/* Google Maps Preview */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">지도 미리보기</label>
                            <div className="h-[250px] rounded-xl overflow-hidden border border-gray-200">
                                <iframe
                                    title="Location Map"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=${formData.address
                                        ? encodeURIComponent(formData.address)
                                        : `${formData.latitude},${formData.longitude}`
                                        }&zoom=16`}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">* 주소 또는 위도/경도를 수정하면 지도가 자동으로 업데이트됩니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
