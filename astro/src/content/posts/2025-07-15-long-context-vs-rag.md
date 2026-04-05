---
title: "Your RAG Pipeline is Probably Overkill"
date: "2025-07-15"
description: "With context windows growing past 1M tokens, do we still need RAG? I ran the experiments so you don't have to. Here's when to skip RAG, where the performance cliff is, and why reranking might be dead."
image: "/personal-homepage/posts/long-context-vs-rag/context_window_comparison_2025.png"
categories: ["Machine Learning", "NLP", "LLM", "RAG"]
---

Six months of RAG optimization. Query rewriting, reranking, hybrid search -- the full playbook. We went from 60% to 70% accuracy extracting ESG metrics from annual reports (measured on a manually labeled evaluation set). Then someone asked: *what if we just put the whole document in the context window?*

85%.

That question kicked off a research project that became a [PyData 2025 talk](https://pydata.org/amsterdam2025/). This post covers the key findings: when long context windows beat RAG, where they fall apart, and what you should actually do about it.

> **Tip:**
> - **Under 100k tokens?** Skip RAG -- context-only is simpler and performs as well or better.
> - **The 100k token quality cliff is real** -- performance degrades sharply with distractors and dissimilar phrasing (per [Chroma's research](https://www.trychroma.com/research/context-rot)).
> - **Reranking doesn't improve answer quality** in our experiments, even though retrieval metrics improve.
> - **Use way more chunks than you think** -- k=50 outperformed k=5 or k=10 significantly.

## The problem that started it all

At a bank, we needed to extract emissions data from annual reports for ESG analysis. Traditional RAG kept failing:

- Chunking destroyed cross-references between sections
- There was no standard ESG jargon across companies
- No good ground truth dataset existed for evaluation

Meanwhile, context windows were growing rapidly. In just two years, we went from 4k to over 1M tokens. An ABN AMRO annual report is around 500k tokens -- it *fits*.

![Bar chart comparing context window sizes across major LLM providers in 2025, showing Claude, Gemini, Llama, and Qwen all reaching 1M tokens.](/personal-homepage/posts/long-context-vs-rag/context_window_comparison_2025.png)

The Lord of the Rings trilogy? That fits too. But as we'll see, fitting in the context window and actually *understanding* all of it are very different things.

![Context window comparison showing that even the Lord of the Rings trilogy fits within modern LLM context windows.](/personal-homepage/posts/long-context-vs-rag/context_window_comparison_2025_lotr.png)

So the natural question became: **can we skip RAG entirely and just put the whole document in the context window?**

## The research questions

This research, building on Chroma's [Context Rot](https://www.trychroma.com/research/context-rot) study, set out to answer five questions:

1. **How fast are LLMs** at processing large context windows?
2. **When can we skip RAG entirely?**
3. **Where's the performance cliff** as context grows?
4. **Does reranking still matter** for modern LLMs?
5. **Is long context worth the cost?**

Let's go through each one.

## Speed: how fast are LLMs with large context?

The common assumption is that attention scales quadratically with context length. Luckily, modern implementations do much better than that.

![Log-log and linear plots comparing actual provider latency scaling against theoretical quadratic references, showing real-world scaling is much better than quadratic.](/personal-homepage/posts/long-context-vs-rag/companies_vs_example_scaling.png)

### Latency starts climbing after 10k tokens

Across providers, there's a clear inflection point around 10k tokens where latency starts increasing meaningfully. This is the *speed* threshold -- distinct from the *quality* cliff at 100k tokens we'll see later.

![Line chart showing response duration increasing across OpenAI, Google, and Anthropic APIs as context size grows from 1k to 1M tokens, with a clear inflection after 10k tokens.](/personal-homepage/posts/long-context-vs-rag/duration_per_provider.png)

From 100k to 1M tokens, latency increases between **4x and 10x**. At 100k tokens you're looking at roughly 5 seconds; at 1M, that's 20+ seconds.

### Token throughput flattens out

While latency increases, token throughput (tokens per second) holds relatively steady rather than collapsing. This suggests the latency increase is roughly proportional to context size, not quadratic.

![Token throughput (tokens/sec) per provider across context sizes, showing throughput holds steady rather than collapsing at larger context sizes.](/personal-homepage/posts/long-context-vs-rag/throughput_per_provider.png)

### Google's three-tier speed system

Google deserves special mention here. Their model lineup -- Gemini Flash Lite, Flash, and Pro -- creates a well-differentiated tiered system where lighter models are genuinely faster and all reliably scale to 1M tokens.

![Gemini Flash Lite, Flash, and Pro throughput across context sizes, showing a clean three-tier speed differentiation.](/personal-homepage/posts/long-context-vs-rag/gemini_throughput_vs_context_size.png)

GPT and Claude don't show this same clean tiering -- their models cluster closer together in speed, with less predictable differentiation across context sizes.

### Speed takeaways

- **Scaling beyond 100k tokens is costly** -- expect 4-10x latency increase
- **Gemini is often the fastest** for large context workloads
- **It's better than quadratic**, but still significant

## Quality: how well do context windows actually work?

The findings in this section come from Chroma's [Context Rot](https://www.trychroma.com/research/context-rot) research, which goes well beyond standard benchmarks. I'll summarize the key experiments here, but the [full report](https://www.trychroma.com/research/context-rot) is well worth reading.

Needle-in-a-Haystack (NIAH) benchmarks look great on paper. You insert a fact into a long document, ask about it, and models nail it. But how well do they work for *non-trivial* tasks?

### Experiment 1: What happens when the needle doesn't look like the question?

Standard NIAH benchmarks typically have high cosine similarity between the question and the inserted answer. Real-world scenarios often don't. You might ask about "carbon emissions targets" and the answer is buried in a paragraph about "Scope 3 downstream value chain assessments."

The Chroma team split needles into two groups based on embedding similarity:

- **Similar** to the query (easy mode)
- **Dissimilar** to the query (real-world mode)

![Needle-in-a-haystack accuracy for similar vs dissimilar question-answer pairs across context sizes, showing dissimilar pairs degrade sharply after 100k tokens. Source: Chroma Context Rot.](/personal-homepage/posts/long-context-vs-rag/needle_haystack_similarity_chroma.png)

**Key finding**: Dissimilar question-answer pairs are challenging for all models, especially after 100k tokens. Smaller models degrade faster.

### Experiment 2: The distractor problem

In real documents, there's rarely just one relevant-looking passage. Consider a coding agent with 10 different versions of your updated function in the context window. Or an annual report where multiple sections discuss similar metrics in different contexts.

The Chroma team tested this with explicit distractors -- passages similar to the answer but containing different (wrong) information:

> **Question**: What colour was the duck I had as a child?
>
> **Needle**: The duck I had when I was 10 was orange.
>
> **Distractors**:
>
> - *My brother's duck was blue*
> - *The duck I had as an adult was purple*
> - *The childhood pig was pink*

![Chart showing model accuracy declining as the number of distractors increases, with smaller models degrading fastest. Source: Chroma Context Rot.](/personal-homepage/posts/long-context-vs-rag/distractor_performance_high_performance_chroma.png)

The results are unambiguous: more distractors mean worse performance across all models. Smaller models degrade fastest, and even a single distractor reduces performance relative to the baseline.

#### Failure modes differ by model family

Interestingly, model families fail in different ways. Claude hallucinates the least -- but this comes with a trade-off.

![Stacked bar chart comparing failure modes (hallucination, refusal, wrong answer) across Claude, GPT, and Gemini model families. Source: Chroma Context Rot.](/personal-homepage/posts/long-context-vs-rag/niah_failure_modes_chroma.png)

### Experiment 3: Long conversational QA

For a more realistic test, the Chroma team used the LongMemEval dataset -- 306 chat-based questions averaging ~113k tokens of context, compared against focused prompts with only ~300 tokens of relevant context.

**Claude** refuses to answer when in doubt. Is this good or bad? It reduces hallucination but also reduces recall.

![Claude LongMemEval results showing high refusal rate with full context, trading recall for reduced hallucination. Source: Chroma Context Rot.](/personal-homepage/posts/long-context-vs-rag/chroma_claude_results_longmemeval.png)

**Gemini** performed the best overall, especially when using reasoning capabilities.

![Gemini LongMemEval results showing strong performance across question types, especially with reasoning enabled. Source: Chroma Context Rot.](/personal-homepage/posts/long-context-vs-rag/chroma_gemini_results_longmemeval.png)

### Quality takeaways

- Long context Q&A is **very much unsolved** -- even at "only" 113k tokens
- **Reasoning helps a lot** (models with chain-of-thought do better)
- **Hallucination prevention can backfire** (Claude's caution hurts recall)
- The **100k token threshold** is where things start going wrong

## Reranking: does it still matter?

Reranking has been a staple of RAG pipelines -- retrieve broadly, then rerank to put the most relevant chunks first. But with modern LLMs handling noisy context better than ever, is it still necessary?

### Experiment setup

We ran a comprehensive experiment:

- **RAG types**: Basic RAG and Enhanced RAG (query rewriting + expansion)
- **Reranking**: With and without
- **Baseline**: Full context window (no retrieval)
- **200 questions** from grouped document chunks
- **1 to 50 chunks** retrieved per query
- **3 runs each** with GPT-4.1-mini and text-embedding-3-small
- **~35,000 total datapoints**

### You need more chunks than you think

The first surprise: hit rate (was the correct chunk even retrieved?) keeps climbing well past k=10 or k=20.

![Hit rate (percentage of queries where the correct chunk was retrieved) climbing steadily from k=1 to k=50 for both basic and enhanced RAG.](/personal-homepage/posts/long-context-vs-rag/reranking_experiment_retrieval_performance_grid_hit_rate.svg)

Performance saturates around **50 chunks** -- which is about 27% of the total chunks per document. For reference, these documents averaged ~27k tokens split into ~181 chunks of ~150 tokens each. That's a lot more retrieval than the k=5 or k=10 that many tutorials suggest.

### Reranking improves retrieval metrics but not answers

Here's the provocative finding. Reranking clearly improves information retrieval metrics like MRR and Recall:

![Mean Reciprocal Rank (MRR) with and without reranking across chunk counts, showing clear improvement from reranking.](/personal-homepage/posts/long-context-vs-rag/effect_of_reranking_mrr.svg)

![Recall@10 with and without reranking, showing reranking improves retrieval recall.](/personal-homepage/posts/long-context-vs-rag/effect_of_reranking_retrieval_benchmarks_recall@10.svg)

But when we look at what actually matters -- **did the model get the right answer?** -- reranking makes essentially no difference:

![Answer correctness with and without reranking across chunk counts, showing virtually no difference despite improved retrieval metrics.](/personal-homepage/posts/long-context-vs-rag/effect_of_reranking_is_correct.svg)

At least in our experiments, modern LLMs proved robust enough to find the relevant information in noisy retrieved context without needing it neatly sorted for them.

### Speed comparison

For documents in this size range (~27k tokens per document), the speed between RAG and full context was surprisingly comparable.

![Bar chart comparing query latency between RAG with different chunk counts and full context window, showing comparable speed for documents under 30k tokens.](/personal-homepage/posts/long-context-vs-rag/retrieval_speed_vs_RAG.png)

That said, this comparison is for single documents. RAG's core advantage is scaling to large corpora -- and that advantage grows with corpus size. More complex RAG pipelines will also be slower (query rewriting, reranking steps add latency), but their cost scales linearly rather than with the full corpus size.

### RAG takeaways

- **You need much higher K than you think** -- 50 chunks saturated performance in our tests
- **In our experiments, reranking did not improve answer quality** -- even though retrieval metrics improved
- **Speed is comparable** between RAG and full context for small-to-medium documents

## Limitations

Before you go ripping out your RAG pipeline, some caveats:

- **Limited query complexity**: mostly single-hop questions in our RAG experiments
- **No reranking-as-filtering**: we didn't test using reranker confidence scores to filter chunks
- **Limited scale**: max 339 chunks per document
- **Limited model diversity**: a small set of models tested
- **Single embedding model**: only text-embedding-3-small

## A practical decision framework

Based on these findings, here's when to use what:

### Skip RAG when:
- Your domain fits in **<100k tokens**
- You have **complex, multi-hop queries** that need cross-referencing -- chunking destroys these relationships even more than long context degrades them
- The **simplicity gain** of removing retrieval infrastructure matters to your team

### Use RAG when:
- Your domain exceeds **100k tokens**
- You're dealing with **simple, factual queries**
- You need to search across a **large corpus** (RAG scales, context windows don't)

### And in both cases:
- If it fits in the context window, speed is likely comparable
- Use **more chunks than you think** (k=20-50, not k=5)
- **Question your reranking step** -- it might not be helping

## What to do Monday morning

1. **Audit your RAG pipeline** -- is your domain under 100k tokens? You might not need RAG at all.
2. **Try context-only for small domains** -- the simplicity gain is massive.
3. **Crank up K** -- run your existing eval set with k=50 and compare against your current k. The improvement may surprise you.
4. **A/B test removing reranking** -- measure answer quality, not just retrieval metrics. If correctness doesn't change, you can drop the complexity.

## Acknowledgments

The context window quality experiments in Section 2 come directly from Chroma's excellent [Context Rot](https://www.trychroma.com/research/context-rot) article. Their work was a major inspiration for this talk and this post. Thanks to **[orq.ai](https://orq.ai)** for providing unified LLM API access and observability that made running the speed and reranking experiments across multiple providers feasible.

The full code and experiment data are available on [GitHub](https://github.com/Baukebrenninkmeijer/pydata-2025-context-is-king).

---

*This post is based on my PyData Amsterdam 2025 talk "Context is King: Your RAG Pipeline is Probably Overkill." If you have questions or want to discuss your own RAG challenges, feel free to [reach out on LinkedIn](https://www.linkedin.com/in/bauke-brenninkmeijer-40143310b/).*
