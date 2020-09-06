import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Keyboard, StyleSheet } from 'react-native';
import { BabbleOverlayDismissibleView } from './';
import { ArrowDownIcon } from './icons';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

export default class BabbleOverlayActionSheet extends Component {
  dismissibleView = null;

  componentDidMount() {
    this._show();
  }

  _show = () => {
    Keyboard.dismiss();

    this.dismissibleView.show();
  }

  _hide = async () => {
    await this.dismissibleView.hide();

    maestro.dispatchEvent('OVERLAYS:HIDE', { name: 'ActionSheet' });
  }

  _actionPressed = onPress => {
    onPress();
    this._hide();
  }

  render() {
    const { actions } = this.props.data;

    return (
      <BabbleOverlayDismissibleView
        onTapDismiss={this._hide}
        onDragDismiss={this._hide}
        ref={component => this.dismissibleView = component}
      >
        {actions.map((action, index) => (
          <TouchableOpacity onPress={() => this._actionPressed(action.onPress)} style={styles.action} key={index}>
            <action.iconComponent style={styles.actionIcon} />

            <View style={styles.actionTextContainer}>
              <Text style={styles.actionText}>{action.text}</Text>

              {!!action.subtext && (
                <Text style={styles.actionSubText}>{action.subtext}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={this._hide} style={styles.action}>
          <ArrowDownIcon style={[ styles.actionIcon, styles.actionIconCancel ]} />
          <View style={styles.actionTextContainer}>
            <Text style={[ styles.actionText, styles.actionTextCancel ]}>Cancel</Text>
          </View>
        </TouchableOpacity>
      </BabbleOverlayDismissibleView>
    );
  }
}

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    padding: 15,
  },
  actionIcon: {
    color: '#323643',
  },
  actionIconCancel: {
    color: '#F54444',
  },
  actionSubText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 14, lg: 16 }),
  },
  actionText: {
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 18, lg: 20 }),
  },
  actionTextCancel: {
    color: '#F54444',
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
});
