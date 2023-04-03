import { React, Constants, Users, Clipboard } from 'enmity/metro/common';
import { getByProps } from 'enmity/metro';
import { TouchableOpacity, View, Image, Text } from 'enmity/components';
import { Debug, Miscellaneous } from '../../common';
import { styles } from './Credits.styles';
import { CreditsProps } from '../../def';

// @ts-expect-error
const Animated = window.enmity.modules.common.Components.General.Animated;
const Router = getByProps('transitionToGuild', 'openURL')

export default ({ manifest: { name, version, plugin, authors }}: CreditsProps): void => {
    const animatedButtonScale = React.useRef(new Animated.Value(1)).current;

    const onPressIn = (): void => Animated.spring(animatedButtonScale, {
        toValue: 1.1,
        duration: 10,
        useNativeDriver: true,
    }).start();

    const onPressOut = (): void => Animated.spring(animatedButtonScale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
    }).start();

    const onPress = (): void => Router.openURL(plugin.repo);
    const animatedScaleStyle = {
        transform: [
            {
                scale: animatedButtonScale
            }
        ]
    };
    
    return <View style={styles.container}>
        <TouchableOpacity 
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <Animated.View style={animatedScaleStyle}>
                <Image
                    style={[styles.image]}
                    source={{
                        uri: Users.getCurrentUser().getAvatarURL(), 
                    }}
                />
            </Animated.View>
        </TouchableOpacity>
        <View style={styles.textContainer}>
            <TouchableOpacity onPress={(): void => Router.openURL(plugin.repo)}>
                <Text style={[styles.mainText, styles.header]}>
                    {name}
                </Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
                <Text style={[styles.mainText, styles.subHeader]}>
                    A project by 
                </Text>
                {authors.map((author, index: number, authorsArray: any[]) => { 
                    return <TouchableOpacity onPress={(): void => Router.openURL(author.profile)}> 
                        <Text 
                            style={[styles.mainText, styles.subHeader, {
                                paddingLeft: 4,
                                fontFamily: Constants.Fonts.DISPLAY_BOLD,
                                flexDirection: 'row'
                        }]}>
                                {author.name}{index < (authorsArray.length - 1) ? "," : null}
                        </Text>
                    </TouchableOpacity>
                })}
            </View>
            <View>
                <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={async function() {
                        const options = await Debug.fetchDebugArguments()
                        Clipboard.setString(await Debug.debugInfo(options));
                        Miscellaneous.displayToast('debug information', 'clipboard')
                    }}
                >
                    <Text style={[styles.mainText, styles.subHeader]}>
                        Version: 
                    </Text>
                    <Text style={[styles.mainText, styles.subHeader, {
                        paddingLeft: 4,
                        fontFamily: Constants.Fonts.DISPLAY_BOLD
                    }]}>
                            {version}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
}