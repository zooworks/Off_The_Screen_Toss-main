import svgPaths from "./svg-sfnnmum0j9";
const imgImage1663 = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Image";
const imgItem = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Item";
const imgImage1662 = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Image";

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['Toss Product Sans:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[24px] text-white tracking-[-0.5px] w-[305px]">Culinary Class Wars: Season 2</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[15px] items-start left-[20px] top-[74px] w-[335px]">
      <Frame />
      <p className="font-['Toss Product Sans:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[14px] text-white tracking-[-0.5px] w-[min-content]">Restaurants run by the chefs of Culinary Class Wars: Season 2, all within walking distance.</p>
    </div>
  );
}

function CocoBoldHeart() {
  return (
    <div className="absolute left-1/2 size-[17.143px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1429 17.1429">
        <g id="COCO/Bold/Heart">
          <path d={svgPaths.p1bea0400} fill="var(--fill-0, #735CCC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <CocoBoldHeart />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <Frame3 />
      <div className="flex flex-col font-['Toss Product Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white tracking-[0.0322px]">
        <p className="leading-[16.911px]">124</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-start justify-end relative shrink-0 w-[134px]">
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 text-white tracking-[0.0322px] w-full">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[12.885px] w-full">
        <p className="leading-[21.743px]">K-POP Demo...</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-full">
        <p className="leading-[16.911px]">1.3k views</p>
      </div>
    </div>
  );
}

function Titles() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start justify-end min-h-px min-w-px relative shrink-0 w-[94.683px]" data-name="Titles">
      <Frame7 />
    </div>
  );
}

function Content() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.221px] inset-[0_1.26%_0.05%_1.82%] items-start justify-end px-[12.885px] py-[10px]" data-name="Content" style={{ backgroundImage: "linear-gradient(0.40426deg, rgba(30, 30, 30, 0.6) 8.3907%, rgba(30, 30, 30, 0) 69.369%)" }}>
      <Frame5 />
      <Titles />
    </div>
  );
}

function ItemText() {
  return (
    <div className="absolute h-[165.084px] left-[calc(50%-0.46px)] top-0 translate-x-[-50%] w-[165.085px]" data-name="Item-text-1">
      <div className="absolute aspect-[160/165] left-[1.82%] right-[1.26%] top-0" data-name="image 1663">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1663} />
      </div>
      <Content />
    </div>
  );
}

function Item() {
  return (
    <div className="h-[165px] overflow-clip relative rounded-[12.885px] shrink-0 w-[160px]" data-name="item">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[12.885px] size-full" src={imgItem} />
      <ItemText />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[15px] items-center relative shrink-0 w-full">
      {[...Array(2).keys()].map((_, i) => (
        <Item key={i} />
      ))}
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[20px] top-[291px] w-[335px]">
      {[...Array(5).keys()].map((_, i) => (
        <Frame8 key={i} />
      ))}
    </div>
  );
}

function MagnifyingGlassGlassSearchMagnifying() {
  return (
    <div className="absolute inset-[3.61%_3.56%_3.5%_3.6%]" data-name="magnifying-glass--glass-search-magnifying">
      <div className="absolute inset-[-4.47%_-4.5%_-4.49%_-4.49%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2139 18.2168">
          <g id="magnifying-glass--glass-search-magnifying">
            <path d={svgPaths.pb8d780} id="Vector" stroke="var(--stroke-0, #3C3C43)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
            <path d={svgPaths.p1b5fdd80} id="Vector_2" stroke="var(--stroke-0, #3C3C43)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MagnifyingGlassGlassSearchMagnifying1() {
  return (
    <div className="absolute left-[5px] overflow-clip size-[18px] top-[5px]" data-name="magnifying-glass--glass-search-magnifying">
      <MagnifyingGlassGlassSearchMagnifying />
    </div>
  );
}

function CocoBoldHome() {
  return <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Home" />;
}

function SfSymbol() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="SF Symbol">
      <MagnifyingGlassGlassSearchMagnifying1 />
      <CocoBoldHome />
    </div>
  );
}

function Content1() {
  return (
    <div className="bg-[rgba(250,250,250,0.93)] h-[36px] relative rounded-[10px] shrink-0 w-full" data-name="content                                                                                                                                                                                                                         &">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <SfSymbol />
          <p className="font-['Toss Product Sans:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(60,60,67,0.6)] text-nowrap tracking-[-0.408px]">Search your interest area</p>
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full" data-name="& SearchBar">
      <Content1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[335px]">
      <SearchBar />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[76px] items-start left-px p-[16px] top-[215px] w-[375px]">
      <Frame2 />
    </div>
  );
}

function ArrowBackIos() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="arrow_back_ios">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow_back_ios">
          <path d={svgPaths.pf93b000} fill="var(--fill-0, white)" id="Vector" />
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
    <div className="bg-[#020202] content-stretch flex h-[54px] items-center justify-between px-[16px] py-0 relative w-[375px]" data-name="top">
      <ArrowBackIos />
      <Tune />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="1447">
      <div className="absolute aspect-[184/273] left-0 right-[-0.17%] top-[-205px]" data-name="image 1662">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1662} />
      </div>
      <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0)] inset-[3.56%_0_69.97%_0] to-[89.115%] to-white" data-name="Gradient" />
      <div className="absolute flex inset-[4.58%_0_73.11%_0] items-center justify-center">
        <div className="flex-none h-[263px] rotate-[180deg] w-[375px]">
          <div className="bg-gradient-to-b from-[rgba(0,0,0,0)] relative size-full to-black" data-name="Gradient">
            <div aria-hidden="true" className="absolute border-0 border-[rgba(216,216,216,0)] border-solid inset-0 pointer-events-none" />
          </div>
        </div>
      </div>
      <Frame1 />
      <Frame9 />
      <Frame4 />
      <div className="absolute flex h-[54px] items-center justify-center left-0 top-0 w-[375px]">
        <div className="flex-none scale-y-[-100%]">
          <Top />
        </div>
      </div>
    </div>
  );
}