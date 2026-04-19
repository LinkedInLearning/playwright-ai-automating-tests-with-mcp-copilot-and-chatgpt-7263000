# Playwright with AI: Agents, Context, and Test Automation Patterns

This is the repository for the LinkedIn Learning course `Playwright with AI: Agents, Context, and Test Automation Patterns`. The full course is available from [LinkedIn Learning][lil-course-url].

![course-name-alt-text][lil-thumbnail-url]

_See the readme file in the main branch for updated instructions and information._


## Overview

Course lessons will teach how to automate **Playwright tests with AI** that cover behaviors in a web app named **BuggyBoard**. This repository contains the code for the web app as well as the example test code created during the course. You will work within this repository as you progress through the course. You will need a [GitHub account](https://github.com/signup) to run codespaces, and you will need an AI coding agent like [GitHub Copilot](https://github.com/features/copilot).


### BuggyBoard Web App

**BuggyBoard** is a small web app for tracking bug reports. It is:

- full-stack Node.js
- written in TypeScript
- with a React frontend
- and an Express backend
- and a SQLite database


### Example Code Branches

This repository also contains branches with example code for each of the videos in the course:

- The `start` branch holds the initial state of the code when the course starts.
- The `main` branch holds the final state of the code when the course is complete.
- The `CHAPTER#_MOVIE#` branches correspond to the state of the code for the course videos.
  - Example: the branch named `02_03` corresponds to the second chapter and the third video in that chapter.

Some branches will have a beginning and an end state. These are marked with the letters `b` for "beginning" and `e` for "end". The `b` branch contains the code as it is at the beginning of the movie. The `e` branch contains the code as it is at the end of the movie.

You can use the branch pop-up menu in GitHub to switch to a specific branch and take a look at the course at that stage, or you can add `/tree/BRANCH_NAME` to the URL to go to the branch you want to access.


#### Possible Errors

When switching from one exercise files branch to the next after making changes to the files, you may get a message like this:

```
    error: Your local changes to the following files would be overwritten by checkout:        [files]
    Please commit your changes or stash them before you switch branches.
    Aborting
```

To resolve this issue:  
Add changes to git using this command: `git add .`  
Commit changes using this command: `git commit -m "some message"`  


## Usage

There are two ways to use this repository:

1. Using [GitHub Codespaces](https://docs.github.com/en/codespaces/quickstart) (recommended)
2. Forking, cloning, and running the repository locally on your machine (advanced)


### Codespaces

Running the project in a GitHub codespace is the simpler, recommended path. It includes all the prerequisites needed to start the course. The course videos are recorded using a codespace, so it will be easier for you to follow along if you use a codespace as well. The course introduction section includes a video showing how to load the repository in GitHub Codespaces and run it.


### Local Environment

Running the project locally is a more advanced path. Your machine will need a recent version of Node.js. It should also have a good IDE like Visual Studio Code.

To run the project locally:

1. [Fork the repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) to your GitHub account.
2. [Clone the repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) locally from your fork.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to run the web app locally.
5. Load the web app URL in a local browser.

Please read [`SETUP.md`](SETUP.md) for full instructions.


## AI Coding Agents

You will need an AI coding agent for this course for driving Playwright's tools, agents, and skills.

The recommended coding agent is **GitHub Copilot**. It works out of the box with GitHub Codespaces and with local VS Code. The course videos will use Copilot, and the context files are already configured to work with Copilot. Copilot's free tier will likely be sufficient for the needs of this course. If you exhaust your limits, you can either wait for them to refresh, or you can purchase a paid plan for higher limits.

You can use other coding agents like **Claude Code** or **Cursor** if you choose to run the project locally. You will need to set them up on your own. Oftentimes you can use a free tier or a trial period, which should be sufficient for the scope of this course. However, the course videos will teach proper AI setup _only for Copilot_. They do **not** teach the different configurations required for Cursor or Claude.


[0]: # "Replace these placeholder URLs with actual course URLs"
[lil-course-url]: https://www.linkedin.com/learning/
[lil-thumbnail-url]: https://media.licdn.com/dms/image/v2/D4E0DAQG0eDHsyOSqTA/learning-public-crop_675_1200/B4EZVdqqdwHUAY-/0/1741033220778?e=2147483647&v=beta&t=FxUDo6FA8W8CiFROwqfZKL_mzQhYx9loYLfjN-LNjgA
