"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExtendedArt = exports.useArt = exports.useCachedImage = void 0;
const react_1 = require("react");
const contexts_1 = require("../contexts");
const types_1 = require("../types");
const three_1 = require("three");
const react_intersection_observer_1 = require("react-intersection-observer");
const pubkeyToString_1 = require("../utils/pubkeyToString");
const metadataToArt = (info, editions, masterEditions, whitelistedCreatorsByCreator) => {
    var _a, _b;
    let type = types_1.ArtType.NFT;
    let editionNumber = undefined;
    let maxSupply = undefined;
    let supply = undefined;
    if (info) {
        const masterEdition = masterEditions[info.masterEdition || ''];
        const edition = editions[info.edition || ''];
        if (edition) {
            const myMasterEdition = masterEditions[edition.info.parent || ''];
            if (myMasterEdition) {
                type = types_1.ArtType.Print;
                editionNumber = edition.info.edition.toNumber();
                supply = ((_a = myMasterEdition.info) === null || _a === void 0 ? void 0 : _a.supply.toNumber()) || 0;
            }
        }
        else if (masterEdition) {
            type = types_1.ArtType.Master;
            maxSupply = (_b = masterEdition.info.maxSupply) === null || _b === void 0 ? void 0 : _b.toNumber();
            supply = masterEdition.info.supply.toNumber();
        }
    }
    return {
        uri: (info === null || info === void 0 ? void 0 : info.data.uri) || '',
        mint: info === null || info === void 0 ? void 0 : info.mint,
        title: info === null || info === void 0 ? void 0 : info.data.name,
        creators: ((info === null || info === void 0 ? void 0 : info.data.creators) || [])
            .map(creator => {
            const knownCreator = whitelistedCreatorsByCreator[creator.address];
            return {
                address: creator.address,
                verified: creator.verified,
                share: creator.share,
                image: (knownCreator === null || knownCreator === void 0 ? void 0 : knownCreator.info.image) || '',
                name: (knownCreator === null || knownCreator === void 0 ? void 0 : knownCreator.info.name) || '',
                link: (knownCreator === null || knownCreator === void 0 ? void 0 : knownCreator.info.twitter) || '',
            };
        })
            .sort((a, b) => {
            const share = (b.share || 0) - (a.share || 0);
            if (share === 0) {
                return a.name.localeCompare(b.name);
            }
            return share;
        }),
        seller_fee_basis_points: (info === null || info === void 0 ? void 0 : info.data.sellerFeeBasisPoints) || 0,
        edition: editionNumber,
        maxSupply,
        supply,
        type,
    };
};
const cachedImages = new Map();
const useCachedImage = (uri, cacheMesh) => {
    const [cachedBlob, setCachedBlob] = (0, react_1.useState)(undefined);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (!uri) {
            return;
        }
        const result = cachedImages.get(uri);
        if (result) {
            setCachedBlob(result);
            return;
        }
        (async () => {
            let response;
            try {
                response = await fetch(uri, { cache: 'force-cache' });
            }
            catch {
                try {
                    response = await fetch(uri, { cache: 'reload' });
                }
                catch {
                    // If external URL, just use the uri
                    if (uri === null || uri === void 0 ? void 0 : uri.startsWith('http')) {
                        setCachedBlob(uri);
                    }
                    setIsLoading(false);
                    return;
                }
            }
            const blob = await response.blob();
            if (cacheMesh) {
                // extra caching for meshviewer
                three_1.Cache.enabled = true;
                three_1.Cache.add(uri, await blob.arrayBuffer());
            }
            const blobURI = URL.createObjectURL(blob);
            cachedImages.set(uri, blobURI);
            setCachedBlob(blobURI);
            setIsLoading(false);
        })();
    }, [uri, setCachedBlob, setIsLoading]);
    return { cachedBlob, isLoading };
};
exports.useCachedImage = useCachedImage;
const useArt = (key) => {
    const { metadata, editions, masterEditions, whitelistedCreatorsByCreator } = (0, contexts_1.useMeta)();
    const account = (0, react_1.useMemo)(() => metadata.find(a => a.pubkey === key), [key, metadata]);
    const art = (0, react_1.useMemo)(() => metadataToArt(account === null || account === void 0 ? void 0 : account.info, editions, masterEditions, whitelistedCreatorsByCreator), [account, editions, masterEditions, whitelistedCreatorsByCreator]);
    return art;
};
exports.useArt = useArt;
const useExtendedArt = (id) => {
    const { metadata } = (0, contexts_1.useMeta)();
    const [data, setData] = (0, react_1.useState)();
    const { ref, inView } = (0, react_intersection_observer_1.useInView)();
    const key = (0, pubkeyToString_1.pubkeyToString)(id);
    const account = (0, react_1.useMemo)(() => metadata.find(a => a.pubkey === key), [key, metadata]);
    (0, react_1.useEffect)(() => {
        if (inView && id && !data) {
            const USE_CDN = false;
            const routeCDN = (uri) => {
                let result = uri;
                if (USE_CDN) {
                    result = uri.replace('https://arweave.net/', 'https://coldcdn.com/api/cdn/bronil/');
                }
                return result;
            };
            if (account && account.info.data.uri) {
                const uri = routeCDN(account.info.data.uri);
                const processJson = (extended) => {
                    var _a, _b;
                    if (!extended || ((_b = (_a = extended === null || extended === void 0 ? void 0 : extended.properties) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length) === 0) {
                        return;
                    }
                    if (extended === null || extended === void 0 ? void 0 : extended.image) {
                        const file = extended.image.startsWith('http')
                            ? extended.image
                            : `${account.info.data.uri}/${extended.image}`;
                        extended.image = routeCDN(file);
                    }
                    return extended;
                };
                try {
                    const cached = localStorage.getItem(uri);
                    if (cached) {
                        setData(processJson(JSON.parse(cached)));
                    }
                    else {
                        // TODO: BL handle concurrent calls to avoid double query
                        fetch(uri)
                            .then(async (_) => {
                            try {
                                const data = await _.json();
                                try {
                                    localStorage.setItem(uri, JSON.stringify(data));
                                }
                                catch {
                                    // ignore
                                }
                                setData(processJson(data));
                            }
                            catch {
                                return undefined;
                            }
                        })
                            .catch(() => {
                            return undefined;
                        });
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
            }
        }
    }, [inView, id, data, setData, account]);
    return { ref, data };
};
exports.useExtendedArt = useExtendedArt;
//# sourceMappingURL=useArt.js.map