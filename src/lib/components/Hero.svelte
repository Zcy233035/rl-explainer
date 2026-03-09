<script lang="ts">
	import { lang, t } from '$lib/stores/i18n';
</script>

<div class="pt-24 md:pt-28 pb-16 md:pb-20 px-4 md:px-6">
	<div class="max-w-[1400px] mx-auto text-center">
		<h1 class="text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight text-text">
			<span class="text-primary">RL</span> Explainer
		</h1>
		<p class="text-lg md:text-2xl text-text-muted mb-4 md:mb-5 leading-relaxed">
			{@html t('hero.subtitle', $lang)}
		</p>
		<p class="text-base md:text-lg text-text-muted max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed">
			{t('hero.desc', $lang)}
		</p>
		<div class="flex flex-wrap justify-center gap-3 md:gap-4">
			<a href="#pipeline" class="px-6 md:px-8 py-2.5 md:py-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-base md:text-lg font-medium transition-colors">
				{t('hero.explore', $lang)}
			</a>
			<a href="#formulas" class="px-6 md:px-8 py-2.5 md:py-3 bg-surface-light hover:bg-border text-text rounded-lg text-base md:text-lg font-medium transition-colors border border-border">
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
