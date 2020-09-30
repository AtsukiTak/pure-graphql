"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicsQueryDecoder = exports.UUIDDecoder = exports.TopicStatus = void 0;
const D = __importStar(require("@mojotech/json-type-validation"));
var TopicStatus;
(function (TopicStatus) {
    TopicStatus["Open"] = "Open";
    TopicStatus["Closed"] = "Closed";
})(TopicStatus = exports.TopicStatus || (exports.TopicStatus = {}));
exports.UUIDDecoder = D.string();
exports.TopicsQueryDecoder = D.object({
    topics: D.array(D.object({
        id: exports.UUIDDecoder,
        title: D.union(D.constant(null), D.string()),
        status: D.oneOf(D.constant(TopicStatus.Open), D.constant(TopicStatus.Closed)),
        lastComment: D.union(D.constant(null), D.object({ id: exports.UUIDDecoder, content: D.string() })),
    })),
});
