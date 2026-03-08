export interface Algorithm {
	id: string;
	name: string;
	fullName: string;
	year: number;
	origin: string;
	color: string;
	category: 'foundation' | 'critic-free' | 'preference' | 'advanced';
	description: string;
	keyInnovation: string;
	objective: string;
	objectiveExplanation: string;
	formulaDiffs?: FormulaDiff[];
	components: PipelineComponent[];
	pros: string[];
	cons: string[];
	metrics: AlgorithmMetrics;
	papers: Paper[];
}

export interface FormulaDiff {
	label: string;
	from: string;
	to: string;
	explanation: string;
}

export interface PipelineComponent {
	id: string;
	label: string;
	type: 'model' | 'process' | 'data' | 'loss';
	required: boolean;
}

export interface AlgorithmMetrics {
	stability: number;
	memoryEfficiency: number;
	trainingSpeed: number;
	quality: number;
	complexity: number;
}

export interface Paper {
	title: string;
	url: string;
	year: number;
}

export const algorithms: Algorithm[] = [
	{
		id: 'reinforce',
		name: 'REINFORCE',
		fullName: 'REINFORCE (Williams, 1992)',
		year: 1992,
		origin: 'Williams',
		color: '#64748b',
		category: 'foundation',
		description: 'The foundational policy gradient algorithm. Directly optimizes the policy by estimating gradients from sampled trajectories using the log-derivative trick.',
		keyInnovation: 'First practical policy gradient method using the log-derivative trick (score function estimator)',
		objective: '\\nabla_\\theta J(\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta} \\left[ \\sum_{t=0}^{T} \\nabla_\\theta \\log \\pi_\\theta(a_t|s_t) \\cdot R(\\tau) \\right]',
		objectiveExplanation: 'Expected return gradient is estimated by weighting the log-probability of each action by the total trajectory return. Simple but suffers from very high variance because raw returns are used directly without any baseline.',
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reward', label: 'Reward Function', type: 'process', required: true }
		],
		pros: ['Simple to implement', 'Unbiased gradient estimates', 'Works with any differentiable policy'],
		cons: ['High variance makes training unstable (Williams, 1992)', 'Slow convergence without variance reduction', 'No built-in baseline mechanism'],
		metrics: { stability: 2, memoryEfficiency: 9, trainingSpeed: 3, quality: 3, complexity: 2 },
		papers: [{ title: 'Simple statistical gradient-following algorithms for connectionist RL', url: 'https://link.springer.com/article/10.1007/BF00992696', year: 1992 }]
	},
	{
		id: 'ppo',
		name: 'PPO',
		fullName: 'Proximal Policy Optimization',
		year: 2017,
		origin: 'OpenAI',
		color: '#3b82f6',
		category: 'foundation',
		description: 'The gold standard for RLHF. Uses a clipped surrogate objective with a learned value function (critic) for stable policy updates. Requires 4 model copies in memory.',
		keyInnovation: 'Clipped surrogate objective prevents destructive policy updates; GAE for advantage estimation',
		objective: 'L^{PPO}(\\theta) = \\mathbb{E}_t \\left[ \\min \\left( r_t(\\theta) A_t, \\; \\text{clip}(r_t(\\theta), 1-\\varepsilon, 1+\\varepsilon) A_t \\right) \\right] - \\beta D_{KL}(\\pi_\\theta \\| \\pi_{ref})',
		objectiveExplanation: 'The importance ratio measures how much more likely the new policy is to take an action vs the old policy. The advantage comes from a learned critic via GAE. The min-clip limits how much the policy can change in one step. A KL penalty keeps the policy close to the reference SFT model.',
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reference', label: 'Reference Model', type: 'model', required: true },
			{ id: 'critic', label: 'Critic / Value Model', type: 'model', required: true },
			{ id: 'reward', label: 'Reward Model', type: 'model', required: true }
		],
		pros: ['Most stable training dynamics (Schulman et al., 2017)', 'Best final quality when properly tuned', 'Industry proven at scale (OpenAI, Anthropic)'],
		cons: ['Requires 4 model copies in memory: policy, reference, critic, reward (InstructGPT)', 'Complex hyperparameter tuning required', '138% slower than REINFORCE++ in training (empirical comparison)'],
		metrics: { stability: 9, memoryEfficiency: 3, trainingSpeed: 4, quality: 9, complexity: 8 },
		papers: [{ title: 'Proximal Policy Optimization Algorithms', url: 'https://arxiv.org/abs/1707.06347', year: 2017 }]
	},
	{
		id: 'dpo',
		name: 'DPO',
		fullName: 'Direct Preference Optimization',
		year: 2023,
		origin: 'Stanford',
		color: '#8b5cf6',
		category: 'preference',
		description: 'Eliminates RL entirely by directly optimizing the policy on preference pairs (chosen vs rejected). No reward model or RL loop needed.',
		keyInnovation: 'Reparameterizes the RLHF objective to directly optimize on preference data without explicit reward modeling',
		objective: 'L^{DPO}(\\theta) = -\\mathbb{E}_{(x,y_w,y_l)} \\left[ \\log \\sigma \\left( \\beta \\left( \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)} - \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)} \\right) \\right) \\right]',
		objectiveExplanation: 'Given a preferred response and a rejected response, directly increases the relative log-probability of the preferred one. Uses the sigmoid function to create a classification-like loss. No reward model or RL training loop is needed at all.',
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reference', label: 'Reference Model', type: 'model', required: true },
			{ id: 'prefdata', label: 'Preference Pairs', type: 'data', required: true }
		],
		pros: ['No RL loop or reward model needed', 'Simple implementation and fast training', 'Low compute requirements (only 2 models)'],
		cons: ['Offline method: empirically inferior to online RL (Xu et al., 2024)', 'Tends to overfit beyond 1 epoch (Rafailov et al., 2023)', 'Quality ceiling bounded by preference data quality'],
		metrics: { stability: 7, memoryEfficiency: 7, trainingSpeed: 8, quality: 6, complexity: 3 },
		papers: [{ title: 'Direct Preference Optimization', url: 'https://arxiv.org/abs/2305.18290', year: 2023 }]
	},
	{
		id: 'rlhf',
		name: 'RLHF',
		fullName: 'Reinforcement Learning from Human Feedback',
		year: 2022,
		origin: 'OpenAI / Anthropic',
		color: '#06b6d4',
		category: 'foundation',
		description: 'The paradigm that powers ChatGPT. A 3-stage pipeline: SFT, Reward Model Training, RL Fine-tuning (typically with PPO). Not a single algorithm but a training framework.',
		keyInnovation: 'End-to-end framework: train a reward model from human preferences, then use RL to optimize policy against it',
		objective: '\\max_{\\pi_\\theta} \\; \\mathbb{E}_{x \\sim D, \\, y \\sim \\pi_\\theta(\\cdot|x)} \\left[ R_\\phi(x, y) \\right] - \\beta D_{KL}(\\pi_\\theta \\| \\pi_{ref})',
		objectiveExplanation: 'Maximize the expected reward from a learned reward model, while keeping the policy close to the reference SFT model via a KL divergence penalty. The reward model itself is trained on human preference pairs (which response is better).',
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reference', label: 'Reference Model', type: 'model', required: true },
			{ id: 'reward', label: 'Reward Model', type: 'model', required: true },
			{ id: 'critic', label: 'Critic / Value Model', type: 'model', required: true },
			{ id: 'prefdata', label: 'Human Preferences', type: 'data', required: true }
		],
		pros: ['Powers state-of-the-art models (ChatGPT, Claude)', 'Captures nuanced human preferences', 'Battle-tested at scale by multiple labs'],
		cons: ['Requires 4 models in memory simultaneously (Ouyang et al., 2022)', 'Reward model can be gamed via reward hacking (Gao et al., 2023)', 'Requires large volumes of high-quality human feedback data'],
		metrics: { stability: 8, memoryEfficiency: 2, trainingSpeed: 3, quality: 9, complexity: 9 },
		papers: [
			{ title: 'Training language models to follow instructions with human feedback', url: 'https://arxiv.org/abs/2203.02155', year: 2022 },
			{ title: 'Learning to summarize from human feedback', url: 'https://arxiv.org/abs/2009.01325', year: 2020 }
		]
	},
	{
		id: 'grpo',
		name: 'GRPO',
		fullName: 'Group Relative Policy Optimization',
		year: 2024,
		origin: 'DeepSeek',
		color: '#10b981',
		category: 'critic-free',
		description: 'Eliminates the critic model by estimating advantages from groups of responses to the same prompt. Used to train DeepSeek-R1. Reduces memory by ~40%.',
		keyInnovation: 'No critic needed -- compute advantage as normalized reward within a group of G sampled responses',
		objective: 'J^{GRPO}(\\theta) = \\mathbb{E} \\left[ \\frac{1}{G} \\sum_{i=1}^{G} \\frac{1}{|o_i|} \\sum_{t=1}^{|o_i|} \\left( \\min\\left( r_{i,t} A_i, \\; \\text{clip}(r_{i,t}, 1-\\varepsilon, 1+\\varepsilon) A_i \\right) - \\beta D_{KL} \\right) \\right]',
		objectiveExplanation: 'For each prompt, sample G responses and compute a per-token importance ratio for each. The advantage for each response is simply its reward normalized (subtract mean, divide by std) within the group -- no critic needed. The loss is averaged first per-token within each response, then across all G responses.',
		formulaDiffs: [
			{
				label: 'vs PPO: Advantage Computation',
				from: 'A_t = \\text{GAE}(V_\\phi, r, \\gamma, \\lambda)',
				to: 'A_i = \\frac{R_i - \\text{mean}(\\{R_1,...,R_G\\})}{\\text{std}(\\{R_1,...,R_G\\})}',
				explanation: 'Replaces the learned value function (critic) with simple group-relative normalization: subtract the mean reward and divide by the standard deviation within the group. This eliminates the need for a critic model entirely.'
			},
			{
				label: 'vs PPO: Loss Aggregation',
				from: '\\mathbb{E}_t[\\cdot]',
				to: '\\frac{1}{G}\\sum_{i=1}^G \\frac{1}{|o_i|}\\sum_{t=1}^{|o_i|}[\\cdot]',
				explanation: 'First averages per-token loss within each response (dividing by response length), then averages across all G responses in the group. This two-level averaging is a key structural difference.'
			}
		],
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reference', label: 'Reference Model', type: 'model', required: true },
			{ id: 'reward', label: 'Reward Model', type: 'model', required: true }
		],
		pros: ['Eliminates critic model, saving ~40% GPU memory (DeepSeek, 2024)', 'Enabled DeepSeek-R1 reasoning breakthroughs (AIME 15.6% to 71.0%)', 'Simple advantage computation from group statistics'],
		cons: ['Token-level importance sampling introduces high variance (GSPO paper, 2025)', 'Can suffer irreversible model collapse in long training runs (Qwen team)', 'Three biases identified: baseline bias, length bias, difficulty bias (Dr. GRPO)'],
		metrics: { stability: 5, memoryEfficiency: 7, trainingSpeed: 7, quality: 7, complexity: 5 },
		papers: [
			{ title: 'DeepSeekMath: Pushing the Limits of Mathematical Reasoning', url: 'https://arxiv.org/abs/2402.03300', year: 2024 },
			{ title: 'DeepSeek-R1', url: 'https://arxiv.org/abs/2501.12948', year: 2025 }
		]
	},
	{
		id: 'dapo',
		name: 'DAPO',
		fullName: 'Decoupled Clip & Dynamic Sampling Policy Optimization',
		year: 2025,
		origin: 'ByteDance',
		color: '#f97316',
		category: 'advanced',
		description: 'Refines GRPO with 4 targeted improvements: Clip-Higher, Dynamic Sampling, Token-Level Gradient Loss, and Overlong Reward Shaping.',
		keyInnovation: 'Decoupled upper/lower clip bounds + dynamic sampling to ensure gradient diversity + token-level loss normalization',
		objective: 'J^{DAPO}(\\theta) = \\mathbb{E} \\left[ \\frac{1}{\\sum_i |o_i|} \\sum_{i=1}^{G} \\sum_{t=1}^{|o_i|} \\min\\left( r_{i,t} A_i, \\; \\text{clip}(r_{i,t}, 1-\\varepsilon_{low}, 1+\\varepsilon_{high}) A_i \\right) \\right]',
		objectiveExplanation: 'Four key changes from GRPO: (1) Clip-Higher: the upper clip bound is larger than the lower, encouraging exploration of rare good tokens; (2) Token-Level Loss: normalizes by total token count instead of per-response averaging, so long responses are not diluted; (3) KL penalty is removed entirely; (4) Dynamic Sampling ensures each batch contains both correct and incorrect answers.',
		formulaDiffs: [
			{
				label: 'vs GRPO: Clip-Higher',
				from: '\\text{clip}(r_{i,t}, 1-\\varepsilon, 1+\\varepsilon)',
				to: '\\text{clip}(r_{i,t}, 1-\\varepsilon_{low}, 1+\\varepsilon_{high})',
				explanation: 'The upper clip bound is set higher than the lower bound. This fixes the "Matthew Effect" where low-probability good tokens get capped too early -- rare but valuable actions now have room to grow.'
			},
			{
				label: 'vs GRPO: Token-Level Loss',
				from: '\\frac{1}{G}\\sum_i \\frac{1}{|o_i|}\\sum_t',
				to: '\\frac{1}{\\sum_i |o_i|}\\sum_i \\sum_t',
				explanation: 'Instead of averaging per-response then per-group, normalizes by the total token count across all responses. This prevents long high-quality responses from having their gradient signal diluted.'
			},
			{
				label: 'vs GRPO: KL Penalty Removed',
				from: '- \\beta D_{KL}(\\pi_\\theta \\| \\pi_{ref})',
				to: '\\text{(removed)}',
				explanation: 'The KL divergence penalty is removed entirely. Research has shown it is not necessary for reasoning tasks and can actually hinder exploration.'
			},
			{
				label: 'vs GRPO: Dynamic Sampling',
				from: '\\text{sample } G \\text{ responses}',
				to: '\\text{s.t. } 0 < |\\{\\text{correct}\\}| < G',
				explanation: 'Enforces that each batch contains both correct and incorrect answers. If all G responses are correct or all are wrong, the advantage is zero and the batch is wasted. Dynamic sampling resamples until diversity is guaranteed.'
			}
		],
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reference', label: 'Reference Model', type: 'model', required: true },
			{ id: 'reward', label: 'Reward / Verifier', type: 'process', required: true }
		],
		pros: ['Achieved 50 points on AIME 2024 with Qwen2.5-32B (DAPO paper)', 'Fully open-source training system (NeurIPS 2025 poster)', 'Four targeted, independently validated improvements over GRPO'],
		cons: ['Dynamic Sampling increases wall-clock time when model accuracy is extreme (DAPO paper)', 'Still uses token-level importance sampling, inheriting MoE instability from GRPO', 'Disabling Dynamic Sampling sometimes yields better results (empirical finding)'],
		metrics: { stability: 7, memoryEfficiency: 7, trainingSpeed: 6, quality: 8, complexity: 7 },
		papers: [{ title: 'DAPO: An Open-Source LLM Reinforcement Learning System', url: 'https://arxiv.org/abs/2503.14476', year: 2025 }]
	},
	{
		id: 'gspo',
		name: 'GSPO',
		fullName: 'Group Sequence Policy Optimization',
		year: 2025,
		origin: 'Qwen / Alibaba',
		color: '#ec4899',
		category: 'advanced',
		description: 'Shifts optimization from token-level to sequence-level. Replaces per-token importance ratio with a sequence-level ratio, fundamentally fixing GRPO instability in MoE.',
		keyInnovation: 'Sequence-level importance ratio replaces per-token ratio. All tokens in a sequence share the same weight.',
		objective: 'J^{GSPO}(\\theta) = \\mathbb{E} \\left[ \\frac{1}{G} \\sum_{i=1}^{G} \\frac{1}{|o_i|} \\sum_{t=1}^{|o_i|} \\min\\left( s_i A_i, \\; \\text{clip}(s_i, 1-\\varepsilon, 1+\\varepsilon) A_i \\right) \\right]',
		objectiveExplanation: 'The crucial change: the importance ratio is computed at the sequence level (geometric mean of all token ratios), not per-token. This means all tokens in a response share the same weight. If clipping triggers, the entire sequence is clipped uniformly. This eliminates per-token variance and is critical for MoE model stability.',
		formulaDiffs: [
			{
				label: 'vs GRPO: Importance Ratio',
				from: 'r_{i,t} = \\frac{\\pi_\\theta(o_{i,t}|q,o_{i,<t})}{\\pi_{old}(o_{i,t}|q,o_{i,<t})}',
				to: 's_i = \\exp\\left(\\frac{1}{|o_i|}\\sum_{t=1}^{|o_i|} \\log \\frac{\\pi_\\theta(o_{i,t}|q,o_{i,<t})}{\\pi_{old}(o_{i,t}|q,o_{i,<t})}\\right)',
				explanation: 'Replaces per-token ratio with a sequence-level ratio: the geometric mean of all token ratios. All tokens in a response share the same importance weight, eliminating the per-token variance that causes instability in MoE architectures.'
			},
			{
				label: 'vs GRPO: Clipping Scope',
				from: '\\text{clip per token } r_{i,t}',
				to: '\\text{clip per sequence } s_i',
				explanation: 'Clipping applies to the entire sequence uniformly, not to random individual tokens. This produces a much more consistent gradient signal and avoids the noise accumulation problem in long sequences.'
			}
		],
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reference', label: 'Reference Model', type: 'model', required: true },
			{ id: 'reward', label: 'Reward / Verifier', type: 'process', required: true }
		],
		pros: ['Inherently resolves MoE training instability without Routing Replay (Qwen, 2025)', 'Powers the Qwen3 model series', 'Higher training efficiency than GRPO under the same compute budget'],
		cons: ['Sequence-level clipping loses fine-grained per-token control (by design)', 'Relatively new, less community adoption and third-party validation', 'May underperform token-level methods on tasks requiring precise token credit assignment'],
		metrics: { stability: 9, memoryEfficiency: 7, trainingSpeed: 8, quality: 9, complexity: 5 },
		papers: [{ title: 'GSPO: Group Sequence Policy Optimization', url: 'https://arxiv.org/abs/2507.18071', year: 2025 }]
	},
	{
		id: 'reinforce_pp',
		name: 'REINFORCE++',
		fullName: 'REINFORCE++ with Global Normalization',
		year: 2025,
		origin: 'Community',
		color: '#14b8a6',
		category: 'critic-free',
		description: 'Achieves PPO-like stability without a value network by combining clipped updates, KL penalty, and global advantage normalization across all prompts.',
		keyInnovation: 'Global advantage normalization across all prompts (not per-group like GRPO) for maximum stability',
		objective: 'L^{R++}(\\theta) = \\mathbb{E}_t \\left[ \\min\\left( r_t A_t^{global}, \\; \\text{clip}(r_t, 1-\\varepsilon, 1+\\varepsilon) A_t^{global} \\right) \\right] - \\beta D_{KL}',
		objectiveExplanation: 'Similar structure to PPO and GRPO, but the advantage is normalized globally across the entire batch of prompts, not just within each prompt group. This reduces variance caused by heterogeneous prompt difficulty. No critic model is needed.',
		formulaDiffs: [
			{
				label: 'vs GRPO: Normalization Scope',
				from: 'A_i = \\frac{R_i - \\text{mean}_{group}}{\\text{std}_{group}}',
				to: 'A_i = \\frac{R_i - \\text{mean}_{global}}{\\text{std}_{global}}',
				explanation: 'Advantage is normalized across ALL prompts in the batch, not just within each prompt group. This handles heterogeneous prompt difficulty much better and provides more stable training signals.'
			}
		],
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reference', label: 'Reference Model', type: 'model', required: true },
			{ id: 'reward', label: 'Reward / Verifier', type: 'process', required: true }
		],
		pros: ['PPO-like stability without a critic model (REINFORCE++ paper)', 'Fastest training: 42h vs 60h PPO on Llama3-8B (empirical)', 'Most stable among all critic-free methods (Logic-RL, PRIME benchmarks)'],
		cons: ['Global normalization may wash out signal for prompts with unusual reward distributions', 'May underperform PPO on tasks requiring maximum output quality', 'Per-prompt advantage signal is diluted across the entire batch'],
		metrics: { stability: 8, memoryEfficiency: 7, trainingSpeed: 9, quality: 7, complexity: 4 },
		papers: [{ title: 'REINFORCE++: A Simple and Efficient Approach for Aligning Large Language Models', url: 'https://arxiv.org/abs/2501.03262', year: 2025 }]
	},
	{
		id: 'vapo',
		name: 'VAPO',
		fullName: 'Value-Augmented Proximal Policy Optimization',
		year: 2025,
		origin: 'ByteDance',
		color: '#f43f5e',
		category: 'advanced',
		description: 'Brings back the value model but fixes its issues for long-chain reasoning. Uses value pretraining, decoupled GAE, and length-adaptive training. AIME 2024 score: 60.4.',
		keyInnovation: 'Reintroduces a value model with fixes: value pretraining, decoupled GAE for heterogeneous lengths, length-adaptive training',
		objective: 'L^{VAPO}(\\theta) = \\mathbb{E}_t \\left[ \\min\\left( r_t \\hat{A}_t^{GAE}, \\; \\text{clip}(r_t, 1-\\varepsilon, 1+\\varepsilon) \\hat{A}_t^{GAE} \\right) \\right]',
		objectiveExplanation: 'Similar structure to PPO, but with three key improvements: (1) the value model is pretrained separately to reduce initial estimation bias; (2) GAE is computed with length-aware normalization to handle different response lengths; (3) training adapts to sparse rewards in long reasoning chains. This achieves much finer credit assignment than group-level advantage.',
		formulaDiffs: [
			{
				label: 'vs GRPO: Advantage Source',
				from: 'A_i = \\frac{R_i - \\text{mean}}{\\text{std}}',
				to: '\\hat{A}_t = \\text{GAE}(V_\\phi)',
				explanation: 'Restores per-token advantage from a value model, providing finer credit assignment -- each token gets its own advantage estimate instead of sharing one value across the whole response. The value model is pretrained (unlike PPO) to avoid initial bias.'
			},
			{
				label: 'vs PPO: Value Model Training',
				from: 'V_\\phi \\text{ trained jointly from scratch}',
				to: 'V_\\phi \\text{ pretrained, decoupled GAE}',
				explanation: 'The value model is pretrained before RL begins, reducing estimation bias. GAE is computed with length-aware normalization so that short and long responses are treated fairly.'
			}
		],
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reference', label: 'Reference Model', type: 'model', required: true },
			{ id: 'critic', label: 'Pretrained Critic', type: 'model', required: true },
			{ id: 'reward', label: 'Reward / Verifier', type: 'process', required: true }
		],
		pros: ['SOTA on AIME 2024 with score 60.4, surpassing DAPO by 10+ points (VAPO paper)', 'Finer per-token credit assignment than any group-based method', 'Stable training: no crashes in 5000 steps on Qwen-32B (VAPO paper)'],
		cons: ['Requires a critic model, increasing memory to 4 models like PPO (VAPO paper)', 'Value pretraining adds a separate training phase before RL begins', 'Overall training pipeline is more complex than critic-free approaches'],
		metrics: { stability: 9, memoryEfficiency: 4, trainingSpeed: 5, quality: 10, complexity: 9 },
		papers: [{ title: 'VAPO: Efficient and Reliable RL for Advanced Reasoning Tasks', url: 'https://arxiv.org/abs/2504.05118', year: 2025 }]
	},
	{
		id: 'gmpo',
		name: 'GMPO',
		fullName: 'Geometric-Mean Policy Optimization',
		year: 2025,
		origin: 'Microsoft Research',
		color: '#a855f7',
		category: 'advanced',
		description: 'Replaces arithmetic mean of token rewards with geometric mean, making optimization less sensitive to outlier tokens. Simple drop-in replacement for GRPO.',
		keyInnovation: 'Geometric mean of token-level importance ratios instead of arithmetic mean, inherently suppresses outliers',
		objective: 'J^{GMPO}(\\theta) = \\mathbb{E} \\left[ \\frac{1}{G}\\sum_{i=1}^G A_i \\cdot \\left( \\prod_{t=1}^{|o_i|} r_{i,t} \\right)^{\\frac{1}{|o_i|}} \\right]',
		objectiveExplanation: 'The importance ratios across all tokens are combined using a geometric mean (product raised to 1/length) instead of arithmetic mean. This inherently suppresses outlier tokens: one extreme ratio cannot dominate the update. Equivalent to taking the exponential of the average log-ratio. A simple plug-and-play replacement for GRPO.',
		formulaDiffs: [
			{
				label: 'vs GRPO: Aggregation Method',
				from: '\\frac{1}{|o_i|}\\sum_t r_{i,t} \\cdot A_i',
				to: '\\left(\\prod_t r_{i,t}\\right)^{1/|o_i|} \\cdot A_i',
				explanation: 'Switches from arithmetic mean to geometric mean of token ratios. If one token has a ratio of 100 and the rest are around 1, arithmetic mean gets heavily skewed while geometric mean stays controlled. This produces smoother reward trajectories and more stable training.'
			},
			{
				label: 'vs GRPO: Clipping Range',
				from: '\\text{clip}(r_{i,t}, 1-\\varepsilon, 1+\\varepsilon)',
				to: '\\text{clip}(r_{i,t}, 1-\\varepsilon, 1+\\varepsilon_{wide})',
				explanation: 'Uses a wider clipping range because the geometric mean already controls variance naturally, so more exploration is possible without destabilizing training.'
			}
		],
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reference', label: 'Reference Model', type: 'model', required: true },
			{ id: 'reward', label: 'Reward / Verifier', type: 'process', required: true }
		],
		pros: ['Drop-in replacement for GRPO, minimal code changes needed', '+4.1% Pass@1 improvement on math reasoning benchmarks (GMPO paper)', 'Smoother reward trajectories and sustained token entropy during training'],
		cons: ['Still operates at token-level, so MoE instability issues from GRPO may persist', 'Relatively new with limited large-scale validation beyond the original paper', 'Geometric mean can overly suppress legitimate high-ratio tokens in some cases'],
		metrics: { stability: 7, memoryEfficiency: 7, trainingSpeed: 7, quality: 8, complexity: 4 },
		papers: [{ title: 'Geometric-Mean Policy Optimization', url: 'https://arxiv.org/abs/2507.20673', year: 2025 }]
	},
	{
		id: 'gfpo',
		name: 'GFPO',
		fullName: 'Group Filtered Policy Optimization',
		year: 2025,
		origin: 'Research Community',
		color: '#eab308',
		category: 'advanced',
		description: 'Addresses RL-trained models producing verbose outputs. Filters responses by length and token efficiency (reward/token) before policy update, reducing response length by up to 85%.',
		keyInnovation: 'Length-aware filtering: only concise, high-reward-per-token responses are used for policy updates',
		objective: 'J^{GFPO}(\\theta) = \\mathbb{E} \\left[ \\frac{1}{|S_f|}\\sum_{i \\in S_f} \\frac{1}{|o_i|}\\sum_t \\min\\left( r_{i,t} A_i, \\; \\text{clip}(r_{i,t}, 1-\\varepsilon, 1+\\varepsilon) A_i \\right) \\right]',
		objectiveExplanation: 'Before updating the policy, responses are filtered: only those with high reward-per-token (concise correct answers) pass the filter. The policy only learns from short, efficient solutions. An Adaptive Difficulty variant further allocates more sampling compute to harder problems where the model struggles.',
		formulaDiffs: [
			{
				label: 'vs GRPO: Response Filtering',
				from: '\\text{use all } G \\text{ responses}',
				to: 'S_f = \\{ i : R_i / |o_i| > \\tau \\}',
				explanation: 'Only concise correct responses are used to update the policy. Verbose but correct answers are filtered out, teaching the model to produce shorter, more efficient reasoning chains.'
			},
			{
				label: 'vs GRPO: Adaptive Difficulty',
				from: '\\text{uniform sampling budget}',
				to: '\\text{more samples for harder prompts}',
				explanation: 'The Adaptive Difficulty variant allocates more sampling budget to prompts where the model struggles, improving the tradeoff between computational efficiency and accuracy.'
			}
		],
		components: [
			{ id: 'policy', label: 'Policy Model', type: 'model', required: true },
			{ id: 'reference', label: 'Reference Model', type: 'model', required: true },
			{ id: 'reward', label: 'Reward / Verifier', type: 'process', required: true },
			{ id: 'filter', label: 'Length Filter', type: 'process', required: true }
		],
		pros: ['Up to 85% response length reduction while maintaining accuracy (GFPO paper)', 'Matches GRPO accuracy with much shorter outputs across STEM benchmarks', 'Substantial inference-time speedup from more concise responses'],
		cons: ['Filtering reduces the effective number of training samples per batch (GFPO paper)', 'Larger initial sample groups needed, increasing per-step compute cost', 'May discard genuinely necessary long reasoning chains for complex problems'],
		metrics: { stability: 6, memoryEfficiency: 6, trainingSpeed: 6, quality: 7, complexity: 6 },
		papers: [{ title: 'Group Filtered Policy Optimization for Concise Reasoning', url: 'https://openreview.net/forum?id=UKOqoULbZS', year: 2025 }]
	}
];

export const algorithmOrder = [
	'reinforce', 'ppo', 'rlhf', 'dpo', 'grpo', 'dapo', 'gspo', 'reinforce_pp', 'vapo', 'gmpo', 'gfpo'
];

export function getAlgorithm(id: string): Algorithm | undefined {
	return algorithms.find(a => a.id === id);
}
