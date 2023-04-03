import { getByProps, getModule } from "enmity/metro";
import { React, Toasts } from "enmity/metro/common";
import { Icons } from "../../common";
import { ActionSheetProps } from "../../def";
import { Debug } from "../Pages/Debug/";

const ActionSheet = (getModule(x => x.default?.render?.name === "ActionSheet") ?? { default: { render: false }}).default.render;
const BottomSheetScrollView = getByProps("BottomSheetScrollView").BottomSheetScrollView;
const LazyActionSheet = getByProps("openLazy", "hideActionSheet")

export function renderActionSheet({ onConfirm, type }: ActionSheetProps) {
    ActionSheet
        ? LazyActionSheet.openLazy(new Promise(r => r({ default: DebugInfoActionSheet })), "DebugInfoActionSheet", { onConfirm, type })
        : Toasts.open({ content: "You cannot open ActionSheets on this version! Upgrade to 163+", source: Icons.Failed })
}

export default function DebugInfoActionSheet({ onConfirm, type }: ActionSheetProps) {
    return <ActionSheet scrollable>
        <BottomSheetScrollView contentContainerStyle={{ marginBottom: 50 }}>
            <Debug onConfirm={onConfirm} type={type} />
        </BottomSheetScrollView>
    </ActionSheet>
}