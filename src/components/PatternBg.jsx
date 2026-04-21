import { B } from '../design/tokens.js';

export default function PatternBg({ opacity = 0.05, id = "pp" }) {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, pointerEvents: "none" }}>
      <defs>
        <pattern id={id} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="18" fill="none" stroke={B.gold} strokeWidth="0.6" />
          <circle cx="0"  cy="0"  r="18" fill="none" stroke={B.gold} strokeWidth="0.6" />
          <circle cx="40" cy="0"  r="18" fill="none" stroke={B.gold} strokeWidth="0.6" />
          <circle cx="0"  cy="40" r="18" fill="none" stroke={B.gold} strokeWidth="0.6" />
          <circle cx="40" cy="40" r="18" fill="none" stroke={B.gold} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
