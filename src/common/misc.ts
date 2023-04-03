import { name } from '../../manifest.json';
import tryCallback from "./try_callback";
import { Constants, Toasts, Theme } from "enmity/metro/common";
import Icons from "./icons";
import { StyleSheet } from 'enmity/metro/common';
import { getByProps } from 'enmity/metro';
import { version } from 'enmity/api/native';

const externalPlugins: { [key: string]: string | undefined; } = {
    messageSpoofer: "69",
    copyEmbed: "1337",
    invisChat: "420",
    cutMessage: "512",
    dislate: "1002",
    viewRaw: "-1",
};

type DefaultObject = { [key: string]: string | number | DefaultObject }
const shadow = (opacity: number = 0.10): DefaultObject => ({
    shadowColor: "#000",
    shadowOffset: {
        width: 1,
        height: 4,
    },
    shadowOpacity: opacity,
    shadowRadius: 4.65,
    elevation: 8
});

const PageStyles: DefaultObject = StyleSheet.createThemedStyleSheet({
    container: {
        backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
        flex: 0.5,
    },
    card: {
        backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
        color: Constants.ThemeColorMap.TEXT_NORMAL
    },
    header: {
        backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
        shadowColor: 'transparent',
        elevation: 0,
    },
    text: {
        color: Constants.ThemeColorMap.HEADER_PRIMARY,
        fontFamily: Constants.Fonts.PRIMARY_MEDIUM,
        fontSize: 16,
    },
    title: {
        color: 'white',
        fontFamily: Constants.Fonts.PRIMARY_NORMAL,
    },
})

const PageOptions = {
    cardStyle: PageStyles.card,
    headerStyle: PageStyles.header,
    headerTitleContainerStyle: { color: Constants.ThemeColorMap.HEADER_PRIMARY },
    headerTitleAlign: 'center',
    safeAreaInsets: {
        top: 0,
    }
}

const displayToast = (source: string, type: 'clipboard' | 'tooltip'): void => {
    Toasts.open({ 
        content: type=='clipboard' ? `Copied ${source} to clipboard.` : source, 
        source: type=='clipboard' ? Icons.Clipboard : Icons.Settings.Initial 
    });
};

const getBackwardsCompatibleColor = (color: { [key: string]: any }): string => {
    return tryCallback(() => {
        if (parseInt(version.substring(0, 3)) > 164) {
            const { RawColor } = getByProps("SemanticColor")
            return RawColor[color[Theme.theme].raw];
        }
    
        return color[{ dark: 0, light: 1, amoled: 2}[Theme.theme]]
    }, [color], name, "getting a formatted color for both newest and older versions")
}

const filterColor = (color: { [key: string]: any }, light: string, dark: string, boundary: number = 186, label?: string): string => {
    return tryCallback(() => {
        let baseColor = getBackwardsCompatibleColor(color)?.replace("#", "")
        const parseColorAsInt = (color: string, digits: number[], base: number) => parseInt(color.substring(digits[0], digits[1]), base)

        const red = parseColorAsInt(baseColor, [0, 2], 16),
            green = parseColorAsInt(baseColor, [2, 4], 16),
            blue = parseColorAsInt(baseColor, [4, 6], 16);

        return (((red + green + blue) / (255 * 3)) > boundary)
            ?   dark 
            :   light
    }, [color, light, dark, boundary], name, 'checking if color should be light or dark at', label);
};

export default 
{
    externalPlugins,
    shadow,
    PageStyles,
    PageOptions,
    displayToast,
    filterColor,
};