import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { PERSONAL_STATUS_CONFIG } from "@/src/types/all-routes.constants";
import type { RouteViewModel } from "@/src/types/all-routes.types";
import type { Gym } from "@/src/types/discover";
import { Gauge, MapPin, Sparkles, Star, type LucideIcon } from "lucide-react-native";
import { ImageBackground, View } from "react-native";

type RouteDetailsHeroProps = {
  routeViewModel: RouteViewModel;
  gym?: Gym | null;
};

function RouteDetailsHero({ routeViewModel, gym }: RouteDetailsHeroProps) {
  const { route, color, personalStatus, communityGrade, rating } = routeViewModel;
  const statusConfig = PERSONAL_STATUS_CONFIG[personalStatus];
  const heroTags = [
    route.climbingTypeLabel,
    ...route.styleTags,
    ...(route.routeStatuses.includes("new") ? ["Nowość"] : []),
    ...(route.routeStatuses.includes("popular") ? ["Popularna"] : []),
  ].slice(0, 4);

  return (
    <View className="gap-0">
      <View className="relative h-72 overflow-hidden bg-muted">
        <ImageBackground
          source={{ uri: route.imageUrl }}
          resizeMode="cover"
          className="h-full w-full"
        >
          <View className="absolute inset-0 bg-black/15" />

          <View className="absolute top-0 left-0 right-0 flex-row items-start justify-between gap-3 p-3">
            <View className="flex-1 flex-row flex-wrap gap-1.5">
              {heroTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-transparent bg-card px-3 py-1.5"
                >
                  <Text className="text-[11px] font-bold text-foreground">{tag}</Text>
                </Badge>
              ))}
            </View>

            <View
              className={cn(
                "flex-row items-center gap-1.5 rounded-lg border px-3 py-1.5",
                color.surfaceClassName,
              )}
            >
              <View className={cn("h-2.5 w-2.5 rounded-full", color.dotClassName)} />
              <Text className={cn("text-[11px] font-extrabold", color.textClassName)}>
                {color.label}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View className="-mt-48 mx-4 gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-lg shadow-black/10">
        <View className="gap-2">
          <View className="flex-row items-start justify-between gap-3">
            <Text className="text-[30px] font-bold leading-9 text-foreground min-w-0 flex-1">
              {route.name}
            </Text>
            <Badge
              variant="outline"
              className={cn("rounded-lg px-3 py-2 shrink-0", statusConfig.className)}
            >
              <Icon
                as={statusConfig.icon}
                size={12}
                className={statusConfig.textClassName}
                strokeWidth={2.5}
              />
              <Text className={cn("text-[11px] font-bold", statusConfig.textClassName)}>
                {statusConfig.label}
              </Text>
            </Badge>
          </View>

          <View className="flex-row items-center gap-1.5">
            <Icon as={MapPin} size={16} className="text-muted-foreground" strokeWidth={2.3} />
            <Text className="text-[14px] font-semibold leading-5 text-muted-foreground flex-1">
              {route.gymName}
              {gym ? ` · ${gym.city}` : ""}
              {route.sector ? ` · ${route.sector}` : ""}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          <RouteHeroMetric tone="primary" icon={Gauge} label="Setter" value={route.grade} />
          <RouteHeroMetric
            tone="strong"
            icon={Sparkles}
            label="Społeczność"
            value={communityGrade}
          />
          <RouteHeroMetric
            tone="plain"
            icon={Star}
            label="Ocena"
            value={`${rating.toFixed(1)}/5`}
          />
        </View>
      </View>
    </View>
  );
}

function RouteHeroMetric({
  tone,
  icon,
  label,
  value,
}: {
  tone: "primary" | "strong" | "plain";
  icon: LucideIcon;
  label: string;
  value: string | number;
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
            "text-[10px] font-bold uppercase leading-tight text-muted-foreground",
            isPrimary && "text-primary-foreground",
            isStrong && "text-background",
          )}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {label}
        </Text>
      </View>

      <Text
        className={cn(
          "text-[28px] font-bold leading-none text-foreground",
          isPrimary && "text-primary-foreground",
          isStrong && "text-background",
        )}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
}

export { RouteDetailsHero };
