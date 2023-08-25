import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import InformationTab from "./InformationTab";
import BehaviorTab from "./BehaviorTab";
import Competency from "./Competency";
import ValuesTab from "./ValuesTab";

const ProfileTabs = ({tab}: {tab: any}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const changeTabs = (number: number) => {
    setTabIndex(number);
  };
  useEffect(() => {
    if(tab){
      setTabIndex(Number(tab))
    }
  }, [tab])

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };
  return (
    <Tabs index={tabIndex} onChange={handleTabsChange} isFitted>
      <TabList
        pt={{
          base: 4,
        }}
        borderBottomWidth={2}
        borderBottomColor={"primary.50"}
        mb="1em"
        rounded="md"
      >
        <Tab>1</Tab>
        <Tab>2</Tab>
        <Tab>3</Tab>
        <Tab>4</Tab>
      </TabList>
      <TabPanels
        bg="white"
        py={{
          base: 4,
        }}
      >
        <TabPanel>
          <InformationTab changeTabs={changeTabs} />
        </TabPanel>
        <TabPanel>
          <BehaviorTab changeTabs={changeTabs} />
        </TabPanel>
        <TabPanel>
          <Competency changeTabs={changeTabs} />
        </TabPanel>
        <TabPanel>
          <ValuesTab changeTabs={changeTabs} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
export default ProfileTabs;
