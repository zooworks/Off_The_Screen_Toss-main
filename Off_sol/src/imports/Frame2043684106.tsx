import svgPaths from "./svg-ivhom5rkut";

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

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[335px]">
      <p className="font-['Afacad:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[23.814px] text-black text-nowrap tracking-[-0.7442px]">OFF THE SCREEN</p>
      <BellFill />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative size-full">
      <Frame1 />
    </div>
  );
}