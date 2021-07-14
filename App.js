import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import { NativeBaseProvider } from "native-base";
import { StatusBar } from "react-native";

import HomeScreen from "./app/screens/homeScreen";
const HomeScreenLayout = () => <HomeScreen />;

export default () => (
  <NativeBaseProvider>
    <ApplicationProvider {...eva} theme={eva.light}>
      <StatusBar backgroundColor="#6066D0" />
      <HomeScreenLayout />
    </ApplicationProvider>
  </NativeBaseProvider>
);
