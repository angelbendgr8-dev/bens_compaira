import { useDashboard } from "@/state/hooks/dashboard.hook";
import { useProfile } from "@/state/hooks/profile.hook";
import { useAuth } from "@/state/hooks/user.hook";
import { setBehaviourGraphData } from "@/state/reducers/dashboard.reducer";
import {
  useGeneratePdfReportMutation,
  useGetBehaviourGraphMutation,
} from "@/state/services/dashboard.service";
import { Box, Button, Flex, Image, Link, useToast } from "@chakra-ui/react";
import React, { useEffect, FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useEffectOnce } from "usehooks-ts";
import { isEmpty } from "lodash";

const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;

type Props = {
  isLoading?: boolean;
};
const BehaviourTabContent: FC<Props> = ({ isLoading }) => {
  const [getBehaviourGraph] = useGetBehaviourGraphMutation();
  const { behaviourGraph } = useDashboard();
  const { profileData } = useProfile();
  const dispatch = useDispatch();
  const [generatePdf, { isLoading: pdfLoading }] =
    useGeneratePdfReportMutation();
  const [downloadPath, setDownloadPath] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [hasError, setHasError] = useState(false);
  const toast = useToast();

  useEffectOnce(() => {
    if (!isEmpty(profileData?.id)) {
      getBehaviourGraph(profileData?.id)
        .unwrap()
        .then((payload: any) => {
          dispatch(setBehaviourGraphData({ data: payload }));
        })
        .catch((error) => console.log(error));
    }
  });
  useEffect(() => {}, [behaviourGraph, downloadPath]);

  const handleBehaviourReport = () => {
    generatePdf(profileData.id)
      .unwrap()
      .then((payload: any) => {
        console.log(payload);
      })
      .catch((error: any) => {
        if (error.data.lastIndexOf(".pdf") === -1) {
          toast({
            title: "Error generating pdf",
            variant: "left-accent",
            status: "error",
            isClosable: true,
            position: "top-left",
          });
        } else {
          setDownloadPath(error.data);
          setShowDownload(true);
        }
      });
  };

  return (
    <Box>
      {!showDownload && (
        <Button
          borderWidth={1}
          onClick={handleBehaviourReport}
          isLoading={pdfLoading}
          borderColor="primary.100"
          color="primary.100"
          bg="transparent"
          px={{
            base: 24,
          }}
        >
          Generate Report
        </Button>
      )}
      {showDownload && downloadPath && (
        <Link
          bg="primary.100"
          py={2}
          px={12}
          rounded={"md"}
          color="white"
          fontWeight={"bold"}
          my={{
            base: 6,
            md: 4,
          }}
          href={`${downloadPath}`}
          target="_blank"
          download
        >
          Download Report
        </Link>
      )}

      <Flex
        display={{ base: "none", md: "block" }}
        bg="blue.500"
        my={4}
        flex={1}
        alignItems={"center"}
      >
        <Image
          alt="logo"
          fit={"contain"}
          boxSize={"full"}
          src={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/uploads/graphs/${behaviourGraph}`}
        />
      </Flex>
    </Box>
  );
};
export default BehaviourTabContent;
