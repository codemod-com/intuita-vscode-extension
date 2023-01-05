# Automated Code Modernization For Any Scale

- ⚠️ This extension is in <kbd> Closed Beta</kbd>!  Get in touch with us if you want to be an early adopter! ⚠️
- Intuita is a developer assistant 🤖 that makes **migrations, dependency upgrades & large refactorings** easy for small (free version) & very large teams (paid version).
- Spend less time on tedious code maintenance & coordination tasks & more on building new, performant & secure features 🚀 for your end users.
- Intuita's extension is **open source & its pluggable architecture** is designed to work with the best codemod engines out there (such as **Facebook's JSCodeShift or Uber's Piranha, & soon ML-powered engines**).
- Codemods for upgrading **Nextjs vX → v13** & **Material UI v4 → v5** is supported already. Many other frameworks can be easily added based on [**community requests**](https://join.slack.com/t/intuita-inc/shared_invite/zt-1bjj5exxi-95yPfWi71HcO2p_sS5L2wA).

---

## Who Is It For 

### Codemod Consumers 🧑🏾‍💻👩🏻‍💻
- Product developers who rely on some infra/framework.
- Infra engineers who want to ship their new features to all of their consumers
- These developers trigger codemods (already created & integrated in Intuita by codemod builders) right from the IDE 
- **This extension, at current stage, is mainly for codemod consumers.**

### Codemod Builders 🥷🏼
- Rare Engineers in Infra Teams/Open Source Framework Maintainers
  - Writing reliable codemods are not easy & fun for most of developers. That is why at Intuita we build features specifically built for codemod builders to make this step as easy as possible. At current
- At Intuita, we teamed up with rare engineers who are experts at & passionate about writing codemods! We know best practices & we build tools to make codemod creation as easy as possible. 
  - **The tools we use to create codemods are not integrated into this extension yet**. 
  - **Partner up with us if you maintain a popular framework** to build & integrate your codemods into this extension & enable your consumers adopt your latest features quickly & easily.

### Engineering Leads 👩🏾‍💼👨🏻‍💼
- Leaders want to track progress & coordinate migration campaigns across many teams.
  - **Team leads, please contact us to learn more about enterprise features.**

---
## How It Works 🪄

1. As a codemod consumer, open a project that uses Nextjs v12 or older, or Material UI v4.
2. Run Intuita's Command in VS Code related to that framework.
3. Intuita automatically runs all the relevant codemods, categorizes the changes, & lets you quickly review, tweak, & apply them in batches.

![Screenshot 2022-12-07 at 1 01 20 PM](https://user-images.githubusercontent.com/78109534/206294943-1dc51334-15d5-4a5f-8b9c-a701cab0ccca.png)


---
## Why Do I Need It 🤔

- Save the time you spend sifting through online documentations & upgrade guides.
- Have a better dev experience compared to running random codemods one by one.
- Divide & Conquer! In large codebases, running a codemod in CLI just does not cut it! (enterprise feature, contact us)
- Our experience & research says **more than 40% of developers' time is wasted on code maintenance**. We are here to help you with those tedious undifferentiated tasks.

---
## Telemetry
The extension collects telemetry data since v0.7.0. We use them to improve performance of the extension and to plan new features. We never send PII, OS information, file or folder names.

You can see the schema of the outgoing telemetry messages [here](https://github.com/intuita-inc/intuita-vscode-extension/blob/main/src/telemetry/types.ts).

You can disable telemetry by going into Settings and searching the for `telemetryEnabled` setting under Intuita VSCode Extensions's Settings. We also respect if the `telemetry.telemetryLevel` setting is set to `off`.

---
## How Can I Share Feedback? 🎁

- Please share your ideas, questions, feature requests <kbd>[**here**](https://feedback.intuita.io/feature-requests)</kbd>, or chat with us in <kbd>[**Slack**](https://join.slack.com/t/intuita-inc/shared_invite/zt-1bjj5exxi-95yPfWi71HcO2p_sS5L2wA)</kbd>

<br>  

</br>
