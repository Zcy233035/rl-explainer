<script lang="ts">
	import { algorithms } from '$lib/data/algorithms';
	import { lang } from '$lib/stores/i18n';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import FileText from 'lucide-svelte/icons/file-text';

	interface PaperEntry {
		title: string;
		url: string;
		year: number;
		algoName: string;
		algoColor: string;
		origin: string;
	}

	const allPapers: PaperEntry[] = algorithms.flatMap(a =>
		a.papers.map(p => ({
			title: p.title,
			url: p.url,
			year: p.year,
			algoName: a.name,
			algoColor: a.color,
			origin: a.origin
		}))
	);

	const papersByYear = $derived(
		[...new Set(allPapers.map(p => p.year))]
			.sort((a, b) => b - a)
			.map(year => ({ year, papers: allPapers.filter(p => p.year === year) }))
	);

	function getDomain(url: string): string {
		try {
			const host = new URL(url).hostname;
			if (host.includes('arxiv')) return 'arXiv';
			if (host.includes('openreview')) return 'OpenReview';
			if (host.includes('springer')) return 'Springer';
			return host;
		} catch { return ''; }
	}
</script>

<div class="py-20 px-6">
	<div class="max-w-[1400px] mx-auto">
		<h2 class="text-4xl font-bold text-center mb-3">
			{$lang === 'zh' ? '论文集' : 'Papers'}
		</h2>
		<p class="text-text-muted text-center mb-12 text-lg">
			{$lang === 'zh' ? '所有算法的原始论文，一键直达' : 'Original papers for every algorithm — one click to read'}
		</p>

		<div class="space-y-10">
			{#each papersByYear as group}
				<div>
					<div class="flex items-center gap-4 mb-5">
						<span class="text-2xl font-bold text-text">{group.year}</span>
						<div class="flex-1 h-px bg-border"></div>
						<span class="text-base text-text-muted">
							{group.papers.length} {$lang === 'zh' ? '篇' : group.papers.length === 1 ? 'paper' : 'papers'}
						</span>
					</div>

					<div class="grid md:grid-cols-2 gap-4">
						{#each group.papers as paper}
							<a
								href={paper.url}
								target="_blank"
								rel="noopener"
								class="group bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 flex gap-5 items-start"
							>
								<div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style="background: {paper.algoColor}15;">
									<FileText size={22} color={paper.algoColor} strokeWidth={1.5} />
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2 mb-2">
										<span
											class="px-2.5 py-0.5 text-xs font-bold rounded-md text-white"
											style="background: {paper.algoColor};"
										>
											{paper.algoName}
										</span>
										<span class="text-xs text-text-muted font-medium px-2 py-0.5 bg-surface-light rounded-md border border-border">
											{getDomain(paper.url)}
										</span>
									</div>
									<p class="text-base font-medium text-text leading-snug group-hover:text-primary transition-colors">
										{paper.title}
									</p>
									<p class="text-sm text-text-muted mt-1">{paper.origin} · {paper.year}</p>
								</div>
								<div class="flex-shrink-0 mt-1 text-text-muted/40 group-hover:text-primary transition-colors">
									<ExternalLink size={18} />
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
