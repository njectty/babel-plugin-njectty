const { writeFileSync: writeFile } = require("fs");
const { join, resolve } = require("path");
const { cp, exec, exit, rm, test } = require("shelljs");

if (process.cwd() !== join(__dirname)) exit(1);

if (test("-d", "package")) rm("-rf", "package");

exec("npx babel src --config-file ./src/.babelrc.json --out-dir package");

cp("LICENSE", "README.md", "package");

createPackageJSON: {
    const source = require("./package.json");

    delete source.scripts;
    delete source.devDependencies;

    const file = JSON.stringify(source, null, "  ");

    toPackage("package.json", file);
}

exec("npm run test");

// service

function toPackage(path, file) {
    path = resolve(`package/${path}`);

    writeFile(path, file);
}
