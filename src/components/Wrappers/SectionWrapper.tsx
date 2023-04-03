import { View, Text } from "enmity/components"
import { React } from "enmity/metro/common"
import { SectionWrapperProps } from "../../def"
import { styles } from "./SectionWrapper.styles"

export default ({ label, children }: SectionWrapperProps) => {
    return <View style={{ marginTop: 10 }}>
        <Text style={[styles.text, styles.optionText]}>{label.toUpperCase()}</Text>
        {children}
    </View>
}