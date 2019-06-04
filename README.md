# jetifier

The jetifier-standalone command-line utility from Android Studio, in npm package format

## Usage

1. `npm install jetifier` (or maybe `npm install -g jetifier` to make it globally available)
1. `npx jetifier-standalone <your arguments here>` (use `npx jetifier-standalone -h` for help)

I have not altered the jetifier-standalone distribution in any way.

Other than the npm-specific instructions, consult [the official jetifier documentation](https://developer.android.com/studio/command-line/jetifier)

## Versioning (or "why beta?")

The jetifier-standalone utility is from Google, and they currently have it as beta

In this package I preserve their versioning, and just append one more pre-release semantic version
so that I have space to publish new versions of the package even if they never release another one.

In general the entire version prior to the last '.1' (or similar) is the upstream version.

To be precise if the version is `1.0.0-beta04.3`, the upstream version is `1.0.0beta04`, and it is my third re-package of that version.

## Contributing

Please feel free to pull requests or log issues, especially to update versions if I somehow fail to notice an update. Thanks!
