import { StringPublicKey } from '@oyster/common';
export declare function useUserBalance(mintAddress?: StringPublicKey, account?: StringPublicKey): {
    balance: number;
    balanceLamports: number;
    balanceInUSD: number;
    accounts: import("@oyster/common").TokenAccount[];
    hasBalance: boolean;
};
//# sourceMappingURL=useUserBalance.d.ts.map