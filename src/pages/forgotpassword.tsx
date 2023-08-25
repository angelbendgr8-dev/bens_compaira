import { HStack, Image, useToast } from "@chakra-ui/react";
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
import { debounce } from "lodash";

import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "@/component/forms/Input";
import { useRouter } from "next/navigation";
import { useCheckEmailMutation } from "@/state/services/miscellaneous.service";
import { useEffect, useState } from "react";
import { forgotPassword } from "@/state/services/awscognito.service";
import { useDispatch } from "react-redux";
import { setData, setEmail, setLoading } from "@/state/reducers/auth.reducer";
import { useAuth } from "@/state/hooks/user.hook";
import {isEmpty} from 'lodash';

const schema = yup
  .object({
    email: yup
      .string()
      .email("Must be a valid Email")
      .required("Email  is required"),
  })
  .required();

const ForgotPassword = () => {
  const toast = useToast();
  const router = useRouter();
  const [checkEmail, { isLoading }] = useCheckEmailMutation();
  const { loading, error, data } = useAuth();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);

  const {
    control,
    getValues,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!isEmpty(data)) {
      const {email} = getValues();
      dispatch(setLoading({ isLoading: false }));
      dispatch(setData({ data: {} }));
      dispatch(setEmail({email: email}));
      router.replace(`/resetpassword`)
    }
  }, [data,dispatch,router, getValues]);
  useEffect(() => {
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
  }, [error,toast,dispatch]);

  const debouncedEmailValidation = debounce(
    async (val) => {
      const data: any = await checkEmail({ email: val });
      const { data: response } = data;
      if (response && response.length === 0) {
        setError("email", {
          type: "custom",
          message: "Email does not exist",
        });
        return;
      }
      clearErrors("email");
      setDisabled(false);
    },
    1000,
    {
      trailing: true,
    }
  );
  const sendEmail = async (data: any) => {
    dispatch(setLoading({ isLoading: true }));
    const { email } = data;
    const response = await forgotPassword(email, dispatch);
    if (response) {
      console.log(response, "response");
    }
    // router.push("/resetpassword");
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
            <Stack alignItems={"center"} mb={4}>
              <Image
                alt="logo"
                boxSize={"100px"}
                src={"assets/images/Marquee.png"}
              />
              <Heading
                color={"primary.100"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Reset password
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
                      label={"Email address"}
                      id={"email"}
                      name="email"
                      errors={errors}
                      onChange={(input: any) => {
                        onChange(input);
                        debouncedEmailValidation(input.target.value);
                      }}
                      value={value}
                      type={"email"}
                    />
                  )}
                  name="email"
                />
              </Stack>

              <Button
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                py={6}
                isDisabled={disabled}
                isLoading={loading}
                onClick={handleSubmit(sendEmail)}
                bg="primary.100"
                color={"white"}
                _hover={{
                  boxShadow: "xl",
                }}
              >
                Submit
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
                  onClick={() => router.replace("/login")}
                >
                  Back to login
                </Link>
              </Stack>
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
export default ForgotPassword;
