# MVA Benchmark — 2026-10-06T13-54-22-771Z

Model: `claude-sonnet-4-5` · Shape: `anthropic` · URL: `https://api.anthropic.com/v1/messages`

## Aggregates

| mode | n | avg latency (ms) | avg in tok | avg out tok | avg chars | total out tok | total latency (ms) |
|---|---|---|---|---|---|---|---|
| default | 20 | 7074 | 31 | 605 | 2038 | 12097 | 141474 |
| caveman | 20 | 4243 | 1127 | 251 | 861 | 5028 | 84867 |
| mva | 20 | 1914 | 761 | 84 | 280 | 1671 | 38276 |

## Per-prompt responses

One file per prompt in `prompts/`.

- [p01_bug_short](prompts/p01_bug_short.md)
- [p02_rename_cmd](prompts/p02_rename_cmd.md)
- [p03_module_missing](prompts/p03_module_missing.md)
- [p04_sql_trailing_space](prompts/p04_sql_trailing_space.md)
- [p05_git_amend_pushed](prompts/p05_git_amend_pushed.md)
- [p06_explain_closures](prompts/p06_explain_closures.md)
- [p07_explain_eventloop](prompts/p07_explain_eventloop.md)
- [p08_explain_cap_theorem](prompts/p08_explain_cap_theorem.md)
- [p09_explain_oauth_vs_jwt](prompts/p09_explain_oauth_vs_jwt.md)
- [p10_explain_tcp_vs_udp](prompts/p10_explain_tcp_vs_udp.md)
- [p11_regex_email](prompts/p11_regex_email.md)
- [p12_choice_db](prompts/p12_choice_db.md)
- [p13_ambiguous_slow_tests](prompts/p13_ambiguous_slow_tests.md)
- [p14_react_rerender](prompts/p14_react_rerender.md)
- [p15_write_code](prompts/p15_write_code.md)
- [p16_debug_mystery](prompts/p16_debug_mystery.md)
- [p17_concept_idempotent](prompts/p17_concept_idempotent.md)
- [p18_perf_question](prompts/p18_perf_question.md)
- [p19_architecture](prompts/p19_architecture.md)
- [p20_open_ended](prompts/p20_open_ended.md)