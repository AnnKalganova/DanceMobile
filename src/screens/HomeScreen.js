import React from "react";
import { Text, StyleSheet, View, Image, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  console.log(`Home screen`);

  return (
    <View style={styles.view}>
      <Image style={styles.image} source={require("../../assets/pair.png")} />
      {/* <Pressable
        style={styles.button}
        onPress={() => {
          navigation.navigate("QrCode");
        }}
      >
        <MaterialCommunityIcons name="qrcode-scan" style={styles.btn_icon} />
        <Text style={styles.btn_text}>Сканировать</Text>
      </Pressable> */}
      {ScanButton(navigation)}
      {/* {MainButton(navigation, "QrCode", "qrcode-scan", "Сканировать")} */}
    </View>
  );
};

const ScanButton = (navigation) => {
  return (
    <Pressable
      style={styles.pressable_button}
      onPress={() => {
        navigation.navigate("QrCode");
      }}
    >
      <MaterialCommunityIcons name="qrcode-scan" style={styles.btn_icon} />
      <Text style={styles.btn_text}>Сканировать</Text>
    </Pressable>
  );
};

const MainButton = (navigation, screen, icon, title) => {
  return (
    <Pressable
      style={styles.pressable_link}
      onPress={() => {
        navigation.navigate(screen);
      }}
    >
      {icon != null ? (
        <MaterialCommunityIcons name={icon} style={styles.lnk_icon} />
      ) : null}
      <Text style={styles.lnk_text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: "white",
    height: "100%",
    paddingTop: 150,
  },
  image: {
    alignSelf: "center",
  },

  pressable_link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 25,
    marginTop: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    borderColor: "#428BCA",
    borderWidth: 1,
  },
  lnk_icon: {
    fontSize: 35,
    color: "#428BCA",
    paddingRight: 15,
  },
  lnk_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "#428BCA",
  },

  pressable_button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 25,
    marginTop: 100,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#428BCA",
  },
  btn_icon: {
    fontSize: 35,
    color: "white",
    paddingRight: 15,
  },
  btn_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default HomeScreen;
