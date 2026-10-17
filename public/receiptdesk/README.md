# ReceiptDesk

ReceiptDesk is a private receipt and expense inbox for freelancers. It turns pasted receipt text into structured rows, keeps the data in browser localStorage, supports a local Ollama-compatible endpoint with an open-weight model, and exports CSV.

## Demo

Load the demo receipts, filter them by category, add a receipt by pasting text, and export `receiptdesk-expenses.csv`.

## Open AI path

The browser can call `http://localhost:11434/api/generate` with an open-weight model such as Qwen2.5 3B Instruct. If no local endpoint is reachable, the deterministic parser is used. This keeps the product useful offline and avoids a hosted API bill for every receipt.

## Business model

A freelancer could pay a small monthly fee for saved workspaces, accountant-ready exports, and optional local model setup help. The core privacy promise remains local-first.
