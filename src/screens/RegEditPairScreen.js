import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GLOBALS from "../../Globals";

const RegEditPairScreen = ({ navigation }) => {
  const pair = navigation.getParam("pair");

  const [pairNumber, onChangePairNumber] = React.useState(null);
  const [p1LastName, onChangeP1LastName] = React.useState(null);
  const [p1FirstName, onChangeP1FirstName] = React.useState(null);
  const [p2LastName, onChangeP2LastName] = React.useState(null);
  const [p2FirstName, onChangeP2FirstName] = React.useState(null);

  useEffect(() => {
    if (pair != null) {
      onChangePairNumber("" + (pair.number == null ? "" : pair.number));
      onChangeP1LastName(pair.partner1LastName);
      onChangeP1FirstName(pair.partner1FirstName);
      onChangeP2LastName(pair.partner2LastName);
      onChangeP2FirstName(pair.partner2FirstName);
    }
  }, []);

  const validateForm = () => {
    let message = "";
    let isValid = false;

    if (p1LastName.trim() == "") {
      message = "Необходимо ввести фамилию партнера.";
    } else if (p1FirstName.trim() == "") {
      message = "Необходимо ввести имя партнера.";
    } else if (p2LastName.trim() == "") {
      message = "Необходимо ввести фамилию партнерши.";
    } else if (p2FirstName.trim() == "") {
      message = "Необходимо ввести имя партнерши.";
    } else {
      isValid = true;
    }

    if (!isValid) {
      Alert.alert("Ошибка!", message, [
        {
          text: "OK",
        },
      ]);
    }

    return isValid;
  };

  onSavePress = () => {
    if (!validateForm()) return;

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: pair.id,
        groupId: pair.groupId,
        partner1FirstName: p1FirstName.trim(),
        partner1LastName: p1LastName.trim(),
        partner2FirstName: p2FirstName.trim(),
        partner2LastName: p2LastName.trim(),
        number: pairNumber,
      }),
    };

    fetch(global.baseURL + "/" + pair.id, requestOptions)
      .then(
        (result) => {
          if (result.status == 204) {
            navigation.goBack();
          } else {
            Alert.alert("Ошибка!", "Код ошибки: " + result.status, [
              {
                text: "OK",
              },
            ]);
          }
        },
        (error) => {
          console.log(
            "Fetch ERROR:",
            "Response Body -> " + JSON.stringify(error)
          );
        }
      )
      .catch((e) => console.log(e));
  };

  const onDeletePress = () => {
    Alert.alert("Внимание!", "Вы действительно хотите удалить пару?", [
      {
        text: "Да",
        onPress: () => {
          deletePair();
        },
      },
      {
        text: "Нет",
      },
    ]);
  };

  const deletePair = () => {
    const requestOptions = {
      method: "DELETE",
    };

    fetch(global.baseURL + "/" + pair.id, requestOptions)
      .then(
        (result) => {
          if (result.status == 204) {
            navigation.goBack();
          } else {
            Alert.alert("Ошибка!", "Код ошибки: " + result.status, [
              {
                text: "OK",
              },
            ]);
          }
        },
        (error) => {
          console.log(
            "Fetch ERROR:",
            "Response Body -> " + JSON.stringify(error)
          );
        }
      )
      .catch((e) => console.log(e));
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <TextInput
        style={styles.pairNumber}
        onChangeText={onChangePairNumber}
        value={pairNumber}
        placeholder="#"
        keyboardType="number-pad"
      />
      <Text style={styles.label}>ПАРТНЕР</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeP1LastName}
        value={p1LastName}
        placeholder="Фамилия"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeP1FirstName}
        value={p1FirstName}
        placeholder="Имя"
      />
      <Text style={styles.label}>ПАРТНЕРША</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeP2LastName}
        value={p2LastName}
        placeholder="Фамилия"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeP2FirstName}
        value={p2FirstName}
        placeholder="Имя"
      />

      <Pressable
        style={styles.saveButton}
        onPress={() => {
          onSavePress();
        }}
      >
        <Text style={styles.saveText}>Сохранить</Text>
      </Pressable>

      <Pressable
        style={styles.deleteButton}
        onPress={() => {
          onDeletePress();
        }}
      >
        <Text style={styles.deleteText}>Удалить</Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },

  pairNumber: {
    padding: 5,
    fontSize: 64,
    fontWeight: "500",
    textAlign: "center",
    borderWidth: 1,
    borderColor: GLOBALS.COLOR.DARKGREY,
  },

  label: {
    fontSize: 18,
    fontWeight: "700",
    color: GLOBALS.COLOR.LABEL,
    marginTop: 20,
  },

  input: {
    marginTop: 5,
    padding: 5,
    fontSize: 20,
    fontWeight: "500",
    borderWidth: 1,
    borderColor: GLOBALS.COLOR.DARKGREY,
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: GLOBALS.COLOR.HEADERBLUE,
  },
  saveText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 4,
    elevation: 3,
    borderColor: "#D9534F",
    borderWidth: 1,
  },
  deleteText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "#D9534F",
  },

  text: {
    fontSize: 30,
  },
});

export default RegEditPairScreen;
