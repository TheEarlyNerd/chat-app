import React, { Component } from 'react';
import { SafeAreaView, KeyboardAvoidingView, View, TouchableOpacity, PanResponder, Animated, StyleSheet } from 'react-native';

export default class BabbleOverlayDismissibleView extends Component {
  state = {
    opacityAnimated: new Animated.Value(0),
    overlayTranslateYAnimated: new Animated.Value(500),
    panResponder: PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (event, gestureState) => {
        this.state.overlayTranslateYAnimated.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        const { onDragDismiss } = this.props;

        if (gestureState.dy > 30) {
          onDragDismiss();
        } else {
          Animated.timing(this.state.overlayTranslateYAnimated, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  }

  show = () => {
    this._toggle(true);
  }

  hide = async () => {
    await this._toggle(false);
  }

  _toggle = show => {
    const opacityAnimation = Animated.timing(this.state.opacityAnimated, {
      toValue: (show) ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    });

    const translateYAnimation = Animated.timing(this.state.overlayTranslateYAnimated, {
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
    const { onDragDismiss } = this.props;
    const { y } = nativeEvent.contentOffset;

    if (y < -30) {
      this.setState({ scrollEnabled: false }, onDragDismiss);
    }
  }

  render() {
    const { onTapDismiss, style } = this.props;
    const { opacityAnimated, overlayTranslateYAnimated, panResponder } = this.state;

    return (
      <Animated.View style={[ styles.container, { opacity: opacityAnimated } ]}>
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
          <View {...panResponder.panHandlers} style={styles.dismissOverlay}>
            <TouchableOpacity onPress={onTapDismiss} style={styles.dismissOverlay} />
          </View>

          <Animated.View style={{ transform: [ { translateY: overlayTranslateYAnimated } ] }}>
            <View style={styles.dragIndicator} />

            <SafeAreaView style={[ styles.overlay, style ]}>
              {this.props.children}
            </SafeAreaView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
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
  overlay: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
  },
});
