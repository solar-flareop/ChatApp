import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../assets";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const HomeScreen = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [chats, setChats] = useState(null);

  useEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    );
    const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
      const chatRooms = querySnapshot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="w-full flex-row justify-between items-center px-4 py-2">
        <Image source={Logo} className="w-12 h-12 " resizeMode="contain" />
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileScreen")}
          className="w-12 h-12 rounded-full border border-primary flex  justify-center items-center "
        >
          <Image
            source={{ uri: user?.profilePic }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* chat section */}
      <ScrollView
        className="w-full pt-4 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="w-full">
          {/* message title */}
          <View className="flex-row justify-between items-center px-2">
            <Text className="text-primaryText text-base font-extrabold pb-2">
              Messages
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddToChatScreen")}
            >
              <Ionicons name="chatbox" size={28} color="#555" />
            </TouchableOpacity>
          </View>

          {/* chat rooms */}

          {isLoading ? (
            <View>
              <ActivityIndicator size={"large"} color={"#43c651"} />
            </View>
          ) : (
            <>
              {chats && chats.length > 0 ? (
                <>
                  {chats?.map((room) => (
                    <MessageCard key={room._id} room={room} />
                  ))}
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const MessageCard = ({ room }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatScreen", { room: room })}
      className="w-full flex-row items-center py-2"
    >
      {/* image */}
      <View className="w-14 h-14 rounded-full p-1 border-2 border-primary flex items-center justify-center">
        <MaterialIcons name="groups" size={28} color="#555" />
      </View>

      {/* text area */}
      <View className="flex-1 flex items-start justify-center ml-4 ">
        <Text className="text-base font-semibold capitalize text-[#333]">
          {room.chatName}
        </Text>
        <Text className="text-primaryText text-sm">
          Lorem ipsum dolor sit amet,elit. Quia numquam voluptate, vero ?
        </Text>
      </View>

      {/* time */}
      <Text className="text-primary text-sm font-semibold px-1 ">27 min</Text>
    </TouchableOpacity>
  );
};
export default HomeScreen;
