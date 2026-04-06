export default function OakDivider() {
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
        strokeWidth="1.2"
      >
        {/* Main horizontal branch */}
        <path d="M20 22H240" strokeWidth="1" />
        {/* Oak leaves — left cluster */}
        <path d="M55 22C55 10 68 5 73 15" strokeWidth="1.1" />
        <path d="M73 15C76 8 82 6 84 14" strokeWidth="1.1" />
        <circle cx="78" cy="11" r="2.2" fill="#7a6040" stroke="none" />
        {/* Oak leaves — center cluster */}
        <path d="M118 22C118 32 131 37 136 27" strokeWidth="1.1" />
        <path d="M136 27C139 34 145 36 147 28" strokeWidth="1.1" />
        <circle cx="141" cy="33" r="2.2" fill="#7a6040" stroke="none" />
        {/* Oak leaves — right cluster */}
        <path d="M185 22C185 10 198 5 203 15" strokeWidth="1.1" />
        <path d="M203 15C206 8 212 6 214 14" strokeWidth="1.1" />
        <circle cx="208" cy="11" r="2.2" fill="#7a6040" stroke="none" />
        {/* Small acorn left */}
        <circle cx="55" cy="22" r="3" fill="none" stroke="#7a6040" strokeWidth="1" />
        <path d="M52 20 Q55 18 58 20" strokeWidth="1" />
        {/* Small acorn right */}
        <circle cx="210" cy="22" r="3" fill="none" stroke="#7a6040" strokeWidth="1" />
        <path d="M207 20 Q210 18 213 20" strokeWidth="1" />
      </svg>
    </div>
  );
}
