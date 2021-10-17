"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onChangeAccount = void 0;
const onChangeAccount = (process, setter, all) => async (info) => {
    const pubkey = pubkeyByAccountInfo(info);
    await process({
        pubkey,
        account: info.accountInfo,
    }, setter, all);
};
exports.onChangeAccount = onChangeAccount;
const pubkeyByAccountInfo = (info) => {
    return typeof info.accountId === 'string'
        ? info.accountId
        : info.accountId.toBase58();
};
//# sourceMappingURL=onChangeAccount.js.map