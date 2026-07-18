---
name: checkout-main-and-pull
description: "Switch the repository to the main branch and pull the latest changes from the remote."
argument-hint: "What should this skill produce?"
---

Use this skill to safely update a Git repository by ensuring the local branch is `main` and then pulling the latest changes.

Steps:
1. Confirm the current repository branch and working tree state.
2. If the working tree has uncommitted changes, prompt the user to stash, commit, or discard them.
3. Fetch remote refs for the current repository.
4. Switch to the `main` branch.
5. Pull the latest changes from `origin/main`.
6. Verify that `main` is up to date and report the result.

Decision points:
- If the local branch is already `main`, skip the checkout step.
- If `main` does not exist locally, create it from `origin/main`.
- If there are merge conflicts while pulling, notify the user and stop.

Quality checks:
- The final branch is `main`.
- There are no unresolved merge conflicts.
- The local `main` branch is synchronized with `origin/main`.

Example prompts:
- "Check out back to main branch and pull the latest changes."
- "Switch to main and update from origin."
- "Ensure I'm on main and synced with remote."

Related customizations:
- Add a skill that stashes local changes before switching branches.
- Add a skill that updates a different default branch such as `master`.
