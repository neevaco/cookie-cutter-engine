<!--
 Copyright 2022 Neeva Inc. All rights reserved.
 Use of this source code is governed by a BSD-style license that can be
 found in the LICENSE file.
-->

## Contributor guidelines

We'd love for you to contribute to this repository. Before you start, we'd like you to take a look and follow these guidelines:

-   [Submitting an Issue](#submitting-an-issue)
-   [Creating a pull request](#creating-a-pull-request)
-   [Coding Rules](#coding-rules)
    -   [Swift style](#swift-style)
    -   [Whitespace](#whitespace)
-   [Commits](#commits)

### Submitting an Issue

If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to our repository. Before you submit your issue, search open and closed issues, maybe your question was already answered.

### Creating a pull request

-   All pull requests must be associated with a specific Issue. If an issue doesn't exist, please first create it.
-   Before you submit your pull request, search the repository for an open or closed Pull Request that relates to your submission. You don't want to duplicate effort.
-   For commiting in your Pull Request, you can checkout [Commits](#commits) for more.

### Coding Rules

#### Typescript style

-   This repository makes extensive use of ESLint and Prettier rules.
-   When working in VS Code, the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions will automatically format code and highlight issues.
-   Otherwise, run `yarn lint` to check for issues and `yarn format` to format code.

### Commits

-   Each commit should have a single clear purpose. If a commit contains multiple unrelated changes, those changes should be split into separate commits.
-   If a commit requires another commit to build properly, those commits should be squashed.
-   Follow-up commits for any review comments should be squashed. Do not include "Fixed PR comments", merge commits, or other "temporary" commits in pull requests.

### Tests

#### Adding a new provider

-   Writing automated tests for new cookie notice providers can be quite challenging. Instead, submit a list of a few sites that make use of the provider with your PR so it can be tested manually.

#### General engine changes

-   TODO
