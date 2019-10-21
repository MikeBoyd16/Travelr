import React from 'react';
import MapView, {
    Marker,
    AnimatedRegion,
    Polyline,
    PROVIDER_GOOGLE
} from "react-native-maps";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform
} from "react-native";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import haversine from "haversine";

// Components
import Navigation from './components/Navigation.js';

// Constants
const LATITUDE = 37.7680;
const LONGITUDE = -122.4225;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

export default class App extends React.Component {
    constructor(props) {
        super(props);  
        this.state = {
            status: "",
            latitude: LATITUDE,
            longitude: LONGITUDE,
            routeCoordinates: [],
            distanceTravelled: 0,
            prevLatLng: {},
            coordinate: new AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE
            })
        }
    }

    styles = StyleSheet.create({
        container: { flex: 1 },
        map: { flex: 1 },
        navigation: { width: '100%' }
    })

    render() {
        return (
            <View style = { this.styles.container } >
                <Navigation />
                <MapView 
                    mapType = { "standard" }
                    style = { this.styles.map } 
                    provider = { PROVIDER_GOOGLE } 
                    customMapStyle = { mapStyle } 
                    showsUserLocation
                    followUserLocation
                    showsMyLocationButton
                    loadingEnabled
                    pitchEnabled = { false }
                    region={ this.getMapRegion() }
                />
            </View>
        );
    }

    componentWillMount() {
        navigator.geolocation.clearWatch(this.watchID);
    };

    componentDidMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
              errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
          } else {
            this._getLocationAsync();
          }
        }
      
        _getLocationAsync = async () => {
          let { status } = await Permissions.askAsync(Permissions.LOCATION);
          if (status !== 'granted') {
            this.setState({
              errorMessage: 'Permission to access location was denied',
            });
        }
      
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
        
        const { coordinate } = this.state;
    
        this.watchID = navigator.geolocation.watchPosition(
          position => {
            const { routeCoordinates, distanceTravelled } = this.state;
            const { latitude, longitude } = position.coords;
    
            const newCoordinate = {
              latitude,
              longitude
            };
    
            if (Platform.OS === "android") {
              if (this.marker) {
                this.marker._component.animateMarkerToCoordinate(
                  newCoordinate,
                  500
                );
              }
            } else {
              coordinate.timing(newCoordinate).start();
            }
    
            this.setState({
              latitude,
              longitude,
              routeCoordinates: routeCoordinates.concat([newCoordinate]),
              distanceTravelled:
                distanceTravelled + this.calcDistance(newCoordinate),
              prevLatLng: newCoordinate
            });
          },
          error => console.log(error),
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
            distanceFilter: 10
          }
        );
    }

    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });
    
    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };
}

    var mapStyle = [
        { "featureType": "all", "elementType": "geometry", "stylers": [ { "color": "#ffffff" } ] },
        { "featureType": "all", "elementType": "labels.text.fill", "stylers": [ { "gamma": 0.01 }, { "lightness": 20 } ] },
        { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [ { "saturation": -31 }, { "lightness": -33 }, { "weight": 2}, { "gamma": 0.8 } ] },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#050505"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#fef3f3"
                },
                {
                    "weight": "3.01"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#0a0a0a"
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#fffbfb"
                },
                {
                    "weight": "3.01"
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 30
                },
                {
                    "saturation": 30
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "saturation": 20
                }
            ]
        },
        {
            "featureType": "poi.attraction",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 20
                },
                {
                    "saturation": -20
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 10
                },
                {
                    "saturation": -30
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "saturation": 25
                },
                {
                    "lightness": 25
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#a1a1a1"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#292929"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#202020"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "hue": "#0006ff"
                },
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "13"
                },
                {
                    "gamma": "0.00"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#686868"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                },
                {
                    "color": "#8d8d8d"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#353535"
                },
                {
                    "lightness": "6"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ffffff"
                },
                {
                    "weight": "3.45"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d0d0d0"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "lightness": "2"
                },
                {
                    "visibility": "on"
                },
                {
                    "color": "#999898"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#383838"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#faf8f8"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": -20
                }
            ]
        }
    ]