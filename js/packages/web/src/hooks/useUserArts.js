"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserArts = void 0;
const common_1 = require("@oyster/common");
const bn_js_1 = __importDefault(require("bn.js"));
const metaplex_1 = require("../models/metaplex");
const contexts_1 = require("./../contexts");
const useUserArts = () => {
    const { metadata, masterEditions, editions } = (0, contexts_1.useMeta)();
    const { userAccounts } = (0, common_1.useUserAccounts)();
    const accountByMint = userAccounts.reduce((prev, acc) => {
        prev.set(acc.info.mint.toBase58(), acc);
        return prev;
    }, new Map());
    const ownedMetadata = metadata.filter(m => {
        var _a, _b, _c;
        return accountByMint.has(m.info.mint) &&
            (((_c = (_b = (_a = accountByMint === null || accountByMint === void 0 ? void 0 : accountByMint.get(m.info.mint)) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.amount) === null || _c === void 0 ? void 0 : _c.toNumber()) || 0) > 0;
    });
    const possibleEditions = ownedMetadata.map(m => m.info.edition ? editions[m.info.edition] : undefined);
    const possibleMasterEditions = ownedMetadata.map(m => m.info.masterEdition ? masterEditions[m.info.masterEdition] : undefined);
    let safetyDeposits = [];
    let i = 0;
    ownedMetadata.forEach(m => {
        var _a;
        let a = accountByMint.get(m.info.mint);
        let masterA;
        const masterEdition = possibleMasterEditions[i];
        if ((masterEdition === null || masterEdition === void 0 ? void 0 : masterEdition.info.key) == common_1.MetadataKey.MasterEditionV1) {
            masterA = accountByMint.get(((_a = masterEdition) === null || _a === void 0 ? void 0 : _a.info.printingMint) ||
                '');
        }
        let winningConfigType;
        if ((masterEdition === null || masterEdition === void 0 ? void 0 : masterEdition.info.key) == common_1.MetadataKey.MasterEditionV1) {
            winningConfigType = metaplex_1.WinningConfigType.PrintingV1;
        }
        else if ((masterEdition === null || masterEdition === void 0 ? void 0 : masterEdition.info.key) == common_1.MetadataKey.MasterEditionV2) {
            if (masterEdition.info.maxSupply) {
                winningConfigType = metaplex_1.WinningConfigType.PrintingV2;
            }
            else {
                winningConfigType = metaplex_1.WinningConfigType.Participation;
            }
        }
        else {
            winningConfigType = metaplex_1.WinningConfigType.TokenOnlyTransfer;
        }
        if (a) {
            safetyDeposits.push({
                holding: a.pubkey,
                edition: possibleEditions[i],
                masterEdition,
                metadata: m,
                printingMintHolding: masterA === null || masterA === void 0 ? void 0 : masterA.pubkey,
                winningConfigType,
                amountRanges: [],
                participationConfig: winningConfigType == metaplex_1.WinningConfigType.Participation
                    ? new metaplex_1.ParticipationConfigV2({
                        winnerConstraint: metaplex_1.WinningConstraint.ParticipationPrizeGiven,
                        nonWinningConstraint: metaplex_1.NonWinningConstraint.GivenForFixedPrice,
                        fixedPrice: new bn_js_1.default(0),
                    })
                    : undefined,
            });
        }
        i++;
    });
    return safetyDeposits;
};
exports.useUserArts = useUserArts;
//# sourceMappingURL=useUserArts.js.map