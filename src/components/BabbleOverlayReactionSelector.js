import React, { Component } from 'react';
import { BabbleOverlayDismissibleView, BabbleEmojiSelector } from './';
import maestro from '../maestro';

const { roomsManager } = maestro.managers;

export default class BabbleOverlayReactionSelector extends Component {
  dismissibleView = null;

  componentDidMount() {
    this._show();
  }

  _show = () => {
    this.dismissibleView.show();
  }

  _hide = async () => {
    await this.dismissibleView.hide();

    maestro.dispatchEvent('OVERLAYS:HIDE', { name: 'ReactionSelector' });
  }

  _emojiPress = emoji => {
    const { roomId, roomMessageId, onEmojiPress } = this.props.data;

    roomsManager.createRoomMessageReaction({
      roomId,
      roomMessageId,
      emoji: emoji.emoji,
    });

    if (onEmojiPress) {
      onEmojiPress(emoji);
    }

    this._hide();
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
