import { hotspotClass, hotspotProps } from '../hotspot';
import { P } from '../palette';

// Shared interactive SVG primitives. All take an `io` object:
// { hoveredId, selectedId, lensOn, onHover(id|null), onSelect(id) }
// Hover/selection/keyboard behaviour comes from ../hotspot.

export function Box({
  id, io, x, y, w, h, label, fill = P.boxFill, stroke = P.boxStroke,
  rx = 8, dashed = false, fontSize = 12, textFill = P.boxText, bold = false,
}) {
  const lines = Array.isArray(label) ? label : [label];
  const lineH = fontSize * 1.25;
  const startY = y + h / 2 - ((lines.length - 1) * lineH) / 2;
  return (
    <g className={hotspotClass(id, io)} {...hotspotProps(id, io)}>
      <rect
        x={x} y={y} width={w} height={h} rx={rx}
        fill={fill} stroke={stroke} strokeWidth={1.4}
        strokeDasharray={dashed ? '5 4' : 'none'}
      />
      {lines.map((line, i) => (
        <text
          key={i} x={x + w / 2} y={startY + i * lineH}
          textAnchor="middle" dominantBaseline="central"
          fontSize={fontSize} fill={textFill}
          fontWeight={bold ? 700 : 500}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export function Circ({
  id, io, cx, cy, r = 13, label, fill = P.boxFill, stroke = P.boxStroke,
  fontSize = 13, textFill = P.boxText, italic = false,
}) {
  return (
    <g className={hotspotClass(id, io)} {...hotspotProps(id, io)}>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <text
        x={cx} y={cy + 0.5} textAnchor="middle" dominantBaseline="central"
        fontSize={fontSize} fill={textFill} fontWeight={600}
        fontStyle={italic ? 'italic' : 'normal'}
      >
        {label}
      </text>
    </g>
  );
}

// Simple arrow: straight segments through points [[x,y],...], arrowhead at end.
export function Arrow({ points, stroke = P.arrow, width = 1.5, marker = true, dashed = false }) {
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  return (
    <path
      d={d} fill="none" stroke={stroke} strokeWidth={width}
      strokeDasharray={dashed ? '4 3' : 'none'}
      markerEnd={marker ? 'url(#arrow)' : 'none'}
      aria-hidden="true"
    />
  );
}

export function ClickableLabel({
  id, io, x, y, lines, fontSize = 12, fill = P.labelSoft, bold = false, anchor = 'start',
}) {
  const arr = Array.isArray(lines) ? lines : [lines];
  return (
    <g className={hotspotClass(id, io)} {...hotspotProps(id, io)}>
      {arr.map((line, i) => (
        <text
          key={i} x={x} y={y + i * fontSize * 1.3} textAnchor={anchor}
          fontSize={fontSize} fill={fill} fontWeight={bold ? 700 : 500}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export function Defs() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={P.arrow} />
      </marker>
      <marker id="arrow-pink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={P.pink} />
      </marker>
    </defs>
  );
}
