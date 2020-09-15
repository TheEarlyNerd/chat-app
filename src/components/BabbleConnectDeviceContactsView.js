import React, { Component } from 'react';
import { ScrollView, Text, Linking, StyleSheet } from 'react-native';
import { BabbleButton } from './';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;
const { deviceContactsManager } = maestro.managers;

export default class BabbleConnectDeviceContactsView extends Component {
  _enableDeviceContacts = () => {
    if (!deviceContactsManager.requestedPermission()) {
      deviceContactsManager.loadContacts();
    } else {
      Linking.openURL('app-settings:');
    }
  }

  render() {
    const { promptText, contentContainerStyle, style } = this.props;

    return (
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={[ styles.contentContainer, contentContainerStyle ]}
        style={[ styles.container, style ]}
      >
        <Text style={styles.titleText}>Invite Friends</Text>
        <Text style={styles.subtext}>{promptText}</Text>
        <BabbleButton onPress={this._enableDeviceContacts} style={styles.button}>Allow Access To Contacts</BabbleButton>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    maxWidth: interfaceHelper.deviceValue({ default: 250, lg: 300 }),
    width: '80%',
  },
  container: {
    paddingHorizontal: 15,
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtext: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 15,
    marginBottom: 15,
    textAlign: 'center',
  },
  titleText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Black',
    fontSize: 24,
    marginBottom: 10,
  },
});
