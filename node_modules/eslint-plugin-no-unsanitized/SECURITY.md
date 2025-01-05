# Security Policy

## Supported Versions

Only the latest version is supported.
[Firefox might use a slightly older version](https://hg.mozilla.org/mozilla-central/file/tip/package.json), which is supported-ish.

## Our Threat Model
### What is considered a vulnerability?
We assume that a project which makes use of this plugin to apply
a reasonable amount of scrutiny to all patches that are accepted.
We understand that this is a fuzzy line and the level of expected
judgement and sensitivity to security issues will vary between
projects and reviewers. 

JavaScript static analysis is always very limited. On top we are
limiting ourselves to the APIs that are provided by eslint.
Most notable, there's no constant folding, so we can't allow variables
that have been defined statically in different code paths or different
files.

Here's a a couple of examples which we do **not** consider a bug in the linter:
```js
foo['inner'+'HTML'] = evil; // no way to resolve concatenation
eval(atob(...)) // use eslint no-eval rules please.

function(d) { return document }
d.write(evil); // no way to resolve "d" statically
```


## Reporting a Vulnerability
### Bug Bounty / Vulnerability Rewards

Momentarily, we do not offer a bug bounty for security issues with this linter rule.
Note that projects who depend on this linter _might_.

### Consumers of this linter plugin

If what you found is leading to a vulnerability in any of the project that
make use of this library, please follow the rules for that respective project.
I.e., for Firefox please follow the [Mozilla Client Bug Bounty FAQ and use the
linked bugzilla submission form](https://www.mozilla.org/en-US/security/client-bug-bounty/#claiming-a-bounty)
(requires you to create an account).

### Sneaking your *obfuscated* code past this linter
Hey, did you read "What is considered a vulnerability", above?

### Sneaking your innocent looking code past the linter
If what you found constitues in a code pattern that eslint should complain about, but doesn't,
[please file a private bug Bugzilla using this form][bugzilla-enter-private-issue] (requires creating an account).


[bugzilla-enter-private-issue]: https://bugzilla.mozilla.org/enter_bug.cgi?assigned_to=nobody%40mozilla.org&bug_ignored=0&bug_severity=--&bug_status=UNCONFIRMED&bug_type=defect&cf_fission_milestone=---&cf_fx_iteration=---&cf_fx_points=---&cf_root_cause=---&cf_status_firefox77=---&cf_status_firefox78=---&cf_status_firefox79=---&cf_status_firefox_esr68=---&cf_status_firefox_esr78=---&cf_status_thunderbird_esr60=---&cf_status_thunderbird_esr68=---&cf_tracking_firefox77=---&cf_tracking_firefox78=---&cf_tracking_firefox79=---&cf_tracking_firefox_esr68=---&cf_tracking_firefox_esr78=---&cf_tracking_firefox_relnote=---&cf_tracking_thunderbird_esr60=---&cf_tracking_thunderbird_esr68=---&component=Lint%20and%20Formatting&contenttypemethod=list&contenttypeselection=text%2Fplain&defined_groups=1&filed_via=standard_form&flag_type-203=X&flag_type-37=X&flag_type-4=X&flag_type-41=X&flag_type-607=X&flag_type-721=X&flag_type-737=X&flag_type-787=X&flag_type-799=X&flag_type-800=X&flag_type-803=X&flag_type-846=X&flag_type-855=X&flag_type-864=X&flag_type-913=X&flag_type-930=X&flag_type-936=X&flag_type-941=X&flag_type-945=X&form_name=enter_bug&groups=firefox-core-security&maketemplate=Remember%20values%20as%20bookmarkable%20template&op_sys=Unspecified&priority=--&product=Firefox%20Build%20System&rep_platform=Unspecified&status_whiteboard=%5Beslint-plugin-no-unsanitized%5D&target_milestone=---&version=unspecified
