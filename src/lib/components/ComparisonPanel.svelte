<script lang="ts">
	import { algorithms } from '$lib/data/algorithms';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { lang, t } from '$lib/stores/i18n';

	let leftId = $state('ppo');
	let rightId = $state('grpo');
	let radarSvg: SVGSVGElement;

	let leftAlgo = $derived(algorithms.find(a => a.id === leftId)!);
	let rightAlgo = $derived(algorithms.find(a => a.id === rightId)!);

	const metricKeys = ['stability', 'memoryEfficiency', 'trainingSpeed', 'quality', 'complexity'];

	function drawRadar() {
		if (!radarSvg) return;
		const svg = d3.select(radarSvg);
		svg.selectAll('*').remove();

		const metricLabels: Record<string, string> = {
			stability: t('metric.stability', $lang),
			memoryEfficiency: t('metric.memoryEfficiency', $lang),
			trainingSpeed: t('metric.trainingSpeed', $lang),
			quality: t('metric.quality', $lang),
			complexity: t('metric.complexity', $lang)
		};

		const w = 380, h = 380;
		const cx = w / 2, cy = h / 2;
		const r = 140;
		const n = metricKeys.length;
		const angleSlice = (2 * Math.PI) / n;

		svg.attr('viewBox', `0 0 ${w} ${h}`);

		for (let i = 1; i <= 5; i++) {
			const gr = (r * i) / 5;
			svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', gr)
				.attr('fill', 'none').attr('stroke', '#e2e8f0').attr('stroke-width', 1).attr('stroke-dasharray', '3,4');
		}

		for (let i = 0; i < n; i++) {
			const angle = angleSlice * i - Math.PI / 2;
			const x2 = cx + r * Math.cos(angle);
			const y2 = cy + r * Math.sin(angle);
			svg.append('line').attr('x1', cx).attr('y1', cy).attr('x2', x2).attr('y2', y2)
				.attr('stroke', '#e2e8f0').attr('stroke-width', 1);
			const lx = cx + (r + 28) * Math.cos(angle);
			const ly = cy + (r + 28) * Math.sin(angle);
			svg.append('text').attr('x', lx).attr('y', ly)
				.attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
				.attr('fill', '#475569').attr('font-size', '14px').attr('font-weight', '500')
				.text(metricLabels[metricKeys[i]]);
		}

		function polyPoints(metrics: Record<string, number>) {
			return metricKeys.map((k, i) => {
				const val = (metrics[k as keyof typeof metrics] as number) / 10;
				const angle = angleSlice * i - Math.PI / 2;
				return [cx + r * val * Math.cos(angle), cy + r * val * Math.sin(angle)] as [number, number];
			});
		}

		function drawPoly(points: [number, number][], color: string) {
			const line = d3.line<[number, number]>().x(d => d[0]).y(d => d[1]).curve(d3.curveLinearClosed);
			svg.append('path').attr('d', line(points))
				.attr('fill', color).attr('fill-opacity', 0.12)
				.attr('stroke', color).attr('stroke-width', 2.5);
			points.forEach(p => {
				svg.append('circle').attr('cx', p[0]).attr('cy', p[1]).attr('r', 5)
					.attr('fill', color).attr('stroke', 'white').attr('stroke-width', 2);
			});
		}

		drawPoly(polyPoints(leftAlgo.metrics), leftAlgo.color);
		drawPoly(polyPoints(rightAlgo.metrics), rightAlgo.color);
	}

	$effect(() => {
		leftAlgo; rightAlgo; $lang;
		drawRadar();
	});

	onMount(drawRadar);

	const comparisonRowKeys = ['critic', 'reward_model', 'reference', 'is_level', 'kl', 'memory'];

	function getProperty(algoId: string, key: string): string {
		const props: Record<string, Record<string, string>> = {
			reinforce: { critic: 'No', reward_model: 'Yes', reference: 'No', is_level: 'N/A', kl: 'No', memory: '1' },
			ppo: { critic: 'Yes', reward_model: 'Yes', reference: 'Yes', is_level: 'Token', kl: 'Yes', memory: '4' },
			rlhf: { critic: 'Yes', reward_model: 'Yes', reference: 'Yes', is_level: 'Token', kl: 'Yes', memory: '4' },
			dpo: { critic: 'No', reward_model: 'No', reference: 'Yes', is_level: 'N/A', kl: 'Implicit', memory: '2' },
			grpo: { critic: 'No', reward_model: 'Yes', reference: 'Yes', is_level: 'Token', kl: 'Yes', memory: '3' },
			dapo: { critic: 'No', reward_model: 'Yes', reference: 'Yes', is_level: 'Token', kl: 'No', memory: '3' },
			gspo: { critic: 'No', reward_model: 'Yes', reference: 'Yes', is_level: 'Sequence', kl: 'Optional', memory: '3' },
			reinforce_pp: { critic: 'No', reward_model: 'Yes', reference: 'Yes', is_level: 'Token', kl: 'Yes', memory: '3' },
			vapo: { critic: 'Yes', reward_model: 'Yes', reference: 'Yes', is_level: 'Token', kl: 'Yes', memory: '4' },
			gmpo: { critic: 'No', reward_model: 'Yes', reference: 'Yes', is_level: 'Token (geo)', kl: 'Yes', memory: '3' },
			gfpo: { critic: 'No', reward_model: 'Yes', reference: 'Yes', is_level: 'Token', kl: 'Yes', memory: '3' }
		};
		return props[algoId]?.[key] || '-';
	}
</script>

<div class="py-20 px-6">
	<div class="max-w-[1400px] mx-auto">
		<h2 class="text-4xl font-bold text-center mb-3">{t('compare.title', $lang)}</h2>
		<p class="text-text-muted text-center mb-10 text-lg">{t('compare.subtitle', $lang)}</p>

		<div class="grid md:grid-cols-2 gap-6 mb-10">
			<div>
				<label class="text-base text-text-muted mb-2 block font-medium">{t('compare.left', $lang)}</label>
				<select bind:value={leftId} class="w-full bg-white border border-border text-text rounded-lg px-4 py-3 text-base">
					{#each algorithms as a}
						<option value={a.id}>{a.name} ({a.year})</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="text-base text-text-muted mb-2 block font-medium">{t('compare.right', $lang)}</label>
				<select bind:value={rightId} class="w-full bg-white border border-border text-text rounded-lg px-4 py-3 text-base">
					{#each algorithms as a}
						<option value={a.id}>{a.name} ({a.year})</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-6 md:gap-8">
			<div class="bg-white border border-border rounded-xl p-5 md:p-8 flex flex-col items-center shadow-sm">
				<h3 class="text-xl font-bold text-primary mb-6">{t('compare.radar', $lang)}</h3>
				<svg bind:this={radarSvg} class="w-full max-w-[380px]"></svg>
				<div class="flex gap-8 mt-6 text-base">
					<span class="flex items-center gap-2">
						<span class="w-4 h-4 rounded-full" style="background:{leftAlgo.color}"></span>
						<span class="font-medium">{leftAlgo.name}</span>
					</span>
					<span class="flex items-center gap-2">
						<span class="w-4 h-4 rounded-full" style="background:{rightAlgo.color}"></span>
						<span class="font-medium">{rightAlgo.name}</span>
					</span>
				</div>
			</div>

			<div class="bg-white border border-border rounded-xl p-5 md:p-8 shadow-sm overflow-x-auto">
				<h3 class="text-xl font-bold text-primary mb-6">{t('compare.feature', $lang)}</h3>
				<table class="w-full text-sm md:text-base">
					<thead>
						<tr class="border-b-2 border-border">
							<th class="text-left text-text-muted py-3">Feature</th>
							<th class="text-center py-3 font-bold" style="color:{leftAlgo.color}">{leftAlgo.name}</th>
							<th class="text-center py-3 font-bold" style="color:{rightAlgo.color}">{rightAlgo.name}</th>
						</tr>
					</thead>
					<tbody>
						{#each comparisonRowKeys as key}
							<tr class="border-b border-border/50">
								<td class="py-3 text-base text-text-muted">{t(`feature.${key}`, $lang)}</td>
								<td class="py-3 text-base text-center font-mono">{getProperty(leftId, key)}</td>
								<td class="py-3 text-base text-center font-mono">{getProperty(rightId, key)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<div class="mt-10 bg-white border border-border rounded-xl p-8 overflow-x-auto shadow-sm">
			<h3 class="text-xl font-bold text-primary mb-6">{t('compare.all', $lang)}</h3>
			<table class="w-full text-base min-w-[900px]">
				<thead>
					<tr class="border-b-2 border-border">
						<th class="text-left py-3 px-3">{$lang === 'zh' ? '算法' : 'Algorithm'}</th>
						<th class="py-3 px-3">{$lang === 'zh' ? '年份' : 'Year'}</th>
						<th class="py-3 px-3">Critic?</th>
						<th class="py-3 px-3">IS Level</th>
						<th class="py-3 px-3">KL?</th>
						<th class="py-3 px-3">{$lang === 'zh' ? '模型数' : 'Models'}</th>
						<th class="py-3 px-3">{t('metric.stability', $lang)}</th>
						<th class="py-3 px-3">{t('metric.trainingSpeed', $lang)}</th>
						<th class="py-3 px-3">{t('metric.quality', $lang)}</th>
					</tr>
				</thead>
				<tbody>
					{#each algorithms as a}
						<tr class="border-b border-border/30 hover:bg-surface-light/50 transition-colors">
							<td class="py-3 px-3 font-bold" style="color:{a.color}">{a.name}</td>
							<td class="py-3 px-3 text-center text-text-muted">{a.year}</td>
							<td class="py-3 px-3 text-center">{getProperty(a.id, 'critic')}</td>
							<td class="py-3 px-3 text-center">{getProperty(a.id, 'is_level')}</td>
							<td class="py-3 px-3 text-center">{getProperty(a.id, 'kl')}</td>
							<td class="py-3 px-3 text-center">{getProperty(a.id, 'memory')}</td>
							<td class="py-3 px-3 text-center">
								<span class="inline-block w-20 h-2.5 bg-surface-light rounded-full overflow-hidden">
									<span class="block h-full rounded-full" style="width:{a.metrics.stability * 10}%; background:{a.color}"></span>
								</span>
							</td>
							<td class="py-3 px-3 text-center">
								<span class="inline-block w-20 h-2.5 bg-surface-light rounded-full overflow-hidden">
									<span class="block h-full rounded-full" style="width:{a.metrics.trainingSpeed * 10}%; background:{a.color}"></span>
								</span>
							</td>
							<td class="py-3 px-3 text-center">
								<span class="inline-block w-20 h-2.5 bg-surface-light rounded-full overflow-hidden">
									<span class="block h-full rounded-full" style="width:{a.metrics.quality * 10}%; background:{a.color}"></span>
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
