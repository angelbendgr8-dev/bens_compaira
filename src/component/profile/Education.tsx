import { SimpleGrid } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { OptionCards } from "./cards/OptionCards";

import {
  FaBookReader,
  FaUserGraduate,
  FaBriefcase,
  FaBusinessTime,
} from "react-icons/fa";

type Props = {
  options?: any;
  selected?: any;
  onChange?: any;
};
const Profession: FC<Props> = ({ options,onChange, selected }) => {

  return (
    <SimpleGrid
      columns={{
        base: 1,
        sm: 2,
        lg: 2,
        xl: 3,
      }}
      mb={{
        base: 4,
      }}
      spacing={6}
    >
      {options.map((item: any, index: number) => (
        <OptionCards
          title={item.name}
          key={index}
          icon={item.icon}
          active={selected === item.value ? true : false}
          onPress={() => {
            onChange(item.value);
          }}
        />
      ))}
    </SimpleGrid>
  );
};

export default Profession;
