import { get, set } from 'enmity/api/settings';
import { FormRow, TouchableOpacity } from 'enmity/components';
import { Constants, React, Toasts, NavigationNative } from 'enmity/metro/common';
import { name } from '../../../../manifest.json';
import ISO from '../../../translate/languages/iso';
import { Format, Icons } from '../../../common';
import { styles } from './LanguageItem.styles';
import { LanguageItemProps } from '../../../def';

// @ts-expect-error
const Animated = window.enmity.modules.common.Components.General.Animated;

export default ({ language, languages, selected, setSelected }: LanguageItemProps) => { 
    const Navigation = NavigationNative.useNavigation();
    const MappedISO2 = Object.assign({}, ...ISO.map((k) => ( [k] )));
    const animatedButtonScale = React.useRef(new Animated.Value(1)).current;

    const onPressIn = (): void => Animated.spring(animatedButtonScale, {
        toValue: 1.05,
        duration: 250,
        useNativeDriver: true,
    }).start();

    const onPressOut = (): void => Animated.spring(animatedButtonScale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
    }).start();

    
    const animatedScaleStyle = {
        transform: [
            {
                scale: animatedButtonScale
            }
        ]
    };

    const setLanguage = (language: string): void => {
        set(name, `DislateLang${get(name, "DislateLangFilter") ? "To" : "From"}`, language);

        Toasts.open({ content: `Set ${(languages[language]).toUpperCase()} as Language to Translate ${get(name, "DislateLangFilter") ? "to" : "from"}.`, 
            source: get(name, "DislateLangFilter") ? Icons.Settings.TranslateTo : Icons.Settings.TranslateFrom
        });

        setSelected(get(name, `DislateLang${get(name, "DislateLangFilter") ? "To" : "From"}`))
        Navigation?.pop?.()
    }

    return <>
        <TouchableOpacity
            onPress={() => setLanguage(language)}
            onLongPress={() => setLanguage(language)}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <Animated.View style={[animatedScaleStyle, styles.container]}>
                <FormRow
                    label={Format.string(language)}
                    subLabel={`Aliases: ${languages[language]}, ${MappedISO2[languages[language]]}`}
                    trailing={() => <FormRow.Arrow />}
                    leading={<FormRow.Icon style={{color: Constants.ThemeColorMap.INTERACTIVE_NORMAL}} source={
                        selected === language
                            ?   Icons.Settings.Toasts.Settings
                            :   Icons.Add
                        } 
                    />}
                />
            </Animated.View>
        </TouchableOpacity>
    </>;
 };