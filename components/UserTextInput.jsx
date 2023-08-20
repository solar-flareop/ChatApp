import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const UserTextInput = ({ placeholder, isPass, setStateFunction }) => {
  const [value, setValue] = useState("");
  const [securePass, setSecurePass] = useState(true);
  const [icon, setIcon] = useState(null);

  const handleTextChange = (text) => {
    setValue(text);
    setStateFunction(value);
  };

  const handleVisibility = () => {
    setSecurePass(!securePass);
  };

  useLayoutEffect(() => {
    switch (placeholder) {
      case "Full Name":
        return setIcon("person");
      case "Email":
        return setIcon("email");
      case "Password":
        return setIcon("lock");
    }
  });

  return (
    <View
      className={`flex-row justify-between items-center border rounded-2xl border-gray-200 space-x-4 px-4 py-3 my-2`}
    >
      <MaterialIcons name={icon} size={24} color="#6c6d83" />
      <TextInput
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        secureTextEntry={isPass && securePass}
        autoCapitalize="none"
        className="flex-1 text-base text-primaryText font-semibold "
      />
      {isPass && (
        <TouchableOpacity onPress={handleVisibility}>
          <Entypo
            name={securePass ? "eye" : "eye-with-line"}
            size={24}
            color="#6c6d83"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserTextInput;
