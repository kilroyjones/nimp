"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var getGitHubIssueUrl_exports = {};
__export(getGitHubIssueUrl_exports, {
  getGitHubIssueUrl: () => getGitHubIssueUrl,
  wouldYouLikeToCreateANewIssue: () => wouldYouLikeToCreateANewIssue
});
module.exports = __toCommonJS(getGitHubIssueUrl_exports);
var import_get_platform = require("@prisma/get-platform");
var import_is_windows = __toESM(require("is-windows"));
var import_is_wsl = __toESM(require("is-wsl"));
var import_new_github_issue_url = __toESM(require("new-github-issue-url"));
var import_open = __toESM(require("open"));
var import_prompts = __toESM(require("prompts"));
var import_strip_ansi = __toESM(require("strip-ansi"));
var import_ts_pattern = require("ts-pattern");
function getGitHubIssueUrl({
  title,
  user = "prisma",
  repo = "prisma",
  template = "bug_report.md",
  body
}) {
  return (0, import_new_github_issue_url.default)({
    user,
    repo,
    template,
    title,
    body
  });
}
async function wouldYouLikeToCreateANewIssue(options) {
  const shouldCreateNewIssue = await (0, import_ts_pattern.match)(options.prompt).with(true, async () => {
    const createNewIssueResponse = await (0, import_prompts.default)({
      type: "select",
      name: "value",
      message: "Would you like to create a GitHub issue?",
      initial: 0,
      choices: [
        {
          title: "Yes",
          value: true,
          description: `Create a new GitHub issue`
        },
        {
          title: "No",
          value: false,
          description: `Don't create a new GitHub issue`
        }
      ]
    });
    return Boolean(createNewIssueResponse.value);
  }).otherwise(() => Promise.resolve(true));
  if (shouldCreateNewIssue) {
    const platform = await (0, import_get_platform.getPlatform)();
    const url = getGitHubIssueUrl({
      title: options.title ?? "",
      body: issueTemplate(platform, options)
    });
    const shouldOpenWait = (0, import_is_windows.default)() || import_is_wsl.default;
    await (0, import_open.default)(url, { wait: shouldOpenWait });
  } else {
    process.exit(130);
  }
}
const issueTemplate = (platform, options) => {
  return (0, import_strip_ansi.default)(`
Hi Prisma Team! The following command just crashed.
${options.reportId ? `The report Id is: ${options.reportId}` : ""}

## Command

\`${options.command}\`

## Versions
      
| Name        | Version            |
|-------------|--------------------|
| Platform    | ${platform.padEnd(19)}| 
| Node        | ${process.version.padEnd(19)}| 
| Prisma CLI  | ${options.cliVersion.padEnd(19)}| 
| Engine      | ${options.enginesVersion.padEnd(19)}| 

## Error
\`\`\`
${options.error}
\`\`\`
`);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getGitHubIssueUrl,
  wouldYouLikeToCreateANewIssue
});
