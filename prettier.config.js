// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

module.exports = {
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: "es5",
    arrowParens: "always",
    overrides: [
      {
        files: ["**/*.yml", "**/*.yaml"],
        options: {
          tabWidth: 2,
        },
      },
    ],
  };
  