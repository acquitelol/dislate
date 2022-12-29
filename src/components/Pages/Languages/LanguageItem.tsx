/**
 * Imports
 * @param { get, set }: Allows you to @arg store and @arg retrieve Settings from your plugin file.
 * @param FormRow: Allows you to render a custom @arg {Form Item} on the screen.
 * @param Constants: Module for many @arg constant values such as Theme colors etc. 
 * @param Navigation: Used to @arg close (pop) the current page from the Navigation Stack.
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param Toasts: Used to open a little @arg notification at the top of your Enmity.
 * @param name: The name of the plugin from @arg manifest.json. In this case, it's Dislate.
 * @param LanguageNames: The full list of available full @arg {language names}, which can be mapped over and manipulated
 * @param Format.string: Used to replace @arg underscores with @arg spaces, and add a capital letter to the first character of a string.
 * @param Icons: Used as a module to store icons easier.
 * @param Format.reverse: Allows you to set an object's keys to its values and its values to its keys.
 */
 import { get, set } from 'enmity/api/settings';
 import { FormRow, TouchableOpacity } from 'enmity/components';
 import { Constants, Navigation, React, Toasts, StyleSheet } from 'enmity/metro/common';
 import { name } from '../../../../manifest.json';
 import LanguageNames from '../../../../modified/translate/src/languages/names';
 import LanguageNamesShort from '../../../../modified/translate/src/languages/iso2';
 import { Format, Icons } from '../../../utils';

 
 /** 
  * This is the main 'Animated' component of React Native, but for some reason its not exported in Enmity's dependencies so I'm importing it manually.
  * @param Animated: The main 'Animated' component of React Native.import { TouchableOpacity } from 'enmity/components';
 
  * @ts-ignore */
const Animated = window.enmity.modules.common.Components.General.Animated;
 
 /**
  * Main Languages Page Item Component.
  * @param {string} language: The main language that the Component represents.
  */
export default ({ language }) => { 
    /** 
     * Use React to create a new Ref with @arg Animated
     * @param {React.useRef} animatedButtonScale: The main button scale Ref.
     */
    const animatedButtonScale = React.useRef(new Animated.Value(1)).current;

    /**
     * Move @param animatedButtonScale to @arg {1.1}, in @arg {250ms} with the @arg spring easing type.
     * @returns {void}
     */
    const onPressIn = (): void => Animated.spring(animatedButtonScale, {
        toValue: 1.05,
        duration: 250,
        useNativeDriver: true,
    }).start();

    /**
     * Move @param animatedButtonScale back to @arg {1}, in @arg {250ms} with the @arg spring easing type.
     * @returns {void}
     */
    const onPressOut = (): void => Animated.spring(animatedButtonScale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
    }).start();

    
    /** 
     * The main animated style, which is going to be modified by the Animated property.
     * @param {object{transform[]}} animatedScaleStyle: The main scale style applied to the element which has the scale.
     */
    const animatedScaleStyle = {
        transform: [
            {
                scale: animatedButtonScale
            }
        ]
    };

    /**
     * @param {StyleSheet} styles: StyleSheet of generic styles used throughout the component.
     */
    const styles = StyleSheet.createThemedStyleSheet({
        /**
         * @param {object} container: Main style for a rounded container for creating custom FormRow edge implementations.
         */
        container: {
            width: '95%',
            marginLeft: '2.5%',
            borderRadius: 10,
            marginTop: 15,
            backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY
        }
    });
 
    /**
     * Takes a language as an argument and sets the current language based on the page which was opened to the one that was pressed.
     * @param {string} language: The language to set.
     * @returns {void}
     */
    const setLanguage = (language: string): void => {
        /**
         * Sets the language as the one to translate to or from depending on which page was opened.
         * @param {set, get}: Store and retrieve settings from the plugin.
         */
        set(name, `DislateLang${get(name, "DislateLangFilter") ? "To" : "From"}`, language);

        /**
         * Afterwards, open a toast stating that the language chosen has been set as the language to translate to or from.
         * @param {string[]} LanguageNames: The full list of languages.
         * @param {string} language: The language that this component is representing. This is the language that a user would press on.
         */
        Toasts.open({ content: `Set ${(LanguageNames[language]).toUpperCase()} as Language to Translate ${get("Dislate", "DislateLangFilter") ? "to" : "from"}.`, 
            source: get(name, "DislateLangFilter") ? Icons.Settings.TranslateTo : Icons.Settings.TranslateFrom
        });

        /**
         * Finally, close the page.
         */
        Navigation.pop();
    }
 
    return <>
        {/**
         * The main Touchable opacity. This would override the FormRow effects, and also is what controls the animation.
         */}
         <>
            <TouchableOpacity
                /**
                 * @arg {callback?} onPress: Set the language pressed as the chosen language to translate to or from.
                 * @arg {callback?} onLongPress: Set the language pressed as the chosen language to translate to or from.
                 * @arg {callback} onPressIn: Scale in the component to @arg {1.05} scale.
                 * @arg {callback} onPressOut: Scale out the component back to @arg {1} scale.
                 * 
                 * @uses @param {string} language
                 */
                onPress={() => setLanguage(language)}
                onLongPress={() => setLanguage(language)}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                {/**
                 * The main view. This is what the scale style is actually applied to.
                 * @uses @param {object} animatedScaleStyle: The current transform scale value. This will change depending on the Ref.
                 * @uses @param {object} styles.container: The main style for the Language item, allowing it to seem rounded.
                 */}
                <Animated.View style={[animatedScaleStyle, styles.container]}>
                    <FormRow
                        label={Format.string(language)}

                        /**
                         * Fetches the shorter names of each language. As the ISO's are all directly linked to the names, this will never return undefined.
                         * @uses @param {string} languageNames[language]: Shorter implementation of the language
                         * @func Format.reverse: Reverses the keys and values of an object
                         */
                        subLabel={`Aliases: ${LanguageNames[language]}, ${Format.reverse(LanguageNamesShort, 'creating aliases for language names')[LanguageNames[language]]}`}
                        trailing={FormRow.Arrow}
                        leading={<FormRow.Icon style={{color: Constants.ThemeColorMap.INTERACTIVE_NORMAL}} source={
                            /**
                             * Either set the Icon to ✓ or + depending on whether @arg DislateLangFilter is true or false, and then further whether the current @arg language is the same as the current language stored in @arg DislateLang*.
                             * @uses @param {stringId} Icons.Settings.Toasts: Part of the icon dependency to display icons for Toasts, can also be used in this scenario.
                             * 
                             * @if {(@arg DislateLangFilter) evaluates to true} ->
                                    * @if {(@arg language) is equal to (@arg DislateLangTo)} -> Show ✓ Icon
                                    * @else {()} -> Show + Icon
                             * @else {()} ->
                                    * @if {(@arg language) is equal to (@arg DislateLangFrom)} -> Show ✓ Icon
                                    * @else {()} -> Show + Icon
                             */
                            language == get(name, `DislateLang${get(name, "DislateLangFilter") ? "To" : "From"}`)
                                ?   Icons.Settings.Toasts.Settings
                                :   Icons.Add
                            } 
                        />}
                    />
                </Animated.View>
            </TouchableOpacity>
         </>
     </>;
 };