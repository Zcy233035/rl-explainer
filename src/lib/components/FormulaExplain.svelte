<script lang="ts">
	import { renderLatex } from '$lib/utils/katex-render';
	import { lang } from '$lib/stores/i18n';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	interface FormulaSegment {
		id: string;
		latex: string;
		latexInFormula: string;
		label: { en: string; zh: string };
		explanation: { en: string; zh: string };
		color: string;
	}

	interface InteractiveFormula {
		id: string;
		name: string;
		formulaParts: { segId: string | null; latex: string }[];
		segments: FormulaSegment[];
		vsGrpo?: { en: string; zh: string };
	}

	const formulas: InteractiveFormula[] = [
		{
			id: 'grpo',
			name: 'GRPO',
			formulaParts: [
				{ segId: 'objective', latex: 'J^{GRPO}(\\theta)' },
				{ segId: null, latex: '=' },
				{ segId: 'expectation', latex: '\\mathbb{E}' },
				{ segId: null, latex: '\\Bigg[' },
				{ segId: 'group_avg', latex: '\\frac{1}{G} \\sum_{i=1}^{G}' },
				{ segId: 'token_norm', latex: '\\frac{1}{|o_i|}' },
				{ segId: 'token_sum', latex: '\\sum_{t=1}^{|o_i|}' },
				{ segId: null, latex: '\\Big(' },
				{ segId: 'min', latex: '\\min\\!\\Big(' },
				{ segId: 'importance_ratio', latex: 'r_{i,t}' },
				{ segId: 'advantage', latex: 'A_i' },
				{ segId: null, latex: ',\\;' },
				{ segId: 'clip', latex: '\\text{clip}(r_{i,t}, 1\\!-\\!\\varepsilon, 1\\!+\\!\\varepsilon)' },
				{ segId: 'advantage', latex: 'A_i' },
				{ segId: 'min', latex: '\\Big)' },
				{ segId: null, latex: '-' },
				{ segId: 'kl', latex: '\\beta D_{KL}' },
				{ segId: null, latex: '\\Big)\\Bigg]' },
			],
			segments: [
				{
					id: 'objective', latex: 'J^{GRPO}(\\theta)', latexInFormula: 'J^{GRPO}(\\theta)',
					label: { en: 'Objective', zh: '目标函数' },
					explanation: {
						en: 'This is the objective function we want to maximize. θ represents all learnable parameters of the policy model (the LLM). Training = finding θ that makes J as large as possible.',
						zh: '这是我们要最大化的目标函数。θ 代表策略模型（LLM）的所有可学习参数。训练的本质就是找到使 J 尽可能大的 θ。'
					}, color: '#6366f1'
				},
				{
					id: 'expectation', latex: '\\mathbb{E}[\\cdot]', latexInFormula: '\\mathbb{E}',
					label: { en: 'Expectation', zh: '期望' },
					explanation: {
						en: 'The expectation operator — we average over many prompts and sampled responses. In practice, this is approximated by sampling a mini-batch of prompts from the dataset, generating G responses for each, and averaging the results.',
						zh: '期望算子 — 对多个提示和采样响应取平均。实际操作中，通过从数据集采样一个小批次的提示、为每个提示生成 G 个响应、然后对结果取平均来近似计算。'
					}, color: '#8b5cf6'
				},
				{
					id: 'group_avg', latex: '\\frac{1}{G} \\sum_{i=1}^{G}', latexInFormula: '\\frac{1}{G}\\sum_{i=1}^{G}',
					label: { en: 'Group Average', zh: '组平均' },
					explanation: {
						en: 'Average over G responses sampled for the same prompt. G is typically 8-64. For each prompt, we generate G different responses and average their contributions. This is the "Group" in GRPO — the key idea that replaces the critic model.',
						zh: '对同一提示采样的 G 个响应取平均。G 通常为 8-64。对每个提示，生成 G 个不同的响应并平均它们的贡献。这就是 GRPO 中 "Group" 的含义 — 替代 critic 模型的核心思想。'
					}, color: '#10b981'
				},
				{
					id: 'token_norm', latex: '\\frac{1}{|o_i|}', latexInFormula: '\\frac{1}{|o_i|}',
					label: { en: 'Length Norm', zh: '长度归一化' },
					explanation: {
						en: '|oᵢ| is the number of tokens in response i. Dividing by it normalizes the loss per-token, so long and short responses contribute equally. Without this, long responses would dominate the gradient. DAPO changes this to a global token-level normalization instead.',
						zh: '|oᵢ| 是响应 i 的 token 数量。除以它可以按 token 归一化损失，使长短响应的贡献相等。没有这个，长响应会主导梯度。DAPO 将此改为全局 token 级归一化。'
					}, color: '#0ea5e9'
				},
				{
					id: 'token_sum', latex: '\\sum_{t=1}^{|o_i|}', latexInFormula: '\\sum_{t=1}^{|o_i|}',
					label: { en: 'Token Sum', zh: 'Token 求和' },
					explanation: {
						en: 'Sum over all tokens in response i. The loss is computed at the token level — each token gets its own importance ratio and contributes independently. This token-level granularity is both a strength (fine-grained) and weakness (high variance).',
						zh: '对响应 i 中所有 token 求和。损失在 token 级计算 — 每个 token 有自己的重要性比率并独立贡献。这种 token 级粒度既是优势（细粒度），也是弱点（高方差）。'
					}, color: '#14b8a6'
				},
				{
					id: 'importance_ratio', latex: 'r_{i,t} = \\frac{\\pi_\\theta(o_{i,t} | q, o_{i,<t})}{\\pi_{\\theta_{old}}(o_{i,t} | q, o_{i,<t})}', latexInFormula: 'r_{i,t}',
					label: { en: 'Importance Ratio', zh: '重要性比率' },
					explanation: {
						en: 'The ratio of the NEW policy\'s probability of generating token t to the OLD policy\'s probability. If r > 1, the new policy is more likely to produce this token; if r < 1, less likely. This measures "how much did we change?" and is the core mechanism for importance sampling — reusing old samples to evaluate the new policy.',
						zh: '新策略生成 token t 的概率与旧策略概率的比值。若 r > 1，新策略更可能产生此 token；若 r < 1，则更不可能。这衡量了"我们改变了多少？"，是重要性采样的核心机制 — 复用旧样本来评估新策略。'
					}, color: '#f43f5e'
				},
				{
					id: 'advantage', latex: 'A_i = \\frac{R_i - \\text{mean}(R_1, ..., R_G)}{\\text{std}(R_1, ..., R_G)}', latexInFormula: 'A_i',
					label: { en: 'Group Advantage', zh: '组优势' },
					explanation: {
						en: 'The advantage of response i: its reward minus the group mean, divided by the group std. If Aᵢ > 0, this response is better than average → reinforce it. If Aᵢ < 0, worse → suppress it. This is "Relative" in GRPO — advantage is relative to siblings, not from a learned critic. The same Aᵢ is shared by ALL tokens in response i.',
						zh: '响应 i 的优势：其奖励减去组均值，再除以组标准差。若 Aᵢ > 0，此响应优于平均 → 强化。若 Aᵢ < 0，劣于平均 → 抑制。这就是 GRPO 中 "Relative" 的含义 — 优势是相对于同组兄弟的。响应 i 中的所有 token 共享相同的 Aᵢ。'
					}, color: '#f97316'
				},
				{
					id: 'clip', latex: '\\text{clip}(r_{i,t}, 1-\\varepsilon, 1+\\varepsilon)', latexInFormula: '\\text{clip}(\\cdot)',
					label: { en: 'Clipping', zh: '裁剪' },
					explanation: {
						en: 'Constrains the importance ratio to [1-ε, 1+ε], typically [0.8, 1.2] with ε=0.2. This prevents the policy from changing too much in one update. If the new policy wants to make a token 5x more likely (r=5), clipping caps it at 1.2. This is inherited from PPO and is the key stability mechanism. DAPO uses asymmetric bounds: ε_high > ε_low.',
						zh: '将重要性比率限制在 [1-ε, 1+ε]，通常为 [0.8, 1.2]（ε=0.2）。防止策略在一次更新中变化太大。如果新策略想让某个 token 的概率变为 5 倍（r=5），裁剪会把它限制在 1.2。继承自 PPO，是关键稳定性机制。DAPO 使用非对称边界。'
					}, color: '#d946ef'
				},
				{
					id: 'min', latex: '\\min(r \\cdot A, \\; \\text{clip}(r) \\cdot A)', latexInFormula: '\\min(\\cdot)',
					label: { en: 'Min Operation', zh: 'Min 操作' },
					explanation: {
						en: 'Takes the minimum of the clipped and unclipped objectives. This creates a "pessimistic" bound:\n\n• When A > 0 (good action) and r > 1+ε: the clipped term is smaller → use it → gradient = 0, stop increasing\n• When A < 0 (bad action) and r < 1-ε: the clipped term is smaller → use it → gradient = 0, stop decreasing\n\nThe effect: you can improve good actions and suppress bad ones, but only by a limited amount per step.',
						zh: '取裁剪和未裁剪目标的最小值。创建一个"悲观"界：\n\n• 当 A > 0（好动作）且 r > 1+ε：裁剪项更小 → 使用它 → 梯度 = 0，停止增加\n• 当 A < 0（坏动作）且 r < 1-ε：裁剪项更小 → 使用它 → 梯度 = 0，停止减少\n\n效果：可以强化好动作、抑制坏动作，但每步只能有限度地改变。'
					}, color: '#ea580c'
				},
				{
					id: 'kl', latex: '\\beta D_{KL}(\\pi_\\theta \\| \\pi_{ref})', latexInFormula: '\\beta D_{KL}',
					label: { en: 'KL Penalty', zh: 'KL 惩罚' },
					explanation: {
						en: 'KL divergence measures how different the current policy π_θ is from the reference policy π_ref (the original SFT model). β controls the penalty strength. This prevents the model from "forgetting" its original capabilities. DAPO removes this entirely, relying on clipping alone.',
						zh: 'KL 散度衡量当前策略 π_θ 与参考策略 π_ref（原始 SFT 模型）的差异程度。β 控制惩罚强度。防止模型"遗忘"原始能力。DAPO 完全移除了这一项，仅依靠裁剪保证稳定性。'
					}, color: '#0d9488'
				}
			]
		},
		{
			id: 'ppo',
			name: 'PPO',
			formulaParts: [
				{ segId: 'ppo_objective', latex: 'L^{PPO}(\\theta)' },
				{ segId: null, latex: '=' },
				{ segId: null, latex: '\\mathbb{E}_t\\Big[' },
				{ segId: 'ppo_min', latex: '\\min\\!\\Big(' },
				{ segId: 'ppo_ratio', latex: 'r_t(\\theta)' },
				{ segId: 'ppo_advantage', latex: 'A_t' },
				{ segId: null, latex: ',\\;' },
				{ segId: 'ppo_clip', latex: '\\text{clip}(r_t, 1\\!-\\!\\varepsilon, 1\\!+\\!\\varepsilon)' },
				{ segId: 'ppo_advantage', latex: 'A_t' },
				{ segId: 'ppo_min', latex: '\\Big)' },
				{ segId: null, latex: '\\Big]' },
				{ segId: null, latex: '-' },
				{ segId: 'ppo_kl', latex: '\\beta D_{KL}(\\pi_\\theta \\| \\pi_{ref})' },
			],
			segments: [
				{
					id: 'ppo_objective', latex: 'L^{PPO}(\\theta)', latexInFormula: 'L^{PPO}(\\theta)',
					label: { en: 'PPO Objective', zh: 'PPO 目标' },
					explanation: {
						en: 'The PPO loss function. Unlike GRPO which uses J (maximize), PPO typically formulates as L (minimize the negative). The θ are the policy model parameters.',
						zh: 'PPO 损失函数。与 GRPO 使用 J（最大化）不同，PPO 通常表述为 L（最小化负值）。θ 是策略模型参数。'
					}, color: '#3b82f6'
				},
				{
					id: 'ppo_ratio', latex: 'r_t(\\theta) = \\frac{\\pi_\\theta(a_t|s_t)}{\\pi_{\\theta_{old}}(a_t|s_t)}', latexInFormula: 'r_t(\\theta)',
					label: { en: 'Per-Token Ratio', zh: '逐 Token 比率' },
					explanation: {
						en: 'Same concept as GRPO\'s importance ratio, but written in the general RL notation (state s, action a) rather than LLM notation (prompt q, token o). Each token gets its own ratio independently.',
						zh: '与 GRPO 的重要性比率概念相同，但使用通用 RL 表示法（状态 s、动作 a）而非 LLM 表示法（提示 q、token o）。每个 token 独立获得自己的比率。'
					}, color: '#6366f1'
				},
				{
					id: 'ppo_advantage', latex: 'A_t = \\text{GAE}(V_\\phi, r, \\gamma, \\lambda)', latexInFormula: 'A_t',
					label: { en: 'Critic Advantage (GAE)', zh: 'Critic 优势 (GAE)' },
					explanation: {
						en: 'THE key difference from GRPO. The advantage is computed using Generalized Advantage Estimation (GAE) from a learned value function V_φ (the critic). This gives per-TOKEN advantage (each token gets a different Aₜ), whereas GRPO assigns the same Aᵢ to all tokens. GAE requires a separate critic neural network, adding ~40% memory overhead.',
						zh: '与 GRPO 的关键区别。通过学习的价值函数 V_φ（critic）使用广义优势估计（GAE）计算。给出逐 TOKEN 的优势（每个 token 有不同的 Aₜ），而 GRPO 为所有 token 分配相同的 Aᵢ。需要单独的 critic 神经网络，增加约 40% 内存。'
					}, color: '#f43f5e'
				},
				{
					id: 'ppo_clip', latex: '\\text{clip}(r_t, 1-\\varepsilon, 1+\\varepsilon)', latexInFormula: '\\text{clip}(\\cdot)',
					label: { en: 'Symmetric Clipping', zh: '对称裁剪' },
					explanation: {
						en: 'PPO uses symmetric clipping: the upper and lower bounds are equidistant from 1. DAPO later showed this causes the "Matthew Effect" — rare good tokens can\'t improve fast enough because their clip window is too tight. DAPO fixes this with asymmetric Clip-Higher.',
						zh: 'PPO 使用对称裁剪：上下界与 1 等距。DAPO 后来证明这导致"马太效应" — 稀有好 token 因裁剪窗口过紧而无法快速改善。DAPO 通过非对称 Clip-Higher 修复了此问题。'
					}, color: '#d946ef'
				},
				{
					id: 'ppo_min', latex: '\\min(r \\cdot A, \\; \\text{clip}(r) \\cdot A)', latexInFormula: '\\min(\\cdot)',
					label: { en: 'Min (Pessimistic Bound)', zh: 'Min（悲观界）' },
					explanation: {
						en: 'Same pessimistic bound as GRPO: takes the minimum of clipped and unclipped objectives, preventing the policy from changing too aggressively in any single update step.',
						zh: '与 GRPO 相同的悲观界：取裁剪和未裁剪目标的最小值，防止策略在单次更新中变化过大。'
					}, color: '#ea580c'
				},
				{
					id: 'ppo_kl', latex: '\\beta D_{KL}(\\pi_\\theta \\| \\pi_{ref})', latexInFormula: '\\beta D_{KL}(\\cdot)',
					label: { en: 'KL Penalty', zh: 'KL 惩罚' },
					explanation: {
						en: 'Penalizes divergence from the reference SFT model. β is a hyperparameter controlling penalty strength. Keeps the model from straying too far from its supervised fine-tuned behavior.',
						zh: '惩罚与参考 SFT 模型的偏离。β 是控制惩罚强度的超参数。防止模型偏离其监督微调后的行为太远。'
					}, color: '#0d9488'
				}
			]
		},
		{
			id: 'dpo',
			name: 'DPO',
			formulaParts: [
				{ segId: 'dpo_loss', latex: 'L^{DPO}(\\theta)' },
				{ segId: null, latex: '= -' },
				{ segId: null, latex: '\\mathbb{E}_{(x,y_w,y_l)}\\Big[' },
				{ segId: 'dpo_sigmoid', latex: '\\log\\sigma\\!\\Big(' },
				{ segId: 'dpo_beta', latex: '\\beta' },
				{ segId: null, latex: '\\big(' },
				{ segId: 'dpo_logr_w', latex: '\\log\\frac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)}' },
				{ segId: null, latex: '-' },
				{ segId: 'dpo_logr_l', latex: '\\log\\frac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)}' },
				{ segId: null, latex: '\\big)' },
				{ segId: 'dpo_sigmoid', latex: '\\Big)' },
				{ segId: null, latex: '\\Big]' },
			],
			segments: [
				{
					id: 'dpo_loss', latex: 'L^{DPO}(\\theta)', latexInFormula: 'L^{DPO}(\\theta)',
					label: { en: 'DPO Loss', zh: 'DPO 损失' },
					explanation: {
						en: 'The DPO loss to minimize. The negative sign out front means we want to maximize the log-sigmoid term inside. No RL loop, no reward model — this is a pure supervised loss on preference pairs.',
						zh: 'DPO 的损失函数（最小化）。前面的负号意味着我们要最大化内部的 log-sigmoid 项。无 RL 循环、无奖励模型 — 这是纯粹的偏好对上的监督损失。'
					}, color: '#8b5cf6'
				},
				{
					id: 'dpo_sigmoid', latex: '\\log \\sigma(\\cdot)', latexInFormula: '\\log\\sigma(\\cdot)',
					label: { en: 'Log-Sigmoid', zh: 'Log-Sigmoid' },
					explanation: {
						en: 'The sigmoid function σ(x) = 1/(1+e^{-x}) squashes its input to [0,1]. Log-sigmoid then maps to (-∞, 0]. This creates a binary classification-like loss: the model is "classifying" which response is preferred. When the preferred response has much higher implicit reward, the loss approaches 0.',
						zh: 'Sigmoid 函数 σ(x) = 1/(1+e^{-x}) 将输入压缩到 [0,1]。Log-sigmoid 映射到 (-∞, 0]。这创建了类似二分类的损失：模型在"分类"哪个响应更好。当偏好响应的隐式奖励远高于另一个时，损失趋近于 0。'
					}, color: '#f43f5e'
				},
				{
					id: 'dpo_beta', latex: '\\beta', latexInFormula: '\\beta',
					label: { en: 'Temperature β', zh: '温度 β' },
					explanation: {
						en: 'Controls the sharpness of preference. Larger β → more confident in the preference ranking, pushing the model harder to separate preferred from rejected. Typical values: β = 0.1 to 0.5. This corresponds to the inverse temperature of the implicit reward model.',
						zh: '控制偏好的锐度。β 越大 → 对偏好排序越有信心，更强力地推动模型区分优选和拒绝。典型值：β = 0.1 到 0.5。对应隐式奖励模型的逆温度。'
					}, color: '#f97316'
				},
				{
					id: 'dpo_logr_w', latex: '\\log\\frac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)}', latexInFormula: '\\log\\frac{\\pi_\\theta(y_w)}{\\pi_{ref}(y_w)}',
					label: { en: 'Preferred Log-Ratio', zh: '优选对数比' },
					explanation: {
						en: 'The implicit reward for the preferred (winning) response y_w. It measures how much more likely the current policy is to generate y_w compared to the reference model. DPO\'s key insight: this log-ratio IS the reward, no separate reward model needed.',
						zh: '优选（获胜）响应 y_w 的隐式奖励。衡量当前策略相比参考模型生成 y_w 的可能性增加了多少。DPO 的核心洞察：这个对数比率本身就是奖励，不需要单独的奖励模型。'
					}, color: '#10b981'
				},
				{
					id: 'dpo_logr_l', latex: '\\log\\frac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)}', latexInFormula: '\\log\\frac{\\pi_\\theta(y_l)}{\\pi_{ref}(y_l)}',
					label: { en: 'Rejected Log-Ratio', zh: '拒绝对数比' },
					explanation: {
						en: 'The implicit reward for the rejected (losing) response y_l. The loss maximizes the GAP between preferred and rejected rewards. If the model increases the preferred reward while also increasing the rejected reward by the same amount, there\'s no improvement.',
						zh: '被拒绝（失败）响应 y_l 的隐式奖励。损失最大化优选和拒绝奖励之间的差距。如果模型在增加优选奖励的同时也等量增加了拒绝奖励，则没有改善。'
					}, color: '#dc2626'
				}
			]
		},
		{
			id: 'dapo',
			name: 'DAPO',
			formulaParts: [
				{ segId: null, latex: 'J^{DAPO}(\\theta) = \\mathbb{E}\\Bigg[' },
				{ segId: 'dapo_token_norm', latex: '\\frac{1}{\\sum_i |o_i|}' },
				{ segId: null, latex: '\\sum_{i=1}^{G}\\sum_{t=1}^{|o_i|}' },
				{ segId: null, latex: '\\min\\!\\Big(' },
				{ segId: null, latex: 'r_{i,t} A_i,\\;' },
				{ segId: 'dapo_clip_higher', latex: '\\text{clip}(r_{i,t}, 1\\!-\\!\\varepsilon_{low}, 1\\!+\\!\\varepsilon_{high})' },
				{ segId: null, latex: 'A_i\\Big)\\Bigg]' },
			],
			segments: [
				{
					id: 'dapo_token_norm', latex: '\\frac{1}{\\sum_i |o_i|}', latexInFormula: '\\frac{1}{\\sum_i |o_i|}',
					label: { en: 'Token-Level Norm', zh: 'Token 级归一化' },
					explanation: {
						en: 'GRPO normalizes per-response (1/|oᵢ| inside the group sum), but DAPO normalizes by the TOTAL token count across all G responses. Why? Per-response normalization dilutes long responses: if response A has 100 tokens and B has 10, each of A\'s tokens gets 1/10th the gradient of B\'s. DAPO treats every token equally.',
						zh: 'GRPO 按响应归一化（组求和内的 1/|oᵢ|），而 DAPO 按所有 G 个响应的总 token 数归一化。为什么？按响应归一化会稀释长响应：如果 A 有 100 个 token，B 有 10 个，A 的每个 token 只获得 B 的 1/10 梯度。DAPO 让每个 token 获得同等对待。'
					}, color: '#0ea5e9'
				},
				{
					id: 'dapo_clip_higher', latex: '\\text{clip}(r_{i,t}, 1-\\varepsilon_{low}, 1+\\varepsilon_{high})', latexInFormula: '\\text{clip}(\\cdot, \\varepsilon_{low}, \\varepsilon_{high})',
					label: { en: 'Clip-Higher', zh: '非对称裁剪' },
					explanation: {
						en: 'The signature innovation of DAPO. ε_high > ε_low (e.g., ε_low=0.2, ε_high=0.28). The upper clip bound is looser.\n\nWhy? Consider a good token with probability 0.01 under the old policy. With symmetric ε=0.2, max ratio = 1.2, new probability caps at 0.012 — barely any improvement! With Clip-Higher, cap = 1.28 → 0.0128, giving 28% room instead of 20%. Fixes the "Matthew Effect".',
						zh: 'DAPO 的标志性创新。ε_high > ε_low（例如 ε_low=0.2, ε_high=0.28）。上裁剪界更宽松。\n\n为什么？旧策略下概率 0.01 的好 token，对称 ε=0.2 时新概率上限 0.012（几乎没改善）。Clip-Higher 下上限 0.0128，多出 28% 空间。修复了"马太效应"。'
					}, color: '#f97316'
				},
				{
					id: 'dapo_no_kl', latex: '\\text{(no } \\beta D_{KL} \\text{ term)}', latexInFormula: '',
					label: { en: 'KL Removed', zh: 'KL 移除' },
					explanation: {
						en: 'DAPO completely removes the KL divergence penalty. Reasoning: (1) clipping already constrains updates sufficiently, (2) KL pulls the policy back toward the SFT model, limiting exploration in reasoning tasks. Empirically, removing KL improved AIME 2024 scores.',
						zh: 'DAPO 完全移除了 KL 散度惩罚。理由：(1) 裁剪已充分约束更新，(2) KL 将策略拉回 SFT 模型，限制推理任务的探索。实验表明移除 KL 显著提升了 AIME 2024 分数。'
					}, color: '#dc2626'
				},
				{
					id: 'dapo_dynamic', latex: '\\text{s.t. } 0 < |\\{\\text{correct}\\}| < G', latexInFormula: '',
					label: { en: 'Dynamic Sampling', zh: '动态采样' },
					explanation: {
						en: 'Not in the loss formula, but critical: DAPO resamples until each prompt has both correct and incorrect responses. If all G are correct (or wrong), advantage is near-zero and the batch is wasted. Dynamic Sampling guarantees useful gradients in every batch.',
						zh: '不在损失公式中，但至关重要：DAPO 重新采样直到每个提示有正确和错误的响应。如果 G 个全对（或全错），优势接近零，批次浪费。动态采样保证每批都有有用梯度。'
					}, color: '#10b981'
				}
			],
			vsGrpo: {
				en: '4 key changes: (1) Asymmetric Clip-Higher fixes the Matthew Effect; (2) Token-level normalization replaces per-response normalization; (3) KL penalty completely removed; (4) Dynamic Sampling guarantees gradient diversity.',
				zh: '4 个关键改变：(1) 非对称裁剪 Clip-Higher 修复马太效应；(2) Token 级归一化替代按响应归一化；(3) 完全移除 KL 惩罚；(4) 动态采样保证梯度多样性。'
			}
		},
		{
			id: 'gspo',
			name: 'GSPO',
			formulaParts: [
				{ segId: null, latex: 'J^{GSPO}(\\theta) = \\mathbb{E}\\Bigg[\\frac{1}{G}\\sum_{i=1}^{G}\\frac{1}{|o_i|}\\sum_{t=1}^{|o_i|}' },
				{ segId: null, latex: '\\min\\!\\Big(' },
				{ segId: 'gspo_seq_ratio', latex: 's_i' },
				{ segId: null, latex: 'A_i,\\;' },
				{ segId: 'gspo_uniform_clip', latex: '\\text{clip}(s_i, 1\\!-\\!\\varepsilon, 1\\!+\\!\\varepsilon)' },
				{ segId: null, latex: 'A_i\\Big)\\Bigg]' },
			],
			segments: [
				{
					id: 'gspo_seq_ratio', latex: 's_i = \\exp\\!\\left(\\frac{1}{|o_i|}\\sum_{t=1}^{|o_i|} \\log \\frac{\\pi_\\theta(o_{i,t})}{\\pi_{old}(o_{i,t})}\\right)', latexInFormula: 's_i',
					label: { en: 'Sequence-Level Ratio', zh: '序列级比率' },
					explanation: {
						en: 'THE core innovation. Instead of per-token ratio r_{i,t}, uses a single sequence-level ratio sᵢ shared by all tokens. It\'s the geometric mean (exp of average log) of all token ratios.\n\nIf 99 tokens have r≈1 but one has r=100: arithmetic mean ≈ 2 (dominated by outlier), geometric mean ≈ 1.05 (robust). This eliminates the extreme per-token variance that destabilizes MoE training.',
						zh: '核心创新。不使用逐 token 比率 r_{i,t}，而是所有 token 共享的单一序列级比率 sᵢ。它是所有 token 比率的几何平均（对数平均值的指数）。\n\n如果 99 个 token 的 r≈1 但 1 个 r=100：算术平均 ≈ 2（被异常值主导），几何平均 ≈ 1.05（稳健）。消除了导致 MoE 训练不稳定的极端逐 token 方差。'
					}, color: '#ec4899'
				},
				{
					id: 'gspo_uniform_clip', latex: '\\text{clip}(s_i, 1-\\varepsilon, 1+\\varepsilon)', latexInFormula: '\\text{clip}(s_i, \\cdot)',
					label: { en: 'Sequence-Level Clip', zh: '序列级裁剪' },
					explanation: {
						en: 'Clipping applies to the sequence ratio sᵢ, not individual tokens. When clipping triggers, ALL tokens are affected equally — either the entire sequence updates or none of it does. In GRPO, some tokens get clipped while others don\'t, creating inconsistent gradients. GSPO\'s uniform clipping produces much cleaner signals.',
						zh: '裁剪作用于序列比率 sᵢ，而非单个 token。当触发裁剪时，所有 token 被同等影响 — 要么整个序列更新，要么都不更新。在 GRPO 中，某些 token 被裁剪而其他不被，产生不一致梯度。GSPO 的统一裁剪产生更干净的信号。'
					}, color: '#d946ef'
				}
			],
			vsGrpo: {
				en: 'Core change: per-token ratio r_{i,t} is replaced by sequence-level ratio sᵢ (geometric mean). All tokens share the same weight, clipping applies uniformly. Fundamentally eliminates MoE training instability.',
				zh: '核心改变：逐 token 比率 r_{i,t} 被序列级比率 sᵢ（几何平均）替代。所有 token 共享相同权重，裁剪统一作用。从根本上消除了 MoE 训练不稳定性。'
			}
		},
		{
			id: 'reinforce_pp',
			name: 'REINFORCE++',
			formulaParts: [
				{ segId: 'rpp_loss', latex: 'L^{R++}(\\theta)' },
				{ segId: null, latex: '= \\mathbb{E}_t\\Big[\\min\\!\\Big(' },
				{ segId: null, latex: 'r_t' },
				{ segId: 'rpp_adv', latex: 'A_t^{global}' },
				{ segId: null, latex: ',\\;\\text{clip}(r_t, 1\\!-\\!\\varepsilon, 1\\!+\\!\\varepsilon)' },
				{ segId: 'rpp_adv', latex: 'A_t^{global}' },
				{ segId: null, latex: '\\Big)\\Big] -' },
				{ segId: null, latex: '\\beta D_{KL}' },
			],
			segments: [
				{
					id: 'rpp_loss', latex: 'L^{R++}(\\theta)', latexInFormula: 'L^{R++}(\\theta)',
					label: { en: 'R++ Objective', zh: 'R++ 目标' },
					explanation: {
						en: 'REINFORCE++ combines the simplicity of REINFORCE with PPO\'s stability mechanisms (clipping + KL penalty), but critically WITHOUT a learned critic model. The structure looks like PPO, but the advantage computation is fundamentally different.',
						zh: 'REINFORCE++ 结合了 REINFORCE 的简单性和 PPO 的稳定性机制（裁剪 + KL 惩罚），但关键在于没有学习的 critic 模型。结构看起来像 PPO，但优势计算根本不同。'
					}, color: '#14b8a6'
				},
				{
					id: 'rpp_adv', latex: 'A_t^{global} = \\frac{R_i - \\text{mean}_{\\text{all prompts}}}{\\text{std}_{\\text{all prompts}}}', latexInFormula: 'A_t^{global}',
					label: { en: 'Global Advantage', zh: '全局优势' },
					explanation: {
						en: 'THE key difference from GRPO: advantage is normalized globally across ALL prompts in the batch, not just within each prompt\'s group. Why? GRPO normalizes within each group, so an easy prompt where all responses score 90-100 creates the same advantage spread as a hard prompt where all score 10-20. Global normalization fixes this: it considers ALL rewards together, so easy and hard prompts get appropriate signal strength.',
						zh: '与 GRPO 的关键区别：优势在批次中所有提示之间全局归一化，而非仅在每个提示组内。为什么？GRPO 在组内归一化，所以简单提示（所有响应 90-100 分）与困难提示（所有响应 10-20 分）产生相同的优势分布。全局归一化修复了这个问题：统一考虑所有奖励，使简单和困难提示获得适当的信号强度。'
					}, color: '#f97316'
				}
			],
			vsGrpo: {
				en: 'Key change: advantage normalization scope changes from per-group to global (across all prompts). This handles heterogeneous prompt difficulty much better and provides more stable training signals.',
				zh: '关键改变：优势归一化范围从组内改为全局（跨所有提示）。这更好地处理了异质提示难度，提供了更稳定的训练信号。'
			}
		},
		{
			id: 'vapo',
			name: 'VAPO',
			formulaParts: [
				{ segId: 'vapo_loss', latex: 'L^{VAPO}(\\theta)' },
				{ segId: null, latex: '= \\mathbb{E}_t\\Big[\\min\\!\\Big( r_t' },
				{ segId: 'vapo_gae', latex: '\\hat{A}_t^{GAE}' },
				{ segId: null, latex: ',\\;\\text{clip}(r_t, 1\\!-\\!\\varepsilon, 1\\!+\\!\\varepsilon)' },
				{ segId: 'vapo_gae', latex: '\\hat{A}_t^{GAE}' },
				{ segId: null, latex: '\\Big)\\Big]' },
			],
			segments: [
				{
					id: 'vapo_loss', latex: 'L^{VAPO}(\\theta)', latexInFormula: 'L^{VAPO}(\\theta)',
					label: { en: 'VAPO Objective', zh: 'VAPO 目标' },
					explanation: {
						en: 'VAPO\'s loss looks identical to PPO on the surface, but under the hood, the value model (critic) is pretrained, GAE is decoupled for different lengths, and training is length-adaptive. These three fixes are what make the critic work well for long reasoning chains.',
						zh: 'VAPO 的损失表面上与 PPO 相同，但在底层，价值模型（critic）是预训练的，GAE 针对不同长度解耦，训练是长度自适应的。这三个修复使 critic 在长推理链中工作良好。'
					}, color: '#f43f5e'
				},
				{
					id: 'vapo_gae', latex: '\\hat{A}_t^{GAE} = \\text{GAE}(V_\\phi^{pretrained})', latexInFormula: '\\hat{A}_t^{GAE}',
					label: { en: 'Pretrained GAE', zh: '预训练 GAE' },
					explanation: {
						en: 'Unlike PPO where the critic is trained from scratch alongside the policy, VAPO pretrains the critic FIRST on existing reward data. This dramatically reduces the initial estimation bias that plagues PPO in long reasoning tasks.\n\nAdditionally, GAE is "decoupled" — normalization is done per-length-bucket, so 50-token and 500-token responses are treated on their own scale. This fixes the length bias that causes GRPO-family methods to prefer either very short or very long answers.',
						zh: '与 PPO 从头和策略一起训练 critic 不同，VAPO 首先在已有奖励数据上预训练 critic。这大幅减少了困扰 PPO 在长推理任务中的初始估计偏差。\n\n此外，GAE 是"解耦"的 — 按长度桶做归一化，50 token 和 500 token 的响应在各自的尺度上处理。修复了 GRPO 系列方法偏好极短或极长答案的长度偏差。'
					}, color: '#a855f7'
				}
			],
			vsGrpo: {
				en: 'Brings back the critic model (like PPO) but with three fixes: value pretraining reduces initial bias, decoupled GAE handles heterogeneous lengths, length-adaptive training handles sparse rewards in long chains. Result: AIME 2024 score 60.4 vs DAPO\'s 50.',
				zh: '恢复 critic 模型（如 PPO），但有三个修复：价值预训练减少初始偏差，解耦 GAE 处理异质长度，长度自适应训练处理长链中的稀疏奖励。结果：AIME 2024 得分 60.4 vs DAPO 的 50。'
			}
		},
		{
			id: 'gmpo',
			name: 'GMPO',
			formulaParts: [
				{ segId: null, latex: 'J^{GMPO}(\\theta) = \\mathbb{E}\\Bigg[\\frac{1}{G}\\sum_{i=1}^{G} A_i \\cdot' },
				{ segId: 'gmpo_geomean', latex: '\\left(\\prod_{t=1}^{|o_i|} r_{i,t}\\right)^{\\!\\frac{1}{|o_i|}}' },
				{ segId: null, latex: '\\Bigg]' },
			],
			segments: [
				{
					id: 'gmpo_geomean', latex: '\\left(\\prod_{t=1}^{|o_i|} r_{i,t}\\right)^{1/|o_i|}', latexInFormula: '\\left(\\prod r_{i,t}\\right)^{1/|o_i|}',
					label: { en: 'Geometric Mean of Ratios', zh: '比率的几何平均' },
					explanation: {
						en: 'THE core idea: instead of averaging token ratios (arithmetic mean), take their geometric mean — the product raised to 1/length power.\n\nArithmetic mean of [1, 1, 1, 100] = 25.75 (outlier dominates)\nGeometric mean of [1, 1, 1, 100] = 3.16 (much more robust)\n\nThis simple change inherently suppresses outlier tokens without explicit clipping. One extreme token ratio cannot hijack the entire gradient update. The result is smoother reward trajectories and sustained token entropy.',
						zh: '核心思想：不使用算术平均 token 比率，而是取几何平均 — 乘积的 1/长度 次方。\n\n[1, 1, 1, 100] 的算术平均 = 25.75（异常值主导）\n[1, 1, 1, 100] 的几何平均 = 3.16（稳健得多）\n\n这个简单改变天然抑制异常 token，无需显式裁剪。一个极端 token 比率无法劫持整个梯度更新。结果是更平滑的奖励轨迹和持续的 token 熵。'
					}, color: '#a855f7'
				}
			],
			vsGrpo: {
				en: 'Replaces arithmetic mean of token ratios with geometric mean. Drop-in replacement for GRPO with +4.1% Pass@1 on math benchmarks. Inherently suppresses outlier tokens.',
				zh: '用几何平均替代 token 比率的算术平均。GRPO 的即插即用替代，数学基准上 Pass@1 提升 4.1%。天然抑制异常 token。'
			}
		},
		{
			id: 'gfpo',
			name: 'GFPO',
			formulaParts: [
				{ segId: null, latex: 'J^{GFPO}(\\theta) = \\mathbb{E}\\Bigg[' },
				{ segId: 'gfpo_filter', latex: '\\frac{1}{|S_f|}\\sum_{i \\in S_f}' },
				{ segId: null, latex: '\\frac{1}{|o_i|}\\sum_t \\min\\!\\Big( r_{i,t} A_i,\\;\\text{clip}(r_{i,t})A_i \\Big)\\Bigg]' },
			],
			segments: [
				{
					id: 'gfpo_filter', latex: 'S_f = \\{ i : R_i / |o_i| > \\tau \\}', latexInFormula: '\\frac{1}{|S_f|}\\sum_{i \\in S_f}',
					label: { en: 'Length-Aware Filter', zh: '长度感知过滤' },
					explanation: {
						en: 'THE core innovation: instead of using ALL G responses, only use the filtered subset Sᶠ — responses whose reward-per-token (Rᵢ/|oᵢ|) exceeds a threshold τ. This means only concise, correct answers train the policy.\n\nA 500-token correct answer and a 50-token correct answer both score R=1, but the 50-token one has 10x higher reward-per-token. GFPO learns from the short one, teaching the model to be concise. Result: up to 85% response length reduction with equal accuracy.',
						zh: '核心创新：不使用所有 G 个响应，只使用过滤后的子集 Sᶠ — 每 token 奖励（Rᵢ/|oᵢ|）超过阈值 τ 的响应。只有简洁、正确的答案用于训练策略。\n\n500 token 的正确答案和 50 token 的正确答案都得 R=1，但 50 token 的每 token 奖励高 10 倍。GFPO 从短答案中学习，教会模型简洁。结果：准确率不变，响应长度减少最高 85%。'
					}, color: '#eab308'
				}
			],
			vsGrpo: {
				en: 'Adds a response filter before policy update: only concise, high-reward-per-token responses pass. Achieves up to 85% response length reduction while matching GRPO accuracy.',
				zh: '在策略更新前增加响应过滤器：仅简洁的高 reward-per-token 响应通过。响应长度减少最高 85%，同时匹配 GRPO 准确率。'
			}
		}
	];

	let selectedFormulaId = $state('grpo');
	let selectedSegmentId = $state<string | null>(null);

	let selectedFormula = $derived(formulas.find(f => f.id === selectedFormulaId)!);
	let selectedSegment = $derived(
		selectedSegmentId ? selectedFormula.segments.find(s => s.id === selectedSegmentId) ?? null : null
	);

	function getSegmentColor(segId: string | null): string | null {
		if (!segId) return null;
		return selectedFormula.segments.find(s => s.id === segId)?.color ?? null;
	}

	function selectSegment(id: string) {
		selectedSegmentId = selectedSegmentId === id ? null : id;
	}
</script>

<div class="py-20 px-6">
	<div class="max-w-[1400px] mx-auto">
		<h2 class="text-4xl font-bold text-center mb-3">
			{$lang === 'zh' ? '公式解读' : 'Formula Explain'}
		</h2>
		<p class="text-text-muted text-center mb-10 text-lg">
			{$lang === 'zh' ? '点击公式中的任意高亮部分，查看初学者友好的详细解释' : 'Click any highlighted part of the formula for a beginner-friendly explanation'}
		</p>

		<div class="flex flex-wrap justify-center gap-2 mb-12">
			{#each formulas as f}
				<button
					onclick={() => { selectedFormulaId = f.id; selectedSegmentId = null; }}
					class="px-5 py-2.5 text-base font-medium rounded-lg transition-all border"
					class:bg-primary={selectedFormulaId === f.id}
					class:text-white={selectedFormulaId === f.id}
					class:border-primary={selectedFormulaId === f.id}
					class:bg-white={selectedFormulaId !== f.id}
					class:border-border={selectedFormulaId !== f.id}
					class:text-text-muted={selectedFormulaId !== f.id}
				>
					{f.name}
				</button>
			{/each}
		</div>

		<!-- Interactive full formula -->
		<div class="bg-white border border-border rounded-xl p-8 shadow-sm mb-8">
			<div class="text-sm font-medium text-text-muted mb-4 uppercase tracking-wider">
				{$lang === 'zh' ? '点击公式中高亮部分 ↓' : 'Click highlighted parts ↓'}
			</div>
			<div class="formula-highlight overflow-x-auto flex flex-wrap items-center justify-center gap-0">
				{#each selectedFormula.formulaParts as part}
					{@const segColor = getSegmentColor(part.segId)}
					{#if part.segId}
						<button
							onclick={() => selectSegment(part.segId!)}
							class="formula-part-btn relative transition-all duration-200 rounded-md cursor-pointer"
							style={selectedSegmentId === part.segId
								? `background: ${segColor}18; box-shadow: 0 0 0 2px ${segColor}; border-radius: 6px;`
								: ''}
							title={selectedFormula.segments.find(s => s.id === part.segId)?.label[$lang] ?? ''}
						>
							<span class="formula-part-underline" style="--seg-color: {segColor};">
								{@html renderLatex(part.latex, false)}
							</span>
						</button>
					{:else}
						<span class="formula-part-static">
							{@html renderLatex(part.latex, false)}
						</span>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Segment chips + explanation -->
		<div class="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
			<div class="px-8 py-5 border-b border-border bg-surface-light/50">
				<div class="text-base font-bold text-primary">
					{$lang === 'zh' ? '公式组成部分' : 'Formula Components'}
				</div>
			</div>

			<div class="p-8">
				<div class="flex flex-wrap gap-3 mb-6">
					{#each selectedFormula.segments as seg}
						<button
							onclick={() => selectSegment(seg.id)}
							class="group relative rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden"
							style={selectedSegmentId === seg.id
								? `border-color: ${seg.color}; background: ${seg.color}08; box-shadow: 0 0 0 3px ${seg.color}20;`
								: `border-color: #e2e8f0;`}
						>
							<div class="px-4 py-1 text-xs font-bold tracking-wider uppercase text-white"
								style="background: {seg.color};">
								{seg.label[$lang]}
							</div>
							<div class="px-5 py-3 overflow-x-auto">
								{@html renderLatex(seg.latex, false)}
							</div>
						</button>
					{/each}
				</div>

				{#if selectedSegment}
					<div class="rounded-xl border-2 p-6 transition-all duration-300 animate-fade-in"
						style="border-color: {selectedSegment.color}; background: {selectedSegment.color}06;">
						<div class="flex items-center gap-3 mb-4">
							<div class="w-4 h-4 rounded-full" style="background: {selectedSegment.color};"></div>
							<h4 class="text-xl font-bold" style="color: {selectedSegment.color};">
								{selectedSegment.label[$lang]}
							</h4>
						</div>
						<div class="mb-4 inline-block formula-highlight">
							{@html renderLatex(selectedSegment.latex, true)}
						</div>
						<p class="text-lg text-text-muted leading-relaxed whitespace-pre-line">
							{selectedSegment.explanation[$lang]}
						</p>
					</div>
				{:else}
					<div class="rounded-xl border-2 border-dashed border-border p-8 text-center text-text-muted">
						<p class="text-lg">
							{$lang === 'zh'
								? '点击上方公式中的高亮部分或下方的模块卡片，查看详细解释'
								: 'Click a highlighted part in the formula above, or a block card below, to see its explanation'}
						</p>
					</div>
				{/if}
			</div>
		</div>

		{#if selectedFormula.vsGrpo && selectedFormulaId !== 'grpo'}
			<div class="mt-8 bg-white border border-border rounded-xl p-8 shadow-sm">
				<h3 class="text-xl font-bold text-accent mb-4 flex items-center gap-2">
					<ChevronRight size={20} />
					{$lang === 'zh'
						? `${selectedFormula.name} 相比 GRPO 改了什么？`
						: `What did ${selectedFormula.name} change from GRPO?`}
				</h3>
				<p class="text-base text-text-muted leading-relaxed">
					{selectedFormula.vsGrpo[$lang]}
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes fade-in {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in {
		animation: fade-in 0.25s ease-out;
	}
	.formula-part-btn {
		padding: 2px 4px;
		margin: 0 -1px;
		border-radius: 4px;
	}
	.formula-part-btn:hover {
		background: color-mix(in srgb, var(--seg-color) 12%, transparent);
	}
	.formula-part-underline {
		padding: 0;
	}
	.formula-part-static {
		padding: 2px 0;
	}
</style>
