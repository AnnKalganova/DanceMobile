import React from "react";
import { Text, StyleSheet, View, Button } from "react-native";

const ExampleScreen = ({ navigation }) => {
  return (
    <View>
      <Text style={styles.text}>Hi There!!!</Text>
      <Button
        title="Go to Home screen"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
});

export default ExampleScreen;
