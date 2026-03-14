import { Tabs } from "expo-router";
import { House, Map, Plus, Trophy, User, type LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { DARK_THEME, LIGHT_THEME } from "@/theme";

type TabRouteName = "home" | "walls" | "add" | "ranking" | "profile";

type TabDefinition = {
  name: TabRouteName;
  title: string;
  icon: LucideIcon;
};

const TAB_DEFINITIONS: TabDefinition[] = [
  { name: "home", title: "Home", icon: House },
  { name: "walls", title: "Walls", icon: Map },
  { name: "add", title: "Add", icon: Plus },
  { name: "ranking", title: "Ranking", icon: Trophy },
  { name: "profile", title: "Profile", icon: User },
];

function withOpacity(hexColor: string, opacity: string) {
  return `${hexColor}${opacity}`;
}

function TabIcon({ color, focused, icon }: { color: string; focused: boolean; icon: LucideIcon }) {
  return (
    <View
      className={cn(
        "h-9 w-9 items-center justify-center rounded-full",
        focused ? "bg-primary/12" : "bg-transparent",
      )}
    >
      <Icon
        as={icon}
        className={cn(focused ? "text-primary" : "")}
        color={focused ? undefined : color}
        size={20}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  const tabBarHeight = 68;
  const tabBarBottom = Math.max(insets.bottom - 6, 10);
  const inactiveTintColor = withOpacity(theme.colors.text, isDark ? "B3" : "99");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          height: tabBarHeight,
          paddingTop: 4,
          paddingBottom: 8,
          marginHorizontal: 16,
          marginBottom: tabBarBottom,
          borderRadius: 24,
          borderTopWidth: 0,
          borderWidth: 1,
          backgroundColor: withOpacity(theme.colors.card, isDark ? "F5" : "FE"),
          borderColor: withOpacity(theme.colors.border, isDark ? "D9" : "80"),
          position: "absolute",
          elevation: 10,
          shadowColor: "#000000",
          shadowOpacity: isDark ? 0.24 : 0.1,
          shadowRadius: 18,
          shadowOffset: {
            width: 0,
            height: 6,
          },
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      {TAB_DEFINITIONS.map((tab) => {
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon color={color} focused={focused} icon={tab.icon} />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
