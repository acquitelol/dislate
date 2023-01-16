const { components } = window.enmity;
components.Alert;
components.Button;
components.FlatList;
const Image = components.Image;
components.ImageBackground;
components.KeyboardAvoidingView;
components.Modal;
components.Pressable;
components.RefreshControl;
const ScrollView = components.ScrollView;
components.SectionList;
components.StatusBar;
components.StyleSheet;
components.Switch;
const Text = components.Text;
components.TextInput;
components.TouchableHighlight;
const TouchableOpacity = components.TouchableOpacity;
components.TouchableWithoutFeedback;
components.Touchable;
const View = components.View;
components.VirtualizedList;
components.Form;
components.FormArrow;
components.FormCTA;
components.FormCTAButton;
components.FormCardSection;
components.FormCheckbox;
const FormDivider = components.FormDivider;
components.FormHint;
components.FormIcon;
components.FormInput;
components.FormLabel;
components.FormRadio;
const FormRow = components.FormRow;
components.FormSection;
components.FormSelect;
components.FormSubLabel;
const FormSwitch = components.FormSwitch;
components.FormTernaryCheckBox;
components.FormText;
components.FormTextColors;
components.FormTextSizes;

function registerPlugin(plugin) {
    window.enmity.plugins.registerPlugin(plugin);
}

const filters = {
    byProps: (...mdls) => window.enmity.modules.filters.byProps(...mdls),
    byName: (name, defaultExport) => window.enmity.modules.filters.byName(name, defaultExport),
    byTypeName: (name, defaultExport) => window.enmity.modules.filters.byTypeName(name, defaultExport),
    byDisplayName: (name, defaultExport) => window.enmity.modules.filters.byDisplayName(name, defaultExport),
};
function bulk(...filters) {
    return window.enmity.modules.bulk(...filters);
}
function getByProps(...options) {
    return window.enmity.modules.getByProps(...options);
}
function getByName(...options) {
    return window.enmity.modules.getByName(...options);
}
function getByKeyword(...options) {
    return window.enmity.modules.getByKeyword(...options);
}
window.enmity.modules.common;

const Constants = window.enmity.modules.common.Constants;
window.enmity.modules.common.Clipboard;
window.enmity.modules.common.Assets;
window.enmity.modules.common.Messages;
window.enmity.modules.common.Clyde;
window.enmity.modules.common.Avatars;
const Native = window.enmity.modules.common.Native;
const React = window.enmity.modules.common.React;
window.enmity.modules.common.Dispatcher;
const Storage = window.enmity.modules.common.Storage;
const Toasts = window.enmity.modules.common.Toasts;
const Dialog$1 = window.enmity.modules.common.Dialog;
window.enmity.modules.common.Token;
const REST = window.enmity.modules.common.REST;
window.enmity.modules.common.Settings;
window.enmity.modules.common.Users;
const Navigation = window.enmity.modules.common.Navigation;
const NavigationNative = window.enmity.modules.common.NavigationNative;
const NavigationStack = window.enmity.modules.common.NavigationStack;
window.enmity.modules.common.Theme;
window.enmity.modules.common.Linking;
const StyleSheet = window.enmity.modules.common.StyleSheet;
window.enmity.modules.common.ColorMap;
window.enmity.modules.common.Components;
window.enmity.modules.common.Locale;
window.enmity.modules.common.Profiles;
window.enmity.modules.common.Lodash;
window.enmity.modules.common.Logger;
window.enmity.modules.common.Flux;
window.enmity.modules.common.SVG;
window.enmity.modules.common.Scenes;
window.enmity.modules.common.Moment;

function create(name) {
    return window.enmity.patcher.create(name);
}

var name = "Dislate";
var version = "1.3.4";
var description = "Translates text into a desired language.";
var release = "stable";
var authors = [
	{
		name: "Acquite <3",
		id: "581573474296791211",
		profile: "https://github.com/acquitelol/"
	}
];
var plugin = {
	download: "https://raw.githubusercontent.com/acquitelol/dislate/main/dist/Dislate.js",
	repo: "https://github.com/acquitelol/dislate",
	build: "patch-2.0.0"
};
var color = "#ff1f84";
var manifest = {
	name: name,
	version: version,
	description: description,
	release: release,
	authors: authors,
	plugin: plugin,
	color: color
};

function set(file, setting, value) {
    window.enmity.settings.set(file, setting, value);
}
function get(file, setting, defaults) {
    return window.enmity.settings.get(file, setting, defaults);
}
function getBoolean(file, setting, defaults) {
    return window.enmity.settings.getBoolean(file, setting, defaults);
}

const base = "https://translate.googleapis.com/translate_a/single";
const engine = {
  fetch: ({ from, to, text }) => `${base}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(text)}`,
  parse: (res) => res.json().then((body) => {
    body = body && body[0] && body[0][0] && body[0].map((s) => s[0]).join("");
    if (!body)
      throw new Error("Invalid Translation!");
    return body;
  })
};
if (typeof fetch === "undefined") {
  try {
    global.fetch = require("node-fetch");
  } catch (error) {
    console.warn("Please make sure node-fetch is available");
  }
}
async function translate(text, { fromLang, toLang }) {
  const url = engine.fetch({
    text,
    from: fromLang,
    to: toLang
  });
  return await fetch(url).then(engine.parse);
}

async function string$1(text, { fromLang = "detect", toLang = "english" }, languages, cancel) {
  return cancel ? text : await translate(text, {
    fromLang: languages[fromLang],
    toLang: languages[toLang]
  });
}
var Translate = { string: string$1 };

var tryCallback = (callback, args, name, functionLabel, callLabel) => {
  try {
    return callback(...args);
  } catch (err) {
    console.warn(`[${name}] The following error happened when trying to ${functionLabel} ${callLabel != null ? callLabel : "unspecificied label"}: ${err}`);
    return void 0;
  }
};

const findItem = (array, callback, label) => {
  return tryCallback(() => {
    if (!array)
      return void 0;
    for (let i = 0; i < array.length; i++) {
      if (callback(array[i], i, callback)) {
        return array[i];
      }
    }
    return void 0;
  }, [array, callback], name, "find an item at", label);
};
const insertItem = (originalArray, insert, insertIndex, label) => {
  return tryCallback(() => {
    if (!originalArray)
      return void 0;
    originalArray.length++;
    insertIndex++;
    for (let i = originalArray.length - 1; i >= insertIndex; i--) {
      originalArray[i] = originalArray[i - 1];
    }
    originalArray[insertIndex - 1] = insert;
    return originalArray.length;
  }, [originalArray, insert, insertIndex], name, "insert an item at", label);
};
const filterItem = (array, callback, label) => {
  return tryCallback(() => {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
      if (callback(array[i], i, array))
        insertItem(newArray, array[i], newArray.length, "filtering an array");
    }
    return newArray;
  }, [array, callback], name, "filtering an array at", label);
};
const forItem = (array, callback, label) => {
  tryCallback(() => {
    for (let i = 0; i < array.length; i++) {
      callback(array[i], i, array);
    }
  }, [array, callback], name, "loop through an array at", label);
};
const mapItem = (array, callback, label) => {
  return tryCallback(() => {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
      insertItem(newArray, callback(array[i], i, array), newArray.length);
    }
    return newArray;
  }, [array, callback], name, "map an array at", label);
};
var ArrayImplementations = {
  filterItem,
  findItem,
  forItem,
  mapItem,
  insertItem
};

const string = (text, regex) => {
  return ArrayImplementations.mapItem(text.split(regex ? /(?=[A-Z])/ : "_"), (e) => e[0].toUpperCase() + e.slice(1)).join(" ");
};
const object = (text, label) => {
  return tryCallback(() => {
    let formattedText = ArrayImplementations.mapItem(text.split("\n"), (line, index) => {
      if (line == "")
        return;
      return `"${line.replaceAll(":", `":"`).replace(" ", "")}"${index == text.split("\n").length - 1 ? "" : ","}`;
    }, "formatting object");
    formattedText[0] = `{${formattedText[0]}`;
    formattedText[formattedText.length - 1] = `${formattedText[formattedText.length - 1]}}`;
    return formattedText.join("");
  }, [text], name, "formatting object at", label);
};
var Format = {
  string,
  object
};

async function item(item2, label) {
  await tryCallback(async function() {
    var _a;
    item2.type === "storage" ? await Storage.setItem(item2.name, item2.content) : set(name, item2.name, item2.content);
    const stateStore = (_a = await Storage.getItem("dislate_store_state")) != null ? _a : [];
    !ArrayImplementations.findItem(stateStore, (stateItem) => stateItem.name === item2.name, "finding existing label in store state") ? stateStore.push(item2) : null;
    await Storage.setItem("dislate_store_state", JSON.stringify(stateStore));
  }, [item2], name, "storing an item in plugin file or storage at", label);
}
var Store = { item };

async function getDeviceList(label) {
  return await tryCallback(async function() {
    const existing = await Storage.getItem("device_list");
    if (existing)
      return JSON.parse(existing);
    const res = await REST.get(`https://gist.githubusercontent.com/adamawolf/3048717/raw/1ee7e1a93dff9416f6ff34dd36b0ffbad9b956e9/Apple_mobile_device_types.txt`);
    const devicesList = res.text;
    const formattedList = Format.object(devicesList, "fetching device list");
    await Store.item(
      {
        name: "device_list",
        content: formattedList,
        type: "storage"
      },
      "storing device list in storage"
    );
    return JSON.parse(await Storage.getItem("device_list"));
  }, [], name, "get the device list", label);
}
async function isCompatibleDevice(label) {
  await tryCallback(async function() {
    let device = Native.DCDDeviceManager.device;
    let devices = await getDeviceList();
    if (!device.includes("iPhone"))
      return;
    device = device.replace("iPhone", "").replace(",", ".");
    const deviceFloat = parseFloat(device);
    async function openIncompatibleDialog() {
      const shownAlready = await Storage.getItem("dislate_incompatible_dialog");
      shownAlready != null ? shownAlready : Dialog$1.show({
        title: "Incompatible iPhone",
        body: `Please note that you're on an${devices[Native.DCDDeviceManager.device]}.
Some features of ${name} may behave in an unexpected manner.`,
        confirmText: "I understand",
        onConfirm: await Store.item(
          {
            name: "dislate_incompatible_dialog",
            content: "never show again until cleared",
            type: "storage"
          },
          "storing incompatible dialog to storage"
        )
      });
    }
    deviceFloat < 10.6 && deviceFloat != 10.3 || (deviceFloat == 14.6 || deviceFloat == 12.8) ? await openIncompatibleDialog() : null;
  }, [], name, "checking if device is compatible", label);
}
var Devices = {
  getDeviceList,
  isCompatibleDevice
};

async function fetchDebugArguments() {
  const devices = await Devices.getDeviceList();
  return {
    "Plugin": {
      "Version": version,
      "Build": plugin.build.split("-")[1],
      "Channel": release
    },
    "Client": {
      "Version": Native.InfoDictionaryManager.Version,
      "Build": Native.InfoDictionaryManager.Build,
      "Release": Native.InfoDictionaryManager.ReleaseChannel,
      "Bundle": Native.InfoDictionaryManager.Identifier.split(".")[2]
    },
    "Native": {
      "Version": Native.DCDDeviceManager.systemVersion,
      "Device": devices[Native.DCDDeviceManager.device],
      "Manufacturer": Native.DCDDeviceManager.deviceManufacturer
    }
  };
}
async function debugInfo(options, label) {
  return await tryCallback(async function() {
    let finalDebug = [`**[${name}] Debug Information**
`];
    const debugList = await fetchDebugArguments();
    ArrayImplementations.forItem(Object.keys(options), (option) => {
      Object.values(options[option]).some((subOptionValue) => subOptionValue) ? ArrayImplementations.insertItem(finalDebug, `[**${option}**]`, finalDebug.length, "pushing to debug argument array") : null;
      ArrayImplementations.forItem(Object.keys(options[option]), (subOption) => {
        options[option][subOption] && debugList[option][subOption] ? ArrayImplementations.insertItem(finalDebug, `> **${subOption}**: ${debugList[option][subOption]}`, finalDebug.length, "pushing to debug argument array") : null;
      });
    }, "looping through debug options");
    return finalDebug.join("\n");
  }, [options], name, "creating debug info at", label);
}
var Debug = {
  fetchDebugArguments,
  debugInfo
};

function getIDByName(name) {
    return window.enmity.assets.getIDByName(name);
}

var Icons = {
  Translate: getIDByName("img_nitro_star"),
  Revert: getIDByName("ic_highlight"),
  Debug: getIDByName("debug"),
  Retry: getIDByName("ic_message_retry"),
  Failed: getIDByName("Small"),
  Cancel: getIDByName("ic_megaphone_nsfw_16px"),
  Delete: getIDByName("ic_message_delete"),
  Copy: getIDByName("toast_copy_link"),
  Open: getIDByName("ic_leave_stage"),
  Clipboard: getIDByName("pending-alert"),
  Add: getIDByName("ic_add_perk_24px"),
  Clock: getIDByName("clock"),
  Settings: {
    Toasts: {
      Context: getIDByName("toast_image_saved"),
      Settings: getIDByName("ic_selection_checked_24px"),
      Failed: getIDByName("ic_close_circle_24px")
    },
    TranslateFrom: getIDByName("ic_raised_hand_list"),
    TranslateTo: getIDByName("ic_activity_24px"),
    Debug: getIDByName("ic_rulebook_16px"),
    Initial: getIDByName("coffee"),
    Update: getIDByName("ic_upload"),
    Locale: getIDByName("ic_locale_24px"),
    Back: getIDByName("ios-back")
  }
};

const externalPlugins = {
  messageSpoofer: "69",
  copyEmbed: "1337",
  invisChat: "420",
  cutMessage: "512",
  dislate: "1002"
};
const shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 1,
    height: 4
  },
  shadowOpacity: 0.1,
  shadowRadius: 4.65,
  elevation: 8
};
const PageStyles = StyleSheet.createThemedStyleSheet({
  container: {
    backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
    flex: 0.5
  },
  card: {
    backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
    color: Constants.ThemeColorMap.TEXT_NORMAL
  },
  header: {
    backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
    shadowColor: "transparent",
    elevation: 0
  },
  text: {
    color: Constants.ThemeColorMap.HEADER_PRIMARY,
    fontFamily: Constants.Fonts.PRIMARY_MEDIUM,
    fontSize: 16
  },
  title: {
    color: "white",
    fontFamily: Constants.Fonts.PRIMARY_NORMAL
  }
});
const PageOptions = {
  cardStyle: PageStyles.card,
  headerStyle: PageStyles.header,
  headerTitleContainerStyle: { color: Constants.ThemeColorMap.HEADER_PRIMARY },
  headerTitleAlign: "center",
  safeAreaInsets: {
    top: 0
  }
};
const displayToast = (source, type) => {
  Toasts.open({
    content: type == "clipboard" ? `Copied ${source} to clipboard.` : source,
    source: type == "clipboard" ? Icons.Clipboard : Icons.Settings.Initial
  });
};
const filterColor = (color, light, dark, boundary = 186, label) => {
  return tryCallback(() => {
    let baseColor = color.replace("#", "");
    const parseColorAsInt = (color2, digits, base) => parseInt(color2.substring(digits[0], digits[1]), base);
    const red = parseColorAsInt(baseColor, [0, 2], 16), green = parseColorAsInt(baseColor, [2, 4], 16), blue = parseColorAsInt(baseColor, [4, 6], 16);
    return (red + green + blue) / (255 * 3) > boundary ? dark : light;
  }, [color, light, dark, boundary], name, "checking if color should be light or dark at", label);
};
var Miscellaneous = {
  externalPlugins,
  shadow,
  PageStyles,
  PageOptions,
  displayToast,
  filterColor
};

const { native } = window.enmity;
function reload() {
    native.reload();
}
native.version;
native.build;
native.device;
native.version;

async function checkForUpdates() {
  await tryCallback(async function() {
    const url = `${plugin.download}?${Math.floor(
      Math.random() * 1001
    )}.js`;
    const res = await REST.get(url);
    const content = await res.text;
    const externalVersion = content.match(/\d\.\d\.\d+/g)[0];
    const externalBuild = content.match(/patch-\d\.\d\.\d+/g)[0];
    if (!externalVersion || !externalBuild)
      return noUpdates(name, [version, plugin.build]);
    if (externalVersion != version)
      return showUpdateDialog(url, externalVersion, "version");
    if (externalBuild != plugin.build)
      return showUpdateDialog(url, externalBuild.split("-")[1], "build");
    return noUpdates(name, [version, plugin.build]);
  }, [plugin], name, "checking if latest version at", "the async check for updates callback");
}
const showUpdateDialog = (url, updateLabel, updateType) => {
  Dialog$1.show({
    title: "Update found",
    body: `A newer ${updateType} is available for ${name}. ${updateType == "build" ? `
The version will remain at ${version}, but the build will update to ${updateLabel}.` : ""}
Would you like to install ${updateType} \`${updateLabel}\` now?`,
    confirmText: "Update",
    cancelText: "Not now",
    onConfirm: () => installPlugin(url, updateLabel, updateType)
  });
};
const noUpdates = (name2, [version2, build]) => {
  console.log(`[${name2}] Plugin is on the latest update, which is version ${version2} and build ${build}`);
  Dialog$1.show({
    title: "Already on latest",
    body: `${name2} is already updated to the latest version.
Version: \`${version2}\`
Build: \`${build.split("-")[1]}\``,
    confirmText: "Okay"
  });
};
async function installPlugin(url, type, updateType) {
  await tryCallback(async function() {
    window.enmity.plugins.installPlugin(url, ({ data }) => {
      data == "installed_plugin" || data == "overridden_plugin" ? Dialog$1.show({
        title: `Updated ${name}`,
        body: `Successfully updated to ${updateType} \`${type}\`. 
Would you like to reload Discord now?`,
        confirmText: "Reload",
        cancelText: "Not now",
        onConfirm: () => reload()
      }) : console.log(`[Dislate] Plugin failed to update to ${updateType} ${type}.`);
    });
  }, [url, type, updateType], name, "installing plugin at", "new version available");
}
var Updater = {
  checkForUpdates,
  showUpdateDialog,
  noUpdates,
  installPlugin
};

var ApplicationCommandSectionType;
(function (ApplicationCommandSectionType) {
    ApplicationCommandSectionType[ApplicationCommandSectionType["BuiltIn"] = 0] = "BuiltIn";
    ApplicationCommandSectionType[ApplicationCommandSectionType["Guild"] = 1] = "Guild";
    ApplicationCommandSectionType[ApplicationCommandSectionType["DM"] = 2] = "DM";
})(ApplicationCommandSectionType || (ApplicationCommandSectionType = {}));
var ApplicationCommandType;
(function (ApplicationCommandType) {
    ApplicationCommandType[ApplicationCommandType["Chat"] = 1] = "Chat";
    ApplicationCommandType[ApplicationCommandType["User"] = 2] = "User";
    ApplicationCommandType[ApplicationCommandType["Message"] = 3] = "Message";
})(ApplicationCommandType || (ApplicationCommandType = {}));
var ApplicationCommandInputType;
(function (ApplicationCommandInputType) {
    ApplicationCommandInputType[ApplicationCommandInputType["BuiltIn"] = 0] = "BuiltIn";
    ApplicationCommandInputType[ApplicationCommandInputType["BuiltInText"] = 1] = "BuiltInText";
    ApplicationCommandInputType[ApplicationCommandInputType["BuiltInIntegration"] = 2] = "BuiltInIntegration";
    ApplicationCommandInputType[ApplicationCommandInputType["Bot"] = 3] = "Bot";
    ApplicationCommandInputType[ApplicationCommandInputType["Placeholder"] = 4] = "Placeholder";
})(ApplicationCommandInputType || (ApplicationCommandInputType = {}));
var ApplicationCommandPermissionType;
(function (ApplicationCommandPermissionType) {
    ApplicationCommandPermissionType[ApplicationCommandPermissionType["Role"] = 1] = "Role";
    ApplicationCommandPermissionType[ApplicationCommandPermissionType["User"] = 2] = "User";
})(ApplicationCommandPermissionType || (ApplicationCommandPermissionType = {}));
var ApplicationCommandOptionType;
(function (ApplicationCommandOptionType) {
    ApplicationCommandOptionType[ApplicationCommandOptionType["SubCommand"] = 1] = "SubCommand";
    ApplicationCommandOptionType[ApplicationCommandOptionType["SubCommandGroup"] = 2] = "SubCommandGroup";
    ApplicationCommandOptionType[ApplicationCommandOptionType["String"] = 3] = "String";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Integer"] = 4] = "Integer";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Boolean"] = 5] = "Boolean";
    ApplicationCommandOptionType[ApplicationCommandOptionType["User"] = 6] = "User";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Channel"] = 7] = "Channel";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Role"] = 8] = "Role";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Mentionnable"] = 9] = "Mentionnable";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Number"] = 10] = "Number";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Attachment"] = 11] = "Attachment";
})(ApplicationCommandOptionType || (ApplicationCommandOptionType = {}));
var InteractionTypes;
(function (InteractionTypes) {
    InteractionTypes[InteractionTypes["ApplicationCommand"] = 2] = "ApplicationCommand";
    InteractionTypes[InteractionTypes["MessageComponent"] = 3] = "MessageComponent";
})(InteractionTypes || (InteractionTypes = {}));

var InfoItem = ({ option, parent, debugOptions, onConfirmCallback }) => {
  const [isActive, setIsActive] = React.useState(get(name, parent, {})[option]);
  React.useEffect(() => {
    const parentData = get(name, parent, {});
    if (!parentData[option]) {
      Store.item(
        {
          name: parent,
          content: { ...parentData, [option]: false },
          type: "setting",
          override: {}
        }
      );
    }
  }, []);
  const styles = StyleSheet.createThemedStyleSheet({
    icon: {
      color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
    },
    itemDisabled: {
      color: Constants.ThemeColorMap.TEXT_MUTED
    },
    itemEnabled: {
      color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
    }
  });
  return /* @__PURE__ */ React.createElement(FormRow, {
    key: option,
    label: option,
    onPress: () => {
      const parentData = get(name, parent, {});
      Store.item(
        {
          name: parent,
          content: { ...parentData, [option]: !parentData[option] },
          type: "setting",
          override: {}
        }
      );
      setIsActive(get(name, parent, {})[option]);
    },
    onLongPress: async function() {
      await onConfirmCallback(await Debug.debugInfo({ [parent]: { [option]: true } }), "single log");
    },
    leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
      style: styles.icon,
      source: isActive ? Icons.Settings.Toasts.Settings : Icons.Settings.Toasts.Failed
    }),
    trailing: () => /* @__PURE__ */ React.createElement(Text, {
      style: [{ paddingRight: 10, paddingTop: 5, paddingBottom: 5 }, isActive ? styles.itemEnabled : styles.itemDisabled]
    }, debugOptions[parent][option])
  });
};

const Animated$2 = window.enmity.modules.common.Components.General.Animated;
const Easing = window.enmity.modules.common.Components.General.Easing;
var Dialog = ({ label, content, type }) => {
  var _a;
  const styles = StyleSheet.createThemedStyleSheet({
    button: {
      width: "92%",
      borderRadius: 10,
      marginLeft: "4%",
      marginRight: "4%",
      ...Miscellaneous.shadow
    },
    text: {
      color: "#f2f2f2",
      textAlign: "left",
      letterSpacing: 0.25,
      padding: 10
    },
    textHeader: {
      fontSize: 20,
      fontFamily: Constants.Fonts.PRIMARY_BOLD
    },
    textContent: {
      fontSize: 16,
      fontFamily: Constants.Fonts.PRIMARY_NORMAL
    },
    image: {
      width: 25,
      height: 25,
      borderRadius: 4,
      position: "absolute",
      right: 0,
      margin: 10
    }
  });
  const animatedButtonScale = React.useRef(new Animated$2.Value(1)).current;
  const onPress = () => {
    const animate = () => Animated$2.timing(animatedButtonScale, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.sin
    }).start();
    Dialog$1.show({
      title: "Close Tip?",
      body: `You can either hide this information box forever, or just hide it until you open this page again.`,
      confirmText: "Hide",
      cancelText: "Don't show again",
      onConfirm: () => {
        animate();
      },
      onCancel: async function() {
        await Store.item(
          {
            name: label,
            content: true,
            type: "setting"
          },
          `storing dialog at ${label} in Dialog component`
        );
        animate();
      }
    });
  };
  const types = {
    standard: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      marginTop: 20
    },
    floating: {
      position: "absolute",
      bottom: 0,
      marginBottom: 30,
      backgroundColor: "rgba(0, 0, 0, 0.8)"
    }
  };
  const animatedScaleStyle = {
    transform: [
      {
        scale: animatedButtonScale
      }
    ]
  };
  return !get(name, label, false) ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Animated$2.View, {
    style: animatedScaleStyle
  }, /* @__PURE__ */ React.createElement(TouchableOpacity, {
    style: [styles.button, (_a = types[type]) != null ? _a : types["standard"]],
    onPress
  }, /* @__PURE__ */ React.createElement(View, {
    style: {
      width: "100%",
      flexDirection: "row"
    }
  }, /* @__PURE__ */ React.createElement(Image, {
    style: styles.image,
    source: {
      uri: "https://i.imgur.com/rl1ga06.png"
    }
  })), /* @__PURE__ */ React.createElement(Text, {
    style: [styles.text, styles.textHeader]
  }, label), /* @__PURE__ */ React.createElement(Text, {
    style: [styles.text, styles.textContent]
  }, content)))) : /* @__PURE__ */ React.createElement(React.Fragment, null);
};

var ExitWrapper = ({ component }) => {
  const [touchX, setTouchX] = React.useState();
  const [touchY, setTouchY] = React.useState();
  return /* @__PURE__ */ React.createElement(ScrollView, {
    onTouchStart: (e) => {
      setTouchX(e.nativeEvent.pageX);
      setTouchY(e.nativeEvent.pageY);
    },
    onTouchEnd: (e) => {
      touchX - e.nativeEvent.pageX < -100 && touchY - e.nativeEvent.pageY < 40 && touchY - e.nativeEvent.pageY > -40 ? Navigation.pop() : null;
    }
  }, component);
};

var SectionWrapper = ({ label, component }) => {
  const styles = StyleSheet.createThemedStyleSheet({
    text: {
      color: Constants.ThemeColorMap.HEADER_SECONDARY,
      paddingLeft: "5.5%",
      paddingRight: 10,
      marginBottom: 10,
      letterSpacing: 0.25,
      fontFamily: Constants.Fonts.PRIMARY_BOLD,
      fontSize: 12
    }
  });
  return /* @__PURE__ */ React.createElement(View, {
    style: { marginTop: 10 }
  }, /* @__PURE__ */ React.createElement(Text, {
    style: [styles.text, styles.optionText]
  }, label.toUpperCase()), component);
};

const Search$1 = getByName("StaticSearchBarContainer");
var Info = ({ onConfirmCallback }) => {
  const [options, setOptions] = React.useState([]);
  const [query, setQuery] = React.useState([]);
  React.useEffect(async function() {
    setOptions(await Debug.fetchDebugArguments());
  }, []);
  const styles = StyleSheet.createThemedStyleSheet({
    button: {
      width: "90%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Constants.ThemeColorMap.HEADER_PRIMARY,
      borderRadius: 10,
      marginLeft: "5%",
      marginRight: "5%",
      marginTop: 20
    },
    text: {
      color: Miscellaneous.filterColor(Constants.ThemeColorMap.HEADER_PRIMARY[0], "#f2f2f2", "#121212", 0.8, "buttons in debug info menu"),
      textAlign: "center",
      paddingLeft: 10,
      paddingRight: 10,
      letterSpacing: 0.25,
      fontFamily: Constants.Fonts.PRIMARY_BOLD
    },
    buttonText: {
      fontSize: 16
    },
    container: {
      width: "90%",
      marginLeft: "5%",
      borderRadius: 10,
      backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
      ...Miscellaneous.shadow
    }
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Search$1, {
    placeholder: "Search Options",
    onChangeText: (text) => setQuery(text)
  }), /* @__PURE__ */ React.createElement(ExitWrapper, {
    component: /* @__PURE__ */ React.createElement(View, {
      style: {
        marginBottom: 100
      }
    }, ArrayImplementations.mapItem(Object.keys(options), (option) => /* @__PURE__ */ React.createElement(SectionWrapper, {
      label: option,
      component: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View, {
        style: styles.container
      }, ArrayImplementations.mapItem(
        ArrayImplementations.filterItem(Object.keys(options[option]), (subOption) => subOption.toLowerCase().includes(query)),
        (subOption, index, array) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(InfoItem, {
          option: subOption,
          parent: option,
          debugOptions: options,
          onConfirmCallback
        }), index !== array.length - 1 ? /* @__PURE__ */ React.createElement(FormDivider, null) : null),
        `list of debug information options in ${option}`
      )))
    })), /* @__PURE__ */ React.createElement(TouchableOpacity, {
      style: styles.button,
      onPress: async function() {
        await onConfirmCallback(await Debug.debugInfo(await Debug.fetchDebugArguments()), "full log");
      }
    }, /* @__PURE__ */ React.createElement(Text, {
      style: [styles.text, styles.buttonText]
    }, "Send All")), /* @__PURE__ */ React.createElement(TouchableOpacity, {
      style: styles.button,
      onPress: async function() {
        const debugOptions = ArrayImplementations.mapItem(Object.keys(options), (option) => {
          var _a;
          return { [option]: (_a = get(name, option, {})) != null ? _a : {} };
        }).reduce((acc, obj) => ({ ...acc, ...obj }), {});
        await onConfirmCallback(await Debug.debugInfo(debugOptions), "partial log");
      }
    }, /* @__PURE__ */ React.createElement(Text, {
      style: [styles.text, styles.buttonText]
    }, "Send Message")), /* @__PURE__ */ React.createElement(Dialog, {
      label: "Information",
      content: `You can either tap on each item to toggle it and press "Send Message", or you can long-press on an item to only send that item.

To close this dialog, press on it.`,
      type: "standard"
    }))
  }));
};

var Page = ({ name = "Page", component = View, CustomNavigationStack = NavigationStack.createStackNavigator() } = {}) => {
  const styles = StyleSheet.createThemedStyleSheet({
    ...Miscellaneous.PageStyles
  });
  const Button = ({ onPress, title }) => {
    return /* @__PURE__ */ React.createElement(TouchableOpacity, {
      onPress
    }, /* @__PURE__ */ React.createElement(Text, {
      style: [styles.text, { marginLeft: 16 }]
    }, title));
  };
  return /* @__PURE__ */ React.createElement(NavigationNative.NavigationContainer, {
    independent: true
  }, /* @__PURE__ */ React.createElement(CustomNavigationStack.Navigator, {
    initialRouteName: name,
    style: styles.container,
    screenOptions: {
      cardOverlayEnabled: false,
      cardShadowEnabled: true,
      ...Miscellaneous.PageOptions
    }
  }, /* @__PURE__ */ React.createElement(CustomNavigationStack.Screen, {
    name,
    component,
    options: {
      headerTitleStyle: styles.title,
      headerLeft: () => /* @__PURE__ */ React.createElement(Button, {
        title: "Close",
        onPress: () => {
          Navigation.pop();
        }
      })
    }
  })));
};

var LanguageNamesArray = [
  "detect",
  "amharic",
  "arabic",
  "aymara",
  "assamese",
  "akan",
  "azerbaijani",
  "belarusian",
  "bulgarian",
  "bambara",
  "bengali",
  "corsican",
  "czech",
  "bosnian",
  "danish",
  "catalan",
  "valencian",
  "german",
  "ewe",
  "divehi",
  "dhivehi",
  "maldivian",
  "english",
  "greek",
  "estonian",
  "esperanto",
  "basque",
  "spanish",
  "castilian",
  "finnish",
  "french",
  "persian",
  "irish",
  "galician",
  "guarani",
  "western_frisian",
  "gujarati",
  "gaelic",
  "scottish_gaelic",
  "hausa",
  "croatian",
  "hebrew",
  "hindi",
  "haitian",
  "haitian_creole",
  "armenian",
  "indonesian",
  "hungarian",
  "igbo",
  "icelandic",
  "italian",
  "georgian",
  "javanese",
  "japanese",
  "korean",
  "kazakh",
  "kannada",
  "afrikaans",
  "central_khmer",
  "welsh",
  "kurdish",
  "kirghiz",
  "kyrgyz",
  "latin",
  "luxembourgish",
  "letzeburgesch",
  "ganda",
  "lao",
  "latvian",
  "lingala",
  "lithuanian",
  "malagasy",
  "macedonian",
  "malayalam",
  "maori",
  "marathi",
  "norwegian_bokm\xE5l",
  "mongolian",
  "burmese",
  "maltese",
  "nepali",
  "malay",
  "dutch",
  "flemish",
  "chichewa",
  "chewa",
  "nyanja",
  "norwegian",
  "oromo",
  "oriya",
  "panjabi",
  "punjabi",
  "polish",
  "quechua",
  "pushto",
  "pashto",
  "russian",
  "sanskrit",
  "romanian",
  "moldavian",
  "moldovan",
  "slovenian",
  "kinyarwanda",
  "slovak",
  "sinhala",
  "sinhalese",
  "samoan",
  "shona",
  "somali",
  "serbian",
  "albanian",
  "swahili",
  "southern_sotho",
  "swedish",
  "sundanese",
  "tamil",
  "tajik",
  "telugu",
  "tagalog",
  "turkmen",
  "tigrinya",
  "thai",
  "tsonga",
  "sindhi",
  "portuguese",
  "twi",
  "turkish",
  "tatar",
  "urdu",
  "ukrainian",
  "uighur",
  "uyghur",
  "uzbek",
  "vietnamese",
  "yiddish",
  "xhosa",
  "chinese_traditional",
  "chinese_simplified",
  "zulu",
  "yoruba"
];

var ISO = [
  "auto",
  "am",
  "ar",
  "ay",
  "as",
  "ak",
  "az",
  "be",
  "bg",
  "bm",
  "bn",
  "co",
  "cs",
  "bs",
  "da",
  "ca",
  "ca",
  "de",
  "ee",
  "dv",
  "dv",
  "dv",
  "en",
  "el",
  "et",
  "eo",
  "eu",
  "es",
  "es",
  "fi",
  "fr",
  "fa",
  "ga",
  "gl",
  "gn",
  "fy",
  "gu",
  "gd",
  "gd",
  "ha",
  "hr",
  "he",
  "hi",
  "ht",
  "ht",
  "hy",
  "id",
  "hu",
  "ig",
  "is",
  "it",
  "ka",
  "jv",
  "ja",
  "ko",
  "kk",
  "kn",
  "af",
  "km",
  "cy",
  "ku",
  "ky",
  "ky",
  "la",
  "lb",
  "lb",
  "lg",
  "lo",
  "lv",
  "ln",
  "lt",
  "mg",
  "mk",
  "ml",
  "mi",
  "mr",
  "nb",
  "mn",
  "my",
  "mt",
  "ne",
  "ms",
  "nl",
  "nl",
  "ny",
  "ny",
  "ny",
  "no",
  "om",
  "or",
  "pa",
  "pa",
  "pl",
  "qu",
  "ps",
  "ps",
  "ru",
  "sa",
  "ro",
  "ro",
  "ro",
  "sl",
  "rw",
  "sk",
  "si",
  "si",
  "sm",
  "sn",
  "so",
  "sr",
  "sq",
  "sw",
  "st",
  "sv",
  "su",
  "ta",
  "tg",
  "te",
  "tl",
  "tk",
  "ti",
  "th",
  "ts",
  "sd",
  "pt",
  "tw",
  "tr",
  "tt",
  "ur",
  "uk",
  "ug",
  "ug",
  "uz",
  "vi",
  "yi",
  "xh",
  "zh-tw",
  "zh-cn",
  "zu",
  "yo"
];

var _a, _b, _c;
const [
  Clipboard$2
] = bulk(
  filters.byProps("setString")
);
const options = (channelName) => {
  return {
    debug: async function() {
      const fullDebugLog = await Debug.debugInfo(
        await Debug.fetchDebugArguments(),
        "full log"
      );
      return await new Promise((resolve) => {
        Dialog$1.show({
          title: "Choose extra options",
          body: 'You can customize the information sent with this command. If you do not want to customize the debug log, press "`Ignore`" instead to send the full log.',
          confirmText: "Customize",
          cancelText: "Ignore",
          onConfirm: () => {
            const wrapper = () => /* @__PURE__ */ React.createElement(Info, {
              onConfirmCallback: (debugLog, type) => {
                Navigation.pop();
                Toasts.open({
                  content: `Sent ${type} log in #${channelName}.`,
                  source: Icons.Settings.Toasts.Settings
                });
                resolve({
                  content: debugLog
                });
              }
            });
            Navigation.push(Page, { component: wrapper, name: `${name}: Customize` });
          },
          onCancel: () => {
            Toasts.open({
              content: `Sent full log in #${channelName}.`,
              source: Icons.Settings.Toasts.Settings
            });
            resolve({
              content: fullDebugLog
            });
          }
        });
      });
    },
    clearStores: async function() {
      var _a2;
      const storeItems = (_a2 = JSON.parse(await Storage.getItem("dislate_store_state"))) != null ? _a2 : [];
      ArrayImplementations.forItem(storeItems, async function(item) {
        var _a3;
        item.type === "storage" ? await Storage.removeItem(item.name) : set(name, item.name, (_a3 = item.override) != null ? _a3 : false);
      }, "clearing state store");
      await Storage.removeItem("dislate_store_state");
      return await new Promise(async function(resolve) {
        Toasts.open({
          content: `Cleared all ${name} stores.`,
          source: Icons.Settings.Toasts.Settings
        });
        resolve({});
      });
    },
    download: async function() {
      return await new Promise((resolve) => {
        Clipboard$2.setString(`${plugin.download}?${Math.floor(Math.random() * 1001)}.js`);
        Miscellaneous.displayToast("download link", "clipboard");
        resolve({});
      });
    },
    Example: async function() {
      const englishContent = "Example Message. Enmity is a state or feeling of active opposition or hostility.";
      const randomLanguageIndex = Math.floor(Math.random() * LanguageNamesArray.length);
      const randomLanguageName = LanguageNamesArray[randomLanguageIndex];
      const translatedContent = await Translate.string(
        englishContent,
        {
          fromLang: "detect",
          toLang: randomLanguageName
        },
        Object.assign({}, ...LanguageNamesArray.map((k, i) => ({ [k]: ISO[i] })))
      );
      return await new Promise((resolve) => {
        Dialog$1.show({
          title: "Are you sure?",
          body: `**This is a testing message.**
You are about to send the following:

**English:** ${englishContent}

**${Format.string(randomLanguageName)}:** ${translatedContent}

Are you sure you want to send this? :3`,
          confirmText: "Yep, send it!",
          cancelText: "Nope, don't send it",
          onConfirm: () => {
            Toasts.open({
              content: `Sent test message in #${channelName}.`,
              source: Icons.Translate
            });
            resolve({ content: `**[${name}] Test Message**

**English:** ${englishContent}
**${Format.string(randomLanguageName)}:** ${translatedContent}` });
          },
          onCancel: () => {
            Toasts.open({
              content: `Cancelled translated message request.`,
              source: Icons.Cancel
            });
            resolve({});
          }
        });
      });
    }
  };
};
const commandOptions = ArrayImplementations.mapItem(
  Object.keys(options("placeholder")),
  (item) => {
    return {
      name: Format.string(item, true),
      displayName: Format.string(item, true),
      value: item
    };
  },
  "debug options formatted as a command format"
);
var DebugCommand = {
  id: `${(_a = name) == null ? void 0 : _a.toLowerCase()}`,
  name: `${(_b = name) == null ? void 0 : _b.toLowerCase()}`,
  displayName: `${(_c = name) == null ? void 0 : _c.toLowerCase()}`,
  description: `Choose from a list of options for debugging in ${name}.`,
  displayDescription: `Choose from a list of options for debugging in ${name}.`,
  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,
  options: [{
    name: "type",
    displayName: "type",
    description: "The type of command to execute.",
    displayDescription: "The type of command to execute.",
    type: ApplicationCommandOptionType.String,
    choices: [...commandOptions],
    required: true
  }],
  execute: async function(args, context) {
    var _a2;
    const commandType = ArrayImplementations.findItem(args, (o) => o.name == "type").value;
    const availableOptions = options(context.channel.name);
    const throwToast = () => {
      Toasts.open({ content: "Invalid command argument.", source: Icons.Clock });
    };
    const chosenOption = (_a2 = availableOptions[commandType]) != null ? _a2 : throwToast;
    return await chosenOption();
  }
};

function sendReply(channelID, content, username, avatarURL) {
    window.enmity.clyde.sendReply(channelID, content, username, avatarURL);
}

const languageOptions = ArrayImplementations.mapItem(
  ArrayImplementations.filterItem(LanguageNamesArray, (e) => e !== "detect", "filter for everything except for detect"),
  (item) => ({
    name: Format.string(item),
    displayName: Format.string(item),
    value: item
  }),
  "language names"
);
var TranslateCommand = {
  id: "translate",
  name: "translate",
  displayName: "translate",
  description: `Send a message using ${name} in any language chosen, using the Google Translate API.`,
  displayDescription: `Send a message using ${name} in any language chosen, using the Google Translate API.`,
  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,
  options: [
    {
      name: "text",
      displayName: "text",
      description: `The text/message for ${name} to translate. Please note some formatting of mentions and emojis may break due to the API.`,
      displayDescription: `The text/message for ${name} to translate. Please note some formatting of mentions and emojis may break due to the API.`,
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: "language",
      displayName: "language",
      description: `The language that ${name} will translate the text into. This can be any language from the list, except "Detect".`,
      displayDescription: `The language that ${name} will translate the text into. This can be any language from the list, except "Detect".`,
      type: ApplicationCommandOptionType.String,
      choices: [...languageOptions],
      required: true
    }
  ],
  execute: async function(args, context) {
    const message = ArrayImplementations.findItem(args, (o) => o.name == "text", "translate text").value;
    const language = ArrayImplementations.findItem(args, (o) => o.name == "language", "translate language").value;
    const languageMap = Object.assign({}, ...LanguageNamesArray.map((k, i) => ({ [k]: ISO[i] })));
    const translatedContent = await Translate.string(
      message,
      {
        fromLang: get(name, "DislateLangFrom", "detect"),
        toLang: language
      },
      languageMap
    );
    const translatedBack = await Translate.string(
      translatedContent,
      {
        fromLang: get(name, "DislateLangFrom", "detect"),
        toLang: get(name, "DislateLangTo", "english")
      },
      languageMap
    );
    if (!translatedContent || !translatedBack) {
      sendReply(context.channel.id, `Failed to send message in #${context.channel.name}`);
      return {};
    }
    return await new Promise((resolve) => {
      Dialog$1.show({
        title: "Are you sure?",
        body: `The message **about to be sent** is:
\`${translatedContent}\`

In **${Format.string(get(name, "DislateLangTo", "english"))}**, this will translate to:
\`${translatedBack}\`

${get(name, "DislateBothLangToggle", false) ? `**Note: Sending original and translated**
` : ""}Are you sure you want to send this? :3`,
        confirmText: "Yep, send it!",
        cancelText: "Nope, don't send it",
        onConfirm: () => {
          Toasts.open({
            content: `Sent message in #${context.channel.name}, which was translated into ${Format.string(language)}.`,
            source: Icons.Translate
          });
          resolve({ content: get(name, "DislateBothLangToggle", false) ? `${message}

${translatedContent}` : translatedContent });
        },
        onCancel: () => {
          Toasts.open({
            content: `Cancelled translated message request.`,
            source: Icons.Cancel
          });
          resolve({});
        }
      });
    });
  }
};

var ISO2 = [
  "auto",
  "amh",
  "ara",
  "aym",
  "asm",
  "aka",
  "aze",
  "bel",
  "bul",
  "bam",
  "ben",
  "cos",
  "cze",
  "bos",
  "dan",
  "cat",
  "cat",
  "ger",
  "ewe",
  "div",
  "div",
  "div",
  "eng",
  "gre",
  "est",
  "epo",
  "baq",
  "spa",
  "spa",
  "fin",
  "fre",
  "per",
  "gle",
  "glg",
  "grn",
  "fry",
  "guj",
  "gla",
  "gla",
  "hau",
  "hrv",
  "heb",
  "hin",
  "hat",
  "hat",
  "arm",
  "ind",
  "hun",
  "ibo",
  "ice",
  "ita",
  "geo",
  "jav",
  "jpn",
  "kor",
  "kaz",
  "kan",
  "afr",
  "khm",
  "wel",
  "kur",
  "kir",
  "kir",
  "lat",
  "ltz",
  "ltz",
  "lug",
  "lao",
  "lav",
  "lin",
  "lit",
  "mlg",
  "mac",
  "mal",
  "mao",
  "mar",
  "nob",
  "mon",
  "bur",
  "mlt",
  "nep",
  "may",
  "dut",
  "dut",
  "nya",
  "nya",
  "nya",
  "nor",
  "orm",
  "ori",
  "pan",
  "pan",
  "pol",
  "que",
  "pus",
  "pus",
  "rus",
  "san",
  "rum",
  "rum",
  "rum",
  "slv",
  "kin",
  "slo",
  "sin",
  "sin",
  "smo",
  "sna",
  "som",
  "srp",
  "alb",
  "swa",
  "sot",
  "swe",
  "sun",
  "tam",
  "tgk",
  "tel",
  "tgl",
  "tuk",
  "tir",
  "tha",
  "tso",
  "snd",
  "por",
  "twi",
  "tur",
  "tat",
  "urd",
  "ukr",
  "uig",
  "uig",
  "uzb",
  "vie",
  "yid",
  "xho",
  "chit",
  "chis",
  "zul",
  "yor"
];

const Animated$1 = window.enmity.modules.common.Components.General.Animated;
var LanguageItem = ({ language, languages, Navigation }) => {
  const MappedISO2 = Object.assign({}, ...ISO.map((k, i) => ({ [k]: ISO2[i] })));
  const animatedButtonScale = React.useRef(new Animated$1.Value(1)).current;
  const onPressIn = () => Animated$1.spring(animatedButtonScale, {
    toValue: 1.05,
    duration: 250,
    useNativeDriver: true
  }).start();
  const onPressOut = () => Animated$1.spring(animatedButtonScale, {
    toValue: 1,
    duration: 250,
    useNativeDriver: true
  }).start();
  const animatedScaleStyle = {
    transform: [
      {
        scale: animatedButtonScale
      }
    ]
  };
  const styles = StyleSheet.createThemedStyleSheet({
    container: {
      width: "95%",
      marginLeft: "2.5%",
      borderRadius: 10,
      marginTop: 15,
      backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY
    }
  });
  const setLanguage = (language2) => {
    set(name, `DislateLang${get(name, "DislateLangFilter") ? "To" : "From"}`, language2);
    Toasts.open({
      content: `Set ${languages[language2].toUpperCase()} as Language to Translate ${get("Dislate", "DislateLangFilter") ? "to" : "from"}.`,
      source: get(name, "DislateLangFilter") ? Icons.Settings.TranslateTo : Icons.Settings.TranslateFrom
    });
    Navigation.navigate("Settings");
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(TouchableOpacity, {
    onPress: () => setLanguage(language),
    onLongPress: () => setLanguage(language),
    onPressIn,
    onPressOut
  }, /* @__PURE__ */ React.createElement(Animated$1.View, {
    style: [animatedScaleStyle, styles.container]
  }, /* @__PURE__ */ React.createElement(FormRow, {
    label: Format.string(language),
    subLabel: `Aliases: ${languages[language]}, ${MappedISO2[languages[language]]}`,
    trailing: FormRow.Arrow,
    leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
      style: { color: Constants.ThemeColorMap.INTERACTIVE_NORMAL },
      source: language == get(name, `DislateLang${get(name, "DislateLangFilter") ? "To" : "From"}`) ? Icons.Settings.Toasts.Settings : Icons.Add
    })
  }))));
};

const Search = getByName("StaticSearchBarContainer");
var Languages = ({ languages, Navigator }) => {
  const [query, setQuery] = React.useState([]);
  const Navigation = Navigator.useNavigation();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Search, {
    placeholder: "Search Language",
    onChangeText: (text) => setQuery(text)
  }), /* @__PURE__ */ React.createElement(ScrollView, {
    style: { marginBottom: 15 }
  }, ArrayImplementations.mapItem(
    ArrayImplementations.filterItem(Object.keys(languages), (language) => language.toLowerCase().includes(query), "getting searched languages"),
    (language) => get(name, "DislateLangFilter") && language == "detect" ? /* @__PURE__ */ React.createElement(React.Fragment, null) : /* @__PURE__ */ React.createElement(LanguageItem, {
      language,
      languages,
      Navigation
    }),
    "listing different possible languages"
  )), /* @__PURE__ */ React.createElement(Dialog, {
    label: "Important",
    content: `You can either press or long-press on an item to select it as the language to translate ${get(name, "DislateLangFilter") ? "to" : "from"}. Your current selected language has a \u2713 next to it.

To hide this dialog, press on it.`,
    type: "floating"
  }));
};

const Animated = window.enmity.modules.common.Components.General.Animated;
const [
  Router$1,
  Clipboard$1
] = bulk(
  filters.byProps("transitionToGuild"),
  filters.byProps("setString")
);
var Credits = ({ name, version, plugin, authors }) => {
  const styles = StyleSheet.createThemedStyleSheet({
    container: {
      marginTop: 25,
      marginLeft: "5%",
      marginBottom: -15,
      flexDirection: "row"
    },
    textContainer: {
      paddingLeft: 15,
      paddingTop: 5,
      flexDirection: "column",
      flexWrap: "wrap",
      ...Miscellaneous.shadow
    },
    image: {
      width: 75,
      height: 75,
      borderRadius: 10,
      ...Miscellaneous.shadow
    },
    mainText: {
      opacity: 0.975,
      letterSpacing: 0.25
    },
    header: {
      color: Constants.ThemeColorMap.HEADER_PRIMARY,
      fontFamily: Constants.Fonts.DISPLAY_BOLD,
      fontSize: 25,
      letterSpacing: 0.25
    },
    subHeader: {
      color: Constants.ThemeColorMap.HEADER_SECONDARY,
      fontSize: 12.75
    }
  });
  const animatedButtonScale = React.useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(animatedButtonScale, {
    toValue: 1.1,
    duration: 10,
    useNativeDriver: true
  }).start();
  const onPressOut = () => Animated.spring(animatedButtonScale, {
    toValue: 1,
    duration: 250,
    useNativeDriver: true
  }).start();
  const onPress = () => Router$1.openURL(plugin.repo);
  const animatedScaleStyle = {
    transform: [
      {
        scale: animatedButtonScale
      }
    ]
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View, {
    style: styles.container
  }, /* @__PURE__ */ React.createElement(TouchableOpacity, {
    onPress,
    onPressIn,
    onPressOut
  }, /* @__PURE__ */ React.createElement(Animated.View, {
    style: animatedScaleStyle
  }, /* @__PURE__ */ React.createElement(Image, {
    style: [styles.image],
    source: {
      uri: "https://i.imgur.com/rl1ga06.png"
    }
  }))), /* @__PURE__ */ React.createElement(View, {
    style: styles.textContainer
  }, /* @__PURE__ */ React.createElement(TouchableOpacity, {
    onPress: () => Router$1.openURL(plugin.repo)
  }, /* @__PURE__ */ React.createElement(Text, {
    style: [styles.mainText, styles.header]
  }, name)), /* @__PURE__ */ React.createElement(View, {
    style: { flexDirection: "row" }
  }, /* @__PURE__ */ React.createElement(Text, {
    style: [styles.mainText, styles.subHeader]
  }, "A project by"), ArrayImplementations.mapItem(authors, (author, index, authorsArray) => {
    return /* @__PURE__ */ React.createElement(TouchableOpacity, {
      onPress: () => Router$1.openURL(author.profile)
    }, /* @__PURE__ */ React.createElement(Text, {
      style: [styles.mainText, styles.subHeader, {
        paddingLeft: 4,
        fontFamily: Constants.Fonts.DISPLAY_BOLD,
        flexDirection: "row"
      }]
    }, author.name, index < authorsArray.length - 1 ? "," : null));
  })), /* @__PURE__ */ React.createElement(View, null, /* @__PURE__ */ React.createElement(TouchableOpacity, {
    style: { flexDirection: "row" },
    onPress: async function() {
      const options = await Debug.fetchDebugArguments();
      Clipboard$1.setString(await Debug.debugInfo(Object.keys(options)));
      Miscellaneous.displayToast("debug information", "clipboard");
    }
  }, /* @__PURE__ */ React.createElement(Text, {
    style: [styles.mainText, styles.subHeader]
  }, "Version:"), /* @__PURE__ */ React.createElement(Text, {
    style: [styles.mainText, styles.subHeader, {
      paddingLeft: 4,
      fontFamily: Constants.Fonts.DISPLAY_BOLD
    }]
  }, version))))));
};

const [
  Router,
  Clipboard
] = bulk(
  filters.byProps("transitionToGuild"),
  filters.byProps("setString")
);
var Settings = ({ settings, manifest: { name, version, plugin, authors, release }, Navigator }) => {
  const styles = StyleSheet.createThemedStyleSheet({
    icon: {
      color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
    },
    item: {
      color: Constants.ThemeColorMap.TEXT_MUTED,
      fontFamily: Constants.Fonts.PRIMARY_MEDIUM
    },
    container: {
      width: "90%",
      marginLeft: "5%",
      borderRadius: 10,
      backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
      ...Miscellaneous.shadow
    },
    subheaderText: {
      color: Constants.ThemeColorMap.HEADER_SECONDARY,
      textAlign: "center",
      margin: 10,
      marginBottom: 50,
      letterSpacing: 0.25,
      fontFamily: Constants.Fonts.PRIMARY_BOLD,
      fontSize: 14
    }
  });
  const Navigation = Navigator.useNavigation();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ExitWrapper, {
    component: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Credits, {
      name,
      version,
      plugin,
      authors
    }), /* @__PURE__ */ React.createElement(View, {
      style: { marginTop: 20 }
    }, /* @__PURE__ */ React.createElement(SectionWrapper, {
      label: "Language",
      component: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View, {
        style: styles.container
      }, /* @__PURE__ */ React.createElement(FormRow, {
        label: "Translate From",
        leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
          style: styles.icon,
          source: Icons.Settings.TranslateFrom
        }),
        trailing: () => {
          var _a;
          return /* @__PURE__ */ React.createElement(View, {
            style: { flexDirection: "row", justifyContent: "center", alignItems: "center" }
          }, /* @__PURE__ */ React.createElement(Text, {
            adjustsFontSizeToFit: true,
            style: styles.item
          }, (_a = Format.string(get(name, "DislateLangFrom", "detect"))) != null ? _a : "N/A"), /* @__PURE__ */ React.createElement(FormRow.Arrow, null));
        },
        onPress: () => {
          set(name, "DislateLangFilter", false);
          Navigation.navigate(`Language`);
        },
        onLongPress: () => Miscellaneous.displayToast('Open a new page allowing you to choose a language that you can translate from. The default is "Detect".', "tooltip")
      }), /* @__PURE__ */ React.createElement(FormDivider, null), /* @__PURE__ */ React.createElement(FormRow, {
        label: "Translate To",
        leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
          style: styles.icon,
          source: Icons.Settings.TranslateTo
        }),
        trailing: () => {
          var _a;
          return /* @__PURE__ */ React.createElement(View, {
            style: { flexDirection: "row", justifyContent: "center", alignItems: "center" }
          }, /* @__PURE__ */ React.createElement(Text, {
            adjustsFontSizeToFit: true,
            style: styles.item
          }, (_a = Format.string(get(name, "DislateLangTo", "english"))) != null ? _a : "N/A"), /* @__PURE__ */ React.createElement(FormRow.Arrow, null));
        },
        onPress: () => {
          set(name, "DislateLangFilter", true);
          Navigation.navigate(`Language`);
        },
        onLongPress: () => Miscellaneous.displayToast('Open a new page allowing you to choose a language that you can translate to. The default is "English".', "tooltip")
      }), /* @__PURE__ */ React.createElement(FormDivider, null), /* @__PURE__ */ React.createElement(FormRow, {
        label: "Abbreviate Language",
        leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
          style: styles.icon,
          source: Icons.Retry
        }),
        subLabel: `Label language in a shorter form when translating (English \u279D EN).`,
        onLongPress: () => Miscellaneous.displayToast("Convert the full language name to an abbreviation when translating someone else's message. (test [English] \u279D test [EN])", "tooltip"),
        trailing: /* @__PURE__ */ React.createElement(FormSwitch, {
          value: settings.getBoolean("DislateLangAbbr", false),
          onValueChange: () => {
            settings.toggle("DislateLangAbbr", false);
            Toasts.open({
              content: `Successfully ${settings.getBoolean("DislateLangAbbr", false) ? "enabled" : "disabled"} language abbreviations.`,
              source: Icons.Settings.Toasts.Settings
            });
          }
        })
      }), /* @__PURE__ */ React.createElement(FormDivider, null), /* @__PURE__ */ React.createElement(FormRow, {
        label: "Send Original",
        leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
          style: styles.icon,
          source: Icons.Settings.Locale
        }),
        subLabel: `Send both the Original and Translated message when using /translate.`,
        onLongPress: () => Miscellaneous.displayToast("When using the /translate command, send both the original message and the translated message at once.", "tooltip"),
        trailing: /* @__PURE__ */ React.createElement(FormSwitch, {
          value: settings.getBoolean("DislateBothLangToggle", false),
          onValueChange: () => {
            settings.toggle("DislateBothLangToggle", false);
            Toasts.open({
              content: `Now sending ${settings.getBoolean("DislateBothLangToggle", false) ? "original and translated" : "only translated"} message.`,
              source: Icons.Settings.Toasts.Settings
            });
          }
        })
      })))
    }), /* @__PURE__ */ React.createElement(SectionWrapper, {
      label: "Utility",
      component: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View, {
        style: styles.container
      }, /* @__PURE__ */ React.createElement(FormRow, {
        label: "Initialisation Toasts",
        leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
          style: styles.icon,
          source: Icons.Settings.Initial
        }),
        subLabel: `Toggle initialisation toasts to display loading state of ${name}.`,
        onLongPress: () => Miscellaneous.displayToast(`When Enmity is first started, show toasts based on ${name}'s current state (starting, failed, retrying, etc)`, "tooltip"),
        trailing: /* @__PURE__ */ React.createElement(FormSwitch, {
          value: settings.getBoolean("toastEnable", false),
          onValueChange: () => {
            settings.toggle("toastEnable", false);
            Toasts.open({
              content: `Successfully ${settings.getBoolean("toastEnable", false) ? "enabled" : "disabled"} Load Toasts.`,
              source: Icons.Settings.Toasts.Settings
            });
          }
        })
      }), /* @__PURE__ */ React.createElement(FormDivider, null), /* @__PURE__ */ React.createElement(FormRow, {
        label: "Copy Debug Info",
        subLabel: `Copy useful debug information like version and build of ${name} to clipboard.`,
        onLongPress: () => Miscellaneous.displayToast(`Copy the full debug log to clipboard including ${name}'s Version, Build, and Release, Enmity's Version and Build, etc.`, "tooltip"),
        leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
          style: styles.icon,
          source: Icons.Copy
        }),
        trailing: FormRow.Arrow,
        onPress: async function() {
          const options = await Debug.fetchDebugArguments();
          Clipboard.setString(await Debug.debugInfo(Object.keys(options)));
          Miscellaneous.displayToast("debug information", "clipboard");
        }
      }), /* @__PURE__ */ React.createElement(FormDivider, null), /* @__PURE__ */ React.createElement(FormRow, {
        label: "Clear Stores",
        subLabel: `Void most of the settings and stores used throughout ${name} to store data locally.`,
        onLongPress: () => Miscellaneous.displayToast(`Clear stores and settings throughout ${name} including the settings to hide popups forever and the list of device codes.`, "tooltip"),
        leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
          style: styles.icon,
          source: Icons.Delete
        }),
        trailing: FormRow.Arrow,
        onPress: async function() {
          var _a;
          const storeItems = (_a = JSON.parse(await Storage.getItem("dislate_store_state"))) != null ? _a : [];
          ArrayImplementations.forItem(storeItems, async function(item) {
            var _a2;
            item.type === "storage" ? await Storage.removeItem(item.name) : set(name, item.name, (_a2 = item.override) != null ? _a2 : false);
          }, "clearing state store");
          await Storage.removeItem("dislate_store_state");
          Toasts.open({
            content: `Cleared all ${name} stores.`,
            source: Icons.Settings.Toasts.Settings
          });
        }
      })))
    }), /* @__PURE__ */ React.createElement(SectionWrapper, {
      label: "Source",
      component: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View, {
        style: styles.container
      }, /* @__PURE__ */ React.createElement(FormRow, {
        label: "Check for Updates",
        subLabel: `Search for any ${name} updates and notify you if an update is available.`,
        onLongPress: () => Miscellaneous.displayToast(`Search GitHub for any new version or build of ${name} and prompts you to update, and then prompts you to restart Enmity afterwards.`, "tooltip"),
        leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
          style: styles.icon,
          source: Icons.Settings.Update
        }),
        trailing: FormRow.Arrow,
        onPress: async function() {
          await Updater.checkForUpdates();
        }
      }), /* @__PURE__ */ React.createElement(FormDivider, null), /* @__PURE__ */ React.createElement(FormRow, {
        label: "Source",
        subLabel: `Open the repository of ${name} externally.`,
        onLongPress: () => Miscellaneous.displayToast(`Opens the repository of ${name} on GitHub in an external page to view any source code of the plugin.`, "tooltip"),
        leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
          style: styles.icon,
          source: Icons.Open
        }),
        trailing: FormRow.Arrow,
        onPress: () => {
          Router.openURL(plugin.repo);
        }
      })))
    })), /* @__PURE__ */ React.createElement(Text, {
      style: styles.subheaderText
    }, `Build: (${plugin.build.split("-")[1]}) Release: (${release})`))
  }));
};

const Stack = NavigationStack.createStackNavigator();
const Navigator = getByKeyword("getFocusedRoute");
const Icon$1 = getByName("Icon");
var Stack$1 = ({ settings, manifest: { name, version, plugin, authors, release }, languages }) => {
  const SettingsWrapper = () => /* @__PURE__ */ React.createElement(Settings, {
    settings,
    manifest: { name, version, plugin, authors, release },
    Navigator
  });
  const LanguagesWrapper = () => /* @__PURE__ */ React.createElement(Languages, {
    languages,
    Navigator
  });
  const styles = StyleSheet.createThemedStyleSheet({
    ...Miscellaneous.PageStyles
  });
  return /* @__PURE__ */ React.createElement(Stack.Navigator, {
    initialRouteName: "Settings",
    style: styles.container,
    screenOptions: {
      ...Miscellaneous.PageOptions
    }
  }, /* @__PURE__ */ React.createElement(Stack.Screen, {
    name: "Settings",
    component: SettingsWrapper,
    options: {
      headerShown: false
    }
  }), /* @__PURE__ */ React.createElement(Stack.Screen, {
    name: "Language",
    component: LanguagesWrapper,
    options: {
      title: `Translate ${getBoolean(name, "DislateLangFilter", true) ? "To" : "From"}`,
      headerTitleStyle: styles.title,
      headerBackTitleStyle: styles.text,
      headerBackImage: () => /* @__PURE__ */ React.createElement(Icon$1, {
        source: Icons.Settings.Back
      })
    }
  }));
};

const [
  LazyActionSheet,
  ChannelStore,
  Icon
] = bulk(
  filters.byProps("openLazy", "hideActionSheet"),
  filters.byProps("getChannel", "getDMFromUserId"),
  filters.byName("Icon")
);
const Patcher = create("dislate");
const LanguageNames = Object.assign({}, ...LanguageNamesArray.map((k, i) => ({ [k]: ISO[i] })));
let cachedData = [{ "invalid_id": "acquite sucks" }];
const Dislate = {
  ...manifest,
  commands: [],
  onStart() {
    this.commands = [
      DebugCommand,
      TranslateCommand
    ];
    let attempt = 0;
    const maxAttempts = 3;
    async function patchActionSheet() {
      var _a;
      try {
        attempt++;
        const MessageStore = getByProps("getMessage", "getMessages");
        const FluxDispatcher = getByProps(
          "_currentDispatchActionType",
          "_subscriptions",
          "_actionHandlers",
          "_waitQueue"
        );
        let enableToasts = getBoolean(manifest.name, "toastEnable", false);
        await Devices.isCompatibleDevice();
        for (const handler of ["MESSAGE_UPDATE"]) {
          try {
            FluxDispatcher == null ? void 0 : FluxDispatcher.dispatch({
              type: handler,
              message: {}
            });
          } catch (err) {
            console.error(`[${manifest.name} Local Error When Waking Up FluxDispatcher ${err}]`);
          }
        }
        console.log(`[${manifest.name}] delayed start attempt ${attempt}/${maxAttempts}.`);
        enableToasts ? (_a = Toasts) == null ? void 0 : _a.open({
          content: `[${manifest.name}] start attempt ${attempt}/${maxAttempts}.`,
          source: Icons.Debug
        }) : null;
        try {
          Patcher.before(LazyActionSheet, "openLazy", (_, [component, sheet], _res) => {
            if (sheet === "MessageLongPressActionSheet") {
              component.then((instance) => {
                const unpatchInstance = Patcher.after(instance, "default", (_2, message, res) => {
                  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
                  unpatchInstance();
                  let translateType = "Translate";
                  let buttonOffset = 0;
                  if (!(res == null ? void 0 : res.props)) {
                    console.log(`[${manifest.name} Local Error: Property "props" Does not Exist on "res"]`);
                    return res;
                  }
                  let finalLocation = (_e = (_d = (_c = (_b = (_a2 = res == null ? void 0 : res.props) == null ? void 0 : _a2.children) == null ? void 0 : _b.props) == null ? void 0 : _c.children) == null ? void 0 : _d.props) == null ? void 0 : _e.children[1];
                  if (!finalLocation) {
                    console.log(`[${manifest.name} Local Error: 'finalLocation' seems to be undefined!]`);
                    return res;
                  }
                  ArrayImplementations.forItem(Object.values(Miscellaneous.externalPlugins), (index) => {
                    if (ArrayImplementations.findItem(finalLocation, (item) => {
                      if (item.key !== Miscellaneous.externalPlugins.dislate) {
                        return item.key === index;
                      }
                    }, "external plugin list")) {
                      buttonOffset++;
                    }
                  }, "looping through external plugin keys");
                  if (ArrayImplementations.findItem(finalLocation, (item) => {
                    var _a3;
                    return ((_a3 = item.props) == null ? void 0 : _a3.message) === "Reply";
                  }, "reply button")) {
                    buttonOffset++;
                  }
                  if (ArrayImplementations.findItem(finalLocation, (item) => {
                    var _a3;
                    return ((_a3 = item.props) == null ? void 0 : _a3.message) === "Edit Message";
                  }, "edit message button")) {
                    buttonOffset++;
                  }
                  const originalMessage = MessageStore.getMessage(
                    (_g = (_f = message[0]) == null ? void 0 : _f.message) == null ? void 0 : _g.channel_id,
                    (_i = (_h = message[0]) == null ? void 0 : _h.message) == null ? void 0 : _i.id
                  );
                  if (!(originalMessage == null ? void 0 : originalMessage.content) && !((_k = (_j = message[0]) == null ? void 0 : _j.message) == null ? void 0 : _k.content)) {
                    console.log(`[${manifest.name}] No message content.`);
                    return res;
                  }
                  const messageId = (_n = originalMessage == null ? void 0 : originalMessage.id) != null ? _n : (_m = (_l = message[0]) == null ? void 0 : _l.message) == null ? void 0 : _m.id;
                  const messageContent = (_q = originalMessage == null ? void 0 : originalMessage.content) != null ? _q : (_p = (_o = message[0]) == null ? void 0 : _o.message) == null ? void 0 : _p.content;
                  const existingCachedObject = ArrayImplementations.findItem(cachedData, (o) => Object.keys(o)[0] === messageId, "cache object");
                  translateType = existingCachedObject ? "Revert" : "Translate";
                  const mainElement = /* @__PURE__ */ React.createElement(FormRow, {
                    key: Miscellaneous.externalPlugins.dislate,
                    label: translateType,
                    leading: /* @__PURE__ */ React.createElement(Icon, {
                      source: translateType === "Translate" ? Icons.Translate : Icons.Revert
                    }),
                    onPress: () => {
                      const fromLanguage = get(manifest.name, "DislateLangFrom", "detect");
                      const toLanguage = get(manifest.name, "DislateLangTo", "english");
                      const isTranslated = translateType === "Translate";
                      Translate.string(
                        originalMessage.content,
                        {
                          fromLang: fromLanguage,
                          toLang: toLanguage
                        },
                        LanguageNames,
                        !isTranslated
                      ).then((res2) => {
                        const editEvent = {
                          type: "MESSAGE_UPDATE",
                          message: {
                            ...originalMessage,
                            content: `${isTranslated ? res2 : existingCachedObject[messageId]} ${isTranslated ? `\`[${getBoolean(manifest.name, "DislateLangAbbr", false) ? LanguageNames[toLanguage].toUpperCase() : Format.string(toLanguage)}]\`` : ""}`,
                            guild_id: ChannelStore.getChannel(
                              originalMessage.channel_id
                            ).guild_id
                          },
                          log_edit: false
                        };
                        FluxDispatcher.dispatch(editEvent);
                        Toasts.open({
                          content: isTranslated ? `Modified message to ${Format.string(get(manifest.name, "DislateLangTo", "english"))}.` : `Reverted message back to original state.`,
                          source: Icons.Translate
                        });
                        isTranslated ? cachedData.unshift({ [messageId]: messageContent }) : cachedData = ArrayImplementations.filterItem(cachedData, (e) => e !== existingCachedObject, "cached data override");
                      });
                      LazyActionSheet.hideActionSheet();
                    }
                  });
                  ArrayImplementations.insertItem(finalLocation, mainElement, buttonOffset, "insert translate button");
                });
              });
            }
          });
        } catch (err) {
          console.error(`[${manifest.name}] Local ${err} At Intermediate Level`);
          enableToasts ? Toasts.open({
            content: `[${manifest.name}] failed to open action sheet.`,
            source: Icons.Retry
          }) : null;
        }
      } catch (err) {
        console.error(`[${manifest.name}] Local ${err} At Top Level`);
        let enableToasts = getBoolean(manifest.name, "toastEnable", false);
        if (attempt < maxAttempts) {
          const warningMessage = `[${manifest.name}] failed to initialise. Trying again in ${attempt}0s.`;
          console.warn(warningMessage);
          enableToasts ? Toasts.open({
            content: warningMessage,
            source: Icons.Retry
          }) : null;
          setTimeout(patchActionSheet, attempt * 1e4);
        } else {
          const errorMessage = `[${manifest.name}] failed to initialise. Giving up.`;
          console.error(errorMessage);
          enableToasts ? Toasts.open({
            content: errorMessage,
            source: Icons.Failed
          }) : null;
        }
      }
    }
    patchActionSheet();
  },
  onStop() {
    Patcher.unpatchAll();
    this.commands = [];
  },
  getSettingsPanel({ settings }) {
    return /* @__PURE__ */ React.createElement(Stack$1, {
      settings,
      manifest: {
        name: manifest.name,
        version: manifest.version,
        plugin: manifest.plugin,
        authors: manifest.authors,
        release: manifest.release
      },
      languages: LanguageNames
    });
  }
};
registerPlugin(Dislate);
