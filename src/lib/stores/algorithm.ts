import { writable, derived } from 'svelte/store';
import { algorithms, getAlgorithm } from '$lib/data/algorithms';

export const selectedAlgorithmId = writable<string>('grpo');
export const compareAlgorithmId = writable<string | null>(null);
export const activeSection = writable<string>('overview');

export const selectedAlgorithm = derived(selectedAlgorithmId, ($id) => getAlgorithm($id)!);
export const compareAlgorithm = derived(compareAlgorithmId, ($id) => $id ? getAlgorithm($id) : null);
