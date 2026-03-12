<script lang="ts">
	import { algorithms } from '$lib/data/algorithms';
	import { selectedAlgorithmId, selectedAlgorithm } from '$lib/stores/algorithm';
	import { renderLatex } from '$lib/utils/katex-render';
	import { lang, t, getAlgoText } from '$lib/stores/i18n';
	import LatexCopyButton from './LatexCopyButton.svelte';

	let algo = $derived($selectedAlgorithm);
	let algoText = $derived(algo ? getAlgoText(algo.id, $lang) : undefined);

	const metricKeyMap: Record<string, string> = {
		stability: 'metric.stability',
		memoryEfficiency: 'metric.memoryEfficiency',
		trainingSpeed: 'metric.trainingSpeed',
		quality: 'metric.quality',
		complexity: 'metric.complexity'
	};
</script>

<div class="py-20 px-6 bg-surface-light/50">
	<div class="max-w-[1400px] mx-auto">
		<h2 class="text-4xl font-bold text-center mb-3">{t('details.title', $lang)}</h2>
		<p class="text-text-muted text-center mb-10 text-lg">{t('details.subtitle', $lang)}</p>

		<div class="flex flex-wrap justify-center gap-2 mb-12">
			{#each algorithms as a}
				<button
					onclick={() => $selectedAlgorithmId = a.id}
					class="px-4 py-2 text-base font-medium rounded-lg transition-all border"
					class:text-white={$selectedAlgorithmId === a.id}
					class:bg-white={$selectedAlgorithmId !== a.id}
					class:border-border={$selectedAlgorithmId !== a.id}
					class:text-text-muted={$selectedAlgorithmId !== a.id}
					style={$selectedAlgorithmId === a.id ? `background:${a.color}; border-color:${a.color}` : ''}
				>
					{a.name}
				</button>
			{/each}
		</div>

		{#if algo}
			<div class="grid lg:grid-cols-3 gap-6 md:gap-8">
				<div class="lg:col-span-2 space-y-6">
					<div class="bg-white border border-border rounded-xl p-5 md:p-8 shadow-sm">
						<div class="flex flex-wrap items-center gap-2 md:gap-3 mb-5">
							<div class="w-5 md:w-6 h-5 md:h-6 rounded-full" style="background:{algo.color}"></div>
							<h3 class="text-2xl md:text-3xl font-bold">{algo.name}</h3>
							<span class="text-sm md:text-lg text-text-muted">{algo.fullName}</span>
						</div>
						<p class="text-lg text-text-muted leading-relaxed mb-5">{algoText?.description ?? algo.description}</p>
						<div class="bg-surface-light rounded-xl p-5 mb-5">
							<div class="text-base font-bold text-accent mb-2">{t('details.innovation', $lang)}</div>
							<p class="text-lg text-text">{algoText?.keyInnovation ?? algo.keyInnovation}</p>
						</div>
						<LatexCopyButton latex={algo.objective}>
						<div class="formula-highlight overflow-x-auto">
							{@html renderLatex(algo.objective, true)}
						</div>
					</LatexCopyButton>
						<p class="text-base text-text-muted mt-4 leading-relaxed">{algoText?.objectiveExplanation ?? algo.objectiveExplanation}</p>
					</div>

					<div class="bg-white border border-border rounded-xl p-5 md:p-8 shadow-sm">
						<h4 class="text-xl font-bold text-primary mb-4">{t('details.components', $lang)}</h4>
						<div class="flex flex-wrap gap-2 md:gap-3">
							{#each algo.components as comp}
								<div
									class="px-3 md:px-5 py-2 md:py-3 rounded-xl border text-sm md:text-base font-mono"
									class:bg-blue-50={comp.type === 'model'}
									class:border-blue-200={comp.type === 'model'}
									class:bg-emerald-50={comp.type === 'process'}
									class:border-emerald-200={comp.type === 'process'}
									class:bg-amber-50={comp.type === 'data'}
									class:border-amber-200={comp.type === 'data'}
									class:bg-purple-50={comp.type === 'loss'}
									class:border-purple-200={comp.type === 'loss'}
								>
									<span class="text-sm uppercase tracking-wider text-text-muted block mb-1">{comp.type}</span>
									{comp.label}
								</div>
							{/each}
						</div>
					</div>

					<div class="bg-white border border-border rounded-xl p-5 md:p-8 shadow-sm">
						<h4 class="text-xl font-bold text-primary mb-4">{t('details.papers', $lang)}</h4>
						{#each algo.papers as paper}
							<a href={paper.url} target="_blank" rel="noopener" class="block text-lg text-primary hover:underline mb-2">
								{paper.title} ({paper.year})
							</a>
						{/each}
					</div>
				</div>

				<div class="space-y-6">
					<div class="bg-white border border-border rounded-xl p-5 md:p-8 shadow-sm">
						<h4 class="text-xl font-bold text-positive mb-4">{t('details.advantages', $lang)}</h4>
						<ul class="space-y-3">
							{#each (algoText?.pros ?? algo.pros) as pro}
								<li class="text-base text-text-muted flex gap-2 leading-relaxed">
									<span class="text-positive mt-0.5 font-bold text-lg">+</span>
									{pro}
								</li>
							{/each}
						</ul>
					</div>
					<div class="bg-white border border-border rounded-xl p-5 md:p-8 shadow-sm">
						<h4 class="text-xl font-bold text-negative mb-4">{t('details.limitations', $lang)}</h4>
						<ul class="space-y-3">
							{#each (algoText?.cons ?? algo.cons) as con}
								<li class="text-base text-text-muted flex gap-2 leading-relaxed">
									<span class="text-negative mt-0.5 font-bold text-lg">-</span>
									{con}
								</li>
							{/each}
						</ul>
					</div>
					<div class="bg-white border border-border rounded-xl p-5 md:p-8 shadow-sm">
						<h4 class="text-xl font-bold text-primary mb-5">{t('details.metrics', $lang)}</h4>
						{#each Object.entries(algo.metrics) as [key, value]}
							<div class="mb-4">
								<div class="flex justify-between text-base mb-1.5">
									<span class="text-text-muted">{t(metricKeyMap[key] ?? key, $lang)}</span>
									<span class="font-mono font-bold" style="color:{algo.color}">{value}/10</span>
								</div>
								<div class="h-3 bg-surface-light rounded-full overflow-hidden">
									<div
										class="h-full rounded-full transition-all duration-500"
										style="width:{value * 10}%; background:{algo.color}"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
