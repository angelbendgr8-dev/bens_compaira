import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import React, { FC } from "react";

type Props = {
  label: string;
  id: string;
  onChange: any;
  value: any;
};
const FormSwitch: FC<Props> = ({ label, id, onChange, value }) => {
  return (
    <FormControl mt={4} display="flex" alignItems="center">
      <Switch isChecked={value} onChange={onChange} id={id} />
      <FormLabel
        ml={{
          base: 4,
        }}
        htmlFor="email-alerts"
        mb="0"
      >
        {label}
      </FormLabel>
    </FormControl>
  );
};

export default FormSwitch;
