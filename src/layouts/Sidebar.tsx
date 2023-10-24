import {
  Box,
  BoxProps,
  Flex,
  Icon,
  IconButton,
  Image,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { LinkItems, NavItem } from "./NavItems";
import { useRouter } from "next/router";

import { CgClose } from "react-icons/cg";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();

  
  return (
    <Box
      transition="3s ease"
      bg={"white"}
      flex={1}
      justifyContent="center"
      borderRight="1px"
      position={"fixed"}
      shadow={"md"}
      zIndex={250}
      boxShadow={"md"}
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      // pos={{
      //   base: "absolute",
      //   lg: "absolute",
      // }}

      w={{
        base: 250,
        sm: 250,
        md: 250,
        lg: 220,
        xl: 230,
      }}
      h={{
        base: "100%",
        lg: "95%",
      }}
      mx={{
        base: 0,
        lg: 4,
      }}
      rounded={{
        base: "none",
        lg: "lg",
      }}
      my={{
        base: 0,
        lg: 4,
      }}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Flex
          my={{
            base: 8,
          }}
          flex={1}
          alignItems={"center"}
          justifyContent="center"
        >
          <Image
            alt="logo"
            fit={"contain"}
            alignSelf={"center"}
            boxSize={75}
            src={"/assets/images/Marquee.png"}
          />
        </Flex>
        <IconButton
          display={{ base: "flex", sm: "flex", lg: "none" }}
          onClick={onClose}
          variant="outline"
          aria-label="close menu"
          icon={<CgClose />}
        />
      </Flex>
      <Stack
        flexDir={"column"}
        py={{
          base: 28,
        }}
        // justifyContent={"center"}
        w={"full"}
        h={"full"}
      >
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            alignSelf={"center"}
            w={"85%"}
            bg={
              router.pathname.includes(link.route)
                ? "primary.200"
                : "transparent"
            }
            icon={link.icon}
            route={link.route}
          >
            {link.name}
          </NavItem>
        ))}
      </Stack>
    </Box>
  );
};
