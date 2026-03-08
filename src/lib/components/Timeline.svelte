<script lang="ts">
	import { algorithms, algorithmOrder } from '$lib/data/algorithms';
	import { selectedAlgorithmId } from '$lib/stores/algorithm';
	import { lang, t } from '$lib/stores/i18n';

	const sorted = algorithmOrder.map(id => algorithms.find(a => a.id === id)!);

	function select(id: string) {
		$selectedAlgorithmId = id;
	}
</script>

<div class="py-20 px-6">
	<div class="max-w-[1400px] mx-auto">
		<h2 class="text-4xl font-bold text-center mb-3">{t('timeline.title', $lang)}</h2>
		<p class="text-text-muted text-center mb-14 text-lg">{t('timeline.subtitle', $lang)}</p>

		<div class="relative overflow-x-auto pb-6">
			<div class="absolute top-[32px] left-[60px] right-[60px] h-[3px] bg-border rounded-full"></div>

			<div class="flex items-start justify-between min-w-[1000px] px-4 relative">
				{#each sorted as algo, i}
					<button
						onclick={() => select(algo.id)}
						class="flex flex-col items-center group cursor-pointer relative z-10 rounded-xl p-3 transition-all hover:bg-surface-light"
						class:ring-2={$selectedAlgorithmId === algo.id}
						class:ring-primary={$selectedAlgorithmId === algo.id}
						class:bg-surface-light={$selectedAlgorithmId === algo.id}
					>
						<div
							class="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 text-sm font-bold"
							style="background: {algo.color};"
						>
							{algo.year}
						</div>
						<div class="mt-3 text-base font-bold text-center whitespace-nowrap" style="color: {algo.color}">
							{algo.name}
						</div>
						<div class="text-sm text-text-muted text-center mt-1 max-w-[90px] leading-tight">
							{algo.origin}
						</div>
					</button>
				{/each}
			</div>
		</div>

		<div class="flex justify-center gap-8 mt-10 text-base text-text-muted">
			<span class="flex items-center gap-2">
				<span class="w-3.5 h-3.5 rounded-full bg-blue-500"></span> {t('timeline.foundation', $lang)}
			</span>
			<span class="flex items-center gap-2">
				<span class="w-3.5 h-3.5 rounded-full bg-emerald-500"></span> {t('timeline.critic-free', $lang)}
			</span>
			<span class="flex items-center gap-2">
				<span class="w-3.5 h-3.5 rounded-full bg-violet-500"></span> {t('timeline.preference', $lang)}
			</span>
			<span class="flex items-center gap-2">
				<span class="w-3.5 h-3.5 rounded-full bg-orange-500"></span> {t('timeline.advanced', $lang)}
			</span>
		</div>
	</div>
</div>
