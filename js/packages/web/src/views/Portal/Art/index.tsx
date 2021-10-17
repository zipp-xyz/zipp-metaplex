import React from 'react';
import { useParams } from 'react-router-dom';
import { useArt, useExtendedArt } from 'hooks';

import { shortenAddress, useConnection } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { MetaAvatar } from 'components/MetaAvatar';
import { sendSignMetadata } from 'actions/sendSignMetadata';
import {
  ViewOn,
  Title,
  MusicPlayer,
  AttributeBox,
  AttributeRow,
} from 'components';
import { ArtType } from 'types';
import {
  Button,
  VStack,
  SimpleGrid,
  Text,
  HStack,
  Box,
  Badge,
} from '@chakra-ui/react';

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();
  const wallet = useWallet();

  const connection = useConnection();
  const art = useArt(id);
  let badge = '';
  if (art.type === ArtType.NFT) {
    badge = 'Unique';
  } else if (art.type === ArtType.Master) {
    badge = 'NFT 0';
  } else if (art.type === ArtType.Print) {
    badge = `${art.edition} of ${art.supply}`;
  }
  const { ref, data } = useExtendedArt(id);

  // const { userAccounts } = useUserAccounts();

  // const accountByMint = userAccounts.reduce((prev, acc) => {
  //   prev.set(acc.info.mint.toBase58(), acc);
  //   return prev;
  // }, new Map<string, TokenAccount>());

  const description = data?.description;
  const attributes = data?.attributes;

  const pubkey = wallet.publicKey?.toBase58() || '';

  const tag = <Badge color="blue">UNVERIFIED</Badge>;

  const unverified = (
    <>
      {tag}
      <Text>
        This artwork is still missing verification from{' '}
        {art.creators?.filter(c => !c.verified).length} contributors before it
        can be considered verified and sellable on the platform.
      </Text>
    </>
  );

  const royalties = `${((art.seller_fee_basis_points || 0) / 100).toFixed(2)}%`;

  return (
    <VStack flexGrow={1} spacing={10} ref={ref}>
      <Title>NFT</Title>
      <MusicPlayer pubkey={id} />
      <Box width="100%">
        <SimpleGrid columns={2} spacing={12} p={6}>
          <Box>
            <AttributeRow title="NFT Attributes" />
            <AttributeRow label="Royalties" value={royalties} />
            {/* <AttributeRow label="Number Of NFTs" value={nftCount} /> */}
            <AttributeRow label="View On">
              <ViewOn id={id} />
            </AttributeRow>
            <AttributeRow label="Edition">
              <Badge>{badge}</Badge>
            </AttributeRow>
            <AttributeBox label="Created By">
              <>
                {(art.creators || []).map((creator, idx) => {
                  return (
                    <HStack>
                      <MetaAvatar creators={[creator]} />
                      <Text>
                        {creator.name || shortenAddress(creator.address || '')}
                      </Text>
                      {!creator.verified &&
                        (creator.address === pubkey ? (
                          <Button
                            onClick={async () => {
                              try {
                                await sendSignMetadata(connection, wallet, id);
                              } catch (e) {
                                console.error(e);
                                return false;
                              }
                              return true;
                            }}
                          >
                            Approve
                          </Button>
                        ) : (
                          tag
                        ))}
                    </HStack>
                  );
                })}
                {art.creators?.find(c => !c.verified) && unverified}
              </>
            </AttributeBox>

            {/* <Button
                  onClick={async () => {
                    if(!art.mint) {
                      return;
                    }
                    const mint = new PublicKey(art.mint);

                    const account = accountByMint.get(art.mint);
                    if(!account) {
                      return;
                    }

                    const owner = wallet.publicKey;

                    if(!owner) {
                      return;
                    }
                    const instructions: any[] = [];
                    await updateMetadata(undefined, undefined, true, mint, owner, instructions)

                    sendTransaction(connection, wallet, instructions, [], true);
                  }}
                >
                  Mark as Sold
                </Button> */}
            {/*
              TODO: add info about artist


            <div className="info-header">ABOUT THE CREATOR</div>
            <div className="info-content">{art.about}</div> */}
            {attributes && (
              <>
                <AttributeBox label="Attributes">
                  <>
                    {attributes.map((attribute, idx) => (
                      <Badge key={idx} title={attribute.trait_type}>
                        {attribute.value}
                      </Badge>
                    ))}
                  </>
                </AttributeBox>
              </>
            )}
          </Box>
          <Box>
            <AttributeBox
              title="About this NFT"
              value={description || 'No description provided.'}
            />
          </Box>
        </SimpleGrid>
      </Box>
    </VStack>
  );
};
