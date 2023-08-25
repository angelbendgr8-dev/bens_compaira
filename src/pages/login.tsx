import CustomInput from "@/component/forms/Input";
import { useAuth } from "@/state/hooks/user.hook";
import {
  setCredentials,
  setData,
  setLoading,
} from "@/state/reducers/auth.reducer";
import { HStack, Image, Progress, useToast } from "@chakra-ui/react";
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  FormLabel,
  Link,
  FormControl,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PasswordInput from "@/component/forms/Password";
import { login } from "@/state/services/awscognito.service";
import { isEmpty } from "lodash";
import { useLoginActivityMutation } from "@/state/services/auth.service";

const schema = yup
  .object({
    username: yup.string().max(255).required("Email or Username is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  const { loading, error, token, data, user } = useAuth();
  const { next }: any = router.query;
  const { prevRoute } = useAuth();
  const [loginActivity] = useLoginActivityMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!isEmpty(data)) {
      dispatch(setLoading({ isLoading: false }));
      dispatch(setCredentials(data));
      dispatch(setData({ data: {} }));
      if (!isEmpty(prevRoute)) {
        router.replace(prevRoute);
      } else {
        router.replace("/dashboard");
      }
    }
  }, [data, dispatch, router, prevRoute]);
  useEffect(() => {
    if (error && error?.state === true) {
      toast({
        title: error.message,
        variant: "left-accent",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }
  }, [error, toast]);

  const handleLogin = async (data: any) => {
    const { username, password } = data;
    dispatch(setLoading({ isLoading: true }));

    const response = await login(username, password, dispatch);
    console.log(response, "response");
  };

  useEffect(() => {
    if (token) {
      console.log(token);
      const formData = {
        username: user?.name,
        userType: 1,
        activity: "login",
      };
      loginActivity({ name: user?.name, credentials: formData });
      if (!isEmpty(prevRoute)) {
        router.push(prevRoute);
      } else {
        //  router.push("/dashboard");
        next ? router.push(next) : router.push("/dashboard");
      }
    }
  }, [token, router, next, prevRoute, loginActivity, user]);
  return (
    <Box>
      <Container
        // maxW={"7xl"}
        maxW={"inherit"}
        minH={"100vh"}
        // bg={"red.400"}
        px={0}
        mx={0}
        // py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack
          flex={1}
          minH={"100vh"}
          alignSelf={"center"}
          justifyContent={"center"}
          flexDir={{ base: "column", md: "row" }}
          // spacing={{ base: 10, lg: 32 }}
        >
          <Stack
            bg={"white"}
            rounded={"xl"}
            flex={1}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
            justifyContent={"center"}
          >
            <Stack alignItems={"center"} mb={4}>
              <Image
                alt="logo"
                boxSize={"100px"}
                src={"assets/images/Marquee.png"}
              />
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Candidate Login
                <Text
                  as={"span"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                ></Text>
              </Heading>
            </Stack>
            <Box as={"form"} mt={4}>
              <Stack spacing={4}>
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <CustomInput
                      label={"Email or Username"}
                      id={"email"}
                      name="username"
                      errors={errors}
                      onChange={onChange}
                      value={value}
                      type={"text"}
                    />
                  )}
                  name="username"
                />
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PasswordInput
                      label={"Password"}
                      id={"password"}
                      name="password"
                      errors={errors}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                  name="password"
                />
              </Stack>

              <Button
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                isLoading={loading}
                py={6}
                onClick={handleSubmit(handleLogin, (error) =>
                  console.log(error)
                )}
                bg="primary.100"
                color={"white"}
                _hover={{
                  boxShadow: "xl",
                }}
              >
                Sign In
              </Button>
              <Stack
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
                flex={1}
              >
                <Link
                  alignItems={"flex-end"}
                  flex={1}
                  color="primary.100"
                  my={{
                    base: 6,
                    md: 4,
                  }}
                  onClick={() => router.replace("/forgotpassword")}
                >
                  Forgot Password
                </Link>
              </Stack>
              <HStack
                my={{
                  base: 4,
                }}
                flex={1}
                justifyContent={"center"}
              >
                <Text>{"Don't have an account?"} </Text>
                <Link
                  color="primary.100"
                  fontWeight={"bold"}
                  my={{
                    base: 6,
                    md: 4,
                  }}
                  onClick={() => router.replace("/register")}
                >
                  Register Here
                </Link>
              </HStack>
            </Box>
            form
          </Stack>
          <Flex
            display={{ base: "none", md: "block" }}
            // bg="blue.500"
            flex={1}
            alignItems={"center"}
          >
            <Image
              alt="logo"
              fit={"contain"}
              boxSize={"full"}
              src={"assets/images/signup.png"}
            />
          </Flex>
        </Stack>
      </Container>
      {/* <Blur
        position={"absolute"}
        top={-10}
        left={-10}
        style={{ filter: "blur(70px)" }}
      /> */}
    </Box>
  );
}
