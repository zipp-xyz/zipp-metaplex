import React from "react";
import ReactDatePicker from "react-datepicker";
// import NumberFormat from "react-number-format";
import { Heading } from "components";
import { useForm, Controller } from "react-hook-form";
import {
  Grid,
  GridItem,
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

const Bidding = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm();

  return (
    <Flex minHeight={400} flexDirection="column">
      <Heading fontSize={2} mb={2}>
        Fill out your auction info
      </Heading>
      <FormControl>
        <Grid templateColumns="repeat(2, auto)">
          {/*  */}
          <GridItem colSpan={[2, 1]} mr={3} mt={10}>
            <FormLabel htmlFor="name">Enter SOL amount</FormLabel>
            <NumberInput bg="white">
              <NumberInputField
                id="solAmount"
                {...register("solAmount", { required: true })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </GridItem>
          {/*  */}
          <GridItem colSpan={[2, 1]} mr={3} mt={10}>
            <FormLabel htmlFor="name">Enter buyout price</FormLabel>
            <NumberInput bg="white">
              <NumberInputField
                id="solBuyout"
                {...register("solBuyout", { required: true })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </GridItem>
          {/*  */}
          <GridItem colSpan={[2, 1]} mr={3} mt={10}>
            <FormLabel htmlFor="name">Bid drop date</FormLabel>
            <Controller
              control={control}
              name="ReactDatepicker"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <ReactDatePicker
                  onChange={onChange}
                  onBlur={onBlur}
                  selected={value}
                  customInput={<Input bg="white" width="100%" />}
                  autoComplete="off"
                />
              )}
            />
          </GridItem>
          {/*  */}
          <GridItem colSpan={[2, 1]} mr={3} mt={10}>
            <FormLabel htmlFor="name">Bid end date</FormLabel>
            <Controller
              control={control}
              name="ReactDatepicker"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <ReactDatePicker
                  as={Flex}
                  onChange={onChange}
                  onBlur={onBlur}
                  selected={value}
                  customInput={<Input bg="white" />}
                  autoComplete="off"
                />
              )}
            />
          </GridItem>
          {/*  */}
          <GridItem colSpan={[2, 1]} mr={3} mt={10}>
            <FormLabel htmlFor="name">Royalty %</FormLabel>
            <NumberInput bg="white">
              <NumberInputField
                id="royalty"
                {...register("royalty", { required: true })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </GridItem>
          {/*  */}
          <GridItem colSpan={[2, 1]} mr={3}>
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </GridItem>
          {/*  */}
        </Grid>
      </FormControl>
    </Flex>
  );
};

export default Bidding;
