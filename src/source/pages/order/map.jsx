import React from 'react';
import { withGoogleMap, GoogleMap, Marker, withScriptjs, DirectionsRenderer } from "react-google-maps";

class Map extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = { directions: null }
    }

    componentDidMount(){

        const DirectionsService = new google.maps.DirectionsService();

        const option = {
            origin: new google.maps.LatLng(this.props.origin.lat, this.props.origin.lng),
            destination: new google.maps.LatLng(this.props.destination.lat, this.props.destination.lng),
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true
        };

        if ( this.props.route ){
            option.waypoints = [{ 
                location: new google.maps.LatLng(this.props.route.lat, this.props.route.lng),
                stopover: true
            }]
        }

        DirectionsService.route( option, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.setState({ directions: result });
            } else 
                console.error(`error fetching directions ${result}`);
        });

    }

    componentWillUnmount(){
        this.setState({ directions: null });
    }


    render() {

        const _this = this;

        const center = this.props.location || { lat: 22.3699122, lng: 114.11443068 };
        const directions = this.props.directions;

        const GoogleMapExample = (withGoogleMap(props => (
            <GoogleMap
                defaultZoom = { 16 }
                center={ center}
            >
                { _this.state.directions && <DirectionsRenderer directions={_this.state.directions} />}
            </GoogleMap>
        )));

        const height = this.props.height || '420px';
        const width = this.props.width || '100%';

        return (
            <div>
                <GoogleMapExample
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA83jZKHRmlOFXwdDM81X_pl7kyLb5o4FI&v=3.exp&libraries=geometry,drawing,places"
                    mapElement={ 
                        <div 
                            style={{ height: `100%` }}     
                        /> 
                    }
                    containerElement={ 
                        <div 
                            style={{ height , width , overflow:'hidden' }}     
                        /> 
                    }
                    loadingElement={ 
                        <div 
                            style={{ 
                                height: `300px`, width: '100%', 
                                display:'flex', 
                                alignItems:'center', justifyContent:'center' 
                            }}>
                                <h1 className="loading-text"> Loading ... </h1>
                        </div> 
                    }
                />
            </div>
        );
    }
};

export default Map;