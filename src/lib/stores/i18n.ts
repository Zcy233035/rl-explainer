import { writable, derived } from 'svelte/store';

export type Lang = 'en' | 'zh';
export const lang = writable<Lang>('en');

const translations: Record<string, Record<Lang, string>> = {
	'nav.timeline': { en: 'Timeline', zh: '时间线' },
	'nav.pipeline': { en: 'Pipeline', zh: '流水线' },
	'nav.formula-explain': { en: 'Explain', zh: '公式解读' },
	'nav.formulas': { en: 'Formulas', zh: '公式对比' },
	'nav.details': { en: 'Details', zh: '算法详情' },
	'nav.comparison': { en: 'Compare', zh: '对比' },
	'nav.papers': { en: 'Papers', zh: '论文' },
	'nav.article': { en: 'Article', zh: '文章' },

	'hero.title': { en: 'RL Explainer', zh: 'RL Explainer' },
	'hero.subtitle': { en: 'Interactive Visualization of <span class="text-accent font-semibold">Reinforcement Learning</span> Algorithms for LLM Training', zh: '<span class="text-accent font-semibold">强化学习</span>算法在 LLM 训练中的交互式可视化' },
	'hero.desc': { en: 'From REINFORCE to GRPO, DAPO, GSPO, VAPO, and beyond -- understand how each algorithm works, what changed in each formula, and why it matters for training reasoning models.', zh: '从 REINFORCE 到 GRPO、DAPO、GSPO、VAPO 及更多 -- 直观理解每个算法的工作原理、公式变化以及对训练推理模型的影响。' },
	'hero.explore': { en: 'Explore Pipeline', zh: '探索流水线' },
	'hero.compare': { en: 'Compare Formulas', zh: '对比公式' },

	'timeline.title': { en: 'Algorithm Evolution Timeline', zh: '算法演进时间线' },
	'timeline.subtitle': { en: 'Click any algorithm to explore its details', zh: '点击任意算法查看详情' },
	'timeline.foundation': { en: 'Foundation', zh: '基础算法' },
	'timeline.critic-free': { en: 'Critic-Free', zh: '无 Critic' },
	'timeline.preference': { en: 'Preference-Based', zh: '偏好学习' },
	'timeline.advanced': { en: 'Advanced', zh: '进阶算法' },

	'pipeline.title': { en: 'Training Pipeline', zh: '训练流水线' },
	'pipeline.subtitle': { en: 'See how data flows through the RL training loop', zh: '查看数据如何在 RL 训练循环中流动' },
	'pipeline.loop': { en: 'Update weights & repeat', zh: '更新权重并重复' },
	'pipeline.components': { en: 'Specific Components', zh: '特有组件' },
	'pipeline.mechanism': { en: 'Key Mechanism', zh: '核心机制' },
	'pipeline.noextra': { en: 'No additional components beyond the basic pipeline', zh: '除基本流水线外无额外组件' },

	'pipeline.prompt': { en: 'Prompt x', zh: '输入提示 x' },
	'pipeline.prompt.desc': { en: 'Input question', zh: '输入问题' },
	'pipeline.policy': { en: 'Policy π_θ', zh: '策略 π_θ' },
	'pipeline.policy.desc': { en: 'LLM being trained', zh: '训练中的 LLM' },
	'pipeline.response': { en: 'Response y', zh: '响应 y' },
	'pipeline.response.desc': { en: 'Generated output(s)', zh: '生成的输出' },
	'pipeline.reward': { en: 'Reward R', zh: '奖励 R' },
	'pipeline.reward.desc': { en: 'Score the response', zh: '评分' },
	'pipeline.advantage': { en: 'Advantage A', zh: '优势函数 A' },
	'pipeline.advantage.desc': { en: 'Better than baseline?', zh: '是否优于基线？' },
	'pipeline.update': { en: 'Policy Update', zh: '策略更新' },
	'pipeline.update.desc': { en: 'Gradient step', zh: '梯度更新' },

	'formulas.title': { en: 'Formula Comparison', zh: '公式对比' },
	'formulas.subtitle': { en: 'See the exact mathematical differences between algorithms', zh: '查看算法之间的精确数学差异' },
	'formulas.diff': { en: 'Diff View (vs GRPO)', zh: '差异视图 (vs GRPO)' },
	'formulas.side': { en: 'Side-by-Side', zh: '并排对比' },
	'formulas.objective': { en: 'Objective Function:', zh: '目标函数：' },
	'formulas.keydiff': { en: 'Key Differences:', zh: '关键差异：' },
	'formulas.before': { en: '- Before:', zh: '- 修改前：' },
	'formulas.after': { en: '+ After:', zh: '+ 修改后：' },

	'details.title': { en: 'Algorithm Details', zh: '算法详情' },
	'details.subtitle': { en: 'Deep dive into each algorithm', zh: '深入了解每个算法' },
	'details.innovation': { en: 'Key Innovation', zh: '核心创新' },
	'details.components': { en: 'Required Components', zh: '所需组件' },
	'details.papers': { en: 'Papers', zh: '论文' },
	'details.advantages': { en: 'Advantages', zh: '优势' },
	'details.limitations': { en: 'Limitations', zh: '局限性' },
	'details.metrics': { en: 'Metrics', zh: '指标' },

	'compare.title': { en: 'Algorithm Comparison', zh: '算法对比' },
	'compare.subtitle': { en: 'Compare any two algorithms side by side', zh: '并排对比任意两个算法' },
	'compare.left': { en: 'Left Algorithm', zh: '左侧算法' },
	'compare.right': { en: 'Right Algorithm', zh: '右侧算法' },
	'compare.radar': { en: 'Radar Comparison', zh: '雷达图对比' },
	'compare.feature': { en: 'Feature Comparison', zh: '特性对比' },
	'compare.all': { en: 'All Algorithms at a Glance', zh: '所有算法一览' },

	'article.title': { en: 'Understanding RL for LLMs', zh: '理解 LLM 的强化学习' },
	'article.subtitle': { en: 'A guided tour of the key concepts', zh: '核心概念导读' },

	'footer.desc': { en: 'Interactive visualization of reinforcement learning algorithms for LLM training.', zh: '面向 LLM 训练的强化学习算法交互式可视化。' },
	'footer.built': { en: 'Built with SvelteKit, D3.js, Tailwind CSS, and KaTeX. References: DeepSeek, Qwen, ByteDance DAPO, and the open research community.', zh: '使用 SvelteKit、D3.js、Tailwind CSS 和 KaTeX 构建。参考：DeepSeek、Qwen、字节跳动 DAPO 及开源研究社区。' },

	// Metric labels
	'metric.stability': { en: 'Stability', zh: '稳定性' },
	'metric.memoryEfficiency': { en: 'Memory Efficiency', zh: '内存效率' },
	'metric.trainingSpeed': { en: 'Training Speed', zh: '训练速度' },
	'metric.quality': { en: 'Quality', zh: '质量' },
	'metric.complexity': { en: 'Complexity', zh: '复杂度' },

	// Compare table
	'feature.critic': { en: 'Needs Critic?', zh: '需要 Critic？' },
	'feature.reward_model': { en: 'Needs Reward Model?', zh: '需要奖励模型？' },
	'feature.reference': { en: 'Needs Reference Model?', zh: '需要参考模型？' },
	'feature.is_level': { en: 'Importance Ratio Level', zh: '重要性比率粒度' },
	'feature.kl': { en: 'KL Penalty?', zh: 'KL 惩罚？' },
	'feature.memory': { en: 'Models in Memory', zh: '内存中的模型数' },
};

export function t(key: string, $lang: Lang): string {
	return translations[key]?.[$lang] ?? key;
}

// Algorithm-level translations
const algoTranslations: Record<string, Record<Lang, { description: string; keyInnovation: string; objectiveExplanation: string; pros: string[]; cons: string[] }>> = {
	reinforce: {
		en: {
			description: 'The foundational policy gradient algorithm. Directly optimizes the policy by estimating gradients from sampled trajectories using the log-derivative trick.',
			keyInnovation: 'First practical policy gradient method using the log-derivative trick (score function estimator)',
			objectiveExplanation: 'Expected return gradient is estimated by weighting the log-probability of each action by the total trajectory return. Simple but suffers from very high variance because raw returns are used directly without any baseline.',
			pros: ['Simple to implement', 'Unbiased gradient estimates', 'Works with any differentiable policy'],
			cons: ['High variance makes training unstable (Williams, 1992)', 'Slow convergence without variance reduction', 'No built-in baseline mechanism']
		},
		zh: {
			description: '基础策略梯度算法。通过对数导数技巧（log-derivative trick）从采样轨迹中估计梯度，直接优化策略。',
			keyInnovation: '首个实用的策略梯度方法，使用对数导数技巧（得分函数估计器）',
			objectiveExplanation: '通过将每个动作的对数概率乘以轨迹总回报来估计期望回报的梯度。方法简单，但因直接使用原始回报而没有基线，方差非常高。',
			pros: ['实现简单', '梯度估计无偏', '适用于任何可微策略'],
			cons: ['高方差导致训练不稳定 (Williams, 1992)', '无方差减少机制时收敛缓慢', '缺乏内置基线机制']
		}
	},
	ppo: {
		en: {
			description: 'The gold standard for RLHF. Uses a clipped surrogate objective with a learned value function (critic) for stable policy updates. Requires 4 model copies in memory.',
			keyInnovation: 'Clipped surrogate objective prevents destructive policy updates; GAE for advantage estimation',
			objectiveExplanation: 'The importance ratio measures how much more likely the new policy is to take an action vs the old policy. The advantage comes from a learned critic via GAE. The min-clip limits how much the policy can change in one step. A KL penalty keeps the policy close to the reference SFT model.',
			pros: ['Most stable training dynamics (Schulman et al., 2017)', 'Best final quality when properly tuned', 'Industry proven at scale (OpenAI, Anthropic)'],
			cons: ['Requires 4 model copies in memory: policy, reference, critic, reward (InstructGPT)', 'Complex hyperparameter tuning required', '138% slower than REINFORCE++ in training (empirical comparison)']
		},
		zh: {
			description: 'RLHF 的黄金标准。使用带裁剪的替代目标函数和学习的价值函数（critic）实现稳定的策略更新。需要 4 个模型副本。',
			keyInnovation: '裁剪替代目标函数防止破坏性策略更新；GAE 用于优势估计',
			objectiveExplanation: '重要性比率衡量新策略相对于旧策略选择某个动作的可能性变化。优势值来自通过 GAE 的学习 critic。min-clip 限制策略在单步中的变化幅度。KL 惩罚使策略保持接近参考 SFT 模型。',
			pros: ['最稳定的训练动态 (Schulman et al., 2017)', '调参得当时最终质量最高', '已在工业界大规模验证（OpenAI、Anthropic）'],
			cons: ['需要 4 个模型副本：策略、参考、critic、奖励模型 (InstructGPT)', '超参数调优复杂', '训练速度比 REINFORCE++ 慢 138%（实验对比）']
		}
	},
	dpo: {
		en: {
			description: 'Eliminates RL entirely by directly optimizing the policy on preference pairs (chosen vs rejected). No reward model or RL loop needed.',
			keyInnovation: 'Reparameterizes the RLHF objective to directly optimize on preference data without explicit reward modeling',
			objectiveExplanation: 'Given a preferred response and a rejected response, directly increases the relative log-probability of the preferred one. Uses the sigmoid function to create a classification-like loss. No reward model or RL training loop is needed at all.',
			pros: ['No RL loop or reward model needed', 'Simple implementation and fast training', 'Low compute requirements (only 2 models)'],
			cons: ['Offline method: empirically inferior to online RL (Xu et al., 2024)', 'Tends to overfit beyond 1 epoch (Rafailov et al., 2023)', 'Quality ceiling is bounded by preference data quality']
		},
		zh: {
			description: '完全消除 RL，直接在偏好对（选中 vs 拒绝）上优化策略。不需要奖励模型或 RL 循环。',
			keyInnovation: '重新参数化 RLHF 目标，直接在偏好数据上优化，无需显式奖励建模',
			objectiveExplanation: '给定一个优选响应和一个拒绝响应，直接增加优选响应的相对对数概率。使用 sigmoid 函数创建类分类损失。完全不需要奖励模型或 RL 训练循环。',
			pros: ['无需 RL 循环或奖励模型', '实现简单，训练快速', '计算需求低（仅需 2 个模型）'],
			cons: ['离线方法：经验上不如在线 RL (Xu et al., 2024)', '超过 1 个 epoch 后容易过拟合 (Rafailov et al., 2023)', '质量上限受偏好数据质量限制']
		}
	},
	rlhf: {
		en: {
			description: 'The paradigm that powers ChatGPT. A 3-stage pipeline: SFT, Reward Model Training, RL Fine-tuning (typically with PPO). Not a single algorithm but a training framework.',
			keyInnovation: 'End-to-end framework: train a reward model from human preferences, then use RL to optimize policy against it',
			objectiveExplanation: 'Maximize the expected reward from a learned reward model, while keeping the policy close to the reference SFT model via a KL divergence penalty. The reward model itself is trained on human preference pairs (which response is better).',
			pros: ['Powers state-of-the-art models (ChatGPT, Claude)', 'Captures nuanced human preferences', 'Battle-tested at scale by multiple labs'],
			cons: ['Requires 4 models in memory simultaneously (Ouyang et al., 2022)', 'Reward model can be gamed via reward hacking (Gao et al., 2023)', 'Requires large volumes of high-quality human feedback data']
		},
		zh: {
			description: '驱动 ChatGPT 的训练范式。三阶段流水线：SFT、奖励模型训练、RL 微调（通常使用 PPO）。不是单一算法而是训练框架。',
			keyInnovation: '端到端框架：从人类偏好训练奖励模型，然后使用 RL 优化策略',
			objectiveExplanation: '最大化学习到的奖励模型的期望奖励，同时通过 KL 散度惩罚保持策略接近参考 SFT 模型。奖励模型本身在人类偏好对上训练。',
			pros: ['驱动最先进的模型（ChatGPT、Claude）', '能捕捉细微的人类偏好', '已被多个实验室大规模验证'],
			cons: ['需要同时在内存中存储 4 个模型 (Ouyang et al., 2022)', '奖励模型可能被奖励黑客攻击 (Gao et al., 2023)', '需要大量高质量人类反馈数据']
		}
	},
	grpo: {
		en: {
			description: 'Eliminates the critic model by estimating advantages from groups of responses to the same prompt. Used to train DeepSeek-R1. Reduces memory by ~40%.',
			keyInnovation: 'No critic needed -- compute advantage as normalized reward within a group of G sampled responses',
			objectiveExplanation: 'For each prompt, sample G responses and compute a per-token importance ratio for each. The advantage for each response is simply its reward normalized (subtract mean, divide by std) within the group -- no critic needed. The loss is averaged first per-token within each response, then across all G responses.',
			pros: ['Eliminates critic model, saving ~40% GPU memory (DeepSeek, 2024)', 'Enabled DeepSeek-R1 reasoning breakthroughs (AIME 15.6% → 71.0%)', 'Simple advantage computation from group statistics'],
			cons: ['Token-level importance sampling introduces high variance (GSPO paper, 2025)', 'Can suffer irreversible model collapse in long training runs (Qwen team)', 'Three biases identified: baseline bias, length bias, difficulty bias (Dr. GRPO)']
		},
		zh: {
			description: '通过从同一提示的多组响应中估计优势来消除 critic 模型。用于训练 DeepSeek-R1。内存减少约 40%。',
			keyInnovation: '无需 critic -- 将优势计算为 G 个采样响应组内的归一化奖励',
			objectiveExplanation: '对每个提示采样 G 个响应，计算每个的逐 token 重要性比率。每个响应的优势就是其奖励在组内的归一化值（减均值除标准差）-- 不需要 critic。损失先在每个响应内按 token 平均，再在 G 个响应间平均。',
			pros: ['消除 critic 模型，节省约 40% GPU 内存 (DeepSeek, 2024)', '推动 DeepSeek-R1 推理突破（AIME 15.6% → 71.0%）', '基于组统计的简单优势计算'],
			cons: ['逐 token 重要性采样引入高方差 (GSPO 论文, 2025)', '长时间训练可能出现不可逆的模型崩溃 (Qwen 团队)', '已识别三种偏差：基线偏差、长度偏差、难度偏差 (Dr. GRPO)']
		}
	},
	dapo: {
		en: {
			description: 'Refines GRPO with 4 targeted improvements: Clip-Higher, Dynamic Sampling, Token-Level Gradient Loss, and Overlong Reward Shaping.',
			keyInnovation: 'Decoupled upper/lower clip bounds + dynamic sampling to ensure gradient diversity + token-level loss normalization',
			objectiveExplanation: 'Four key changes from GRPO: (1) Clip-Higher: the upper clip bound is larger than the lower, encouraging exploration of rare good tokens; (2) Token-Level Loss: normalizes by total token count instead of per-response averaging, so long responses are not diluted; (3) KL penalty is removed entirely; (4) Dynamic Sampling ensures each batch contains both correct and incorrect answers.',
			pros: ['Achieved 50 points on AIME 2024 with Qwen2.5-32B (DAPO paper)', 'Fully open-source training system (NeurIPS 2025 poster)', 'Four targeted, independently validated improvements over GRPO'],
			cons: ['Dynamic Sampling increases wall-clock time when model accuracy is extreme (DAPO paper)', 'Still uses token-level importance sampling, inheriting MoE instability from GRPO', 'Disabling Dynamic Sampling sometimes yields better results (empirical finding)']
		},
		zh: {
			description: '通过 4 项针对性改进完善 GRPO：Clip-Higher、动态采样、Token 级梯度损失和超长奖励塑形。',
			keyInnovation: '解耦的上下裁剪边界 + 动态采样确保梯度多样性 + token 级损失归一化',
			objectiveExplanation: '相对 GRPO 的四个关键变化：(1) Clip-Higher：上裁剪边界大于下边界，鼓励探索稀有好 token；(2) Token 级损失：按总 token 数归一化而非按响应平均，长响应不会被稀释；(3) 完全移除 KL 惩罚；(4) 动态采样确保每批包含正确和错误答案。',
			pros: ['使用 Qwen2.5-32B 在 AIME 2024 上达到 50 分 (DAPO 论文)', '完全开源的训练系统（NeurIPS 2025 poster）', '四项独立验证的 GRPO 改进'],
			cons: ['模型准确率极端时动态采样增加实际训练时间 (DAPO 论文)', '仍使用 token 级重要性采样，继承 GRPO 的 MoE 不稳定性', '关闭动态采样有时效果更好（实验发现）']
		}
	},
	gspo: {
		en: {
			description: 'Shifts optimization from token-level to sequence-level. Replaces per-token importance ratio with a sequence-level ratio, fundamentally fixing GRPO instability in MoE.',
			keyInnovation: 'Sequence-level importance ratio replaces per-token ratio. All tokens in a sequence share the same weight.',
			objectiveExplanation: 'The crucial change: the importance ratio is computed at the sequence level (geometric mean of all token ratios), not per-token. This means all tokens in a response share the same weight. If clipping triggers, the entire sequence is clipped uniformly. This eliminates per-token variance and is critical for MoE model stability.',
			pros: ['Inherently resolves MoE training instability without Routing Replay (Qwen, 2025)', 'Powers the Qwen3 model series', 'Higher training efficiency than GRPO under the same compute budget'],
			cons: ['Sequence-level clipping loses fine-grained per-token control (by design)', 'Relatively new, less community adoption and third-party validation', 'May underperform token-level methods on tasks requiring precise token credit assignment']
		},
		zh: {
			description: '将优化从 token 级转移到序列级。用序列级重要性比率替代逐 token 比率，从根本上修复了 GRPO 在 MoE 中的不稳定性。',
			keyInnovation: '序列级重要性比率替代逐 token 比率。序列中所有 token 共享相同权重。',
			objectiveExplanation: '关键变化：重要性比率在序列级计算（所有 token 比率的几何平均），而非逐 token。这意味着响应中所有 token 共享相同权重。如果触发裁剪，整个序列被统一裁剪。这消除了逐 token 方差，对 MoE 模型稳定性至关重要。',
			pros: ['从根本上解决 MoE 训练不稳定性，无需 Routing Replay (Qwen, 2025)', '驱动 Qwen3 模型系列', '相同计算预算下训练效率高于 GRPO'],
			cons: ['序列级裁剪失去了细粒度的逐 token 控制（设计如此）', '相对较新，社区采用和第三方验证较少', '在需要精确 token 信用分配的任务上可能不如 token 级方法']
		}
	},
	reinforce_pp: {
		en: {
			description: 'Achieves PPO-like stability without a value network by combining clipped updates, KL penalty, and global advantage normalization across all prompts.',
			keyInnovation: 'Global advantage normalization across all prompts (not per-group like GRPO) for maximum stability',
			objectiveExplanation: 'Similar structure to PPO and GRPO, but the advantage is normalized globally across the entire batch of prompts, not just within each prompt group. This reduces variance caused by heterogeneous prompt difficulty. No critic model is needed.',
			pros: ['PPO-like stability without a critic model (REINFORCE++ paper)', 'Fastest training: 42h vs 60h PPO on Llama3-8B (empirical)', 'Most stable among all critic-free methods (Logic-RL, PRIME benchmarks)'],
			cons: ['Global normalization may wash out signal for prompts with unusual reward distributions', 'May underperform PPO on tasks requiring maximum output quality', 'Per-prompt advantage signal is diluted across the entire batch']
		},
		zh: {
			description: '通过结合裁剪更新、KL 惩罚和全局优势归一化，在无价值网络的情况下实现类 PPO 的稳定性。',
			keyInnovation: '跨所有提示的全局优势归一化（而非 GRPO 的组内归一化），实现最大稳定性',
			objectiveExplanation: '结构类似 PPO 和 GRPO，但优势值在整个提示批次中全局归一化，而非仅在每个提示组内。这减少了异质提示难度造成的方差。不需要 critic 模型。',
			pros: ['无需 critic 即可实现类 PPO 的稳定性 (REINFORCE++ 论文)', '最快训练速度：Llama3-8B 上 42h vs PPO 的 60h（实验数据）', '所有无 critic 方法中最稳定 (Logic-RL, PRIME 基准)'],
			cons: ['全局归一化可能淹没奖励分布异常的提示信号', '在需要最高输出质量的任务上可能不如 PPO', '单个提示的优势信号被整个批次稀释']
		}
	},
	vapo: {
		en: {
			description: 'Brings back the value model but fixes its issues for long-chain reasoning. Uses value pretraining, decoupled GAE, and length-adaptive training. AIME 2024 score: 60.4.',
			keyInnovation: 'Reintroduces a value model with fixes: value pretraining, decoupled GAE for heterogeneous lengths, length-adaptive training',
			objectiveExplanation: 'Similar structure to PPO, but with three key improvements: (1) the value model is pretrained separately to reduce initial estimation bias; (2) GAE is computed with length-aware normalization to handle different response lengths; (3) training adapts to sparse rewards in long reasoning chains. This achieves much finer credit assignment than group-level advantage.',
			pros: ['SOTA on AIME 2024 with score 60.4, surpassing DAPO by 10+ points (VAPO paper)', 'Finer per-token credit assignment than any group-based method', 'Stable training: no crashes in 5000 steps on Qwen-32B (VAPO paper)'],
			cons: ['Requires a critic model, increasing memory to 4 models like PPO (VAPO paper)', 'Value pretraining adds a separate training phase before RL begins', 'Overall training pipeline is more complex than critic-free approaches']
		},
		zh: {
			description: '恢复价值模型但修复了其在长链推理中的问题。使用价值预训练、解耦 GAE 和长度自适应训练。AIME 2024 得分：60.4。',
			keyInnovation: '重新引入价值模型并修复：价值预训练、处理异质长度的解耦 GAE、长度自适应训练',
			objectiveExplanation: '结构类似 PPO，但有三个关键改进：(1) 价值模型单独预训练以减少初始估计偏差；(2) GAE 使用长度感知归一化来处理不同响应长度；(3) 训练适应长推理链中的稀疏奖励。这实现了比组级优势更精细的信用分配。',
			pros: ['AIME 2024 SOTA 得分 60.4，超过 DAPO 10+ 分 (VAPO 论文)', '比任何基于组的方法更精细的逐 token 信用分配', '训练稳定：Qwen-32B 上 5000 步无崩溃 (VAPO 论文)'],
			cons: ['需要 critic 模型，内存增加到与 PPO 相同的 4 个模型 (VAPO 论文)', '价值预训练在 RL 开始前增加了单独的训练阶段', '整体训练流水线比无 critic 方法更复杂']
		}
	},
	gmpo: {
		en: {
			description: 'Replaces arithmetic mean of token rewards with geometric mean, making optimization less sensitive to outlier tokens. Simple drop-in replacement for GRPO.',
			keyInnovation: 'Geometric mean of token-level importance ratios instead of arithmetic mean, inherently suppresses outliers',
			objectiveExplanation: 'The importance ratios across all tokens are combined using a geometric mean (product raised to 1/length) instead of arithmetic mean. This inherently suppresses outlier tokens: one extreme ratio cannot dominate the update. Equivalent to taking the exponential of the average log-ratio. A simple plug-and-play replacement for GRPO.',
			pros: ['Drop-in replacement for GRPO, minimal code changes needed', '+4.1% Pass@1 improvement on math reasoning benchmarks (GMPO paper)', 'Smoother reward trajectories and sustained token entropy during training'],
			cons: ['Still operates at token-level, so MoE instability issues from GRPO may persist', 'Relatively new with limited large-scale validation beyond the original paper', 'Geometric mean can overly suppress legitimate high-ratio tokens in some cases']
		},
		zh: {
			description: '用几何平均替代算术平均来聚合 token 奖励，使优化对异常 token 更不敏感。GRPO 的简单即插即用替代。',
			keyInnovation: 'Token 级重要性比率的几何平均替代算术平均，天然抑制异常值',
			objectiveExplanation: '所有 token 的重要性比率使用几何平均（乘积的 1/长度 次方）而非算术平均来聚合。这天然抑制异常 token：一个极端比率无法主导更新。等价于取对数比率平均值的指数。是 GRPO 的简单即插即用替代。',
			pros: ['GRPO 的即插即用替代，代码改动极小', '数学推理基准上 Pass@1 提升 4.1% (GMPO 论文)', '训练过程中奖励轨迹更平滑，token 熵持续保持'],
			cons: ['仍在 token 级操作，GRPO 的 MoE 不稳定性问题可能持续', '相对较新，除原论文外大规模验证有限', '几何平均在某些情况下可能过度抑制合理的高比率 token']
		}
	},
	gfpo: {
		en: {
			description: 'Addresses RL-trained models producing verbose outputs. Filters responses by length and token efficiency (reward/token) before policy update, reducing response length by up to 85%.',
			keyInnovation: 'Length-aware filtering: only concise, high-reward-per-token responses are used for policy updates',
			objectiveExplanation: 'Before updating the policy, responses are filtered: only those with high reward-per-token (concise correct answers) pass the filter. The policy only learns from short, efficient solutions. An Adaptive Difficulty variant further allocates more sampling compute to harder problems where the model struggles.',
			pros: ['Up to 85% response length reduction while maintaining accuracy (GFPO paper)', 'Matches GRPO accuracy with much shorter outputs across STEM benchmarks', 'Substantial inference-time speedup from more concise responses'],
			cons: ['Filtering reduces the effective number of training samples per batch (GFPO paper)', 'Larger initial sample groups needed, increasing per-step compute cost', 'May discard genuinely necessary long reasoning chains for complex problems']
		},
		zh: {
			description: '解决 RL 训练后模型输出冗长的问题。在策略更新前按长度和 token 效率（奖励/token）过滤响应，响应长度最多减少 85%。',
			keyInnovation: '长度感知过滤：仅使用简洁、高 reward-per-token 的响应来更新策略',
			objectiveExplanation: '在更新策略前对响应进行过滤：仅高 reward-per-token（简洁正确答案）通过过滤器。策略只从短而高效的解决方案中学习。自适应难度变体进一步将更多采样计算分配给模型困难的问题。',
			pros: ['保持准确率的同时响应长度减少高达 85% (GFPO 论文)', '在 STEM 基准上以更短输出匹配 GRPO 准确率', '更简洁的响应带来显著的推理时间加速'],
			cons: ['过滤减少了每批次的有效训练样本数 (GFPO 论文)', '需要更大的初始采样组，增加每步计算成本', '可能丢弃复杂问题中确实必要的长推理链']
		}
	}
};

export function getAlgoText(id: string, $lang: Lang): { description: string; keyInnovation: string; objectiveExplanation: string; pros: string[]; cons: string[] } | undefined {
	return algoTranslations[id]?.[$lang];
}

// Pipeline specifics translations
const pipelineSpecificsTranslations: Record<string, Record<Lang, { extras: string[], notes: string }>> = {
	reinforce: {
		en: { extras: [], notes: 'Advantage equals raw return. High variance, no baseline.' },
		zh: { extras: [], notes: '优势等于原始回报。高方差，无基线。' }
	},
	ppo: {
		en: { extras: ['Reference Model', 'Critic V(s)', 'KL Penalty'], notes: 'Advantage from GAE via learned critic. Clipped objective. 4 models in memory.' },
		zh: { extras: ['参考模型', 'Critic V(s)', 'KL 惩罚'], notes: '通过学习的 critic 经 GAE 计算优势。裁剪目标函数。内存中需要 4 个模型。' }
	},
	rlhf: {
		en: { extras: ['Reference Model', 'Critic V(s)', 'Reward Model', 'Human Preferences'], notes: 'Full pipeline: SFT, then Reward Model, then PPO fine-tuning. Most expensive approach.' },
		zh: { extras: ['参考模型', 'Critic V(s)', '奖励模型', '人类偏好数据'], notes: '完整流水线：SFT → 奖励模型 → PPO 微调。最昂贵的方案。' }
	},
	dpo: {
		en: { extras: ['Reference Model', 'Preference Pairs'], notes: 'No RL loop! Direct optimization on preference pairs. No reward model needed.' },
		zh: { extras: ['参考模型', '偏好对'], notes: '无 RL 循环！直接在偏好对上优化。不需要奖励模型。' }
	},
	grpo: {
		en: { extras: ['Reference Model', 'Group of G Responses'], notes: 'Advantage is reward normalized within the group. No critic needed. Per-token importance sampling.' },
		zh: { extras: ['参考模型', 'G 个响应组'], notes: '优势是组内归一化的奖励。不需要 critic。逐 token 重要性采样。' }
	},
	dapo: {
		en: { extras: ['Reference Model', 'Dynamic Sampling', 'Clip-Higher'], notes: 'GRPO with decoupled clip bounds, token-level loss, and dynamic sampling. No KL penalty.' },
		zh: { extras: ['参考模型', '动态采样', 'Clip-Higher'], notes: 'GRPO + 解耦裁剪边界 + token 级损失 + 动态采样。无 KL 惩罚。' }
	},
	gspo: {
		en: { extras: ['Reference Model', 'Sequence-Level Ratio'], notes: 'Replaces per-token ratio with sequence-level ratio. All tokens in a sequence share the same weight.' },
		zh: { extras: ['参考模型', '序列级比率'], notes: '用序列级比率替代逐 token 比率。序列中所有 token 共享相同权重。' }
	},
	reinforce_pp: {
		en: { extras: ['Reference Model', 'Global Normalization'], notes: 'Advantage normalized globally across all prompts, not just within each group.' },
		zh: { extras: ['参考模型', '全局归一化'], notes: '优势在所有提示间全局归一化，而非仅在每个组内。' }
	},
	vapo: {
		en: { extras: ['Reference Model', 'Pretrained Critic', 'Decoupled GAE'], notes: 'Brings back the critic with fixes: pretrained value model, decoupled GAE, length-adaptive training.' },
		zh: { extras: ['参考模型', '预训练 Critic', '解耦 GAE'], notes: '恢复 critic 并修复：预训练价值模型、解耦 GAE、长度自适应训练。' }
	},
	gmpo: {
		en: { extras: ['Reference Model', 'Geometric Mean'], notes: 'Geometric mean of token ratios replaces arithmetic mean. Suppresses outlier tokens.' },
		zh: { extras: ['参考模型', '几何平均'], notes: 'Token 比率的几何平均替代算术平均。抑制异常 token。' }
	},
	gfpo: {
		en: { extras: ['Reference Model', 'Length Filter', 'Token Efficiency Filter'], notes: 'Filters responses by reward-per-token ratio before updating the policy.' },
		zh: { extras: ['参考模型', '长度过滤器', 'Token 效率过滤器'], notes: '在更新策略前按 reward-per-token 比率过滤响应。' }
	}
};

export function getPipelineSpecifics(id: string, $lang: Lang): { extras: string[], notes: string } {
	return pipelineSpecificsTranslations[id]?.[$lang] ?? pipelineSpecificsTranslations[id]?.en ?? { extras: [], notes: '' };
}

// Article sections
export function getArticleSections($lang: Lang) {
	if ($lang === 'zh') return articleSectionsZh;
	return articleSectionsEn;
}

const articleSectionsEn = [
	{
		title: 'What is RL for LLMs?',
		content: 'After pretraining (predicting next tokens) and SFT (supervised fine-tuning on instructions), reinforcement learning is what makes models helpful, harmless, and honest. RL optimizes the model\'s policy to maximize a reward signal, which can come from human preferences (RLHF), verifiable correctness (RLVR), or other metrics.\n\nThe fundamental challenge: you\'re optimizing sequences of 1000+ tokens, rewards are sparse (one signal for the whole response), and policy updates must be stable across billions of parameters.'
	},
	{
		title: 'The Policy Gradient Foundation',
		content: 'All RL algorithms for LLMs share the same foundation: the Policy Gradient Theorem. The goal is to maximize expected reward:',
		formula: '\\max_{\\pi_\\theta} \\; \\mathbb{E}_{x \\sim D, \\, y \\sim \\pi_\\theta(\\cdot|x)} \\left[ R(x, y) \\right]',
		after: 'The gradient of this objective is estimated using the log-derivative trick (REINFORCE). The key differences between algorithms lie in: (1) how they estimate the advantage, (2) how they constrain policy updates, and (3) what level of granularity (token vs sequence) they operate at.'
	},
	{
		title: 'The Evolution: Why GRPO Changed Everything',
		content: 'PPO was the gold standard but required 4 model copies: policy, reference, critic, and reward model. For 70B+ models, this was prohibitive. DeepSeek\'s GRPO removed the critic entirely by computing advantages from groups of responses:',
		formula: 'A_i = \\frac{R_i - \\text{mean}(\\{R_1, ..., R_G\\})}{\\text{std}(\\{R_1, ..., R_G\\})}',
		after: 'This simple change saved ~40% memory and enabled training DeepSeek-R1, which improved AIME 2024 pass@1 from 15.6% to 71.0%. But GRPO has stability issues, especially in MoE architectures and long training runs.'
	},
	{
		title: 'The Token-Level Problem',
		content: 'GRPO uses per-token importance sampling ratios. This creates three problems:\n\n1. High variance: individual token ratios can become extreme, especially in MoE where different experts activate for old vs new policy.\n2. Gradient dilution: long responses have per-token gradients diluted by per-response normalization.\n3. Granularity mismatch: reward is sequence-level but optimization is token-level.\n\nDifferent algorithms solve this differently:\n- DAPO: fixes clipping and normalization at token level\n- GSPO: moves entirely to sequence-level ratios\n- GMPO: uses geometric mean to suppress outlier tokens\n- GFPO: filters out verbose responses before training'
	},
	{
		title: 'The Clipping Mechanism: Why It Matters',
		content: 'The min-clip operation is central to the PPO/GRPO family:',
		formula: '\\min\\left( r_t A_t, \\; \\text{clip}(r_t, 1-\\varepsilon, 1+\\varepsilon) A_t \\right)',
		after: 'When the advantage is positive and the ratio exceeds the upper bound, clipping caps the update and the gradient becomes zero. This prevents overconfident updates.\n\nDAPO discovered the "Matthew Effect": if the old policy barely sampled a good token, the clip cap is very tight, preventing improvement. Clip-Higher uses a larger upper bound to fix this asymmetry.'
	},
	{
		title: 'Sequence-Level vs Token-Level: GSPO',
		content: 'GSPO\'s key insight: if the reward is sequence-level, the importance ratio should be too:',
		formula: 's_i = \\exp\\left(\\frac{1}{|o_i|}\\sum_{t=1}^{|o_i|} \\log \\frac{\\pi_\\theta(o_{i,t}|q,o_{i,<t})}{\\pi_{old}(o_{i,t}|q,o_{i,<t})}\\right)',
		after: 'This is the geometric mean of token-level ratios. All tokens in a sequence share the same weight. If clipping triggers, the entire sequence is clipped uniformly. This eliminates per-token variance and makes MoE training stable without Routing Replay. GSPO powers Qwen3.'
	},
	{
		title: 'Bringing Back the Critic: VAPO',
		content: 'While GRPO removed the critic, ByteDance\'s VAPO brings it back with fixes:\n1. Value Pretraining: critic is pretrained to reduce initial bias\n2. Decoupled GAE: handles heterogeneous sequence lengths\n3. Length-Adaptive Training: adjusts for sparse rewards in long chains\n\nResult: AIME 2024 score of 60.4, surpassing DAPO by 10+ points. This shows that per-token credit assignment (from a good critic) can outperform sequence-level advantage when done right.'
	},
	{
		title: 'How to Choose?',
		content: 'The decision depends on your constraints:\n\n- Maximum quality, unlimited compute: PPO or VAPO\n- Reasoning model, moderate compute: GRPO, DAPO, or GSPO\n- Training MoE models: GSPO (no Routing Replay needed)\n- Best speed/stability balance: REINFORCE++\n- Limited compute, have preference data: DPO\n- Want concise outputs: GFPO\n- Drop-in GRPO improvement: GMPO\n\nThe trend is clear: critic-free, sequence-level optimization is winning. GSPO and REINFORCE++ represent the current frontier for practical large-scale RL training.'
	}
];

const articleSectionsZh = [
	{
		title: '什么是 LLM 的强化学习？',
		content: '在预训练（预测下一个 token）和 SFT（指令微调）之后，强化学习使模型变得有用、无害且诚实。RL 优化模型策略以最大化奖励信号，这些信号可以来自人类偏好（RLHF）、可验证的正确性（RLVR）或其他指标。\n\n核心挑战：你需要优化 1000+ token 的序列，奖励稀疏（整个响应只有一个信号），且策略更新必须在数十亿参数上保持稳定。'
	},
	{
		title: '策略梯度基础',
		content: '所有 LLM 的 RL 算法共享相同的基础：策略梯度定理。目标是最大化期望奖励：',
		formula: '\\max_{\\pi_\\theta} \\; \\mathbb{E}_{x \\sim D, \\, y \\sim \\pi_\\theta(\\cdot|x)} \\left[ R(x, y) \\right]',
		after: '该目标的梯度使用对数导数技巧（REINFORCE）来估计。算法之间的关键差异在于：(1) 如何估计优势函数，(2) 如何约束策略更新，(3) 在什么粒度（token 级 vs 序列级）上操作。'
	},
	{
		title: '演进：为什么 GRPO 改变了一切',
		content: 'PPO 是黄金标准，但需要 4 个模型副本：策略、参考、critic 和奖励模型。对于 70B+ 的模型，这是不可承受的。DeepSeek 的 GRPO 通过从响应组中计算优势，完全移除了 critic：',
		formula: 'A_i = \\frac{R_i - \\text{mean}(\\{R_1, ..., R_G\\})}{\\text{std}(\\{R_1, ..., R_G\\})}',
		after: '这个简单的改变节省了约 40% 的内存，并使 DeepSeek-R1 的训练成为可能，AIME 2024 的 pass@1 从 15.6% 提升到 71.0%。但 GRPO 存在稳定性问题，尤其在 MoE 架构和长时间训练中。'
	},
	{
		title: 'Token 级问题',
		content: 'GRPO 使用逐 token 的重要性采样比率。这产生三个问题：\n\n1. 高方差：单个 token 比率可能变得极端，尤其在 MoE 中新旧策略激活不同专家时。\n2. 梯度稀释：长响应的逐 token 梯度因按响应归一化而被稀释。\n3. 粒度不匹配：奖励是序列级的，但优化是 token 级的。\n\n不同算法以不同方式解决：\n- DAPO：在 token 级修复裁剪和归一化\n- GSPO：完全转向序列级比率\n- GMPO：使用几何平均抑制异常 token\n- GFPO：训练前过滤冗长响应'
	},
	{
		title: '裁剪机制：为什么重要',
		content: 'min-clip 操作是 PPO/GRPO 系列的核心：',
		formula: '\\min\\left( r_t A_t, \\; \\text{clip}(r_t, 1-\\varepsilon, 1+\\varepsilon) A_t \\right)',
		after: '当优势为正且比率超过上界时，裁剪限制更新幅度，梯度变为零。这防止了过于自信的更新。\n\nDAPO 发现了"马太效应"：如果旧策略几乎不采样某个好 token，裁剪上限非常紧，阻止了改进。Clip-Higher 使用更大的上界来修复这种不对称性。'
	},
	{
		title: '序列级 vs Token 级：GSPO',
		content: 'GSPO 的关键洞察：如果奖励是序列级的，重要性比率也应该如此：',
		formula: 's_i = \\exp\\left(\\frac{1}{|o_i|}\\sum_{t=1}^{|o_i|} \\log \\frac{\\pi_\\theta(o_{i,t}|q,o_{i,<t})}{\\pi_{old}(o_{i,t}|q,o_{i,<t})}\\right)',
		after: '这是 token 级比率的几何平均。序列中所有 token 共享相同权重。如果触发裁剪，整个序列被统一裁剪。这消除了逐 token 方差，使 MoE 训练无需 Routing Replay 即可稳定。GSPO 驱动 Qwen3。'
	},
	{
		title: '恢复 Critic：VAPO',
		content: '虽然 GRPO 移除了 critic，但字节跳动的 VAPO 带着修复将其恢复：\n1. 价值预训练：critic 预训练以减少初始偏差\n2. 解耦 GAE：处理异质序列长度\n3. 长度自适应训练：适应长链中的稀疏奖励\n\n结果：AIME 2024 得分 60.4，超过 DAPO 10+ 分。这表明，如果做得对，逐 token 信用分配（来自好的 critic）可以优于序列级优势。'
	},
	{
		title: '如何选择？',
		content: '选择取决于你的约束条件：\n\n- 最高质量，计算不限：PPO 或 VAPO\n- 推理模型，适度计算：GRPO → DAPO → GSPO\n- 训练 MoE 模型：GSPO（无需 Routing Replay）\n- 最佳速度/稳定性平衡：REINFORCE++\n- 有限计算，有偏好数据：DPO\n- 需要简洁输出：GFPO\n- GRPO 即插即用改进：GMPO\n\n趋势很明确：无 critic、序列级优化正在胜出。GSPO 和 REINFORCE++ 代表了大规模 RL 训练的当前前沿。'
	}
];
