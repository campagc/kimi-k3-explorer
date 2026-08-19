// Diagram palette: every color used inside the SVG diagrams lives here, so the
// two diagram modules can't drift apart. The app chrome uses the CSS custom
// properties in App.css; these literals are the SVG-only counterpart (SVG
// presentation attributes can't read those tokens without a var() indirection
// that bought us nothing).

export const P = {
  // Default box / circle
  boxFill: '#ffffff',
  boxStroke: '#4a453e',
  boxText: '#1c1a17',

  // Utility boxes ("Linear", "RMSNorm" in the insets)
  grayFill: '#dcdad5',

  // Text labels
  labelStrong: '#1c1a17',
  labelSoft: '#5c564d',

  // Arrows & connector lines
  arrow: '#4a453e',
  arrowSoft: '#6b6459',

  // Brand accents
  teal: '#177260',
  pink: '#d64d7f',
  // Two pink fills on purpose: the main diagram tints large "Depth sources"
  // boxes, the insets flood-fill small hero blocks (see the reference figure).
  pinkFill: '#f9d3e0',
  pinkStrong: '#f492bc',

  // Transformer stack container + single layer
  stackFill: '#e2e2e2',
  stackStroke: '#b5b5b5',
  layerFill: '#8fbfae',
  layerStroke: '#6ea391',

  // Hero block (KDA / MLA selector inside the attn sublayer)
  heroFill: '#4a4a4a',
  heroStroke: '#333333',
  heroText: '#ffffff',

  // Dashed sublayer grouping boxes
  attnSublayerFill: '#eaf4ef',
  ffnSublayerFill: '#eef7f2',
  insetBorder: '#333333',

  // KDA inset special blocks
  goldFill: '#f6f0c0',
  goldStroke: '#c9b458',
  yellowFill: '#f2d258',
  yellowStroke: '#b89a26',
  orangeFill: '#f0876a',
  orangeStroke: '#c25a3c',
};
