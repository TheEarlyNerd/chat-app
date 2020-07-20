import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated, LayoutAnimation, StyleSheet, Alert } from 'react-native';
import { BabbleTiledIconsBackground } from './';
import { CornerUpLeftIcon, EditIcon, Trash2Icon, ShareIcon, SmileIcon, MoreHorizontalIcon, MessageSquareIcon, AlertTriangleIcon } from './icons';
import maestro from '../maestro';

const { conversationsManager, userManager } = maestro.managers;
const { interfaceHelper } = maestro.helpers;

export default class BabbleConversationMessageOptions extends Component {
  _deletePress = () => {
    const { id, conversationId } = this.props;

    Alert.alert('Delete this message?', 'Are you sure you want to permanently delete this message? This cannot be undone.', [
      {
        text: 'Delete',
        onPress: async () => {
          await this.props.onCloseRow();

          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

          conversationsManager.deleteConversationMessage({
            conversationId,
            conversationMessageId: id,
          });
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  }

  _editPress = () => {

  }

  _reactPress = () => {
    interfaceHelper.showOverlay({
      name: 'ReactionInput',
      data: {
        conversationId: this.props.conversationId,
        conversationMessageId: this.props.id, // maybe change it to props.conversationMessage.id?
        onEmojiPress: this.props.onCloseRow,
      },
    });
  }

  _reportPress = () => {
    const { user } = this.props;

    Alert.alert('Report User', `Are you sure you want to report ${user.name} for sending inappropriate, violent or concerning content?`, [
      {
        text: 'Report',
        onPress: () => {},
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  }

  _morePress = () => {
    const { user } = this.props;
    const actions = [];

    actions.push({
      iconComponent: SmileIcon,
      text: 'Add Reaction',
      onPress: this._reactPress,
    });

    if (userManager.store.user.id === user.id) {
      actions.push({
        iconComponent: EditIcon,
        text: 'Edit',
        onPress: this._editPress,
      });

      actions.push({
        iconComponent: Trash2Icon,
        text: 'Delete',
        onPress: this._deletePress,
      });
    } else {
      actions.push({
        iconComponent: AlertTriangleIcon,
        text: 'Report User',
        onPress: this._reportPress,
      });
    }

    interfaceHelper.showOverlay({
      name: 'ActionSheet',
      data: { actions },
    });
  }

  render() {
    const { user, style } = this.props;

    return (
      <Animated.View style={[ styles.container, style ]}>
        <View style={styles.leftOptions}>
          <CornerUpLeftIcon width={22} height={22} style={styles.optionIcon} />
        </View>

        <View style={styles.rightOptions}>
          <TouchableOpacity onPress={this._reactPress} style={styles.option}>
            <SmileIcon width={22} height={22} style={styles.optionIcon} />
            <Text style={styles.reactionPlusText}>+</Text>
          </TouchableOpacity>

          {(userManager.store.user.id === user.id) && (
            <TouchableOpacity onPress={this._editPress} style={styles.option}>
              <EditIcon width={22} height={22} style={styles.optionIcon} />
            </TouchableOpacity>
          )}

          {(userManager.store.user.id !== user.id) && (
            <TouchableOpacity onPress={this._sharePress} style={styles.option}>
              <ShareIcon width={22} height={22} style={styles.optionIcon} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={this._morePress} style={styles.option}>
            <MoreHorizontalIcon width={22} height={22} style={styles.optionIcon} />
          </TouchableOpacity>
        </View>

        <BabbleTiledIconsBackground
          iconComponents={[ MessageSquareIcon ]}
          iconSize={20}
          iconStyle={{ color: '#FFFFFF', opacity: 0.25 }}
          iconSpacing={37}
          linearGradientProps={{
            colors: [ '#299BCB', '#1ACCB4' ],
            locations: [ 0, 1 ],
            useAngle: true,
            angle: 36,
          }}
          style={styles.backgroundGradient}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#2A99CC',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftOptions: {
    marginLeft: 15,
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    width: 45,
  },
  optionIcon: {
    color: '#FFF',
  },
  reactionPlusText: {
    color: '#FFF',
    fontFamily: 'NunitoSans-Black',
    fontSize: 13,
    position: 'absolute',
    right: 6,
    top: -8,
  },
  rightOptions: {
    flexDirection: 'row',
    marginRight: 5,
  },
});
