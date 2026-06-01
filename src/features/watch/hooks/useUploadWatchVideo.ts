import { publishWatchReel } from "@/src/api/watch.api";
import { watchKeys } from "@/src/features/watch/hooks/useWatchReels";
import type { PublishWatchReelPayload } from "@/src/types/watch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadWatchVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PublishWatchReelPayload) => publishWatchReel(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: watchKeys.reels() });
    },
  });
}
