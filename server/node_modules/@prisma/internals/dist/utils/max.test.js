"use strict";
var import_max = require("./max");
describe("maxWithComparator", () => {
  test("empty array", () => {
    expect((0, import_max.maxWithComparator)([], () => 0)).toBe(void 0);
  });
  test("with items", () => {
    const items = [{ count: 1 }, { count: 10 }, { count: 5 }];
    expect((0, import_max.maxWithComparator)(items, (a, b) => a.count - b.count)).toBe(items[1]);
  });
});
describe("maxBy", () => {
  test("empty array", () => {
    expect((0, import_max.maxBy)([], () => 1)).toBe(void 0);
  });
  test("with items", () => {
    const items = [{ count: 1 }, { count: 10 }, { count: 5 }];
    expect((0, import_max.maxBy)(items, (item) => item.count)).toBe(items[1]);
  });
});
