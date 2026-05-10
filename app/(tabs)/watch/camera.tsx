import VideoCamera from "@/components/watch/video-camera";
import { useIsFocused } from "@react-navigation/native";

export default function Camera() {
  const isFocused = useIsFocused();
  return isFocused ? <VideoCamera /> : null;
}
