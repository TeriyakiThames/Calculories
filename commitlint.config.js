module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", ["root", "web", "ui", "db", "config"]],
  },
};
