import svgPaths from "./svg-tx1u7cf6ek";

function CocoBoldHome() {
  return (
    <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Home">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="COCO/Bold/Home">
          <path d={svgPaths.pddc4a00} fill="var(--fill-0, #735CCC)" id="Vector" />
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
      <p className="font-['Toss Product Sans:Medium',sans-serif] h-[16px] leading-[normal] not-italic relative shrink-0 text-[#735ccc] text-[10px] text-center tracking-[-0.24px] w-full">Home</p>
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

function Frame() {
  return (
    <div className="overflow-clip relative shrink-0 size-[28px]">
      <CocoBoldHeart />
    </div>
  );
}

function IOsTab2() {
  return (
    <div className="content-stretch flex flex-col h-[49px] items-center justify-center overflow-clip pb-[8px] pt-[11px] px-0 relative shrink-0 w-[97.5px]" data-name="iOS Tab">
      <Frame />
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
            <path d={svgPaths.p34f72700} fill="var(--fill-0, #8E8E93)" />
            <path d={svgPaths.p1328ee72} fill="var(--fill-0, #8E8E93)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[28px]">
      <CocoBoldUser />
    </div>
  );
}

function IOsTab3() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[49px] items-center justify-center min-h-px min-w-px overflow-clip pb-[8px] pt-[11px] px-0 relative shrink-0" data-name="iOS Tab">
      <Frame1 />
      <p className="font-['Toss Product Sans:Medium',sans-serif] h-[16px] leading-[normal] not-italic relative shrink-0 text-[#8e8e93] text-[10px] text-center tracking-[-0.24px] w-full">My info</p>
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

export default function IOsTabBar() {
  return (
    <div className="backdrop-blur-[10px] backdrop-filter bg-[rgba(249,249,249,0.94)] content-stretch flex flex-col items-center justify-end relative shadow-[0px_-0.5px_0px_0px_rgba(0,0,0,0.3)] size-full" data-name="iOS Tab Bar">
      <Tabs />
      <HomeIndicator />
    </div>
  );
}