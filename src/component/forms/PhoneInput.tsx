import {
  Box,
  Text,
  Input,
  InputGroup,
  useDisclosure,
  useOutsideClick,
  InputLeftElement,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Countries from "../../utils/countries2.json";
import { AsYouType } from "libphonenumber-js";
// import { PhoneNumberInputProps } from "./types";
import { useState, useEffect, useRef } from "react";
import { isEmpty } from "lodash";

import { useUpdateEffect } from "usehooks-ts";
import { Country, SearchOnList } from "./SearchList";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import CustomInput from "./Input";
import { useProfile } from "@/state/hooks/profile.hook";
export type PhoneNumberInputProps = {
  value?: string;
  code?: string;
  couName?: string;
  errors: any;
  onChange: (arg: any) => void;
  name: string;
};

export const PhoneNumberInput = ({
  onChange,
  value = "",
  code = "",
  couName = "",
  errors,
  name,
}: PhoneNumberInputProps) => {
  const ref = useRef(null);
  const { profileData: profile } = useProfile();
  const [number, setNumber] = useState(value);
  const [country, setCountry] = useState(profile?.phoneCode);
  const [countryName, setCountryName] = useState(profile?.country);
  const [countryFlag, setCountryFlag] = useState(`🇨🇲`);
  const { isOpen, onToggle, onClose } = useDisclosure();

  useOutsideClick({
    ref: ref,
    handler: () => onClose(),
  });

  useUpdateEffect(() => {
    if (!isEmpty(profile)) {
      setCountry(profile?.phoneCode);
      setCountryName(profile?.country);
      setNumber(profile?.phone);
    }
  }, [profile]);
  useUpdateEffect(() => {
    console.log(countryName);
  }, [country, countryName, number,profile]);

  const onCountryChange = (item: Country) => {
    const parsedNumber = new AsYouType().input(`${country}${number}`);

    setCountry(item?.phone);
    setCountryFlag(item?.flag);
    setCountryName(item?.name);
    onChange({
      code: item?.phone,
      phone: "",
      countryName: item?.name,
    });
    onClose();
  };

  const onPhoneNumberChange = (event: any) => {
    const value = event.target.value;
    const parsedNumber = new AsYouType().input(`${country}${number}`);

    setNumber(value);
    onChange({
      code: country,
      phone: value,
      countryName: countryName,
    });
    onChange(parsedNumber);
  };

  return (
    <>
      <Box as="section" ref={ref} position="relative">
        <Box pb={3}>
          <CustomInput
            label={"Select Country"}
            id={"country"}
            name="country"
            errors={errors}
            onChange={onCountryChange}
            onFocus={() => onToggle()}
            onBlur={() => {
              onChange({
                code: country,
                phone: "",
                countryName: countryName,
              });
            }}
            value={countryName}
            type={"text"}
          />
        </Box>
        {isOpen ? (
          <SearchOnList data={Countries} onChange={onCountryChange} />
        ) : null}
        <FormControl variant={"floating"}>
          <InputGroup
            mb={{
              base: 1,
            }}
          >
            <InputLeftElement
              width="5em"
              h={"full"}
              mr={6}
              alignSelf={"center"}
              cursor="pointer"
            >
              <Text as="span" mr={3}>
                {country}
              </Text>
            </InputLeftElement>
            <Input
              py={{
                base: 6,
              }}
              pl={14}
              autoFocus={errors["phone"] ? true : false}
              borderColor={errors[name] ? "red.600" : "muted.100"}
              borderWidth={errors[name] ? 2 : 1}
              type="tel"
              value={number}
              placeholder={
                errors["phone"] || errors["phoneCode"] ? "" : "Enter Phone"
              }
              onChange={onPhoneNumberChange}
              onBlur={() => {
                onChange({
                  code: country,
                  phone: number,
                  countryName: countryName,
                });
              }}
            />
            {errors["phone"] || errors["phoneCode"] ? (
              <Box top={-3} left={3} zIndex={10} pos={"absolute"} bg={"white"}>
                <Text color={"red.600"}>{"Enter Phone Number"}</Text>
              </Box>
            ) : (
              <FormLabel color={errors[name] ? "red.600" : "black.300"}>
                Enter Phone Number
              </FormLabel>
            )}
          </InputGroup>
        </FormControl>
        {(errors["phone"] || errors["phoneCode"]) && (
          <Text color={"red.600"}>phone number is required</Text>
        )}
      </Box>
    </>
  );
};
