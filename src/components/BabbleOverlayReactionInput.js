import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { BabbleOverlayDismissibleView, BabbleEmojiSelector } from './';
import maestro from '../maestro';

export default class BabbleOverlayReactionInput extends Component {
  dismissibleView = null;

  componentDidMount() {
    this._show();
  }

  _show = () => {
    this.dismissibleView.show();
  }

  _hide = async () => {
    await this.dismissibleView.hide();

    maestro.dispatchEvent('OVERLAYS:HIDE', { name: 'ReactionInput' });
  }

  _emojiPress = emoji => {
    console.log(emoji);
  }

  render() {
    return (
      <BabbleOverlayDismissibleView
        onTapDismiss={this._hide}
        onDragDismiss={this._hide}
        ref={component => this.dismissibleView = component}
      >
        <BabbleEmojiSelector
          onEmojiPress={this._emojiPress}
        />
      </BabbleOverlayDismissibleView>
    );
  }
}

const styles = StyleSheet.create({

});
