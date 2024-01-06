const HEAVY_RULES = process.env.ESLINT_HEAVY_RULES ?? "off"; // "off" or "error"
console.info(`ESLINT_HEAVY_RULES=${HEAVY_RULES}`);

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:unicorn/recommended",
    "plugin:you-dont-need-lodash-underscore/compatible",
    "plugin:eslint-comments/recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // Empty `./tsconfig.json` just to enable typescript eslint rules here.
    project: "./tsconfig.json",
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "html",
    "react-hooks",
    "unicorn",
    "react-hooks-addons",
  ],
  rules: {
    "object-shorthand": "error",
    "no-console": "error",
    "no-fallthrough": "error",
    "jsx-uses-react": 0,
    "no-process-env": "error",
    "react/react-in-jsx-scope": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "react/self-closing-comp": [
      "error",
      {
        component: true,
        html: true,
      },
    ],
    // TODO: Review and adopt more import rules https://github.com/import-js/eslint-plugin-import
    "import/no-default-export": "error",
    "import/no-absolute-path": "error",
    "import/extensions": "off", // TODO: This rule complains `.js` imports under `./server`.  Temporarily disabled.
    "react-hooks-addons/no-unused-deps": "error", // TODO: Migrate to the official rule when it's available https://github.com/facebook/react/issues/26981

    "import/no-named-as-default-member": "off", // TODO: Investigate current errors and enable.
    eqeqeq: "error",
    "you-dont-need-lodash-underscore/is-nil": "off", // While not necessary, `_.isNil(...)` is more concise.
    "unicorn/no-useless-undefined": "off", // Explicit `undefined` is often more intuitive.
    "unicorn/prefer-at": "off", // TODO: `.at(...)` return type can be `undefined` in today's TypeScript's type check.  Though very often it fails to deduce that `undefined` never happens in certain contexts.  Enable when TypeScript gets smarter.
    "unicorn/switch-case-braces": ["error", "avoid"],

    "no-restricted-imports": [
      "error",
],

    // TODO: Review and enable individual Unicorn eslint rules.
    //       We disabled just because there were too many errors.
    "unicorn/prefer-module": "off",
    "unicorn/filename-case": "off",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/consistent-function-scoping": "off",
    "unicorn/no-null": "off",
    "unicorn/no-await-expression-member": "off",
    "unicorn/prefer-ternary": "off",
    "unicorn/prefer-query-selector": "off",
    "unicorn/prefer-spread": "off",
    "unicorn/prefer-export-from": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/prefer-set-has": "off",
    "unicorn/prefer-array-some": "off",
    "unicorn/explicit-length-check": "off",
    "unicorn/consistent-destructuring": "off",
    "unicorn/no-array-push-push": "off",
    "unicorn/prefer-array-flat": "off",
    "unicorn/prefer-add-event-listener": "off",
    "unicorn/no-new-array": "off",
    "unicorn/no-useless-spread": "off",
    "unicorn/no-array-callback-reference": "off",
    "unicorn/no-useless-switch-case": "off",
    "unicorn/prefer-logical-operator-over-ternary": "off",
    "unicorn/prefer-blob-reading-methods": "off",
    "unicorn/prefer-array-find": "off",
    "unicorn/no-object-as-default-parameter": "off",
    "unicorn/text-encoding-identifier-case": "off",
    "unicorn/prefer-top-level-await": "off",
    "unicorn/error-message": "off",

    // Typescript related
    "no-unused-vars": "off",
    "@typescript-eslint/no-confusing-void-expression": [
      "error",
      { ignoreArrowShorthand: true },
    ],
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        destructuredArrayIgnorePattern: "^_", // https://eslint.org/docs/latest/rules/no-unused-vars#destructuredarrayignorepattern
        ignoreRestSiblings: true, // https://eslint.org/docs/latest/rules/no-unused-vars#ignorerestsiblings
      },
    ],
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          Symbol: false, // TODO: eslint is confused about built-in `Symbol` and our custom type `Symbol`.  Ideally eslint should be smart to distinguish them.
        },
        extendDefaults: true,
      },
    ],

    "import/no-unresolved": "off", // TODO: It causes a lot of false positives for some reason.  Enable.
    "import/named": "off", // TODO:  It causes a lot of false positives for some reason.  Enable.

    // Heavy, time consuming checks below.

    "eslint-comments/no-unused-disable": HEAVY_RULES, // Not expensive, but needs to be disabled if not all rules are enabled.
    "import/namespace": HEAVY_RULES,
    "import/no-cycle": [HEAVY_RULES, { ignoreExternal: true }],
    "@typescript-eslint/no-misused-promises": HEAVY_RULES,
    "prettier/prettier": HEAVY_RULES,
    "@typescript-eslint/no-unsafe-assignment": HEAVY_RULES,
    "@typescript-eslint/no-unsafe-argument": HEAVY_RULES,
    "import/default": HEAVY_RULES,

    // These are not heavy rules, but there is a `typescript-eslint` bug that
    // dependency update is not reflected on code editors.  So temporarily disabled
    // until the issue gets fixed.
    // - https://github.com/microsoft/vscode-eslint/issues/1654
    // - https://github.com/typescript-eslint/typescript-eslint/issues/2094
    // TODO: Enable the followings by default.
    "@typescript-eslint/no-unsafe-return": HEAVY_RULES,
    "@typescript-eslint/no-unsafe-member-access": HEAVY_RULES,
    "@typescript-eslint/no-unsafe-call": HEAVY_RULES,
    "@typescript-eslint/restrict-template-expressions": HEAVY_RULES,
    "@typescript-eslint/no-redundant-type-constituents": HEAVY_RULES,
    "@typescript-eslint/strict-boolean-expressions": [
      HEAVY_RULES,
      { allowNullableBoolean: true, allowNullableObject: true }, // TODO: Ideally good to have? Consider removing this line.
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: true,
    },
  },
  ignorePatterns: [
    "**/third_party/**",
    "**/*_generated/**",
  ],
};
