import { Art } from '../types';
import { IMetadataExtension } from '@oyster/common';
export declare const useCachedImage: (uri: string, cacheMesh?: boolean | undefined) => {
    cachedBlob: string | undefined;
    isLoading: boolean;
};
export declare const useArt: (key?: string | undefined) => Art;
export declare const useExtendedArt: (id?: string | undefined) => {
    ref: (node?: Element | null | undefined) => void;
    data: IMetadataExtension | undefined;
};
//# sourceMappingURL=useArt.d.ts.map