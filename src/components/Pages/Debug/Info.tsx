/**
 * Imports
 * @param get: Fetches a setting from a file.
 * @param { FormDivider }: Used to render Form Items on the screen.
 * @param Text: Used to render styleable text on the screen.
 * @param TouchableOpacity: Used to render a component child inside of this component, but adds a small opacity effect upon press.
 * @param getByName: Allows you to fetch a component from Discord.
 * @param StyleSheet: Used to create React Native StyleSheeets, for styling components.
 * @param Constants: Used for constant values which may differ between themes like colors and font weights.
 * @param name: The name of the plugin, from @arg manifest.json
 * @param { * from common }: Utility functions used throughout the component.
 * @param DebugItem: A component to render a toggleable option state. This is its own component so that it can have independent state.
 */
import { get } from 'enmity/api/settings';
import { FormDivider, Text, TouchableOpacity, View } from 'enmity/components';
import { getByName, getByProps } from 'enmity/metro';
import { Constants, React, StyleSheet, Theme } from 'enmity/metro/common';
import { name } from '../../../../manifest.json';
import { ArrayImplementations as ArrayOps, Miscellaneous, Debug, Format, Store, Icons } from '../../../common';
import InfoItem from './InfoItem';
import Dialog from '../../Modals/Dialog';
import SectionWrapper from '../../Wrappers/SectionWrapper';
import { ScrollView } from 'enmity/components';
import { Toasts } from 'enmity/metro/common';

/**
 * The main Search module, used to input text and store it. This is easy to make from scratch, but because Discord already made one I might aswell use it.
 * @param Search: The main Search Bar component
 */
const Search = getByName("StaticSearchBarContainer");
const LazyActionSheet = getByProps("openLazy", "hideActionSheet");

/**
 * Main Info Page Component
 * @param onConfirm: The function to run when the User clicks @arg {Send} All or @arg {Send} Message. This is usually a promise resolve.
 */
export default ({ onConfirm, type }) => {
    /**
     * Main states used throughout the component to allow storing options and the possible search query.
     * @param {Getter, Setter} options: The list of available options, populated by the @arg React.useEffect
     * @param {Getter, Setter} query: The query that has been searched with the Search module.
     */
    const [options, setOptions] = React.useState<string[]>([]);
    const [query, setQuery] = React.useState<string>("");

    /**
     * Use an asynchronous call to fetch the available debug arguments, on the first mount of the component to not cause any refetching on re-renders.
     * @param {returns string[]} fetchDebugArguments: Gets a list of debug arguments.
     */
    React.useEffect(async function() {
        setOptions(await Debug.fetchDebugArguments());
    }, []);

    /**
     * @param {StyleSheet} styles: StyleSheet of generic styles used throughout the component.
     */
    const styles = StyleSheet.createThemedStyleSheet({
        /**
         * @param {object} button: The main button styling, to make it look cute and pretty :D
         * The values for @arg width, @arg marginLeft, and @arg marginRight may seem quite random, but the margins are just (100 (%) - @arg width) / 2 each. This evenly splits the available space on each side of the button.
         */
        button: {
            width: '42.5%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Constants.ThemeColorMap.HEADER_PRIMARY,
            borderRadius: 10,
            marginLeft: '5%',
            marginTop: 20,
            marginBottom: 5
        },
        /**
         * @param {object} buttonContainer: Container for the buttons to @arg {*} All or @arg {*} Message
         * This sets the @arg flexDirection to row, so the button will render next to eachother.
         */
        buttonContainer: {
            flexDirection: 'row',
        },
        /**
         * @param {object} text: The main styling for the text component
         * 
         * @func filterColor: Takes an @arg input color and an @arg light and @arg dark color, and calculates whether the color should be the light color or dark color based on the @arg boundary provided as a multiplier (0.8 -> 80% contrast).
                * @arg Note: The boundary value provided for this function is based on theory, and not 50%, as that will cause weird side effects.
         */
        text: {
            color: Miscellaneous.filterColor(Constants.ThemeColorMap.HEADER_PRIMARY, '#f2f2f2', "#121212", 0.8, 'buttons in debug info menu'),
            textAlign: 'center',
            paddingLeft : 10,
            paddingRight : 10,
            letterSpacing: 0.25,
            fontFamily: Constants.Fonts.PRIMARY_BOLD
        },
        /**
         * @param {object} buttonText: The font size for the main Buttons text.
         */
        buttonText: {
            fontSize: 16,
        },
        /**
         * @param {object} container: The main styling for the container implementation which overrides the FormSection.
         */
        container: {
            width: '90%',
            marginLeft: '5%',
            borderRadius: 10,
            backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
            ...Miscellaneous.shadow()
        },
        /**
         * @param {object} pageContainer: The main container for the entire debug page. 
         * This style mostly sets a large padding at the top and bottom so that when scrolling you cannot see the original background color.
         * ActionSheets by default have a different color to rendered pages and therefore we have to set our own.
         */
        pageContainer: {
            paddingTop: 200,
            top: -200,
            paddingBottom: 300,
            marginBottom: -450,
            backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
        },
        /**
         * @param {object} buttonContainer: Container for the @arg search bar and the @arg clear button
         * This sets the @arg flexDirection to row, so the modules will render next to eachother.
         */
        searchWrapper: {
            flexDirection: "row",
        },
        /**
         * @param {object} searchContainer: The main container for the search bar.
         * This wraps the search component and forces a constraint to display the search bar with a smaller width and a borderRadius higher than default.
         * With @arg overflow set to hidden, the component will correctly display this new borderRadius.
         */
        searchContainer: {
            borderRadius: 11,
            width: "65%",
            overflow: "hidden",
            marginTop: 15,
            marginLeft: "5%",
            marginRight: "5%"
        },
        /**
         * @param {object} search: The main style for the static search bar container component
         * This style pretty much removes all margins and padding and removes the backgroundColor on this container, so the searchContainer can overwrite it.
         */
        search: {
            margin: 0,
            padding: 0,
            borderBottomWidth: 0,
            background: "none",
            backgroundColor: "none",
        },
        /**
         * @param {object} title: The main styling for the Clear All button's text.
         * This style sets the color of the text to @arg HEADER_SECONDARY, and sets the weight to @arg DISPLAY_BOLD
         * This style also modifies the spacing of the letters to @arg 0.25, and aligns the text in the center of the button
         */
        title: {
            color: Constants.ThemeColorMap.HEADER_SECONDARY,
            fontFamily: Constants.Fonts.DISPLAY_BOLD,
            letterSpacing: 0.25,
            textAlign: "center"
        },
        /**
         * @param {object} titleContainer: The main style for the @arg TouchableOpacity which holds the Text for the @arg {Clear All} button
         * This style sets the width to 20%, where there will be the following:
            * ~ 5% space taken up by @arg padding on the left
            * ~ 65% space taken up by the @arg {Search} bar
            * ~ 5% space taken up by padding between the @arg {Search} bar and the @arg {Clear All} button
            * ~ 20% space taken up by the @arg {Clear All} button
            * ~ 5% space taken up by @arg padding on the right.
         * It also sets the margin to equal of the search bar, so they are aligned horizontally.
         * Aswell as this, it sets the color to the same as the @arg Debug buttons.
         * And finally, it sets a borderRadius and aligns the items inside vertically and horizontally.
         */
        titleContainer: {
            width: "20%",
            marginTop: 15,
            backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: 'center'
        },
    });
    
    /**
     * Main return element of the Component.
     * @returns {~ TSX Page}
     */
    return <ScrollView style={styles.pageContainer}>
        {/**
         * The main search container. Any text that is inputted into this, will be stored into the query state, and filtered on re-render.
         */}
        <View style={[styles.searchWrapper, { ...Miscellaneous.shadow(0.05) }]}>
            <View style={styles.searchContainer}>
                <Search
                    placeholder="Search..."
                    style={styles.search}
                    inputStyle={styles.search}
                    onChangeText={(text: string) => setQuery(text)}
                    collapsable
                    value={query}
                />
            </View>
            <TouchableOpacity 
                style={styles.titleContainer}
                onPress={() => {
                    /**
                     * Go through each @arg parent option in the list of @arg { debug } options, @arg {Native, React, etc}
                     */
                    ArrayOps.forItem(Object.keys(options), (option: string) => {
                        /**
                         * Loop through the @arg child options as an indexed object taken from the parent option @arg {options["Native"]}
                         */
                        ArrayOps.forItem(
                            Object.keys(options[option]), 
                            (subOption: string) => {
                                /**
                                 * Set each @arg suboption to false, hence disabling it.
                                 */
                                Store.item(
                                    {
                                        name: option,
                                        content: { ...(get(name, option) as Object), [subOption]: false },
                                        type: "setting",
                                        override: ({})
                                    }
                                )
                            },
                            `list of debug information options in ${option}`
                        )
                    })
                    /**
                     * As the options will not rerender when set, even when setting state, close the @arg ActionSheet.
                     * When this is reopened, all the options will be set to false.
                     */
                    LazyActionSheet.hideActionSheet()

                    /**
                     * Finally, open an @arg Toast notifying the user that the debug options have been cleared.
                     */
                    Toasts.open({
                        content: "Successfully cleared all debug options.",
                        source: Icons.Delete
                    })
            }}>
                <Text style={styles.title}>Clear All</Text>
            </TouchableOpacity>
            
        </View>
        <View style={styles.buttonContainer}>
            {/**
             * Button to send the Full Debug log, hence the text @arg {Send All}
             */}
            <TouchableOpacity
                style={styles.button}
                onPress={async function() {
                    /**
                     * Send a full log in the current channel.
                     * @uses @param {string[]} options: List of available debug options, all are passed to the debug log as this is sending @arg all the options
                     */
                    await onConfirm(await Debug.debugInfo(await Debug.fetchDebugArguments()), 'full debug log');
                }
            }>
                <Text style={[styles.text, styles.buttonText]}>{Format.string(type ?? "send")} All</Text>
            </TouchableOpacity>
            {/**
             * Button to send the Partial Debug log, hence the text @arg {Send Message} instead.
             */}
            <TouchableOpacity
                style={styles.button}
                onPress={async function() {
                    /**
                     * @param {string[]} debugOptions: Filtered list of options which only includes ones that the user has chosen to be true.
                     */
                    const debugOptions = ArrayOps
                        .mapItem(Object.keys(options), (option: string) => ({ [option]: (get(name, option, {}) as object ?? {}) }))
                        .reduce((acc, obj) => ({ ...acc, ...obj }), {});;
            
                    /**
                     * Send a partial log in the current channel.
                     * @uses @param {string[]} options: List of available debug options, all are passed to the debug log as this is sending @arg part of the options
                     */
                    await onConfirm(await Debug.debugInfo(debugOptions), 'partial debug log');
                }
            }>
                <Text style={[styles.text, styles.buttonText]}>{Format.string(type ?? "send")} Message</Text>
            </TouchableOpacity>
        </View>

        {/**
         * Map through each of the options, and add a new SectionWrapper for each option, which will contain the subOptions.
         */}
        {ArrayOps.mapItem(Object.keys(options), (option: string) => <SectionWrapper label={option} component={<>
            {/**
             * The main section of available options to be selected by the User.
             */}
            <View style={styles.container}>
                {/**
                 * Maps through the list of filtered available items, and returns an @arg InfoItem component for each one.
                 * @uses @param {string[]} options: The list of available options.
                 * @uses @param {string} query: Any possible text that has been typed in the search box.
                 * @uses @param {TSX} InfoItem: Component to render toggleable options, with independent state.
                 */}
                {ArrayOps.mapItem(
                    ArrayOps.filterItem(Object.keys(options[option]), (subOption: string) => {
                        if (query) {
                            return subOption.toLowerCase().includes(query)
                        }
                        return subOption
                    }), 
                    (subOption: string, index: number, array: any[]) => <>
                        <InfoItem 
                            option={subOption}
                            parent={option}
                            debugOptions={options} 
                            onConfirm={onConfirm}
                        />
                        {/**
                         * Only adds a FormDivider if the index of the item is not the last.
                         */}
                        {index !== (array.length - 1) ? <FormDivider/> : null}
                    </>,
                    `list of debug information options in ${option}`
                )}
            </View>
        </>} />)}
        
        {/**
         * @param {TSX} Dialog: Renders a custom Dialog implementation to display a tip to help you navigate the page.
         * @uses @param {type} standard
         */}
        <Dialog 
            label="Information" 
            content={`You can either tap on each item to toggle it and press "${Format.string(type ?? "send")} Message", or you can long-press on an item to only send that item.\n\nTo close this dialog, press on it.`} 
            type={'standard'}
        />
    </ScrollView>;
}