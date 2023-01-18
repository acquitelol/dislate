import { getBoolean } from "enmity/api/settings";
import { getByKeyword, getByName } from "enmity/metro";
import { React, NavigationStack, StyleSheet } from "enmity/metro/common";
import { Icons, Miscellaneous } from "../../common";
import { Languages } from "../Pages";
import Settings from "./Settings";

/**
 * Main Modules needed throughout this @arg Stack Component.
 * @param Stack: The main @arg StackNavigator, used to create @arg Navigator components
 * @param Navigator: The main @arg {Native Navigation} Module, allowing you to create @arg containers and call the @arg useNavigation hook to navigate to other @arg Screens.
 * @param Icon: The main @arg {Discord} Implementation to display an @arg Icon based on an ID.
 */
const Stack = NavigationStack.createStackNavigator()
const Navigator = getByKeyword("getFocusedRoute")
const Icon = getByName("Icon");

export default ({ settings, manifest: { name, version, plugin, authors, release }, languages }) => {
    /**
     * Wraps the components returned from this page in a function to pass props easier to them.
     */
    const SettingsWrapper = (): any => <Settings settings={settings} manifest={{ name, version, plugin, authors, release}} Navigator={Navigator} />;
    const LanguagesWrapper = (): any => <Languages languages={languages} Navigator={Navigator} />;

    /**
     * Create the main StyleSheet used throughout the Page.
     * @param {StyleSheet} styles: The main StyleSheet.
     */
    const styles = StyleSheet.createThemedStyleSheet({
        ...Miscellaneous.PageStyles,
    });

    return (<Stack.Navigator 
        initialRouteName="Settings"
        style={styles.container}
        screenOptions={{
            ...Miscellaneous.PageOptions,
    }}>
        <Stack.Screen 
            name="Settings" 
            component={SettingsWrapper} 
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen 
            name="Language"
            component={LanguagesWrapper}
            options={{
                title: `Translate ${getBoolean(name, "DislateLangFilter", true) ? "To" : "From"}`,
                headerTitleStyle: styles.title,
                headerBackTitleStyle: styles.text,
                headerBackImage: () => <Icon source={Icons.Settings.Back} />,
            }}
        />
    </Stack.Navigator>)
}