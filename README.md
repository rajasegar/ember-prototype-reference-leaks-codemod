# ember-prototype-reference-leaks-codemod
Codemod for fixing Prototype Reference memory leaks in Ember

## Install

Get jscodeshift from [npm][]:

```
$ npm install -g jscodeshift
```

This will install the runner as `jscodeshift`.


## Usage (CLI)

```
$ jscodeshift -t https://github.com/rajasegar/ember-prototype-reference-leaks-codemod/blob/master/transform.js  <directory-path>
```
