import React from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button } from "native-base";
const { width, height } = Dimensions.get("screen");
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = (height - 100) * 0.85;

export default function block(props) {
  const getBgColor = (item, index) => {
    if (item.correctIndex == index) {
      return "green";
    } else if (item.selected == index && item.selected != item.correctIndex) {
      return "red";
    } else {
      return "#EEEEEE";
    }
  };
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <FlatList
        data={props.answers[0].questions}
        keyExtractor={(item, index) => "key" + index}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          var itemsVarriable = item;
          return (
            <View
              style={{
                backgroundColor: "white",
                overflow: "hidden",
                marginBottom: 15,
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                borderRadius: 15,
              }}
            >
              <View
                style={{
                  flex: 1.5,
                  backgroundColor: "white",
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {item.question}
                </Text>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={{ height: 100, width: 200, marginTop: 30 }}
                  />
                ) : null}
              </View>
              <View
                style={{
                  flex: 3,
                  padding: 20,
                  justifyContent: "space-evenly",
                }}
              >
                {item.options.map((item, index) => {
                  return (
                    <View
                      style={{
                        height: 55,
                        borderRadius: 5,
                        width: "100%",
                        flexDirection: "row",
                        backgroundColor: getBgColor(itemsVarriable, index),
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            left: 15,
                            color: "black",
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        }}
      />
      <Button
        _text={{ bold: true, fontSize: 20 }}
        backgroundColor="#FCA82F"
        w={width}
        onPress={() => {
          props.replay();
        }}
      >
        Replay
      </Button>
    </View>
  );
}
