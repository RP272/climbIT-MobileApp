import { ScrollView, View } from "react-native";
import VideoReel from "@/components/watch/video-reel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import Camera from "@/components/watch/camera";
import { useIsFocused } from "@react-navigation/native";

export default function WatchScreen() {
  const isFocused = useIsFocused();
  return isFocused ? <Camera /> : null;

  return (
    <View className="relative">
      <Button className="z-10 absolute right-4 bottom-32 bg-accent rounded-full p-0 w-16 h-16">
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
