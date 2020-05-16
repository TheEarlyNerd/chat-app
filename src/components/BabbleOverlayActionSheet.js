import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, Animated, Keyboard, StyleSheet } from 'react-native';
import { ArrowDownIcon } from './icons';
import maestro from '../maestro';

export default class BabbleOverlayActionSheet extends Component {
  state = {
    opacityAnimated: new Animated.Value(0),
    actionSheetTranslateYAnimated: new Animated.Value(500),
    scrollEnabled: true,
  }

  componentDidMount() {
    this._show();
  }

  _show = () => {
    Keyboard.dismiss();

    this._toggle(true);
  }

  _hide = async () => {
    await this._toggle(false);

    maestro.dispatchEvent('OVERLAYS:HIDE', { name: 'ActionSheet' });
  }

  _toggle = show => {
    const opacityAnimation = Animated.timing(this.state.opacityAnimated, {
      toValue: (show) ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    });

    const translateYAnimation = Animated.timing(this.state.actionSheetTranslateYAnimated, {
      toValue: (show) ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    });

    return new Promise(resolve => {
      if (show) {
        Animated.parallel([ opacityAnimation, translateYAnimation ]).start(resolve);
      } else {
        Animated.parallel([ translateYAnimation, opacityAnimation ]).start(resolve);
      }
    });
  }

  _onScroll = ({ nativeEvent }) => {
    const { y } = nativeEvent.contentOffset;

    if (y < -30) {
      this.setState({ scrollEnabled: false }, this._hide);
    }
  }

  _actionPressed = onPress => {
    onPress();
    this._hide();
  }

  render() {
    const { actions } = this.props.data;
    const { opacityAnimated, actionSheetTranslateYAnimated, scrollEnabled } = this.state;

    return (
      <Animated.ScrollView
        onScroll={this._onScroll}
        scrollToOverflowEnabled
        scrollEnabled={scrollEnabled}
        scrollEventThrottle={128}
        contentContainerStyle={styles.scrollViewContainer}
        style={[ styles.container, { opacity: opacityAnimated } ]}
      >
        <TouchableOpacity style={styles.dismissOverlay} onPress={this._hide} />

        <Animated.View style={{ transform: [ { translateY: actionSheetTranslateYAnimated } ] }}>
          <View style={styles.dragIndicator} />

          <SafeAreaView style={styles.actionSheet}>
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
          </SafeAreaView>
        </Animated.View>
      </Animated.ScrollView>
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
  actionSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
  },
  actionSubText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
  },
  actionText: {
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 18,
  },
  actionTextCancel: {
    color: '#F54444',
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  dismissOverlay: {
    flex: 1,
  },
  dragIndicator: {
    alignSelf: 'center',
    backgroundColor: '#D8D8D8',
    borderRadius: 5,
    height: 5,
    marginBottom: 8,
    width: 50,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
