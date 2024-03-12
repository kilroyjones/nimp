"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCamelCaseMapper = exports.createSnakeCaseMapper = void 0;
function createSnakeCaseMapper({ upperCase = false, underscoreBeforeDigits = false, underscoreBetweenUppercaseLetters = false, } = {}) {
    return memoize((str) => {
        if (str.length === 0) {
            return str;
        }
        const upper = str.toUpperCase();
        const lower = str.toLowerCase();
        let out = lower[0];
        for (let i = 1, l = str.length; i < l; ++i) {
            const char = str[i];
            const prevChar = str[i - 1];
            const upperChar = upper[i];
            const prevUpperChar = upper[i - 1];
            const lowerChar = lower[i];
            const prevLowerChar = lower[i - 1];
            if (underscoreBeforeDigits && isDigit(char) && !isDigit(prevChar)) {
                out += "_" + char;
                continue;
            }
            if (char === upperChar && upperChar !== lowerChar) {
                const prevCharacterIsUppercase = prevChar === prevUpperChar && prevUpperChar !== prevLowerChar;
                if (underscoreBetweenUppercaseLetters || !prevCharacterIsUppercase) {
                    out += "_" + lowerChar;
                }
                else {
                    out += lowerChar;
                }
            }
            else {
                out += char;
            }
        }
        if (upperCase) {
            return out.toUpperCase();
        }
        else {
            return out;
        }
    });
}
exports.createSnakeCaseMapper = createSnakeCaseMapper;
function createCamelCaseMapper({ upperCase = false, } = {}) {
    return memoize((str) => {
        if (str.length === 0) {
            return str;
        }
        if (upperCase && isAllUpperCaseSnakeCase(str)) {
            str = str.toLowerCase();
        }
        let out = str[0];
        for (let i = 1, l = str.length; i < l; ++i) {
            const char = str[i];
            const prevChar = str[i - 1];
            if (char !== "_") {
                if (prevChar === "_") {
                    out += char.toUpperCase();
                }
                else {
                    out += char;
                }
            }
        }
        return out;
    });
}
exports.createCamelCaseMapper = createCamelCaseMapper;
function isAllUpperCaseSnakeCase(str) {
    for (let i = 1, l = str.length; i < l; ++i) {
        const char = str[i];
        if (char !== "_" && char !== char.toUpperCase()) {
            return false;
        }
    }
    return true;
}
function isDigit(char) {
    return char >= "0" && char <= "9";
}
function memoize(func) {
    const cache = new Map();
    return (str) => {
        let mapped = cache.get(str);
        if (!mapped) {
            mapped = func(str);
            cache.set(str, mapped);
        }
        return mapped;
    };
}
//# sourceMappingURL=camelCase.js.map