"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sorted = void 0;
const sorted = (list, sortFunction) => {
    const newList = [...list];
    newList.sort(sortFunction);
    return newList;
};
exports.sorted = sorted;
//# sourceMappingURL=sorted.js.map