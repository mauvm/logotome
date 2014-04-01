# Logotome

Say you have a great idea for a new project and you are willing to open-source the project with people who know what the're talking about.

The idea of Logotome is to provide a democratically controlled Github project by specifying owners.

### Concept

The Ownerfile in the root directory specifies the GitHub users that can vote on PRs. If the majority of them votes (by commenting "LGTM" on the PR), the PR will automatically be merged.

### Setup

In your own repository do the following:

1. Create Ownerfile which contains the Github usernames for the initial owners
2. Add repository webhook:

	- Settings > Webhooks & Services > Add webhook
	- Set Payload URL to "http://dev.nerdieworks.nl/logotome/"
	- Make sure "application/vnd.github.v3+form" is selected as Payload version
	- Select "Let me select individual events."
	- Make sure only "Pull Request review comment" is checked
	- Check "Active"
	- Click "Add webhook"

### How it works

This will be the workflow of Logotome:

1. When someone comments on a PR, the webhook is triggered, which contacts the Logotome server
2. The Ownerfile is fetched and the owners are determined
3. Next the comments of the PR are fetched
4. Non-owner comments on the PR will be filtered out
5. The comments will be checked for "LGTM" (case-insensitive string comparison, to allow images from http://lgtm.in/)
6. If the majority of the owners thinks it looks good, the PR will be automatically merged

### Pros

- Democratic model
- The repo owner can setup the repository, assign owners, and let the magic happen
- The current owners can democratically add/kick other owners, by merging a new Ownerfile

### Cons

- The time PRs are merged will be slowed down (especially with a lot of owners)

### Some Research

- Collaborators also provide part of this functionality (test if a new collaborator can edit the collaborators)
- https://github.com/reenhanced/gitreflow
- https://github.com/rahulsom/lgtmin
- http://blog.buildbettersoftware.com/post/55281071972/a-flexible-git-workflow-for-teams