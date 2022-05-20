import React, { Component } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

export class InputLinkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { link: global.baseURL };

    console.log(`Link screen`);
  }

  render() {
    return (
      <View>
        <Text style={styles.userName}>
          {global.userInfo.lastName} {global.userInfo.firstName}
        </Text>
        <Text style={styles.userRole}>
          {global.userType == "Registration" ? "(Организатор)" : undefined}
          {global.userType == "Referee" ? "(Судья)" : undefined}
        </Text>
        {/* <TextInput
          style={styles.input}
          onChangeText={(link) => this.setState({ link })}
          value={this.state.link}
          placeholder="Введите ссылку"
        />
        <Button
          title="Перейти к парам"
          onPress={() =>
            // this.props.navigation.navigate("List", { link: this.state.link })
            {
              //alert(`Link: ${this.state.link}`);

              fetch(this.state.link)
                .then((res) => res.json())
                .then(
                  (result) => {
                    alert(`Result: ${result}`);
                  },
                  (error) => {
                    alert(`Error: ${error}`);
                  }
                )
                .catch((e) => {
                  alert(`Catch: ${e}`);
                });
            }
          }
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userName: {
    fontSize: 25,
    // color: "#428BCA",
    marginHorizontal: 12,
    marginTop: 12,
  },
  userRole: {
    fontSize: 15,
    // color: "#428BCA",
    marginLeft: 12,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
