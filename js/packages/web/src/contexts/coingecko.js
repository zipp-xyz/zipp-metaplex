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
exports.useSolPrice = exports.useCoingecko = exports.CoingeckoProvider = exports.solToUSD = exports.COINGECKO_COIN_PRICE_API = exports.COINGECKO_API = exports.COINGECKO_POOL_INTERVAL = void 0;
const react_1 = __importStar(require("react"));
exports.COINGECKO_POOL_INTERVAL = 1000 * 60; // 60 sec
exports.COINGECKO_API = 'https://api.coingecko.com/api/v3/';
exports.COINGECKO_COIN_PRICE_API = `${exports.COINGECKO_API}simple/price`;
const solToUSD = async () => {
    const url = `${exports.COINGECKO_COIN_PRICE_API}?ids=solana&vs_currencies=usd`;
    const resp = await window.fetch(url).then(resp => resp.json());
    return resp.solana.usd;
};
exports.solToUSD = solToUSD;
const CoingeckoContext = react_1.default.createContext(null);
function CoingeckoProvider({ children = null }) {
    const [solPrice, setSolPrice] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        let timerId = 0;
        const queryPrice = async () => {
            const price = await (0, exports.solToUSD)();
            setSolPrice(price);
            startTimer();
        };
        const startTimer = () => {
            timerId = window.setTimeout(async () => {
                queryPrice();
            }, exports.COINGECKO_POOL_INTERVAL);
        };
        queryPrice();
        return () => {
            clearTimeout(timerId);
        };
    }, [setSolPrice]);
    return (react_1.default.createElement(CoingeckoContext.Provider, { value: { solPrice } }, children));
}
exports.CoingeckoProvider = CoingeckoProvider;
const useCoingecko = () => {
    const context = (0, react_1.useContext)(CoingeckoContext);
    return context;
};
exports.useCoingecko = useCoingecko;
const useSolPrice = () => {
    const { solPrice } = (0, exports.useCoingecko)();
    return solPrice;
};
exports.useSolPrice = useSolPrice;
//# sourceMappingURL=coingecko.js.map