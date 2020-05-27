import React, { Component } from 'react';
import { BabbleOverlayDismissibleView, BabbleEmojiSelector } from './';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;

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
    const { conversationId, conversationMessageId } = this.props.data;

    conversationsManager.createConversationMessageReaction({
      conversationId,
      conversationMessageId,
      reaction: emoji.emoji,
    });
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
