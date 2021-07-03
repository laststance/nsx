"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var https_1 = require("https");
// import vhost from 'vhost'
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var bcrypt_1 = require("bcrypt");
var sequelize_1 = require("../db/sequelize");
var isProd = process.env.NODE_ENV === 'production';
var isDev = process.env.NODE_ENV === 'development';
var router = express_1.default.Router();
/**
 * ==============================================
 * API Implementation
 * ==============================================
 */
router.get('/posts', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sequelize_1.Post.findAll({
                    include: { model: sequelize_1.Author, as: 'author' },
                    attributes: { exclude: ['authorId'] },
                    order: [['id', 'DESC']],
                })];
            case 1:
                posts = _a.sent();
                res.json(posts);
                return [2 /*return*/];
        }
    });
}); });
router.get('/post/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sequelize_1.Post.findOne({
                    where: { id: req.params.id },
                    include: { model: sequelize_1.Author, as: 'author' },
                    attributes: { exclude: ['authorId'] },
                })];
            case 1:
                post = _a.sent();
                res.json(post);
                return [2 /*return*/];
        }
    });
}); });
router.delete('/post/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, sequelize_1.Post.destroy({ where: { id: req.params.id } })];
            case 1:
                _a.sent();
                res.send(200);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.send(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, salt, hash, author, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                if (!((body === null || body === void 0 ? void 0 : body.name) && (body === null || body === void 0 ? void 0 : body.password))) {
                    return [2 /*return*/, res.status(400).json({ error: 'Data not formatted properly' })];
                }
                return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
            case 1:
                salt = _a.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(body.password, salt)];
            case 2:
                hash = _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, sequelize_1.Author.create({
                        name: body.name,
                        password: hash,
                    })];
            case 4:
                author = _a.sent();
                res.status(201).json({ author: author });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                res.send(500);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, author, validPassword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                return [4 /*yield*/, sequelize_1.Author.findOne({
                        where: { name: body.name },
                    })];
            case 1:
                author = _a.sent();
                if (!author) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt_1.default.compare(body.password, author.password)];
            case 2:
                validPassword = _a.sent();
                if (validPassword) {
                    res.status(200).json({ author: author });
                }
                else {
                    res.status(400).json({ error: 'Invalid Password' });
                }
                return [3 /*break*/, 4];
            case 3:
                res.status(401).json({ error: 'User does not exist' });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, newPost, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sequelize_1.Post.create({
                        title: body.title,
                        body: body.body,
                        authorId: body.authorId,
                    })];
            case 2:
                newPost = _a.sent();
                res.status(201).send(newPost);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                // eslint-disable-next-line no-console
                console.error(error_3);
                res.send(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/update', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sequelize_1.Post.update({ title: body.title, body: body.body }, { where: { id: body.postId } })];
            case 2:
                _a.sent();
                res.status(200).send('success');
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.send(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
var app = express_1.default();
// @ts-ignore
app.use(body_parser_1.default());
app.use(cors_1.default());
app.use('/api', router);
/**
 * ==============================================
 * DEV Server
 * ==============================================
 */
if (isDev) {
    app.listen(4000, function () {
        // eslint-disable-next-line no-console
        console.log("Express DEV Server listening on port 4000!");
    });
}
/**
 * ==============================================
 * Prod Server
 * ==============================================
 */
if (isProd) {
    // const staticApp = express()
    // staticApp.use(
    //   vhost(
    //     'digitalstrength.dev',
    //     express.static(path.join(__dirname, '../../build'))
    //   )
    // )
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../build')));
    var staticPrivatekey = fs_1.default.readFileSync('/etc/letsencrypt/live/digitalstrength.dev/privkey.pem', 'utf8');
    var staticCertificate = fs_1.default.readFileSync('/etc/letsencrypt/live/digitalstrength.dev/cert.pem', 'utf8');
    var staticCa = fs_1.default.readFileSync('/etc/letsencrypt/live/digitalstrength.dev/chain.pem', 'utf8');
    var HttpsServer = https_1.default.createServer({
        key: staticPrivatekey,
        cert: staticCertificate,
        ca: staticCa,
    }, app);
    //
    // const apiPrivateKey = fs.readFileSync(
    //   '/etc/letsencrypt/live/api.digitalstrength.dev/privkey.pem',
    //   'utf8'
    // )
    // const apiCertificate = fs.readFileSync(
    //   '/etc/letsencrypt/live/api.digitalstrength.dev/cert.pem',
    //   'utf8'
    // )
    // const apiCa = fs.readFileSync(
    //   '/etc/letsencrypt/live/api.digitalstrength.dev/chain.pem',
    //   'utf8'
    // )
    // const ApiServer = https.createServer(
    //   {
    //     key: apiPrivateKey,
    //     cert: apiCertificate,
    //     ca: apiCa,
    //   },
    //   app
    // )
    HttpsServer.listen(443, function () {
        // eslint-disable-next-line no-console
        console.log('StaticServer running on port 443');
    });
}
