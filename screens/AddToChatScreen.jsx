import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const AddToChatScreen = () => {
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const [addToChat, setAddToChat] = useState("");

  const createNewChat = async () => {
    try {
      let id = `${Date.now()}`;
      const _doc = {
        _id: id,
        user: user,
        chatName: addToChat,
      };

      if (addToChat !== "") {
        const newChat = await setDoc(doc(firestoreDB, "chats", id), _doc);
        setAddToChat("");
        navigation.replace("HomeScreen");
      }
    } catch (error) {
      Alert.alert("Error Message", "Try again!");
      console.log("Error msg", error);
    }
  };
  return (
    <View className="flex-1">
      {/* green bar */}
      <View className="w-full bg-primary px-4 py-4 flex-[0.25]">
        {/* back and profile pic */}
        <View className="flex-row items-center justify-between w-full px-3 py-8">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={24} color="#fbfbfb" />
          </TouchableOpacity>

          <View className="flex-row items-center justify-center space-x-3">
            <Image
              source={{ uri: user?.profilePic }}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* chats */}
      <KeyboardAvoidingView className="flex-1">
        <View className="w-full bg-white flex-1 rounded-3xl px-4 py-6 rounded-t-[50px] -mt-10">
          <View className="w-full px-2 py-4">
            <View className="w-full px-3 py-3 flex-row justify-between items-center rounded-xl border border-gray-200 ">
              {/* icon */}
              <Ionicons name="chatbubbles" size={24} color="#777" />
              {/* textinput */}
              <TextInput
                value={addToChat}
                onChangeText={(text) => setAddToChat(text)}
                placeholder="Start a chat"
                placeholderTextColor={"#999"}
                className="text-lg text-primaryText h-8  ml-1 w-full flex-1"
              />
              {/* icon */}
              <TouchableOpacity onPress={createNewChat}>
                <FontAwesome name="send" size={24} color="#777" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddToChatScreen;
