import Svg, { Circle, G, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { traitLabels } from '@/data/archetypes';
import { colors, fonts } from '@/theme';
import { TRAITS, type TraitVector } from '@/types';

type Props = { scores: TraitVector; size?: number };

/** Six-axis "Psychological Matrix" radar. */
export function RadarChart({ scores, size = 180 }: Props) {
  const pad = 34;
  const r = size / 2 - pad;
  const c = size / 2;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / TRAITS.length;
  const point = (i: number, value: number) => {
    const a = angle(i);
    return [c + Math.cos(a) * r * value, c + Math.sin(a) * r * value] as const;
  };
  const ring = (v: number) => TRAITS.map((_, i) => point(i, v).join(',')).join(' ');
  const shape = TRAITS.map((t, i) => point(i, scores[t] / 100).join(',')).join(' ');

  return (
    <Svg width={size} height={size} accessibilityLabel="Psychological matrix radar chart">
      <G>
        {[0.25, 0.5, 0.75, 1].map((v) => (
          <Polygon key={v} points={ring(v)} fill="none" stroke={colors.borderStrong} strokeWidth={0.8} />
        ))}
        {TRAITS.map((_, i) => {
          const [x, y] = point(i, 1);
          return <Line key={i} x1={c} y1={c} x2={x} y2={y} stroke={colors.border} strokeWidth={0.8} />;
        })}
        <Polygon points={shape} fill={colors.primary} fillOpacity={0.35} stroke={colors.primaryBright} strokeWidth={1.5} />
        {TRAITS.map((t, i) => {
          const [x, y] = point(i, scores[t] / 100);
          return <Circle key={t} cx={x} cy={y} r={2.2} fill={colors.primaryBright} />;
        })}
        {TRAITS.map((t, i) => {
          // Centered on the axis tip so side labels ("Courage", "Empathy") stay inside the SVG.
          const [x, y] = point(i, 1.36);
          return (
            <SvgText
              key={t}
              x={x}
              y={y + 3}
              fontSize={8.5}
              fontFamily={fonts.medium}
              fill={colors.textSecondary}
              textAnchor="middle"
            >
              {traitLabels[t]}
            </SvgText>
          );
        })}
      </G>
    </Svg>
  );
}
