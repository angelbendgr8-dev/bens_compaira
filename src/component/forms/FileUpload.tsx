import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Icon,
  Button,
  Text,
} from "@chakra-ui/react";
// import { FiFile } from "react-icons/fi";
import { useController } from "react-hook-form";
import { useRef } from "react";

type Props = {
  name: string;
  placeholder?: string;
  acceptedFileTypes: string;
  control: any;
  children: any;
  isRequired: boolean;
  isLoading?: boolean;
  label?: string;
  changed: any;
  errors: any;
};

export const FileUpload: React.FC<Props> = ({
  name,
  placeholder,
  acceptedFileTypes,
  control,
  children,
  errors,
  changed,
  isLoading,
  isRequired = false,
  label = 'Upload CV file'
}) => {
  const inputRef = useRef<any>();
  const {
    field: { ref, onChange, value, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  return (
    <FormControl
      my={{
        base: 4,
      }}
      // isInvalid={invalid}
      // isRequired
    >
      <InputGroup>
        {/* <InputLeftElement pointerEvents="none">
          <Icon as={FiFile} />
        </InputLeftElement> */}
        <input
          type="file"
          onChange={(e: any) => {
            onChange(e.target.files[0]);
            changed(e.target.files[0]);
          }}
          accept={acceptedFileTypes}
          //@ts-ignore
          name={name}
          ref={inputRef}
          {...inputProps}
          style={{ display: "none" }}
        />
        <Button
          onClick={() => inputRef.current.click()}
          // onChange={(e) => {}}
          isLoading={isLoading}
          w="full"
          color="white"
          bg="primary.100"
          value={(value && value.name) || ""}
        >
          {label}
        </Button>
      </InputGroup>
      {errors[name] && <Text py={1} color={"red.600"}>{errors[name].message}</Text>}
      <Text pb={1}>{(value && value.name) || ""}</Text>
      <FormLabel htmlFor="writeUpFile">{children}</FormLabel>
      <FormErrorMessage>{invalid}</FormErrorMessage>
    </FormControl>
  );
};

FileUpload.defaultProps = {
  acceptedFileTypes: "",
  //@ts-ignore
  allowMultipleFiles: false,
};

export default FileUpload;
