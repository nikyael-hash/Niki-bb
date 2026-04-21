export default function Bubble({ emoji, color, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}18`, border: `2px solid ${color}50`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.44, flexShrink: 0,
    }}>
      {emoji}
    </div>
  );
}
