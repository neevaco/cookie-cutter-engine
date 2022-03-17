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
  