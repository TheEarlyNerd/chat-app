import React, { Component } from 'react';
import { BabbleOverlayDismissibleView, BabbleInviteSelector } from './';
import maestro from '../maestro';

export default class BabbleOverlayUsersSelector extends Component {
  dismissibleView = null;

  componentDidMount() {
    this._show();
  }

  _show = () => {
    this.dismissibleView.show();
  }

  _hide = async () => {
    await this.dismissibleView.hide();

    maestro.dispatchEvent('OVERLAYS:HIDE', { name: 'UsersSelector' });
  }

  render() {
    const { roomId } = this.props.data;

    return (
      <BabbleOverlayDismissibleView
        onTapDismiss={this._hide}
        onDragDismiss={this._hide}
        ref={component => this.dismissibleView = component}
      >
        <BabbleInviteSelector roomId={roomId} />
      </BabbleOverlayDismissibleView>
    );
  }
}
