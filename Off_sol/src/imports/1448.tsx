import svgPaths from "./svg-ke1y6kanro";
const imgImage1664 = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Image";
const imgImage1665 = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Image";
const imgImage1666 = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Image";
const imgMapOfBirminghamStreet = "https://placehold.co/400x300/CCCCCC/FFFFFF/png?text=Map";

function ArrowBackIos() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="arrow_back_ios">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow_back_ios">
          <path d={svgPaths.pf93b000} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Tune() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="tune">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tune"></g>
      </svg>
    </div>
  );
}

function Top() {
  return (
    <div className="bg-white h-[54px] relative w-full" data-name="top">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-0 relative size-full">
          <ArrowBackIos />
          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex-none scale-y-[-100%]">
              <p className="font-['Pretendard:SemiBold',sans-serif] leading-none not-italic relative text-[17px] text-black text-center text-nowrap">Eatanic Garden, Josun Palace</p>
            </div>
          </div>
          <Tune />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Toss Product Sans:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(60,60,67,0.6)] text-nowrap tracking-[-0.408px]">👀 Views</p>
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

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Toss Product Sans:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(60,60,67,0.6)] text-nowrap tracking-[-0.408px]">1.2k</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame4 />
      <Frame5 />
      <Frame3 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Toss Product Sans:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(60,60,67,0.6)] text-nowrap tracking-[-0.408px]">
        📺<span>{` Culinary Class Wars: Season 2`}</span>
      </p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame10 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame9 />
      <Frame6 />
    </div>
  );
}

function Content() {
  return (
    <div className="bg-[rgba(250,250,250,0.93)] h-[36px] relative shrink-0 w-full" data-name="content                                                                                                                                                                                                                         &">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[8px] relative size-full">
          <Frame7 />
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-0 top-[212px] w-[375px]" data-name="& SearchBar">
      <Content />
    </div>
  );
}

function Frame29() {
  return (
    <div className="h-[248px] relative shrink-0 w-full">
      <div className="absolute h-[212px] left-0 top-0 w-[375px]" data-name="image 1664">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[152.97%] left-[-7.44%] max-w-none top-[-52.97%] w-[114.88%]" src={imgImage1664} />
        </div>
      </div>
      <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0)] inset-[0_0_14.52%_0] to-[rgba(0,0,0,0.7)]" data-name="Gradient">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(216,216,216,0)] border-solid inset-0 pointer-events-none" />
      </div>
      <SearchBar />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Toss Product Sans:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#31373d] text-[16px] w-[335px]">About This Location</p>
    </div>
  );
}

function FilterBlock() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Filter Block">
      <Frame />
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[14px] w-full">{`StreamVibe offers three different plans to fit your needs: Basic, Standard, and Premium. Compare the features of each plan and choose the one that's right for you.`}</p>
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
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Toss Product Sans:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#31373d] text-[16px] w-[335px]">Owner</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <div className="relative rounded-[10px] shrink-0 size-[100px]" data-name="image 1665">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[10px]">
          <img alt="" className="absolute h-[133.24%] left-0 max-w-none top-[0.6%] w-full" src={imgImage1665} />
        </div>
      </div>
      <p className="basis-0 font-['Manrope:Regular',sans-serif] font-normal grow leading-[1.5] min-h-px min-w-px relative shrink-0 text-[#3b3b3b] text-[14px]">{`StreamVibe offers three different plans to fit your needs: Basic, Standard, and Premium. Compare the features of each plan and `}</p>
    </div>
  );
}

function FilterBlock1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Filter Block">
      <Frame1 />
      <Frame8 />
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
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full">
      <p className="font-['Toss Product Sans:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#31373d] text-[16px] w-[335px]">On the screen</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[12px] h-[100.098px] items-start relative shrink-0 w-full">
      <div className="h-[100.098px] relative shrink-0 w-[181.081px]" data-name="image 1666">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1666} />
      </div>
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[12.613px] w-[143px]">{`StreamVibe offers three different plans to fit your needs: Basic, Standard, and `}</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame2 />
      <Frame12 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame32 />
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
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full">
      <p className="font-['Toss Product Sans:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#31373d] text-[16px] w-[335px]">Visitor information</p>
    </div>
  );
}

function IconAlarmClockCheck() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / alarm-clock-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / alarm-clock-check">
          <path d={svgPaths.paecb700} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M4.16667 2.5L1.66667 5" id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M18.3333 5L15.8333 2.5" id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p10955f80} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M14.7 15.5583L16.6667 17.5" id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2753fd80} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
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
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame13 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#999] text-[14px] text-nowrap">Opening hours</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame17 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[14px] text-nowrap">00:00-24:00</p>
    </div>
  );
}

function IconAlarmClockCheck1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / alarm-clock-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / alarm-clock-check">
          <path d={svgPaths.paecb700} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M4.16667 2.5L1.66667 5" id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M18.3333 5L15.8333 2.5" id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p10955f80} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M14.7 15.5583L16.6667 17.5" id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2753fd80} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <IconAlarmClockCheck1 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame14 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#999] text-[14px] text-nowrap">Price</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame19 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[14px] text-nowrap">100,000₩</p>
    </div>
  );
}

function IconAlarmClockCheck2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / alarm-clock-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / alarm-clock-check">
          <path d={svgPaths.paecb700} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M4.16667 2.5L1.66667 5" id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M18.3333 5L15.8333 2.5" id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p10955f80} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M14.7 15.5583L16.6667 17.5" id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2753fd80} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <IconAlarmClockCheck2 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame33 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#999] text-[14px] text-nowrap">Accessibility</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame34 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[14px] text-nowrap">Enabled</p>
    </div>
  );
}

function IconAlarmClockCheck3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / alarm-clock-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / alarm-clock-check">
          <path d={svgPaths.paecb700} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M4.16667 2.5L1.66667 5" id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M18.3333 5L15.8333 2.5" id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p10955f80} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M14.7 15.5583L16.6667 17.5" id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2753fd80} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <IconAlarmClockCheck3 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame35 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#999] text-[14px] text-nowrap">Parking</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame36 />
      <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#3b3b3b] text-[14px] text-nowrap">Enabled</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame18 />
      <Frame20 />
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame11 />
      <Frame25 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame26 />
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
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full">
      <p className="font-['Toss Product Sans:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#31373d] text-[16px] w-[335px]">Location</p>
    </div>
  );
}

function MapsZoomLevel3Street() {
  return (
    <div className="bg-white h-[200px] overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Maps / Zoom Level / 3 (Street)">
      <div className="absolute h-[699px] left-1/2 top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[1061px]" data-name="Map of Birmingham (Street)">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMapOfBirminghamStreet} />
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame37 />
      <MapsZoomLevel3Street />
    </div>
  );
}

function IconAlarmClockCheck4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon / alarm-clock-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / alarm-clock-check">
          <path d={svgPaths.paecb700} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M4.16667 2.5L1.66667 5" id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M18.3333 5L15.8333 2.5" id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p10955f80} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M14.7 15.5583L16.6667 17.5" id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2753fd80} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
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

function Frame15() {
  return (
    <div className="content-stretch flex gap-[4px] h-[42px] items-start relative shrink-0 w-full">
      <Copy />
      <p className="font-['Manrope:Regular',sans-serif] font-normal h-[42px] leading-[1.5] relative shrink-0 text-[#999] text-[14px] w-[287px]">272, Gonghang-ro, Jung-gu, Incheon, South Korea</p>
      <Copy />
    </div>
  );
}

function TextBox() {
  return (
    <div className="content-stretch flex h-[22.666px] items-center relative shrink-0" data-name="TextBox">
      <p className="font-['Hiragino_Sans:W6',sans-serif] leading-[18.888px] not-italic relative shrink-0 text-[#5a3d8b] text-[13.893px] text-center text-nowrap">Get direction</p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f3f0ff] h-[47.63px] relative rounded-[7.328px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[17px] py-[14.656px] relative size-full">
          <TextBox />
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame23 />
      <Frame15 />
      <Button />
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-1/2 top-[16px] translate-x-[-50%] w-[335px]">
      <FilterBlock />
      <FilterBlock1 />
      <Frame16 />
      <Frame27 />
      <Frame24 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="h-[1108px] overflow-clip relative shrink-0 w-full">
      <Frame28 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-0 w-[375px]">
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none scale-y-[-100%] w-full">
          <Top />
        </div>
      </div>
      <Frame29 />
      <Frame30 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="1448">
      <Frame31 />
    </div>
  );
}