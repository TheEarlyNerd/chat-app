import React, { Component } from 'react';
import { ScrollView, View, Image, TouchableOpacity, Keyboard, StyleSheet } from 'react-native';
import { BabbleOverlayDismissibleView, BabbleSearchField } from './';
import maestro from '../maestro';

const GIPHY_API_KEY = 'wElHxeUBoOebuLXNKSaz4XVUoUMrwpyU';

export default class BabbleOverlayGifSelector extends Component {
  dismissibleView = null;
  searchTimeout = null;

  state = {
    gifs: [],
    search: '',
  }

  componentDidMount() {
    this._loadGifs();
    this._show();
  }

  componentWillUnmount() {
    clearTimeout(this.searchTimeout);
  }

  _show = () => {
    Keyboard.dismiss();

    this.dismissibleView.show();
  }

  _hide = async () => {
    await this.dismissibleView.hide();

    maestro.dispatchEvent('OVERLAYS:HIDE', { name: 'GifSelector' });
  }

  _gifPressed = gif => {
    this.props.data.onGifPress(gif);
    this._hide();
  }

  _loadGifs = async () => {
    const { search } = this.state;
    const response = (search)
      ? await fetch(`https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${GIPHY_API_KEY}`)
      : await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}`);
    const responseBody = await response.json();

    this.setState({ gifs: responseBody.data });
  }

  _renderGif = gif => {
    return (
      <TouchableOpacity onPress={() => this._gifPressed(gif)} key={gif.id}>
        <Image
          source={{ uri: gif.images.fixed_width.url }}
          style={[
            { width: '100%', aspectRatio: gif.images.fixed_width.width / gif.images.fixed_width.height },
            styles.gif,
          ]}
        />
      </TouchableOpacity>
    );
  }

  _onChangeText = text => {
    this.setState({ search: text });

    this.searchTimeout = setTimeout(this._loadGifs, 500);
  }

  render() {
    const { gifs, search } = this.state;

    return (
      <BabbleOverlayDismissibleView
        onTapDismiss={this._hide}
        onDragDismiss={this._hide}
        ref={component => this.dismissibleView = component}
      >
        <View style={styles.container}>
          <BabbleSearchField
            onChangeText={this._onChangeText}
            placeholder={'Search GIFs...'}
            returnKeyType={'done'}
            value={search}
            containerStyle={styles.searchFieldContainer}
            style={styles.searchField}
          />

          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={styles.gifsScrollViewContainer}
            style={styles.gifsScrollView}
          >
            <View style={styles.gifsColumn}>
              {gifs.filter((gif, index) => !(index % 2)).map(this._renderGif)}
            </View>

            <View style={styles.gifsColumn}>
              {gifs.filter((gif, index) => index % 2).map(this._renderGif)}
            </View>
          </ScrollView>
        </View>
      </BabbleOverlayDismissibleView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 550,
    padding: 15,
  },
  gif: {
    borderRadius: 4,
    marginBottom: 15,
  },
  gifsColumn: {
    width: '48%',
  },
  gifsScrollView: {
    flex: 1,
  },
  gifsScrollViewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  searchFieldContainer: {
    marginBottom: 25,
  },
});
