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
	import Scale from 'lucide-svelte/icons/scale';
	import Copy from 'lucide-svelte/icons/copy';
	import Filter from 'lucide-svelte/icons/filter';
	import Users from 'lucide-svelte/icons/users';
	import type { Component } from 'svelte';

	let hoveredComponent: string | null = $state(null);

	interface PipelineStep {
		id: string;
		label: { en: string; zh: string };
		desc: { en: string; zh: string };
		icon: Component;
		highlight?: boolean;
	}

	const pipelineConfigs: Record<string, PipelineStep[]> = {
		reinforce: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'LLM', zh: 'LLM' }, icon: Brain },
			{ id: 'response', label: { en: 'Response y', zh: '响应 y' }, desc: { en: '1 output', zh: '1 个输出' }, icon: MessageSquare },
			{ id: 'reward', label: { en: 'Reward R', zh: '奖励 R' }, desc: { en: 'Score', zh: '评分' }, icon: Star },
			{ id: 'update', label: { en: 'Policy Update', zh: '策略更新' }, desc: { en: 'R · ∇log π', zh: 'R · ∇log π' }, icon: RefreshCw, highlight: true },
		],
		ppo: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'LLM', zh: 'LLM' }, icon: Brain },
			{ id: 'response', label: { en: 'Response y', zh: '响应 y' }, desc: { en: '1 output', zh: '1 个输出' }, icon: MessageSquare },
			{ id: 'reward', label: { en: 'Reward R', zh: '奖励 R' }, desc: { en: 'Reward model', zh: '奖励模型' }, icon: Star },
			{ id: 'critic', label: { en: 'Critic V(s)', zh: 'Critic V(s)' }, desc: { en: 'GAE advantage', zh: 'GAE 优势' }, icon: Scale, highlight: true },
			{ id: 'update', label: { en: 'Clip Update', zh: '裁剪更新' }, desc: { en: 'min-clip + KL', zh: 'min-clip + KL' }, icon: RefreshCw },
		],
		rlhf: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'SFT → RL', zh: 'SFT → RL' }, icon: Brain },
			{ id: 'response', label: { en: 'Response y', zh: '响应 y' }, desc: { en: '1 output', zh: '1 个输出' }, icon: MessageSquare },
			{ id: 'reward', label: { en: 'Reward R_φ', zh: '奖励 R_φ' }, desc: { en: 'Learned model', zh: '学习的模型' }, icon: Star, highlight: true },
			{ id: 'critic', label: { en: 'Critic V(s)', zh: 'Critic V(s)' }, desc: { en: 'GAE advantage', zh: 'GAE 优势' }, icon: Scale, highlight: true },
			{ id: 'update', label: { en: 'PPO Update', zh: 'PPO 更新' }, desc: { en: 'Clip + KL', zh: '裁剪 + KL' }, icon: RefreshCw },
		],
		dpo: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'pref', label: { en: 'Pref Pair', zh: '偏好对' }, desc: { en: 'y_w vs y_l', zh: 'y_w vs y_l' }, icon: Users, highlight: true },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'LLM', zh: 'LLM' }, icon: Brain },
			{ id: 'ref', label: { en: 'Ref π_ref', zh: '参考 π_ref' }, desc: { en: 'Frozen SFT', zh: '冻结 SFT' }, icon: Copy },
			{ id: 'update', label: { en: 'Direct Optim', zh: '直接优化' }, desc: { en: 'log σ(Δ)', zh: 'log σ(Δ)' }, icon: RefreshCw, highlight: true },
		],
		grpo: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'LLM', zh: 'LLM' }, icon: Brain },
			{ id: 'response', label: { en: 'G Responses', zh: 'G 个响应' }, desc: { en: 'Sample group', zh: '采样组' }, icon: MessageSquare, highlight: true },
			{ id: 'reward', label: { en: 'Reward R', zh: '奖励 R' }, desc: { en: 'Score each', zh: '逐个评分' }, icon: Star },
			{ id: 'advantage', label: { en: 'Group Adv', zh: '组优势' }, desc: { en: '(R-μ)/σ', zh: '(R-μ)/σ' }, icon: BarChart3, highlight: true },
			{ id: 'update', label: { en: 'Clip Update', zh: '裁剪更新' }, desc: { en: 'Per-token r', zh: '逐 token r' }, icon: RefreshCw },
		],
		dapo: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'LLM', zh: 'LLM' }, icon: Brain },
			{ id: 'response', label: { en: 'Dynamic G', zh: '动态 G' }, desc: { en: '0<correct<G', zh: '0<正确<G' }, icon: MessageSquare, highlight: true },
			{ id: 'reward', label: { en: 'Reward R', zh: '奖励 R' }, desc: { en: 'Score each', zh: '逐个评分' }, icon: Star },
			{ id: 'advantage', label: { en: 'Group Adv', zh: '组优势' }, desc: { en: '(R-μ)/σ', zh: '(R-μ)/σ' }, icon: BarChart3 },
			{ id: 'update', label: { en: 'Clip-Higher', zh: '非对称裁剪' }, desc: { en: 'ε_low ≠ ε_high', zh: 'ε_low ≠ ε_high' }, icon: RefreshCw, highlight: true },
		],
		gspo: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'LLM', zh: 'LLM' }, icon: Brain },
			{ id: 'response', label: { en: 'G Responses', zh: 'G 个响应' }, desc: { en: 'Sample group', zh: '采样组' }, icon: MessageSquare },
			{ id: 'reward', label: { en: 'Reward R', zh: '奖励 R' }, desc: { en: 'Score each', zh: '逐个评分' }, icon: Star },
			{ id: 'advantage', label: { en: 'Group Adv', zh: '组优势' }, desc: { en: '(R-μ)/σ', zh: '(R-μ)/σ' }, icon: BarChart3 },
			{ id: 'update', label: { en: 'Seq-Level', zh: '序列级更新' }, desc: { en: 'Ratio sᵢ', zh: '比率 sᵢ' }, icon: RefreshCw, highlight: true },
		],
		reinforce_pp: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'LLM', zh: 'LLM' }, icon: Brain },
			{ id: 'response', label: { en: 'Response y', zh: '响应 y' }, desc: { en: '1 output', zh: '1 个输出' }, icon: MessageSquare },
			{ id: 'reward', label: { en: 'Reward R', zh: '奖励 R' }, desc: { en: 'Score', zh: '评分' }, icon: Star },
			{ id: 'advantage', label: { en: 'Global Adv', zh: '全局优势' }, desc: { en: 'All prompts', zh: '跨所有提示' }, icon: BarChart3, highlight: true },
			{ id: 'update', label: { en: 'Clip + KL', zh: '裁剪 + KL' }, desc: { en: 'Per-token r', zh: '逐 token r' }, icon: RefreshCw },
		],
		vapo: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'LLM', zh: 'LLM' }, icon: Brain },
			{ id: 'response', label: { en: 'G Responses', zh: 'G 个响应' }, desc: { en: 'Sample group', zh: '采样组' }, icon: MessageSquare },
			{ id: 'reward', label: { en: 'Reward R', zh: '奖励 R' }, desc: { en: 'Score each', zh: '逐个评分' }, icon: Star },
			{ id: 'critic', label: { en: 'Pretrained V', zh: '预训练 V' }, desc: { en: 'Decoupled GAE', zh: '解耦 GAE' }, icon: Scale, highlight: true },
			{ id: 'update', label: { en: 'Clip Update', zh: '裁剪更新' }, desc: { en: 'Per-token Aₜ', zh: '逐 token Aₜ' }, icon: RefreshCw },
		],
		gmpo: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'LLM', zh: 'LLM' }, icon: Brain },
			{ id: 'response', label: { en: 'G Responses', zh: 'G 个响应' }, desc: { en: 'Sample group', zh: '采样组' }, icon: MessageSquare },
			{ id: 'reward', label: { en: 'Reward R', zh: '奖励 R' }, desc: { en: 'Score each', zh: '逐个评分' }, icon: Star },
			{ id: 'advantage', label: { en: 'Group Adv', zh: '组优势' }, desc: { en: '(R-μ)/σ', zh: '(R-μ)/σ' }, icon: BarChart3 },
			{ id: 'update', label: { en: 'Geo-Mean', zh: '几何平均' }, desc: { en: '(∏rₜ)^(1/T)', zh: '(∏rₜ)^(1/T)' }, icon: RefreshCw, highlight: true },
		],
		gfpo: [
			{ id: 'prompt', label: { en: 'Prompt x', zh: '提示 x' }, desc: { en: 'Input', zh: '输入' }, icon: FileText },
			{ id: 'policy', label: { en: 'Policy π_θ', zh: '策略 π_θ' }, desc: { en: 'LLM', zh: 'LLM' }, icon: Brain },
			{ id: 'response', label: { en: 'G Responses', zh: 'G 个响应' }, desc: { en: 'Sample group', zh: '采样组' }, icon: MessageSquare },
			{ id: 'reward', label: { en: 'Reward R', zh: '奖励 R' }, desc: { en: 'Score each', zh: '逐个评分' }, icon: Star },
			{ id: 'filter', label: { en: 'Filter Sᶠ', zh: '过滤 Sᶠ' }, desc: { en: 'R/len > τ', zh: 'R/长度 > τ' }, icon: Filter, highlight: true },
			{ id: 'update', label: { en: 'Clip Update', zh: '裁剪更新' }, desc: { en: 'Concise only', zh: '仅简洁响应' }, icon: RefreshCw },
		],
	};

	let algo = $derived($selectedAlgorithm);
	let steps = $derived(pipelineConfigs[$selectedAlgorithmId] ?? pipelineConfigs.grpo);
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

		<div class="bg-white border border-border rounded-xl p-4 md:p-10 mb-8 shadow-sm">
			<div class="flex items-center gap-1 md:gap-3 md:justify-between overflow-x-auto pb-4 -webkit-overflow-scrolling-touch">
				{#each steps as step, i}
					<div class="flex items-center min-w-0 flex-shrink-0">
						<button
							class="flex flex-col items-center p-2 md:p-4 rounded-xl transition-all min-w-[80px] md:min-w-[110px] border-2"
							class:border-transparent={hoveredComponent !== step.id && !step.highlight}
							class:border-primary={hoveredComponent === step.id}
							class:bg-indigo-50={hoveredComponent === step.id}
							onmouseenter={() => hoveredComponent = step.id}
							onmouseleave={() => hoveredComponent = null}
							style={step.highlight && hoveredComponent !== step.id ? `border-color: ${algo.color}30; background: ${algo.color}08;` : ''}
						>
							<span class="mb-1 md:mb-2" style={step.highlight ? `color: ${algo.color};` : 'color: var(--color-text-muted);'}>
								<step.icon size={22} strokeWidth={1.5} class="md:hidden" />
								<step.icon size={28} strokeWidth={1.5} class="hidden md:block" />
							</span>
							<span class="text-xs md:text-base font-mono font-bold whitespace-nowrap" style={step.highlight ? `color: ${algo.color};` : 'color: var(--color-text);'}>
								{step.label[$lang]}
							</span>
							<span class="text-xs md:text-sm text-text-muted mt-0.5 md:mt-1">{step.desc[$lang]}</span>
						</button>
						{#if i < steps.length - 1}
							<svg class="w-5 h-5 md:w-8 md:h-8 text-primary/50 flex-shrink-0 mx-0.5 md:mx-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
			<div class="bg-white border border-border rounded-xl p-5 md:p-8 shadow-sm">
				<h3 class="text-lg md:text-xl font-bold mb-4">
					<span style="color:{algo.color}">{algo.name}</span> {t('pipeline.components', $lang)}
				</h3>
				<div class="flex flex-wrap gap-2">
					{#each specifics.extras as extra}
						<span class="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base font-mono bg-surface-light border border-border rounded-lg" style="border-left: 4px solid {algo.color}">
							{extra}
						</span>
					{/each}
					{#if specifics.extras.length === 0}
						<span class="text-base text-text-muted italic">{t('pipeline.noextra', $lang)}</span>
					{/if}
				</div>
			</div>
			<div class="bg-white border border-border rounded-xl p-5 md:p-8 shadow-sm">
				<h3 class="text-lg md:text-xl font-bold text-accent mb-4">{t('pipeline.mechanism', $lang)}</h3>
				<p class="text-lg text-text-muted leading-relaxed">{specifics.notes}</p>
			</div>
		</div>
	</div>
</div>
