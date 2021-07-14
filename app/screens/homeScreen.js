import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import { StatusBar, View } from "react-native";
import Questions from "../../containers/Questions/index";
import { Button } from "@ui-kitten/components";
export default () => (
  <Layout style={{ flex: 1, backgroundColor: "#6066D0" }}>
    <View
      style={{
        height: 60,
        //backgroundColor: "pink",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          color: "#FCA82F",
          fontWeight: "bold",
        }}
      >
        T R I V I A
      </Text>
    </View>
    <Questions />
  </Layout>
);
