import { Row, Col, Input } from 'antd';
import { AuctionState } from './types';
import { Button, Text } from '@chakra-ui/react';
import { Heading } from 'components';

const Winners = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <Row className="call-to-action">
        <Heading>Tiered Auction</Heading>
        <p>Create a Tiered Auction</p>
      </Row>
      <Row className="content-action">
        <Col className="section" xl={24}>
          <label className="action-field">
            <Heading>How many participants can win the auction?</Heading>
            <Text>This is the number of spots in the leaderboard.</Text>
            <Input
              type="number"
              autoFocus
              className="input"
              placeholder="Number of spots in the leaderboard"
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  winnersCount: parseInt(info.target.value),
                })
              }
            />
          </label>
        </Col>
      </Row>
      <Button size="lg" onClick={props.confirm}>
        Continue
      </Button>
    </>
  );
};

export default Winners;
