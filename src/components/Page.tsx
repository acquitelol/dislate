/**
 * Imports
 * @param React: The main React "library" used for native functions in Enmity as used for React Native.
 * @param Navigation: Used to pop an item off of the stack of items in the Navigation.
 * @param NavigationNative: Used to render custom native Navigation components.
 * @param NavigationStack: Used to create a new Stack Navigator.
 * @param StyleSheet: Used to create React Native StyleSheeets, for styling components.
 * @param Constants: Used for constant values which may differ between themes like colors and font weights.
 * @param { Button, View }: Basic React Native elements used to create Components.
 */
import { React, Navigation, NavigationNative, NavigationStack, StyleSheet, Constants } from 'enmity/metro/common';
import { Text, View } from 'enmity/components';

/**
 * Initialize a new @arg {Page Stack Navigator}
 * @param PageNavigator: The main NavigationStack Navigator.
 */
export const PageNavigator = NavigationStack.createStackNavigator();

/**
 * Export the main Page, which will be pushed to the navigation.
 * @param {string} name: The name of the page, which will be shown at the top. Default is @arg Page.
 * @param {TSX} component: The component which will be rendered inside the Page container. Default is just an empty view.
 */
export default ({ 
  name = 'Page', 
  component = View,
} = {}) => {
  /**
   * Create the main StyleSheet used throughout the Page.
   * @param {StyleSheet} styles: The main StyleSheet.
   */
  const styles = StyleSheet.createThemedStyleSheet({
    /**
     * @param {object} container: The main styles used for the Container of the page. This is generally only used once.
     */
    container: {
      backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
      flex: 0.5,
    },
    /**
     * @param {object} card: The color exclusively for the main Page card.
     */
    card: {
      backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
      color: Constants.ThemeColorMap.TEXT_NORMAL
    },
    /**
     * @param {object} header: The color used for the Header at the top of the Page View.
     */
    header: {
      backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
      shadowColor: 'transparent',
      elevation: 0,
    },
    /**
     * @param {object} close: The main styling for the Close Text Component.
     */
    close: {
      color: Constants.ThemeColorMap.HEADER_PRIMARY,
      fontFamily: Constants.Fonts.PRIMARY_NORMAL,
      fontSize: 16,
      marginLeft: 20,
      backgroundColor: 'transparent'
    }
  });

  /**
   * Opens a new page with the component provided inside of it.
   * @returns {~ TSX Component}
   */
  return <NavigationNative.NavigationContainer>
    <PageNavigator.Navigator
      initialRouteName={name}
      style={styles.container}
      screenOptions={{
        cardOverlayEnabled: false,
        cardShadowEnabled: false,
        cardStyle: styles.card,
        headerStyle: styles.header,
        headerTitleContainerStyle: {color: Constants.ThemeColorMap.HEADER_PRIMARY},
        headerTitleAlign: 'center',
        safeAreaInsets: {
          top: 0,
        },
      }}
    >
       <PageNavigator.Screen
        name={name}
        component={component}
        options={{
          headerTitleStyle: {
            color: 'white',
            fontFamily: Constants.Fonts.PRIMARY_NORMAL
          },
          headerLeft: () => (<Text
            style={styles.close}
            onPress={(): void => {
              /**
               * @param {callback} Navigation.pop: Pops an item from the stack on the Navigation, effectively closing the latest page.
               */
              Navigation.pop()
          }}>
            Close
          </Text>),
          ...NavigationStack.TransitionPresets.ModalSlideFromBottomIOS
        }}
      />
    </PageNavigator.Navigator>
  </NavigationNative.NavigationContainer>;
}