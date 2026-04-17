import { FiltersForm } from "@/components/discover/filters/filters-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import type { DiscoverFilterActions } from "@/src/features/discover/hooks/useDiscoverFilters";
import type { DiscoverFilters } from "@/src/types/discover-filters";
import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

type FiltersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: DiscoverFilters;
  actions: DiscoverFilterActions;
};

function FiltersDialog({ open, onOpenChange, filters, actions }: FiltersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[88vh] gap-0 overflow-hidden rounded-3xl p-0"
      >
        <DialogHeader className="relative z-10 overflow-visible px-5 pb-5 pt-5 text-left">
          <BlurView
            intensity={28}
            tint="default"
            pointerEvents="none"
            style={StyleSheet.absoluteFillObject}
          />
          <View className="absolute inset-0 bg-background/85" pointerEvents="none" />
          <View
            className="absolute -bottom-6 left-0 right-0 h-3 bg-background/40"
            pointerEvents="none"
          />
          <View
            className="absolute -bottom-3 left-0 right-0 h-3 bg-background/65"
            pointerEvents="none"
          />

          <View className="flex-row items-center justify-between gap-4">
            <DialogTitle className="text-xl font-bold tracking-tight">Filtry</DialogTitle>
            <DialogClose
              accessibilityLabel="Zamknij filtry"
              className="size-9 items-center justify-center rounded-full bg-muted/70 active:bg-muted"
              hitSlop={10}
            >
              <Icon as={X} size={18} className="text-muted-foreground" strokeWidth={2.4} />
            </DialogClose>
          </View>
        </DialogHeader>

        <FiltersForm filters={filters} actions={actions} onApply={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

export { FiltersDialog };
export type { FiltersDialogProps };
