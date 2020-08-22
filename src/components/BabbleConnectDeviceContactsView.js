import React, { Component } from 'react';
import { ScrollView, Text, Linking, StyleSheet } from 'react-native';
import { BabbleButton } from './';
import maestro from '../maestro';

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
    const { contentContainerStyle, style } = this.props;

    return (
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={[ styles.contentContainer, contentContainerStyle ]}
        style={[ styles.container, style ]}
      >
        <Text style={styles.titleText}>Babble Is Better With Friends!</Text>
        <Text style={styles.subtext}>Chat with your contacts, or invite them to conversations.</Text>
        <BabbleButton onPress={this._enableDeviceContacts} style={styles.button}>Connect My Contacts</BabbleButton>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    maxWidth: 250,
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
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  titleText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Black',
    fontSize: 20,
    marginBottom: 10,
  },
});
