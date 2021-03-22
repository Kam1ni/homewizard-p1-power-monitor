module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
	],
	rules: {
		indent: ["error", "tab"],
		semi: ["error", "always"],
		quotes: ["error", "double", {avoidEscape: true, allowTemplateLiterals: true}],
		"no-irregular-whitespace": ["error", {skipStrings: true}],
		"max-len": ["warn", 180, {
			ignorePattern: "^import |^export"
		}],
		"max-lines": ["warn", 500],
		"max-lines-per-function": ["warn", 50],
		"no-return-await": ["warn"],
		"no-lonely-if": ["warn"],
		"no-dupe-else-if": ["warn"],
		"no-else-return": ["warn"],
		"brace-style": ["error", "1tbs"],
		"object-shorthand": ["error"],
		"no-trailing-spaces": ["error"],
		"max-classes-per-file": ["error", 2],
		"no-cond-assign": ["error"],
		"prefer-spread": ["warn"],
		"key-spacing": ["warn", {
			beforeColon: false,
			afterColon: true,
			mode: "strict"
		}],
		"html-indent":["error", "tab"],
		"script-indent":["error", "tab"],
		"style-indent":["error", "tab"]
	},
	overrides:[
		{
			files:["*.vue"],
			rules:{
				"indent":"off"
			}
		}
	],
	parserOptions: {
		parser: "@typescript-eslint/parser",
		ecmaVersion: 2020
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
	},
	plugins: [
		"@typescript-eslint"
	]
}
