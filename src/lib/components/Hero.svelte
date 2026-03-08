<script lang="ts">
	import { lang, t } from '$lib/stores/i18n';
</script>

<div class="pt-28 pb-20 px-6">
	<div class="max-w-[1400px] mx-auto text-center">
		<h1 class="text-6xl font-bold mb-6 leading-tight text-text">
			<span class="text-primary">RL</span> Explainer
		</h1>
		<p class="text-2xl text-text-muted mb-5 leading-relaxed">
			{@html t('hero.subtitle', $lang)}
		</p>
		<p class="text-lg text-text-muted max-w-3xl mx-auto mb-12 leading-relaxed">
			{t('hero.desc', $lang)}
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a href="#pipeline" class="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-lg font-medium transition-colors">
				{t('hero.explore', $lang)}
			</a>
			<a href="#formulas" class="px-8 py-3 bg-surface-light hover:bg-border text-text rounded-lg text-lg font-medium transition-colors border border-border">
				{t('hero.compare', $lang)}
			</a>
		</div>

		<div class="mt-14 flex flex-wrap justify-center gap-3">
			{#each ['REINFORCE', 'PPO', 'RLHF', 'DPO', 'GRPO', 'DAPO', 'GSPO', 'REINFORCE++', 'VAPO', 'GMPO', 'GFPO'] as name}
				<span class="px-4 py-1.5 text-sm font-mono bg-surface-light text-text-muted rounded-full border border-border">
					{name}
				</span>
			{/each}
		</div>
	</div>
</div>
