'use strict';

var paths = require('env-paths');
var path = require('path');
var uuid = require('uuid');
var makeDir = require('make-dir');
var fs = require('fs/promises');
var fs$1 = require('fs');
require('child_process');
require('os');
require('ms');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var paths__default = /*#__PURE__*/_interopDefaultLegacy(paths);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var makeDir__default = /*#__PURE__*/_interopDefaultLegacy(makeDir);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

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

// JS-Checkpoint is a API-compatible JS client for a checkpoint server, like https://checkpoint.hashicorp.com/.

// Child path of the binary
// eval("__dirname") to make ncc happy
path__default["default"].join(eval('__dirname'), 'child');

async function getInfo() {
  const cachePath = paths__default["default"]('checkpoint').cache;

  if (!fs$1.existsSync(cachePath)) {
    await fs__default["default"].mkdir(cachePath, { recursive: true });
  }

  const dir = await fs__default["default"].readdir(cachePath);
  const cacheItems = [];

  for (const item of dir) {
    // Ignore signature and files without a -
    if (!item.includes('-')) {
      continue
    }

    try {
      const jsonData = JSON.parse(await fs__default["default"].readFile(path__default["default"].join(cachePath, item), { encoding: 'utf-8' }));
      // add cli_path_hash for items that don't have it yet
      if (jsonData.output && !jsonData.output.cli_path_hash) {
        jsonData.output.cli_path_hash = item.split('-')[1];
      }
      cacheItems.push(jsonData);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    signature: await getSignature(),
    cachePath,
    cacheItems,
  }
}

describe('signature', () => {
  it('should return an object', async () => {
    const info = await getInfo();

    expect(typeof info).toEqual('object');
    expect(Array.isArray(info.cacheItems)).toEqual(true);
    expect(typeof info.signature).toEqual('string');
    expect(typeof info.cachePath).toEqual('string');
  });
});
