import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons"; 

export default function AccordionList({ sections = [], colors = {} }) {
  const [openKeys, setOpenKeys] = useState({});
  const toggle = (key) => setOpenKeys((p) => ({ ...p, [key]: !p[key] }));

  return (
    <View style={styles.wrapper}>
      {sections.map((s) => {
        const isOpen = !!openKeys[s.key];
        const hasAlarm = (s.alarmCount || 0) > 0;

        return (
          <View key={s.key} style={styles.cardWrap}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => toggle(s.key)}
              style={[
                styles.cardHeader,
                { backgroundColor: hasAlarm ? (colors.alarmBg || "#ff3b30") : (colors.cardBg || "#1c1c1e") },
              ]}
            >
              <View style={styles.headerLeft}>
                <Ionicons
                  name={s.icon || "folder-outline"}
                  size={24} // ícone maior
                  color={hasAlarm ? (colors.alarmIcon || "#fff") : (colors.icon || "#ff9f0a")}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={[
                    styles.title,
                    { color: hasAlarm ? (colors.alarmTitle || "#fff") : (colors.title || "#fff") },
                  ]}
                  numberOfLines={1}
                >
                  {s.title}
                </Text>
              </View>

              <View style={styles.headerRight}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: hasAlarm ? (colors.badgeAlarmBg || "rgba(0,0,0,0.25)") : (colors.badgeBg || "rgba(255,255,255,0.14)") },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: hasAlarm ? "#fff" : (colors.badgeText || "#ddd") }]}>
                    {s.alarmCount || 0}
                  </Text>
                </View>
                <Ionicons
                  name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
                  size={22}
                  color={hasAlarm ? (colors.alarmChevron || "#fff") : (colors.chevron || "#c7c7cc")}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.itemsWrapper}>
                {s.items?.map((it) => (
                  <TouchableOpacity key={it.id} style={styles.itemRow} activeOpacity={0.7} onPress={() => s.onItemPress?.(it, s)}>
                    <Ionicons name={it.icon || "ellipse-outline"} size={20} color={colors.itemIcon || "#9aa0a6"} style={{ marginRight: 12 }} />
                    <Text style={styles.itemText}>{it.title}</Text>
                    <Ionicons name="chevron-forward-outline" size={18} color={colors.itemChevron || "#000000ff"} style={{ marginLeft: "auto" }} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 16, paddingBottom: 32 },
  cardWrap: { marginBottom: 14, borderRadius: 14, overflow: "hidden" },
  cardHeader: {
    width: "100%",
    minHeight: 70, // ✅ altura mínima de 70px
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 8 },
  title: { fontSize: 18, fontWeight: "800" }, // ✅ letras maiores
  headerRight: { flexDirection: "row", alignItems: "center" },
  badge: { minWidth: 36, height: 28, paddingHorizontal: 10, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  badgeText: { fontSize: 18, fontWeight: "800" },
  itemsWrapper: { backgroundColor: "#ffffffff", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#ffffffff" },
  itemRow: {
    minHeight: 56, // ✅ linhas maiores
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#9a9a9aff",
  },
  itemText: { fontSize: 16, fontWeight: "600", color: "#656565ff" },
});
