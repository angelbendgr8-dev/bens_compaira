import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  label: string;
  id: string;
  onChange: any;
  errors: any;
  value: any;
  name: string;
  validate?: any;
};
const PasswordInput = ({
  label,
  id,
  onChange,
  errors,
  value,
  name,
  validate = () => {},
}: Props) => {
  const [show, setShow] = React.useState(false);
  return (
    <FormControl
      mb={{
        base: 2,
        md: 1,
      }}
      variant="floating"
      id={id}
    >
      <InputGroup>
        <Input
          placeholder=" "
          // bg={"white"}
          name={name}
          value={value}
          autoFocus={errors[name] ? true : false}
          borderColor={errors[name] ? "red.600" : "muted.100"}
          onChange={(input) => {
            validate(input.target.value);
            onChange(input);
          }}
          borderWidth={errors[name] ? 2 : 1}
          size={"lg"}
          color={"gray.600"}
          _placeholder={{
            color: "gray.200",
          }}
          type={show ? "text" : "password"}
        />
        {errors[name] ? (
          <Box top={-3} left={3} zIndex={10} pos={"absolute"} bg={"white"}>
            <Text color={"red.600"}>{label}</Text>
          </Box>
        ) : (
          <FormLabel>{label}</FormLabel>
        )}
        <InputRightElement
          mt={{
            base: 2,
          }}
          width="5em"
          cursor="pointer"
          onClick={() => setShow(!show)}
        >
          {!show ? (
            <ViewIcon boxSize={6} color="gray.500" />
          ) : (
            <ViewOffIcon boxSize={6} color="gray.500" />
          )}
        </InputRightElement>
      </InputGroup>
      {/* It is important that the Label comes after the Control due to css selectors */}
      {errors[name] && <Text color={"red.600"}>{errors[name].message}</Text>}
    </FormControl>
  );
};

export default PasswordInput;
