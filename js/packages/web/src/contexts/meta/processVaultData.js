"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVaultData = void 0;
const common_1 = require("@oyster/common");
const ids_1 = require("@oyster/common/dist/lib/utils/ids");
const processVaultData = ({ account, pubkey }, setter) => {
    if (!isVaultAccount(account))
        return;
    try {
        if (isSafetyDepositBoxV1Account(account)) {
            const safetyDeposit = (0, common_1.decodeSafetyDeposit)(account.data);
            const parsedAccount = {
                pubkey,
                account: account,
                info: safetyDeposit,
            };
            setter('safetyDepositBoxesByVaultAndIndex', safetyDeposit.vault + '-' + safetyDeposit.order, parsedAccount);
        }
        if (isVaultV1Account(account)) {
            const vault = (0, common_1.decodeVault)(account.data);
            const parsedAccount = {
                pubkey,
                account: account,
                info: vault,
            };
            setter('vaults', pubkey, parsedAccount);
        }
    }
    catch {
        // ignore errors
        // add type as first byte for easier deserialization
    }
};
exports.processVaultData = processVaultData;
const isVaultAccount = (account) => account.owner === ids_1.VAULT_ID;
const isSafetyDepositBoxV1Account = (account) => account.data[0] === common_1.VaultKey.SafetyDepositBoxV1;
const isVaultV1Account = (account) => account.data[0] === common_1.VaultKey.VaultV1;
//# sourceMappingURL=processVaultData.js.map