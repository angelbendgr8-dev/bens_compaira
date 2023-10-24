import { Box, FormControl, FormLabel, Select, Text } from "@chakra-ui/react";
import React, { FC, useState } from "react";

type Props = {
  label: string;
  id: string;
  onChange: any;
  onFocus?: any;
  errors?: any;
  value: any;
  name?: string;
  options: any;
  disabled?: boolean;
};
const SelectInput: FC<Props> = ({
  label,
  id,
  onChange,
  errors = {},
  value,
  name = "",
  options,
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <FormControl
      mb={{
        base: 5,
        md: 4,
      }}
      variant="floating"
      id={id}
    >
      {!focused && (
        <Box top={-3} left={3} zIndex={10} pos={"absolute"} bg={"white"}>
          <Text
            //@ts-ignore
            color={"black.200"}
          >
            {label}
          </Text>
        </Box>
      )}
      <Select
        borderColor={errors[name] ? "red.600" : "muted.100"}
        borderWidth={errors[name] ? 2 : 1}
        color={"gray.600"}
        bg={"white"}
        size={"lg"}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        disabled={disabled}
        // placeholder="Select option"
      >
        {/* <option>{'Hello'}</option> */}
        {options.map((item: any, index: number) => (
          <option key={index} value={item.value}>
            {item.value}
          </option>
        ))}
      </Select>
      {/* It is important that the Label comes after the Control due to css selectors */}
      {focused && (
        <FormLabel color={errors[name] ? "red.600" : "black.300"}>
          {label}
        </FormLabel>
      )}
    </FormControl>
  );
};

export default SelectInput;
