# Intuita - A Better Way To Upgrade Open-Source Dependencies.

With Intuita, you can start adopting the latest framework versions faster and easier than ever - one framework at a time, starting with Next.js v13.

> :warning: What frameworks should we support next? [Let us know →](https://feedback.intuita.io/codemod-requests)


## Why?

- **Automates Away the Bulk of the Upgrades:** Let dozens of bots, built on Meta’s code transformation engine, automate the tedious code changes and you focus on what’s fun.
- **A Better DevX For Dependency Upgrades:** No more confusing upgrade guides and keeping track of hundreds of proprietary CLI commands. Intuita provides an easy-to-use experience for running automated dependency upgrades. One simple interface to run it all.
- **Backed by A Community of Experts:** Upgrading dependencies can be tricky. Get help from the community of experts to navigate the uncharted territories.

## Quick Start

Get started with automating dependency upgrades using Intuita in three steps:

1. Install Intuita VS Code Extension.
2. Open the Intuita sidebar menu → View the upgrade codemod you’d like to run → Click `Dry Run` 

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2f9805e9-1b00-423a-a68c-d7909d830194/Untitled.gif)

<aside>
💡 In this example, we’re using the [`netlify/next-runtime`](https://github.com/netlify/next-runtime/) repository and `replace-next-router` upgrade codemod.

Intuita is in Public Beta and we’re continuously working on improving codemods and solving any compatibility issues.
If you run into an issue while running a codemod, please [let us know →](https://feedback.intuita.io/feature-requests-and-bugs)

</aside>

1. View the changes made by Intuita → then apply the approved changes to your project files.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a948d67c-fd04-465c-a7bd-c32dbaf21e87/Untitled.gif)
    

## How Does It Work?

- **Codemod Registry -** A public database of code transformation bots, aka codemods, with 9 Intuita-backed high-quality ones built in partnership with Vercel specifically for Next.js upgrade.
- **Dry Run →  Review → Commit -** Intuita’s bots are double-reviewed for quality. Yet, we developed the “Dry-Run” mode to give you full control before applying changes to your code. If needed, dismiss faulty changes, commit the rest with one click, and handle exceptions later.
- **Continuous Improvement -** Bots & AI make mistakes. Our one-click issue report, with some context included, makes reporting & improving mistakes in our bots & AI a breeze.

## Features

- **Out-of-the-box Prettier Integration -** Your favorite code transformation engines such as Meta’s JSCodeshift or TS-morph will mess up the formatting. Intuita will automatically prettify the changes according to your settings, saving you much time and energy for more exciting features.
- **Multiple Transformation Engines -** Intuita supports different transformation engines under the hood, including Meta’s, Uber’s, Semgrep’s, and LLM engines - and more to come.
- **~~Parallelized Code Transformation Engine:** Intuita’s JSCodeshift is parallelized into configurable number of threads and it can be as fast as your machine, by default it used 6 threads, meaning its is 6x faster than the standard JSCodeshift.~~

---

## Telemetry 🔭

- The extension collects telemetry data to help us improve the product for you.
- **We never send PII, OS information, file or folder names.**
- Telemetry can be disabled in the settings.
- See more details in our [telemetry compliance considerations](https://docs.intuita.io/docs/about-intuita/legal/telemetry-compliance) doc.

## Share Feedback 🎁

- Please share your ideas, questions, feature requests **[here](https://feedback.intuita.io/)**, or chat with us in [Slack](https://join.slack.com/t/intuita-inc/shared_invite/zt-1tvxm6ct0-mLZld_78yguDYOSM7DM7Cw).