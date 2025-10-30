import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import AccordionList from "../components/acordionList";

export default class Eletrica extends Component {
  render() {
    const sections = [
      {
        key: "concessionaria",
        title: "Concessionária",
        icon: "business-outline",
        alarmCount: 0,            // ✅ sem alarme = card normal
        items: makeItems(5),
      },
      {
        key: "geradores",
        title: "Geradores",
        icon: "flash-outline",
        alarmCount: 2,            // ✅ alarme -> card vermelho
        items: makeItems(6),
      },
      {
        key: "transformadores",
        title: "Transformadores",
        icon: "server-outline",
        alarmCount: 1,            // ✅ alarme -> card vermelho
        items: makeItems(4),
      },
      {
        key: "jatos",
        title: "Jatos Ventiladores",
        icon: "aperture-outline",
        alarmCount: 0,
        items: makeItems(3),
      },
      {
        key: "iluminacao",
        title: "Iluminação",
        icon: "bulb-outline",
        alarmCount: 0,
        items: makeItems(8),
      },
    ];

    return (
      <View style={styles.container}>
        <AccordionList
          sections={sections}
          colors={{
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
          }}
        />
      </View>
    );
  }
}

function makeItems(n) {
  const icons = [
    "ellipse-outline",
    "radio-button-off-outline",
    "square-outline",
    "bookmark-outline",
    "layers-outline",
    "construct-outline",
    "cog-outline",
    "flash-outline",
  ];
  return Array.from({ length: n }).map((_, i) => ({
    id: String(i + 1),
    title: `Título ${String(i + 1).padStart(2, "0")}`,
    icon: icons[i % icons.length],
  }));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff" },
});
