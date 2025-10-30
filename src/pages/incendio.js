import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import AccordionList from "../components/acordionList";

export default class Incendio extends Component {
  render() {
    const sections = [
      { key: "cenario1", title: "Cenário 1", icon: "flame-outline", alarmCount: 0, items: makeItems(3) },
      { key: "cenario2", title: "Cenário 2", icon: "flame-outline", alarmCount: 3, items: makeItems(4) }, // vermelho
      { key: "cenario3", title: "Cenário 3", icon: "flame-outline", alarmCount: 1, items: makeItems(5) }, // vermelho
      { key: "cenario4", title: "Cenário 4", icon: "flame-outline", alarmCount: 0, items: makeItems(2) },
    ];

    return (
      <View style={styles.container}>
        <AccordionList sections={sections} colors={colors} />
      </View>
    );
  }
}

function makeItems(n) {
  const icons = ["alert-circle-outline", "shield-outline", "flame-outline", "water-outline", "cube-outline"];
  return Array.from({ length: n }).map((_, i) => ({
    id: String(i + 1),
    title: `Título ${String(i + 1).padStart(2, "0")}`,
    icon: icons[i % icons.length],
  }));
}

const colors = {
            cardBg: "#dbeaffff",
            icon: "#000000ff",
            title: "#000000ff",
            chevron: "#030303ff",
            badgeBg: "rgba(27, 27, 27, 0.14)",
            badgeText: "#000000ff",

            alarmBg: "#ff3b30",
            alarmIcon: "#fff",
            alarmTitle: "#fff",
            alarmChevron: "#fff",
            badgeAlarmBg: "rgba(0,0,0,0.25)",

            itemIcon: "#9aa0a6",
            itemChevron: "#a1a1a1",
};
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#ffffffff" } });
