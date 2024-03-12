"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isValidTSIdentifier = (ident) => !!ident && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(ident);
exports.default = isValidTSIdentifier;
//# sourceMappingURL=isValidTSIdentifier.js.map