export default function FernDivider() {
  return (
    <div className="flex justify-center py-12 opacity-35 select-none pointer-events-none">
      <svg
        width="260"
        height="44"
        viewBox="0 0 260 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#7a6040"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        {/* Main stem */}
        <path d="M10 22C40 17 80 27 130 22C180 17 220 27 250 22" />
        {/* Left fronds */}
        <path d="M40 20C42 13 46 10 50 13" />
        <path d="M32 22C30 28 27 30 24 28" />
        <path d="M70 24C72 30 76 32 80 29" />
        <path d="M60 20C58 13 55 11 52 14" />
        {/* Center fronds */}
        <path d="M100 20C102 13 106 10 110 13" />
        <path d="M120 24C122 30 126 32 130 29" />
        <path d="M110 22C108 28 105 30 102 27" />
        {/* Right fronds */}
        <path d="M150 20C152 13 156 10 160 13" />
        <path d="M170 24C172 30 176 32 180 29" />
        <path d="M190 20C188 14 185 12 182 15" />
        <path d="M210 22C212 28 215 30 218 27" />
        {/* Small leaf tips */}
        <path d="M50 13C52 10 54 10 55 12" strokeWidth="0.9" />
        <path d="M110 13C112 10 114 10 115 12" strokeWidth="0.9" />
        <path d="M160 13C162 10 164 10 165 12" strokeWidth="0.9" />
      </svg>
    </div>
  );
}
