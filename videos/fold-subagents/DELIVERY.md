# What If Your AI Agent Had A Dozen Helpers?

- Video: `renders/fold-subagents.mp4` (1080x1920, ~38 s, Stick Story style)
- Cover frame: `cover.jpg` (the "SHIP FRIDAY → FISH FRY?" telephone-game moment)

## Title
Your AI agent doesn't need 12 helpers

## Caption
Every handoff between AI agents is a game of telephone. Here's the 3-step fix from Claude's guide on folding subagents into one main agent loop: build a small test set, fold in one helper at a time as a skill, and keep it only if the folded version scores worse.
Source: "Building agents: When to fold subagents into your main agent loop" (Claude, Oct 2026).

## Hashtags
#AIagents #Claude #AIengineering #LLM #MultiAgent #PromptEngineering #TechTok #AItips

## Narration (with line start times, seconds)
| start | line |
|---|---|
| 0.35 | What would you do if your AI agent had a dozen helpers, |
| 3.60 | and it still felt slow and kind of confused? |
| 6.34 | Well, every handoff is like a game of telephone, |
| 9.07 | where little details get lost along the way. |
| 11.54 | Step one: build a small test set first, even ten real examples. |
| 15.63 | Step two: fold one helper back into the main agent, |
| 18.79 | turning its prompt into a skill that loads only when needed. |
| 22.37 | Step three: run your tests again, more than once, |
| 24.73 | and keep the helper only if the folded version scores worse. |
| 28.37 | One team tried this and got about two times faster. |
| 31.39 | So one brain, one memory, the right tools, |
| 33.52 | and maybe your agent never needed all those helpers. |

## Facts and source
All facts come from Diane Sarkis, "Building agents: When to fold subagents into your main agent loop", Claude, Oct 22 2026:
https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop
- one company's agent had about a dozen specialist subagents
- details get lost in handoffs between agents ("telephone game")
- start evals with as few as 10 golden examples
- fold subagents in one at a time; prompts become skills that load only when needed
- run each task more than once
- keep a subagent only if the folded version scores worse
- one customer saw roughly 2x faster runtime with a single agent loop

## How to check it by hand
1. Open `renders/fold-subagents.mp4` on a phone.
2. Captions should change with the voice, each with one gold word.
3. Step cards 1, 2, 3 should pop in as the narrator says "Step one/two/three".
4. The voice should be clear over the music.
