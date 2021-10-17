import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {
  Flex,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Text,
  Textarea,
} from '@chakra-ui/react';

const Name = props => {
  const { attributes, setAttributes } = props;

  console.log(attributes);
  return (
    <>
      <Flex
        minHeight={300}
        justifyContent="center"
        flexDirection="column"
        mb={6}
      >
        <Text mb={2}>What is your song's name?</Text>
        <Input
          bg="white"
          placeholder="Enter song name"
          defaultValue={attributes.name}
          onChange={e =>
            setAttributes({
              ...attributes,
              name: e.target.value,
            })
          }
        />
        <Text mb={2}>Description</Text>
        <Textarea
          bg="white"
          placeholder="Description"
          defaultValue={attributes.description}
          onChange={e =>
            setAttributes({
              ...attributes,
              description: e.target.value,
            })
          }
        />
        <Text mb={2}>Max Supply</Text>
        <NumberInput
          bg="white"
          placeholder="Enter amount"
          defaultValue={props.attributes.properties.maxSupply}
          onChange={(_, valueAsNumber: number) => {
            props.setAttributes({
              ...props.attributes,
              properties: {
                ...props.attributes.properties,
                maxSupply: valueAsNumber,
              },
            });
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <NumberInput />
        {/* // Add attributes */}
        <Button
          size="lg"
          onClick={() => {
            props.confirm();
          }}
          mt={6}
        >
          Continue to royalties
        </Button>
      </Flex>
    </>
  );
};

export default Name;
