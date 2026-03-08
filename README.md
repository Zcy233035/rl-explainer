# RL Explainer

Interactive visualization of reinforcement learning algorithms for LLM training. Inspired by [Transformer Explainer](https://poloclub.github.io/transformer-explainer/).

**Live Demo → [zcy233035.github.io/rl-explainer](https://zcy233035.github.io/rl-explainer/)**

## What's Inside

- **11 algorithms**: REINFORCE, PPO, RLHF, DPO, GRPO, DAPO, GSPO, REINFORCE++, VAPO, GMPO, GFPO
- **Interactive formula explainer**: Click any part of a formula to see what it means
- **Formula diff view**: See exact mathematical differences between algorithms (vs GRPO)
- **Training pipeline visualization**: How data flows through each algorithm's training loop
- **Algorithm comparison**: Radar charts, feature tables, and side-by-side metrics
- **Bilingual**: English / 中文 one-click toggle
- **Papers collection**: Direct links to all original papers

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- [D3.js](https://d3js.org/) for radar charts
- [KaTeX](https://katex.org/) for formula rendering
- [Lucide](https://lucide.dev/) icons

## Development

```bash
npm install
npm run dev
```

## Build & Preview

```bash
npm run build
npm run preview
```

## License

MIT
