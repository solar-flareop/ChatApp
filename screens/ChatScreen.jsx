import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  doc,
  query,
  serverTimestamp,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const ChatScreen = ({ route }) => {
  const { room } = route.params;
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messagesArray, setMessagesArray] = useState(null);
  const textInputRef = useRef(null);
  const handleKeyboardOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const sendMessage = async () => {
    try {
      const timeStamp = serverTimestamp();
      const id = `${Date.now()}`;
      const _doc = {
        _id: id,
        roomId: room._id,
        timeStamp: timeStamp,
        message: message,
        user: user,
      };
      setMessage("");
      await addDoc(
        collection(doc(firestoreDB, "chats", room._id), "messages"),
        _doc
      );
    } catch (error) {
      Alert.alert("Error Message", "Try again!");
      console.log("Error msg", error);
    }
  };

  //get chats from firestore
  useEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );
    const unsubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      const updatedMessage = querySnapshot.docs.map((doc) => doc.data());
      setMessagesArray(updatedMessage);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <View className="flex-1">
      {/* green bar */}
      <View className="w-full bg-primary px-4 py-4 flex-[0.2]">
        {/* back and profile pic */}
        <View className="flex-row items-center justify-between w-full  py-8 space-x-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={24} color="#fbfbfb" />
          </TouchableOpacity>

          <View className="flex-row items-center justify-center space-x-3">
            <View className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <FontAwesome name="users" size={24} color="#fbfbfb" />
            </View>
            <View>
              <Text className="capitalize text-base font-semibold text-gray-50">
                {room.chatName.length > 16
                  ? `${room.chatName.slice(0, 16)}..`
                  : room.chatName}
              </Text>
              <Text className="capitalize text-sm font-semibold text-gray-100">
                Online
              </Text>
            </View>
          </View>

          <View className="flex-row justify-center items-center space-x-3">
            <TouchableOpacity>
              <Feather name="video" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="phone" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={24} color="#fbfbfb" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* chats area*/}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={160}
      >
        <ScrollView>
          {isLoading ? (
            <View>
              <ActivityIndicator size={"large"} color={"#43c651"} />
            </View>
          ) : (
            <>
              {
                // reciever

                messagesArray?.map((msg, i) =>
                  msg?.user?.providerData.email === user?.providerData.email ? (
                    <View className="m-2" key={i}>
                      <View
                        style={{ alignSelf: "flex-end" }}
                        className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-primary w-auto relative"
                      >
                        <Text className="text-base font-normal text-white">
                          {msg.message}
                        </Text>
                      </View>
                      <View style={{ alignSelf: "flex-end" }}>
                        {msg?.timeStamp?.seconds && (
                          <Text className="text-xs">
                            {new Date(
                              parseInt(msg?.timeStamp?.seconds) * 1000
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </Text>
                        )}
                      </View>
                    </View>
                  ) : (
                    // sender

                    <View key={i} style={{ alignSelf: "flex-start" }}>
                      <View className="flex-row justify-center items-center">
                        {/* image */}
                        <Image
                          className="w-10 h-10 rounded-full"
                          resizeMode="contain"
                          source={{ uri: msg?.user?.profilePic }}
                        />

                        {/* text msg */}
                        <View className="m-2">
                          <View className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-gray-200 w-auto relative">
                            <Text className="text-base font-normal text-black">
                              {msg.message}
                            </Text>
                          </View>
                          <View style={{ alignSelf: "flex-start" }}>
                            {msg?.timeStamp?.seconds && (
                              <Text className="text-xs">
                                {new Date(
                                  parseInt(msg?.timeStamp?.seconds) * 1000
                                ).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                )
              }
            </>
          )}
        </ScrollView>

        {/* bottom keyboard */}
        <View className="w-full flex-row justify-center items-center px-8 pb-2">
          <View className="bg-gray-200 rounded-2xl px-4 py-2 space-x-4 flex-row justify-center items-center">
            <TouchableOpacity onPress={handleKeyboardOpen}>
              <Entypo name="emoji-happy" size={24} color="#555" />
            </TouchableOpacity>
            <TextInput
              value={message}
              onChangeText={(text) => setMessage(text)}
              placeholder="Type here..."
              placeholderTextColor={"#999"}
              className="flex-1 h-6 text-base text-primaryText font-semibold"
            />
            <TouchableOpacity>
              <Entypo name="mic" size={24} color="#43c653" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="pl-4" onPress={sendMessage}>
            <FontAwesome name="send" size={24} color="#555" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;
