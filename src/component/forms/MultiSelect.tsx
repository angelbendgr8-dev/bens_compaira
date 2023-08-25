import { FC, useEffect } from "react";
import {
  FormControl,
  FormLabel, FormErrorMessage, Box,
  Text
} from "@chakra-ui/react";
import {
  Select,
  OptionBase,
  GroupBase,
  ChakraStylesConfig,
} from "chakra-react-select";
import { size } from "lodash";

interface OptionGroup extends OptionBase {
  label: string;
  value: string;
}

const foodGroups: OptionGroup[] = [
  {
    label: "Fruits",
    value: "fruit",
  },
  {
    label: "Vegetables",
    value: "vegetable",
  },
  {
    label: "Grains",
    value: "grain",
  },
  {
    label: "Protein Foods",
    value: "protein",
  },
  {
    label: "Dairy",
    value: "dairy",
  },
];

interface FormValues {
  options: OptionGroup[];
  value: any;
  name: string;
  onChange: any;
  onBlur: any;
  errors: any;
  label: string;
  isDisabled?: boolean;
  isMulti?: boolean;
}

const MultiSelect: FC<FormValues> = ({
  options,
  value,
  name,
  onChange,
  onBlur,
  errors,
  label,
  isDisabled = false,
  isMulti=true,
}) => {
  // useEffect(() => {
  //   onChange(value);
  // }, [onChange]);

  useEffect(() => {}, [value]);
  const chakraStyles: ChakraStylesConfig = {
    menu: (provided, state) => ({
      zIndex: 50,
    }),
  };

  return (
    <FormControl
      variant={"floating"}
      pb={4}
      isInvalid={!!errors[name]}
      id="food"
    >
      <Select<OptionGroup, true, GroupBase<OptionGroup>>
        //@ts-ignore
        isMulti={isMulti}
        name={name}
        // ref={ref}
        size={"lg"}
        onChange={onChange}
        onBlur={onBlur}
        //@ts-ignore
        chakraStyles={chakraStyles}
        isReadOnly={isDisabled}
        value={value}
        options={options}
        placeholder=""
        closeMenuOnSelect={false}
      />
      {size(value) > 0 ? (
        <Box top={-3} zIndex={100} left={3} pos={"absolute"} bg={"white"}>
          <Text
            //@ts-ignore
            color={errors[name] ? "red.600" : "blue.300"}
          >
            {label}
          </Text>
        </Box>
      ) : (
        <FormLabel color={errors[name] ? "red.600" : "black.200"}>
          {label}
        </FormLabel>
      )}
      <FormErrorMessage my={2}>{errors && errors[name]?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default MultiSelect;
