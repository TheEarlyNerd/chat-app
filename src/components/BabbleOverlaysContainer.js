import React, { Component } from 'react';
import { BabbleOverlayCountrySelector, BabbleOverlayError } from './';
import maestro from '../maestro';

export default class BabbleOverlayContainer extends Component {
  state = {
    activeOverlay: '',
    activeOverlayData: null,
  }

  componentDidMount() {
    maestro.link(this);
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveEvent(name, data) {
    if (name === 'OVERLAYS:SHOW') {
      this.setState({
        activeOverlay: data.name,
        activeOverlayData: data.data,
      });
    }

    if (name === 'OVERLAYS:HIDE') {
      this.setState({
        activeOverlay: '',
        activeOverlayData: null,
      });
    }
  }

  render() {
    const { activeOverlay, activeOverlayData } = this.state;

    if (activeOverlay === 'CountrySelector') {
      return <BabbleOverlayCountrySelector data={activeOverlayData} />;
    }

    if (activeOverlay === 'Error') {
      return <BabbleOverlayError data={activeOverlayData} />;
    }

    return null;
  }
}
