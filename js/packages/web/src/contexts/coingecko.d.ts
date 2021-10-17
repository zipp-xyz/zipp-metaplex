/// <reference types="react" />
export declare const COINGECKO_POOL_INTERVAL: number;
export declare const COINGECKO_API = "https://api.coingecko.com/api/v3/";
export declare const COINGECKO_COIN_PRICE_API: string;
export interface CoingeckoContextState {
    solPrice: number;
}
export declare const solToUSD: () => Promise<number>;
export declare function CoingeckoProvider({ children }: {
    children?: any;
}): JSX.Element;
export declare const useCoingecko: () => CoingeckoContextState;
export declare const useSolPrice: () => number;
//# sourceMappingURL=coingecko.d.ts.map