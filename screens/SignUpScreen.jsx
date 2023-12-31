import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { BGImage, Logo } from "../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { avatars } from "../utils/supports";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUpScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]?.image?.asset?.url);
  const [isAvatarMenu, setIsAvatarMenu] = useState(false);
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const navigation = useNavigation();

  const handleAvatar = (item) => {
    setAvatar(item?.image?.asset?.url);
    setIsAvatarMenu(false);
  };

  const handleSignUp = async () => {
    try {
      const allDetails = email !== "" && password !== "";
      if (getEmailValidationStatus && allDetails) {
        const userCredentails = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );

        //add to firestoreDB
        const data = {
          _id: userCredentails?.user.uid,
          fullName: name,
          profilePic: avatar,
          providerData: userCredentails?.user?.providerData[0],
        };

        await setDoc(
          doc(firestoreDB, "users", userCredentails?.user.uid),
          data
        );
        navigation.navigate("LoginScreen");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 justify-start items-center">
      <Image
        source={BGImage}
        resizeMode="cover"
        className="h-96"
        style={{ width: screenWidth }}
      />

      {/* Avatar List Window */}
      {isAvatarMenu && (
        <>
          <View className="absolute inset-0 z-10 w-full h-full">
            <ScrollView>
              <BlurView
                tint="light"
                intensity={100}
                className="w-full h-full flex-row justify-evenly items-center flex-wrap py-10 px-4"
              >
                {avatars.map((item) => (
                  <TouchableOpacity
                    key={item?._id}
                    onPress={() => handleAvatar(item)}
                    className="w-20 m-3 h-20 p-1 rounded-full  border-2 border-primary relative"
                  >
                    <Image
                      source={{ uri: item?.image?.asset?.url }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </BlurView>
            </ScrollView>
          </View>
        </>
      )}

      {/* Main View */}
      <View
        className="w-full h-full bg-white -mt-44 rounded-tl-[90px] 
      flex justify-start  items-center space-y-3 p-6"
      >
        <Image source={Logo} className="w-10 h-10" resizeMode="contain" />
        <Text className="text-primaryText text-xl font-semibold">
          Join with Us!
        </Text>

        {/* Avatar */}
        <View className="-my-2">
          <TouchableOpacity
            onPress={() => setIsAvatarMenu(true)}
            className="w-20 h-20 p-1 rounded-full border-2 border-primary relative"
          >
            <Image
              source={{ uri: avatar }}
              className="h-full w-full"
              resizeMode="contain"
            />
            <View className="w-6 h-6 bg-primary rounded-full flex justify-center items-center absolute top-0 right-0">
              <MaterialIcons name="edit" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="w-full flex justify-center items-center ">
          {/* alert */}

          {/* full name */}
          <UserTextInput
            placeholder="Full Name"
            isPass={false}
            setStateFunction={setName}
          />

          {/* email */}
          <UserTextInput
            placeholder="Email"
            isPass={false}
            setStateFunction={setEmail}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />

          {/* password */}
          <UserTextInput
            placeholder="Password"
            isPass={true}
            setStateFunction={setPassword}
          />

          {/* login button */}
          <TouchableOpacity
            className="w-full rounded-xl bg-primary my-3 px-4 py-2 "
            onPress={handleSignUp}
          >
            <Text className="py-1 text-white text-base font-bold text-center">
              Sign Up
            </Text>
          </TouchableOpacity>

          {/* No Account */}
          <View className="w-full py-4 flex-row justify-center items-center space-x-2">
            <Text className="text-base text-primaryText">
              Already having a account!
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-base text-primaryBold font-semibold">
                Login Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
