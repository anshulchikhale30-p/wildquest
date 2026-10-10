# WildQuest

**WildQuest is an offline-first AI field guide that generates tiny outdoor missions, then gets out of the way.**

## Demo flow

1. Pick a time, place, pace, and company.
2. Generate a mission. With no local model configured, the deterministic fallback works without a network.
3. Start Trail Mode and put the phone away between task check-ins.
4. Return, write a field note, and add photos from the walk.

## Open AI architecture

The browser can call an Ollama-compatible local endpoint (for example, `http://localhost:11434/api/generate`) using an open-weight model such as Qwen2.5 3B Instruct or Llama 3.2 3B. If the endpoint is unavailable, WildQuest uses a seeded local generator so the core experience still runs in airplane mode. No photos, reflections, or location data leave the device in the fallback path.

The app is intentionally model-swappable: the mission prompt, local endpoint, and fallback are visible in `public/app.js`, rather than hidden behind a hosted black box.

## Run locally

```bash
npm start
# open http://localhost:3000
```

## Why it matters

Most AI products optimize for more screen time. WildQuest uses open/local AI to optimize for the opposite: a useful first minute, then a quiet phone. Local inference makes privacy and no-signal use practical, and an inspectable prompt lets the community change the behavior from chatty assistant to gentle field companion.
