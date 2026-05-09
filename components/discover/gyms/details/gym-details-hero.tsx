import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Gym } from "@/src/types/discover";
import { Gauge, MapPin, Sparkles, Star, type LucideIcon } from "lucide-react-native";
import { ImageBackground, View } from "react-native";

type GymDetailsHeroProps = {
  gym: Gym;
};

function GymDetailsHero({ gym }: GymDetailsHeroProps) {
  const [minGrade, maxGrade] = gym.gradeScaleRange;

  return (
    <View className="gap-0">
      <View className="relative h-72 overflow-hidden bg-muted">
        <ImageBackground
          source={{ uri: gym.imageUrl }}
          resizeMode="cover"
          className="h-full w-full"
        >
          <View className="absolute top-0 right-0 left-0">
            <GymHeroTags tags={gym.tags} />
          </View>
        </ImageBackground>
      </View>

      <View className="-mt-48 mx-4 gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-lg shadow-black/10">
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1 gap-2">
            <Text className="text-[30px] font-bold leading-9 text-foreground">{gym.name}</Text>
            <View className="flex-row items-center gap-1.5">
              <Icon as={MapPin} size={16} className="text-muted-foreground" strokeWidth={2.3} />
              <Text className="text-[14px] font-semibold leading-5 text-muted-foreground">
                {gym.city} · {gym.distanceKm.toFixed(1)} km
              </Text>
            </View>
          </View>
          <GymOpenStatus isOpenNow={gym.isOpenNow} />
        </View>

        {gym.description ? (
          <Text className="text-[14px] leading-6 text-muted-foreground">{gym.description}</Text>
        ) : null}

        <View className="flex-row gap-2">
          <GymHeroMetric tone="primary" icon={Star} label="Ocena" value={gym.rating.toFixed(1)} />
          <GymHeroMetric
            tone="strong"
            icon={Sparkles}
            label="Nowe"
            value={gym.newRoutesCount}
            detail="trasy"
          />
          <GymHeroMetric
            tone="plain"
            icon={Gauge}
            label="Poziom"
            value={`${minGrade}-${maxGrade}`}
          />
        </View>
      </View>
    </View>
  );
}

function GymHeroTags({ tags }: Pick<Gym, "tags">) {
  return (
    <View className="relative flex-row flex-wrap gap-1.5 p-3">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline" className="border-transparent bg-card px-3 py-1.5">
          <Text className="text-[11px] font-bold text-foreground">{tag}</Text>
        </Badge>
      ))}
    </View>
  );
}

function GymOpenStatus({ isOpenNow }: Pick<Gym, "isOpenNow">) {
  return (
    <View
      className={cn(
        "shrink-0 rounded-lg border px-3 py-2",
        isOpenNow ? "border-emerald-200 bg-emerald-100" : "border-border bg-background",
      )}
    >
      <Text
        className={cn("text-[12px] font-bold", isOpenNow ? "text-emerald-950" : "text-foreground")}
      >
        {isOpenNow ? "Otwarte teraz" : "Zamknięte teraz"}
      </Text>
    </View>
  );
}

function GymHeroMetric({
  tone,
  icon,
  label,
  value,
  detail,
}: {
  tone: "primary" | "strong" | "plain";
  icon: LucideIcon;
  label: string;
  value: string | number;
  detail?: string;
}) {
  const isPrimary = tone === "primary";
  const isStrong = tone === "strong";

  return (
    <View
      className={cn(
        "min-h-[104px] min-w-[88px] flex-1 justify-between rounded-lg border p-3",
        isPrimary && "border-primary bg-primary",
        isStrong && "border-foreground bg-foreground",
        tone === "plain" && "border-border bg-background",
      )}
    >
      <View className="gap-2">
        <Icon
          as={icon}
          size={15}
          className={cn(
            "text-foreground",
            isPrimary && "text-primary-foreground",
            isStrong && "text-background",
          )}
          strokeWidth={2.3}
        />
        <Text
          className={cn(
            "text-[11px] font-bold uppercase leading-4 tracking-normal text-muted-foreground",
            isPrimary && "text-primary-foreground",
            isStrong && "text-background",
          )}
        >
          {label}
        </Text>
      </View>
      <View>
        <Text
          className={cn(
            "text-[28px] font-bold leading-8 text-foreground",
            isPrimary && "text-primary-foreground",
            isStrong && "text-background",
          )}
        >
          {value}
        </Text>
        {detail ? (
          <Text
            className={cn(
              "text-[11px] font-bold uppercase leading-4 text-muted-foreground",
              isPrimary && "text-primary-foreground",
              isStrong && "text-background",
            )}
          >
            {detail}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export { GymDetailsHero };
