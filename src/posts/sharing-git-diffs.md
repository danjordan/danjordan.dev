---
date: 2020-01-20
slug: sharing-git-diffs
tags:
  - posts
title: Sharing Git Diffs
---

Have you ever wanted to share some code changes without creating a new commit and pushing to a branch?

Recently I had this problem and discovered that using <code class="language-bash">git diff</code> and <code class="language-bash">git apply</code> can do this.

You can use <code class="language-bash">git diff</code> to export your unstaged changes to a patch file.

```bash
git diff > changes.patch
```

You can then send this file to the people you want to share the changes with. If they run <code class="language-bash">git apply</code> they will apply the changes to their branch.

```bash
git apply changes.patch
```

## Further Reading

- [git diff docs](https://git-scm.com/docs/git-diff)
- [git apply docs](https://git-scm.com/docs/git-apply)
