*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 2: Side Hustle](https://dev.to/challenges/hacktoberfest-week2-2026-10-12)*

## What I Built

**ReceiptDesk is a private, local-first receipt inbox for freelancers.**

Freelancers do not usually have an accounting department. They have a folder of screenshots, a handful of emailed receipts, and a monthly reminder that taxes are coming. ReceiptDesk turns receipt text into clean expense rows with a merchant, date, category, tax, and total.

The simple business is a lightweight subscription for solo freelancers who want an accountant-ready expense inbox without uploading every purchase to a third-party AI service. The product could charge for multiple workspaces, saved exports, and setup help while keeping the core local-first workflow available.

## Demo

**Live demo:** [ReceiptDesk](https://wildquest-4ltpnmcp.manus.space/receiptdesk/)

Try this flow:

1. Click **Load demo receipts**.
2. Filter the inbox by Software, Meals, or Travel.
3. Click **Add receipt** and paste receipt text.
4. Export the rows as a CSV file.
5. Try it with the network disabled: the local parser still works.

## Code

**Public repository:** [github.com/anshulchikhale30-p/wildquest](https://github.com/anshulchikhale30-p/wildquest)

ReceiptDesk lives in `public/receiptdesk/` in the repository. Its focused source is also documented in the included README.

## How I Built It

ReceiptDesk is a small static web app with a tiny Node.js server. It stores the demo and user-added expense rows in browser localStorage, so there is no account and no hosted database in the core flow.

The open/local AI path uses an Ollama-compatible endpoint when available. The app sends a bounded extraction prompt to an open-weight model such as **Qwen2.5 3B Instruct** or **Llama 3.2 3B**, asking for merchant, date, category, tax, and total as JSON.

When no local model is reachable, ReceiptDesk uses a deterministic browser-side parser. It recognizes common total and tax labels and uses transparent category heuristics. That fallback is what makes the demo inexpensive, private, and usable without internet access.

## Why Does Open Innovation Matter?

Receipt data is sensitive. It can reveal where a freelancer works, who they meet, what tools they use, and how much they spend. A closed hosted API would make the first prototype easy, but it would also turn every receipt into an upload and every extraction into a recurring inference cost.

The open/local approach makes a small side-hustle product more realistic:

- A freelancer can process receipts on a laptop with no internet.
- Receipts stay on the device unless the user deliberately connects a local model.
- The model can be swapped as better open-weight options arrive.
- The extraction prompt and fallback behavior are inspectable and editable.
- There is no per-receipt API bill forcing the business into a high-volume pricing model.

Open AI is useful here not because it makes a more impressive demo, but because it changes the economics and privacy model of a tiny product someone could actually pay for.

## My Agent Session

I did not include a DevRelay embed. The implementation is available in the public repository.

## My First User

I have not landed a paying user yet. The first validation target is a solo freelancer who currently collects receipts in a phone folder and sends them to an accountant once a quarter. The question I would test first is whether local privacy and a one-click CSV export are valuable enough to pay for every month.

<!-- Team Submissions: Please pick one member to publish the submission and credit teammates by listing their DEV usernames directly in the body of the post. -->
