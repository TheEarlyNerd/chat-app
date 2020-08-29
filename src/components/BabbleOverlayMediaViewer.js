import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, PanResponder, Animated, Dimensions, StyleSheet, Alert } from 'react-native';
import { BabbleAutoscaleImage, BabbleAutoscaleVideo } from './';
import { DownloadIcon, ShareIcon, XIcon } from './icons';
import maestro from '../maestro';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class BabbleOverlayMediaViewer extends Component {
  state ={
    currentIndex: 0,
    pagingEnabled: true,
    zoomScale: 1,
    opacityAnimated: new Animated.Value(0),
    overlayTranslateYAnimated: new Animated.Value(0),
    panResponder: PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => {
        return Math.abs(gestureState.dy) > 20 && this.state.zoomScale === 1;
      },
      onPanResponderMove: (event, gestureState) => {
        this.state.overlayTranslateYAnimated.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (Math.abs(gestureState.dy) > 50) {
          this._animateTranslateY((gestureState.dy < 0) ? -windowHeight : windowHeight);
          this._hide();
        } else {
          this._animateTranslateY(0);
        }
      },
    }),
  }

  componentDidMount() {
    this._show();

    this.setState({ currentIndex: this.props.data.selectedIndex });
  }

  _show = () => {
    this._toggle(true);
  }

  _hide = () => {
    this._toggle(false).then(() => {
      maestro.dispatchEvent('OVERLAYS:HIDE', { name: 'MediaViewer' });
    });
  }

  _toggle = show => {
    return new Promise(resolve => {
      Animated.timing(this.state.opacityAnimated, {
        toValue: (show) ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  _animateTranslateY = toValue => {
    return new Promise(resolve => {
      Animated.timing(this.state.overlayTranslateYAnimated, {
        toValue,
        duration: 150,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  _download = () => {
    Alert.alert('TO DO!', 'This feature is not finished!');
  }

  _share = () => {
    Alert.alert('TO DO!', 'This feature is not finished!');
  }

  _onScroll = ({ nativeEvent: { contentOffset, zoomScale } }) => {
    this.setState({
      pagingEnabled: zoomScale === 1,
      zoomScale,
    });
  }

  _onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (!viewableItems.length || !changed.length) {
      return;
    }

    const viewableItemsIndex = (changed[0].index > viewableItems[0].index)
      ? viewableItems.length - 1
      : 0;

    this.setState({ currentIndex: viewableItems[viewableItemsIndex].index });
  }

  _renderItem = ({ item, index }) => {
    const { currentIndex } = this.state;

    if (item.mimetype.includes('image/')) {
      return (
        <BabbleAutoscaleImage
          sourceWidth={item.width}
          sourceHeight={item.height}
          maxWidth={windowWidth}
          loadingColor={'#FFFFFF'}
          imageProps={{
            source: { uri: item.url },
            resizeMode: 'contain',
          }}
          containerStyle={[
            styles.image,
            { width: windowWidth },
          ]}
        />
      );
    }

    if (item.mimetype.includes('video/')) {
      return (
        <BabbleAutoscaleVideo
          sourceWidth={item.width}
          sourceHeight={item.height}
          maxWidth={windowWidth}
          loadingColor={'#FFFFFF'}
          videoProps={{
            paused: currentIndex !== index,
            source: { uri: item.url },
            controls: true,
          }}
          containerStyle={[
            styles.video,
            { width: windowWidth },
          ]}
        />
      );
    }
  }

  render() {
    const { media, selectedIndex, uploadPreview } = this.props.data;
    const { currentIndex, pagingEnabled, overlayTranslateYAnimated, panResponder } = this.state;

    return (
      <Animated.View style={[ styles.container, { opacity: this.state.opacityAnimated } ]}>
        <TouchableOpacity onPress={this._hide} style={styles.closeButton}>
          <XIcon
            width={33}
            height={33}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.flatlistContainer,
            { transform: [ { translateY: overlayTranslateYAnimated } ] },
          ]}
        >
          <FlatList
            data={media}
            contentContainerStyle={styles.contentContainer}
            renderItem={this._renderItem}
            getItemLayout={(data, index) => ({
              length: windowWidth,
              offset: windowWidth * index,
              index,
            })}
            keyExtractor={(item, index) => `${item.id}.${index}`}
            onScroll={this._onScroll}
            onViewableItemsChanged={this._onViewableItemsChanged}
            scrollEventThrottle={32}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            initialScrollIndex={selectedIndex}
            maximumZoomScale={3}
            minimumZoomScale={1}
            bouncesZoom={false}
            horizontal
            pagingEnabled={pagingEnabled}
          />
        </Animated.View>

        {media.length > 1 && (
          <View style={styles.paginationContainer}>
            {media.map((mediaItem, index) => (
              <View
                style={[
                  styles.paginationDot,
                  (index === currentIndex) ? styles.paginationDotActive : null,
                ]}
                key={`pagination-${index}`}
              />
            ))}
          </View>
        )}

        {!uploadPreview && (
          <>
            <TouchableOpacity onPress={this._download} style={styles.downloadButton}>
              <DownloadIcon
                width={33}
                height={33}
                style={styles.buttonIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={this._share} style={styles.shareButton}>
              <ShareIcon
                width={33}
                height={33}
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  buttonIcon: {
    color: '#FFFFFF',
  },
  closeButton: {
    left: 15,
    position: 'absolute',
    top: 57,
    zIndex: 101,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    zIndex: 99,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    bottom: 30,
    left: 15,
    position: 'absolute',
    zIndex: 102,
  },
  flatlistContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  image: {
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  paginationContainer: {
    alignItems: 'center',
    bottom: 40,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 100,
  },
  paginationDot: {
    backgroundColor: '#777777',
    borderRadius: 5,
    height: 8,
    marginHorizontal: 5,
    width: 8,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    height: 10,
    width: 10,
  },
  shareButton: {
    bottom: 30,
    position: 'absolute',
    right: 15,
    zIndex: 102,
  },
  video: {
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
});
