export default function WheatDivider() {
  const stalks = [38, 72, 106, 130, 154, 188, 222];
  return (
    <div className="flex justify-center py-12 opacity-35 select-none pointer-events-none">
      <svg
        width="260"
        height="44"
        viewBox="0 0 260 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#7a6040"
        strokeLinecap="round"
        strokeWidth="1.1"
      >
        {/* Curved baseline */}
        <path d="M10 26 Q 65 20 130 26 Q 195 32 250 26" strokeWidth="1" />
        {/* Wheat stalks with grain heads */}
        {stalks.map((x, i) => {
          const yBase = i % 2 === 0 ? 26 : 27;
          const yTop = yBase - 14;
          return (
            <g key={x}>
              {/* Stalk */}
              <path d={`M${x} ${yBase} L${x} ${yTop}`} />
              {/* Left grain */}
              <path d={`M${x} ${yTop + 3} L${x - 5} ${yTop - 3}`} />
              {/* Right grain */}
              <path d={`M${x} ${yTop + 3} L${x + 5} ${yTop - 3}`} />
              {/* Tip */}
              <path d={`M${x} ${yTop} L${x} ${yTop - 4}`} strokeWidth="0.9" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
