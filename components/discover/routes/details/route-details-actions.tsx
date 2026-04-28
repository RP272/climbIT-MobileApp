import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { RouteViewModel, UserRouteStatus } from "@/src/types/all-routes.types";
import { Bookmark, Building2, CheckCircle2 } from "lucide-react-native";
import { View } from "react-native";

type RouteDetailsActionsProps = {
  routeViewModel: RouteViewModel;
  onLogAscent: (routeId: string) => void;
  onProjectToggle: (routeId: string, currentStatus: UserRouteStatus) => void;
  onGymPress: () => void;
};

function RouteDetailsActions({
  routeViewModel,
  onLogAscent,
  onProjectToggle,
  onGymPress,
}: RouteDetailsActionsProps) {
  const { route, personalStatus } = routeViewModel;
  const isCompleted = personalStatus === "top" || personalStatus === "flash";
  const isProject = personalStatus === "project";

  return (
    <View className="gap-2">
      <Button
        className="h-12 rounded-lg"
        onPress={() => onLogAscent(route.id)}
        disabled={isCompleted}
      >
        <Icon as={CheckCircle2} size={16} className="text-primary-foreground" strokeWidth={2.4} />
        <Text className="text-[13px] font-bold text-primary-foreground">
          {isCompleted ? "Zapisane" : "Dodaj przejście"}
        </Text>
      </Button>

      <View className="flex-row gap-2">
        <Button
          variant={isProject ? "default" : "outline"}
          className={cn(
            "h-12 flex-1 rounded-lg",
            isProject ? "border-transparent" : "border-border/70 bg-background",
          )}
          onPress={() => onProjectToggle(route.id, personalStatus)}
          accessibilityState={{ selected: isProject }}
        >
          <Icon
            as={Bookmark}
            size={16}
            className={isProject ? "text-primary-foreground" : "text-foreground"}
            strokeWidth={2.4}
          />
          <Text
            className={cn(
              "text-[13px] font-bold",
              isProject ? "text-primary-foreground" : "text-foreground",
            )}
          >
            {isProject ? "Na później" : "Zapisz na później"}
          </Text>
        </Button>

        <Button variant="outline" className="h-12 flex-1 rounded-lg" onPress={onGymPress}>
          <Icon as={Building2} size={16} className="text-foreground" strokeWidth={2.4} />
          <Text className="text-[13px] font-bold text-foreground">Ścianka</Text>
        </Button>
      </View>
    </View>
  );
}

export { RouteDetailsActions };
