import { RecoilEnv, RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Cart, Detail, Favorite, Login, Profile, Register, Result, Search } from './Pages';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Image } from 'react-native';
import { useCallback, useEffect } from 'react';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Footer = () => {

  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={Login} options={{
        title: "", headerTitle: "로그인",
        tabBarIcon: () => (
          <Image style={{ marginTop: 10, width: 20, height: 20 }} source={require("./assets/login_icon.png")} />
        )
      }} />
      <Tab.Screen name="Search" component={Search} options={{
        title: "", headerTitle: "코스 생성",
        tabBarIcon: () => (
          <Image style={{ marginTop: 10, width: 20, height: 20 }} source={require("./assets/Search.png")} />
        )
      }} />
      <Tab.Screen name="Profile" component={Profile} options={{
        title: "", headerTitle: "마이페이지",
        tabBarIcon: () => (
          <Image style={{ marginTop: 10, width: 20, height: 20 }} source={require("./assets/User.png")} />
        )
      }} />

    </Tab.Navigator>
  )
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'NanumGothic': require("./assets/fonts/NanumGothic.ttf"),
    'BM-HANNAStd': require("./assets/fonts/BMHANNA.ttf"),
  });




  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator >
          <Stack.Screen name="Footer" component={Footer} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ title: "로그인" }} />
          <Stack.Screen name="Search" component={Search} options={{ title: "코스 생성" }} />
          <Stack.Screen name="Register" component={Register} options={{ title: "회원가입" }} />
          <Stack.Screen name="Result" component={Result} options={{ title: "검색 결과" }} />
          <Stack.Screen name="Detail" component={Detail} options={{ title: "결제" }} />
        </Stack.Navigator>

      </NavigationContainer>
    </RecoilRoot>

  );
}
