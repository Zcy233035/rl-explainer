<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import PipelineView from '$lib/components/PipelineView.svelte';
	import FormulaComparison from '$lib/components/FormulaComparison.svelte';
	import FormulaExplain from '$lib/components/FormulaExplain.svelte';
	import AlgorithmDetail from '$lib/components/AlgorithmDetail.svelte';
	import ComparisonPanel from '$lib/components/ComparisonPanel.svelte';
	import PapersPanel from '$lib/components/PapersPanel.svelte';
	import ArticlePanel from '$lib/components/ArticlePanel.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>RL Explainer - Interactive Visualization of RL Algorithms for LLM Training</title>
	<meta name="description" content="Interactive visualization of reinforcement learning algorithms for LLM training: GRPO, PPO, DPO, DAPO, GSPO, VAPO, GMPO, GFPO and more." />
</svelte:head>

<div class="min-h-screen bg-bg">
	<Nav />
	<main>
		<Hero />
		<section id="timeline">
			<Timeline />
		</section>
		<section id="pipeline">
			<PipelineView />
		</section>
		<section id="formula-explain">
			<FormulaExplain />
		</section>
		<section id="formulas">
			<FormulaComparison />
		</section>
		<section id="details">
			<AlgorithmDetail />
		</section>
		<section id="comparison">
			<ComparisonPanel />
		</section>
		<section id="papers">
			<PapersPanel />
		</section>
		<section id="article">
			<ArticlePanel />
		</section>
	</main>
	<Footer />
</div>
