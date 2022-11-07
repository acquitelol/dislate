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
    return <>
        <Search
            placeholder="Search Options"
            onChangeText={text => setQuery(text)}
        />
        <ScrollView>
            <FormSection title='Options'>
                {options.filter(option => option.includes(query)).map((option) => <DebugItem option={option} />)}
                <FormDivider />
            </FormSection>
            <TouchableOpacity
                    style={styles.button}
                    onPress={async function() {
                        // *** SENDS FULL LOG ***

                        // close the page
                        Navigation.pop()

                        // send the message with all the options as argument
                        Messages.sendMessage(channel_id, {
                            content: await debug_info(options)
                        }); // send a message with string interpolation

                        // opens a toast to declare that message has been sent
                        Toasts.open({ 
                            // formats the string and shows language that it has changed it to
                            content: `Sent debug info in current channel.`, 
                            source: Icons.Debug_Command.Sent
                        })
                    }}
                    underlayColor='#fff'>
                    <Text style={styles.text}>Send All</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={styles.button}
                    onPress={async function() {
                        // **SEND PARTIAL LOG**

                        // close the page
                        Navigation.pop()

                        // sort through the options and only select the ones which are set to true
                        let debug_options = options.map(option => {if (getBoolean(name, option, false)) return option})

                        // sends the message with the options selected true
                        Messages.sendMessage(channel_id, {
                            content: await debug_info(debug_options)
                        }); // send a message with string interpolation

                        // opens a toast to declare that message has been sent
                        Toasts.open({ 
                            // formats the string and shows language that it has changed it to
                            content: `Sent debug info in current channel.`, 
                            source: Icons.Debug_Command.Sent
                        })
                    }}
                    underlayColor='#fff'>
                    <Text style={styles.text}>Send Message</Text>
            </TouchableOpacity>
        </ScrollView>  
    </>;
}