import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay, { GeoJsonLayer } from 'deck.gl'
import r2 from 'r2'

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiamZzaWlpIiwiYSI6ImNqOG83aHpueTAwNzEzMHVtNmphdmRpbGIifQ.yFFLe-v7kRCcIYmKHrIhvw'; // eslint-disable-line

// Source data GeoJSON
const DATA_URL_SIMPLIFIED = 'https://gist.githubusercontent.com/jfsiii/381ea45844291c1d142e47f071f38396/raw/93b934b4f994c1d19a38a459ea2a15183eed8273/USA-boundaries-simple.json'; // eslint-disable-line

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 40.74860243951691,
        longitude: 4.834443115824545e-13,
        pitch: 0,
        bearing: 0,
        zoom: 1.4125698468051822,
        altitude: 1.5
      },
      data: null
    };

    r2(DATA_URL_SIMPLIFIED).json
      .then((data) => this.setState({ data }))
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  render() {
    const { viewport, data } = this.state;

    const boundaryLayer = new GeoJsonLayer({
      id: 'boundary-outline',
      opacity: 1,
      data: data,
      stroked: true,
      filled: false,
      lineWidthScale: 3,
      lineWidthMinPixels: 1,
      fp64: true
    })

    const layers = [ boundaryLayer ]

    return (
      <MapGL
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay
          initWebGLParameters
          id="outline-overlay"
          {...viewport}
          layers={layers} />
      </MapGL>
    );
  }
}

export default App;
