import { memo } from 'react';
import { Box, Circ, Arrow, ClickableLabel, Defs } from './primitives';
import { P } from '../palette';

const { pink: PINK, pinkStrong: PINK_FILL } = P;

// Both insets use a 520-wide viewBox around a 452-wide dashed frame: the
// sigmoid gate label sits outside the frame, as in the reference figure.
// Placed inside, it lands on top of the gate's own arrow.
function Mla({ io }) {
  return (
    <svg
      viewBox="0 0 520 420"
      className="diagram inset-diagram"
      role="group"
      aria-label="Gated Multi-head Latent Attention internals"
      onClick={() => io.onSelect(null)}
    >
      <Defs />
      <rect
        x={8} y={8} width={444} height={404} rx={18} fill="none"
        stroke={P.insetBorder} strokeWidth={1.5} strokeDasharray="3 4" aria-hidden="true"
      />

      {/* output path */}
      <Box id="mla-out" io={io} x={165} y={26} w={110} h={30} label="Linear" fill={P.grayFill} />
      <Circ id="mla-gate" io={io} cx={220} cy={92} r={14} label="⊗" fontSize={15} />
      <Arrow points={[[220, 78], [220, 56]]} />

      {/* MLA core */}
      <Box id="mla-overview" io={io} x={80} y={130} w={280} h={36} label="Multi-head latent attention" fill={PINK_FILL} stroke={PINK} bold />
      <Arrow points={[[220, 130], [220, 106]]} />

      {/* Q / K / V labels */}
      <text x={93} y={188} fontSize={15} fontWeight={700} fill={P.labelStrong} pointerEvents="none">Q</text>
      <text x={201} y={188} fontSize={15} fontWeight={700} fill={P.labelStrong} pointerEvents="none">K</text>
      <text x={338} y={188} fontSize={15} fontWeight={700} fill={P.labelStrong} pointerEvents="none">V</text>

      {/* Q path */}
      <text x={14} y={222} fontSize={12} fontWeight={600} fill={P.labelSoft} pointerEvents="none">QKNorm</text>
      <Box id="mla-qknorm" io={io} x={72} y={204} w={82} h={26} label="RMSNorm" fill={P.grayFill} fontSize={11} />
      <Box id="mla-qkv" io={io} x={72} y={330} w={82} h={28} label="Linear" fill={P.grayFill} />
      <Arrow points={[[113, 330], [113, 230]]} />
      <Arrow points={[[113, 204], [113, 166]]} />

      {/* K path */}
      <Box id="mla-qknorm" io={io} x={182} y={196} w={82} h={24} label="RMSNorm" fill={P.grayFill} fontSize={11} />
      <Box id="mla-qkv" io={io} x={182} y={230} w={82} h={26} label="Linear" fill={P.grayFill} />
      <Box id="mla-latent" io={io} x={172} y={286} w={100} h={30} label="Latent" fill={PINK_FILL} stroke={PINK} bold />
      <Box id="mla-qkv" io={io} x={182} y={330} w={82} h={28} label="Linear" fill={P.grayFill} />
      <Arrow points={[[223, 330], [223, 316]]} />
      <Arrow points={[[223, 286], [223, 256]]} />
      <Arrow points={[[223, 230], [223, 220]]} />
      <Arrow points={[[223, 196], [223, 166]]} />

      {/* V path (from latent) */}
      <Box id="mla-qkv" io={io} x={286} y={204} w={82} h={26} label="Linear" fill={P.grayFill} />
      <Arrow points={[[272, 301], [327, 301], [327, 230]]} />
      <Arrow points={[[327, 204], [327, 166]]} />

      {/* Sigmoid gate */}
      <Circ id="mla-gate" io={io} cx={410} cy={130} r={12} label="σ" fontSize={13} />
      <ClickableLabel id="mla-gate" io={io} x={460} y={126} lines={['Sigmoid', 'Gate']} fontSize={11} />
      <Box id="mla-gate" io={io} x={369} y={330} w={82} h={28} label="Linear" fill={P.grayFill} />
      <Arrow points={[[410, 330], [410, 143]]} />
      <Arrow points={[[410, 118], [410, 92], [235, 92]]} />

      {/* shared input line */}
      <Arrow points={[[113, 392], [113, 358]]} />
      <Arrow points={[[223, 392], [223, 358]]} />
      <Arrow points={[[327, 392], [327, 316]]} />
      <Arrow points={[[410, 392], [410, 358]]} />
    </svg>
  );
}

function Kda({ io }) {
  return (
    <svg
      viewBox="0 0 520 470"
      className="diagram inset-diagram"
      role="group"
      aria-label="Kimi Delta Attention internals"
      onClick={() => io.onSelect(null)}
    >
      <Defs />
      <rect
        x={8} y={8} width={444} height={454} rx={18} fill="none"
        stroke={P.insetBorder} strokeWidth={1.5} strokeDasharray="3 4" aria-hidden="true"
      />

      {/* output path */}
      <Box id="kda-out" io={io} x={165} y={24} w={110} h={30} label="Linear" fill={P.grayFill} />
      <Circ id="kda-gate" io={io} cx={220} cy={88} r={14} label="⊗" fontSize={15} />
      <Arrow points={[[220, 74], [220, 54]]} />
      <Box id="kda-rmsnorm" io={io} x={168} y={118} w={104} h={28} label="RMSNorm" />
      <Arrow points={[[220, 118], [220, 102]]} />

      {/* delta rule */}
      <Box id="kda-delta-rule" io={io} x={75} y={168} w={290} h={34} label="Gated Delta Rule" fill={P.goldFill} stroke={P.goldStroke} bold />
      <Arrow points={[[220, 168], [220, 146]]} />

      {/* Q K path */}
      <text x={85} y={228} fontSize={14} fontWeight={700} fill={P.labelStrong} pointerEvents="none">Q</text>
      <text x={137} y={228} fontSize={14} fontWeight={700} fill={P.labelStrong} pointerEvents="none">K</text>
      <Box id="kda-l2norm" io={io} x={72} y={238} w={88} h={30} label="L2 Norm" fill={P.yellowFill} stroke={P.yellowStroke} />
      <Circ id="kda-silu" io={io} cx={116} cy={294} r={12} label="ϕ" fontSize={13} />
      <Box id="kda-conv" io={io} x={72} y={320} w={88} h={30} label="Conv" fill={P.orangeFill} stroke={P.orangeStroke} />
      <Box id="kda-in" io={io} x={72} y={378} w={88} h={28} label="Linear" fill={P.grayFill} />
      <Arrow points={[[116, 378], [116, 350]]} />
      <Arrow points={[[116, 320], [116, 306]]} />
      <Arrow points={[[116, 282], [116, 268]]} />
      <Arrow points={[[108, 238], [108, 202]]} />
      <Arrow points={[[128, 238], [128, 202]]} />

      {/* V path */}
      <text x={196} y={228} fontSize={14} fontWeight={700} fill={P.labelStrong} pointerEvents="none">V</text>
      <Circ id="kda-silu" io={io} cx={218} cy={252} r={12} label="ϕ" fontSize={13} />
      <ClickableLabel id="kda-silu" io={io} x={236} y={256} lines="SiLU" fontSize={11} />
      <Box id="kda-conv" io={io} x={176} y={320} w={84} h={30} label="Conv" fill={P.orangeFill} stroke={P.orangeStroke} />
      <Box id="kda-in" io={io} x={176} y={378} w={84} h={28} label="Linear" fill={P.grayFill} />
      <Arrow points={[[218, 378], [218, 350]]} />
      <Arrow points={[[218, 320], [218, 264]]} />
      <Arrow points={[[218, 240], [218, 202]]} />

      {/* alpha / beta */}
      <text x={270} y={230} fontSize={15} fontWeight={700} fontStyle="italic" fill={P.labelStrong} pointerEvents="none">α</text>
      <text x={332} y={230} fontSize={15} fontWeight={700} fontStyle="italic" fill={P.labelStrong} pointerEvents="none">β</text>
      <Circ id="kda-alpha-beta" io={io} cx={291} cy={300} r={11} label="σ" fontSize={12} />
      <Circ id="kda-alpha-beta" io={io} cx={321} cy={300} r={11} label="σ" fontSize={12} />
      <Box id="kda-in" io={io} x={266} y={378} w={84} h={28} label="Linear" fill={P.grayFill} />
      <Arrow points={[[291, 378], [291, 311]]} />
      <Arrow points={[[321, 378], [321, 311]]} />
      <Arrow points={[[291, 289], [291, 236]]} />
      <Arrow points={[[321, 289], [321, 236]]} />

      {/* sigmoid gate */}
      <Circ id="kda-gate" io={io} cx={408} cy={210} r={12} label="σ" fontSize={13} />
      <ClickableLabel id="kda-gate" io={io} x={460} y={206} lines={['Sigmoid', 'Gate']} fontSize={11} />
      <Box id="kda-gate" io={io} x={366} y={378} w={84} h={28} label="Linear" fill={P.grayFill} />
      <Arrow points={[[408, 378], [408, 223]]} />
      <Arrow points={[[408, 198], [408, 88], [235, 88]]} />

      {/* shared input */}
      <Arrow points={[[116, 442], [116, 406]]} />
      <Arrow points={[[218, 442], [218, 406]]} />
      <Arrow points={[[291, 442], [291, 406]]} />
      <Arrow points={[[321, 442], [321, 406]]} />
      <Arrow points={[[408, 442], [408, 406]]} />
    </svg>
  );
}

const RATIO_ROWS = [
  ['Layer 1', 'Kimi Delta Attn → MoE'],
  ['Layer 2', 'Kimi Delta Attn → MoE'],
  ['Layer 3', 'Kimi Delta Attn → MoE'],
  ['Layer 4', 'Gated Multi-head Latent Attn → MoE'],
];

function Ratio({ io }) {
  const active = io.hoveredId === 'layer-ratio' || io.selectedId === 'layer-ratio';
  return (
    <button
      type="button"
      className={`ratio-panel ${active ? 'active' : ''}`}
      aria-pressed={io.selectedId === 'layer-ratio'}
      onMouseEnter={() => io.onHover('layer-ratio')}
      onMouseLeave={() => io.onHover(null)}
      onFocus={() => io.onHover('layer-ratio')}
      onBlur={() => io.onHover(null)}
      onClick={(e) => { e.stopPropagation(); io.onSelect('layer-ratio'); }}
    >
      <span className="ratio-title">3:1 Ratio</span>
      <span className="ratio-rows">
        {RATIO_ROWS.map(([layer, blocks]) => (
          <span className="ratio-row" key={layer}>
            <span className="ratio-layer">{layer}</span>
            <span className="ratio-blocks">{blocks}</span>
          </span>
        ))}
        <span className="ratio-row ratio-more">…</span>
      </span>
    </button>
  );
}

export const MlaDiagram = memo(Mla);
export const KdaDiagram = memo(Kda);
export const RatioPanel = memo(Ratio);
