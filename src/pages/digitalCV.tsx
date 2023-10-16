// components/Dropdowns.tsx
import AppLayouts from "@/layouts/AppLayouts";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import StatefulMultiSelect from "../component/forms/MultiSelect";
import { AspectRatio } from "@chakra-ui/react";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useGenerateDigitalCvMutation,
  useGetAllHobbiesQuery,
  useGetAllLanguagesQuery,
  useGetHobbiesDataQuery,
  useSaveDigitalCvInfoMutation,
  useGetDigitalCvInfoMutation,
  useGetUserEducationMutation,
  useGetUserExperienceMutation,
} from "../state/services/digitalcv.service";
import { useAuth } from "@/state/hooks/user.hook";
import { isEmpty } from "lodash";
import {
  useGetCandidateFunctionAreasMutation,
  useGetCandidateFunctionalSkillsMutation,
  useGetCandidateTechnicalSkillsMutation,
  useGetFunctionAreasQuery,
  useGetTechnicalSkillsMutation,
} from "@/state/services/profile.service";
import CustomInput from "@/component/forms/Input";
import { useProfile } from "@/state/hooks/profile.hook";
import { useDispatch } from "react-redux";
import {
  setCandidateFunctionAreas,
  setCandidateTechnicalSkills,
  setFunctionAreas,
  setValuesData,
} from "@/state/reducers/profile.reducer";
import { setCvInfo } from "../state/reducers/digitalcv.reducer";
import { useRouter } from "next/router";

const edudata = [
  "ACTIVITIES. AND HOBBIES ",
  "•  Volunteered  in  'Bhumi  -  Non-Governmental  Organization'  by  teaching  poor  children  the  use  of ",
  "computers from Sept 2018 – Sept 2019. ",
  "•  Passionate about running and photography, demonstrating both discipline and creativity in pursuing personal ",
  "health and capturing the beauty of  the world.",
];

interface DropdownsProps {}

const schema = yup
  .object({
    linkedInUrl: yup.string().required("LinkedIn url is required"),
    summary: yup.string().required("Summary / brief intro is required"),
    gitHubUrl: yup.string().required("Github url is required"),
    languages: yup.array().min(1, "You must select at least 1 Language"),
    hobbies: yup.array().min(1, "You must select at least 1 hobby"),
    technicalSkills: yup.array().min(1, "You must select at least 5 skills"),
  })
  .required();

const DigitalCv: React.FC<DropdownsProps> = () => {
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
      hobbies: [],
      languages: [],
      linkedInUrl: "",
      gitHubUrl: "",
      summary: "",
      functionalSkills: [],
      technicalSkills: [],
      experience: "",
      education: "",
    },
    resolver: yupResolver(schema),
  });

  const { user } = useAuth();

  const { data, isLoading } = useGetAllHobbiesQuery({});
  const [getCvInfo, setGetCvInfo] = useState(true);
  const toast = useToast();
  const [getDigitalCv] = useGetDigitalCvInfoMutation();
  const { data: languagesData, isLoading: langLoading } =
    useGetAllLanguagesQuery({});
  const [hobbies, setHobbies] = useState([]);
  const [languages, setLanguages] = useState([]);
  const router = useRouter();
  const [getTechnicalSkills] = useGetTechnicalSkillsMutation();
  const [functionalSkills, setFunctionalSkills] = useState([]);
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [getCandidateFunctionalSkills, { data: funcSkills }] =
    useGetCandidateFunctionalSkillsMutation();
  const [getCandidateTechnicalSkills, { data: techSkills }] =
    useGetCandidateTechnicalSkillsMutation();
  const [skip, setSkip] = useState(true);
  const [getCandidateFunctionalArea, { data: functionAreas }] =
    useGetCandidateFunctionAreasMutation();
  const [saveDigitalCvInfo, { isLoading: cvLoading }] =
    useSaveDigitalCvInfoMutation();
  const [generateCv, { isLoading: generating }] =
    useGenerateDigitalCvMutation();
  const { profileData } = useProfile();
  const [cvFile, setCvFile] = useState("");
  const [cvInfoData, setCvInfoData] = useState<any>({});
  const [getEducation] = useGetUserEducationMutation();
  const [getExperience] = useGetUserExperienceMutation();
  const [education, setEducation] = useState<any>([]);
  const [experience, setExperience] = useState<any>([]);

  const { data: functionalAreas } = useGetFunctionAreasQuery(user?.user, {
    skip,
  });
  const dispatch = useDispatch();

  const {
    candidateFunctionalSkills,
    candidateTechnicalSkills,
    candidateFunctionAreas,
  } = useProfile();

  const onSubmit = (data: any) => {
    dispatch(setCvInfo({ data: data }));
    const { technicalSkills, languages, hobbies, functionalSkills, ...rest } =
      data;
    const StechnicalSkills = data.technicalSkills.map((skill: any) => skill.id);
    const SfunctionalSkills = data.functionalSkills.map(
      (skill: any) => skill.id
    );
    const Shobbies: any = data.hobbies.map((hobby: any) => hobby.id);
    const Slanguages = data.languages.map((language: any) => language.id);
    rest.education = data.education.split("; ");
    rest.experience = data.experience.split("; ");
    rest.topTechSkills = StechnicalSkills;
    rest.topFuncSkills = SfunctionalSkills;
    rest.hobbies = Shobbies;
    rest.languages = Slanguages;
    // console.log(rest);
    saveDigitalCvInfo({ username: user?.name, credentials: rest })
      .unwrap()
      .then((payload: any) => {
        toast({
          title: "digital cv submitted successfully",
          variant: "left-accent",
          status: "success",
          isClosable: true,
          position: "top-left",
        });
        getCv();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const getCv = () => {
    if (isEmpty(cvInfoData)) {
      getDigitalCv(user?.name)
        .unwrap()
        .then((payload: any) => {
          console.log(payload, "digatal");
          setCvInfoData(payload);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  const generateDCv = () => {
    generateCv(profileData?.id)
      .unwrap()
      .then((payload: any) => {
        setCvFile(payload);
      })
      .catch((error: any) => {
        setCvFile(error.data);
      });
  };

  useEffect(() => {
    console.log(cvFile);
  }, [cvFile]);

  useEffect(() => {
    getCv();
  }, []);
  useEffect(() => {
    if (isEmpty(candidateTechnicalSkills))
      getCandidateTechnicalSkills(user?.name)
        .unwrap()
        .then((payload) => {
          console.log(payload, "tech");
          if (isEmpty(payload)) {
            toast({
              title:
                "please add your technical skill in profile section before creating digital cv",
              variant: "left-accent",
              status: "error",
              isClosable: true,
              position: "top-left",
            });
          } else {
            dispatch(setCandidateTechnicalSkills({ data: payload }));
          }
        });
  }, []);
  useEffect(() => {
    if (isEmpty(candidateFunctionAreas))
      getCandidateFunctionalArea(user?.name)
        .unwrap()
        .then((payload: any) => {
          if (isEmpty(payload)) {
            toast({
              title:
                "please add your function areas in profile section before creating digital cv",
              variant: "left-accent",
              status: "error",
              isClosable: true,
              position: "top-left",
            });
          } else {
            dispatch(setCandidateFunctionAreas({ data: payload }));
          }
        });
  }, []);

  useEffect(() => {
    if (!isEmpty(cvInfoData)) {
      let shobbies: any = [];
      let slanguages: any = [];
      let stechSkills: any = [];
      cvInfoData.hobbies.map((sel: any) => {
        hobbies.map((segment: any) => {
          if (segment.id === sel) {
            shobbies.push(segment);
          }
        });
      });
      cvInfoData.languages.map((sel: any) => {
        languages.map((segment: any) => {
          if (segment.id === sel) {
            slanguages.push(segment);
          }
        });
      });
      cvInfoData.topTechSkills.map((sel: any) => {
        technicalSkills.map((segment: any) => {
          if (segment.id === sel) {
            stechSkills.push(segment);
          }
        });
      });
      if (!isEmpty(experience)) {
        const exp = processData(cvInfoData.experience);
        setValue("experience", exp);
      } else {
        const sexperience = cvInfoData?.experience?.join("; ");
        console.log(sexperience);
        setValue("experience", sexperience);
      }
      if (!isEmpty(education)) {
        const edu = processData(cvInfoData.education);
        setValue("education", edu);
      } else {
        const seducation = cvInfoData?.education?.join("; ");
        setValue("education", seducation);
      }

      setValue("hobbies", shobbies);
      setValue("languages", slanguages);
      setValue("technicalSkills", stechSkills);
      setValue("summary", cvInfoData.summary);
      setValue("linkedInUrl", cvInfoData.linkedInUrl);
      setValue("gitHubUrl", cvInfoData.gitHubUrl);
    } else {
      setGetCvInfo(false);
    }
  }, [cvInfoData, hobbies, languages, technicalSkills, education, experience]);

  useEffect(() => {
    if (data) {
      const options = data.map((hobby: any) => ({
        label: hobby.name,
        value: hobby.id,
        id: hobby.id,
      }));
      setHobbies(options);
    }
  }, [data]);
  useEffect(() => {
    if (languagesData) {
      console.log(languagesData);
      const options = languagesData.map((hobby: any) => ({
        label: hobby.name,
        value: hobby.id,
        id: hobby.id,
      }));
      setLanguages(options);
    }
  }, [languagesData]);

  useEffect(() => {
    console.log(candidateTechnicalSkills, "techy");
    console.log(candidateFunctionAreas, "techy");
    getTechnicalSkills(candidateFunctionAreas)
      .unwrap()
      .then((payload: any) => {
        const options: any = payload.map((sector: any) => ({
          label: sector.name,
          value: sector.id,
          id: sector.id,
        }));
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
        if (isEmpty(values)) {
          toast({
            title: "please setup your profile before creating digital cv",
            variant: "left-accent",
            status: "error",
            isClosable: true,
            position: "top-left",
          });
        } else {
        }
        setTechnicalSkills(values);
      });
  }, [candidateTechnicalSkills, candidateFunctionAreas]);
  useEffect(() => {}, [candidateFunctionAreas, candidateTechnicalSkills]);

  useEffect(() => {
    getEducation(user?.name)
      .unwrap()
      .then((payload: any) => {
        console.log(payload, "edu");
        if (!isEmpty(payload)) {
          const exp = processData(payload);
          setEducation(exp);
        }
      });
  }, []);
  useEffect(() => {
    getExperience(user?.name)
      .unwrap()
      .then((payload: any) => {
        console.log(payload, "exp");
        if (!isEmpty(payload)) {
          const edu = processData(payload);
          setExperience(edu);
        }
      });
  }, []);

  const processData = (rawData: any) => {
    if (!isEmpty(rawData)) {
      const temp = rawData?.map((segment: any) => {
        return {
          id: segment,
          label: segment,
          value: segment,
        };
      });
      return temp;
    }
  };

  return (
    // <div>
    //   <div>
    //     <label htmlFor="username">Username:</label>
    //     <input
    //       type="text"
    //       id="username"
    //       value={username}
    //       onChange={handleUsernameChange}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="hobby">Select Hobbies:</label>
    //     <select
    //       id="hobby"
    //       onChange={handleHobbyChange}
    //       value={''} // We clear the selected value after adding to the array
    //     >
    //       <option value="">Select</option>
    //       {hobbies.map((hobby) => (
    //         <option key={hobby} value={hobby}>
    //           {hobby}
    //         </option>
    //       ))}
    //     </select>
    //     <div>Selected Hobbies: {selectedHobbies.join(', ')}</div>
    //   </div>
    //   <div>
    //     <label htmlFor="language">Select Language:</label>
    //     <select
    //       id="language"
    //       onChange={handleLanguageChange}
    //       value={selectedLanguage}
    //     >
    //       <option value="">Select</option>
    //       {languages.map((language) => (
    //         <option key={language} value={language}>
    //           {language}
    //         </option>
    //       ))}
    //     </select>
    //   </div>
    //   <div>
    //     <button onClick={handleSave}>Save</button>
    //   </div>
    //   <div>
    //     <p>{message}</p>
    //   </div>
    // </div>
    <AppLayouts>
      <Flex
        // minH={{
        //   base: "100vh",
        //   lg: "82vh",
        // }}
        mt={24}
        p={0}
        // bg={"black"}
        rounded={"lg"}
        boxShadow={"md"}
        bg="white"
      >
        <Box
          w="66%"
          // h={'102%'}
          // mx={0}
          px={16}
          flex={1}
          minH={{
            base: "85vh",
            lg: "82vh",
          }}
          borderLeftWidth={1}
        >
          <Text textAlign={"center"} my={5} fontWeight={"bold"}>
            Cv Details Form
          </Text>
          <VStack mt={12} gap={4}>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, ref, value } }) => (
                <StatefulMultiSelect
                  options={hobbies}
                  errors={errors}
                  name={"hobbies"}
                  // selected={value}
                  // limit={3}
                  onBlur={onBlur}
                  value={value}
                  isDisabled={false}
                  label="Select Hobbies"
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
              name={"hobbies"}
            />
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, ref, value } }) => (
                <StatefulMultiSelect
                  options={languages}
                  errors={errors}
                  name={"languages"}
                  // selected={value}
                  // limit={3}
                  onBlur={onBlur}
                  value={value}
                  isDisabled={false}
                  label="Select Languages"
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
              name={"languages"}
            />
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, ref, value } }) => (
                <StatefulMultiSelect
                  options={technicalSkills}
                  errors={errors}
                  name={"technicalSkills"}
                  // selected={value}
                  // limit={3}
                  onBlur={onBlur}
                  value={value}
                  isDisabled={value.length === 5}
                  label="Technical Skills (upto 5)"
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
              name={"technicalSkills"}
            />
            {/* <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, ref, value } }) => (
                <StatefulMultiSelect
                  options={hobbies}
                  errors={errors}
                  name={"functionalSkills"}
                  // selected={value}
                  // limit={3}
                  onBlur={onBlur}
                  value={value}
                  isDisabled={value.length === 5}
                  label="Functional Skills (upto 5)"
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
              name={"languages"}
            /> */}
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl
                  mb={{
                    base: 5,
                    md: 4,
                  }}
                  variant="floating"
                  isInvalid={!isEmpty(errors["summary"])}
                >
                  <Textarea
                    onChange={onChange}
                    variant="outline"
                    value={value}
                    maxLength={150}
                    placeholder="Enter Short summary"
                  />
                  {!isEmpty(errors["summary"]) && (
                    <FormErrorMessage>
                      {errors["summary"].message}
                    </FormErrorMessage>
                  )}
                  {!isEmpty(value) && <FormLabel>Summary</FormLabel>}
                </FormControl>
              )}
              name="summary"
            />
            {!isEmpty(experience) ? (
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, ref, value } }) => (
                  <StatefulMultiSelect
                    options={experience}
                    errors={errors}
                    name={"experience"}
                    // selected={value}
                    // limit={3}
                    onBlur={onBlur}
                    value={value}
                    isDisabled={value.length === 3}
                    label="3 work Experience  (upto 3)"
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                  />
                )}
                name={"experience"}
              />
            ) : (
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    mb={{
                      base: 5,
                      md: 4,
                    }}
                    variant="floating"
                    isInvalid={!isEmpty(errors["experience"])}
                  >
                    <Textarea
                      onChange={onChange}
                      variant="outline"
                      value={value}
                      placeholder="Enter up to 3 experience separated by ;"
                    />
                    {!isEmpty(errors["experience"]) && (
                      <FormErrorMessage>
                        {errors["experience"].message}
                      </FormErrorMessage>
                    )}
                    {!isEmpty(value) && <FormLabel>Experience</FormLabel>}
                  </FormControl>
                )}
                name="experience"
              />
            )}
            {!isEmpty(education) ? (
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, ref, value } }) => (
                  <StatefulMultiSelect
                    options={education}
                    errors={errors}
                    name={"education"}
                    // selected={value}
                    // limit={3}
                    onBlur={onBlur}
                    value={value}
                    isDisabled={value.length === 5}
                    label="3 Education background  (upto 3)"
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                  />
                )}
                name={"education"}
              />
            ) : (
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    mb={{
                      base: 5,
                      md: 4,
                    }}
                    variant="floating"
                    isInvalid={!isEmpty(errors["education"])}
                  >
                    <Textarea
                      onChange={onChange}
                      variant="outline"
                      value={value}
                      placeholder="Enter up to 3 education separated by ;"
                    />
                    {!isEmpty(errors["education"]) && (
                      <FormErrorMessage>
                        {errors["education"].message}
                      </FormErrorMessage>
                    )}
                    {!isEmpty(value) && <FormLabel>Education</FormLabel>}
                  </FormControl>
                )}
                name="education"
              />
            )}

            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label={"LinkedIn"}
                  id={"linkedIn"}
                  name="linkedIn"
                  errors={errors}
                  onChange={(input: any) => {
                    onChange(input);
                    // debouncedUsernameValidation(input.target.value);
                  }}
                  value={value}
                  type={"text"}
                />
              )}
              name="linkedInUrl"
            />
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label={"Github"}
                  id={"github"}
                  name="github"
                  errors={errors}
                  onChange={(input: any) => {
                    onChange(input);
                    // debouncedUsernameValidation(input.target.value);
                  }}
                  value={value}
                  type={"text"}
                />
              )}
              name="gitHubUrl"
            />
          </VStack>
          <Button
            fontFamily={"heading"}
            alignSelf={"flex-end"}
            justifySelf={"flex-end"}
            mt={8}
            isDisabled={false}
            isLoading={cvLoading}
            w={"full"}
            onClick={handleSubmit(onSubmit)}
            py={6}
            bg="primary.100"
            color={"white"}
            _hover={{
              boxShadow: "xl",
            }}
          >
            Save Details
          </Button>
        </Box>
        {!isEmpty(cvInfoData.hobbies) && (
          <Box
            minH={{
              base: "85vh",
              lg: "82vh",
            }}
            h="full"
            w={{
              base: "100%",
              md: "34%",
            }}
            borderRightWidth={1}
            px={4}
            my={16}
          >
            <Button
              fontFamily={"heading"}
              alignSelf={"flex-end"}
              justifySelf={"flex-end"}
              mt={8}
              isDisabled={isEmpty(cvInfoData)}
              isLoading={false}
              w={"full"}
              onClick={generateDCv}
              py={6}
              bg="primary.100"
              color={"white"}
              _hover={{
                boxShadow: "xl",
              }}
            >
              Generate Cv
            </Button>
            {cvFile && (
              <AspectRatio maxW="100vh" mt={4} ratio={1}>
                <Box
                  as="iframe"
                  src={`http://dev-ec2.compaira.com:8181/uploads/graphs/${cvFile}`}
                />
              </AspectRatio>
            )}
          </Box>
        )}
      </Flex>
    </AppLayouts>
  );
};

export default DigitalCv;
