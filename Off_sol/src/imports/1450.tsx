import svgPaths from "./svg-cp1lx7j3fb";
const imgItem = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Item";

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
          <path d={svgPaths.p22aa1980} fill="var(--fill-0, #735CCC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="overflow-clip relative shrink-0 size-[28px]">
      <CocoBoldHeart />
    </div>
  );
}

function IOsTab2() {
  return (
    <div className="content-stretch flex flex-col h-[49px] items-center justify-center overflow-clip pb-[8px] pt-[11px] px-0 relative shrink-0 w-[97.5px]" data-name="iOS Tab">
      <Frame5 />
      <p className="font-['Toss Product Sans:Medium',sans-serif] h-[16px] leading-[normal] not-italic relative shrink-0 text-[#735ccc] text-[10px] text-center tracking-[-0.24px] w-full">Favorite</p>
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

function Frame6() {
  return (
    <div className="overflow-clip relative shrink-0 size-[28px]">
      <CocoBoldUser />
    </div>
  );
}

function IOsTab3() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[49px] items-center justify-center min-h-px min-w-px overflow-clip pb-[8px] pt-[11px] px-0 relative shrink-0" data-name="iOS Tab">
      <Frame6 />
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

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[335px]">
      <p className="font-['Afacad:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[23.814px] text-black text-nowrap tracking-[-0.7442px]">OFF THE SCREEN</p>
      <BellFill />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[54px] items-center justify-center left-1/2 top-0 translate-x-[-50%] w-[375px]">
      <Frame4 />
    </div>
  );
}

function Item() {
  return (
    <div className="relative rounded-[4.685px] shrink-0 size-[60px]" data-name="item">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[4.685px] size-full" src={imgItem} />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[60px] items-start justify-center not-italic relative shrink-0 w-[153px]">
      <p className="font-['Pretendard:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#3b3b3b] text-[16px] w-full">Eatanic Garden, Josun Palace</p>
      <p className="font-['Toss Product Sans:Medium',sans-serif] leading-none relative shrink-0 text-[#948f97] text-[12px] w-full">Seoul 120 views</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Item />
      <Frame2 />
    </div>
  );
}

function CocoBoldHeart1() {
  return (
    <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="COCO/Bold/Heart">
          <path d={svgPaths.p22aa1980} fill="var(--fill-0, #735CCC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="overflow-clip relative shrink-0 size-[28px]">
      <CocoBoldHeart1 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] py-0 relative w-full">
          <Frame9 />
          <Frame7 />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[80px] items-start justify-center relative rounded-[10px] shrink-0 w-full">
      <Frame8 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] items-center justify-center left-0 p-[16px] top-[54px] w-[375px]">
      {[...Array(5).keys()].map((_, i) => (
        <Frame1 key={i} />
      ))}
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f5f5f5] relative size-full" data-name="1450">
      <IOsTabBar />
      <Frame3 />
      <Frame />
    </div>
  );
}