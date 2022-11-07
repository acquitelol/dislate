// main dependencies and components
import { React, Constants, StyleSheet, Toasts, Messages } from 'enmity/metro/common';
import { name } from '../../manifest.json';
import { Text, ScrollView, FormSection, TouchableOpacity, FormDivider} from 'enmity/components';
import { fetch_debug_arguments, Icons, debug_info } from '../utils';
import { getBoolean } from 'enmity/api/settings';
import { Navigation } from "enmity/metro/common";
import DebugItem from './DebugItem';
import { getByName } from 'enmity/metro';

// use the search module
const Search = getByName('StaticSearchBarContainer');

// channel id is a property passed from the main debug command
export default ({ channel_id }) => {
    // set the react states
    const [options, setOptions] = React.useState<string[]>([])
    const [query, setQuery] = React.useState([])

    // set the debug options into the state on mount
    React.useEffect(async function() {
        setOptions(Object.keys(await fetch_debug_arguments()))
    }, [])

    // create the stylesheet of styles used for the buttons
    const styles = StyleSheet.createThemedStyleSheet({
        button: {
            width: '90%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Constants.ThemeColorMap.HEADER_PRIMARY,
            borderRadius: 10,
            marginLeft: '5%',
            marginRight: '5%',
            marginTop: 20
        },
        text: {
            color: '#fff',
            textAlign: 'center',
            paddingLeft : 10,
            paddingRight : 10,
            fontSize: 16,
            letterSpacing: 0.25,
            fontFamily: Constants.Fonts.PRIMARY_BOLD
        },
    })

    const send_debug_log = async function(debug_options) {
        // **SEND LOG**

        // close the page
        Navigation.pop()

        // sends the message with the options selected true
        Messages.sendMessage(channel_id, {
            content: await debug_info(debug_options)
        }); // send a message with string interpolation

        // opens a toast to declare that message has been sent
        Toasts.open({ 
            // formats the string and shows language that it has changed it to
            content: `Sent debug info in current channel.`, 
            source: Icons.Settings.Toasts.Settings
        })
    }

    const [touchX, setTouchX] = React.useState() // the start x position of swiping on the screen
    const [touchY, setTouchY] = React.useState() // the start y position of swiping on the screen;

    return <>
        <Search
            placeholder="Search Options"
            onChangeText={text => setQuery(text)}
        />
        <ScrollView
            onTouchStart={e=> {
                // set them to new position
                setTouchX(e.nativeEvent.pageX)
                setTouchY(e.nativeEvent.pageY)
            }}
            onTouchEnd={e => {
                    // only triggers if x is negative over 100 (moved right) and y is more than -40 but less than 40 (not much movement)
                    if (
                        touchX - e.nativeEvent.pageX < -100 
                        && touchY - e.nativeEvent.pageY < 40
                        && touchY - e.nativeEvent.pageY > -40
                    ) {
                        Navigation.pop() // removes the page from the stack
                    }
                }
            }
        >
            <FormSection title='Options'>
                {options.filter(option => option.includes(query)).map((option) => <DebugItem option={option} channel={channel_id} />)}
                <FormDivider />
            </FormSection>
            <TouchableOpacity
                    style={styles.button}
                    onPress={async function() {
                        await send_debug_log(options)
                    }}
                    underlayColor='#fff'>
                    <Text style={styles.text}>Send All</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={styles.button}
                    onPress={async function() {
                        // sort through the options and only select the ones which are set to true
                        let debug_options = options.map(option => {if (getBoolean(name, option, false)) return option})
                        await send_debug_log(debug_options)
                    }}
                    underlayColor='#fff'>
                    <Text style={styles.text}>Send Message</Text>
            </TouchableOpacity>
        </ScrollView>  
    </>;
}