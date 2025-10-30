import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import AccordionList from "../components/acordionList";

export default class Utilidades extends Component {
  render() {
    const sections = [
      { key: "arComprimido", title: "Ar Comprimido", icon: "construct-outline", alarmCount: 0, items: makeItems(4) },
      { key: "ups", title: "UPS / No-Break", icon: "battery-charging-outline", alarmCount: 1, items: makeItems(3) }, // vermelho
      { key: "gases", title: "Gases Industriais", icon: "color-filter-outline", alarmCount: 0, items: makeItems(3) },
      { key: "monitoramento", title: "Monitoramento", icon: "podium-outline", alarmCount: 0, items: makeItems(5) },
    ];

    return (
      <View style={styles.container}>
        <AccordionList sections={sections} colors={colors} />
      </View>
    );
  }
}

function makeItems(n) {
  const icons = ["construct-outline", "hardware-chip-outline", "flash-outline", "terminal-outline", "podium-outline"];
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
