import { HStack, Icon, Image, useToast } from "@chakra-ui/react";
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Button,
  Link,
} from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";
import { BsCheck } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "yup-phone";
import _ from "lodash";
import CustomInput from "@/component/forms/Input";
import PasswordInput from "@/component/forms/Password";
import { useRouter } from "next/router";
import { useAuth } from "@/state/hooks/user.hook";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { setData, setLoading } from "@/state/reducers/auth.reducer";
import { resetPassword } from "@/state/services/awscognito.service";

const schema = yup
  .object({
    code: yup.string().required("Verification code  is required"),
    password: yup
      .string()
      .required(
        "Password is required and Password must be at least 8 characters long"
      )
      .matches(/^(?=.*[A-Z])/, "One Uppercase")
      .matches(/^(?=.*[a-z])/, "One Lowercase")
      .matches(/^(?=.*[0-9])/, "One Number")
      .matches(/^(?=.*[!@#$%^&*])/, "At least 1 Symbol")
      .matches(/^(?=.{8,})/, "Must Contain 8 Characters"),
    confirm: yup.string().oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

const ResetPassword = () => {
  const router = useRouter();
  const { loading, error, token, data, resetEmail } = useAuth();
  const toast = useToast();
  const dispatch = useDispatch();
  console.log(resetEmail);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      password: "",
      confirm: "",
    },
    resolver: yupResolver(schema),
  });
  const [pErrors] = useState<Array<string>>([
    "Must Contain 8 Characters",
    "One Uppercase",
    "One Lowercase",
    "One Number",
    "At least 1 Symbol",
  ]);
  const [Ierrors, setErrors] = useState<Array<string>>([]);

  const formatPasswordError = async (password: string) => {
    console.log(password);
    schema
      .validate(
        {
          password,
        },
        { abortEarly: false }
      )
      .then(() => setErrors([]))
      .catch((e) => {
        setErrors(e.errors);
      });
  };

  const inputRef = useRef();

  useEffect(() => {
    if (!isEmpty(data)) {
      dispatch(setLoading({ isLoading: false }));
      dispatch(setData({ data: {} }));
      toast({
        title: "Password reset successfully",
        variant: "left-accent",
        status: "success",
        isClosable: true,
        position: "top-left",
      });
      router.replace("/login");
    }
  }, [data, router, dispatch, toast]);
  useEffect(() => {
    console.log(error);
    if (error && error?.state === true) {
      toast({
        title: error.message,
        variant: "left-accent",
        status: "error",
        isClosable: true,
        position: "top-left",
      });

      dispatch(setLoading({ isLoading: false }));
    }
  }, [error, dispatch, toast]);

  const onSubmit = async (data: any) => {
    const { code, password } = data;
    dispatch(setLoading({ isLoading: true }));
    console.log(resetEmail);
    const response = await resetPassword(resetEmail, code, password, dispatch);
  };

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
            <Stack alignItems={"center"}>
              <Image
                alt="logo"
                boxSize={"100px"}
                src={"assets/images/Marquee.png"}
              />
              <Heading
                color={"primary.100"}
                lineHeight={1.1}
                fontSize={{ base: "xl", sm: "3xl", md: "4xl" }}
              >
                Reset Password
              </Heading>
              <Text my={2} as={"span"} color="muted.100" bgClip="text">
                We have sent verification code to a***@g***, Please enter the
                code, and choose your new password{" "}
              </Text>
            </Stack>
            <Box as={"form"}>
              <Stack spacing={4}>
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <CustomInput
                      label={"Verification Code"}
                      id={"code"}
                      name="Code"
                      errors={errors}
                      onChange={onChange}
                      value={value}
                      type={"number"}
                    />
                  )}
                  name="code"
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
                      validate={formatPasswordError}
                      onChange={(input: any) => {
                        onChange(input);
                      }}
                      value={value}
                    />
                  )}
                  name="password"
                />
                <Box ml={"1"} display={"flex"} flexDir={"column"}>
                  {_.size(Ierrors) > 1 ? (
                    pErrors.map((item, index) => (
                      <Box
                        key={index}
                        display={"flex"}
                        flexDirection="row"
                        justifyContent={"flex-start"}
                        alignItems="center"
                      >
                        {Ierrors.includes(item) ? (
                          <Icon
                            as={IoMdClose}
                            size={5}
                            borderWidth={1}
                            borderColor={"red.600"}
                            rounded="full"
                            mr="2"
                            color="red.600"
                          />
                        ) : (
                          <Icon
                            as={BsCheck}
                            boxSize={5}
                            borderWidth={1}
                            borderColor={"green.900"}
                            rounded="full"
                            mr="2"
                            color="green.900"
                          />
                        )}
                        <Text
                          color={
                            Ierrors.includes(item) ? "red.600" : "green.900"
                          }
                        >
                          {item}
                        </Text>
                      </Box>
                    ))
                  ) : (
                    <Box bg={"red.300"} />
                  )}
                </Box>
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PasswordInput
                      label={"Password"}
                      id={"confirm"}
                      name="confirm"
                      errors={errors}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                  name="confirm"
                />
              </Stack>

              <Button
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                isLoading={loading}
                onClick={handleSubmit(onSubmit)}
                py={6}
                bg="primary.100"
                color={"white"}
                _hover={{
                  boxShadow: "xl",
                }}
              >
                Reset Password
              </Button>
              <HStack
                my={{
                  base: 4,
                }}
                flex={1}
                justifyContent={"center"}
              >
                <Text>Already have an account? </Text>{" "}
                <Link
                  color="primary.100"
                  fontWeight={"bold"}
                  my={{
                    base: 6,
                    md: 4,
                  }}
                  onClick={() => router.replace("/login")}
                >
                  Login Here
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
};

export default ResetPassword;
