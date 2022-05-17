import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

const QrCodeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const GetUserName = ({ baseUrl }) => {
    return fetch(baseUrl)
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // 1. Validate scanned QR code
    if (!data.includes("Registration") && !data.includes("Referee")) {
      alert(`QR Code содержит не верную формат данных. Попробуйте еще раз.`);
      return;
    }

    // 2. Get user info from server (there is such user, )
    var userName = GetUserName(data);

    // 2. Update global varialbes
    // global.baseURL = data;
    // global.userType = data.includes("Registration")
    //   ? "Reg"
    //   : data.includes("Referee")
    //   ? "Ref"
    //   : "";

    // 2. Navigate  to Home screen
    // navigation.popToTop();
    // navigation.navigate("Link");
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    flexDirection: "row",
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: "#fff",
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 18,
  },
});

export default QrCodeScreen;
