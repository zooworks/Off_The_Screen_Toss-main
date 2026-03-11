import { useState, useEffect } from "react";
import MapAppsModal from "@/app/components/MapAppsModal";
import svgPaths from "@/imports/svg-l7ejxw8b0j";
import locationsService from "@/services/locations";
import type { Location } from "@/types/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedLocation, getLocalizedContent } from "@/lib/localization";

import iconOpeningHours from "@/assets/icons/opening_hours.svg";
import iconPrice from "@/assets/icons/price.svg";
import iconAccessibility from "@/assets/icons/accessibility.svg";
import iconParking from "@/assets/icons/parking.svg";

const imgImage1664 = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Image";
const imgImage1665 = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Image";
const imgImage1666 = "https://placehold.co/150x100/CCCCCC/FFFFFF/png?text=Image";
const imgMapOfBirminghamStreet = "https://placehold.co/400x300/CCCCCC/FFFFFF/png?text=Map";

interface LocationDetailViewProps {
  location: Location;
  contentTitle?: string;  // 콘텐츠 제목 (선택적)
  onBack: () => void;
}

function ArrowBackIos({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative shrink-0 size-[24px]" data-name="arrow_back_ios">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow_back_ios">
          <path d={svgPaths.pf93b000} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </button>
  );
}

function Top({ onBack, locationName }: { onBack: () => void; locationName?: string }) {
  return (
    <div className="bg-white h-[54px] relative w-full" data-name="top">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-0 relative size-full">
          <div className="flex items-center justify-center relative shrink-0 w-full">
            <div className="flex-none scale-y-[-100%]">
              <p className="mx-auto w-[233px] h-[17px] font-['Pretendard'] not-italic font-semibold text-[17px] leading-none text-center text-[#000000] flex-none order-2 grow-0 truncate">{locationName || 'Location Detail'}</p>
            </div>
          </div>
          <div className="size-[24px]" />
        </div>
      </div>
    </div>
  );
}



function Frame4() {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Toss Product Sans:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(60,60,67,0.6)] text-nowrap tracking-[-0.408px]">👀 {t('views')}</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Toss Product Sans:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(60,60,67,0.6)] text-nowrap tracking-[-0.408px]">:</p>
    </div>
  );
}

function Frame3({ viewCount }: { viewCount?: number }) {
  // Format view count (e.g., 1200 -> "1.2k")
  const formatViews = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Toss Product Sans:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(60,60,67,0.6)] text-nowrap tracking-[-0.408px]">{formatViews(viewCount || 0)}</p>
    </div>
  );
}

function Frame9({ viewCount }: { viewCount?: number }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame4 />
      <Frame5 />
      <Frame3 viewCount={viewCount} />
    </div>
  );
}

function Frame10({ contentTitle }: { contentTitle?: string }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Toss Product Sans:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(60,60,67,0.6)] text-nowrap tracking-[-0.408px]">
        📺<span>{` ${contentTitle || 'Unknown Content'}`}</span>
      </p>
    </div>
  );
}

function Frame6({ contentTitle }: { contentTitle?: string }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame10 contentTitle={contentTitle} />
    </div>
  );
}

function Frame7({ viewCount, contentTitle }: { viewCount?: number; contentTitle?: string }) {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame9 viewCount={viewCount} />
      <Frame6 contentTitle={contentTitle} />
    </div>
  );
}

function Content({ viewCount, contentTitle }: { viewCount?: number; contentTitle?: string }) {
  return (
    <div className="bg-[rgba(250,250,250,0.93)] h-[36px] relative shrink-0 w-full" data-name="content                                                                                                                                                                                                                         &">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[8px] relative size-full">
          <Frame7 viewCount={viewCount} contentTitle={contentTitle} />
        </div>
      </div>
    </div>
  );
}

function SearchBar({ viewCount, contentTitle }: { viewCount?: number; contentTitle?: string }) {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-0 top-[280px] w-full md:w-[375px]" data-name="& SearchBar">
      <Content viewCount={viewCount} contentTitle={contentTitle} />
    </div>
  );
}

function Frame29({ thumbnailUrl, viewCount, contentTitle }: { thumbnailUrl?: string | null; viewCount?: number; contentTitle?: string }) {
  return (
    <div className="h-[320px] relative shrink-0 w-full max-w-[900px] mx-auto">
      <div className="absolute h-[280px] left-0 top-0 w-full" data-name="image 1664">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="w-full h-full object-cover"
            src={thumbnailUrl || imgImage1664}
          />
        </div>
      </div>
      <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0)] inset-[0_0_12.5%_0] to-[rgba(0,0,0,0.7)]" data-name="Gradient">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(216,216,216,0)] border-solid inset-0 pointer-events-none" />
      </div>
      <SearchBar viewCount={viewCount} contentTitle={contentTitle} />
    </div>
  );
}

function Frame() {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Toss Product Sans:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#31373d] text-[16px] w-full">{t('about_location')}</p>
    </div>
  );
}

function FilterBlock({ description }: { description?: string | null }) {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Filter Block">
      <Frame />
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[14px] w-full">{description || t('no_description')}</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.99px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 335 0.992366">
            <line id="Line 6" stroke="var(--stroke-0, #ECEDF0)" strokeWidth="0.992366" x2="335" y1="0.496183" y2="0.496183" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Toss Product Sans:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#31373d] text-[16px] w-full">{t('owner')}</p>
    </div>
  );
}

function Frame8({ ownerDescription, chefImageUrl }: { ownerDescription?: string | null; chefImageUrl?: string | null }) {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <div className="relative rounded-[10px] shrink-0 size-[100px]" data-name="image 1665">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[10px]">
          <img alt="" className="absolute inset-0 w-full h-full object-cover" src={chefImageUrl || imgImage1665} />
        </div>
      </div>
      <p className="basis-0 font-['Manrope:Regular',sans-serif] font-normal grow leading-[1.5] min-h-px min-w-px relative shrink-0 text-[#3b3b3b] text-[14px]">{ownerDescription || t('no_owner_desc')}</p>
    </div>
  );
}

function FilterBlock1({ ownerDescription, chefImageUrl }: { ownerDescription?: string | null; chefImageUrl?: string | null }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Filter Block">
      <Frame1 />
      <Frame8 ownerDescription={ownerDescription} chefImageUrl={chefImageUrl} />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.99px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 335 0.992366">
            <line id="Line 6" stroke="var(--stroke-0, #ECEDF0)" strokeWidth="0.992366" x2="335" y1="0.496183" y2="0.496183" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  // User requested "On the screen" to stay English or fixed.
  // "on the screen 빼고는 전부다 한영 먹히도록 해줘"
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full">
      <p className="font-['Toss Product Sans:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#31373d] text-[16px] w-full">On the screen</p>
    </div>
  );
}

function Frame12({ onScreen, offTheScreenImageUrl }: { onScreen?: string | null; offTheScreenImageUrl?: string | null }) {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex gap-[12px] min-h-[100px] items-start relative shrink-0 w-full">
      <div className="h-[100px] relative shrink-0 w-[150px] bg-gray-100 rounded-lg overflow-hidden" data-name="image 1666">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover size-full" src={offTheScreenImageUrl || imgImage1666} />
      </div>
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] relative text-[#3b3b3b] text-[14px] flex-1 break-words">{onScreen || t('no_scene_desc')}</p>
    </div>
  );
}

function Frame32({ onScreen, offTheScreenImageUrl }: { onScreen?: string | null; offTheScreenImageUrl?: string | null }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame2 />
      <Frame12 onScreen={onScreen} offTheScreenImageUrl={offTheScreenImageUrl} />
    </div>
  );
}

function Frame16({ onScreen, offTheScreenImageUrl }: { onScreen?: string | null; offTheScreenImageUrl?: string | null }) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame32 onScreen={onScreen} offTheScreenImageUrl={offTheScreenImageUrl} />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.99px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 335 0.992366">
            <line id="Line 6" stroke="var(--stroke-0, #ECEDF0)" strokeWidth="0.992366" x2="335" y1="0.496183" y2="0.496183" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full">
      {/* Changed font style to match About This Location */}
      <p className="font-['Toss Product Sans:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#31373d] text-[16px] w-full">{t('visitor_information')}</p>
    </div>
  );
}

function IconAlarmClockCheck() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / alarm-clock-check">
      <img src={iconOpeningHours} className="block size-full" alt="Opening Hours" />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <IconAlarmClockCheck />
    </div>
  );
}

function Frame17() {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame13 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#999] text-[14px] text-nowrap">{t('opening_hours')}</p>
    </div>
  );
}

function Frame18({ openingHours }: { openingHours?: string | null }) {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full gap-4">
      <Frame17 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[14px] text-right break-words flex-1">{openingHours || t('always_open')}</p>
    </div>
  );
}

function IconPrice() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / price">
      <img src={iconPrice} className="block size-full" alt="Price" />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <IconPrice />
    </div>
  );
}

function Frame19() {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame14 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#999] text-[14px] text-nowrap">{t('price')}</p>
    </div>
  );
}

function Frame20({ price }: { price?: string | null }) {
  const { t } = useLanguage();
  // Extract prices and format as range
  const formatPrice = (priceStr?: string | null) => {
    if (!priceStr) return t('free'); // Localized 'Free' or '무료'

    const matches = priceStr.match(/[\d,]+(?:\s*KRW)?/gi);

    if (matches && matches.length >= 2) {
      const numbers = matches.map(m => parseInt(m.replace(/[^\d]/g, ''), 10)).filter(n => !isNaN(n));
      if (numbers.length > 0) {
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        if (min === max) return `${min}KRW`;
        return `${min}KRW ~ ${max}KRW`;
      }
    }

    const priceNumbers = priceStr.match(/[\d,]+/g);
    if (priceNumbers && priceNumbers.length >= 2) {
      const numbers = priceNumbers.map(n => parseInt(n.replace(/,/g, ''), 10));
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      return `${min}KRW ~ ${max}KRW`;
    } else if (priceNumbers && priceNumbers.length === 1) {
      return `${priceNumbers[0].replace(/,/g, '')}KRW`;
    }

    return priceStr;
  };

  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full gap-4">
      <Frame19 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[14px] text-right break-words flex-1">
        {formatPrice(price)}
      </p>
    </div>
  );
}

function IconAccessibility() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / accessibility">
      <img src={iconAccessibility} className="block size-full" alt="Accessibility" />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <IconAccessibility />
    </div>
  );
}

function Frame34() {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame33 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#999] text-[14px] text-nowrap">{t('accessibility')}</p>
    </div>
  );
}

function Frame21({ accessibility }: { accessibility?: boolean }) {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full gap-4">
      <Frame34 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[14px] text-right break-words flex-1">{accessibility ? t('enabled') : t('disabled')}</p>
    </div>
  );
}

function IconParking() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / parking">
      <img src={iconParking} className="block size-full" alt="Parking" />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <IconParking />
    </div>
  );
}

function Frame36() {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame35 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#999] text-[14px] text-nowrap">{t('parking')}</p>
    </div>
  );
}

function Frame22({ parking }: { parking?: string | null }) {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full gap-4">
      <Frame36 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[14px] text-right break-words flex-1">{parking || t('no_info')}</p>
    </div>
  );
}

function Frame25({ openingHours, price, accessibility, parking }: { openingHours?: string | null; price?: string | null; accessibility?: boolean; parking?: string | null }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame18 openingHours={openingHours} />
      <Frame20 price={price} />
      <Frame21 accessibility={accessibility} />
      <Frame22 parking={parking} />
    </div>
  );
}

function Frame26({ openingHours, price, accessibility, parking }: { openingHours?: string | null; price?: string | null; accessibility?: boolean; parking?: string | null }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame11 />
      <Frame25 openingHours={openingHours} price={price} accessibility={accessibility} parking={parking} />
    </div>
  );
}

function Frame27({ openingHours, price, accessibility, parking }: { openingHours?: string | null; price?: string | null; accessibility?: boolean; parking?: string | null }) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame26 openingHours={openingHours} price={price} accessibility={accessibility} parking={parking} />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.99px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 335 0.992366">
            <line id="Line 6" stroke="var(--stroke-0, #ECEDF0)" strokeWidth="0.992366" x2="335" y1="0.496183" y2="0.496183" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame37() {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full">
      {/* Changed font style to match About This Location */}
      <p className="font-['Toss Product Sans:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#31373d] text-[16px] w-full">{t('location_header')}</p>
    </div>
  );
}

function MapsZoomLevel3Street({ latitude, longitude, address }: { latitude?: number; longitude?: number; address?: string }) {
  const { language } = useLanguage();
  // Use address if available, otherwise use coordinates
  // Use address if available, otherwise use coordinates
  const mapQuery = address
    ? encodeURIComponent(address)
    : `${latitude || 37.5665},${longitude || 126.978}`;

  return (
    <div className="bg-white h-[200px] overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Maps / Zoom Level / 3 (Street)">
      <iframe
        title="Location Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=${mapQuery}&zoom=16&language=${language}`}
      />
    </div>
  );
}

function Frame23({ latitude, longitude, address }: { latitude?: number; longitude?: number; address?: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame37 />
      <MapsZoomLevel3Street latitude={latitude} longitude={longitude} address={address} />
    </div>
  );
}

function IconAlarmClockCheck4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / alarm-clock-check">
      <img src={iconOpeningHours} className="block size-full" alt="Opening Hours" />
    </div>
  );
}

function Copy() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="copy">
      <IconAlarmClockCheck4 />
    </div>
  );
}

function TextBox() {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex h-[22.666px] items-center relative shrink-0" data-name="TextBox">
      <p className="font-['Hiragino_Sans:W6',sans-serif] leading-[18.888px] not-italic relative shrink-0 text-[#5a3d8b] text-[13.893px] text-center text-nowrap">{t('get_direction')}</p>
    </div>
  );
}

function Button({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="bg-[#f3f0ff] h-[47.63px] relative rounded-[7.328px] shrink-0 w-full hover:bg-[#ebe5ff] transition-colors" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[17px] py-[14.656px] relative size-full">
          <TextBox />
        </div>
      </div>
    </button>
  );
}

function Frame24({ onGetDirection, address, displayAddress, mapAddress, latitude, longitude }: { onGetDirection?: () => void; address?: string | null; displayAddress?: string | null; mapAddress?: string; latitude?: number; longitude?: number }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      {/* Map uses primary Map Address (Korean/Shared) */}
      <Frame23 latitude={latitude} longitude={longitude} address={mapAddress || address || undefined} />
      {/* Text display uses Display Address (Localized), fallback to Localized Address */}
      <Frame15 address={displayAddress || address || undefined} />
      <Button onClick={onGetDirection} />
    </div>
  );
}

function Frame15({ address }: { address?: string }) {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex gap-[8px] min-h-[42px] items-center relative shrink-0 w-full">
      {/* ... Icon ... */}
      <div className="shrink-0 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] relative text-[#999] text-[14px] flex-1 break-words py-2">
        {address || t('address_not_available')}
      </p>
      <button
        onClick={() => {
          if (address) {
            navigator.clipboard.writeText(address);
            alert(t('copy_address_success'));
          }
        }}
        className="shrink-0 p-2 text-gray-400 hover:text-gray-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
}



function Frame28({ onGetDirection, location }: { onGetDirection?: () => void; location?: Location }) {
  // Logic checks
  const showChef = location?.isChef || (location?.ownerDescription && location?.ownerDescription.length > 0);
  const showOffTheScreen = location?.isOffTheScreen || (location?.onScreen && location?.onScreen.length > 0);
  const showVisitorInfo = location?.hasVisitorInfo ?? true; // Default to true if undefined, or handle based on fields existence

  return (
    <div className="relative content-stretch flex flex-col gap-[16px] items-start mx-auto mt-[20px] w-full max-w-[375px] px-[16px]">
      <FilterBlock description={location?.description} />

      {showChef && <FilterBlock1 ownerDescription={location?.ownerDescription} chefImageUrl={location?.chefImageUrl} />}

      {showOffTheScreen && <Frame16 onScreen={location?.onScreen} offTheScreenImageUrl={location?.offTheScreenImageUrl} />}

      {showVisitorInfo && (
        <Frame27
          openingHours={location?.openingHours}
          price={location?.price}
          accessibility={location?.accessibility}
          parking={location?.parking}
        />
      )}

      <Frame24
        onGetDirection={onGetDirection}
        address={location?.address}
        // @ts-ignore: mapAddress injected manually
        mapAddress={location?.mapAddress}
        displayAddress={location?.displayAddress}
        latitude={location?.latitude}
        longitude={location?.longitude}
      />
    </div>
  );
}

function Frame30({ onGetDirection, location }: { onGetDirection?: () => void; location?: Location }) {
  return (
    <div className="min-h-[1108px] overflow-clip relative shrink-0 w-full pb-24">
      <Frame28 onGetDirection={onGetDirection} location={location} />
    </div>
  );
}

function Frame31({ onBack, onGetDirection, location, contentTitle }: { onBack: () => void; onGetDirection?: () => void; location?: Location; contentTitle?: string }) {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-0 w-full">
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none scale-y-[-100%] w-full">
          <Top onBack={onBack} locationName={location?.name} />
        </div>
      </div>
      <Frame29
        thumbnailUrl={location?.thumbnailUrl}
        viewCount={location?.viewCount}
        contentTitle={contentTitle}
      />
      <Frame30 onGetDirection={onGetDirection} location={location} />
    </div>
  );
}

export default function LocationDetailView({ location, contentTitle, onBack }: LocationDetailViewProps) {
  const [isMapAppsModalOpen, setIsMapAppsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(location);
  const { language } = useLanguage();

  const localizedLocation = {
    ...currentLocation,
    ...getLocalizedLocation(currentLocation, language),
    content: currentLocation.content ? {
      ...currentLocation.content,
      ...getLocalizedContent(currentLocation.content, language)
    } : undefined,
    // [Fix]: Always use the primary (Korean) address for the map query to ensure consistent pin location
    mapAddress: currentLocation.address
  };

  // 컴포넌트 마운트 시 API 호출하여 viewCount 증가
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const updatedLocation = await locationsService.getById(location.id);
        setCurrentLocation(updatedLocation);
      } catch (error) {
        console.error('Failed to fetch location:', error);
      }
    };
    fetchLocation();
  }, [location.id]);

  // Location 데이터에서 좌표 및 정보 추출
  const destinationLat = currentLocation.latitude;
  const destinationLng = currentLocation.longitude;
  // Map Navigation: Use Korean name (currentLocation.name) for better accuracy in local map apps (Naver/Kakao).
  // Also strip English parts in parentheses e.g., "장소명 (English)" -> "장소명"
  const rawName = currentLocation.name || "";
  const destinationName = rawName.split('(')[0].trim();

  // contentTitle 우선순위: props > localizedLocation.content?.title
  const resolvedContentTitle = contentTitle || localizedLocation.content?.title;

  return (
    <div className="bg-white fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] z-[70] overflow-y-auto no-scrollbar overflow-x-hidden" data-name="LocationDetailView">
      <Frame31
        onBack={onBack}
        onGetDirection={() => setIsMapAppsModalOpen(true)}
        location={localizedLocation}
        contentTitle={resolvedContentTitle}
      />

      {/* Map Apps Modal */}
      <MapAppsModal
        isOpen={isMapAppsModalOpen}
        onClose={() => setIsMapAppsModalOpen(false)}
        destinationLat={destinationLat}
        destinationLng={destinationLng}
        destinationName={destinationName}
      />
    </div>
  );
}