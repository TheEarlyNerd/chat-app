import { Animated } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import maestro from '../../maestro';

const { interfaceHelper } = maestro.helpers;

export default interfaceHelper.deviceValue({
  default: CardStyleInterpolators.forHorizontalIOS,
  lg: ({ current, next, inverted, layouts: { screen } }) => {
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

    return {
      cardStyle: {
        opacity: Animated.multiply(
          progress.interpolate({
            inputRange: [ 0, 1, 2 ],
            outputRange: [ 0, 1, 0 ],
          }),
          inverted,
        ),
        transform: [
          {
            translateX: Animated.multiply(
              progress.interpolate({
                inputRange: [ 0, 1, 2 ],
                outputRange: [ screen.width, 0, screen.width * -0.6 ],
                extrapolate: 'clamp',
              }),
              inverted,
            ),
          },
        ],
      },
    };
  },
});
