import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import AccordionList from "../components/acordionList";

export default class Hidraulica extends Component {
  render() {
    const sections = [
      { key: "bombas", title: "Bombas", icon: "water-outline", alarmCount: 2, items: makeItems(5) }, // vermelho
      { key: "tanques", title: "Tanques", icon: "beaker-outline", alarmCount: 0, items: makeItems(3) },
      { key: "valvulas", title: "Válvulas", icon: "git-branch-outline", alarmCount: 1, items: makeItems(4) }, // vermelho
      { key: "mangotinhos", title: "Mangotinhos", icon: "fitness-outline", alarmCount: 0, items: makeItems(6) },
    ];

    return (
      <View style={styles.container}>
        <AccordionList sections={sections} colors={colors} />
      </View>
    );
  }
}

function makeItems(n) {
  const icons = ["color-fill-outline", "water-outline", "cube-outline", "construct-outline", "hammer-outline"];
  return Array.from({ length: n }).map((_, i) => ({
    id: String(i + 1),
    title: `Título ${String(i + 1).padStart(2, "0")}`,
    icon: icons[i % icons.length],
  }));
}

const colors={
            cardBg: "#dbeaffff",
            icon: "#000000ff",
            title: "#000000ff",
            chevron: "#030303ff",
            badgeBg: "rgba(0, 0, 0, 0.14)",
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
