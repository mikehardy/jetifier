# jetifier

The jetifier AdnroidX transition tool in npm format, with a react-native compatible style

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

**There is a way**.

1. Make sure your app is AndroidX (this is documented elsewhere but is just a refactor in Android Studio)
1. `npm install --save-dev jetifier` (or use yarn, but install it locally in your project, not globally)
1. `npx jetify`
1. Get a cup of coffee, it takes a while. Performance improvements can come later.
1. `npx react-native run-android` (this should compile and work)

Please note that any time you install a new dependency, or reinstall node modules, you will need to run `npx jetify` again.

I demonstrate exactly this with a huge pile of native modules here: <https://github.com/mikehardy/rn-androidx-demo>. You can clone that repo, run the script, and see it works. Please feel to make PRs to that repo, especially in App.js or in the dependencies included, if you would like to demonstrate success or failure for a specific module.

*Inspiration:* this jetify command was based on [an idea](https://gist.github.com/janicduplessis/df9b5e3c2b2e23bbae713255bdb99f3c) from @janicduplessis - thank you Janic!

## Troubleshooting

Unfortunately jetifier can't solve all your problems. Here are some reasons it could fail:

1. You have a dependency that packages things in violation of Android packaging rules, like including an extra AndroidManifest.xml or similar: <https://github.com/acaziasoftcom/react-native-bottomsheet/pull/23> - this will lead to dex merger issues about duplicate entries. Open pull requests with the libraries that do this.
1. You have a dependency that does not allow overrides of compileSdk, so you can't set the compileSdk to 28 as AndroidX requires: <https://github.com/razorpay/react-native-razorpay/pull/201>. This can lead to errors in resource merger where styles reference unknown attributes. Open pull requests with the libraries that do this
1. For windows you must use WSL - we have reports it works, but also reports you may need to update WSL and install jetifier locally vs globally. It should work for you, but if you have updates to exactly how to make it work please propose a PR to this readme :hearts:
   - from one of the success reports "installed jetifier from the Windows console, then I ran the the jetify command from WSL"

So far there has not been a case of `npx jetify` failing that wasn't based in an error in a library, so if you have a problem please examine the error and the dependency very closely and help the libraries with fixes.

## Contributing

Please feel free to pull requests or log issues, especially to update versions if I somehow fail to notice an update. Thanks!
