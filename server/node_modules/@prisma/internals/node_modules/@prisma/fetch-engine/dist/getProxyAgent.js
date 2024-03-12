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
var getProxyAgent_exports = {};
__export(getProxyAgent_exports, {
  getProxyAgent: () => getProxyAgent
});
module.exports = __toCommonJS(getProxyAgent_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_http_proxy_agent = require("http-proxy-agent");
var import_https_proxy_agent = require("https-proxy-agent");
var import_url = __toESM(require("url"));
const debug = (0, import_debug.default)("prisma:fetch-engine:getProxyAgent");
function formatHostname(hostname) {
  return hostname.replace(/^\.*/, ".").toLowerCase();
}
function parseNoProxyZone(zone) {
  zone = zone.trim().toLowerCase();
  const zoneParts = zone.split(":", 2);
  const zoneHost = formatHostname(zoneParts[0]);
  const zonePort = zoneParts[1];
  const hasPort = zone.includes(":");
  return { hostname: zoneHost, port: zonePort, hasPort };
}
function uriInNoProxy(uri, noProxy) {
  const port = uri.port || (uri.protocol === "https:" ? "443" : "80");
  const hostname = formatHostname(uri.hostname);
  const noProxyList = noProxy.split(",");
  return noProxyList.map(parseNoProxyZone).some(function(noProxyZone) {
    const isMatchedAt = hostname.indexOf(noProxyZone.hostname);
    const hostnameMatched = isMatchedAt > -1 && isMatchedAt === hostname.length - noProxyZone.hostname.length;
    if (noProxyZone.hasPort) {
      return port === noProxyZone.port && hostnameMatched;
    }
    return hostnameMatched;
  });
}
function getProxyFromURI(uri) {
  const noProxy = process.env.NO_PROXY || process.env.no_proxy || "";
  if (noProxy)
    debug(`noProxy is set to "${noProxy}"`);
  if (noProxy === "*") {
    return null;
  }
  if (noProxy !== "" && uriInNoProxy(uri, noProxy)) {
    return null;
  }
  if (uri.protocol === "http:") {
    const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy || null;
    if (httpProxy)
      debug(`uri.protocol is HTTP and the URL for the proxy is "${httpProxy}"`);
    return httpProxy;
  }
  if (uri.protocol === "https:") {
    const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || null;
    if (httpsProxy)
      debug(`uri.protocol is HTTPS and the URL for the proxy is "${httpsProxy}"`);
    return httpsProxy;
  }
  return null;
}
function getProxyAgent(url) {
  try {
    const uri = import_url.default.parse(url);
    const proxy = getProxyFromURI(uri);
    if (!proxy) {
      return void 0;
    } else if (uri.protocol === "http:") {
      try {
        return new import_http_proxy_agent.HttpProxyAgent(proxy);
      } catch (agentError) {
        throw new Error(
          `Error while instantiating HttpProxyAgent with URL: "${proxy}"
${agentError}
Check the following env vars "http_proxy" or "HTTP_PROXY". The value should be a valid URL starting with "http://"`
        );
      }
    } else if (uri.protocol === "https:") {
      try {
        return new import_https_proxy_agent.HttpsProxyAgent(proxy);
      } catch (agentError) {
        throw new Error(
          `Error while instantiating HttpsProxyAgent with URL: "${proxy}"
${agentError}
Check the following env vars "https_proxy" or "HTTPS_PROXY". The value should be a valid URL starting with "https://"`
        );
      }
    }
  } catch (e) {
    console.warn(`An error occurred in getProxyAgent(), no proxy agent will be used.`, e);
  }
  return void 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getProxyAgent
});
