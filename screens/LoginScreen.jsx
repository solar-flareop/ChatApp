import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { BGImage, Logo } from "../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { SET_USER } from "../context/actions/userActions";

const LoginScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const allDetails = email !== "" && password !== "";
      if (getEmailValidationStatus && allDetails) {
        const userCredentials = await signInWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );
        if (userCredentials) {
          const userDetails = await getDoc(
            doc(firestoreDB, "users", userCredentials.user.uid)
          );
          if (userDetails.exists()) {
            dispatch(SET_USER(userDetails.data()));
          }
        }
      }
    } catch (error) {
      setAlert(true);
      setAlertMessage("Invalid Credentials");

      //remove alert message
      setTimeout(() => {
        setAlert(false);
      }, 3000);
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

      {/* Main View */}
      <View
        className="w-full h-full bg-white -mt-44 rounded-tl-[90px] 
      flex justify-start  items-center space-y-4 p-6"
      >
        <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
        <Text className="text-primaryText text-xl font-semibold py-2">
          Welcome Back!
        </Text>

        <View className="w-full flex justify-center items-center ">
          {/* alert */}
          {alert && (
            <Text className="text-base text-red-600">{alertMessage}</Text>
          )}
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
            onPress={handleLogin}
          >
            <Text className="py-1 text-white text-base font-bold text-center">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* No Account */}
          <View className="w-full py-8 flex-row justify-center items-center space-x-2">
            <Text className="text-base text-primaryText">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <Text className="text-base text-primaryBold font-semibold">
                Create Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
