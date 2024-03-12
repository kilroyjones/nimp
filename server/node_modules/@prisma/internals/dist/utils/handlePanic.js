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
var handlePanic_exports = {};
__export(handlePanic_exports, {
  handlePanic: () => handlePanic
});
module.exports = __toCommonJS(handlePanic_exports);
var import_colors = require("kleur/colors");
var import_prompts = __toESM(require("prompts"));
var import_sendPanic = require("../sendPanic");
var import_canPrompt = require("./canPrompt");
var import_getGitHubIssueUrl = require("./getGitHubIssueUrl");
var import_link = require("./link");
async function handlePanic(args) {
  if (!(0, import_canPrompt.canPrompt)()) {
    throw args.error;
  }
  await panicDialog(args);
}
async function panicDialog({
  error,
  cliVersion,
  enginesVersion,
  command,
  getDatabaseVersionSafe
}) {
  const errorMessage = error.message.split("\n").slice(0, Math.max(20, process.stdout.rows)).join("\n");
  console.log(`${(0, import_colors.red)("Oops, an unexpected error occurred!")}
${(0, import_colors.red)(errorMessage)}

${(0, import_colors.bold)("Please help us improve Prisma by submitting an error report.")}
${(0, import_colors.bold)("Error reports never contain personal or other sensitive information.")}
${(0, import_colors.dim)(`Learn more: ${(0, import_link.link)("https://pris.ly/d/telemetry")}`)}
`);
  const { value: shouldSubmitReport } = await (0, import_prompts.default)({
    type: "select",
    name: "value",
    message: "Submit error report",
    initial: 0,
    choices: [
      {
        title: "Yes",
        value: true,
        description: `Send error report once`
      },
      {
        title: "No",
        value: false,
        description: `Don't send error report`
      }
    ]
  });
  if (shouldSubmitReport) {
    try {
      console.log("Submitting...");
      const reportId = await (0, import_sendPanic.sendPanic)({ error, cliVersion, enginesVersion, getDatabaseVersionSafe });
      console.log(`
${(0, import_colors.bold)(`We successfully received the error report id: ${reportId}`)}`);
      console.log(`
${(0, import_colors.bold)("Thanks a lot for your help! \u{1F64F}")}`);
    } catch (error2) {
      const reportFailedMessage = `${(0, import_colors.bold)((0, import_colors.red)("Oops. We could not send the error report."))}`;
      console.log(reportFailedMessage);
      console.error(`${(0, import_colors.gray)("Error report submission failed due to: ")}`, error2);
    }
  }
  await (0, import_getGitHubIssueUrl.wouldYouLikeToCreateANewIssue)({
    prompt: !shouldSubmitReport,
    error,
    cliVersion,
    enginesVersion,
    command
  });
  process.exit(1);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handlePanic
});
