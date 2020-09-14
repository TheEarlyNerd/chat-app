import React, { Component } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { BabbleButton } from './';
import { UsersIcon } from './icons';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;
const { roomsManager } = maestro.managers;

export default class BabbleRoomViewerToolbar extends Component {
  state = {
    loading: false,
  }

  _buttonPress = async () => {
    const { room } = this.props;

    this.setState({ loading: true });

    try {
      if (!room.authRoomUser) {
        await roomsManager.joinRoom(room.id);
      } else {
        await roomsManager.leaveRoom(room.id);
      }
    } catch (error) {
      interfaceHelper.showError({ message: error.message });
    }

    this.setState({ loading: false });
  }

  render() {
    const { room } = this.props;
    const { loading } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionHeader}>
          <UsersIcon width={18} height={18} style={styles.permissionIcon} />
          <Text style={styles.headingText}>Audience Room</Text>
        </View>

        <Text style={styles.detailsText}>Only people invited by the owner of this room can send messages. Anyone can read and react to messages.</Text>

        <BabbleButton
          onPress={this._buttonPress}
          loading={loading}
          textStyle={styles.buttonText} style={styles.button}
        >
          {(!room.authRoomUser) ? 'Follow Room' : 'Unfollow Room'}
        </BabbleButton>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    paddingHorizontal: 10,
    width: 200,
  },
  buttonText: {
    fontSize: 16,
  },
  container: {
    alignItems: 'center',
    borderTopColor: '#D8D8D8',
    borderTopWidth: 0.5,
    marginBottom: interfaceHelper.deviceValue({ default: 15, notchAdjustment: -15 }),
    paddingHorizontal: 15,
  },
  detailsText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 15,
    marginBottom: 15,
    textAlign: 'center',
  },
  headingText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 16,
  },
  permissionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 15,
  },
  permissionIcon: {
    color: '#2A99CC',
    marginRight: 5,
  },
});
