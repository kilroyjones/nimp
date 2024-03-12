"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypeOverrideFromDocumentation = void 0;
const START_LEXEME = "@kyselyType(";
const generateTypeOverrideFromDocumentation = (documentation) => {
    const tokens = documentation.split("");
    let matchState = null;
    let parentheses = 0;
    let i = 0;
    while (i < documentation.length) {
        const currentToken = tokens[i];
        if (matchState) {
            if (currentToken === ")" && parentheses === 0)
                return matchState.tokens.join("");
            if (currentToken === ")")
                parentheses--;
            if (currentToken === "(")
                parentheses++;
            matchState.tokens.push(currentToken);
            i++;
            if (i === documentation.length) {
                i = matchState.startLocation + 1;
                matchState = null;
                continue;
            }
            continue;
        }
        if (currentToken === "@") {
            const isMatch = tokens.slice(i, i + START_LEXEME.length).join("") === START_LEXEME;
            if (!isMatch) {
                i++;
                continue;
            }
            matchState = { tokens: [], startLocation: i };
            i += START_LEXEME.length;
            continue;
        }
        i++;
    }
    return null;
};
exports.generateTypeOverrideFromDocumentation = generateTypeOverrideFromDocumentation;
//# sourceMappingURL=generateTypeOverrideFromDocumentation.js.map