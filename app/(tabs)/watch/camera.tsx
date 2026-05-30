import VideoCamera from "@/components/watch/video-camera";
import { useIsFocused } from "@react-navigation/native";

//another page becasue of fullscreen
//page transitions, and route.back, etc
export default function Camera() {
  const isFocused = useIsFocused();
  return isFocused ? <VideoCamera /> : null;
}
