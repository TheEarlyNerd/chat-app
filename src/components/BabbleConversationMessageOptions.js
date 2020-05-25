import React, { Component } from 'react';
import { Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { BabbleTiledIconsBackground } from './';
import { Trash2Icon, SmileIcon, MoreHorizontalIcon, MessageSquareIcon } from './icons';

export default class BabbleConversationMessageOptions extends Component {
  render() {
    const { style } = this.props;

    return (
      <Animated.View style={[ styles.container, style ]}>
        <TouchableOpacity style={styles.option}>
          <SmileIcon width={22} height={22} style={styles.optionIcon} />
          <Text style={styles.reactionPlusText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Trash2Icon width={22} height={22} style={styles.optionIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MoreHorizontalIcon width={22} height={22} style={styles.optionIcon} />
        </TouchableOpacity>

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
    justifyContent: 'flex-end',
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
});
