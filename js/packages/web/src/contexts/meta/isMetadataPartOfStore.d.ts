import { Metadata, ParsedAccount } from '@oyster/common';
import { Store, WhitelistedCreator } from '../../models/metaplex';
export declare const isMetadataPartOfStore: (m: ParsedAccount<Metadata>, store: ParsedAccount<Store> | null, whitelistedCreatorsByCreator: Record<string, ParsedAccount<WhitelistedCreator>>, useAll: boolean) => boolean;
//# sourceMappingURL=isMetadataPartOfStore.d.ts.map