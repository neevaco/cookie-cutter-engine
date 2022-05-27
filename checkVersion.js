// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Compares the version of the local package.json to the version on npmjs and ensures they are different for publishing

async function checkVersion() {
    const semver = require('semver');
    const package = require('./package.json');
    const { default: fetch } = await import('node-fetch');
    const localVersion = package.version;
    const packageId = package.name;
    const remoteResponse = await fetch(
        `https://registry.npmjs.com/${packageId}`
    );
    const remoteVersion = (await remoteResponse.json())['dist-tags']['latest'];
    const nextRemoteVersion = semver.inc(remoteVersion, 'patch');

    // verify semver validity
    if (!semver.valid(localVersion)) {
        console.error(
            `Local version ${localVersion} is not a valid semantic version. Run \`yarn version --new-version ${nextRemoteVersion}\` in the project root to fix this.`
        );
        process.exit(1);
        return;
    }

    const isLocalNewer = semver.gt(localVersion, remoteVersion);
    if (isLocalNewer) {
        console.log(
            `Local version (${localVersion}) is newer than published (${remoteVersion}). Can publish to NPM!`
        );
    } else {
        console.error(
            `Local version (${localVersion}) is the same as or older than published version (${remoteVersion}).\nRun \`yarn version --new-version ${nextRemoteVersion}\` in the project root to fix this.`
        );
        process.exit(1);
    }
}

checkVersion();
