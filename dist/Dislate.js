const f=window.enmity.modules.common.Constants;window.enmity.modules.common.Clipboard,window.enmity.modules.common.Assets,window.enmity.modules.common.Messages,window.enmity.modules.common.Clyde,window.enmity.modules.common.Avatars,window.enmity.modules.common.Native;const n=window.enmity.modules.common.React;window.enmity.modules.common.Dispatcher,window.enmity.modules.common.Storage;const y=window.enmity.modules.common.Toasts;window.enmity.modules.common.Dialog,window.enmity.modules.common.Token,window.enmity.modules.common.REST,window.enmity.modules.common.Settings,window.enmity.modules.common.Users,window.enmity.modules.common.Navigation,window.enmity.modules.common.NavigationNative,window.enmity.modules.common.NavigationStack,window.enmity.modules.common.Theme,window.enmity.modules.common.Linking;const v=window.enmity.modules.common.StyleSheet;window.enmity.modules.common.ColorMap,window.enmity.modules.common.Components,window.enmity.modules.common.Locale,window.enmity.modules.common.Profiles,window.enmity.modules.common.Lodash,window.enmity.modules.common.Logger,window.enmity.modules.common.Flux,window.enmity.modules.common.SVG,window.enmity.modules.common.Scenes,window.enmity.modules.common.Moment;const{components:e}=window.enmity;e.Alert,e.Button,e.FlatList,e.Image,e.ImageBackground,e.KeyboardAvoidingView,e.Modal,e.Pressable,e.RefreshControl;const C=e.ScrollView;e.SectionList,e.StatusBar,e.StyleSheet,e.Switch,e.Text,e.TextInput,e.TouchableHighlight,e.TouchableOpacity,e.TouchableWithoutFeedback,e.Touchable,e.View,e.VirtualizedList,e.Form,e.FormArrow,e.FormCTA,e.FormCTAButton,e.FormCardSection,e.FormCheckbox;const E=e.FormDivider;e.FormHint,e.FormIcon,e.FormInput,e.FormLabel,e.FormRadio;const i=e.FormRow,g=e.FormSection;e.FormSelect,e.FormSubLabel;const P=e.FormSwitch;e.FormTernaryCheckBox,e.FormText,e.FormTextColors,e.FormTextSizes;function L(o){window.enmity.plugins.registerPlugin(o)}function l(o){return window.enmity.assets.getIDByName(o)}const s={byProps:(...o)=>window.enmity.modules.filters.byProps(...o),byName:(o,t)=>window.enmity.modules.filters.byName(o,t),byTypeName:(o,t)=>window.enmity.modules.filters.byTypeName(o,t),byDisplayName:(o,t)=>window.enmity.modules.filters.byDisplayName(o,t)};function p(...o){return window.enmity.modules.bulk(...o)}window.enmity.modules.common;function A(o){return window.enmity.patcher.create(o)}var r="Dislate",b="1.0.6",I="Translates text into a desired language.",h="development",D=[{name:"acquite",id:"581573474296791211"}],k="#ff1f84",N={name:r,version:b,description:I,release:h,authors:D,color:k};const[R,x]=p(s.byProps("transitionToGuild"),s.byProps("setString"));var _=({settings:o})=>{const t=l("ic_selection_checked_24px"),m=v.createThemedStyleSheet({icon:{color:f.ThemeColorMap.INTERACTIVE_NORMAL}});return n.createElement(n.Fragment,null,n.createElement(C,null,n.createElement(g,{title:"Disable Entire Plugin"},n.createElement(i,{label:"Disable Plugin",leading:n.createElement(i.Icon,{style:m.icon,source:l("ic_rulebook_16px")}),trailing:n.createElement(P,{value:o.getBoolean("masterDisable",!1),onValueChange:()=>{o.toggle("masterDisable",!1),y.open({content:`Successfully ${o.getBoolean("masterDisable",!1)?"disabled":"enabled"} ${r}.`,source:t})}})})),n.createElement(E,null),n.createElement(g,{title:"Source Code"},n.createElement(i,{label:"Download",subLabel:`Copy the link of ${r} to Clipboard`,leading:n.createElement(i.Icon,{style:m.icon,source:l("toast_copy_link")}),trailing:i.Arrow,onPress:()=>{x.setString("https://raw.githubusercontent.com/acquitelol/dislate/main/dist/Dislate.js"),y.open({content:"Copied to clipboard",source:l("pending-alert")})}}),n.createElement(i,{label:"Source",subLabel:`Open the Repo of ${r} Externally`,leading:n.createElement(i.Icon,{style:m.icon,source:l("ic_leave_stage")}),trailing:i.Arrow,onPress:()=>{R.openURL("https://github.com/acquitelol/dislate")}})),n.createElement(i,{label:`Plugin Version: ${b}
Release Channel: ${h}`})))};function B(o,t,m){return window.enmity.utilities.findInReactTree(o,t,m)}const[z,V,O]=p(s.byProps("setString"),s.byProps("openLazy","hideActionSheet"),s.byProps("getLastSelectedChannelId")),d=A("dislate"),M={...N,onStart(){d.before(V,"openLazy",(o,[t,m])=>{m==="MessageLongPressActionSheet"&&t.then(S=>{d.after(S,"default",($,F,a)=>{if(a.props.children().props.children.props.children[1][0].key=="696")return;const c=B(a,u=>{var w;return(w=u.find)==null?void 0:w.call(u,T=>Array.isArray(T))});if(!c||!c[1])return a;c[1].unshift(n.createElement(i,{key:"696",leading:n.createElement(i.Icon,{source:l("img_nitro_star")}),label:"Translate",onPress:()=>{console.log(`${F[0].message.content}`)}}))})})})},onStop(){d.unpatchAll()},getSettingsPanel({settings:o}){return n.createElement(_,{settings:o})}};L(M);
