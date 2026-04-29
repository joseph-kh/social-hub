import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const OfferDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Link href="/">Go to Home</Link>
      <Text>OfferDetailScreen</Text>
    </View>
  );
};

export default OfferDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
