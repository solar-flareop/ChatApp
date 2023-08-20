import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const UserTextInput = ({
  placeholder,
  isPass,
  setStateFunction,
  setGetEmailValidationStatus,
}) => {
  const [value, setValue] = useState("");
  const [securePass, setSecurePass] = useState(true);
  const [icon, setIcon] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleTextChange = (text) => {
    setValue(text);
    setStateFunction(value);

    //validate email
    if (placeholder === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const status = emailRegex.test(value);
      setIsEmailValid(status);
      setGetEmailValidationStatus(status);
    }
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
      className={`flex-row justify-between items-center border rounded-2xl  space-x-4 px-4 py-3 my-2 ${
        !isEmailValid && placeholder == "Email" && value.length > 0
          ? "border-red-500"
          : "border-gray-200"
      }`}
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
