import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Progress,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import ProfilePicture from "./ProfilePicture";
import { PhoneNumberInput } from "../forms/PhoneInput";
import StatefulMultiSelect from "../forms/MultiSelect";
import currencies from "../../utils/currencies.json";
import FormSwitch from "../forms/Switch";
import FileUpload from "../forms/FileUpload";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { notice, profession, profession2, role } from "@/utils/constants";
import Profession from "./Education";
import { useGetJobSectorMutation } from "@/state/services/miscellaneous.service";
import { debounce, size } from "lodash";
import CustomInput from "../forms/Input";
import SelectInput from "../forms/Select";
import { useProfile } from "@/state/hooks/profile.hook";
import { isEmpty } from "lodash";

const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
import {
  useGetFunctionalSkillsMutation,
  useGetTechnicalSkillsMutation,
  useSaveFunctionAreasMutation,
  useSaveFunctionalSkillMutation,
  useSaveJobsectorMutation,
  useSaveProfileDataMutation,
  useSaveTechnicalSkillMutation,
  useUploadCVMutation,
} from "@/state/services/profile.service";
import { useAuth } from "@/state/hooks/user.hook";
import { useRouter } from "next/router";
import {
  setCandidateFunctionAreas,
  setCandidateFunctionalSkills,
  setCandidateSectors,
  setCandidateTechnicalSkills,
  setProfileData,
} from "@/state/reducers/profile.reducer";
import { useDispatch } from "react-redux";

const SUPPORTED_FORMATS = ["application/pdf", "application/msword"];

const schema = yup
  .object({
    phone: yup.string().required("phone is required"),
    phoneCode: yup.string(),
    currency: yup.string().required("Currency is required"),
    expectedSalary: yup.string().required("Expected Salary is required"),
    country: yup.string().required("Please select a country"),

    experience: yup
      .number()
      .positive("Experience can only be positive number")
      .integer()
      .max(60, "60 is the maximum number of experience")
      .min(0, "0 is the minimum number of experience")
      .typeError("Experience must be a number"),

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
  })
  .required();

const cvValidator = yup.mixed().test(
  "format",
  (d) => `${d.path} "Please upload only .doc/.docx/.pdf formats"`,
  (value: any) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
);
export const nameSchema = yup
  .string()
  .matches(
    /^[a-zA-Z]+[-_ ]{0,1}[a-zA-Z]*$/g,
    "must not contain special chracters"
  );
const InformationTab = ({ changeTabs }: { changeTabs: any }) => {
  const [getJobSectors, { data }] = useGetJobSectorMutation();
  const [contactErrors, setContactErrors] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [functAreas, setFunctAreas] = useState<any>([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [saveFunctionAreas, { isLoading }] = useSaveFunctionAreasMutation();
  const [uploadCv, { isLoading: cvLoading }] = useUploadCVMutation();
  const dispatch = useDispatch();
  const [saveFunctionalSkills, { isLoading: functSaving }] =
    useSaveFunctionalSkillMutation();
  const [saveTechnicalSkills, { isLoading: techSaving }] =
    useSaveTechnicalSkillMutation();
  const [saveProfileData, { isLoading: profLoading }] =
    useSaveProfileDataMutation();
  const [saveSector, { isLoading: sectorLoading }] = useSaveJobsectorMutation();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedFunctAreas, setSelectedFunctAreas] = useState([]);
  const [radio, setRadio] = useState<string>("1");
  const [getFunctionalSkills] = useGetFunctionalSkillsMutation();
  const [getTechnicalSkills] = useGetTechnicalSkillsMutation();
  const [functionalSkills, setFunctionalSkills] = useState([]);
  const [technicalSkills, setTechnicalSkills] = useState([]);

  const [selectedCv, setSelectedCv] = useState("");
  const toast = useToast();
  const {
    profileData: profile,
    candidateSectors,
    functionAreas,
    candidateFunctionAreas,
    candidateFunctionalSkills,
    candidateTechnicalSkills,
  } = useProfile();

  const {
    control,
    setError,
    setValue,
    clearErrors,
    getValues,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
      phoneCode: profile?.phoneCode || "",
      country: profile?.country || "",
      sector: {},
      experience: profile?.experience || "",
      currency: profile.currency || "",
      expectedSalary: profile.expectedSalary || "",
      functionAreas: [],
      functionalSkills: [],
      technicalSkills: [],
      noticePeriod: "",
      roleType: "",
      canWork: profile?.canWork || "0",
      workStatus: profile?.workStatus || "working",
      jobRoleArea: profile?.jobRoleArea || "technical",
      cvFile: profile.cvFile,
      lookingForJob: profile?.lookingForJob || 0,
      contactByEmployer: profile?.contactByEmployer || 0,
      contactViaPhone: profile?.contactViaPhone || 0,
      contactViaEmail: profile?.contactViaEmail || 0,
      shareProfile: profile?.shareProfile || 0,
    },
    resolver: yupResolver(schema),
  });

  const processSector = debounce(
    async (val: any) => {
      let values: any = [];

      const tempArea = val.map((area: any) => area.id);
      if (size(tempArea) > 0) {
        setSelectedFunctAreas(tempArea);
      } else {
        setSelectedFunctAreas([]);
      }
    },
    1000,
    {
      trailing: true,
    }
  );

  const processCv = debounce(
    async (val: any) => {
      const { cvFile } = getValues();

      console.log(val);
      cvValidator
        .validate(cvFile)
        .then(() => {
          clearErrors("cvFile");
          if (cvFile) {
            const formData = new FormData();
            formData.append("document", cvFile);
            uploadCv({ username: user?.name, credentials: formData })
              .unwrap()
              .then((payload) => {
                dispatch(setProfileData({ data: payload }));
                toast({
                  title: "Cv has been updated successfully",
                  variant: "left-accent",
                  status: "success",
                  isClosable: true,
                  position: "top-left",
                });
              })
              .catch((error) => {
                console.log(error);
                toast({
                  title: "Cv update failed please try again",
                  variant: "left-accent",
                  status: "error",
                  isClosable: true,
                  position: "top-left",
                });
              });
            setSelectedCv(cvFile.name);
          }
        })
        .catch((e) => {
          console.log(e);
          toast({
            title: e.message,
            variant: "left-accent",
            status: "error",
            isClosable: true,
            position: "top-left",
          });
          setError("cvFile", {
            type: "custom",
            message: "Please upload only .jpg/.jpeg/.png formats",
          });
        });
    },
    1000,
    {
      trailing: true,
    }
  );
  const validateName = debounce(
    async (val: any, label) => {
      const { firstName, lastName } = getValues();
      const name = firstName ?? lastName;
      nameSchema
        .validate(val)
        .then(() => {
          console.log('cleared')
          clearErrors(label);
        })
        .catch((e) => {
          console.log(e);

          setError(label, {
            type: "custom",
            message: "Only letters(a-zA-Z) and - _ are allowed",
          });
        });
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
    getJobSectors({});
  }, [getJobSectors]);

  useEffect(() => {
    if (profile.roleType) {
      const sRole: any = role.filter((item) => item.value === profile.roleType);
      // console.log(sRole);
      setValue("roleType", sRole[0]);
    }
    if (profile.noticePeriod) {
      const snotice: any = notice.filter(
        (item) => item.value === profile.noticePeriod
      );
      setValue("noticePeriod", snotice[0]);
    }
  }, [profile, selectedSectors, functionalSkills, setValue]);

  useEffect(() => {
    if (functionAreas) {
      const options = functionAreas.map((area: any) => ({
        label: area.name,
        value: area.id,
        id: area.id,
      }));
      setFunctAreas(options);
    }
  }, [functionAreas]);

  useEffect(() => {
    if (candidateSectors) {
      // console.log(candidateSectors);
      let values: any = [];
      candidateSectors.map((sel: any) => {
        sectors.map((segment: any) => {
          if (segment.id === sel) {
            values.push({
              id: segment.value,
              label: segment.label,
              value: segment.value,
            });
          }
        });
      });

      setValue("sector", values);
      setSelectedSectors(values);
    }
  }, [candidateSectors, sectors, setValue]);

  useEffect(() => {
    if (size(selectedFunctAreas) > 0) {
      getFunctionalSkills(selectedFunctAreas)
        .unwrap()
        .then((payload: any) => {
          const options: any = payload.map((sector: any) => ({
            label: sector.name,
            value: sector.id,
            id: sector.id,
          }));
          setFunctionalSkills(options);
        });
      getTechnicalSkills(selectedFunctAreas)
        .unwrap()
        .then((payload: any) => {
          const options: any = payload.map((sector: any) => ({
            label: sector.name,
            value: sector.name,
            id: sector.id,
          }));
          setTechnicalSkills(options);
        });
    } else {
      setFunctionalSkills([]);
      setTechnicalSkills([]);
      setValue("functionalSkills", []);
      setValue("technicalSkills", []);
    }
  }, [selectedFunctAreas, getFunctionalSkills, getTechnicalSkills, setValue]);

  useEffect(() => {
    if (!isEmpty(candidateFunctionAreas)) {
      // console.log(candidateSectors);
      let values: any = [];
      candidateFunctionAreas?.map((sel: any) => {
        functAreas.map((segment: any) => {
          if (segment.id === sel) {
            values.push({
              id: segment.value,
              label: segment.label,
              value: segment.value,
            });
          }
        });
      });

      setValue("functionAreas", values);
      // setSelectedSectors(values);
    }
  }, [candidateFunctionAreas, functAreas, setValue]);

  useEffect(() => {
    if (!isEmpty(candidateFunctionAreas)) {
      getTechnicalSkills(candidateFunctionAreas)
        .unwrap()
        .then((payload: any) => {
          const options: any = payload.map((sector: any) => ({
            label: sector.name,
            value: sector.id,
            id: sector.id,
          }));
          setTechnicalSkills(options);
          let values: any = [];
          candidateTechnicalSkills?.map((sel: any) => {
            payload.map((segment: any) => {
              if (segment.id === sel) {
                values.push({
                  id: segment.id,
                  label: segment.name,
                  value: segment.name,
                });
              }
            });
          });

          setValue("technicalSkills", values);
        });
    }
  }, [
    candidateTechnicalSkills,
    getTechnicalSkills,
    setValue,
    candidateFunctionAreas,
  ]);

  useEffect(() => {
    if (!isEmpty(candidateFunctionAreas)) {
      getFunctionalSkills(candidateFunctionAreas)
        .unwrap()
        .then((payload: any) => {
          const options: any = payload.map((sector: any) => ({
            label: sector.name,
            value: sector.id,
            id: sector.id,
          }));
          setFunctionalSkills(options);
          let values: any = [];
          candidateFunctionalSkills?.map((sel: any) => {
            payload.map((segment: any) => {
              if (segment.id === sel) {
                values.push({
                  id: segment.id,
                  label: segment.name,
                  value: segment.name,
                });
              }
            });
          });
          setValue("functionalSkills", values);
        });
    }
  }, [
    candidateFunctionalSkills,
    getFunctionalSkills,
    setValue,
    candidateFunctionAreas,
  ]);

  const checkContact = async (contact: boolean) => {
    // console.log(contact);
    const { contactViaEmail, contactViaPhone } = getValues();
    if (!contactViaEmail && !contactViaPhone) {
      setContactErrors(true);
    } else {
      setContactErrors(false);
    }
  };
  const updateDocument = (data: any) => {
    const {
      functionalSkills,
      technicalSkills,
      functionAreas,
      sector,
      ...rest
    } = data;
    rest.roleType = rest.roleType.value;
    rest.noticePeriod = rest.noticePeriod.value;
    rest.lookingForJob = rest.lookingForJob ? 1 : 0;
    rest.contactByEmployer = rest.contactByEmployer ? 1 : 0;
    rest.contactViaPhone = rest.contactViaPhone ? 1 : 0;
    rest.contactViaEmail = rest.contactViaEmail ? 1 : 0;
    rest.shareProfile = rest.shareProfile ? 1 : 0;
    const SfunctionalSkills = data.functionalSkills.map(
      (skill: any) => skill.id
    );
    const {
      technicalSkills: isDirtytechSkills,
      functionAreas: isDirtyFunctionAreas,
      sector: isDirtySectors,
      functionalSkills: isDirtyFunctSkills,
      ...others
    } = dirtyFields;
    const StechnicalSkills = data.technicalSkills.map((skill: any) => skill.id);
    const Ssector: any = data.sector.map((skill: any) => skill.id);
    const SfunctionAreas = data.functionAreas.map((skill: any) => skill.id);
    console.log(others);
    if (isDirtyFunctionAreas) {
      saveFunctionAreas({ username: user?.name, credentials: SfunctionAreas })
        .unwrap()
        .then((payload: any) => {
          const newSkill = payload.map((skill: any) => skill.functionalAreaId);
          dispatch(setCandidateFunctionAreas(newSkill));
        })
        .catch((err) => {});
    }
    if (isDirtytechSkills) {
      saveTechnicalSkills({
        username: user?.name,
        credentials: StechnicalSkills,
      })
        .unwrap()
        .then((payload: any) => {
          const newSkill = payload.map((skill: any) => skill.technicalSkillId);
          dispatch(setCandidateTechnicalSkills(newSkill));
        })
        .catch((err) => {});
    }
    if (isDirtyFunctSkills) {
      saveFunctionalSkills({
        username: user?.name,
        credentials: SfunctionalSkills,
      })
        .unwrap()
        .then((payload: any) => {
          const newSkill = payload.map((skill: any) => skill.functionalSkillId);
          dispatch(setCandidateFunctionalSkills(newSkill));
        })
        .catch((err) => {});
    }
    if (isDirtySectors) {
      saveSector({ username: user?.name, credentials: Ssector })
        .unwrap()
        .then((payload: any) => {
          const sectors = payload.map((sector: any) => sector.jobSectorId);
          dispatch(setCandidateSectors(sectors));
        })
        .catch((err) => {});
    }
    if (!isEmpty(others)) {
      saveProfileData({ username: user?.name, credentials: rest })
        .unwrap()
        .then((payload: any) => dispatch(setProfileData({ data: payload })))
        .catch((err) => {});
    }

    //  toast({
    //    title: "Registration completed successfully",
    //    variant: "left-accent",
    //    status: "success",
    //    isClosable: true,
    //    position: "top-left",
    //  });
    changeTabs(1);
  };


  return (
    <VStack>
      <Flex
        dir="row"
        align="center"
        bg="secondary.100"
        py={1}
        pos={"relative"}
        justify="center"
        width="100%"
      >
        {true && <Progress size="xs" isIndeterminate />}
        <Icon mr={2} fontSize="18" color={"black"} as={BiTimeFive} />
        <Text>Total time to complete 3 minutes</Text>
      </Flex>

      <Flex
        flexDir={{
          base: "column",
          sm: "column",
          lg: "row",
        }}
        width="100%"
      >
        <Box
          borderRightWidth={1}
          width={{
            base: "100%",
            sm: "100%",
            lg: "50%",
          }}
        >
          <ProfilePicture />
          <Box as={"form"} px={4} mt={4}>
            <Stack spacing={4}>
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label={
                      "First Name"
                    }
                    id={"firstName"}
                    name="firstName"
                    errors={errors}
                    onChange={(input: any) => {
                      onChange(input);
                      validateName(input.target.value, "firstName");
                    }}
                    value={value}
                    type={"text"}
                  />
                )}
                name="firstName"
              />
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label={
                      "Last Name"
                    }
                    id={"lastName"}
                    name="lastName"
                    errors={errors}
                    onChange={(input: any) => {
                      onChange(input);
                      validateName(input.target.value, "lastName");
                    }}
                    value={value}
                    type={"text"}
                  />
                )}
                name="lastName"
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
                    value={value}
                    code={profile.phoneCode}
                    couName={getValues("country")}
                    onChange={(number) => {
                      const { code, phone, countryName } = number;
                      setValue("country", countryName);
                      setValue("phoneCode", code);
                      setValue("phone", phone);
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
                render={({ field: { onChange, onBlur, ref, value } }) => (
                  <StatefulMultiSelect
                    options={role}
                    isMulti={false}
                    errors={errors}
                    name={"role"}
                    onBlur={onBlur}
                    value={value}
                    label="Role"
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                  />
                )}
                name="roleType"
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
                    onBlur={onBlur}
                    //@ts-ignore
                    isDisabled={value.length === 3}
                    value={value}
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
                render={({ field: { onChange, onBlur, ref, value } }) => (
                  <StatefulMultiSelect
                    options={functAreas}
                    errors={errors}
                    onBlur={onBlur}
                    isDisabled={value.length === 3}
                    value={value}
                    name={"functionAreas"}
                    label="Function Area (choose up to 3)"
                    onChange={(value: any) => {
                      onChange(value);
                      processSector(value);
                    }}
                  />
                )}
                name="functionAreas"
              />

              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, ref, value } }) => (
                  <Box>
                    <StatefulMultiSelect
                      options={functionalSkills ?? []}
                      errors={errors}
                      name={"sector"}
                      onBlur={onBlur}
                      value={value}
                      label="Functional Skills"
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                    />
                  </Box>
                )}
                name="functionalSkills"
              />
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, ref, value } }) => (
                  <StatefulMultiSelect
                    options={technicalSkills ?? []}
                    errors={errors}
                    name={"technicalSkills"}
                    onBlur={onBlur}
                    value={value}
                    label="Technical Skills"
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                  />
                )}
                name="technicalSkills"
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
                    type={"number"}
                  />
                )}
                name="experience"
              />

              <HStack mb={2}>
                <Box w={"40%"}>
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <SelectInput
                        label={"Currency"}
                        id={"currency"}
                        name="currency"
                        errors={errors}
                        onChange={(input: any) => {
                          console.log(input);
                          onChange(input);
                        }}
                        value={value}
                        options={currencies}
                      />
                    )}
                    name="currency"
                  />
                </Box>
                <Box w={"60%"}>
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <CustomInput
                        label={"Expected Enumeration per anum"}
                        id={"expectedSalary"}
                        name="expectedSalary"
                        errors={errors}
                        onChange={(input: any) => {
                          onChange(input);
                        }}
                        labelStyle={{ fontSize: 14 }}
                        value={value}
                        type={"number"}
                      />
                    )}
                    name="expectedSalary"
                  />
                </Box>
              </HStack>
            </Stack>
          </Box>
        </Box>
        <Box
          px={4}
          width={{
            base: "100%",
            sm: "100%",
            lg: "50%",
          }}
        >
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, ref, value } }) => (
              <StatefulMultiSelect
                options={notice}
                isMulti={false}
                errors={errors}
                name={"noticePeriod"}
                onBlur={onBlur}
                value={value}
                label="Notice Period"
                onChange={(value: any) => {
                  onChange(value);
                }}
              />
            )}
            name="noticePeriod"
          />
          <Text my={4} fontWeight={"500"}>
            Please choose the appropriate response for the following sentence.
          </Text>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, value } }) => (
              <RadioGroup onChange={onChange} value={value}>
                <Stack direction="column">
                  <Radio value="1">I am a citizen of this country.</Radio>
                  <Radio value="2">I have the relevant visa.</Radio>
                </Stack>
              </RadioGroup>
            )}
            name="canWork"
          />
          <Box>
            <Text my={8}>{"I'm"}</Text>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, value } }) => (
                <Profession
                  onChange={onChange}
                  selected={value}
                  options={profession}
                />
              )}
              name="workStatus"
            />
          </Box>
          <Box mb={12}>
            <Text my={8}>{"I'm"}</Text>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, value } }) => (
                <Profession
                  onChange={onChange}
                  selected={value}
                  options={profession2}
                />
              )}
              name="jobRoleArea"
            />
          </Box>
          <Box w="50%">
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, value } }) => (
                <FileUpload
                  name="cvFile"
                  changed={(e: any) => {
                    console.log(e);
                    onChange(e);
                    processCv(e);
                  }}
                  errors={errors}
                  isLoading={cvLoading}
                  acceptedFileTypes=".doc, .docx, .pdf"
                  isRequired={true}
                  control={control}
                >
                  Load only .doc/.docx/.pdf file
                </FileUpload>
              )}
              name="cvFile"
            />
          </Box>
          <Box mb={10}>
            <Link
              color="primary.100"
              fontWeight={"bold"}
              mt={{
                base: 6,
                md: 4,
              }}
              href={`${BASE_URL}/${profile?.cvFile}`}
              target="_blank"
              download
            >
              Download CV
            </Link>
          </Box>

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
        </Box>
      </Flex>
      <Flex my={6} width="100%" dir="row" justifyContent="center" gap={6}>
        <Button
          color="blackAlpha.500"
          textTransform={"uppercase"}
          w={{
            base: "50%",
            md: "40%",
            lg: "30%",
          }}
          fontWeight={"500"}
          py={6}
          bg="#B0B0B0"
        >
          Previous
        </Button>
        <Button
          w={{
            base: "50%",
            md: "40%",
            lg: "30%",
          }}
          bg="#32a7e1"
          isLoading={
            isLoading ||
            functSaving ||
            profLoading ||
            techSaving ||
            sectorLoading
          }
          onClick={handleSubmit(updateDocument, (error) => console.log(error))}
          fontWeight={"500"}
          py={6}
          _hover={{
            bg: "#1B76D2",
          }}
          color="white"
          textTransform={"uppercase"}
        >
          Save & continue
        </Button>
      </Flex>
    </VStack>
  );
};

export default InformationTab;
