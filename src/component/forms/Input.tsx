import { Box, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  label: string;
  id: string;
  onChange: any;
  onFocus?: any;
  type: string;
  errors?: any;
  value: any;
  name?: string;
  min?: number;
  max?: number;
  labelStyle?: any;
  onBlur?: any;
};
const CustomInput = ({
  label,
  id,
  onChange,
  onFocus = () => {},
  onBlur = () => {},
  type,
  errors = {},
  value,
  name = "",
  min,
  max,
  labelStyle = {},
}: Props) => {
  return (
    <FormControl
      mb={{
        base: 5,
        md: 4,
      }}
      variant="floating"
      id={id}
    >
      <Input
        placeholder=" "
        // bg={"white"}
        name={name}
        value={value}
        min={min}
        max={max}
        onFocus={onFocus}
        autoFocus={errors[name] ? true : false}
        onBlur={onBlur}
        borderColor={errors[name] ? "red.600" : "muted.100"}
        onChange={(input) => onChange(input)}
        borderWidth={errors[name] ? 2 : 1}
        size={"lg"}
        color={"gray.600"}
        _placeholder={{
          color: "gray.200",
        }}
        type={type}
      />
      {/* It is important that the Label comes after the Control due to css selectors */}
      {errors[name] && <Text color={"red.600"}>{errors[name].message}</Text>}
      {errors[name] ? (
        <Box top={-3} left={3} zIndex={10} pos={"absolute"} bg={"white"}>
          <Text color={"red.600"}>{label}</Text>
        </Box>
      ) : (
        <FormLabel style={labelStyle}>{label}</FormLabel>
      )}
    </FormControl>
  );
};

export default CustomInput;
