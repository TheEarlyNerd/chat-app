import React, { PureComponent } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleBackground, BabbleConnectionStatusBar } from './';
import { ArrowLeftIcon, XIcon } from './icons';
import NavigationTypeContext from '../navigators/contexts/NavigationTypeContext';
import maestro from '../maestro';

const { navigationHelper, interfaceHelper } = maestro.helpers;

export default class BabbleHeader extends PureComponent {
  static contextType = NavigationTypeContext;

  render() {
    const { scene } = this.props;
    const { descriptor } = scene;
    const { options } = descriptor;
    const params = scene.route.params || {};
    const title = options.title || params.title;
    const { rightButtonTitle, rightButtonComponent, showRightLoading, onRightButtonPress, backEnabled, closeEnabled } = Object.assign({}, options, params);

    return (
      <SafeAreaView>
        <View style={styles.container}>
          {(backEnabled || closeEnabled) && (
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigationHelper.pop(1, this.context)} style={styles.backButton}>
                {closeEnabled && (
                  <XIcon
                    width={33}
                    height={33}
                    style={styles.backIcon}
                  />
                )}

                {!closeEnabled && (
                  <ArrowLeftIcon
                    width={33}
                    height={33}
                    style={styles.backIcon}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.headerCenter}>
            {!!title && typeof title === 'string' && (
              <Text numberOfLines={1} style={[ styles.text, styles.titleText ]}>{title}</Text>
            )}

            {React.isValidElement(title) && title}
          </View>

          <View style={styles.headerRight}>
            {(!!rightButtonTitle || !!rightButtonComponent) && (
              <TouchableOpacity disabled={showRightLoading} onPress={onRightButtonPress}>
                {!showRightLoading && !rightButtonComponent && (
                  <Text style={styles.rightButtonText}>{rightButtonTitle}</Text>
                )}

                {!showRightLoading && !!rightButtonComponent && (
                  rightButtonComponent
                )}

                {showRightLoading && (
                  <ActivityIndicator color={'#FFFFFF'} />
                )}
              </TouchableOpacity>
            )}
          </View>

          <BabbleBackground
            linearGradientProps={{
              colors: [ '#299BCB', '#1ACCB4' ],
              locations: [ 0, 0.7 ],
              useAngle: true,
              angle: 36,
            }}
            style={styles.backgroundGradient}
          />
        </View>

        <BabbleConnectionStatusBar />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: -1,
  },
  backIcon: {
    color: '#FFFFFF',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: interfaceHelper.deviceValue({ default: 50, lg: 60 }),
    paddingVertical: 10,
  },
  headerLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: 40,
    paddingLeft: 15,
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 40,
    paddingRight: 15,
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-ExtraBold',
    fontSize: 20,
  },
  text: {
    color: '#FFFFFF',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  titleText: {
    fontFamily: 'NunitoSans-Black',
    fontSize: interfaceHelper.deviceValue({ default: 22, lg: 24 }),
    paddingHorizontal: 15,
  },
});
