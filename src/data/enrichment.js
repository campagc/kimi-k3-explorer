// Extra content layers: difficulty levels, “why not the alternative”,
// and compute-cost metadata.
// Keyed by the same component ids as COMPONENTS in ./components.js.

/* ------------------------------------------------------------------ */
/* Difficulty levels: eli5 (a bright 12-year-old) and paper (ML      */
/* grad-student register). The undergrad text lives in COMPONENTS.   */
/* ------------------------------------------------------------------ */
export const LEVELS = {
  'tokenized-text': {
    eli5: `The computer can’t read words, so we chop the sentence into little pieces and give each piece a number, like turning a sentence into a secret code.`,
    paper: `Input text is segmented with a sub-word tokenizer (BPE-family) into a sequence of vocabulary indices. The vocabulary is a fixed, finite set (~10⁵ entries); the sequence length after tokenization determines the effective compute and memory cost of every downstream stage.`,
  },
  'token-embedding': {
    eli5: `Each number gets turned into a long list of values — like giving every word its own fingerprint — so the model can tell which words feel similar.`,
    paper: `Token IDs index rows of an embedding matrix E ∈ R^(V×d). The mapping is learned end-to-end; geometry in the embedding space encodes distributional semantics. In Kimi K3 the embedding output is additionally retained as a “depth source” for block-level residual re-injection.`,
  },
  'transformer-stack': {
    eli5: `The model is a tall tower of 93 identical floors. Each floor reads what the floors below wrote and adds a bit more understanding.`,
    paper: `93 pre-norm transformer layers; layer 1 is dense, layers 2–93 use sparse LatentMoE feed-forwards. Layers are grouped into 8 “AttnRes blocks” (7×12 + 1×9), across which learned convex-style combinations of depth sources are applied to counteract representation collapse in very deep stacks.`,
  },
  'attn-sublayer': {
    eli5: `This is where words get to talk to each other — each word checks all the earlier words and borrows the useful bits.`,
    paper: `The token-mixing half of a layer: RMSNorm → attention (KDA in 3 of 4 layers, MLA otherwise) → residual add. All cross-token information flow in the network happens here; everything else is position-wise.`,
  },
  'rmsnorm-1': {
    eli5: `Before the words start talking, this makes sure nobody is shouting — every list of numbers gets resized to a normal loudness.`,
    paper: `Root-mean-square normalization: x ↦ x/RMS(x) ⊙ g, with learned gain g. Omits the mean-centering of LayerNorm (no evidence it matters at scale) and is cheaper. Pre-norm placement keeps per-sublayer input statistics stationary across depth, which is essential for stable training at 93 layers / trillions of parameters.`,
  },
  'kda-mla-block': {
    eli5: `The part that decides who talks to whom. Most floors use a cheap shortcut; every fourth floor does the full, careful check.`,
    paper: `Attention operator, chosen per layer by a 3:1 schedule: Kimi Delta Attention (linear-time recurrent update over a fixed-size matrix memory) or Gated MLA (softmax attention over a compressed KV cache). The hybrid trades a small fraction of full-attention layers for exact global retrieval while keeping asymptotic cost near-linear.`,
  },
  'nope': {
    eli5: `Usually models add stickers saying “I’m word number 5”. Here the careful-check floors don’t need stickers — the cheap floors already remember the order.`,
    paper: `MLA layers omit explicit positional encodings (no RoPE). Order information is furnished inductively by the causal recurrent structure of the interleaved KDA layers. Removing length-bound positional phases improves extrapolation to ~1M-token contexts, where RoPE-based models typically degrade without interpolation tricks.`,
  },
  'current-group-sum': {
    eli5: `After the words talk, their new ideas are added onto the notes we already had — we never throw the old notes away.`,
    paper: `Residual connection: x ← x + Attn(RMSNorm(x)). Additive identity shortcuts keep gradient norms well-behaved through 93 layers and let each sublayer learn a perturbation rather than a full re-representation.`,
  },
  'ffn-sublayer': {
    eli5: `After talking, each word goes off to think by itself for a moment, using everything the model has memorized.`,
    paper: `The position-wise half of a layer: RMSNorm → FFN (dense in layer 1, sparse LatentMoE above) → residual add. Parameter- and compute-dominant; empirically where most factual/parametric knowledge is stored.`,
  },
  'rmsnorm-2': {
    eli5: `Same volume check as before, this time right before the private thinking step.`,
    paper: `Second pre-norm in the layer (x ↦ x/RMS(x) ⊙ g). Because residual accumulation inflates activation norms with depth, per-sublayer renormalization is required to keep the FFN’s input distribution in-distribution for its learned weights.`,
  },
  'ffn-latentmoe': {
    eli5: `Instead of one giant brain for every word, there’s a huge staff of specialists, and a tiny receptionist sends each word to just a few of them. That’s how the model can be enormous without being slow.`,
    paper: `Sparse mixture-of-experts: a router computes per-token expert affinities; only the top-k experts are evaluated, so parameter count (2.8T total) decouples from per-token FLOPs (~tens of billions active). The “latent” variant compresses expert weights/activations to reduce memory-bandwidth pressure, which is the actual inference bottleneck. Layer 1 stays dense to avoid routing instability on unprocessed embeddings.`,
  },
  'updated-group-sum': {
    eli5: `The private thoughts get added back into the shared notes, and the stack is ready for the next floor.`,
    paper: `Second residual add, closing the layer: x ← x + FFN(RMSNorm(x)). The accumulated stream (“group sum”) is what AttnRes blocks mix with depth sources at block boundaries.`,
  },
  'w-alpha': {
    eli5: `Little dials the model learns by itself: “how much of the original words, and how much of the older floors, should I mix in here?”`,
    paper: `Learned scalar mixing coefficients in the AttnRes scheme: block input = w·(current group sum) + Σᵢ αᵢ·(depth sourceᵢ). They parameterize a learned, depth-dependent combination over the embedding and earlier block outputs — an attention-like read over the network’s own depth axis.`,
  },
  'depth-sources': {
    eli5: `A backpack the model carries up the tower: the original words and short summaries from earlier floors, ready whenever a high floor needs a reminder.`,
    paper: `Persistent side-channel of representations — the token embedding and per-block summaries — routed to the w/α gates of all later blocks. Functionally a cross-depth skip highway (cf. DenseNet, but additive and gated), mitigating information decay over 93 layers.`,
  },
  'depth-embedding': {
    eli5: `A photocopy of the very first fingerprints, so the model can always look back at exactly which words it started with.`,
    paper: `The embedding layer’s output, retained verbatim as a depth source. Preserves token identity (useful for copying/lexical tasks) against the smoothing effect of deep residual accumulation.`,
  },
  'depth-earlier-blocks': {
    eli5: `Short summaries saved after each group of floors, like chapter recaps of a long book.`,
    paper: `Per-AttnRes-block summaries of the residual stream, exposed to all deeper blocks via the same gated mixing. Provides direct access to intermediate abstractions and shortens gradient paths during training.`,
  },
  'final-block-attnres': {
    eli5: `One last remix at the top of the tower: the model combines its newest understanding with the best memories from below.`,
    paper: `Terminal AttnRes mixing stage: the deepest block output is combined with the depth sources under learned weights before the final normalization — a learned ensemble over depth, rather than committing to the last layer’s representation alone.`,
  },
  'final-rmsnorm': {
    eli5: `A final volume check before the model decides what word comes next.`,
    paper: `Terminal RMSNorm. Calibrates the final hidden state’s norm before the unembedding projection, keeping logit scales stable for the vocabulary-wide softmax.`,
  },
  'linear-output': {
    eli5: `The model turns its final thoughts into a score for every word it knows — the highest scores are what it might say next.`,
    paper: `Unembedding / LM head: logits = W_out h, W_out ∈ R^(V×d); next-token distribution via softmax. Sampling or argmax decoding closes the autoregressive loop.`,
  },
  'context-length': {
    eli5: `The model can remember about a million pieces of words at once — like holding eight whole novels in its head while answering your question.`,
    paper: `Maximum sequence length ~1M tokens. Feasible because KDA is O(n) with constant-size memory, MLA’s latent KV cache is strongly compressed, and NoPE avoids positional-extrapolation failure. Full softmax attention at this scale would be computationally and memory prohibitive.`,
  },
  'layer-ratio': {
    eli5: `Out of every four floors, three use the cheap quick way and one uses the expensive careful way — a recipe found by trial and error that keeps quality high and cost low.`,
    paper: `Layer schedule: 3 KDA layers per 1 MLA layer, uniformly interleaved, MoE everywhere above layer 1. Hybrid-ratio ablations in the linear-attention literature consistently show that a sparse minority of full-attention layers recovers most in-context retrieval performance lost by pure recurrent models, at a fraction of the cost of full attention throughout.`,
  },
  'mla-overview': {
    eli5: `The careful way of checking earlier words — but instead of keeping full notes on every past word, it keeps super-compressed sticky notes and expands them only when needed.`,
    paper: `Multi-head Latent Attention (DeepSeek-V2 lineage): per-token K/V are re-parameterized through a low-rank latent c = W_down h; only c is cached, and per-head K/V are reconstructed via up-projections absorbed into the attention computation. Cache memory per token drops by a large factor relative to MHA with no material quality loss. Kimi K3 adds a sigmoid output gate.`,
  },
  'mla-latent': {
    eli5: `A tiny zip file version of each past word. Keeping millions of zip files is cheap; keeping millions of full documents is not.`,
    paper: `Low-rank latent cache vector c_t ∈ R^(d_c), d_c ≪ d_model. Keys and values for all heads are functions of c_t, so the per-token cache footprint is d_c instead of 2·n_heads·d_head. This is the dominant memory saving at 1M-token contexts.`,
  },
  'mla-qkv': {
    eli5: `Three question-asking tools: “what am I looking for”, “what do I have”, and “what will I actually hand over if picked”.`,
    paper: `Query/key/value projections define the attention bilinear form softmax(QKᵀ/√d)V. In MLA, K and V are expanded from the shared latent, so the projection parameters are effectively shared across heads through the low-rank bottleneck.`,
  },
  'mla-qknorm': {
    eli5: `Makes sure the “looking for” and “what do I have” lists stay the same size, so the match scores don’t go crazy.`,
    paper: `Per-head RMSNorm on q and k before the inner product. Bounds attention logits, preventing softmax saturation and the associated gradient pathology during large-scale training (a standard stabilizer in recent frontier models).`,
  },
  'mla-gate': {
    eli5: `A dimmer switch the model controls: sometimes the best answer from the word-talk is “actually, nothing useful — pass”`,
    paper: `Element-wise sigmoid gate on the attention output, y = σ(W_g x) ⊙ attn(x). Data-dependent output gating mitigates attention-sink artifacts and gives the network a smooth null-op per token; empirically improves stability and quality in gated-attention ablations.`,
  },
  'mla-out': {
    eli5: `Takes all the different opinions from the careful check and merges them into one tidy summary.`,
    paper: `Output projection W_O mapping concatenated head outputs back to d_model; the learned mixing point of the heads' parallel attention patterns.`,
  },
  'kda-overview': {
    eli5: `The cheap quick way: instead of re-reading everything, the model keeps one small notebook and updates it as it goes — the notebook never gets bigger, even for a million words.`,
    paper: `Kimi Delta Attention: gated linear attention in the DeltaNet family. Maintains a fixed-size matrix memory S_t updated recurrently; per-token cost is O(d²) constant in sequence length, versus O(n·d) for softmax attention. Descends from linear attention → DeltaNet → Gated DeltaNet, here with channel-wise (fine-grained) decay gating.`,
  },
  'kda-delta-rule': {
    eli5: `The notebook rule: when a fact changes, erase the old entry first, then write the new one — and slowly fade out stuff that stopped mattering.`,
    paper: `Update S_t = S_{t-1} diag(α_t) + β_t (v_t − S_{t-1} k_t) k_tᵀ. The (v − Sk) term is a prediction-error correction (“delta rule” from Widrow-Hoff): it overwrites the value currently stored under key k rather than accumulating additively. α_t applies channel-wise decay — KDA’s fine-grained gating, which substantially improves memory utilization over scalar decay.`,
  },
  'kda-l2norm': {
    eli5: `Trims the search notes and the notebook labels to the same length so writes to the notebook stay neat.`,
    paper: `Unit-normalization of q and k. Constrains the eigenvalue scale of the rank-1 updates in the delta rule, keeping the recurrence contractive enough to remain stable over ~10⁶ sequential updates.`,
  },
  'kda-conv': {
    eli5: `A quick peek at the few words right before, so short phrases like “New York” are understood as a unit.`,
    paper: `Short causal depthwise convolution (width ~4) on q, k, v — the standard local-mixing component in modern recurrent blocks (Mamba, GLA). Handles strictly local dependencies that a position-wise recurrence is inefficient at, freeing the matrix memory for long-range structure.`,
  },
  'kda-silu': {
    eli5: `A soft filter that lets strong useful signals through and gently blocks the rest.`,
    paper: `SiLU/Swish: x·σ(x). Smooth, non-monotonic activation; standard in LLM-scale blocks due to favorable optimization properties versus ReLU-family.`,
  },
  'kda-alpha-beta': {
    eli5: `Two knobs the model turns for every word: “how fast should old memories fade” (α) and “how hard should I press the pen” (β).`,
    paper: `Data-dependent gates computed from the input: decay α_t (per-channel in KDA) and write strength β_t. Learned, input-conditioned memory management is the principal capacity multiplier of gated linear attention; fixed decay (as in early RetNet-style models) cannot adapt retention to content.`,
  },
  'kda-gate': {
    eli5: `The same dimmer switch as in the careful mode: the model decides how much of the notebook read-out actually matters right now.`,
    paper: `Sigmoid output gate on the recurrent read-out, y = σ(W_g x) ⊙ (S q), suppressing irrelevant memory reads per token before the residual write.`,
  },
  'kda-rmsnorm': {
    eli5: `One more volume check on what came out of the notebook before it’s shared.`,
    paper: `RMSNorm on the delta-rule output; normalizes the read-out magnitude, which otherwise drifts with the memory’s write history.`,
  },
  'kda-in': {
    eli5: `Little translators that turn each word into the three forms the notebook needs: a search tag, a filing label, and the content to store.`,
    paper: `Input-side linear projections producing q, k, v (and the gate pre-activations) from the residual stream; they define the learned subspaces in which memory addressing occurs.`,
  },
  'kda-out': {
    eli5: `Converts the notebook’s answer back into the model’s common language so it can be added to the shared notes.`,
    paper: `Output projection mapping the gated read-out back to d_model for the residual add; the learned interface between the recurrent block and the stream.`,
  },
};

/* ------------------------------------------------------------------ */
/* “Why not the alternative?”                                         */
/* ------------------------------------------------------------------ */
export const ALTERNATIVES = {
  'rmsnorm-1': {
    title: 'Why not LayerNorm?',
    text: `LayerNorm additionally subtracts the mean, which costs more and — as it turns out empirically — doesn’t improve quality at this scale. RMSNorm keeps only the variance normalization, trains just as well, and is cheaper per token. Across a 2.8T-parameter model, small per-op savings multiply into serious money.`,
  },
  'rmsnorm-2': {
    title: 'Why not LayerNorm?',
    text: `Same reasoning as RMSNorm 1: mean-centering buys nothing measurable at scale, and dropping it saves compute everywhere. Simplicity that survives contact with trillion-parameter training runs wins.`,
  },
  'token-embedding': {
    title: 'Why not one-hot vectors?',
    text: `A one-hot vector is as long as the entire vocabulary (~100k+ dimensions) and treats every pair of words as equally different — “cat” vs “kitten” looks the same as “cat” vs “refrigerator”. Learned dense embeddings are compact and encode similarity; one-hot also couldn’t be trained to do anything useful.`,
  },
  'transformer-stack': {
    title: 'Why not wider instead of deeper?',
    text: `Width and depth buy different things: width adds capacity per layer, depth adds sequential composition — each layer can build on abstractions the previous one formed. Empirically, deep-and-narrow models outperform shallow-and-wide ones on language at equal parameter count, up to the point where training stability breaks. 93 layers with AttnRes is a bet that stability tricks now let depth go further.`,
  },
  'ffn-latentmoe': {
    title: 'Why not a dense FFN everywhere?',
    text: `A dense 2.8T model would cost 2.8T parameters' worth of compute for every single token — unusable. MoE keeps the enormous capacity (which helps quality: different experts specialize) while activating only a few experts per token, so inference and training cost stays near a much smaller dense model. The price is routing complexity and load-balancing during training.`,
  },
  'kda-overview': {
    title: 'Why not full attention everywhere?',
    text: `Full attention scales quadratically in sequence length and needs a KV cache that grows with every token. At 1M tokens that’s not a slowdown, it’s a wall — memory alone wouldn’t fit. KDA’s fixed-size memory and constant per-token cost make long contexts routine. The compromise: exact retrieval of rare details is weaker, which is why MLA layers are interleaved.`,
  },
  'kda-delta-rule': {
    title: 'Why not simple additive linear attention?',
    text: `Plain linear attention only adds outer products (vvᵀ-style) into memory and never removes anything. Over long sequences the memory saturates: old junk never leaves and new writes blur together. The delta rule explicitly subtracts what’s currently stored under a key before writing — memory becomes an updatable associative store instead of an ever-growing pile.`,
  },
  'kda-alpha-beta': {
    title: 'Why not fixed decay rates?',
    text: `A fixed forget rate assumes all content ages at the same speed — but “the capital of France is” deserves eternal memory while “umm, so yeah” deserves instant deletion. Input-dependent gates let the model decide per token and per channel what to keep. Ablations in the Gated DeltaNet line of work show this gating is a large part of the quality gap between early and modern linear attention.`,
  },
  'mla-overview': {
    title: 'Why not standard multi-head attention?',
    text: `MHA caches full keys and values for every head and every past token — at 1M tokens that’s the single biggest memory cost in the system. MLA shows K/V for all heads can be reconstructed from one small latent vector, shrinking the cache dramatically with essentially no quality loss. You keep softmax attention’s retrieval precision without its memory bill.`,
  },
  'mla-latent': {
    title: 'Why not MQA or GQA?',
    text: `Multi-query and grouped-query attention shrink the cache by sharing K/V across heads — effective but coarse, and quality drops as you share more aggressively. MLA’s low-rank latent is a softer, learned compression: heads still get distinct K/V, just ones that happen to live in a shared subspace. It compresses further than GQA at equal or better quality.`,
  },
  'mla-qknorm': {
    title: 'Why not just scale down the logits?',
    text: `Dividing by √d only fixes the average case, not outliers — during training, individual q or k vectors can still blow up and saturate softmax, killing gradients. Normalizing the vectors themselves bounds every logit, not just the typical one. Several frontier models adopted QK-Norm precisely after hitting attention-logit explosions mid-run.`,
  },
  'nope': {
    title: 'Why not RoPE like everyone else?',
    text: `RoPE encodes position as rotations with fixed wavelengths trained at a fixed context length; beyond that length the phases wrap into territory the model never trained on, and retrieval degrades (hence tricks like YaRN). Kimi K3 sidesteps the whole problem: KDA layers already encode order through recurrence, so the MLA layers can be position-blind and extrapolate to 1M tokens without any positional patch.`,
  },
  'w-alpha': {
    title: 'Why not plain residual connections only?',
    text: `Residuals link each layer to its immediate predecessor; after 90 layers the input’s contribution is one of 90+ additive terms, diluted beyond use. Learned gates over depth sources let each block choose its own mix of “recent work” and “original input”. Plain residuals are the special case where all those gates are frozen at 1 and 0.`,
  },
  'depth-sources': {
    title: 'Why not DenseNet-style concatenation?',
    text: `DenseNet concatenates every previous layer’s output — powerful, but the channel count grows linearly with depth, exploding parameter counts in later layers. Additive, gated mixing (AttnRes) gets most of the same gradient-flow and information-preservation benefits while keeping the hidden width constant.`,
  },
  'layer-ratio': {
    title: 'Why not 1:1, or all-MLA?',
    text: `More MLA layers help retrieval quality a little but cost a lot: each one carries a growing KV cache and super-linear compute at long context. Fewer MLA layers saves cost but in-context retrieval (“copy the code from page 400”) collapses — that’s the known weakness of pure recurrent models. Empirical hybrid-ratio studies land near 3:1–7:1 as the sweet spot.`,
  },
  'kda-conv': {
    title: 'Why not a bigger receptive field?',
    text: `Width-4 is deliberate: the convolution only needs to catch local n-gram-ish patterns (“San Francisco”, punctuation structure). Anything longer-range is the recurrent memory’s job — enlarging the conv would duplicate that role, cost more, and add nothing the delta rule doesn’t already do.`,
  },
  'context-length': {
    title: 'Why not RAG instead of long context?',
    text: `Retrieval-augmented generation fetches a few relevant chunks — great for fact lookup, but it can’t reason across the whole input: comparing two distant chapters, or aggregating information spread over an entire codebase, needs everything in view at once. Long context and RAG are complements; the architecture (KDA + latent cache + NoPE) is what makes the long-context half affordable.`,
  },
  'final-rmsnorm': {
    title: 'Why not skip it?',
    text: `After 93 residual accumulations plus the final AttnRes mix, the hidden state’s scale drifts arbitrarily. The unembedding computes dot products against all ~100k vocabulary vectors — if h’s norm wanders, logit scales wander with it and the softmax miscalibrates. One cheap normalization at the boundary prevents the whole class of failure.`,
  },
};

/* ------------------------------------------------------------------ */
/* Compute / memory cost lens. level: 0 = negligible, 1 = low,       */
/* 2 = moderate, 3 = heavy (dominant cost).                           */
/* ------------------------------------------------------------------ */
export const COST = {
  'tokenized-text': { level: 0, note: 'Pure string processing on CPU; negligible compared to everything downstream.' },
  'token-embedding': { level: 0, note: 'One row lookup per token. The matrix is large in memory but the per-token work is essentially free.' },
  'rmsnorm-1': { level: 0, note: 'A few elementwise operations per token; negligible FLOPs.' },
  'rmsnorm-2': { level: 0, note: 'Negligible — elementwise ops only.' },
  'final-rmsnorm': { level: 0, note: 'Negligible — elementwise ops only.' },
  'kda-rmsnorm': { level: 0, note: 'Negligible — elementwise ops only.' },
  'current-group-sum': { level: 0, note: 'Pure addition; effectively free.' },
  'updated-group-sum': { level: 0, note: 'Pure addition; effectively free.' },
  'nope': { level: 0, note: 'The absence of an operation — zero cost, and it removes the need for length-extrapolation patches.' },
  'depth-sources': { level: 0, note: 'Just stored activations; costs memory bandwidth, not FLOPs.' },
  'depth-embedding': { level: 0, note: 'A retained copy of the embedding; storage only.' },
  'depth-earlier-blocks': { level: 0, note: 'Retained block summaries; storage only.' },
  'w-alpha': { level: 0, note: 'A handful of scalar multiplies per block; negligible.' },
  'final-block-attnres': { level: 0, note: 'Weighted sums of a few vectors; negligible.' },
  'kda-l2norm': { level: 0, note: 'Two vector normalizations per token; negligible.' },
  'kda-silu': { level: 0, note: 'Elementwise nonlinearity; negligible.' },
  'kda-alpha-beta': { level: 0, note: 'Tiny gate projections; negligible.' },
  'kda-conv': { level: 1, note: 'Width-4 depthwise convolution: a few multiplies per channel per token. Cheap by design.' },
  'kda-in': { level: 1, note: 'Small input projections; a minor share of the block’s FLOPs.' },
  'kda-gate': { level: 1, note: 'One extra projection per token; small but not free.' },
  'kda-out': { level: 1, note: 'One projection back to d_model; small.' },
  'kda-overview': { level: 2, note: 'Constant per-token cost regardless of context length — the whole point. Still involves d×d matrix memory updates, so not trivial.' },
  'kda-delta-rule': { level: 2, note: 'Rank-1 memory update: O(d²) per token, independent of sequence length. Dominant inside the KDA block.' },
  'kda-mla-block': { level: 2, note: 'KDA layers: constant cost per token. MLA layers: grows linearly with context length. Either way, far cheaper than full attention at 1M tokens.' },
  'mla-qkv': { level: 1, note: 'Projection FLOPs per token; moderate, and the latent down-projection is small.' },
  'mla-qknorm': { level: 0, note: 'Two normalizations; negligible.' },
  'mla-gate': { level: 1, note: 'One gating projection; small.' },
  'mla-out': { level: 1, note: 'Output projection; small.' },
  'mla-latent': { level: 1, note: 'Small down-projection to compute, huge memory saving: the cache stores d_c numbers per token instead of full K/V for all heads.' },
  'mla-overview': { level: 2, note: 'Softmax attention over n cached latents: cost grows with context length, but the compressed cache makes even 1M tokens feasible.' },
  'attn-sublayer': { level: 2, note: 'Cheaper half of the layer thanks to the KDA/MLA hybrid; still grows (slowly) with context in MLA layers.' },
  'ffn-sublayer': { level: 3, note: 'The dominant per-token compute: even with sparse routing, the active experts are large matrices.' },
  'ffn-latentmoe': { level: 3, note: 'Where most of the 2.8T parameters live and where most per-token FLOPs go. Sparse activation is the only thing keeping this affordable.' },
  'linear-output': { level: 2, note: 'One d×V matrix multiply per generated token — over a ~100k+ vocabulary, that adds up during generation.' },
  'transformer-stack': { level: 3, note: 'Everything above × 93 layers. The total training/inference budget is spent here.' },
  'layer-ratio': { level: 2, note: 'This schedule is precisely the cost/quality dial: each MLA layer is the expensive one, so the ratio directly sets the bill.' },
  'context-length': { level: 3, note: 'Long context is the great cost multiplier: every attention layer’s work grows with n, and the KV cache grows linearly. The whole architecture is organized around taming this.' },
};
