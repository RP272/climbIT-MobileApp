import { Icon } from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import gymsData from "@/src/data/gyms.json";
import { useSettingsStore, type ClimbingStyle } from "@/src/features/settings/settings.store";
import { useAuth } from "@/src/providers/auth-provider";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  EyeOff,
  LogOut,
  MapPin,
  Moon,
  Shield,
  Target,
  TriangleRight,
  Trophy,
  User,
} from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/signin");
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 96, 124) }}
    >
      <View className="gap-6 px-4 py-6">
        <View className="gap-2">
          <Text className="px-2 text-[13px] font-semibold uppercase leading-5 text-muted-foreground">
            Preferencje wspinaczkowe
          </Text>
          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <SettingSelectItem
              icon={MapPin}
              label="Domowa ściana"
              value={settings.homeGymId ?? undefined}
              onValueChange={(val) => settings.setHomeGymId(val)}
              options={gymsData.map((g) => ({ label: g.name, value: g.id }))}
              placeholder="Wybierz ścianę"
            />
            <View className="ml-10 h-[1px] bg-border" />
            <SettingSelectItem
              icon={Target}
              label="Preferowany styl"
              value={settings.climbingStyle}
              onValueChange={(val) => settings.setClimbingStyle(val as ClimbingStyle)}
              options={[
                { label: "Bouldering", value: "bouldering" },
                { label: "Linowe (Lead)", value: "lead" },
                { label: "Na czas (Speed)", value: "speed" },
              ]}
            />
          </View>
        </View>

        <View className="gap-2">
          <Text className="px-2 text-[13px] font-semibold uppercase leading-5 text-muted-foreground">
            Konto
          </Text>
          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <SettingItem icon={User} label="Edytuj profil" />
            <View className="ml-10 h-[1px] bg-border" />
            <SettingItem icon={Shield} label="Bezpieczeństwo" />
          </View>
        </View>

        <View className="gap-2">
          <Text className="px-2 text-[13px] font-semibold uppercase leading-5 text-muted-foreground">
            Prywatność i Rankingi
          </Text>
          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <SettingToggleItem
              icon={EyeOff}
              label="Prywatny profil"
              value={settings.privateProfile}
              onValueChange={settings.setPrivateProfile}
            />
            <View className="ml-10 h-[1px] bg-border" />
            <SettingToggleItem
              icon={Trophy}
              label="Ukryj w rankingach ścian"
              value={settings.hideInLocalRankings}
              onValueChange={settings.setHideInLocalRankings}
            />
          </View>
        </View>

        <View className="gap-2">
          <Text className="px-2 text-[13px] font-semibold uppercase leading-5 text-muted-foreground">
            Powiadomienia
          </Text>
          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <SettingToggleItem
              icon={Bell}
              label="Zezwalaj na powiadomienia"
              value={settings.notificationsEnabled}
              onValueChange={settings.setNotificationsEnabled}
            />
            {settings.notificationsEnabled && (
              <>
                <View className="ml-10 h-[1px] bg-border" />
                <SettingToggleItem
                  icon={TriangleRight}
                  label="Nowe nakrętki na domowej"
                  value={settings.notifyNewRoutes}
                  onValueChange={settings.setNotifyNewRoutes}
                />
                <View className="ml-10 h-[1px] bg-border" />
                <SettingToggleItem
                  icon={Target}
                  label="Przypomnienie m. tygodnia"
                  value={settings.notifyWeeklyGoal}
                  onValueChange={settings.setNotifyWeeklyGoal}
                />
              </>
            )}
          </View>
        </View>

        <View className="gap-2">
          <Text className="px-2 text-[13px] font-semibold uppercase leading-5 text-muted-foreground">
            Aplikacja
          </Text>
          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <SettingToggleItem
              icon={Moon}
              label="Tryb ciemny"
              value={settings.darkMode}
              onValueChange={settings.setDarkMode}
            />
          </View>
        </View>

        <View className="gap-2">
          <Text className="px-2 text-[13px] font-semibold uppercase leading-5 text-muted-foreground">
            Inne
          </Text>
          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <Pressable
              className="flex-row items-center gap-3 bg-card px-4 py-3.5 active:bg-muted/70"
              onPress={handleSignOut}
            >
              <Icon as={LogOut} size={20} className="text-destructive" strokeWidth={2} />
              <Text className="flex-1 text-[16px] font-medium leading-5 text-destructive">
                Wyloguj się
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function SettingItem({ icon, label }: { icon: any; label: string }) {
  return (
    <Pressable className="flex-row items-center gap-3 bg-card px-4 py-3.5 active:bg-muted/70">
      <Icon as={icon} size={20} className="text-foreground" strokeWidth={2} />
      <Text className="flex-1 text-[16px] font-medium leading-5 text-foreground">{label}</Text>
      <Icon as={ChevronRight} size={20} className="text-muted-foreground" strokeWidth={2} />
    </Pressable>
  );
}

function SettingToggleItem({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: any;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center gap-3 bg-card px-4 py-3">
      <Icon as={icon} size={20} className="text-foreground" strokeWidth={2} />
      <Text className="flex-1 text-[16px] font-medium leading-5 text-foreground">{label}</Text>
      <Switch checked={value} onCheckedChange={onValueChange} />
    </View>
  );
}

function SettingSelectItem({
  icon,
  label,
  value,
  onValueChange,
  options,
  placeholder = "Wybierz",
}: {
  icon: any;
  label: string;
  value?: string;
  onValueChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  return (
    <View className="flex-row items-center gap-3 bg-card px-4 py-3 pr-2">
      <Icon as={icon} size={20} className="text-foreground" strokeWidth={2} />
      <Text className="flex-1 text-[16px] font-medium leading-5 text-foreground">{label}</Text>
      <Select
        value={
          value
            ? { value, label: options.find((o) => o.value === value)?.label ?? value }
            : undefined
        }
        onValueChange={(item) => {
          if (item) onValueChange(item.value);
        }}
      >
        <SelectTrigger className="w-auto min-w-[120px] max-w-[170px] border-none shadow-none justify-end gap-1 px-2 h-auto py-1">
          <SelectValue className="text-[15px] text-muted-foreground" placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent insets={{ top: 0, bottom: 0, left: 0, right: 0 }} className="w-64">
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} label={opt.label} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  );
}
