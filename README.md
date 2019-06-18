# jetifier

The jetifier-standalone command-line utility from Android Studio, in npm package format

## Usage for jar/zip/aar files

1. `npm install jetifier` (or maybe `npm install -g jetifier` to make it globally available)
1. `npx jetifier-standalone <your arguments here>` (use `npx jetifier-standalone -h` for help)

I have not altered the jetifier-standalone distribution in any way.

Other than the npm-specific instructions, consult [the official jetifier documentation](https://developer.android.com/studio/command-line/jetifier)

## Usage for source files

### To jetify / convert node_modules dependencies to AndroidX

Imagine you are a react-native project and one of your library dependencies converts to AndroidX.
Now you need to convert your app, but react-native links source code directly and jetifier doesn't handle that.

If there was a way to take your react-native dependencies and convert them, then you could convert your app and use AndroidX dependencies.

1. Make sure your app is AndroidX (this is documented elsewhere but is just a refactor in Android Studio)
1. `npm install jetifier` (or use yarn, or install it globally - just install the package)
1. `npx jetify`
1. Get a cup of coffee, it takes a while. Performance improvements can come later.
1. `npx react-native run-android` (this should compile and work)

Please note that any time you install a new dependency, or reinstall node modules, you will need to run `npx jetify` again.

*Inspiration:* this jetify command was based on [an idea](https://gist.github.com/janicduplessis/df9b5e3c2b2e23bbae713255bdb99f3c) from @janicduplessis - thank you Janic!

## Contributing

Please feel free to pull requests or log issues, especially to update versions if I somehow fail to notice an update. Thanks!
