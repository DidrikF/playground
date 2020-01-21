"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_body_1 = __importDefault(require("koa-body"));
const app = new koa_1.default();
app.use(koa_static_1.default('./dist'));
app.use(koa_body_1.default({
    multipart: true,
}));
app.on('error', (err) => {
    console.error('Server error: ', err);
});
app.on('connection', (...args) => {
    console.log('New connection on port 3000!');
});
app.listen(3000);
//# sourceMappingURL=index.js.map