# SlothSort

SlothSort is a local-first file tidier that proposes calm destinations, names, and duplicate reviews for the downloads folder you keep avoiding. It is designed around one approval instead of a long admin session.

The browser demo uses a transparent local fallback. A production version can send the same bounded file-metadata prompt to an Ollama-compatible endpoint running an open-weight model such as Qwen2.5 3B Instruct or Llama 3.2 3B. File contents do not need to leave the device.

The key product behavior is review-first: duplicates are never silently deleted, and nothing is moved without approval.
