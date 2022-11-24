/**
 * Imports
 * @param ScrollView: A basic View component which allows you to scroll.
 * @param Navigation: Used to pop the top level page in the stack.
 * @param React: The main React "library" used for native functions in Enmity as used for React Native.
 */
import { ScrollView } from "enmity/components"
import { Navigation, React } from "enmity/metro/common"

/**
 * Wrapper for any components which require ability to swipe right to close.
 * @param Component: The component to render inside of the @arg ScrollView.
 */
export default ({Component}) => {
    /**
     * Sets a state which will represent the X and Y amount of scrolling of the user.
     * @param {Getter, Setter}: The X position change of your finger.
     * @param {Getter, Setter}: The Y position change of your finger.
     */
    const [touch_x, set_touch_x] = React.useState()
    const [touch_y, set_touch_y] = React.useState()

    return <ScrollView
        onTouchStart={(e: any) => {
            /**
             * At the start of the Touch, set the starting value of the tap.
             * @param pageX: The X value of your finger when you begin tapping
             * @param pageY: The Y value of your finger when you begin tapping
             */
            set_touch_x(e.nativeEvent.pageX)
            set_touch_y(e.nativeEvent.pageY)
        }}
        onTouchEnd={e => {
            /**
             * This will only trigger if the finger has not moved more than -100 units on the X axis, and more than -40 units but less than 40 units on the Y axis.
             * @param { touch_x, touch_y}: The user's starting position.
             * @param e.nativeEvent.pageX: The current X position, which will be subtracted from the starting position to find the difference
             * @param e.nativeEvent.pageY: The current Y position, which will be subtracted from the starting position to find the difference
             */
            (touch_x - e.nativeEvent.pageX < -100) && (touch_y - e.nativeEvent.pageY < 40) && (touch_y - e.nativeEvent.pageY > -40)
                ? Navigation.pop()
                : null
        }}
    >
        {Component}
    </ScrollView>
}