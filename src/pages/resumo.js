// src/pages/jardinagem.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Resumo extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Tela Resumo</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});
