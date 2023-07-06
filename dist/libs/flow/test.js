"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalTest = void 0;
const _1 = __importStar(require("."));
const testFlow = {
    req: {
        body: null,
        headers: { authorization: "123" },
        params: { id: "targetId" },
        query: {},
    },
    res: () => null,
    context: {
        someContext: "exist!",
    },
    data: null,
    status: "success",
};
const setted = (0, _1.setContext)((f) => {
    return Promise.resolve(f.context.someContext);
})("newContext");
/*

const simple = pipe(
  setted,
  setContext<boolean, { newContext: string }>((f) =>
    Promise.resolve(f.context.newContext === "hey!"),
  )("boolContext"),
  setContext<string, { someContext: string; newContext: string }>(async (f) =>
    Promise.resolve(f.context.someContext + f.context.newContext),
  )("dataContext"),
  setData<string, { dataContext: string }>((f) => f.context.dataContext),
)(Promise.resolve(testFlow));

const complicated = pipe(
  parsePlot(setted),
  parsePlot(
    setContext<boolean, { newContext: string }>((f) =>
      Promise.resolve(f.context.newContext === "hey!"),
    )("boolContext"),
  ),
)(Promise.resolve(testFlow));


*/
const finalTest = () => (0, _1.default)(setted, (0, _1.setContext)((f) => Promise.resolve(f.context.newContext === "hey!"))("boolContext"), (0, _1.setContext)((f) => __awaiter(void 0, void 0, void 0, function* () { return Promise.resolve(f.context.someContext + " and " + f.context.newContext); }))("dataContext"))(Promise.resolve(testFlow));
exports.finalTest = finalTest;
