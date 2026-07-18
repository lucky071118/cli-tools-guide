---
name: create-branch-commit-pr
description: "Create a new Git branch, commit uncommitted changes, push the branch, and open a GitHub pull request with gh."
argument-hint: "What should this skill produce?"
---

Use this skill to create a new branch from the current branch, commit any uncommitted files, push the branch to the remote, and create a GitHub pull request with `gh pull request create`.

Steps:
1. Confirm the current repository state and identify uncommitted changes.
2. If no changes are present, prompt the user to add or modify files before proceeding.
3. Request the new branch name and commit message, or infer them from the changelist if available.
4. Create the new branch locally.
5. Stage all uncommitted files.
6. Commit the staged changes with the provided message.
7. Push the new branch to the remote repository.
8. Use `gh pull request create` to open a PR from the new branch.
9. Verify the PR URL and status.

Decision points:
- If the requested branch name already exists locally or on remote, ask the user whether to overwrite, choose a new name, or abort.
- If staging fails because of ignored or conflicting files, report the exact problem.
- If `gh` is not installed or authenticated, notify the user and stop.

Quality checks:
- A new branch is created locally and pushed remotely.
- The commit includes all intended uncommitted changes.
- A GitHub pull request is created successfully.
- The PR creation command returns a valid URL.

Example prompts:
- "Create a new branch, commit my uncommitted files, push it, and open a GitHub PR."
- "Make a feature branch from my current work and use gh to create the pull request."
- "Commit everything and create a GitHub pull request from a new branch."

Related customizations:
- Add a skill that stashes local changes before switching branches.
- Add a skill that updates an existing branch instead of creating a new one.
- Add a skill that creates a draft PR or targets a custom base branch.
