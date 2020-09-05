import { Animated } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';
import maestro from '../../maestro';

const { interfaceHelper } = maestro.helpers;

export default {
  ...TransitionPresets.ModalPresentationIOS,
  ...(interfaceHelper.deviceValue({
    default: {},
    lg: {
      cardStyleInterpolator: ({ index, current, next, inverted, layouts: { screen }, insets }) => {
        const isLandscape = screen.width > screen.height;
        const topOffset = isLandscape ? 0 : 10;
        const scaleOffset = isLandscape ? 30 : 35;
        const statusBarHeight = insets.top;
        const aspectRatio = screen.height / screen.width;

        const progress = Animated.add(
          current.progress.interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ 0, 1 ],
            extrapolate: 'clamp',
          }),
          next ? next.progress.interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ 0, 1 ],
            extrapolate: 'clamp',
          }) : 0,
        );

        const translateY = Animated.multiply(
          progress.interpolate({
            inputRange: [ 0, 1, 2 ],
            outputRange: [
              screen.height,
              index === 0 ? 0 : topOffset,
              (index === 0 ? statusBarHeight : 0) - topOffset * aspectRatio,
            ],
          }),
          inverted,
        );

        const overlayOpacity = progress.interpolate({
          inputRange: [ 0, 1, 1.0001, 2 ],
          outputRange: [ 0, 0.3, 1, 1 ],
        });

        const scale = progress.interpolate({
          inputRange: [ 0, 1, 2 ],
          outputRange: [ 1, 1, screen.width ? 1 - (scaleOffset * 2) / screen.width : 1 ],
        });

        const borderRadius = (index === 0 ? progress.interpolate({
          inputRange: [ 0, 1, 1.0001, 2 ],
          outputRange: [ 0, 0, 0, 15 ],
        }) : 10);

        return {
          cardStyle: {
            overflow: 'hidden',
            borderRadius,
            marginTop: index === 0 ? 0 : statusBarHeight,
            marginBottom: index === 0 ? 0 : topOffset,
            transform: [ { translateY }, { scale } ],
          },
          overlayStyle: { opacity: overlayOpacity },
        };
      },
    },
  })),
};
