<script lang="ts">
	import { renderLatex } from '$lib/utils/katex-render';
	import { lang, t, getArticleSections } from '$lib/stores/i18n';

	let sections = $derived(getArticleSections($lang));
</script>

<div class="py-20 px-6 bg-surface-light/50">
	<div class="max-w-[900px] mx-auto">
		<h2 class="text-4xl font-bold text-center mb-3">{t('article.title', $lang)}</h2>
		<p class="text-text-muted text-center mb-14 text-lg">{t('article.subtitle', $lang)}</p>

		<div class="space-y-10">
			{#each sections as section, i}
				<article class="bg-white border border-border rounded-xl p-5 md:p-10 shadow-sm">
					<div class="flex items-center gap-3 md:gap-4 mb-5">
						<span class="w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base md:text-lg font-bold flex-shrink-0">
							{i + 1}
						</span>
						<h3 class="text-2xl font-bold">{section.title}</h3>
					</div>
					<div class="text-lg text-text-muted leading-relaxed whitespace-pre-line">{section.content}</div>
					{#if section.formula}
						<div class="formula-highlight my-5 overflow-x-auto">
							{@html renderLatex(section.formula, true)}
						</div>
					{/if}
					{#if section.after}
						<div class="text-lg text-text-muted leading-relaxed whitespace-pre-line">{section.after}</div>
					{/if}
				</article>
			{/each}
		</div>
	</div>
</div>
