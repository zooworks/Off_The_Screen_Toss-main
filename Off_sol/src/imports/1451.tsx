import svgPaths from "./svg-k4gtm0rx14";

function CocoBoldHome() {
  return (
    <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Home">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="COCO/Bold/Home">
          <path d={svgPaths.pddc4a00} fill="var(--fill-0, #8E8E93)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SfSymbol() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="SF Symbol">
      <CocoBoldHome />
    </div>
  );
}

function IOsTab() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[49px] items-center justify-center min-h-px min-w-px overflow-clip pb-[8px] pt-[11px] px-0 relative shrink-0" data-name="iOS Tab">
      <SfSymbol />
      <p className="font-['Toss Product Sans:Medium',sans-serif] h-[16px] leading-[normal] not-italic relative shrink-0 text-[#8e8e93] text-[10px] text-center tracking-[-0.24px] w-full">Home</p>
    </div>
  );
}

function CocoBoldDiscovery() {
  return (
    <div className="absolute inset-[7.14%]" data-name="COCO/Bold/Discovery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="COCO/Bold/Discovery">
          <path clipRule="evenodd" d={svgPaths.p15801500} fill="var(--fill-0, #8E8E93)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SfSymbol1() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="SF Symbol">
      <CocoBoldDiscovery />
    </div>
  );
}

function IOsTab1() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[49px] items-center justify-center min-h-px min-w-px overflow-clip pb-[8px] pt-[11px] px-0 relative shrink-0" data-name="iOS Tab">
      <SfSymbol1 />
      <p className="font-['Toss Product Sans:Medium',sans-serif] h-[16px] leading-[normal] not-italic relative shrink-0 text-[#8e8e93] text-[10px] text-center tracking-[-0.24px] w-full">Map</p>
    </div>
  );
}

function CocoBoldHeart() {
  return (
    <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="COCO/Bold/Heart">
          <path d={svgPaths.p22aa1980} fill="var(--fill-0, #8E8E93)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="overflow-clip relative shrink-0 size-[28px]">
      <CocoBoldHeart />
    </div>
  );
}

function IOsTab2() {
  return (
    <div className="content-stretch flex flex-col h-[49px] items-center justify-center overflow-clip pb-[8px] pt-[11px] px-0 relative shrink-0 w-[97.5px]" data-name="iOS Tab">
      <Frame6 />
      <p className="font-['Toss Product Sans:Medium',sans-serif] h-[16px] leading-[normal] not-italic relative shrink-0 text-[#8e8e93] text-[10px] text-center tracking-[-0.24px] w-full">Favorite</p>
    </div>
  );
}

function CocoBoldUser() {
  return (
    <div className="absolute inset-[7.14%] overflow-clip" data-name="COCO/Bold/User">
      <div className="absolute h-[18px] left-[5px] top-[3px] w-[14px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 18">
          <g id="Vector">
            <path d={svgPaths.p34f72700} fill="var(--fill-0, #735CCC)" />
            <path d={svgPaths.p1328ee72} fill="var(--fill-0, #735CCC)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="overflow-clip relative shrink-0 size-[28px]">
      <CocoBoldUser />
    </div>
  );
}

function IOsTab3() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[49px] items-center justify-center min-h-px min-w-px overflow-clip pb-[8px] pt-[11px] px-0 relative shrink-0" data-name="iOS Tab">
      <Frame7 />
      <p className="font-['Toss Product Sans:Medium',sans-serif] h-[16px] leading-[normal] not-italic relative shrink-0 text-[#735ccc] text-[10px] text-center tracking-[-0.24px] w-full">My info</p>
    </div>
  );
}

function Tabs() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Tabs">
      <IOsTab />
      <IOsTab1 />
      <IOsTab2 />
      <IOsTab3 />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="h-[34px] relative shrink-0 w-full" data-name="Home Indicator">
      <div className="absolute bg-black bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] translate-x-[-50%] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

function IOsTabBar() {
  return (
    <div className="absolute backdrop-blur-[10px] backdrop-filter bg-[rgba(249,249,249,0.94)] content-stretch flex flex-col items-center left-1/2 shadow-[0px_-0.5px_0px_0px_rgba(0,0,0,0.3)] top-[729px] translate-x-[-50%] w-[375px]" data-name="iOS Tab Bar">
      <Tabs />
      <HomeIndicator />
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[#4930a6] content-stretch flex inset-[-12.5%_-12.5%_62.5%_62.5%] items-center justify-center overflow-clip px-[3.5px] py-[2px] rounded-[12px]" data-name="Badge">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[8px] relative shrink-0 text-[8px] text-center text-nowrap text-white uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
        2
      </p>
    </div>
  );
}

function BellFill() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="bell-fill">
      <div className="absolute inset-[8.33%_12.54%_8.34%_12.46%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.0002 20.0001">
          <path d={svgPaths.p24b4b980} fill="var(--fill-0, #8E8E93)" id="Vector" />
        </svg>
      </div>
      <Badge />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[335px]">
      <p className="font-['Afacad:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[23.814px] text-black text-nowrap tracking-[-0.7442px]">OFF THE SCREEN</p>
      <BellFill />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[54px] items-center justify-center left-1/2 top-0 translate-x-[-50%] w-[375px]">
      <Frame5 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start justify-center relative shrink-0 w-[153px]">
      <p className="font-['Toss Product Sans:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#948f97] text-[16px] w-full">Notification</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame3 />
    </div>
  );
}

function Component() {
  return (
    <div className="bg-[#8471d3] h-[24px] overflow-clip relative rounded-[36.364px] shrink-0 w-[60px]" data-name="Component 72">
      <div className="absolute left-[calc(50%+18px)] size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <circle cx="10" cy="10" fill="var(--fill-0, white)" id="Ellipse 1" r="10" />
        </svg>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[315px]">
      <Frame9 />
      <Component />
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] py-0 relative w-full">
          <Frame12 />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[60px] items-start justify-center relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-full">
      <Frame8 />
    </div>
  );
}

function Group() {
  return (
    <div className="h-[24.004px] relative shrink-0 w-[23.514px]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.5142 24">
        <g id="Group">
          <path d={svgPaths.p301e0a00} fill="var(--fill-0, #4285F4)" id="Vector" />
          <path d={svgPaths.pfb24480} fill="var(--fill-0, #34A853)" id="Vector_2" />
          <path d={svgPaths.p26a1e5f0} fill="var(--fill-0, #FBBC05)" id="Vector_3" />
          <path d={svgPaths.p20e98500} fill="var(--fill-0, #EA4335)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <Group />
      <p className="font-['Pretendard:Medium',sans-serif] leading-[1.6] not-italic relative shrink-0 text-[#3b3b3b] text-[14px] text-nowrap tracking-[-0.21px]">ttouott0@gmail.com</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] py-0 relative w-full">
          <p className="font-['Toss Product Sans:Medium',sans-serif] h-full leading-[normal] not-italic relative shrink-0 text-[#948f97] text-[16px] w-[153px]">Login Info</p>
          <Frame10 />
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[60px] items-start justify-center relative rounded-bl-[10px] rounded-br-[10px] shrink-0 w-full">
      <Frame13 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-0 p-[16px] top-[54px] w-[375px]">
      <Frame1 />
      <Frame2 />
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Pretendard:Medium',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#948f97] text-[14px] text-center tracking-[-0.21px] underline w-[242px]">Delete My Account</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Pretendard:Medium',sans-serif] gap-[4px] items-center leading-[1.6] left-0 not-italic text-[#948f97] text-[14px] text-center top-[395px] tracking-[-0.21px] w-[375px]">
      <p className="relative shrink-0 w-full">Off The Screen v 1.0</p>
      <p className="relative shrink-0 w-full">2026 Off The Screen, All right reserved</p>
    </div>
  );
}

export default function Component1() {
  return (
    <div className="bg-[#f5f5f5] relative size-full" data-name="1451">
      <IOsTabBar />
      <Frame4 />
      <Frame />
      <Frame11 />
    </div>
  );
}