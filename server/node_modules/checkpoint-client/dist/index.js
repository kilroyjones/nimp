'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path$2 = require('path');
var os$1 = require('os');
var require$$0 = require('fs');
var require$$2 = require('util');
var fs$1 = require('fs/promises');
var crypto = require('crypto');
var child_process = require('child_process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path$2);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os$1);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs$1);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto__default["default"].randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

var native = {
  randomUUID: crypto__default["default"].randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafeStringify(rnds);
}

var envPaths$1 = {exports: {}};

const path$1 = path__default["default"];
const os = os__default["default"];

const homedir = os.homedir();
const tmpdir = os.tmpdir();
const {env} = process;

const macos = name => {
	const library = path$1.join(homedir, 'Library');

	return {
		data: path$1.join(library, 'Application Support', name),
		config: path$1.join(library, 'Preferences', name),
		cache: path$1.join(library, 'Caches', name),
		log: path$1.join(library, 'Logs', name),
		temp: path$1.join(tmpdir, name)
	};
};

const windows = name => {
	const appData = env.APPDATA || path$1.join(homedir, 'AppData', 'Roaming');
	const localAppData = env.LOCALAPPDATA || path$1.join(homedir, 'AppData', 'Local');

	return {
		// Data/config/cache/log are invented by me as Windows isn't opinionated about this
		data: path$1.join(localAppData, name, 'Data'),
		config: path$1.join(appData, name, 'Config'),
		cache: path$1.join(localAppData, name, 'Cache'),
		log: path$1.join(localAppData, name, 'Log'),
		temp: path$1.join(tmpdir, name)
	};
};

// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
const linux = name => {
	const username = path$1.basename(homedir);

	return {
		data: path$1.join(env.XDG_DATA_HOME || path$1.join(homedir, '.local', 'share'), name),
		config: path$1.join(env.XDG_CONFIG_HOME || path$1.join(homedir, '.config'), name),
		cache: path$1.join(env.XDG_CACHE_HOME || path$1.join(homedir, '.cache'), name),
		// https://wiki.debian.org/XDGBaseDirectorySpecification#state
		log: path$1.join(env.XDG_STATE_HOME || path$1.join(homedir, '.local', 'state'), name),
		temp: path$1.join(tmpdir, username, name)
	};
};

const envPaths = (name, options) => {
	if (typeof name !== 'string') {
		throw new TypeError(`Expected string, got ${typeof name}`);
	}

	options = Object.assign({suffix: 'nodejs'}, options);

	if (options.suffix) {
		// Add suffix to prevent possible conflict with native apps
		name += `-${options.suffix}`;
	}

	if (process.platform === 'darwin') {
		return macos(name);
	}

	if (process.platform === 'win32') {
		return windows(name);
	}

	return linux(name);
};

envPaths$1.exports = envPaths;
// TODO: Remove this for the next major release
envPaths$1.exports.default = envPaths;

var paths = envPaths$1.exports;

var makeDir$2 = {exports: {}};

const debug$1 = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {};

var debug_1 = debug$1;

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0';

const MAX_LENGTH$1 = 256;
const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991;

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;

// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH$1 - 6;

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
];

var constants = {
  MAX_LENGTH: MAX_LENGTH$1,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
};

var re$1 = {exports: {}};

(function (module, exports) {
const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH } = constants;
const debug = debug_1;
exports = module.exports = {};

// The actual regexps go on exports.re
const re = exports.re = [];
const safeRe = exports.safeRe = [];
const src = exports.src = [];
const t = exports.t = {};
let R = 0;

const LETTERDASHNUMBER = '[a-zA-Z0-9-]';

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
  ['\\s', 1],
  ['\\d', MAX_SAFE_COMPONENT_LENGTH],
  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
];

const makeSafeRegex = (value) => {
  for (const [token, max] of safeRegexReplacements) {
    value = value
      .split(`${token}*`).join(`${token}{0,${max}}`)
      .split(`${token}+`).join(`${token}{1,${max}}`);
  }
  return value
};

const createToken = (name, value, isGlobal) => {
  const safe = makeSafeRegex(value);
  const index = R++;
  debug(name, index, value);
  t[name] = index;
  src[index] = value;
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined);
};

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
createToken('NUMERICIDENTIFIERLOOSE', '\\d+');

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`);

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`);

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`);

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`);

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`);

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`);

createToken('FULL', `^${src[t.FULLPLAIN]}$`);

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`);

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);

createToken('GTLT', '((?:<|>)?=?)');

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`);

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`);

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`);
createToken('COERCERTL', src[t.COERCE], true);

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)');

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
exports.tildeTrimReplace = '$1~';

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)');

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
exports.caretTrimReplace = '$1^';

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
exports.comparatorTrimReplace = '$1$2$3';

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`);

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`);

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*');
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$');
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$');
}(re$1, re$1.exports));

// parse out just the options we care about
const looseOption = Object.freeze({ loose: true });
const emptyOpts = Object.freeze({ });
const parseOptions$1 = options => {
  if (!options) {
    return emptyOpts
  }

  if (typeof options !== 'object') {
    return looseOption
  }

  return options
};
var parseOptions_1 = parseOptions$1;

const numeric = /^[0-9]+$/;
const compareIdentifiers$1 = (a, b) => {
  const anum = numeric.test(a);
  const bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
};

const rcompareIdentifiers = (a, b) => compareIdentifiers$1(b, a);

var identifiers = {
  compareIdentifiers: compareIdentifiers$1,
  rcompareIdentifiers,
};

const debug = debug_1;
const { MAX_LENGTH, MAX_SAFE_INTEGER } = constants;
const { safeRe: re, t } = re$1.exports;

const parseOptions = parseOptions_1;
const { compareIdentifiers } = identifiers;
class SemVer$1 {
  constructor (version, options) {
    options = parseOptions(options);

    if (version instanceof SemVer$1) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version;
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options);
    this.options = options;
    this.loose = !!options.loose;
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease;

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version;

    // these are actually numbers
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      });
    }

    this.build = m[5] ? m[5].split('.') : [];
    this.format();
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`;
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`;
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other);
    if (!(other instanceof SemVer$1)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer$1(other, this.options);
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer$1)) {
      other = new SemVer$1(other, this.options);
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer$1)) {
      other = new SemVer$1(other, this.options);
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0;
    do {
      const a = this.prerelease[i];
      const b = other.prerelease[i];
      debug('prerelease compare', i, a, b);
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer$1)) {
      other = new SemVer$1(other, this.options);
    }

    let i = 0;
    do {
      const a = this.build[i];
      const b = other.build[i];
      debug('prerelease compare', i, a, b);
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier, identifierBase) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc('pre', identifier, identifierBase);
        break
      case 'preminor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc('pre', identifier, identifierBase);
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0;
        this.inc('patch', identifier, identifierBase);
        this.inc('pre', identifier, identifierBase);
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier, identifierBase);
        }
        this.inc('pre', identifier, identifierBase);
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++;
        }
        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++;
        }
        this.patch = 0;
        this.prerelease = [];
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++;
        }
        this.prerelease = [];
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre': {
        const base = Number(identifierBase) ? 1 : 0;

        if (!identifier && identifierBase === false) {
          throw new Error('invalid increment argument: identifier is empty')
        }

        if (this.prerelease.length === 0) {
          this.prerelease = [base];
        } else {
          let i = this.prerelease.length;
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++;
              i = -2;
            }
          }
          if (i === -1) {
            // didn't increment anything
            if (identifier === this.prerelease.join('.') && identifierBase === false) {
              throw new Error('invalid increment argument: identifier already exists')
            }
            this.prerelease.push(base);
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          let prerelease = [identifier, base];
          if (identifierBase === false) {
            prerelease = [identifier];
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease;
            }
          } else {
            this.prerelease = prerelease;
          }
        }
        break
      }
      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.raw = this.format();
    if (this.build.length) {
      this.raw += `+${this.build.join('.')}`;
    }
    return this
  }
}

var semver = SemVer$1;

const SemVer = semver;
const compare$1 = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose));

var compare_1 = compare$1;

const compare = compare_1;
const gte = (a, b, loose) => compare(a, b, loose) >= 0;
var gte_1 = gte;

const fs = require$$0__default["default"];
const path = path__default["default"];
const {promisify} = require$$2__default["default"];
const semverGte = gte_1;

const useNativeRecursiveOption = semverGte(process.version, '10.12.0');

// https://github.com/nodejs/node/issues/8987
// https://github.com/libuv/libuv/pull/1088
const checkPath = pth => {
	if (process.platform === 'win32') {
		const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path.parse(pth).root, ''));

		if (pathHasInvalidWinCharacters) {
			const error = new Error(`Path contains invalid characters: ${pth}`);
			error.code = 'EINVAL';
			throw error;
		}
	}
};

const processOptions = options => {
	const defaults = {
		mode: 0o777,
		fs
	};

	return {
		...defaults,
		...options
	};
};

const permissionError = pth => {
	// This replicates the exception of `fs.mkdir` with native the
	// `recusive` option when run on an invalid drive under Windows.
	const error = new Error(`operation not permitted, mkdir '${pth}'`);
	error.code = 'EPERM';
	error.errno = -4048;
	error.path = pth;
	error.syscall = 'mkdir';
	return error;
};

const makeDir = async (input, options) => {
	checkPath(input);
	options = processOptions(options);

	const mkdir = promisify(options.fs.mkdir);
	const stat = promisify(options.fs.stat);

	if (useNativeRecursiveOption && options.fs.mkdir === fs.mkdir) {
		const pth = path.resolve(input);

		await mkdir(pth, {
			mode: options.mode,
			recursive: true
		});

		return pth;
	}

	const make = async pth => {
		try {
			await mkdir(pth, options.mode);

			return pth;
		} catch (error) {
			if (error.code === 'EPERM') {
				throw error;
			}

			if (error.code === 'ENOENT') {
				if (path.dirname(pth) === pth) {
					throw permissionError(pth);
				}

				if (error.message.includes('null bytes')) {
					throw error;
				}

				await make(path.dirname(pth));

				return make(pth);
			}

			try {
				const stats = await stat(pth);
				if (!stats.isDirectory()) {
					throw new Error('The path is not a directory');
				}
			} catch {
				throw error;
			}

			return pth;
		}
	};

	return make(path.resolve(input));
};

makeDir$2.exports = makeDir;

makeDir$2.exports.sync = (input, options) => {
	checkPath(input);
	options = processOptions(options);

	if (useNativeRecursiveOption && options.fs.mkdirSync === fs.mkdirSync) {
		const pth = path.resolve(input);

		fs.mkdirSync(pth, {
			mode: options.mode,
			recursive: true
		});

		return pth;
	}

	const make = pth => {
		try {
			options.fs.mkdirSync(pth, options.mode);
		} catch (error) {
			if (error.code === 'EPERM') {
				throw error;
			}

			if (error.code === 'ENOENT') {
				if (path.dirname(pth) === pth) {
					throw permissionError(pth);
				}

				if (error.message.includes('null bytes')) {
					throw error;
				}

				make(path.dirname(pth));
				return make(pth);
			}

			try {
				if (!options.fs.statSync(pth).isDirectory()) {
					throw new Error('The path is not a directory');
				}
			} catch {
				throw error;
			}
		}

		return pth;
	};

	return make(path.resolve(input));
};

var makeDir$1 = makeDir$2.exports;

// Signature is a random signature that is stored and used





// File identifier for global signature file
const PRISMA_SIGNATURE = 'signature';

// IMPORTANT: this is part of the public API
async function getSignature(signatureFile) {
  const dirs = paths('checkpoint');
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
    signature: signature || v4(),
  };
  await makeDir$1(path__default["default"].dirname(signatureFile));
  await fs__default["default"].writeFile(signatureFile, JSON.stringify(signatureState, null, '  '));
  return signatureState.signature
}

async function getInfo() {
  const cachePath = paths('checkpoint').cache;

  if (!require$$0.existsSync(cachePath)) {
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

// U is the subset of T, not sure why
// this works or why _T is necessary










// valid default schema
const defaultSchema = {
  last_reminder: 0,
  cached_at: 0,
  version: '',
  cli_path: '',
  // User output
  output: {
    client_event_id: '',
    previous_client_event_id: '',
    product: '',
    cli_path_hash: '',
    local_timestamp: '',
    previous_version: '',
    current_version: '',
    current_release_date: 0,
    current_download_url: '',
    current_changelog_url: '',
    package: '',
    release_tag: '',
    install_command: '',
    project_website: '',
    outdated: false,
    alerts: [],
  },
};

// initialize the configuration
class Config {
  static async new(state, schema = defaultSchema) {
    await makeDir$1(path__default["default"].dirname(state.cache_file));
    return new Config(state, schema)
  }

  constructor(  state,   defaultSchema) {this.state = state;this.defaultSchema = defaultSchema;}

  // check and return the cache if (matches version or hasn't expired)
  async checkCache(newState) {
    const now = newState.now();
    // fetch the data from the cache
    const cache = await this.all();

    if (!cache) {
      return { cache: undefined, stale: true }
    }
    // version has been upgraded or changed
    // TODO: define this behaviour more clearly.
    if (newState.version !== cache.version) {
      return { cache, stale: true }
    }
    // cache expired
    if (now - cache.cached_at > newState.cache_duration) {
      return { cache, stale: true }
    }
    return { cache, stale: false }
  }

  // set the configuration
  async set(update) {
    const existing = (await this.all()) || {};
    const schema = Object.assign(existing, update);
    // TODO: figure out how to type this
    for (let k in this.defaultSchema) {
      // @ts-ignore
      if (typeof schema[k] === 'undefined') {
        // @ts-ignore
        schema[k] = this.defaultSchema[k];
      }
    }
    await fs__default["default"].writeFile(this.state.cache_file, JSON.stringify(schema, null, '  '));
  }

  // get the entire schema
  async all() {
    try {
      const data = await fs__default["default"].readFile(this.state.cache_file, 'utf8');
      return JSON.parse(data)
    } catch (err) {
      return
    }
  }

  // get a value from the schema
  async get(key) {
    const schema = await this.all();
    if (typeof schema === 'undefined') {
      return
    }
    return schema[key]
  }

  // reset the configuration
  async reset() {
    await fs__default["default"].writeFile(this.state.cache_file, JSON.stringify(this.defaultSchema, null, '  '));
    return
  }

  // delete the configuration, ignoring any errors
  async delete() {
    try {
      await fs__default["default"].unlink(this.state.cache_file);
      return
    } catch (err) {
      return
    }
  }
}

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

// JS-Checkpoint is a API-compatible JS client for a checkpoint server, like https://checkpoint.hashicorp.com/.

// Child path of the binary
// eval("__dirname") to make ncc happy
const childPath = path__default["default"].join(eval('__dirname'), 'child');

// Check types






































































































































































// actual implementation of the check() function
async function check(input) {
  // Create a cache file for this instance of the CLI path
  const defaultCache = getCacheFile(input.product, input.cli_path_hash || 'default');
  const ci = require('ci-info'); 

  // initialize the internal state
  const state = {
    product: input.product,
    version: input.version,
    cli_install_type: input.cli_install_type || '',
    information: input.information || '',
    local_timestamp: input.local_timestamp || rfc3339(new Date()),
    project_hash: input.project_hash,
    cli_path: input.cli_path || '',
    cli_path_hash: input.cli_path_hash || '',
    endpoint: input.endpoint || 'https://checkpoint.prisma.io',
    disable: typeof input.disable === 'undefined' ? false : input.disable,
    arch: input.arch || os__default["default"].arch(),
    os: input.os || os__default["default"].platform(),
    node_version: input.node_version || process.version,
    ci: typeof input.ci !== 'undefined' ? input.ci : ci.isCI,
    ci_name: typeof input.ci_name !== 'undefined' ? input.ci_name || '' : ci.name || '',
    command: input.command || '',
    schema_providers: input.schema_providers || [],
    schema_preview_features: input.schema_preview_features || [],
    schema_generators_providers: input.schema_generators_providers || [],
    cache_file: input.cache_file || defaultCache,
    cache_duration: typeof input.cache_duration === 'undefined' ? ms('12h') : input.cache_duration,
    remind_duration: typeof input.remind_duration === 'undefined' ? ms('48h') : input.remind_duration,
    force: typeof input.force === 'undefined' ? false : input.force,
    timeout: getTimeout(input.timeout),
    unref: typeof input.unref === 'undefined' ? true : input.unref,
    child_path: input.child_path || childPath,
    now: () => Date.now(),
    client_event_id: input.client_event_id || '',
    previous_client_event_id: input.previous_client_event_id || '',
    check_if_update_available: false,
  };

  // the CHECKPOINT_DISABLE environment variable will disable checkpoint from
  // checking for a new version or for alerts
  if ((process.env['CHECKPOINT_DISABLE'] || state.disable) && !state.force) {
    return {
      status: 'disabled',
    }
  }

  // make the cache file without if we haven't already
  const config = await Config.new(state);
  // check if we've already cached the response
  const cacheResponse = await config.checkCache(state);

  // if the cache is stale (can be expired, or uses a different version):
  // send an additional `check_if_update_needed` field to the telemetry service to get a new response for versions
  state.check_if_update_available = cacheResponse.stale === true || !cacheResponse.cache;

  // Spawn the child to send telemetry request
  const child = spawn(state);

  if (state.unref) {
    child.unref();
    // Closes the IPC channel between parent and child
    child.disconnect();
  }

  // If the cache is stale or does not exist, wait for it to be invalidated
  if (cacheResponse.stale === true || !cacheResponse.cache) {
    return {
      status: 'waiting',
      data: child,
    }
  }

  // instead of resetting the whole cache, only update where `state` has non-nullish values
  for (const key of Object.keys(state)) {
    if (state[key]) {
      await config.set({
        [key]: state[key],
      });
    }
  }

  // lastly, check if we've recently informed the user
  const userReminded = state.now() - cacheResponse.cache.last_reminder < state.remind_duration;

  if (userReminded) {
    // User has been reminded. Don't inform them right now
    return {
      status: 'reminded',
      data: cacheResponse.cache.output,
    }
  }

  // otherwise update the last_reminder and return the cache
  await config.set({
    last_reminder: state.now(),
  });

  return {
    status: 'ok',
    data: cacheResponse.cache.output,
  }
}

/**
 *
 * @param product The name of the product, e.g. 'prisma'
 * @param cacheIdentifier Identifier to differentiate different cache files for a product
 */
function getCacheFile(product, cacheIdentifier) {
  const dirs = paths(`checkpoint`); // Get a user local storage path
  return path__default["default"].join(dirs.cache, `${product}-${cacheIdentifier}`)
}

// get the timeout from the input or environment variable
function getTimeout(inputTimeout) {
  if (typeof inputTimeout !== 'undefined') {
    return inputTimeout
  }
  // the CHECKPOINT_TIMEOUT for compatibility with go-checkpoint
  const timeoutString = process.env['CHECKPOINT_TIMEOUT'];
  if (typeof timeoutString === 'undefined') {
    return 5000
  }
  const timeout = parseInt(timeoutString, 10);
  if (isNaN(timeout)) {
    return 5000
  }
  return timeout
}

function getForkOpts(state) {
  if (state.unref === true) {
    return {
      detached: true,
      // When CHECKPOINT_DEBUG_STDOUT !== undefined, use 'inherit' to let the child print the debug output
      stdio: process.env.CHECKPOINT_DEBUG_STDOUT ? 'inherit' : 'ignore',
      env: process.env,
    }
  }

  return { detached: false, stdio: 'pipe', env: process.env }
}

// spawn a child
function spawn(state) {
  return child_process.fork(childPath, [JSON.stringify(state)], getForkOpts(state))
}

// Returns an rfc3339 compliant local date string with timezone.
// This function is unfortunately necessary because Date.toISOString() always returns the time in UTC.
// This function return an RFC3339 formatted string in the user's local time zone.
function rfc3339(d) {
  function pad(n) {
    return n < 10 ? '0' + n : n
  }

  function timezoneOffset(offset) {
    let sign;
    if (offset === 0) {
      return 'Z'
    }
    sign = offset > 0 ? '-' : '+';
    offset = Math.abs(offset);
    return sign + pad(Math.floor(offset / 60)) + ':' + pad(offset % 60)
  }

  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    'T' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds()) +
    timezoneOffset(d.getTimezoneOffset())
  )
}

exports.check = check;
exports.getInfo = getInfo;
exports.getSignature = getSignature;
