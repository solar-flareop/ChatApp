import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";

const HomeScreen = () => {
  const user = useSelector((state) => state.user);
  console.log("user", user);
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;
