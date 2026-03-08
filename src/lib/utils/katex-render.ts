import katex from 'katex';

export function renderLatex(tex: string, displayMode = false): string {
	// Pre-process: fix common issues that trip up KaTeX
	let processed = tex
		// \! (negative thin space) can cause issues in some contexts, replace with nothing
		.replace(/\\!/g, '\\,')
		// Ensure \text{} commands don't contain problematic characters
		.replace(/\\text\{([^}]*)\}/g, (_, content) => {
			return `\\text{${content.replace(/_/g, '\\_')}}`;
		});

	try {
		return katex.renderToString(processed, {
			displayMode,
			throwOnError: false,
			trust: true,
			strict: false,
			maxSize: 500,
			maxExpand: 1000
		});
	} catch {
		// Fallback: try without display mode
		try {
			return katex.renderToString(processed, {
				displayMode: false,
				throwOnError: false,
				trust: true,
				strict: false
			});
		} catch {
			// Final fallback: render as formatted code
			return `<code class="formula-fallback">${escapeHtml(tex)}</code>`;
		}
	}
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
