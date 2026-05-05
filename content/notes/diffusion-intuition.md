---
title: Diffusion 模型的一个小直觉
date: 2026-04-12
tags: [research, ml, thinking]
mood: 🧠
loc: Brighton
public: true
excerpt: 把去噪过程理解成「雕刻」而不是「生成」——大理石里已经有了那个雕塑，你只是在去掉不属于它的噪声。
---

# Diffusion 模型的一个小直觉

最近在改一个小 baseline，突然发现一个让我看 diffusion loss 的眼光都变了的角度。

## 生成 vs. 雕刻

我们常常把 forward + reverse 描述为 "先加噪声，再学习去掉它"。技术上没错，但心理图像是误导的——它暗示你在**构造**一个东西。

真正发生的事情更像是 Michelangelo 的那句话——

> Every block of stone has a statue inside it, and it is the task of the sculptor to discover it.

那个 `x_0` 并不是从 Gaussian 里"长"出来的。它**本就**被编码在 `p(x_0 | x_t)` 的条件分布里；网络做的事，是把每一步的噪声尘屑刷掉一点点。

## 为什么这个视角有用

当我开始这样想，几件事变得很自然：

- **Classifier-free guidance** 就是"你再多刷掉一些不像 cat 的碎屑"
- **Consistency models** 其实是说——你没必要一次刷一点，可以直接估计最终形状
- **Schedule** 的选择，是在回答"先粗后细，还是先细后粗"

```python
# 一步去噪的核心，还是这几行
x_prev = (1/sqrt(alpha_t)) * (x_t - (beta_t/sqrt(1-alpha_bar_t)) * eps_pred)
```

## 一个 open question

如果每个 `x_0` 真的"一直在那里"，那 training distribution 的覆盖意味着什么？我们在训一个**雕塑家**，还是在**教他哪些石头是好的**？

—— 写于 Zoom meeting 后，咖啡已凉。
