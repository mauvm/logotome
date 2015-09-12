# Logotome

Say you have a great idea for a new project and you are willing to open-source the project with people who know what the're talking about.

The idea of Logotome is to provide a democratically controlled Github project by specifying voters.

![LGTM](http://i.imgur.com/sAeFnJk.png)



### Concept

The `VOTERS` file in the root directory specifies the GitHub users that can vote on PRs. If the majority of them votes (by commenting "LGTM" or ":+1:" on the PR), the PR will be merged automatically.

As a proof-of-concept, this repository will be democratically controlled by Logotome.



### How it works

This will be the workflow of Logotome:

1. When someone comments on a PR, the webhook is triggered, which contacts the Logotome server;
2. The `VOTERS` file is fetched and the voters are determined;
3. Next the pull requests and their comments are fetched;
4. Non-voter comments on the PR will be filtered out;
5. The comments will be checked for "LGTM" or ":+1:"
6. If the majority of the voters thinks it looks good, the PR will be merged automatically.



### Pros

- Democratic model;
- The repo owner can setup the repository, assign voters, and let the magic happen;
- The current voters can democratically add/kick other voter, by merging a modified `VOTERS` file.



### Cons

- The time PRs are merged can be slowed down, in case of a lot of voters for example.



### Contribute

This project is currently in development. Until I've got a minimal working example up and running, I won't be merging any PRs (very non-democratic, I know). However, I do appreciate constructive feedback!



### Some Research

- https://github.com/reenhanced/gitreflow
- https://github.com/rahulsom/lgtmin
- http://blog.buildbettersoftware.com/post/55281071972/a-flexible-git-workflow-for-teams
