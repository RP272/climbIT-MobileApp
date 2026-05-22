import { View, Text } from "react-native";

export default function Welcome() {
  return (
    <View className="gap-8 pt-2">
      <Text className="font-bold text-2xl mb-2">Hej! 👋</Text>

      <View className="text-xl">
        <Text className="text-xl">Zanim przejdziemy dalej,</Text>
        <Text className="text-xl">opowiedz nam trochę o swoim doświadczeniu</Text>
      </View>

      <Text className="text-center" style={{ fontSize: 100 }}>
        🧗🧗‍♂️🧗‍♀️
      </Text>
    </View>
  );
}
