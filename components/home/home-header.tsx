import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { calculateLevelContext } from "@/src/features/profile/profile-level.utils";
import type { ClimberResponseDto, FacilityResponseDto } from "@/src/types/api";
import { Building2, ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";

type HomeHeaderProps = {
  profile?: ClimberResponseDto;
  facility?: FacilityResponseDto;
  onPress: () => void;
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Dzień dobry";
  }

  if (hour < 18) {
    return "Cześć";
  }

  return "Dobry wieczór";
}

export function HomeHeader({ profile, facility, onPress }: HomeHeaderProps) {
  const nickname = profile?.nickname?.trim() || "Wspinaczu";
  const initials = nickname.substring(0, 2).toUpperCase();
  const points = profile?.totalPoints ?? 0;
  const levelContext = calculateLevelContext(points);

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-[28px] border border-border bg-card p-4 active:opacity-95"
    >
      <View className="flex-row items-center gap-3">
        <View className="relative">
          <Avatar alt={nickname} className="size-16 border-2 border-primary/30 bg-muted">
            {profile?.profilePhotoUrl ? (
              <AvatarImage source={{ uri: profile.profilePhotoUrl }} />
            ) : null}
            <AvatarFallback className="bg-muted">
              <Text className="text-lg font-bold text-foreground">{initials}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="absolute -bottom-1 right-0 rounded-md border border-card bg-primary px-1.5 py-0.5">
            <Text className="text-[9px] font-bold text-primary-foreground">
              LVL {levelContext.level}
            </Text>
          </View>
        </View>

        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-sm text-muted-foreground">{getGreeting()},</Text>
          <Text className="text-xl font-extrabold text-foreground" numberOfLines={1}>
            {nickname}
          </Text>
          {facility?.name ? (
            <View className="flex-row items-center gap-1">
              <Icon as={Building2} size={13} className="text-muted-foreground" strokeWidth={2.2} />
              <Text className="min-w-0 flex-1 text-xs text-muted-foreground" numberOfLines={1}>
                {facility.name}
              </Text>
            </View>
          ) : null}
        </View>

        <Icon as={ChevronRight} size={20} className="text-muted-foreground" strokeWidth={2.2} />
      </View>

      <View className="mt-4 gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold text-muted-foreground">Postęp poziomu</Text>
          <Text className="text-xs font-bold text-foreground">{points} pkt</Text>
        </View>
        <Progress value={levelContext.progressPercent} className="h-2" />
        <Text className="text-[11px] text-muted-foreground">
          {levelContext.xpToNextLevel} pkt do poziomu {levelContext.level + 1}
        </Text>
      </View>
    </Pressable>
  );
}
