import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Button,
  Link,
  Checkbox,
  HStack,
  Icon,
  Image,
  useToast,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { PhoneNumberInput } from "@/component/forms/PhoneInput";
import _, { debounce } from "lodash";
const SUPPORTED_FORMATS = ["application/pdf", "application/msword"];

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "yup-phone";
import FileUpload from "@/component/forms/FileUpload";
import FormSwitch from "@/component/forms/Switch";
import StatefulMultiSelect from "@/component/forms/MultiSelect";
import { useRouter } from "next/router";
import CustomInput from "@/component/forms/Input";
import PasswordInput from "@/component/forms/Password";
import { IoMdClose } from "react-icons/io";
import { BsCheck } from "react-icons/bs";
import {
  useCheckEmailMutation,
  useCheckUsernameMutation,
  useGetJobSectorMutation,
  useGetSectorMutation,
} from "@/state/services/miscellaneous.service";
import {
  useCreateCandidateMutation,
  useSetCandidateJobSectorMutation,
  useUpdateCandidateReferralMutation,
  useUploadCandidateImageMutation,
} from "@/state/services/auth.service";
import { useAuth } from "@/state/hooks/user.hook";
import { setLoading } from "@/state/reducers/auth.reducer";
import { useDispatch } from "react-redux";
import { register } from "@/state/services/awscognito.service";
import { isEmpty } from "lodash";
import ConfirmModal from "@/component/ConfirmModal";

const schema = yup
  .object({
    email: yup
      .string()
      .email("please use a valid email")
      .required("Email is required"),
    username: yup.string().max(100).required("Username is required"),
    phone: yup.string().required("phone is required"),
    phoneCode: yup.string(),
    country: yup.string().required("Please select a country"),
    cvFile: yup
      .mixed()
      .required("A file is required")
      .test(
        "format",
        "Please upload only .doc/.docx/.pdf formats",
        (value: any) =>
          !value || (value && SUPPORTED_FORMATS.includes(value.type))
      ),
    experience: yup
      .number()
      .positive("Experience can only be positive number")
      .integer()
      .max(60, "60 is the maximum number of experience")
      .min(0, "0 is the minimum number of experience")
      .typeError("Experience must be a number"),
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
    confirm: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Password Confirmation is required"),
    lookingForJob: yup.boolean(),
    contactByEmployer: yup.boolean(),
    contactViaEmail: yup.boolean(),
    contactViaPhone: yup
      .boolean()
      .when("contactViaEmail", (contactViaEmail, schema) => {
        if (!contactViaEmail)
          return schema.required("Must enter email address");
        return schema;
      }),
    shareProfile: yup.boolean(),
    terms: yup.boolean(),
    sector: yup
      .array()
      .min(1, "at least 1 sector must be selected")
      .typeError("minimum of 1 sector must be selected"),
  })
  .required();

export const nameSchema = yup
  .string()
  .matches(
    /^[a-zA-Z0-9]+[-_ ]{0,1}[a-zA-Z]*$/g,
    "must not contain special chracters"
  );

const Register = () => {
  const router = useRouter();
  const { referralId } = router.query;

  const toast = useToast();
  const { loading } = useAuth();
  const dispatch = useDispatch();
  // Endpoints
  const [getJobSectors, { data }] = useGetJobSectorMutation();
  const [getSector, { data: sectorData }] = useGetSectorMutation();
  const [jobSector, setJobSector] = useState<any>([]);
  const [Ierrors, setErrors] = useState<Array<string>>([]);
  const [contactErrors, setContactErrors] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [refSector, setRefSector] = useState<any>([]);
  const [checkEmail, { isLoading }] = useCheckEmailMutation();
  const [checkUsername, { isLoading: userLoading }] =
    useCheckUsernameMutation();
  const [complete, setComplete] = useState(false)

  // States
  const [sectors, setSectors] = useState<any>([]);
  const [pErrors] = useState<Array<string>>([
    "Must Contain 8 Characters",
    "One Uppercase",
    "One Lowercase",
    "One Number",
    "At least 1 Symbol",
  ]);

  const [createCandidate, { error: createError }] =
    useCreateCandidateMutation();
  const [uploadCandidate, { error: uploadError }] =
    useUploadCandidateImageMutation();
  const [setCandidateJobSector, { error: sectorError }] =
    useSetCandidateJobSectorMutation();
  const [updateReferral, { error: referralError }] =
    useUpdateCandidateReferralMutation();
  const {
    control,
    setError,
    setValue,
    clearErrors,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
      username: "",
      phone: "",
      phoneCode: "",
      country: "",
      sector: refSector,
      experience: "",
      cvFile: {},
      lookingForJob: true,
      contactByEmployer: true,
      contactViaPhone: true,
      contactViaEmail: true,
      shareProfile: false,
      terms: false,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getJobSectors({});
  }, [getJobSectors]);
  useEffect(() => {
    if (referralId) {
      getSector({ vacancyId: referralId![0] });
    }
  }, [referralId, getSector]);

  useEffect(() => {
    if (data) {
      const options = data.map((sector: any) => ({
        label: sector.value,
        value: sector.id,
        id: sector.id,
      }));
      setSectors(options);
    }
  }, [data]);
  useEffect(() => {
    //console.log(jobSector, "jobsector");
  }, [refSector, jobSector]);

  // Error handlers
  useEffect(() => {
    if (createError) {
      //console.log(createError);
    }
  }, [createError]);
  useEffect(() => {
    if (uploadError) {
      //console.log(uploadError);
    }
  }, [uploadError]);
  useEffect(() => {
    if (sectorError) {
      //console.log(sectorError);
    }
  }, [sectorError]);
  useEffect(() => {
    if (referralError) {
      //console.log(referralError);
    }
  }, [referralError]);

  useEffect(() => {
    if (sectorData) {
      //console.log(sectorData, "sectorData");
      if (referralId) {
        // //console.log(jobSector.jobSector);
        const referralSector = data.filter(
          (item: any) => item.name == sectorData[0].jobSector
        );
        setJobSector([referralSector[0].id]);
        const ref = {
          label: referralSector[0].value,
          value: referralSector[0].id,
          id: referralSector[0].id,
        };
        //console.log(referralSector, "ref");
        //@ts-ignore
        setRefSector(ref);
        //@ts-ignore
        setValue("sector", [ref]);
      }
    }
  }, [sectorData, data, referralId, setValue]);

  // const processSector = debounce(
  //   async (val: any) => {
  //     let values: any = [];
  //     val.map((sel: any) => {
  //       sectors.map((segment: any) => {
  //         if (segment.value === sel.value) {
  //           values.push(segment.id);
  //         }
  //       });
  //     });
  //     //console.log(values);
  //     setSelectedSectors(values);
  //     if (values.length === 0) {
  //       setError("sector", {
  //         type: "custom",
  //         message: "you must select at least one sector",
  //       });
  //     } else {
  //       clearErrors("sector");
  //     }
  //   },
  //   1000,
  //   {
  //     trailing: true,
  //   }
  // );
  const validateName = async (val: any) => {
    const { username } = getValues();

    nameSchema
      .validate(username)
      .then(() => {
        clearErrors("username");
      })
      .catch((e) => {
        console.log(e);

        setError("username", {
          type: "custom",
          message: "only letters(a-zA-Z) and - _ are allowed",
        });
      });
  };

  const formatPasswordError = async (password: string) => {
    //console.log(password);
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

  const checkContact = async (contact: boolean) => {
    // //console.log(contact);
    const { contactViaEmail, contactViaPhone } = getValues();
    if (!contactViaEmail && !contactViaPhone) {
      setContactErrors(true);
    } else {
      setContactErrors(false);
    }
  };
  const debouncedEmailValidation = debounce(
    async (val) => {
      const data: any = await checkEmail({ email: val });
      const { data: response } = data;
      if (response && response.length > 0) {
        setError("email", {
          type: "custom",
          message: "Email already exists",
        });
      } else {
        clearErrors("email");
      }
    },
    1000,
    {
      trailing: true,
    }
  );
  const debouncedExperiencelValidation = debounce(
    async (val) => {
      if (val && (val < 0 || val > 60)) {
        setError("experience", {
          type: "custom",
          message: "Expereince must be between 0 and 60",
        });
      } else {
        clearErrors("experience");
      }
    },
    3000,
    {
      trailing: true,
    }
  );
  const debouncedUsernameValidation = debounce(
    async (val) => {
      const data: any = await checkUsername({ username: val });
      const { data: response } = data;
      if (response && response.length > 0) {
        setError("username", {
          type: "custom",
          message: "Username already exists",
        });
      } else {
        validateName(val);
      }
    },
    1000,
    {
      trailing: true,
    }
  );
  const onSubmit = async (data: any) => {
    dispatch(setLoading({ isLoading: true }));
    const formData = new FormData();
    formData.append("document", data.cvFile);
    const { cvFile, password, sector, confirm, ...rest } = data;
    rest.sectors = sector.map((sector: any) => sector.id);
    rest.jobRoleArea = "technical";
    rest.workStatus = "working";
    rest.cvFile = "";

    try {
      register(rest.username, rest.email, password).then((res) => {});
      await createCandidate(rest);
      await uploadCandidate({ username: rest.username, formData }).unwrap();
      if (!isEmpty(referralId) && !isEmpty(referralId![0]) && !isEmpty(referralId![1])) {
        await setCandidateJobSector({
          username: rest.username,
          credentials: [refSector.id],
        }).unwrap();
        await updateReferral({
          vacancyId: referralId![0],
          source: referralId![1],
          credentials: { candidate: rest.username },
        }).unwrap();
      } else if (!isEmpty(referralId)) {
        await setCandidateJobSector({
          username: rest.username,
          credentials: [refSector.id],
        }).unwrap();
        await updateReferral({
          vacancyId: referralId![0],
          credentials: { candidate: rest.username },
        }).unwrap();
      } else {
        await setCandidateJobSector({
          username: rest.username,
          credentials: rest.sectors,
        }).unwrap();
      }
      toast({
        title: "Registration completed successfully",
        variant: "left-accent",
        status: "success",
        isClosable: true,
        position: "top-left",
      });
      dispatch(setLoading({ isLoading: false }));
      setComplete(true);
    } catch (error: any) {
      dispatch(setLoading({ isLoading: false }));
      toast({
        title: error.message,
        variant: "left-accent",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }
  };
  const gotoLogin = () => {
    setComplete(false);
    router.push('/login');
  }

  return (
    <Box>
      <Container maxW={"inherit"} minH={"100vh"} px={0} mx={0}>

        <ConfirmModal isOpen={complete} close={gotoLogin} />
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
                // boxSize={"200px"}
                src={"/assets/images/app_logo.png"}
              />
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Candidate Registration
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
                      label={"Email Address"}
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

                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, onBlur, ref, value } }) => (
                    <StatefulMultiSelect
                      options={sectors}
                      errors={errors}
                      name={"sector"}
                      // selected={value}
                      // limit={3}
                      onBlur={onBlur}
                      value={value}
                      isDisabled={value.length === 3}
                      label="Sector (choose up to 3)"
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                    />
                  )}
                  name={"sector"}
                />

                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <CustomInput
                      label={"Username"}
                      id={"username"}
                      name="username"
                      errors={errors}
                      onChange={(input: any) => {
                        onChange(input);
                        debouncedUsernameValidation(input.target.value);
                      }}
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
                    <PhoneNumberInput
                      name="phone"
                      errors={errors}
                      onChange={(number) => {
                        const { code, phone, countryName } = number;
                        setValue("country", countryName);
                        setValue("phoneCode", code);
                        setValue("phone", phone);
                        if (countryName) {
                          clearErrors("country");
                        }
                        if (countryName && phone) {
                          clearErrors("phone");
                        }
                      }}
                    />
                  )}
                  name="phone"
                />
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <CustomInput
                      label={"Experience (0 - 60 years)"}
                      id={"experience"}
                      name="experience"
                      errors={errors}
                      onChange={(input: any) => {
                        onChange(input);
                        debouncedExperiencelValidation(input.target.value);
                      }}
                      value={value}
                      type={"text"}
                    />
                  )}
                  name="experience"
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
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <FileUpload
                      name="cvFile"
                      changed={onChange}
                      errors={errors}
                      acceptedFileTypes=".doc, .docx, .pdf"
                      isRequired={true}
                      control={control}
                    >
                      Load only .doc/.docx/.pdf file
                    </FileUpload>
                  )}
                  name="cvFile"
                />
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <FormSwitch
                      onChange={onChange}
                      value={value}
                      id="jobSearch"
                      label="I am looking for a job"
                    />
                  )}
                  name="lookingForJob"
                />
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <FormSwitch
                      onChange={(input: any) => {
                        onChange(input);
                        checkContact(input.target.checked);
                      }}
                      value={value}
                      id="phoneContact"
                      label="I maybe contacted by phone"
                    />
                  )}
                  name="contactViaPhone"
                />
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <FormSwitch
                      onChange={(input: any) => {
                        onChange(input);
                        checkContact(input.target.checked);
                      }}
                      value={value}
                      id="emailContact"
                      label="I may be contacted through email"
                    />
                  )}
                  name="contactViaEmail"
                />
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <FormSwitch
                      onChange={onChange}
                      value={value}
                      id="receiveMessage"
                      label="I agree to receive message from employer"
                    />
                  )}
                  name="contactByEmployer"
                />
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <FormSwitch
                      onChange={onChange}
                      value={value}
                      id="suitable"
                      label="I agree that my profile can be presented to suitable employer for suitable jobs."
                    />
                  )}
                  name="shareProfile"
                />
                {contactErrors && (
                  <Text color={"red.600"}>
                    Either phone or email contact options must be selected
                  </Text>
                )}
              </Stack>

              {/* <Stack my={8}>
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox checked={value} defaultChecked>
                      Accept Terms and conditions
                    </Checkbox>
                  )}
                  name="terms"
                />
              </Stack> */}

              <Button
                fontFamily={"heading"}
                mt={8}
                isDisabled={contactErrors}
                isLoading={loading}
                w={"full"}
                onClick={handleSubmit(onSubmit)}
                py={6}
                bg="primary.100"
                color={"white"}
                _hover={{
                  boxShadow: "xl",
                }}
              >
                Sign Up
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
            // bg="white"
            flex={1}
            alignItems={"center"}
          >
            <Image
              alt="logo"
              fit={"contain"}
              boxSize={"full"}
              src={"/assets/images/signup.png"}
            />
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default Register;
