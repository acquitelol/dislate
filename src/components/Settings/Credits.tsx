/** 
 * Imports
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param Constants: Used for colors and font weight etc...
 * @param StyleSheet: Used to create style sheets for React components
 * @param {bulk, filters}: Used to import modules in bulk
 * @param TouchableOpacity: Adds an opacity effect upon pressing it.
 * @param View: Allows you to create a closure to place components inside of.
 * @param Image: Allows you to render an image from @arg require or a @arg uri.
 * @param Text: Allows you to render text.
 * @param { toast, debug_info, fetch_debug_arguments, map_item, shadow }: Functions which will be used throughout the script.
 */
import { React, Constants, StyleSheet } from 'enmity/metro/common';
import { bulk, filters } from 'enmity/metro';
import { TouchableOpacity, View, Image, Text} from 'enmity/components';
import { toast, debug_info, fetch_debug_arguments, map_item, shadow } from '../../utils';

/** 
 * This is the main 'Animated' component of React Native, but for some reason its not exported in Enmity's dependencies so I'm importing it manually.
 * @param Animated: The main 'Animated' component of React Native.
 * @ts-ignore */
const Animated = window.enmity.modules.common.Components.General.Animated

/** 
 * Main modules being fetched by the plugin to open links externally and copy text to clipboard
 * @param Router: This is used to open a url externally with @arg Router.openURL ~
 * @param Clipboard: This is used to copy any string to clipboard with @arg Clipboard.setString ~
 */
const [
    Router,
    Clipboard,
] = bulk(
    filters.byProps('transitionToGuild'),
    filters.byProps('setString'),
);

 /** 
  * Main credits component.
  * @returns {TSX ~ Fragmented View}
  * 
  * @property @param {string} name: The name of the plugin, which is Dislate in this case.
  * @property @param {string} version: The version of the plugin, this can vary.
  * @property @param {object} plugin: Different data involving the plugin such as the plugin's base download link and build.
  * @property @param {object}: List of authors, their Discord ID, and their GitHub profile. This will be mapped and displayed on the list.
  */
export default ({name, version, plugin, authors}): void => {
    /**
     * This is the main Style Sheet. All of the components used in this function will use this stylesheet.
     * @param {(constant)any} styles: The main stylesheet.
     */
    const styles = StyleSheet.createThemedStyleSheet({
        /**
         * Main container style. This would likely be used in the @arg View or @arg Subviews
         */
        container: {
            marginTop: 25,
            marginLeft: '5%',
            marginBottom: -15,
            flexDirection: "row"
        },
        /**
         * Main style for the text container, to allow multiple @arg {<Text>} components to render inline.
         */
        text_container: {
            paddingLeft: 15,
            paddingTop: 5,
            flexDirection: 'column',
            flexWrap: 'wrap',
            ...shadow
        },
        /**
         * Style for the @arg {<Image>} component. Pretty self explanatory.
         */
        image: {
            width: 75,
            height: 75,
            borderRadius: 10,
            ...shadow
        },
        /**
         * Styles shared between the @arg Main text and the @arg Subtitle text.
         */
        main_text: {
            opacity: 0.975,
            letterSpacing: 0.25
        },
        /**
         * Style used for only the @arg {Main Text} component. Involes a @arg bold weight and @arg primary color.
         * Also involes a larger @arg fontSize and @arg letterSpacing
         */
        header: {
            color: Constants.ThemeColorMap.HEADER_PRIMARY,
            fontFamily: Constants.Fonts.DISPLAY_BOLD,
            fontSize: 25,
            letterSpacing: 0.25
        },
        /**
         * Style used for only the @arg {Subtitle Text} components. Involes a @arg normal weight (@arg bold was omitted) and @arg secondary color.
         * Additionally, the @arg fontSize is larger but not as large as @arg {Main Text} component
         */
        sub_header: {
            color: Constants.ThemeColorMap.HEADER_SECONDARY,
            fontSize: 12.75,
        }
    });

    /** 
     * Use React to create a new Ref with @arg Animated
     * @param {React.useRef} animated_button_scale: The main animation scale ref.
     */
    const animated_button_scale = React.useRef(new Animated.Value(1)).current

    /**
     * Move @param animated_button_scale to @arg {1.1}, in @arg {250ms} with the @arg spring easing type.
     * @returns {void}
     */
    const onPressIn = (): void => Animated.spring(animated_button_scale, {
            toValue: 1.1,
            duration: 10,
            useNativeDriver: true,
    }).start();

    /**
     * Move @param animated_button_scale back to @arg {1}, in @arg {250ms} with the @arg spring easing type.
     * @returns {void}
     */
    const onPressOut = (): void => Animated.spring(animated_button_scale, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
    }).start();

    /**
     * Opens the Repository of @arg Dislate externally, using the @arg Router provided before.
     * @returns {void}
     */
    const onPress = (): void => Router.openURL(plugin.repo);

    /** 
     * The main animated style, which is going to be modified by the Animated property.
     * @param {object{transform[]}} animated_scale_style: The main scale style applied to the element which has the scale.
     */
    const animated_scale_style = {
        transform: [
            {
                scale: animated_button_scale
            }
        ]
    }
    
    /** 
     * Main component
     * @returns {~ fragment closure}
     */
    return <>
        {/**
         * The main @arg View closure. This contains all of the elements.
         * @uses @arg styles.container
         */}
        <View style={styles.container}>
            {/**
             * The main @arg Image of the plugin. Wrapped in a @arg TouchableOpacity to add a bit of extra motion on press.
             * @uses @arg {uri https://i.imgur.com/rl1ga06.png}
             */}
            <TouchableOpacity 
                /** 
                 * Main events which can be fired from the image.
                 * @param {onPress} onPress: Opens the repo of @arg Dislate externally
                 * @param {onPressIn} onPressIn: Triggers when the @arg Image is held down, and scales in the image to @arg {1.1} times its normal scale.
                 * @param {onPressOut} onPressOut: Triggers when the @arg Image is has stopped being pressed, and scales out the image back to its normal scale (@arg {1}).
                 */
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                {/**
                 * The main Animated view of the image.
                 * This uses @arg Animated.View instead of @arg View as it is required for the animated scale to work.
                 * @uses @arg animated_scale_style
                 */}
                <Animated.View style={animated_scale_style}>
                    <Image
                        style={[styles.image]}
                        source={{
                            /**
                             * The image used for the @arg Image.
                             * @param uri: Can be either a @arg URI, which is what is provided, or it can be a @arg require.
                             */
                            uri: 'https://i.imgur.com/rl1ga06.png', 
                        }}
                    />
                </Animated.View>
            </TouchableOpacity>
            {/**
             * The main text container. This is where all of the details from @arg manifest.json are going to be used.
             * @uses @arg styles.text_container
             */}
            <View style={styles.text_container}>
                {/**
                 * This is the main title text. Pressing on it opens the repo of @arg Dislate externally.
                 * @param name: The name of the plugin. In this case its @arg Dislate.
                 * @uses @arg {[styles.main_text, styles.header]} as_style_array
                 */}
                <TouchableOpacity onPress={(): void => Router.openURL(plugin.repo)}>
                    <Text style={[styles.main_text, styles.header]}>
                        {name}
                    </Text>
                </TouchableOpacity>
                {/**
                 * This is the main element which displays the @arg Authors of the plugin, and opens their GitHub profile.
                 * If there's more than 1 user, add a comma between them until the last user.
                 * @uses @arg {{flexDirection: 'row'}} styling
                 */}
                <View style={{flexDirection: 'row'}}>
                    {/**
                     * @uses @arg {[styles.main_text, styles.sub_header]}
                     */}
                    <Text style={[styles.main_text, styles.sub_header]}>
                        A project by 
                    </Text>
                    {/**
                      * Loops through an array of objects and returns a @arg {TSX} element for each iteration
                      * @param authors: The list of authors for the plugin. In this case its only 1, but its scaleable.
                      * @param {() => {}}: The callback to run for each iteration
                            * @uses @arg author: The main author object, which contains @arg name, @arg id, and @arg profile.
                            * @uses @arg index: The index of the iteration
                            * @uses @arg authors_array: The array of authors, as a reference. It is better practice to use it from the callback rather than the object passed to the function.
                      */}
                    {map_item(authors, (author, index: number, authors_array: any[]) => { 
                        return <TouchableOpacity onPress={(): void => Router.openURL(author.profile)}> 
                            {/**
                             * Main text element.
                             * @uses @arg {[styles.main_text, styles.sub_header, {paddingLeft: 4, fontFamily: Constants.Fonts.DISPLAY_BOLD, flexDirection: 'row'}]} styling
                             * 
                             * @param {string} author.name: The author's... name.
                             * @param {number} index: The current iteration of the loop.
                             * @param authors_array: The array passed from the callback.
                             */}
                            <Text 
                                style={[styles.main_text, styles.sub_header, {
                                    paddingLeft: 4,
                                    fontFamily: Constants.Fonts.DISPLAY_BOLD,
                                    flexDirection: 'row'
                            }]}>
                                    {author.name}{index < (authors_array.length - 1)?",":null}
                            </Text>
                        </TouchableOpacity>
                    })}
                </View>
                <View>
                    {/**
                     * Other section in the component. This shows the @param version.
                     * @param version: The current version in @arg manifest.json
                     */}
                    <TouchableOpacity
                        /**
                         * Displays the text inline.
                         * @uses @arg {flexDirection: 'row'}
                         */
                        style={{flexDirection: 'row'}}

                        /**
                         * As this function copies @arg all of the debug arguments to clipboard, it fetches them from an @async function
                         * @param options: The list of debug elements, which are all passed to the @func debug_info function.
                         * @func clipboard_toast: Shows a toast saying that the text provided has been copied to clipboard.
                         */
                        onPress={async function() {
                            const options = await fetch_debug_arguments()
                            Clipboard.setString(await debug_info(Object.keys(options)));
                            toast('debug information', 'clipboard')
                        }}
                    >
                        {/**
                         * Inner text of the @arg {<TouchableOpacity>}.
                         * @uses @arg {[styles.main_text, styles.sub_header]} styling
                         */}
                        <Text style={[styles.main_text, styles.sub_header]}>
                            Version: 
                        </Text>

                        {/**
                         * Shows the current latest version in @arg manifest.json
                         * @param version: Latest version in @arg manifest.json
                         * @uses @arg {[styles.main_text, styles.sub_header, { paddingLeft: 4, fontFamily: Constants.Fonts.DISPLAY_BOLD }]} styling
                         */}
                        <Text 
                            style={[styles.main_text, styles.sub_header, {
                                paddingLeft: 4,
                                fontFamily: Constants.Fonts.DISPLAY_BOLD
                            }]} >
                                {version}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </>
}