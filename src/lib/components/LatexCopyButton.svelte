<script lang="ts">
	import { lang } from '$lib/stores/i18n';
	import Copy from 'lucide-svelte/icons/copy';
	import Check from 'lucide-svelte/icons/check';

	interface Props {
		latex: string;
		class?: string;
	}

	let { latex, class: className = '' }: Props = $props();

	let copied = $state(false);
	let showButton = $state(false);

	async function handleCopy() {
		if (!latex) return;
		try {
			await navigator.clipboard.writeText(latex);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Fallback
			const textarea = document.createElement('textarea');
			textarea.value = latex;
			textarea.style.cssText = 'position:fixed;opacity:0';
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			textarea.remove();
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}
</script>

<div
	class="latex-copy-wrapper {className}"
	onmouseenter={() => (showButton = true)}
	onmouseleave={() => {
		showButton = false;
		copied = false;
	}}
>
	<slot />
	{#if latex}
		<button
			class="latex-copy-btn"
			class:opacity-0={!showButton && !copied}
			class:opacity-100={showButton || copied}
			onclick={handleCopy}
			title={latex}
		>
			{#if copied}
				<Check size={14} />
				<span>{$lang === 'zh' ? '已复制' : 'Copied'}</span>
			{:else}
				<Copy size={14} />
				<span>LaTeX</span>
			{/if}
		</button>
	{/if}
</div>

<style>
	.latex-copy-wrapper {
		position: relative;
	}
	.latex-copy-btn {
		position: absolute;
		top: 8px;
		right: 8px;
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px 10px;
		font-size: 11px;
		font-weight: 600;
		color: #6366f1;
		background: white;
		border: 1px solid #c7d2fe;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.15s ease;
		z-index: 10;
	}
	.latex-copy-btn:hover {
		background: #eef2ff;
		border-color: #6366f1;
	}
	.latex-copy-btn:active {
		transform: scale(0.95);
	}
	/* Mobile: always show button */
	@media (max-width: 767px) {
		.latex-copy-btn {
			opacity: 1 !important;
		}
	}
</style>
