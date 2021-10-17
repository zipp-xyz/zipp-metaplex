import { AuctionState } from './types';
import { ArtSelector } from './artSelector';
import { Row, Col, Input } from 'antd';
import { SafetyDepositDraft } from 'actions/createAuctionManager';
import { Heading } from 'components';
import { Button, Text } from '@chakra-ui/react';

const Participation = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <Row className="call-to-action">
        <Heading>Participation NFT</Heading>
        <Text>
          Provide NFT that will be awarded as an Open Edition NFT for auction
          participation.
        </Text>
      </Row>
      <Row className="content-action">
        <Col className="section" xl={24}>
          <ArtSelector
            filter={(i: SafetyDepositDraft) =>
              !!i.masterEdition && i.masterEdition.info.maxSupply === undefined
            }
            selected={
              props.attributes.participationNFT
                ? [props.attributes.participationNFT]
                : []
            }
            setSelected={items => {
              props.setAttributes({
                ...props.attributes,
                participationNFT: items[0],
              });
            }}
            allowMultiple={false}
          >
            Select Participation NFT
          </ArtSelector>
          <label className="action-field">
            <Heading>Price</Heading>
            <Text>
              This is an optional fixed price that non-winners will pay for your
              Participation NFT.
            </Text>
            <Input
              type="number"
              min={0}
              autoFocus
              className="input"
              placeholder="Fixed Price"
              prefix="◎"
              suffix="SOL"
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  participationFixedPrice: parseFloat(info.target.value),
                })
              }
            />
          </label>
        </Col>
      </Row>
      <Button size="lg" onClick={props.confirm}>
        Continue to Review
      </Button>
    </>
  );
};

export default Participation;
