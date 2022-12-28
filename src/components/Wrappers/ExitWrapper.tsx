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
 * @param {TSX} component: The component to render inside of the @arg ScrollView.
 */
export default ({component}) => {
    /**
     * Sets a state which will represent the X and Y amount of scrolling of the user.
     * @param {Getter, Setter}: The X position change of your finger.
     * @param {Getter, Setter}: The Y position change of your finger.
     */
    const [touchX, setTouchX] = React.useState()
    const [touchY, setTouchY] = React.useState()

    return <ScrollView
        onTouchStart={(e: any) => {
            /**
             * At the start of the Touch, set the starting value of the tap.
             * @param {float} pageX: The X value of your finger when you begin tapping
             * @param {float} pageY: The Y value of your finger when you begin tapping
             */
            setTouchX(e.nativeEvent.pageX)
            setTouchY(e.nativeEvent.pageY)
        }}
        onTouchEnd={e => {
            /**
             * This will only trigger if the finger has not moved more than -100 units on the X axis, and more than -40 units but less than 40 units on the Y axis.
             * @param { touchX, touchX}: The user's starting position.
             * @param e.nativeEvent.pageX: The current X position, which will be subtracted from the starting position to find the difference
             * @param e.nativeEvent.pageY: The current Y position, which will be subtracted from the starting position to find the difference
             */
            (touchX - e.nativeEvent.pageX < -100) && (touchY - e.nativeEvent.pageY < 40) && (touchY - e.nativeEvent.pageY > -40)
                ? Navigation.pop()
                : null
        }}
    >
        {component}
    </ScrollView>
}