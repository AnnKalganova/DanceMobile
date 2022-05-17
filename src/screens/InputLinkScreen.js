import React, { Component } from "react";
import { View, Button, TextInput, StyleSheet } from "react-native";

export class InputLinkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { link: "" };
  }

  render() {
    return (
      <View>
        <TextInput
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
              alert(`Link: ${this.state.link}`);

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
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
