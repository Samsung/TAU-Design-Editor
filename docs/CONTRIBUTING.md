# How to contribute

1. Read [readme](../README.md) first if you haven't.
2. When creating non-release commit, message is in following format with title having max 60
characters and description max 80 characters.
```
OptionalTag: One line title in imperative

[Issue] https://jira.bug/url
[Problem] Multiline text containing problem description. It should describe how
issue occured, in which situation, how it differed from expected behaviour. Use
past tense regarding what happened before this commit message.
[Solution] Multiline text containing solution description. It should describe
how problem was fixed.
[Remarks] Optional section containing additional comments on change, its
connection to other repositories, announcement of forthcoming changes related
to issue, etc.
[Test] Optional section describing how to test change after applying it. Added
if it deviates from currently documented test methods.

Signed-off-by: info added when `git commit` ran wih `-s` option
```
3. When creating new release commit call `./prepare-release.py`, as it should bump version
in package.json and create commit with this change.
