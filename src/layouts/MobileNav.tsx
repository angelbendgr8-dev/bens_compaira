import { useProfile } from "@/state/hooks/profile.hook";
import { useAuth } from "@/state/hooks/user.hook";
import { signOut } from "@/state/reducers/auth.reducer";
import { logout } from "@/state/services/awscognito.service";
import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BiLogOut } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import { useDispatch } from "react-redux";

interface MobileProps extends FlexProps {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}
export const MobileNav = ({
  onOpen,
  onClose,
  isOpen,
  ...rest
}: MobileProps) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { profileData } = useProfile();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    dispatch(signOut());
    router.push('/login');
  };
  return (
    <Flex
      ml={{
        base: "1%",
        lg: isOpen ? 250 : 0,
        xl: isOpen ? 265 : 0,
      }}
      //   px={8}
      transition="all 0.3s"
      mr={{ base: 4, md: 4 }}
      height="20"
      position={"fixed"}
      zIndex={100}
      width={{
        base: "98%",
        lg: isOpen ? "82%" : "100%",
      }}
      alignItems="center"
      bg={"secondary.100"}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between" }}
      {...rest}
    >
      <Flex dir={"row"} align={"center"}>
        <IconButton
          // display={{ base: "flex", md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
        <Box
          ml={2}
          display={{
            base: "none",
            lg: "flex",
          }}
          flexDir="row"
        >
          <Text color={"muted.300"}>Welcome </Text>{" "}
          <Text
            ml={1}
            color={"black.900"}
            fontWeight="medium"
            textTransform={"capitalize"}
          >
            {profileData.firstName
              ? `${profileData.firstName} ${profileData.lastName}`
              : user?.name}
          </Text>
        </Box>
      </Flex>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${profileData.photo}`}
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">
                    {profileData.firstName
                      ? `${profileData.firstName} ${profileData.lastName}`
                      : user?.name}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              width={12}
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={()=> router.replace('/profile')} display="flex" flexDir={"row"}>
                <Icon mr={2} as={FaUser} />
                Profile
              </MenuItem>
              <MenuDivider />
              <MenuItem display="flex" flexDir={"row"} onClick={handleSignOut}>
                <Icon mr={2} as={BiLogOut} />
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
