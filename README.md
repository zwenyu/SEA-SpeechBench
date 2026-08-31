# SEA-SpeechBench

**A Large-Scale Multitask Benchmark for Speech Understanding Across Southeast Asia**

🌐 [Website](https://zwenyu.github.io/SEA-SpeechBench/) /
📖 Paper *(coming soon)* /
🏆 Leaderboard *(coming soon)* /
💻 Code *(coming soon)* /
🤗 Dataset *(coming soon)*

## 🔥 News

- **`2026.08.20`** SEA-SpeechBench has been accepted to EMNLP 2026!

## 🌏 Overview

SEA-SpeechBench evaluates audio and multimodal LLMs on speech understanding in 11 Southeast
Asian languages: **97,194 samples** across **99 evaluation sets** and **597 hours** of curated
audio, spanning **9 tasks** in three categories — speech processing (ASR, ST, SQA),
paralinguistic analysis (ER, GR, AgeR, SpkR), and temporal reasoning (TCQ, TLoc), a new
dimension covering timestamped content queries and temporal localization in recordings up to
three minutes. Every task is evaluated under parallel prompts in English and in the native
language.

Evaluating fifteen open-source and proprietary systems exposes gaps that cluster rather than
scatter: temporal reasoning collapses as audio lengthens, native-language prompts cost accuracy
almost everywhere, and emotion recognition and speech translation sit far below usable quality.

## 📦 Release status

| Artifact | Status |
| --- | --- |
| Paper | Coming soon |
| Evaluation code | Coming soon |
| Datasets | Coming soon |
| Leaderboard | Coming soon |

SEA-SpeechBench is released as an **evaluation benchmark**. The fixed sampled evaluation set is
the official test split. Each sample carries a unique identifier mapping back to its source
dataset, so users can locate evaluation samples in the original corpora and derive their own
training splits without leakage. Where source licences permit redistribution, processed audio
is shipped directly; otherwise we provide manifest-only access with evaluation scripts,
prompts, and reconstruction instructions.

## 📝 Citation

```bibtex
@inproceedings{liao2026seaspeechbench,
  title     = {{SEA-SpeechBench}: A Large-Scale Multitask Benchmark for Speech Understanding Across Southeast Asia},
  author    = {Liao, Jingyi and Zhang, Wenyu and Liu, Zhuohan and He, Yingxu and Lin, Geyu and
               Zou, Xunlong and Sun, Shuo and Alsagoff, Syed Ali Redha and Aw, Ai Ti},
  booktitle = {Proceedings of the 2026 Conference on Empirical Methods in Natural Language Processing (EMNLP)},
  year      = {2026}
}
```

## ✉️ Contact

liao_jingyi@a-star.edu.sg · wen.projectz@gmail.com
