import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useLayoutEffect } from "react";
import { Logo } from "../assets";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { SET_USER } from "../context/actions/userActions";

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    checkLoggedUser();
  }, []);

  const checkLoggedUser = () => {
    firebaseAuth.onAuthStateChanged(async (userCredentials) => {
      if (userCredentials && userCredentials.uid) {
        // Checking if userCredentials is not null
        const userDocRef = doc(firestoreDB, "users", userCredentials.uid);
        try {
          const getUserDetails = await getDoc(userDocRef);

          if (getUserDetails.exists()) {
            dispatch(SET_USER(getUserDetails.data()));
            // console.log("User details:", getUserDetails.data());
            setTimeout(() => {
              navigation.replace("HomeScreen");
            }, 2000);
          } else {
            // console.log("User details not found.");
            navigation.replace("LoginScreen");
          }
        } catch (error) {
          console.error("Error getting user details:", error);
        }
      } else {
        // console.log("User not logged in.");
        navigation.replace("LoginScreen");
      }
    });
  };

  return (
    <View className="flex-1 items-center justify-center space-y-24">
      <Image source={Logo} className="w-24  h-24 " resizeMode="contain" />
      <ActivityIndicator size={"large"} color={"#43c651"} />
    </View>
  );
};

export default SplashScreen;
