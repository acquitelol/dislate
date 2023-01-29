/**
 * Imports
 * @param { getByProps, getModule }: Functions used to filter and get modules from metro.
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 *               This is required in all TSX components, or Dislate will crash.
 * @param Debug: The main Debug Info page.
 */
import { getByProps, getModule } from "enmity/metro";
import { React, Toasts } from "enmity/metro/common";
import { Icons } from "../../common";
import { Debug } from "../Pages/Debug/";

/**
 * @param ActionSheet: The main ActionSheet component. This renders any type of @arg ActionSheet, but I'm going to render an @arg BottomSheetScrollView
 * @param BottomSheetScrollView: A scrollview component which is rendered inside an @arg ActionSheet, and can render anything inside itself.
 */
const ActionSheet = (getModule(x => x.default?.render?.name == "ActionSheet") ?? { default: { render: false }}).default.render;
const BottomSheetScrollView = getByProps("BottomSheetScrollView").BottomSheetScrollView;
const LazyActionSheet = getByProps("openLazy", "hideActionSheet")

export function renderActionSheet(onConfirm: Function, type: string) {
    /**
     * Opens an @arg ActionSheet to the user and passes an onConfirm and type of @arg Send because this is inside the Command, not Settings.
     */
    ActionSheet
        ? LazyActionSheet.openLazy(new Promise(r => r({ default: DebugInfoActionSheet })), "DebugInfoActionSheet", { onConfirm, type })
        : Toasts.open({ content: "You cannot open ActionSheets on this version! Upgrade to 163+", source: Icons.Failed })
}

export default function DebugInfoActionSheet({ onConfirm, type }) {
    /**
     * @returns @arg ActionSheet {scrollable}: Allows you to expand the actionsheet and scroll through it.
     */
    return <ActionSheet scrollable>
        <BottomSheetScrollView contentContainerStyle={{ marginBottom: 50 }}>
            <Debug onConfirm={onConfirm} type={type} />
        </BottomSheetScrollView>
    </ActionSheet>
}