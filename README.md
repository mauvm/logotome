# Logotome

SaaS project to provide democratically controlled open-source projects.

### Concept

Say you have


The Ownerfile in the root directory specifies the GitHub users that can vote on PRs. If the majority of them votes (by commenting "LGTM" on the PR), the PR will automatically be merged.

### Setup

1. Create Ownerfile
2. Add webhook to repository (to SaaS url)

### How it works

1. When someone comments on a PR, the webhook is triggered
2. The Ownerfile is fetched and the owners are determined
3. The PR comments are fetched too
4. The owner comments on the PR will be filtered out
5. The comments will be checked for "LGTM"
6. If the majority of the owners thinks it looks good, the PR will be merged

### Pros

- Democratic model
- The repo owner can setup the repository, assign owners, and let the magic happen
- The current owners can democratically add/kick other owners, by merging a new Ownerfile

### Cons

- The time PRs are merged will be slowed down (especially with a lot of owners)

### Some Research

- Collaborators also provide part of this functionality
- Test if a new collaborator can edit the collaborators
- https://github.com/reenhanced/gitreflow
- https://github.com/rahulsom/lgtmin
- http://blog.buildbettersoftware.com/post/55281071972/a-flexible-git-workflow-for-teams