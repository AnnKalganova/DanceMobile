import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import GLOBALS from "../../Globals";

const RefPairsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [canComplete, setCanComplete] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  const group = navigation.getParam("group");

  useEffect(() => {
    const willFocusHandler = navigation.addListener("willFocus", () => {
      getPairs();
    });

    getPairs();

    return () => willFocusHandler.remove();
  }, []);

  const checkHeatCompletion = (result) => {
    let allCompleted = true;

    let i = 0;
    for (i = 0; i < result.length; i++) {
      if (result[i].score == 0) {
        allCompleted = false;
        break;
      }
    }

    return allCompleted;
  };

  const getPairs = () => {
    console.log("getPairs - start");
    setRefreshing(true);
    fetch(global.baseURL + "/pairs/" + group.id)
      .then((res) => res.json())
      .then(
        (result) => {
          setData(result);
          setCanComplete(checkHeatCompletion(result.pairsInfo));
        },
        (error) => {
          console.log("Fetch error: ", error);
        }
      )
      .catch((e) => {
        console.log("Fetch catch: ", e);
      })
      .finally(() => {
        setRefreshing(false);
      });
    console.log("getPairs - end");
  };

  const Item = ({ pair }) => (
    <View style={styles.item_container}>
      <Pressable
        style={styles.item}
        onPress={() => {
          setModalData(pair);
          setModalVisible(true);
        }}
      >
        <View style={styles.numberPlace}>
          <Text style={styles.pairNumber}>{pair.pairNumber}</Text>
        </View>
        <View
          style={[
            styles.scorePlace,
            {
              backgroundColor:
                pair.score == 1
                  ? "#90C67B"
                  : pair.score == 2
                  ? "#F9D423"
                  : pair.score == 3
                  ? "#F97C23"
                  : GLOBALS.COLOR.GREY,
            },
          ]}
        >
          <Text style={styles.scoreValue}>
            {pair.score == 0 ? "--" : pair.score}
          </Text>
        </View>
      </Pressable>
    </View>
  );

  const renderItem = ({ item }) => <Item pair={item} />;

  handleRefresh = () => {
    getPairs();
  };

  const onCompletePress = () => {
    if (!canComplete) {
      Alert.alert(
        "",
        "Для перехода к следующему заходу надо всем парам выставить оценки"
      );
      return;
    }

    Alert.alert(
      "Внимание!",
      "Вы действительно хотите перейти к следующему заходу?",
      [
        {
          text: "Да",
          onPress: () => {
            completeHeat();
          },
        },
        {
          text: "Нет",
        },
      ]
    );
  };

  const completeHeat = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refProgressId: data.refProgressId,
      }),
    };

    fetch(global.baseURL + "/complete/", requestOptions)
      .then(
        (result) => {
          if (result.status == 200) {
            getPairs();
          } else {
            Alert.alert("Ошибка!", "Код ошибки: " + result.status, [
              {
                text: "OK",
              },
            ]);
          }
        },
        (error) => {
          console.log("Fetch error: ", error);
        }
      )
      .catch((e) => {
        console.log("Fetch catch: ", e);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const completeButton = () => {
    return (
      <Pressable
        style={[
          styles.completeButton,
          {
            backgroundColor: canComplete
              ? GLOBALS.COLOR.HEADERBLUE
              : GLOBALS.COLOR.DISABLED,
          },
        ]}
        onPress={() => {
          onCompletePress();
        }}
      >
        <Text style={styles.completeText}>Следующий заход</Text>
      </Pressable>
    );
  };

  const setPairScore = (pair, score) => {
    setRefreshing(true);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        RefProgressId: data.refProgressId,
        ScoreId: pair.scoreId,
        Score: score,
      }),
    };

    fetch(global.baseURL + "/setScore/", requestOptions)
      .then(
        (result) => {},
        (error) => {
          console.log("Fetch error: ", error);
        }
      )
      .catch((e) => {
        console.log("Fetch catch: ", e);
      })
      .finally(() => {
        setRefreshing(false);
        getPairs();
      });
  };

  const noGroups = () => {
    return (
      <Text style={styles.noGroupsText}>
        Вы закончили судейство данной группы
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topView}>
        {data.dance == null && (
          <Text style={styles.groupName}>{group.name}</Text>
        )}
        {data.dance != null && (
          <Text style={styles.groupName}>Танец: {data.dance}</Text>
        )}
        {data.dance != null && (
          <Text style={styles.userRole}>Заход: {data.heat}</Text>
        )}
      </View>
      <View style={styles.bottomView}>
        <FlatList
          data={data.pairsInfo}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.scoreId}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        {data.dance != null ? completeButton() : noGroups()}

        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <Pressable
            style={styles.centeredView}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Pressable style={styles.modalView}>
              <View style={styles.modalNumberView}>
                <Text style={styles.pairNumber}>
                  {modalData != null ? modalData.pairNumber : ""}
                </Text>
              </View>

              <View style={styles.modalScoresView}>
                <Pressable
                  style={[styles.modalScore, styles.backColor3]}
                  onPress={() => {
                    setModalVisible(false);
                    setPairScore(modalData, 3);
                  }}
                >
                  <Text style={styles.scoreValue}>3</Text>
                  <Text style={styles.scoreLabel3}>балла</Text>
                </Pressable>

                <Pressable
                  style={[styles.modalScore, styles.backColor2]}
                  onPress={() => {
                    setModalVisible(false);
                    setPairScore(modalData, 2);
                  }}
                >
                  <Text style={styles.scoreValue}>2</Text>
                  <Text style={styles.scoreLabel2}>балла</Text>
                </Pressable>

                <Pressable
                  style={[styles.modalScore, styles.backColor1]}
                  onPress={() => {
                    setModalVisible(false);
                    setPairScore(modalData, 1);
                  }}
                >
                  <Text style={styles.scoreValue}>1</Text>
                  <Text style={styles.scoreLabel1}>балл</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backColor3: {
    backgroundColor: "#F97C23",
  },
  backColor2: {
    backgroundColor: "#F9D423",
  },
  backColor1: {
    backgroundColor: "#90C67B",
  },
  backColor0: {
    backgroundColor: GLOBALS.COLOR.GREY,
  },

  noGroupsText: {
    alignSelf: "center",
    position: "absolute",
    textAlign: "center",
    marginTop: 150,
    marginHorizontal: 20,
    color: GLOBALS.COLOR.LABEL,
    fontSize: 18,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingBottom: 10,
    alignItems: "center",
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalNumberView: {
    borderBottomWidth: 1,
    alignSelf: "stretch",
    alignItems: "center",
  },

  modalScoresView: {
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: 5,
    height: 100,
  },

  modalScore: {
    flex: 1,
    marginHorizontal: 5,
    paddingTop: 30,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  container: {
    flex: 1,
  },

  topView: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: GLOBALS.COLOR.LIGHTGREY,
  },

  bottomView: {
    flex: 1,
    backgroundColor: GLOBALS.COLOR.LIGHTGREY,
    flexDirection: "column",
  },

  groupName: {
    fontSize: 25,
    color: GLOBALS.COLOR.BLUE,
    textAlign: "center",
  },

  userRole: {
    fontSize: 15,
    color: GLOBALS.COLOR.BLUE,
    textAlign: "center",
  },

  item_container: {
    backgroundColor: GLOBALS.COLOR.LIGHTGREY,
    flexDirection: "column",
    flex: 0.5,
    justifyContent: "center",
    alignItems: "stretch",
  },

  item: {
    borderColor: GLOBALS.COLOR.DARKGREY,
    flexDirection: "column",
    backgroundColor: "white",
    borderWidth: 1,
    flex: 1,

    justifyContent: "center",
    alignItems: "stretch",
    margin: 15,

    borderRadius: 20,
    shadowColor: "#AAA",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.8,
    elevation: 2,
  },

  numberPlace: {
    flex: 3,
    alignItems: "center",
  },

  scorePlace: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 10,
  },

  pairNumber: {
    fontSize: 60,
    fontWeight: "500",
  },

  scoreValue: {
    fontSize: 28,
    fontWeight: "500",
  },

  scoreLabel3: {
    fontSize: 16,
    fontWeight: "500",
    color: "#954004",
  },

  scoreLabel2: {
    fontSize: 16,
    fontWeight: "500",
    color: "#957d04",
  },

  scoreLabel1: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3f6b2e",
  },

  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginVertical: 20,
    marginHorizontal: 16,
    borderRadius: 4,
    elevation: 3,
  },
  completeText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default RefPairsScreen;
