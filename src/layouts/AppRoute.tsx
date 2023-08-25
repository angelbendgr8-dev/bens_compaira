import React, { useEffect, useState } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import ProtectedRoute from "./ProtectedRoute";
import { HomeLayoutProps } from "@/interfaces/app.interface";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { signOut } from "@/state/reducers/auth.reducer";
import { logout } from "@/state/services/awscognito.service";
import Router from "next/router";
import { useAuth } from "@/state/hooks/user.hook";

const HomeLayout = ({ children, upload, toggleView }: HomeLayoutProps) => {
  //   const { token } = useAppSelector((store) => store.app.userReducer);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { token } = useAuth();
  const dispatch = useDispatch();

  // const verifyToken = () => {
  //     const decoded: any = jwtDecode(token);
  //     return decoded.exp > Date.now() / 1000;
  // };
  // useEffect(() => {
  //   if (!token || !verifyToken()) {
  //     console.log('unverified');
  //     dispatch(signOut());
  //     logout();
  //     router.replace('/login');
  //   }
  // }, []);

  return (
    <Box
      maxH={toggleView ? "" : "100vh"}
      //   bg={"red.600"}
      maxW={"100vw"}
      w="100vw"
      h={toggleView ? "" : "100vh"}
      // overflowY={"hidden"}
      onClick={() => setShowSuggestions(false)}
    >
      {children}
    </Box>
  );
}

export default ProtectedRoute(HomeLayout);
