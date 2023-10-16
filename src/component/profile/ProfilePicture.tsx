import {
  Icon,
  Box,
  Text,
  Center,
  Image,
  useToast,
  Progress,
} from "@chakra-ui/react";
// import { FiFile } from "react-icons/fi";

import { BiUserCircle } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/state/hooks/profile.hook";
import { isEmpty } from "lodash";
import { useAuth } from "@/state/hooks/user.hook";
import { useSaveProfilePicsMutation } from "@/state/services/profile.service";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { debounce } from "lodash";
import { error } from "console";
import { setProfileData } from "@/state/reducers/profile.reducer";
import { useDispatch } from "react-redux";

const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

type Props = {
  name: string;
  placeholder?: string;
  acceptedFileTypes: string;
  control: any;
  children: any;
  isRequired: boolean;
};
const schema = yup
  .object({
    file: yup
      .mixed()
      .required("Please upload only .jpg/.jpeg/.png formats")
      .test(
        "format",
        "Please upload only .jpg/.jpeg/.png formats",
        (value: any) =>
          !value || (value && SUPPORTED_FORMATS.includes(value.type))
      ),
  })
  .required();

export const ProfilePicture = ({}) => {
  const inputRef = useRef<any>();
  const { profileData } = useProfile();
  const { user } = useAuth();
  const [saveProfilePicture, { isLoading }] = useSaveProfilePicsMutation();
  const dispatch = useDispatch();
  const { photo } = profileData;
  const [value, setValue] = useState<any>({});
  const [file, setFile] = useState<any>({});
  const toast = useToast();
  const {
    control,
    setError,
    getValues,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      file: "",
    },
    resolver: yupResolver(schema),
  });

  const handleFormSelected = (data: any) => {
    handleSubmit(uploadImage);
  };
  const processImage = debounce(
    async (val: any) => {
      const { file } = getValues();
      console.log(file, "file");
      schema
        .validate(
          {
            file,
          },
          { abortEarly: false }
        )
        .then(() => {
          clearErrors("file");
          //@ts-ignore
          setValue(URL.createObjectURL(file));
          uploadImage();
        })
        .catch((e) => {
          console.log(e.errors);
          toast({
            title: e.message,
            variant: "left-accent",
            status: "error",
            isClosable: true,
            position: "top-left",
          });
          setError("file", {
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
  const uploadImage = () => {
    const { file } = getValues();
    console.log(file, "file");
    const fData = new FormData();
    fData.append("image", file);
    //@ts-ignore
    setValue(URL.createObjectURL(file));
    saveProfilePicture({ username: user?.name, credentials: fData })
      .unwrap()
      .then((payload) => {
        clearErrors("file");
        const photo = payload.uploadedPath;
        const updatedData = { ...profileData, photo };
        dispatch(setProfileData({ data: updatedData }));
        toast({
          title: "‘Profile picture is loaded successfully",
          variant: "left-accent",
          status: "success",
          isClosable: true,
          position: "top-left",
        });
      })
      .catch((error) => {
        console.log(error);
        setError("file", {
          type: "custom",
          message: "Profile update failed, Upload new file",
        });
      });
  };
  useEffect(() => {}, [value]);

  return (
    <Box
      my={{
        base: 4,
      }}
      h={{
        base: 48,
      }}
    >
      {isLoading && <Progress size="xs" isIndeterminate />}
      <Center>
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, value } }) => (
            <input
              type="file"
              onChange={(e: any) => {
                // console.log(e.target.files[0]);
                onChange(e.target.files[0]);
                // handleFormSelected(e.target.files[0]);
                processImage(e.target.files[0]);
              }}
              accept={"image/*"}
              //@ts-ignore
              // value={value}
              name={"file"}
              ref={inputRef}
              style={{ display: "none" }}
            />
          )}
          name="file"
        />

        <Box
          onClick={() => {
            inputRef.current.click();
          }}
          display={"flex"}
          alignSelf={"center"}
          justifyContent={"center"}
          alignItems="center"
          flexDir={"column"}
          flexWrap={"wrap"}
          rounded={"lg"}
          w={{
            base: "50%",
            md: "50%",
            lg: "55%",
            xl: "35%",
          }}
          // h={{
          //   base: 36,
          // }}
          borderWidth={3}
          borderColor={'"#C5E9E0"'}
          borderStyle="dashed"
          color="white"
        >
          <Box rounded="full">
            {!isEmpty(value) ? (
              <Image
                boxSize={130}
                // width={20}
                src={value}
                alt={"user profile Image"}
              />
            ) : (
              <>
                {!isEmpty(photo) ? (
                  <Image
                    boxSize={130}
                    src={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${photo}`}
                    alt={"user profile Image"}
                  />
                ) : (
                  <Icon
                    mr={2}
                    fontSize="96"
                    color={"#C5E9E0"}
                    as={BiUserCircle}
                  />
                )}
              </>
            )}
          </Box>
          <Box>
            <Text
              fontSize={"1em"}
              color="black"
              fontWeight="bold"
              wordBreak={"break-word"}
              textAlign={"center"}
            >
              {`Click here to
              ${!isEmpty(photo) ? "change" : " upload"} profile picture`}
            </Text>
          </Box>
        </Box>
      </Center>
      <Text py={2} color="red.600" textAlign={"center"}>
        {errors?.file?.message}
      </Text>
    </Box>
  );
};

export default ProfilePicture;
