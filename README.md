# Intuita's Codemod Manager for Visual Studio Code

The Codemod Manager lets you run the most popular codemods over any codebase and manage the changes in your VSCode editor.

## Installation & Usage

Click on the image to view an introductory video on YouTube.
[![How to use codemods with the Intuita VSCode Extension](https://img.youtube.com/vi/pEGdu-cpu5k/0.jpg)](https://www.youtube.com/watch?v=pEGdu-cpu5k "How to use codemods with the Intuita VSCode Extension")

## Why would I need it?

If you want to run any codemod, you need to fetch its script and execute it over CLI. You will likely use version control to pick some of the resulting changes.

Does that sound already _tiresome_ to you?

Imagine now you need to run a dozen codemods to migrate your codebase from one version of some library to the other.

The initial process needs to be now repeated a dozen times...

Our Codemod Manager speeds up this process tremendously, as shown in the table below:

| Problem | Codemod | Codemod Manager |
|:--|:--:|--:|
| Fetching the script(s) | over CLI | already provided |
| Executing the script(s) | over CLI | within VSCode 
| Managing the changes| over VC | using UI

The only thing you need to care about now is picking the changes you want committed.

For that, we organize them into cases. One case corresponds all the changes from one codemod. You can accept or reject the entire case and you can accept or reject change by change.

