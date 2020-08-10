import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { ChevronLeftIcon, ChevronRightIcon, RefreshCwIcon, ShareIcon, MessageCircleIcon, LinkIcon, GridIcon } from '../components/icons';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

export default class WebBrowserScreen extends Component {
  webView = null;

  state = {
    url: this.props.route.params.url,
    canGoBack: false,
    canGoForward: false,
    loadingProgress: 0,
  }

  _loadProgress = ({ nativeEvent }) => {
    const progress = Math.floor(nativeEvent.progress * 100);

    this.props.navigation.setOptions({ title: nativeEvent.title });

    this.setState({
      canGoBack: nativeEvent.canGoBack,
      canGoForward: nativeEvent.canGoForward,
      loadingProgress: (progress !== 100) ? progress : 0,
    });
  }

  _loadEnd = ({ nativeEvent }) => {
    this.setState({ loadingProgress: 0 });
  }

  _onNavigationStateChange = navigationState => {
    this.setState({ loadingProgress: 0 });
  }

  _back = () => {
    this.webView.goBack();
  }

  _forward = () => {
    this.webView.goForward();
  }

  _refresh = () => {
    this.webView.reload();
  }

  _share = () => {
    interfaceHelper.showOverlay({
      name: 'ActionSheet',
      data: {
        actions: [
          {
            iconComponent: MessageCircleIcon,
            text: 'Share To Conversation',
            subtext: 'Select any of your conversations to share this page with.',
          },
          {
            iconComponent: LinkIcon,
            text: 'Copy Link',
            subtext: 'The URL of this page will be copied. You can paste it anywhere to share.',
          },
        ],
      },
    });
  }

  render() {
    const { url, canGoBack, canGoForward, loadingProgress } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {loadingProgress > 0 && (
          <View style={styles.loadingBarContainer}>
            <View style={[ styles.loadingBar, { width: `${loadingProgress}%` } ]} />
          </View>
        )}

        <WebView
          source={{ uri: (!url.includes('http')) ? `http://${url}` : url }}
          onLoadProgress={this._loadProgress}
          onLoadEnd={this._loadEnd}
          onNavigationStateChange={this._onNavigationStateChange}
          sharedCookiesEnabled
          allowsInlineMediaPlayback
          allowsFullscreenVideo
          style={styles.webView}
          ref={component => this.webView = component}
        />

        <View style={styles.navigationToolbar}>
          <TouchableOpacity
            disabled={!canGoBack}
            onPress={this._back}
            style={(!canGoBack) ? styles.disabledButton : null}
          >
            <ChevronLeftIcon
              width={28}
              height={28}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!canGoForward}
            onPress={this._forward}
            style={(!canGoForward) ? styles.disabledButton : null}
          >
            <ChevronRightIcon
              width={28}
              height={28}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this._refresh}>
            <RefreshCwIcon
              width={22}
              height={22}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this._share}>
            <ShareIcon
              width={22}
              height={22}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonIcon: {
    color: '#2A99CC',
  },
  container: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingBar: {
    backgroundColor: '#299BCB',
    height: 5,
  },
  loadingBarContainer: {
    height: 5,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  navigationToolbar: {
    alignItems: 'center',
    borderTopColor: '#D8D8D8',
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
  },
  webView: {
    flex: 1,
  },
});
