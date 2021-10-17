"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserBalance = void 0;
const common_1 = require("@oyster/common");
const react_1 = require("react");
const contexts_1 = require("../contexts");
function useUserBalance(mintAddress, account) {
    const mint = (0, react_1.useMemo)(() => (typeof mintAddress === 'string' ? mintAddress : mintAddress), [mintAddress]);
    const { userAccounts } = (0, common_1.useUserAccounts)();
    const [balanceInUSD, setBalanceInUSD] = (0, react_1.useState)(0);
    // TODO: add option to register for different token prices
    const solPrice = (0, contexts_1.useSolPrice)();
    const mintInfo = (0, common_1.useMint)(mint);
    const accounts = (0, react_1.useMemo)(() => {
        return userAccounts
            .filter(acc => mint === acc.info.mint.toBase58() &&
            (!account || account === acc.pubkey))
            .sort((a, b) => b.info.amount.sub(a.info.amount).toNumber());
    }, [userAccounts, mint, account]);
    const balanceLamports = (0, react_1.useMemo)(() => {
        return accounts.reduce((res, item) => (res += item.info.amount.toNumber()), 0);
    }, [accounts]);
    const balance = (0, react_1.useMemo)(() => (0, common_1.fromLamports)(balanceLamports, mintInfo), [mintInfo, balanceLamports]);
    (0, react_1.useEffect)(() => {
        setBalanceInUSD(balance * solPrice);
    }, [balance, solPrice, mint, setBalanceInUSD]);
    return {
        balance,
        balanceLamports,
        balanceInUSD,
        accounts,
        hasBalance: accounts.length > 0 && balance > 0,
    };
}
exports.useUserBalance = useUserBalance;
//# sourceMappingURL=useUserBalance.js.map