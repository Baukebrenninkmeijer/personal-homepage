Six months of RAG optimization. Query rewriting, reranking, hybrid search — the full playbook.

We went from 60% to 70% accuracy extracting ESG metrics from annual reports.

Then someone asked: what if we just put the whole document in the context window?

85%.

That question turned into a research project, a PyData Amsterdam 2025 talk, and now a write-up. A few things I didn't expect going in:

▶ Under 100k tokens, RAG is often overkill. Context-only is simpler and performs as well or better.

▶ The 100k token quality cliff is real. Once you cross it, performance degrades sharply with distractors and dissimilar phrasing (per Chroma's Context Rot research).

▶ Reranking improved our retrieval metrics (MRR, Recall@10) but did not improve answer correctness. Modern LLMs handle noisy context better than the RAG playbook assumes.

▶ You probably need more chunks than you think. k=50 beat k=5 and k=10 in our tests — retrieving ~27% of the document, not the top 5.

▶ Latency scales better than quadratic, but still hurts. From 100k to 1M tokens, expect 4–10x slower responses.

If your domain fits in 100k tokens, the simplicity gain of skipping retrieval infrastructure is massive. If it doesn't, don't trust your k=5 default and audit whether reranking is actually earning its keep.

Full post with the plots, the decision framework, and what to do Monday morning:

https://blog.baukebrenninkmeijer.nl/posts/2025-07-15-long-context-vs-rag/

Code and experiment data: https://github.com/Baukebrenninkmeijer/pydata-2025-context-is-king

#RAG #LLM #MachineLearning #LongContext #AI
