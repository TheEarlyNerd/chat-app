import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { BabbleAutoscaleImage } from './';
import { DownloadIcon, ShareIcon, XIcon } from './icons';
import maestro from '../maestro';

const windowWidth = Dimensions.get('window').width;

export default class BabbleOverlayMediaViewer extends Component {
  state ={
    currentIndex: 0,
    pagingEnabled: true,
    opacityAnimated: new Animated.Value(0),
  }

  slideDismissing = false;

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

  _download = () => {

  }

  _share = () => {

  }

  _onScroll = ({ nativeEvent: { contentOffset, zoomScale } }) => {
    if (!this.slideDismissing && zoomScale === 1 && Math.abs(contentOffset.y) > 80) {
      this.slideDismissing = true;
      this._hide();
    }

    this.setState({ pagingEnabled: zoomScale === 1 });
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
    const { selectedIndex } = this.props.data;

    return (
      <BabbleAutoscaleImage
        source={{ uri: item.url }}
        maxWidth={windowWidth}
        resizeMode={'contain'}
        loadingColor={'#FFFFFF'}
        highPriority={selectedIndex === index}
        containerStyle={styles.image}
      />
    );
  }

  render() {
    const { attachments, selectedIndex } = this.props.data;
    const { currentIndex, pagingEnabled } = this.state;

    return (
      <Animated.View style={[ styles.container, { opacity: this.state.opacityAnimated } ]}>
        <TouchableOpacity onPress={this._hide} style={styles.closeButton}>
          <XIcon
            width={33}
            height={33}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        <FlatList
          data={attachments}
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
          initialScrollIndex={selectedIndex}
          maximumZoomScale={3}
          minimumZoomScale={1}
          horizontal
          pagingEnabled={pagingEnabled}
          style={styles.scrollView}
        />

        {attachments.length > 1 && (
          <View style={styles.paginationContainer}>
            {attachments.map((attachment, index) => (
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
  image: {
    width: windowWidth,
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
  scrollView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  shareButton: {
    bottom: 30,
    position: 'absolute',
    right: 15,
    zIndex: 102,
  },
});
