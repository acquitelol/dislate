import { TouchableOpacity, Text, Image, View } from "enmity/components";
import { React, Dialog, Users } from "enmity/metro/common";
import { Store } from "../../common";
import { name } from "../../../manifest.json";
import { get } from "enmity/api/settings";
import { styles, types } from "./Dialog.styles";
import { DialogProps } from '../../def';

// @ts-expect-error
const enmity = window.enmity;

const Animated = enmity.modules.common.Components.General.Animated;
const Easing = enmity.modules.common.Components.General.Easing;

export default ({ label, content, type }: DialogProps) => {
  const animatedButtonScale = React.useRef(new Animated.Value(1)).current;

  async function onPress(): Promise<void> {
    const animate = () => Animated.timing(animatedButtonScale, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.sin,
    }).start();

    Dialog.show({
      title: "Close Tip?",
      body: `You can either hide this information box forever, or just hide it until you open this page again.`,
      confirmText: "Don't Show Again",
      cancelText: "Cancel",
      onConfirm: async function () {
        await Store.item({
          name: label,
          content: true,
          type: "setting",
          override: false
        }, `storing dialog at ${label} in Dialog component`)

        animate();
      }
    });
  };
  
  const animatedScaleStyle = {
    transform: [
      {
        scale: animatedButtonScale,
      },
    ],
  };

  return !get(name, label, false) ? (
    <Animated.View style={animatedScaleStyle}>
      <TouchableOpacity
        style={[styles.button, types[type] || types["standard"]]}
        onPress={async function() { 
          await onPress() 
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
          }}
        >
          <Image
            style={styles.image}
            source={{
              uri: Users.getCurrentUser().getAvatarURL(),
            }}
          />
        </View>
        <Text style={[styles.text, styles.textHeader]}>{label}</Text>
        <Text style={[styles.text, styles.textContent]}>{content}</Text>
      </TouchableOpacity>
    </Animated.View>
  ) : <></>
};
