import React, { Component } from 'react';
import {
  BabbleOverlayActionSheet,
  BabbleOverlayCountrySelector,
  BabbleOverlayGifSelector,
  BabbleOverlayUsersSelector,
  BabbleOverlayMediaViewer,
  BabbleOverlayReactionSelector,
  BabbleOverlayError,
} from './';
import maestro from '../maestro';

export default class BabbleOverlayContainer extends Component {
  state = {
    activeOverlays: {},
  }

  componentDidMount() {
    maestro.link(this);
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveEvent(name, data) {
    const activeOverlays = Object.assign({}, this.state.activeOverlays);

    if (name === 'OVERLAYS:SHOW') {
      activeOverlays[data.name] = data.data;
    }

    if (name === 'OVERLAYS:HIDE') {
      delete activeOverlays[data.name];
    }

    this.setState({ activeOverlays });
  }

  render() {
    const { activeOverlays } = this.state;
    const overlayComponents = [];

    Object.keys(activeOverlays).forEach(overlayName => {
      const data = activeOverlays[overlayName];

      if (overlayName === 'ActionSheet') {
        overlayComponents.push(<BabbleOverlayActionSheet data={data} key={overlayName} />);
      }

      if (overlayName === 'CountrySelector') {
        overlayComponents.push(<BabbleOverlayCountrySelector data={data} key={overlayName} />);
      }

      if (overlayName === 'GifSelector') {
        overlayComponents.push(<BabbleOverlayGifSelector data={data} key={overlayName} />);
      }

      if (overlayName === 'UsersSelector') {
        overlayComponents.push(<BabbleOverlayUsersSelector data={data} key={overlayName} />);
      }

      if (overlayName === 'MediaViewer') {
        overlayComponents.push(<BabbleOverlayMediaViewer data={data} key={overlayName} />);
      }

      if (overlayName === 'ReactionSelector') {
        overlayComponents.push(<BabbleOverlayReactionSelector data={data} key={overlayName} />);
      }

      if (overlayName === 'Error') {
        overlayComponents.push(<BabbleOverlayError data={data} key={overlayName} />);
      }
    });

    return overlayComponents;
  }
}
