import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Box,
  Drawer,
  DrawerContent,
  useDimensions,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { SidebarContent } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/state/hooks/user.hook";
import { setPrevRoute, signOut } from "@/state/reducers/auth.reducer";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import { logout } from "@/state/services/awscognito.service";
import { useRouter } from "next/router";
import {isEmpty} from 'lodash';

interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome },
  { name: "Trending", icon: FiTrendingUp },
  { name: "Explore", icon: FiCompass },
  { name: "Favourites", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];

const AppLayouts = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const router = useRouter();
  const { token } = useAuth();
  const elementRef = useRef();
  //@ts-ignore
  const dimensions = useDimensions(elementRef);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const btnRef = useRef();
  const { breakpoints } = theme;
  useEffect(() => {
    if (dimensions) {
      console.log(dimensions.borderBox.width);
    }
  }, [dimensions]);
  // const verifyToken = () => {
  //     const decoded: any = jwtDecode(token);
  //     return decoded.exp > Date.now() / 1000;
  // };
  useEffect(() => {
   const verifyToken = () => {
     const decoded: any = jwtDecode(token);
     return decoded.exp > Date.now() / 1000;
   };
    if (!token || !verifyToken()) {
      console.log('unverified');
      dispatch(signOut());
      logout();
    }
  }, [dispatch,token]);

  useEffect(() => {
    if(isEmpty(token)){
      dispatch(setPrevRoute({route: router.pathname}))
       router.push("/login");
    }
  }, [token,router, dispatch])


  console.log(breakpoints["md"]);
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen:
      dimensions && dimensions.borderBox.width < 768 ? false : true,
  });
  return (
    <Box>
      <Box
        //@ts-ignore
        ref={elementRef}
        // minH={{
        //   lg: "100vh",
        // }}
        zIndex={200}
        position={"fixed"}
        bg={"secondary.100"}
      >
        <MobileNav isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
        {isOpen && <SidebarContent onClose={onClose} />}
      </Box>

      <Box
        // w={{
        //   base: 250,
        //   sm: 250,
        //   md: 250,
        //   lg: 220,
        //   xl: 230,
        // }}
        ml={{
          base: 0,
          md: isOpen ? 0 : 0,
          lg: isOpen ? 240 : 0,
          xl: isOpen ? 250 : 0,
        }}
        p="4"
        bg="secondary.100"

        // h={'200%'}
        // overflowY={"scroll"}
      >
        {children}
      </Box>
    </Box>
  );
};
export default AppLayouts;
