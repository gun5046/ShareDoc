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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import { Client } from '@stomp/stompjs';
var user = document.getElementById("user");
var userSelect = document.getElementById("userSelect");
var msg = document.getElementById("msg");
var stopConnection = document.getElementById("stopConnection");
var startConnection = document.getElementById("startConnection");
console.log("페이지 열림");
var connectionState = false;
var LWWRegister = /** @class */ (function () {
    function LWWRegister(id, state) {
        this.id = id;
        this.state = state;
    }
    Object.defineProperty(LWWRegister.prototype, "value", {
        get: function () {
            return this.state.value;
        },
        enumerable: false,
        configurable: true
    });
    LWWRegister.prototype.set = function (value) {
        // set the peer ID to the local ID, increment the local timestamp by 1 and set the value
        this.state = { peer: this.id, timestamp: this.state.timestamp + 1, value: value };
    };
    LWWRegister.prototype.merge = function (state) {
        var remotePeer = state.peer;
        var remoteTimestamp = state.timestamp;
        var localPeer = this.state.peer;
        var localTimestamp = this.state.timestamp;
        console.log("local : " + localTimestamp + " remote : " + remoteTimestamp);
        // if the local timestamp is greater than the remote timestamp, discard the incoming value
        if (localTimestamp > remoteTimestamp) {
            console.log("localTimestamp > remoteTimestamp");
            return;
        }
        // if the timestamps are the same but the local peer ID is greater than the remote peer ID, discard the incoming value
        if (localTimestamp === remoteTimestamp && localPeer > remotePeer) {
            console.log("localTimestamp = remoteTimestamp & localPeer > remotePeer");
            return;
        }
        // otherwise, overwrite the local state with the remote state
        this.state = state;
        console.log("merge");
        console.log("state : " + JSON.stringify(this.state));
        console.log("this.state : " + JSON.stringify(this.state));
        msg.value = JSON.stringify(this.state.value).replace(/\"/gi, "");
    };
    return LWWRegister;
}());
var lwwRegister;
var client;
userSelect.addEventListener("click", function () {
    console.log("유저 결정");
    lwwRegister = new LWWRegister(user === null || user === void 0 ? void 0 : user.value, { peer: (user === null || user === void 0 ? void 0 : user.value) || '', timestamp: 0, value: msg.value || '' });
    client = new Client({
        brokerURL: 'ws://127.0.0.1:8080/ws/doc',
        onConnect: function () {
            client.subscribe('/topic/room', function (message) {
                console.log("Who's Enter: ".concat(message.body));
                if (lwwRegister.id === message.body) {
                    return;
                }
                var state = {
                    "peer": user.value || '',
                    "timestamp": lwwRegister.state.timestamp,
                    "value": msg.value,
                };
                client.publish({ destination: '/app/chat.send', body: JSON.stringify(state) });
            });
            client.subscribe('/topic/doc', function (message) {
                var data = JSON.parse(message.body);
                if (data.peer === lwwRegister.id) {
                    return;
                }
                lwwRegister.merge(data);
            });
            //peer: string, timestamp: number, value: T
            connectionState = true;
            client.publish({ destination: '/app/chat.enter', headers: { login: user.value }, body: user.value || '' });
        },
    });
    client.activate();
    stopConnection.addEventListener('click', function () {
        client.deactivate();
        connectionState = false;
    });
    startConnection.addEventListener('click', function () {
        connectionState = true;
        client.activate();
    });
    msg.addEventListener('keyup', function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // event.preventDefault()
                    console.log(msg.value);
                    if (!!event.ctrlKey) return [3 /*break*/, 2];
                    if (!(event.keyCode > 64 && event.keyCode < 91 || event.keyCode === 8)) return [3 /*break*/, 2];
                    return [4 /*yield*/, lwwRegister.set(msg.value)];
                case 1:
                    _a.sent();
                    if (!connectionState)
                        return [2 /*return*/];
                    client.publish({ destination: '/app/chat.send', body: JSON.stringify(lwwRegister.state) });
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
});
