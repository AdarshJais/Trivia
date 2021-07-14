import * as React from "react";
import {
  StatusBar,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import { EvilIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import Block from "../../components/questionBlock/block";
const OVERFLOW_HEIGHT = 50;
const SPACING = 10;
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = (height - 100) * 0.85;
const VISIBLE_ITEMS = 3;

const OverflowItems = ({ questions, scrollXAnimated }) => {
  const inputRange = [-1, 0, 1];
  const translateY = scrollXAnimated.interpolate({
    inputRange,
    outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
  });
  return (
    <View style={styles.overflowContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {questions.map((item, index) => {
          return (
            <View key={index} style={styles.itemContainer}>
              <Text style={[styles.title]} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
};
export default function App() {
  const [data, setData] = React.useState(null);
  const [questions, setQuestions] = React.useState(null);
  const [answers, setAnswers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [count, setCount] = React.useState(1);
  const [isLastQuestion, setIsLastQuestion] = React.useState(false);
  let scrollXIndex = React.useRef(new Animated.Value(0)).current;
  let scrollXAnimated = React.useRef(new Animated.Value(0)).current;
  const [index, setIndex] = React.useState(0);
  const setActiveIndex = React.useCallback((activeIndex) => {
    scrollXIndex.setValue(activeIndex);
    setIndex(activeIndex);
  });
  const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const fetchQuestion = async () => {
    const randomQuestionId = getRandomIntInclusive(1, 2);
    try {
      const questionsPromise = await fetch(
        `https://serious-tiger-81.loca.lt/api/questions/${randomQuestionId}`
      );
      const questions = await questionsPromise.json();
      setData(questions);
      setQuestions(questions[0].questions);
    } catch (error) {
      console.log("error while fetchQuestion", error);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    (async () => {
      await fetchQuestion();
    })();

    setLoading(false);
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
  }, []);

  const setScroll = (count) => {
    //question.length == 9
    //index   count
    //  0      1
    //  1      2
    //  2      3
    //  4      5
    //  5      6
    //  6      7
    //  7      8
    //  8      9
    scrollXIndex.setValue(count);

    if (count < questions.length) {
      setCount(count + 1);
    }
    if (count == questions.length - 1) {
      setIsLastQuestion(true);
    }
  };

  const onOptionSelect = (questionIndex, answerIndex) => {
    const newArray = [...questions];
    newArray[questionIndex].selected = answerIndex;
    setQuestions(newArray);
  };

  const fectchAnswers = async (data) => {
    const response = await fetch(
      "https://serious-tiger-81.loca.lt/api/answers",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    const json = await response.json();
    console.log(json);
    return json;
  };

  const submitAnswers = async (questions) => {
    setLoading(true);
    data.questinons = questions;
    const answers = await fectchAnswers(data);
    setData(null);
    setQuestions(null);
    setAnswers(answers);
    setLoading(false);
  };

  const replay = async () => {
    setLoading(true);
    setData(null);
    setQuestions(null);
    setCount(1);
    setIsLastQuestion(false);
    setAnswers(null);
    await fetchQuestion();
    scrollXIndex.setValue(0);
    scrollXAnimated.setValue(0);
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
    setLoading(false);
  };

  const getDisplayScreen = () => {
    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {" "}
            Loading...
          </Text>
          <ActivityIndicator size="large" color="#FCA82F" />
        </View>
      );
    } else {
      if (answers && answers.length > 0) {
        return <Block answers={answers} replay={replay} />;
      }
      if (questions && questions.length > 0) {
        return (
          <>
            <OverflowItems
              questions={questions}
              scrollXAnimated={scrollXAnimated}
            />
            <FlatList
              data={questions}
              keyExtractor={(item, index) => "key" + index}
              horizontal
              inverted
              contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                padding: SPACING * 2,

                // backgroundColor: "pink",
              }}
              scrollEnabled={false}
              removeClippedSubviews={false}
              CellRendererComponent={({
                item,
                index,
                children,
                style,
                ...props
              }) => {
                const newStyle = [style, { zIndex: questions.length - index }];
                return (
                  <View style={newStyle} index={index} {...props}>
                    {children}
                  </View>
                );
              }}
              renderItem={({ item, index }) => {
                var itemsVarriable = item;
                var questionIndex = index;

                const inputRange = [index - 1, index, index + 1];
                const translateX = scrollXAnimated.interpolate({
                  inputRange,
                  outputRange: [50, 0, -100],
                });
                const scale = scrollXAnimated.interpolate({
                  inputRange,
                  outputRange: [0.8, 1, 1.3],
                });
                const opacity = scrollXAnimated.interpolate({
                  inputRange,
                  outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
                });

                return (
                  <Animated.View
                    style={{
                      backgroundColor: "white",
                      overflow: "hidden",
                      position: "absolute",
                      left: -ITEM_WIDTH / 2,
                      width: ITEM_WIDTH,
                      height: ITEM_HEIGHT,
                      borderRadius: 15,
                      opacity,
                      transform: [
                        {
                          translateX,
                        },
                        { scale },
                      ],
                    }}
                  >
                    <Animated.View
                      style={{
                        flex: 1.5,
                        backgroundColor: "white",
                        padding: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        opacity,
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
                    </Animated.View>
                    <Animated.View
                      style={{
                        flex: 3,
                        opacity,

                        //backgroundColor: "green",
                        padding: 20,
                        justifyContent: "space-evenly",
                      }}
                    >
                      {item.options.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => onOptionSelect(questionIndex, index)}
                            style={{
                              height: 55,
                              borderRadius: 5,
                              // borderWidth: 2,
                              // borderColor:
                              //   index === itemsVarriable.selected
                              //     ? "#FCA82F"
                              //     : "#EEEEEE",
                              width: "100%",
                              flexDirection: "row",
                              //elevation: 0.5,

                              backgroundColor:
                                index === itemsVarriable.selected
                                  ? "#FCA82F"
                                  : "#EEEEEE",
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
                                  color:
                                    index === itemsVarriable.selected
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {item}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </Animated.View>
                    <View
                      style={{
                        flex: 0.5,
                        alignItems: "flex-end",
                        justifyContent: "flex-end",

                        //backgroundColor: "pink",
                      }}
                    >
                      {index == count - 1 && !isLastQuestion ? (
                        <TouchableOpacity
                          onPress={() =>
                            questions[index].selected == null
                              ? alert("Please select any one option.")
                              : setScroll(count)
                          }
                          style={{
                            height: 70,
                            width: 150,
                            top: 2,
                            backgroundColor: "#FCA82F",
                            borderTopLeftRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            //position: "absolute",

                            elevation: 50,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 22,
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Next
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                      {isLastQuestion ? (
                        <TouchableOpacity
                          onPress={() =>
                            questions[index].selected == null
                              ? alert("Please select any one option.")
                              : submitAnswers(questions)
                          }
                          style={{
                            height: 70,
                            width: 150,
                            top: 2,
                            backgroundColor: "lightgreen",
                            borderTopLeftRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            //position: "absolute",
                            elevation: 50,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 22,
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Submit
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>

                    {/* <Image
                source={{ uri: item.poster }}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  borderRadius: 10,
                }}
              /> */}
                  </Animated.View>
                );
              }}
            />
          </>
        );
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>{getDisplayScreen()}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: "green",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "white",
    top: -5,
    //textTransform: "uppercase",
    letterSpacing: -1,
  },
  location: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
  },
  itemContainer: {
    height: OVERFLOW_HEIGHT,
    padding: SPACING * 2,
  },
  itemContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: "hidden",
    //backgroundColor: "red",
  },
});
