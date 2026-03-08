<script lang="ts">
	import { lang, t } from '$lib/stores/i18n';
	import Languages from 'lucide-svelte/icons/languages';
	import Star from 'lucide-svelte/icons/star';
	import Github from 'lucide-svelte/icons/github';

	const sectionKeys = ['timeline', 'pipeline', 'formula-explain', 'formulas', 'details', 'comparison', 'papers', 'article'];

	function toggleLang() {
		$lang = $lang === 'en' ? 'zh' : 'en';
	}
</script>

<nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
	<div class="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
		<a href="#" class="text-xl font-bold tracking-tight">
			<span class="text-primary">RL</span> <span class="text-text">Explainer</span>
		</a>
		<div class="hidden md:flex items-center gap-1">
			{#each sectionKeys as key}
				<a
					href="#{key}"
					class="px-4 py-2 text-base text-text-muted hover:text-primary hover:bg-surface-light rounded-md transition-colors"
				>
					{t(`nav.${key}`, $lang)}
				</a>
			{/each}
		</div>
		<div class="flex items-center gap-3">
			<button
				onclick={toggleLang}
				class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-surface-light transition-colors text-text-muted"
				title={$lang === 'en' ? 'Switch to Chinese' : '切换到英文'}
			>
				<Languages size={16} />
				<span>{$lang === 'en' ? '中文' : 'EN'}</span>
			</button>
			<a
				href="https://github.com/Zcy233035/rl-explainer"
				target="_blank"
				rel="noopener"
				class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-surface-light transition-colors text-text-muted"
			>
				<Github size={16} />
				<span>GitHub</span>
			</a>
			<a
				href="https://github.com/Zcy233035/rl-explainer"
				target="_blank"
				rel="noopener"
				class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-amber-300 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-amber-700"
			>
				<Star size={16} />
				<span>Star</span>
			</a>
		</div>
	</div>
</nav>
