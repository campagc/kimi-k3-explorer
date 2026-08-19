import { memo } from 'react';
import { Box, Circ, Arrow, ClickableLabel, Defs } from './primitives';
import { hotspotClass, hotspotProps } from '../hotspot';
import { P } from '../palette';

const { pink: PINK, pinkFill: PINK_FILL } = P;

// The page <h1> already names the model, so the figure's own title is dropped
// here — one heading, not two.
//
// The viewBox is trimmed to the content bounds (rightmost element is the stack
// at x=590). The original 720×1160 box padded ~115 units of dead space on the
// right, which shrank the whole figure inside its column.
function MainDiagram({ io }) {
  return (
    <svg
      viewBox="0 6 604 1132"
      className="diagram main-diagram"
      role="group"
      aria-label="Kimi K3 full architecture. Interactive: focus a component and press Enter for details."
      onClick={() => io.onSelect(null)}
    >
      <Defs />

      {/* ===== Transformer stack container ===== */}
      <g className={hotspotClass('transformer-stack', io)} {...hotspotProps('transformer-stack', io)}>
        <rect
          x={170} y={230} width={420} height={730} rx={36}
          fill={P.stackFill} stroke={P.stackStroke} strokeWidth={1.5}
        />
      </g>
      {/* one layer (green) — decorative, inherits stack hotspot visually */}
      <rect
        x={228} y={288} width={334} height={592} rx={26}
        fill={P.layerFill} stroke={P.layerStroke} strokeWidth={1.5}
        pointerEvents="none" aria-hidden="true"
      />

      {/* ===== Bottom: input pipeline ===== */}
      <Box id="tokenized-text" io={io} x={280} y={1090} w={180} h={36} label="Tokenized text" />
      <Box id="token-embedding" io={io} x={250} y={1005} w={240} h={40} label="Token embedding layer" />
      <Arrow points={[[370, 1090], [370, 1049]]} />
      <Arrow points={[[370, 1005], [370, 828]]} />
      <text x={370} y={975} textAnchor="middle" fontSize={12} fill={P.labelSoft} fontStyle="italic" pointerEvents="none">
        (Vision component not shown)
      </text>

      {/* ===== Attn sublayer ===== */}
      <Box id="attn-sublayer" io={io} x={255} y={648} w={230} h={196} label="" fill={P.attnSublayerFill} stroke={PINK} dashed rx={10} />
      {/* Above the dashed box, matching the FFN sublayer label's placement */}
      <text x={268} y={641} fontSize={13} fill={PINK} fontWeight={700} pointerEvents="none">Attn sublayer</text>
      <Box id="rmsnorm-1" io={io} x={285} y={790} w={170} h={34} label="RMSNorm 1" />
      <Box id="kda-mla-block" io={io} x={268} y={690} w={204} h={56} rx={10}
        label={['Kimi Delta Attn or', 'Multi-head Latent Attn']}
        fill={P.heroFill} stroke={P.heroStroke} textFill={P.heroText} />
      <Arrow points={[[370, 790], [370, 750]]} />
      <Arrow points={[[370, 690], [370, 630]]} />

      {/* NoPE — 176/48 rather than 172/56 so it clears both the stack's left
          edge and the layer box instead of sitting on their strokes. */}
      <Box id="nope" io={io} x={176} y={702} w={48} h={28} label="NoPE" rx={14} />
      <Arrow points={[[224, 716], [264, 716]]} />

      {/* current group sum */}
      <Circ id="current-group-sum" io={io} cx={370} cy={614} label="+" />
      <text x={392} y={580} fontSize={12} fill={PINK} fontWeight={600} pointerEvents="none">Current</text>
      <text x={392} y={594} fontSize={12} fill={PINK} fontWeight={600} pointerEvents="none">group sum</text>
      {/* residual bypass around attention */}
      <Arrow points={[[370, 862], [508, 862], [508, 614], [387, 614]]} width={1.3} />
      <Arrow points={[[370, 601], [370, 534]]} />

      {/* ===== FFN sublayer ===== */}
      <Box id="ffn-sublayer" io={io} x={255} y={382} w={230} h={152} label="" fill={P.ffnSublayerFill} stroke={PINK} dashed rx={10} />
      <text x={268} y={375} fontSize={13} fill={PINK} fontWeight={700} pointerEvents="none">FFN / MoE sublayer</text>
      <Box id="rmsnorm-2" io={io} x={285} y={482} w={170} h={34} label="RMSNorm 2" />
      <Box id="ffn-latentmoe" io={io} x={275} y={412} w={190} h={40} label="FFN / LatentMoE" />
      <Arrow points={[[370, 482], [370, 456]]} />
      <Arrow points={[[370, 412], [370, 352]]} />

      {/* updated group sum */}
      <Circ id="updated-group-sum" io={io} cx={370} cy={336} label="+" />
      <text x={392} y={302} fontSize={12} fill={PINK} fontWeight={600} pointerEvents="none">Updated</text>
      <text x={392} y={316} fontSize={12} fill={PINK} fontWeight={600} pointerEvents="none">group sum</text>
      {/* residual bypass around FFN */}
      <Arrow points={[[370, 580], [530, 580], [530, 336], [387, 336]]} width={1.3} />
      <Arrow points={[[370, 323], [370, 210]]} />

      {/* ===== w / alpha gates ===== */}
      <Circ id="w-alpha" io={io} cx={232} cy={452} r={12} label="w" italic />
      <Circ id="w-alpha" io={io} cx={232} cy={500} r={12} label="α" italic stroke={PINK} textFill={PINK} />
      <Circ id="w-alpha" io={io} cx={232} cy={772} r={12} label="w" italic />
      <Circ id="w-alpha" io={io} cx={232} cy={820} r={12} label="α" italic stroke={PINK} textFill={PINK} />
      <Arrow points={[[244, 500], [285, 500]]} stroke={PINK} marker={false} />
      <Arrow points={[[244, 820], [285, 810]]} stroke={PINK} marker={false} />

      {/* ===== Depth sources ===== */}
      <Box id="depth-sources" io={io} x={18} y={380} w={144} h={158} label="" rx={10} />
      <text x={90} y={402} textAnchor="middle" fontSize={13} fontWeight={700} fill={P.labelStrong} pointerEvents="none">
        Depth sources
      </text>
      <Box id="depth-embedding" io={io} x={30} y={418} w={120} h={32} label="Embedding" fill={PINK_FILL} stroke={PINK} />
      <Box id="depth-earlier-blocks" io={io} x={30} y={462} w={120} h={48} label={['Earlier block', 'summaries']} fill={PINK_FILL} stroke={PINK} />
      {/* pink routing: depth sources -> w/alpha gates and final AttnRes */}
      <Arrow points={[[162, 470], [200, 470], [200, 500], [219, 500]]} stroke={PINK} marker={false} />
      <Arrow points={[[200, 500], [200, 820], [219, 820]]} stroke={PINK} marker={false} />
      <Arrow points={[[90, 380], [90, 188], [246, 188]]} stroke={PINK} width={1.6} />
      {/* embedding feed from token embedding layer — runs at x=30 so it stays
          clear of the two left-hand annotations, which start at x=44 */}
      <Arrow points={[[250, 1025], [30, 1025], [30, 538]]} stroke={PINK} marker={false} width={1.3} />

      {/* ===== Top: output pipeline ===== */}
      <Box id="final-block-attnres" io={io} x={250} y={172} w={240} h={38} label="Final Block AttnRes" fill={PINK_FILL} stroke={PINK} />
      <Box id="final-rmsnorm" io={io} x={260} y={112} w={220} h={36} label="Final RMSNorm" />
      <Box id="linear-output" io={io} x={250} y={52} w={240} h={36} label="Linear output layer" />
      <Arrow points={[[370, 172], [370, 152]]} />
      <Arrow points={[[370, 112], [370, 92]]} />
      <Arrow points={[[370, 52], [370, 18]]} />

      {/* ===== Annotations ===== */}
      <ClickableLabel id="transformer-stack" io={io} x={186} y={912} lines="93 ×" fontSize={22} bold fill={P.teal} />
      <ClickableLabel
        id="transformer-stack" io={io} x={384} y={912}
        lines={['8 AttnRes blocks', '7 × 12 layers + one 9-layer block']}
        fontSize={12} fill={PINK}
      />
      {/* Three lines, as in the reference figure: two lines at this size
          overrun the transformer stack's left edge. */}
      <ClickableLabel
        id="context-length" io={io} x={44} y={862}
        lines={['Supported', 'context length', 'of 1M tokens']}
        fontSize={15} bold fill={P.labelStrong}
      />
      <Arrow points={[[120, 838], [200, 766], [200, 730]]} dashed width={1.2} marker={false} stroke={P.arrowSoft} />
      <ClickableLabel
        id="layer-ratio" io={io} x={44} y={1000}
        lines={['Layer 1 dense,', 'layers 2–93 LatentMoE']}
        fontSize={14} bold fill={P.labelStrong}
      />
    </svg>
  );
}

export default memo(MainDiagram);
