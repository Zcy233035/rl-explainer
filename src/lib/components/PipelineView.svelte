<script lang="ts">
	import { selectedAlgorithmId, selectedAlgorithm } from '$lib/stores/algorithm';
	import { algorithms } from '$lib/data/algorithms';
	import { lang, t, getPipelineSpecifics } from '$lib/stores/i18n';
	import FileText from 'lucide-svelte/icons/file-text';
	import Brain from 'lucide-svelte/icons/brain';
	import MessageSquare from 'lucide-svelte/icons/message-square';
	import Star from 'lucide-svelte/icons/star';
	import BarChart3 from 'lucide-svelte/icons/bar-chart-3';
	import RefreshCw from 'lucide-svelte/icons/refresh-cw';

	let hoveredComponent: string | null = $state(null);

	const pipelineStepKeys = [
		{ id: 'prompt', labelKey: 'pipeline.prompt', descKey: 'pipeline.prompt.desc', icon: FileText },
		{ id: 'policy', labelKey: 'pipeline.policy', descKey: 'pipeline.policy.desc', icon: Brain },
		{ id: 'response', labelKey: 'pipeline.response', descKey: 'pipeline.response.desc', icon: MessageSquare },
		{ id: 'reward', labelKey: 'pipeline.reward', descKey: 'pipeline.reward.desc', icon: Star },
		{ id: 'advantage', labelKey: 'pipeline.advantage', descKey: 'pipeline.advantage.desc', icon: BarChart3 },
		{ id: 'update', labelKey: 'pipeline.update', descKey: 'pipeline.update.desc', icon: RefreshCw }
	];

	let algo = $derived($selectedAlgorithm);
	let specifics = $derived(getPipelineSpecifics($selectedAlgorithmId, $lang));
</script>

<div class="py-20 px-6 bg-surface-light/50">
	<div class="max-w-[1400px] mx-auto">
		<h2 class="text-4xl font-bold text-center mb-3">{t('pipeline.title', $lang)}</h2>
		<p class="text-text-muted text-center mb-10 text-lg">{t('pipeline.subtitle', $lang)}</p>

		<div class="flex flex-wrap justify-center gap-2 mb-12">
			{#each algorithms as a}
				<button
					onclick={() => $selectedAlgorithmId = a.id}
					class="px-4 py-2 text-base font-medium rounded-lg transition-all border"
					class:bg-white={$selectedAlgorithmId !== a.id}
					class:border-border={$selectedAlgorithmId !== a.id}
					class:text-text-muted={$selectedAlgorithmId !== a.id}
					class:text-white={$selectedAlgorithmId === a.id}
					style={$selectedAlgorithmId === a.id ? `background:${a.color}; border-color:${a.color}` : ''}
				>
					{a.name}
				</button>
			{/each}
		</div>

		<div class="bg-white border border-border rounded-xl p-10 mb-8 shadow-sm">
			<div class="flex items-center justify-between gap-3 overflow-x-auto pb-4">
				{#each pipelineStepKeys as step, i}
					<div class="flex items-center min-w-0">
						<button
							class="flex flex-col items-center p-4 rounded-xl transition-all min-w-[110px] border-2"
							class:border-primary={hoveredComponent === step.id}
							class:bg-indigo-50={hoveredComponent === step.id}
							class:border-transparent={hoveredComponent !== step.id}
							onmouseenter={() => hoveredComponent = step.id}
							onmouseleave={() => hoveredComponent = null}
						>
							<span class="mb-2 text-text-muted">
								<step.icon size={28} strokeWidth={1.5} />
							</span>
							<span class="text-base font-mono font-bold text-text whitespace-nowrap">{t(step.labelKey, $lang)}</span>
							<span class="text-sm text-text-muted mt-1">{t(step.descKey, $lang)}</span>
						</button>
						{#if i < pipelineStepKeys.length - 1}
							<svg class="w-8 h-8 text-primary/50 flex-shrink-0 mx-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M5 12h14m-4-4l4 4-4 4"/>
							</svg>
						{/if}
					</div>
				{/each}
			</div>

			<div class="flex justify-center mt-4">
				<div class="flex items-center gap-2 text-base text-accent font-medium">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 12H5m4 4l-4-4 4-4"/>
					</svg>
					<span>{t('pipeline.loop', $lang)}</span>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 12H5m4 4l-4-4 4-4"/>
					</svg>
				</div>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<div class="bg-white border border-border rounded-xl p-8 shadow-sm">
				<h3 class="text-xl font-bold mb-4">
					<span style="color:{algo.color}">{algo.name}</span> {t('pipeline.components', $lang)}
				</h3>
				<div class="flex flex-wrap gap-2">
					{#each specifics.extras as extra}
						<span class="px-4 py-2 text-base font-mono bg-surface-light border border-border rounded-lg" style="border-left: 4px solid {algo.color}">
							{extra}
						</span>
					{/each}
					{#if specifics.extras.length === 0}
						<span class="text-base text-text-muted italic">{t('pipeline.noextra', $lang)}</span>
					{/if}
				</div>
			</div>
			<div class="bg-white border border-border rounded-xl p-8 shadow-sm">
				<h3 class="text-xl font-bold text-accent mb-4">{t('pipeline.mechanism', $lang)}</h3>
				<p class="text-lg text-text-muted leading-relaxed">{specifics.notes}</p>
			</div>
		</div>
	</div>
</div>
