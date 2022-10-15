# webblog-cwebba-03

This is a revised build for Gulp in 2022 for use building front-end websites and applications.

Task Features:

browserSync
copyHTML
imgTask
jsTask
cssTask
watchTask

101522 Notes:

Imagemin is version 
"gulp-imagemin": "7.1.0"

– Imagemin 8 breaks Gulp 4 without writing in ESM standard.
See: 
https://querkmachine.github.io/FSFrontEndDocs/troubleshooting/outdated-imagemin-troubleshooting.html
for explanation.

Some NPM modules have warnings. NPM suggests regressing to Gulp 3.9.1.

6 high severity vulnerabilities
Severity: high
fix available via `npm audit fix --force`
Will install gulp@3.9.1, which is a breaking change


These vulnerable NPM modules are not replaced in this build.
Use this Gulp build with caution.


