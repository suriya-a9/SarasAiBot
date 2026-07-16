export default function Avatar3D({ size = 40, ring = false }) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full ${ring ? "ring-2 ring-white/50" : ""}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <radialGradient id="avatarBg" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#E8EEFF" />
            <stop offset="100%" stopColor="#C7D6FB" />
          </radialGradient>
          <radialGradient id="skinGrad" cx="38%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#F2C39B" />
            <stop offset="100%" stopColor="#C98A5C" />
          </radialGradient>
          <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2FBFA3" />
            <stop offset="100%" stopColor="#14806B" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A2320" />
            <stop offset="100%" stopColor="#100D0B" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="50" fill="url(#avatarBg)" />
        <path d="M8,100 Q50,62 92,100 Z" fill="url(#shirtGrad)" />
        <path d="M8,100 Q50,66 92,100 L92,92 Q50,58 8,92 Z" fill="#0B5C4C" opacity="0.35" />
        <path d="M46,72 L50,86 L54,72 Z" fill="#0B5C4C" opacity="0.5" />
        <rect x="41" y="55" width="18" height="15" fill="#E2A876" />
        <rect x="41" y="55" width="18" height="6" fill="#D19563" opacity="0.6" />
        <ellipse cx="50" cy="42" rx="20" ry="22" fill="url(#skinGrad)" />
        <ellipse cx="29.5" cy="43" rx="3" ry="4.6" fill="#E2A876" />
        <ellipse cx="70.5" cy="43" rx="3" ry="4.6" fill="#E2A876" />
        <path d="M30,32 Q28,14 50,13 Q72,14 70,32 Q70,24 50,23 Q30,24 30,32 Z" fill="url(#hairGrad)" />
        <path d="M30,32 Q29,36 31,40 Q28,34 29.5,27 Z" fill="url(#hairGrad)" opacity="0.9" />
        <path d="M70,32 Q71,36 69,40 Q72,34 70.5,27 Z" fill="url(#hairGrad)" opacity="0.9" />
        <path d="M32,46 Q35,58 50,61 Q65,58 68,46 Q65,56 50,58 Q35,56 32,46 Z" fill="#2A2320" opacity="0.18" />
        <rect x="37.5" y="39" width="8" height="2" rx="1" fill="#2A2320" />
        <rect x="54.5" y="39" width="8" height="2" rx="1" fill="#2A2320" />
        <circle cx="42" cy="43" r="2.4" fill="#20304A" />
        <circle cx="58" cy="43" r="2.4" fill="#20304A" />
        <path d="M42,50 Q50,56 58,50" stroke="#8A4B32" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M27,38 Q27,15 50,15 Q73,15 73,38" stroke="#1E2530" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <rect x="24" y="37" width="6" height="10" rx="3" fill="#1E2530" />
        <rect x="70" y="37" width="6" height="10" rx="3" fill="#1E2530" />
        <path d="M73,42 Q80,44 78,54 Q77,58 71,58" stroke="#1E2530" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="71" cy="58" r="2.2" fill="#1E2530" />
        <ellipse cx="39" cy="32" rx="7" ry="4" fill="#FFFFFF" opacity="0.2" />
      </svg>
    </div>
  );
}
