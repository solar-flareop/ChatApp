import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { firebaseAuth } from "../config/firebase.config";
import { SET_USER_NULL } from "../context/actions/userActions";

const ProfileScreen = () => {
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await firebaseAuth.signOut();
    dispatch(SET_USER_NULL());
    navigation.replace("LoginScreen");
  };

  return (
    <SafeAreaView className="flex-1 items-center mt-2">
      {/* top buttons */}
      <View className="w-full flex-row justify-between items-center px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={28} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* profile */}
      <View className="items-center justify-center">
        <View className="relative border-2 border-primary p-1 rounded-full">
          <Image
            source={{ uri: user?.profilePic }}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>
        <Text className="text-xl font-semibold text-primaryBold pt-3 capitalize">
          {user?.fullName}
        </Text>
        <Text className="text-base font-semibold text-primaryText pt-3">
          {user?.providerData?.email}
        </Text>
      </View>

      {/* icons */}
      <View className="w-full flex-row items-center justify-center py-6 space-x-5">
        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <Feather name="message-square" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-sm py-1 text-primaryText">Message</Text>
        </View>
        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <Feather name="video" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-sm py-1 text-primaryText">Video call</Text>
        </View>
        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <Feather name="phone" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-sm py-1 text-primaryText">Call</Text>
        </View>
        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <Feather name="more-horizontal" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-sm py-1 text-primaryText">More</Text>
        </View>
      </View>

      {/* media shared */}
      <View className="w-full px-6 space-y-3">
        <View className=" w-full flex-row items-center justify-between">
          <Text className="text-base font-semibold text-primaryText">
            Media Shared
          </Text>
          <TouchableOpacity>
            <Text className="text-base uppercase font-semibold text-primaryText">
              View All
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* media image  */}
      <View className="w-full flex-row items-center justify-around mt-3">
        <TouchableOpacity className="w-24 h-24 rounded-xl m-1 bg-gray-300 overflow-hidden">
          <Image
            source={{
              uri: "https://shorturl.at/lRSV5",
            }}
            className="w-full h-full "
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TouchableOpacity className="w-24 h-24 rounded-xl m-1 bg-gray-300 overflow-hidden">
          <Image
            source={{
              uri: "https://shorturl.at/nFHXY",
            }}
            className="w-full h-full "
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TouchableOpacity className="w-24 h-24 rounded-xl m-1 bg-gray-300 overflow-hidden">
          <Image
            source={{
              uri: "https://shorturl.at/rDFN4",
            }}
            className="w-full h-full "
            resizeMode="cover"
          />
          <View className=" absolute w-full h-full items-center justify-center bg-transparent ">
            <Text className="text-xl font-bold text-gray-200">250+</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View className="mt-3 py-2 px-4 border border-white bg-primary rounded-xl">
        <TouchableOpacity
          className="flex-row justify-center items-center gap-3"
          onPress={handleLogout}
        >
          <SimpleLineIcons name="logout" size={20} color="black" />
          <Text className="font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
