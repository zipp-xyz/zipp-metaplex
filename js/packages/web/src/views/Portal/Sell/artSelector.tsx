import React, { useMemo, useState } from 'react';
import { MusicCard } from 'components';
import { useUserArts } from 'hooks';
import { SafetyDepositDraft } from 'actions/createAuctionManager';

import {
  Button,
  ButtonProps,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Wrap,
} from '@chakra-ui/react';

export interface ArtSelectorProps extends ButtonProps {
  selected: SafetyDepositDraft[];
  setSelected: (selected: SafetyDepositDraft[]) => void;
  allowMultiple: boolean;
  // filter?: (i: SafetyDepositDraft) => boolean;
}

// export const ArtSelector = (props: ArtSelectorProps) => {
export const ArtSelector = (props: any) => {
  const { selected, setSelected, allowMultiple, ...rest } = props;
  let items = useUserArts();
  if (props.filter) items = items.filter(props.filter);
  const selectedItems = useMemo<Set<string>>(
    () => new Set(selected.map(item => item.metadata.pubkey)),
    [selected],
  );

  const [visible, setVisible] = useState(false);

  const open = () => {
    clear();

    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  const clear = () => {
    setSelected([]);
  };

  const confirm = () => {
    close();
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <>
      <Wrap>
        {selected.map(m => {
          let key = m?.metadata.pubkey || '';

          return (
            <MusicCard
              key={key}
              pubkey={m.metadata.pubkey}
              preview={false}
              onClick={open}
              close={() => {
                setSelected(selected.filter(_ => _.metadata.pubkey !== key));
                confirm();
              }}
            />
          );
        })}
        {(allowMultiple || selectedItems.size === 0) && (
          <div
            className="ant-card ant-card-bordered ant-card-hoverable art-card"
            style={{ width: 200, height: 225, display: 'flex' }}
            onClick={open}
          >
            <span className="text-center">Add an NFT</span>
          </div>
        )}
      </Wrap>

      <Modal isOpen={visible} onClose={close} size="2xl">
        <ModalOverlay />
        <ModalContent bg="offblack">
          <ModalHeader color="white">
            Select the NFT you want to sell
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Text>Select the NFT that you want to sell copy/copies of.</Text>
            <Wrap mt={4}>
              {items.map(m => {
                const id = m.metadata.pubkey;
                const isSelected = selectedItems.has(id);

                const onSelect = () => {
                  let list = [...selectedItems.keys()];
                  if (allowMultiple) {
                    list = [];
                  }

                  const newSet = isSelected
                    ? new Set(list.filter(item => item !== id))
                    : new Set([...list, id]);

                  let selected = items.filter(item =>
                    newSet.has(item.metadata.pubkey),
                  );
                  setSelected(selected);

                  if (!allowMultiple) {
                    confirm();
                  }
                };

                return (
                  <MusicCard
                    key={id}
                    pubkey={m.metadata.pubkey}
                    preview={false}
                    onClick={onSelect}
                    isSelected={isSelected}
                  />
                );
              })}
            </Wrap>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={close}>
              Close
            </Button>
            <Button onClick={confirm}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
