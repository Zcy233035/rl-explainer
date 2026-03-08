<script lang="ts">
	import { lang, t } from '$lib/stores/i18n';
</script>

<div class="py-12 px-6 border-t border-border">
	<div class="max-w-[1400px] mx-auto text-center">
		<p class="text-lg text-text-muted">
			<span class="font-bold text-primary">RL Explainer</span> --
			{t('footer.desc', $lang)}
		</p>
		<p class="text-base text-text-muted/70 mt-3">
			{t('footer.built', $lang)}
		</p>
	</div>
</div>
