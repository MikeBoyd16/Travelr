import React from 'react';
import {
    StyleSheet,
    View,
    Button,
    Text,
    TouchableOpacity,
    Platform,
    PermissionsAndroid
} from "react-native";

class Navigation extends React.Component {
    styles = StyleSheet.create({
        navigation: { 
            flex: 1,
            flexDirection: 'row'
        },
        button: {
            width: '100%',
            height: 30
        }
    })

    render() {
        return (
            <View style={ this.styles.navigation }>
                <Button title="Profile" style={ this.styles.button } />
                <Button title="Map" style={ this.styles.button } />
                <Button title="Settings" style={ this.styles.button } />
            </View>
        );
    }
}

export default Navigation;