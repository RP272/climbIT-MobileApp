import { ScrollView, View } from "react-native";
import VideoReel from "@/components/watch/video-reel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function WatchScreen() {
  const router = useRouter();

  return (
    <View className="relative">
      <Button
        className="z-10 absolute right-4 bottom-32 bg-accent rounded-full p-0 w-16 h-16"
        onPress={() => router.navigate("(tabs)/watch/camera")}
      >
        <Plus size={30} />
      </Button>
      <ScrollView pagingEnabled showsVerticalScrollIndicator={false} className="w-screen">
        <VideoReel />
        <VideoReel />
        <VideoReel />
      </ScrollView>
    </View>
  );
}
