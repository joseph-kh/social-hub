import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Link href="/">Go to Home</Link>
      <Text>SignInScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
