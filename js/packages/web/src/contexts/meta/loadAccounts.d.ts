import { Connection } from '@solana/web3.js';
import { MetaState } from './types';
import { Metadata, ParsedAccount } from '@oyster/common';
export declare const loadAccounts: (connection: Connection, all: boolean) => Promise<MetaState>;
export declare const makeSetter: (state: MetaState) => (prop: keyof MetaState, key: string, value: ParsedAccount<any>) => MetaState;
export declare const metadataByMintUpdater: (metadata: ParsedAccount<Metadata>, state: MetaState, all: boolean) => Promise<MetaState>;
//# sourceMappingURL=loadAccounts.d.ts.map