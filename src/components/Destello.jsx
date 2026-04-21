export default function Destello({ size = 16, color = "#CAA150", style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <path d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z" />
    </svg>
  );
}
