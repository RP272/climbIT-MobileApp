import { View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

export default function VideoReel() {
  const player = useVideoPlayer(require("../../src/data/video_preview1.mp4"), (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View className="bg-red-500 h-screen w-screen">
      <VideoView
        contentFit="cover"
        nativeControls={false}
        player={player}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
