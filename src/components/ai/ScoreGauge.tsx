'use client';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export function ScoreGauge({ score, size = 160, label }: ScoreGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  const getColor = (s: number) => {
    if (s >= 70) return '#22C55E';
    if (s >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-muted"
          strokeWidth="10"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-all duration-1000"
        />
        {/* Score text */}
        <text
          x={center}
          y={center - 5}
          textAnchor="middle"
          className="fill-foreground text-3xl font-bold"
          fontSize="32"
        >
          {score}
        </text>
        <text
          x={center}
          y={center + 18}
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
          fontSize="12"
        >
          / 100
        </text>
      </svg>
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
}
