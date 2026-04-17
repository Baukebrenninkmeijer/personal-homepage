Six months of RAG optimization. Query rewriting, reranking, hybrid search — the full playbook got us from 60% to 70% on ESG metrics.

Then someone asked: what if we just put the whole document in the context window?

85%.

That question turned into a research project, a PyData Amsterdam 2025 talk, and now a write-up. A few things I didn't expect going in:

▶ For single documents in our tests, context-only matched tuned RAG. Simpler pipeline, same answers. Below ~30k tokens in our runs, retrieval infrastructure wasn't earning its keep.

▶ The 100k token quality cliff is real. Past it, performance degrades sharply with distractors and dissimilar phrasing (per @Chroma's excellent Context Rot research, which this post builds on).

▶ Positional reranking — the "reorder the top-k to dodge lost-in-the-middle" job — didn't improve correctness at k=50 in our setup. Shuffling chunks sometimes even helped. Modern LLMs look more position-robust than Liu et al.'s 2023 work implied. (Caveat: we tested a legacy ms-marco cross-encoder; modern rerankers like Cohere or Voyage at low k are a different question we didn't touch.)

▶ You probably need more chunks than you think. k=50 beat k=5 and k=10 within a single document — retrieving ~27% of it. At corpus scale this almost certainly inverts.

▶ Latency scales better than quadratic, but still hurts. From 100k to 1M tokens, expect 4–10x slower responses.

Closing thought: a lot of the RAG playbook was written for mid-2023 models. Some of its defaults (low k, mandatory reranking, chunking-first) haven't aged as well as we assumed.

Full post, plots, and a long limitations section in the first comment ↓

If you run a reranker in production — is it actually moving your answer quality, or just your retrieval metrics? Genuinely curious.

#RAG #LLM #GenAI #AIEngineering #LongContext

---

**First comment (paste separately after posting):**

Full write-up: https://blog.baukebrenninkmeijer.nl/posts/2025-07-15-long-context-vs-rag/

Code + experiment data: https://github.com/Baukebrenninkmeijer/pydata-2025-context-is-king

---

**Posting checklist:**
- [ ] Attach one chart as image (recommended: hit-rate-vs-k or correctness-with-vs-without-reranking)
- [ ] Verify @Chroma tag resolves to their company page before posting
- [ ] Paste first comment within ~30 seconds of publishing (LinkedIn weights early-comment engagement)
