'use strict';

var fs = require('fs/promises');
var tempfile = require('tempfile');
var uuid = require('uuid');
var paths = require('env-paths');
var makeDir = require('make-dir');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var tempfile__default = /*#__PURE__*/_interopDefaultLegacy(tempfile);
var paths__default = /*#__PURE__*/_interopDefaultLegacy(paths);
var makeDir__default = /*#__PURE__*/_interopDefaultLegacy(makeDir);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

// Signature is a random signature that is stored and used





// File identifier for global signature file
const PRISMA_SIGNATURE = 'signature';

// IMPORTANT: this is part of the public API
async function getSignature(signatureFile) {
  const dirs = paths__default["default"]('checkpoint');
  signatureFile = signatureFile || path__default["default"].join(dirs.cache, PRISMA_SIGNATURE); // new file for signature

  // The signatureFile replaces cacheFile as the source of turth and therefore takes precedence
  const signature = await readSignature(signatureFile);
  if (signature) {
    return signature
  }

  return await createSignatureFile(signatureFile)
}

function isSignatureValid(signature) {
  return typeof signature === 'string' && signature.length === 36
}

/**
 * Parse a file containing json and return the `signature` key from it
 * @returns string empty if invalid or not found
 */
async function readSignature(file) {
  try {
    const data = await fs__default["default"].readFile(file, 'utf8');
    const { signature } = JSON.parse(data);
    if (isSignatureValid(signature)) {
      return signature
    }
    return ''
  } catch (err) {
    return ''
  }
}

async function createSignatureFile(signatureFile, signature) {
  // Use passed signature or generate new
  const signatureState = {
    signature: signature || uuid.v4(),
  };
  await makeDir__default["default"](path__default["default"].dirname(signatureFile));
  await fs__default["default"].writeFile(signatureFile, JSON.stringify(signatureState, null, '  '));
  return signatureState.signature
}

const writeFile = fs__default["default"].writeFile;

// Check tests
describe('signature', () => {
  const testSignatureFile = tempfile__default["default"]();
  const testCacheFile = tempfile__default["default"]();
  const testCacheSignature = 'd4fa2acd-34ec-43eb-bb67-30e572e29932';
  // testOldCacheFile is the previous schema for check cache which had the signature before it was global
  const testOldCacheFile = `{
    "last_reminder": 0,
    "cached_at": 1588175266588,
    "signature": "${testCacheSignature}",
    "version": "2.0.0-beta.1",
    "output": {
      "product": "prisma",
      "current_version": "2.0.0-beta.3",
      "current_release_date": 1587479807,
      "current_download_url": "https://github.com/prisma/@prisma/cli",
      "install_command": "npm install -g @prisma/cli",
      "current_changelog_url": "https://github.com/prisma/@prisma/cli",
      "outdated": true,
      "project_website": "https://prisma.io",
      "alerts": []
    }
  }`;

  it('should return a consistent signature', async () => {
    const signature = await getSignature(testSignatureFile);
    expect(typeof signature).toEqual('string');
    expect(signature.length).toEqual(36);
  });

  it('should get the signature from signature file', async () => {
    const expectedSignature = await createSignatureFile(testSignatureFile);
    const actualSignature = await getSignature(testSignatureFile);
    expect(typeof actualSignature).toEqual('string');
    expect(actualSignature.length).toEqual(36);
    expect(expectedSignature).toEqual(actualSignature);
  });

  it('should get the signature from signature file even if cache has signature', async () => {
    await writeFile(testCacheFile, testOldCacheFile);
    const expectedSignature = await createSignatureFile(testSignatureFile);
    const actualSignature = await getSignature(testSignatureFile);
    expect(typeof actualSignature).toEqual('string');
    expect(actualSignature.length).toEqual(36);
    expect(expectedSignature).toEqual(actualSignature);
  });

  it('should generate a new signature if the signature file has an invalid signature', async () => {
    const testInvalidSignature = 'asfsaf';
    await writeFile(testCacheFile, testInvalidSignature);
    await writeFile(testSignatureFile, testInvalidSignature);
    let actualSignature = await getSignature(testSignatureFile);
    expect(typeof actualSignature).toEqual('string');
    expect(actualSignature.length).toEqual(36);
  });
});
