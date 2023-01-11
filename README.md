# Awesome codemods delivered to you!

- Intuita is a codemod manager 🤖 that makes **migrations, dependency upgrades & large refactorings** faster & easier for codebases of any size.
- Intuita's extension is [open source](https://github.com/intuita-inc/intuita-vscode-extension) & supports the best codemod engines out there (such as Facebook's JSCodeShift, Uber's Piranha, & soon ML-powered engines). Let us know if your favorite codemod engine is not supported yet.
- The codemods for upgrading the following frameworks/libraries have already been added to the extension. If you want to upgrade a dependency in the near future & it's not listed here, please [create an issue](https://github.com/intuita-inc/intuita-vscode-extension/issues/new) for us to prioritize.
  - **Nextjs vx → v13**  
  - **Material UI v4 → v5** 
  - **React Router vx → v4 & v4 → v6** 
- ⚠️ This extension is in <kbd>Public Beta</kbd>! [Get in touch](https://join.slack.com/t/intuita-inc/shared_invite/zt-1bjj5exxi-95yPfWi71HcO2p_sS5L2wA) if you are planning to use this extension for large upgrades & you have some feature requests!


---

## Why Intuita?

### Codemod Consumers 🧑🏾‍💻👩🏻‍💻
- ❌ **Without Intuita** ❌ if you want to upgrade a dependency with some API & breaking changes, you need to:
  - Search online for upgrade guides & if you are lucky, find some codemods (likely not following any quality guidelines or without proper tests).
  - Run those codemods in CLI one by one ([~60 codemods](https://github.com/mui/material-ui/tree/master/packages/mui-codemod/src/v5.0.0) for Material UI v5 upgrade) without knowing which one is actually applicable to your codebase.
  - End up with large PRs & many reviewers because you couldn't easily distribute the changes into meaningful commits.
  - And finally, if many teams are impacted, you need to create tasks, manually find who is the best reviewer and follow up on those tasks until you get the change reviewed and merged.

- ✅ **With Intuita** ✅ a set of quality-checked community-led codemods will be pushed to you right in the package.json (for JS/TS) so you don't need to search for them. 
  - You run all the codemods with one click
  - At an intermediary step before making the code change, you can tweak them if needed, batch them as you wish, and push your changes for review.
  - [Enterprise feature] for large teams, we will be building integrations with Jira/Slack/Github to automatically assign tasks and send reminders to teams, leadership dashboard for tracking and coordinating the campaign.

### Codemod Builders 🥷🏼
- ❌ **Without Intuita** ❌ you go the codemod journey alone! you ask yourself:
  - What are the best codemod engines out there for the type of transformation i want to build?
  - What's the easiet way to build codemods? any tool out there? how about creating test cases?
  - Has anyone out there built the exact codemod that I want to build?
  - How can my codemod be discovered and used by thousands of other developers out there who could benefit from it sooner or later?
 
 - ✅ **With Intuita** ✅ you are surrounded by a community of codemod experts
  - We build tools, processes & guidelines on how to write high-quality codemods, how to write tests, and which engine (imperative, declarative, ML based, pattern based, etc.) to use for each use case. 
  - We will be the distribution channel for your codemods. write a useful codemod & along with other codemods created by the community, ship it to tens of thousands of developers out there within a few mins of integrating them into Intuita. 
  - If you, just like us, are also a codemod nerd, [let's get in touch!](https://join.slack.com/t/intuita-inc/shared_invite/zt-1bjj5exxi-95yPfWi71HcO2p_sS5L2wA) we are growing our team with awesome engineers who are passionate about automaing boring tasks for fellow developers.


### Engineering Leads 👩🏾‍💼👨🏻‍💼
- ❌ **Without Intuita** ❌ leaders do not have visibility into the status of large migration/upgrade campaigns. you ask yourself:
  - How long would this upgrade take? How many developers are impacted? Are we on track to hit our business deadlines?

- ✅ **With Intuita** ✅ [enteprise features] you can easily track progress & coordinate migration campaigns across many teams.
  - **Team leads, please contact us to learn more about enterprise features such as Jira/Github/Slack integrations, automated task & notification delivery.**

---

## How It Works 🪄

1. As a codemod consumer, open a project that uses Nextjs v12 or older, Material UI v4, React Router v3 or v5.
2. Run Intuita's Command in VS Code related to that framework.
3. Intuita automatically runs all the relevant codemods, categorizes the changes, & lets you quickly review, tweak, & apply them in batches.

![Screenshot 2022-12-07 at 1 01 20 PM](https://user-images.githubusercontent.com/78109534/206294943-1dc51334-15d5-4a5f-8b9c-a701cab0ccca.png)

If you like videos better, here is a quick YouTube [tutorial](https://www.youtube.com/watch?v=pEGdu-cpu5k).

---
## Telemetry
- The extension collects telemetry data (v0.7.0 & after) & it can be disabled in the settings.
- We use telemetry to improve product performance & to guide our product roadmap.
- **We never send PII, OS information, file or folder names.**  
- See more details in our [telemetry compliance considerations](https://intuita.quip.com/ntdTAusXcdUJ/Telemetry-Compliance) doc.

---
## How Can I Share Feedback? 🎁

- Please share your ideas, questions, feature requests <kbd>[**here**](https://feedback.intuita.io/feature-requests)</kbd>, or chat with us in <kbd>[**Slack**](https://join.slack.com/t/intuita-inc/shared_invite/zt-1bjj5exxi-95yPfWi71HcO2p_sS5L2wA)</kbd>
<br>  
</br>
