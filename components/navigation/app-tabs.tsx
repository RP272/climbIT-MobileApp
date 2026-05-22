import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { House, Map, Plus, Trophy, User, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { TabRouteName } from "@/src/types/navigation";

const TAB_DEFINITIONS = [
  { name: "home", title: "Główna", icon: House },
  { name: "discover", title: "Odkryj", icon: Map },
  { name: "add", title: "Dodaj", icon: Plus },
  { name: "ranking", title: "Ranking", icon: Trophy },
  { name: "profile", title: "Profil", icon: User },
];

const TAB_ICON_MAP: Record<TabRouteName, LucideIcon> = {
  home: House,
  discover: Map,
  add: Plus,
  ranking: Trophy,
  profile: User,
};

function TabsNavbar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom - 6, 10);

  return (
    <View className="absolute inset-x-4" style={{ bottom: tabBarBottom }}>
      <View className="h-[68px] flex-row items-center rounded-[24px] border border-border bg-card px-1 pb-2 pt-1 shadow-md">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const icon = TAB_ICON_MAP[route.name as TabRouteName];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : typeof options.title === "string"
                ? options.title
                : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center gap-0.5 py-0.5 active:opacity-85"
            >
              <View
                className={cn(
                  "h-9 w-9 items-center justify-center rounded-full",
                  isFocused ? "bg-primary/12" : "bg-transparent",
                )}
              >
                <Icon
                  as={icon}
                  size={20}
                  strokeWidth={isFocused ? 2.5 : 2}
                  className={cn(isFocused ? "text-primary" : "text-muted-foreground")}
                />
              </View>
              <Text
                className={cn(
                  "text-[11px] font-semibold leading-4",
                  isFocused ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function AppTabs() {
  return (
    <Tabs tabBar={(props) => <TabsNavbar {...props} />} screenOptions={{ headerShown: false }}>
      {TAB_DEFINITIONS.map((tab) => {
        return <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title }} />;
      })}
    </Tabs>
  );
}
