import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { FaUserTie, FaTrophy, FaRegThumbsDown } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useDashboard } from "@/state/hooks/dashboard.hook";
import { Analytics } from "./cards/Analytics";

export default function AnalyticsContainer () {
  const {dashboardData} = useDashboard()
  return (
    <SimpleGrid
      columns={{
        base: 1,
        sm: 2,
        lg: 4,
        xl: 4,
      }}
      mb={{
        base: 4,
      }}
      spacing={6}
    >
      <Analytics
        image={"assets/images/first.png"}
        icon={FaUserTie}
        title="Matching"
        bg="#DAD9F9"
        iconColor="#2C2E7E"
        count={dashboardData?.matched}
      />
      <Analytics
        image={"assets/images/second.png"}
        icon={RiLockPasswordFill}
        title="Applied"
        count={dashboardData?.applied}
        bg="#E6F0FE"
        iconColor="#5E5C9A"
      />
      <Analytics
        image={"assets/images/third.png"}
        icon={FaRegThumbsDown}
        title="Unsuccessful"
        count={dashboardData?.rejected}
        bg="#FFE9D8"
        iconColor="#EF8F41"
      />
      <Analytics
        image={"assets/images/fourth.png"}
        icon={FaTrophy}
        title="Successful"
        count={dashboardData?.shortListed}
        bg="#C5E9E0"
        iconColor="#2F947B"
      />
    </SimpleGrid>
  );
}
