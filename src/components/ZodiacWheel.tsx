import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { ZODIAC_WHEEL_ORDER, ZODIAC_WHEEL_COLORS, ZODIAC_MAP } from '../constants/zodiac';
import { CELL_SALT_MAP } from '../constants/cellSalts';
import { useTheme } from '../utils/useTheme';
import { SPACING, FONT_SIZES } from '../constants/theme';
import { ZodiacId } from '../types';

interface ZodiacWheelProps {
  /** Highlighted sign (e.g. the user's sun sign) */
  selectedSignId?: ZodiacId;
  /** Fired when a wedge or the center is tapped */
  onSelectSign: (signId: ZodiacId) => void;
  /** Fired when the center hub is tapped and no sign is highlighted */
  onPressCenter?: () => void;
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (Math.PI / 180) * angleDeg;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function wedgePath(cx: number, cy: number, rIn: number, rOut: number, a0: number, a1: number): string {
  const outerStart = polarToCartesian(cx, cy, rOut, a0);
  const outerEnd = polarToCartesian(cx, cy, rOut, a1);
  const innerEnd = polarToCartesian(cx, cy, rIn, a1);
  const innerStart = polarToCartesian(cx, cy, rIn, a0);
  const largeArc = a1 - a0 > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOut} ${rOut} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${rIn} ${rIn} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

/**
 * A circular zodiac wheel — 12 wedges, one per sign, each labeled with its
 * glyph, name, and ruling cell salt. Oriented like the classic
 * "Astro-Chemico-Physiological and Chromatic Chart": Capricorn at the top,
 * running clockwise so Aries lands at the left, Cancer at the bottom, and
 * Libra at the right. Each wedge is tappable.
 */
export function ZodiacWheel({ selectedSignId, onSelectSign, onPressCenter, size }: ZodiacWheelProps) {
  const { colors, isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const wheelSize = size ?? Math.min(screenWidth - SPACING.lg * 2 - SPACING.md * 2, 380);
  const cx = wheelSize / 2;
  const cy = wheelSize / 2;
  const outerR = wheelSize / 2 - 6;
  const innerR = outerR * 0.5;

  const wedges = useMemo(
    () =>
      ZODIAC_WHEEL_ORDER.map((id, index) => {
        const sign = ZODIAC_MAP[id];
        const salt = CELL_SALT_MAP[sign.cellSaltId];
        const centerAngle = index * 30;
        const a0 = centerAngle - 15;
        const a1 = centerAngle + 15;
        const flip = centerAngle > 90 && centerAngle < 270 ? 180 : 0;
        const totalRotation = centerAngle + flip;

        const glyphR = outerR - outerR * 0.14;
        const nameR = outerR - outerR * 0.26;
        const saltR = innerR + innerR * 0.32;

        const glyphPt = polarToCartesian(cx, cy, glyphR, centerAngle);
        const namePt = polarToCartesian(cx, cy, nameR, centerAngle);
        const saltPt = polarToCartesian(cx, cy, saltR, centerAngle);

        return {
          id,
          sign,
          salt,
          path: wedgePath(cx, cy, innerR, outerR, a0, a1),
          color: ZODIAC_WHEEL_COLORS[id],
          totalRotation,
          glyphPt,
          namePt,
          saltPt,
          isSelected: id === selectedSignId,
        };
      }),
    [cx, cy, outerR, innerR, selectedSignId]
  );

  const centerSign = selectedSignId ? ZODIAC_MAP[selectedSignId] : undefined;
  const centerSalt = centerSign ? CELL_SALT_MAP[centerSign.cellSaltId] : undefined;

  return (
    <View style={styles.wrap}>
      <Svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
        <Circle cx={cx} cy={cy} r={outerR + 3} fill={colors.glassFillStrong} />

        {wedges.map((w) => (
          <Path
            key={w.id}
            d={w.path}
            fill={w.color}
            fillOpacity={w.isSelected ? 1 : isDark ? 0.82 : 0.88}
            stroke={w.isSelected ? colors.gold : colors.background}
            strokeWidth={w.isSelected ? 3 : 1.5}
            onPress={() => onSelectSign(w.id)}
          />
        ))}

        {wedges.map((w) => (
          <React.Fragment key={`${w.id}-labels`}>
            <SvgText
              x={w.glyphPt.x}
              y={w.glyphPt.y}
              fontSize={outerR * 0.15}
              fill="#FFFFFF"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(${w.totalRotation} ${w.glyphPt.x} ${w.glyphPt.y})`}
              onPress={() => onSelectSign(w.id)}
            >
              {w.sign.symbol}
            </SvgText>
            <SvgText
              x={w.namePt.x}
              y={w.namePt.y}
              fontSize={Math.max(9, outerR * 0.072)}
              fontWeight="700"
              fill="#FFFFFF"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(${w.totalRotation} ${w.namePt.x} ${w.namePt.y})`}
              onPress={() => onSelectSign(w.id)}
            >
              {w.sign.name}
            </SvgText>
            <SvgText
              x={w.saltPt.x}
              y={w.saltPt.y}
              fontSize={Math.max(8, outerR * 0.062)}
              fontWeight="700"
              fill="#12163A"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(${w.totalRotation} ${w.saltPt.x} ${w.saltPt.y})`}
              onPress={() => onSelectSign(w.id)}
            >
              {w.salt.commonName}
            </SvgText>
          </React.Fragment>
        ))}

        <Circle
          cx={cx}
          cy={cy}
          r={innerR - 4}
          fill={colors.card}
          stroke={colors.gold}
          strokeWidth={2}
          onPress={() => (centerSign ? onSelectSign(centerSign.id) : onPressCenter?.())}
        />
        {centerSign && centerSalt ? (
          <>
            <SvgText
              x={cx}
              y={cy - innerR * 0.18}
              fontSize={innerR * 0.34}
              fill={colors.gold}
              textAnchor="middle"
              alignmentBaseline="middle"
              onPress={() => onSelectSign(centerSign.id)}
            >
              {centerSign.symbol}
            </SvgText>
            <SvgText
              x={cx}
              y={cy + innerR * 0.32}
              fontSize={Math.max(10, innerR * 0.15)}
              fontWeight="700"
              fill={colors.text}
              textAnchor="middle"
              alignmentBaseline="middle"
              onPress={() => onSelectSign(centerSign.id)}
            >
              {centerSalt.commonName}
            </SvgText>
          </>
        ) : (
          <SvgText
            x={cx}
            y={cy}
            fontSize={Math.max(12, innerR * 0.16)}
            fontWeight="700"
            fill={colors.gold}
            textAnchor="middle"
            alignmentBaseline="middle"
            onPress={onPressCenter}
          >
            Cell Salts
          </SvgText>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
