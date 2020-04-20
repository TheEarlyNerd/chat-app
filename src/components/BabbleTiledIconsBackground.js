import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class BabbleTiledIconsBackground extends Component {
  state = {
    componentWidth: 0,
    componentHeight: 0,
  }

  _generateIcons() {
    const { iconComponents, iconSize, iconStyle, iconSpacing } = this.props;
    const { componentWidth, componentHeight } = this.state;
    const iconBoundingBoxSize = iconSize + iconSpacing;
    const totalIcons = Math.floor((componentWidth / iconBoundingBoxSize) * (componentHeight / iconBoundingBoxSize));
    const generatedIcons = [];

    for (let i = 0; i < totalIcons; i++) {
      const Icon = iconComponents[Math.floor(Math.random() * iconComponents.length)];

      generatedIcons.push((
        <View
          style={{
            position: 'relative',
            width: iconBoundingBoxSize,
            height: iconBoundingBoxSize,
          }}
          key={`icon_${i}`}
        >
          <Icon
            width={iconSize}
            height={iconSize}
            style={[
              iconStyle,
              {
                position: 'absolute',
                top: Math.floor(Math.random() * iconSpacing),
                left: Math.floor(Math.random() * iconSpacing),
              },
            ]}
          />
        </View>
      ));
    }

    return generatedIcons;
  }

  _updateStateDimensions = event => {
    if (this.state.componentWidth && this.state.componentHeight) {
      return; // setting state again resets icon positions because of random.
    }

    this.setState({
      componentWidth: event.nativeEvent.layout.width,
      componentHeight: event.nativeEvent.layout.height,
    });
  }

  render() {
    const { linearGradientProps, linearGradientRotationAngle, style } = this.props;

    return (
      <View onLayout={this._updateStateDimensions} style={[ styles.container, style ]}>
        <View style={styles.iconsContainer}>
          {this._generateIcons()}
        </View>

        {linearGradientProps && (
          <LinearGradient
            {...linearGradientProps}
            style={(linearGradientRotationAngle) ? [
              { transform: [ { rotate: `${linearGradientRotationAngle}deg` } ] },
              styles.linearGradient,
            ] : styles.linearGradient}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  linearGradient: {
    position: 'absolute',
    top: -100,
    right: -100,
    left: -100,
    bottom: 0,
    zIndex: -1,
  },
});
