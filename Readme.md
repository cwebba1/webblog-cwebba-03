# webblog-cwebba-03

This is a revised build for Gulp in 2022 for use building front-end websites and applications.

Task Features:

BrowserSync
BrowserList
copyHTML			app/HTML to dist
scssTask			gulp-sass: "^5.1.0"
copySCSS			Copy css, Move file
cssTask			gulp-postcss: "^9.0.1"
copyCSS			Concatenate and copy to to WordPress
imgTask			Imagemin: "7.1.0"
jsTask				gulp-terser": "^2.1.0
hbs					Handlebars to app/HTML
watchTask

102822 Notes:
This Gulp file is designed for dual use. The SASS installed will edit CSS for Webblog WordPress. The Handlebars will be used for website development. PostCSS Tasks will be exported to a stand-alone PostCSS build.

Additions: Handlebars is added. Watch task is resolved.

Current NPM warnings for Node Modules in this build are:
35 vulnerabilities (9 moderate, 23 high, 3 critical)

Research during production shows that some NPM vulnerabilities are expected and embraced by Gulp and Chokidar authors:

https://github.com/paulmillr/chokidar/issues/1139
https://overreacted.io/npm-audit-broken-by-design/

Therefore it is difficult to know what resolution of potential vulnerabilities are possible. Feel free to contact me to offer useful information. Use this Gulp build with caution.

 - – - – - – - – - – - – - – - – - – - – - – - – - – - – - – - –
101722 Notes:
Certain PostCSS plugins are added to cssTask.
copySCSS transfers SASS results from APP/SCSS/CSS to APP?CSS
copyCSS transfers the result of cssTask out of the Gulpfile.js root folder into the cwebba WordPress Theme

Current NPM warnings for Node Modules in this build are:
"29 vulnerabilities (9 moderate, 20 high)"

Use this Gulp build with caution.

 - – - – - – - – - – - – - – - – - – - – - – - – - – - – - – - –
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


