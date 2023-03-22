# Awesome codemods delivered to you!

- [Intuita](https://intuita.io) is a codemod manager 🤖 that makes **migrations, dependency upgrades & large refactorings** faster & easier for codebases of any size.
- Intuita's extension is [open source](https://github.com/intuita-inc/intuita-vscode-extension) & supports the best codemod engines out there, such as Facebook's
JSCodeShift, Uber's Piranha, & soon ML-powered engines. If your
favorite codemod engine is not supported yet, please [create an issue](https://github.com/intuita-inc/intuita-vscode-extension/issues/new) for us to prioritize.
- The codemods for upgrading the following frameworks/libraries have
already been added to the extension. If you want to upgrade a dependency in the near future & it's not listed here, please [create an issue](https://github.com/intuita-inc/intuita-vscode-extension/issues/new) for us to prioritize.
    - **Nextjs vx → v13**
    - **Material UI v4 → v5**
    - **React Router vx → v4 & v4 → v6**
    - **ImmutableJS x3 → v4**
- If you want to add an existing codemod to the extension, [follow this tutorial →](https://docs.intuita.io/blog/adding-codemods-to-registry)
- You can also create new codemods that directly integrate into the Intuita extension using Intuita’s [Codemod Studio →](https://codemod.studio)


> **Warning**
> This extension is in `Public Beta`! [Get in touch](https://join.slack.com/t/intuita-inc/shared_invite/zt-1bjj5exxi-95yPfWi71HcO2p_sS5L2wA) if you are planning to use this extension for large upgrades & you have some feature requests!
---

## How It Works 🪄

1. Open package.json in your project & applicable upgrade codemods automatically show up for you. 

<img src="https://user-images.githubusercontent.com/78109534/212233940-d12e6908-0d9d-4cee-922e-75e7656df944.png" alt="the snapshot showing the text right next to a dependency in package.json" width="100%"/>

2. Click on "execute codemods" or run the codemods from the VS Code's Command menu & let Intuita transform your code automatically.

<img src="https://user-images.githubusercontent.com/78109534/212234081-5e142375-d54f-4b2c-9ca8-6becfde6116d.png" alt="the snapshot showing the available Intuita commands in VS Code" width="100%"/>

3. Quickly review, tweak, & apply the proposed changes one-by-one or in batches.

<img src="https://user-images.githubusercontent.com/78109534/212234330-624fd115-87d5-41ba-9fdb-5c99e0a0d592.png" alt="the snapshot showing proposed changes to code which are automatically created after intuita codemods are executed" width="100%"/>


If you like videos better, here is a quick YouTube [tutorial](https://www.youtube.com/watch?v=pEGdu-cpu5k).



---

## Why Intuita?

### Codemod Consumers 🧑🏾‍💻👩🏻‍💻
- ❌ **Without Intuita** ❌ if you want to upgrade a dependency with some API & breaking changes, you need to:
  - Search online for upgrade guides & if you are lucky, find some codemods (likely not following any quality guidelines or without proper tests).
  - Run those codemods in CLI one by one ([~60 codemods](https://github.com/mui/material-ui/tree/master/packages/mui-codemod/src/v5.0.0) for Material UI v5 upgrade) without knowing which one is actually applicable to your codebase.
  - End up with large PRs & many reviewers because you couldn't easily distribute the changes into meaningful commits.
  - And finally, if many teams are impacted, you need to create tasks, manually find the best reviewer & follow up on those tasks until you get the change reviewed & merged.

- ✅ **With Intuita** ✅ a set of quality-checked community-led codemods will be pushed to you right in the package.json (for JS/TS) so you don't need to search for them. 
  - You run all the codemods with one click.
  - At an intermediary step before making the code change, you can tweak them if needed, batch them as you wish & push your changes for review.
  - [Enterprise feature] for large teams, we will be building integrations with Jira/Slack/Github to automatically assign tasks & send reminders to teams, leadership dashboard for tracking & coordinating the campaign.

### Codemod Builders 🥷🏼
- ❌ **Without Intuita** ❌ you go the codemod journey alone! You ask yourself:
  - What are the best codemod engines out there for the type of transformation i want to build?
  - What's the easiest way to build codemods? Any tool out there? How about creating test cases?
  - Has anyone out there built the exact codemod I want to build?
  - How can my codemod be discovered & used by thousands of other developers out there who could benefit from it sooner or later?
 
 - ✅ **With Intuita** ✅ you are surrounded by a community of codemod experts
   - We build tools, processes & guidelines on how to write high-quality codemods & associated tests & pick the right engine (imperative, declarative, ML based, or pattern based) for each use case. 
   - We will be the distribution channel for your codemods. You write a useful codemod & along with other codemods created by the community, we will ship it to tens of thousands of developers out there within a few mins of integrating them into Intuita. 
   - If you, just like us, are also a codemod nerd, [let's get in touch!](https://join.slack.com/t/intuita-inc/shared_invite/zt-1bjj5exxi-95yPfWi71HcO2p_sS5L2wA) we are growing our team with awesome engineers who are passionate about automating boring tasks for fellow developers.


### Engineering Leads 👩🏾‍💼👨🏻‍💼
- ❌ **Without Intuita** ❌ leaders do not have visibility into the status of large migration/upgrade campaigns. You ask yourself:
  - How long would this upgrade take? How many developers are impacted? Are we on track to hit our business deadlines?

- ✅ **With Intuita** ✅ [enterprise features] you can easily track progress & coordinate migration campaigns across many teams.
  - **Team leads, please contact us to learn more about enterprise features such as Jira/Github/Slack integrations, automated task & notification delivery.**


---
## Telemetry 🔭
- The extension collects telemetry data to help us improve the product for you.
- **We never send PII, OS information, file or folder names.**
- Telemetry can be disabled in the settings.
- See more details in our [telemetry compliance considerations](https://docs.intuita.io/docs/about-intuita/legal/telemetry-compliance) doc.

---
## Share Feedback 🎁

- Please share your ideas, questions, feature requests <kbd>[**here**](https://feedback.intuita.io/feature-requests)</kbd>, or chat with us in <kbd>[**Slack**](https://join.slack.com/t/intuita-inc/shared_invite/zt-1bjj5exxi-95yPfWi71HcO2p_sS5L2wA)</kbd>

---
## Join Us 🙌🏼 
- We are an early-stage startup backed by amazing angels in silicon valley! If you are a codemod nerd or passionate about building delightful devtools, [let's chat](https://www.linkedin.com/company/intuita-inc)!

<br>  
</br>
