// import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { render } from 'react-dom';
import { LoadScript } from '@react-google-maps/api';
import 'bootswatch/dist/litera/bootstrap.min.css'
import './index.css';
import Map from './Components/Map';
import Header from './Components/Header';
import MarkerContext from './Components/ContextProviders/marker-context';
import Sidebar from './Components/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';
import SelectionContext from './Components/ContextProviders/selection-context';
import DistContext from './Components/ContextProviders/distance-context';
import DuraContext from './Components/ContextProviders/duration-context';
import FaveContext from './Components/ContextProviders/favorites-context';
import axios from "axios";
import FilterContext from './Components/ContextProviders/filter-context';
import PathContext from './Components/ContextProviders/path-context';
import ElevContext from './Components/ContextProviders/elevation-context';
import ClickedContext from './Components/ContextProviders/clicked-context';

const lib = ['places'];
const key = "INSERT API KEY"; // Google Maps API key
// const stationsURL = "https://raw.githubusercontent.com/liangkelei/station-data-01/main/data.json";
// const stationsURL = `${process.env.REACT_APP_API_URL}/stations`;
const chargersURL = `${process.env.REACT_APP_API_URL}/chargers`;

const App = () => {

  // parent state to store selected marker
  // const [selection, setSelection] = useState("");
  const [selection, setSelection] = useState(null);
  const sel_value = { selection, setSelection };

  // parent state to store travel info
  const [distances, setDistances] = useState([]);
  const [durations, setDurations] = useState([]);
  const dist_value = { distances, setDistances };
  const dura_value = { durations, setDurations };

  // parent state: markers (GET request)
  const [markerArray, setMarkerArray] = useState(null);

  // UPDATED useEffect to get stations database
  React.useEffect(() => {
    axios.get(chargersURL).then((response) => {
        setMarkerArray(response.data);
        console.log("got chargers database");
    });
  }, []);

  // parent state: favorites
  const [favorites, setFavorites] = useState([]);
  const fave_value = { favorites, setFavorites };

  // parent state: filter
  const [filter, setFilter] = useState("option-0");
  const filt_value = { filter, setFilter };

  // parent state: path
  const [path, setPath] = useState(null);
  const path_value = { path, setPath };

  // parent state: elevations
  const [elevations, setElevations] = useState([]);
  const elev_value = { elevations, setElevations };

  // updating paths database on elevations state change
  const pathURL = `${process.env.REACT_APP_API_URL}/paths`;

  React.useEffect(() => {
    if (elevations.length > 0) {
      axios.post(pathURL, {points: elevations, polyline: path.polyline}).then((response) => {
        console.log("posted to paths database");
      });      
    }
  }, [elevations]);

  // NEW parent state: battery button clicked
  const [clicked, setClicked] = useState(false);
  const clicked_value = {clicked, setClicked};

  // getting soc database
  /*const socURL = `${process.env.REACT_APP_API_URL}/soc`;

  React.useEffect(() => {
    axios.get(socURL).then((response) => {
        //setMarkerArray(response.data);
        console.log("got soc database");
    });
  }, []);*/

  // before markerArray is filled with chargers data, don't show anything!
  if (!markerArray) return null;

  // using Bootstrap Container, Row, and Col to make layout
  // MarkerProvider provides an array of charging station data
  return (<>{
    <>
      <Container>
        <Row><Header /></Row>
        <MarkerContext.Provider value={markerArray}>
          <SelectionContext.Provider value={sel_value}>
            <DistContext.Provider value={dist_value}>
              <DuraContext.Provider value={dura_value}>
                <FaveContext.Provider value={fave_value}>
                  <FilterContext.Provider value={filt_value}>
                    <PathContext.Provider value={path_value}>
                      <ElevContext.Provider value={elev_value}>
                        <ClickedContext.Provider value={clicked_value}>
                            <LoadScript googleMapsApiKey={key} libraries={lib}>
                              <Row>
                                <Col><Map /></Col>
                                <Col><Sidebar /></Col>
                              </Row>
                            </LoadScript>                        
                        </ClickedContext.Provider>                      
                      </ElevContext.Provider>
                    </PathContext.Provider>
                  </FilterContext.Provider>
                </FaveContext.Provider>
              </DuraContext.Provider>
            </DistContext.Provider>
          </SelectionContext.Provider>
        </MarkerContext.Provider>
      </Container>
    </>
   }</>)
};

render(<App />, document.getElementById('root'));
