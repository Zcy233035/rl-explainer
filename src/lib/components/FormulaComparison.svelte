<script lang="ts">
	import { algorithms } from '$lib/data/algorithms';
	import { selectedAlgorithmId } from '$lib/stores/algorithm';
	import { renderLatex } from '$lib/utils/katex-render';
	import { lang, t, getAlgoText } from '$lib/stores/i18n';

	let selectedIds = $state<string[]>(['grpo', 'dapo', 'gspo']);

	function toggleAlgo(id: string) {
		if (selectedIds.includes(id)) {
			if (selectedIds.length > 1) {
				selectedIds = selectedIds.filter(x => x !== id);
			}
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	let selectedAlgos = $derived(selectedIds.map(id => algorithms.find(a => a.id === id)!));
	let showDiffView = $state(true);
</script>

<div class="py-20 px-6">
	<div class="max-w-[1400px] mx-auto">
		<h2 class="text-4xl font-bold text-center mb-3">{t('formulas.title', $lang)}</h2>
		<p class="text-text-muted text-center mb-6 text-lg">
			{t('formulas.subtitle', $lang)}
		</p>

		<div class="flex justify-center gap-3 mb-10">
			<button
				class="px-6 py-3 text-base rounded-lg transition-colors border font-medium"
				class:bg-primary={showDiffView}
				class:text-white={showDiffView}
				class:border-primary={showDiffView}
				class:bg-white={!showDiffView}
				class:text-text-muted={!showDiffView}
				class:border-border={!showDiffView}
				onclick={() => showDiffView = true}
			>
				{t('formulas.diff', $lang)}
			</button>
			<button
				class="px-6 py-3 text-base rounded-lg transition-colors border font-medium"
				class:bg-primary={!showDiffView}
				class:text-white={!showDiffView}
				class:border-primary={!showDiffView}
				class:bg-white={showDiffView}
				class:text-text-muted={showDiffView}
				class:border-border={showDiffView}
				onclick={() => showDiffView = false}
			>
				{t('formulas.side', $lang)}
			</button>
		</div>

		{#if showDiffView}
			<div class="space-y-8">
				{#each algorithms.filter(a => a.formulaDiffs && a.formulaDiffs.length > 0) as algo}
					{@const algoText = getAlgoText(algo.id, $lang)}
					<div class="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
						<div class="px-8 py-5 border-b border-border flex items-center gap-4 bg-surface-light/50">
							<div class="w-5 h-5 rounded-full" style="background:{algo.color}"></div>
							<h3 class="font-bold text-2xl">{algo.name}</h3>
							<span class="text-base text-text-muted">{algo.fullName}</span>
							<span class="ml-auto text-base px-3 py-1 rounded bg-white text-text-muted border border-border font-medium">{algo.year}</span>
						</div>

						<div class="px-8 py-6 border-b border-border/50">
							<div class="text-base font-medium text-text-muted mb-3">{t('formulas.objective', $lang)}</div>
							<div class="formula-highlight overflow-x-auto">
								{@html renderLatex(algo.objective, true)}
							</div>
							<p class="text-base text-text-muted mt-4 leading-relaxed">{algoText?.objectiveExplanation ?? algo.objectiveExplanation}</p>
						</div>

						<div class="px-8 py-6">
							<div class="text-lg font-bold text-accent mb-5">{t('formulas.keydiff', $lang)}</div>
							<div class="space-y-5">
								{#each algo.formulaDiffs || [] as diff}
									<div class="bg-surface-light rounded-xl p-6">
										<div class="text-base font-bold text-primary mb-4">{diff.label}</div>
										<div class="grid md:grid-cols-2 gap-5">
											<div>
												<div class="text-sm text-negative font-mono mb-2 font-bold">{t('formulas.before', $lang)}</div>
												<div class="formula-highlight overflow-x-auto opacity-60">
													{@html renderLatex(diff.from, false)}
												</div>
											</div>
											<div>
												<div class="text-sm text-positive font-mono mb-2 font-bold">{t('formulas.after', $lang)}</div>
												<div class="formula-diff overflow-x-auto">
													{@html renderLatex(diff.to, false)}
												</div>
											</div>
										</div>
										<p class="text-base text-text-muted mt-4 leading-relaxed">{diff.explanation}</p>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="mb-8 flex flex-wrap justify-center gap-2">
				{#each algorithms as a}
					<button
						onclick={() => toggleAlgo(a.id)}
						class="px-4 py-2 text-base font-medium rounded-lg transition-all border"
						class:text-white={selectedIds.includes(a.id)}
						class:bg-white={!selectedIds.includes(a.id)}
						class:border-border={!selectedIds.includes(a.id)}
						class:text-text-muted={!selectedIds.includes(a.id)}
						style={selectedIds.includes(a.id) ? `background:${a.color}; border-color:${a.color}` : ''}
					>
						{a.name}
					</button>
				{/each}
			</div>

			<div class="grid gap-6" style="grid-template-columns: repeat({Math.min(selectedAlgos.length, 3)}, 1fr)">
				{#each selectedAlgos as algo}
					{@const algoText = getAlgoText(algo.id, $lang)}
					<div class="bg-white border border-border rounded-xl p-8 shadow-sm min-w-0">
						<div class="flex items-center gap-3 mb-4">
							<div class="w-4 h-4 rounded-full" style="background:{algo.color}"></div>
							<h3 class="font-bold text-xl">{algo.name}</h3>
							<span class="text-base text-text-muted">{algo.year}</span>
						</div>
						<div class="formula-highlight overflow-x-auto mb-4">
							{@html renderLatex(algo.objective, true)}
						</div>
						<p class="text-base text-text-muted leading-relaxed">{algoText?.objectiveExplanation ?? algo.objectiveExplanation}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
