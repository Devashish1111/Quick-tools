interface AdSlotProps {
  id: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdSlot({ id, label = 'Advertisement', className = '', style }: AdSlotProps) {
  return (
    <div
      id={id}
      className={`ad-slot ${className}`}
      style={style}
    >
      <span>{label}</span>
    </div>
  );
}