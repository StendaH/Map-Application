/* StAuth10244: I, Edwardson Pascual, 000323370, certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else. */

var map;
var gymMarkers = [];
var userMarker = null;
var activeInfoWindow = null;
var geocoder = null;
var directionsService = null;
var directionsRenderer = null;
var currentFilterType = "all";

var gymLocations = [

    {
        name: "David Braley Athletic & Recreation Centre",
        address: "135 Fennell Ave W, Hamilton, ON",
        type: [ "coed", "rec" ],
        position: { lat: 43.23866673373478, lng: -79.88847137073623 }
    },
    {
        name: "GoodLife Fitness Hamilton Stone Church",
        address: "1070 Stone Church Rd E, Hamilton, ON",
        type: [ "coed", "women" ],
        position: { lat: 43.19829927453047, lng: -79.84203460251089 }
    },
    {
        name: "GoodLife Fitness Hamilton Upper James and Rymal",
        address: "1550 Upper James St, Hamilton, ON",
        type: [ "coed" ],
        position: { lat: 43.20530995195885, lng: -79.89525969428526 }
    },
    {
        name: "GoodLife Fitness Hamilton Limeridge For Women",
        address: "883 Upper Wentworth St, Hamilton, ON",
        type: [ "women" ],
        position: { lat: 43.22042634341956, lng: -79.86256832627856 }
    },
    {
        name: "GoodLife Fitness Hamilton Queenston Place",
        address: "640 Queenston Rd, Hamilton, ON",
        type: [ "coed" ],
        position: { lat: 43.23003089292607, lng: -79.77739884588658 }
    },
    {
        name: "Crunch Fitness Hamilton",
        address: "1389 Upper James St, Hamilton, ON",
        type: [ "coed" ],
        position: { lat: 43.20926565478943, lng: -79.8882231911941 }
    },
    {
        name: "Les Chater Family YMCA",
        address: "356 Rymal Rd, Hamilton, ON",
        type: [ "coed", "rec" ],
        position: { lat: 43.1981394180354, lng: -79.87847019964994 }
    },
    {
        name: "Hamilton Downtown Family YMCA",
        address: "79 James St S, Hamilton, ON",
        type: [ "coed", "rec" ],
        position: { lat: 43.25435440236042, lng: -79.86994606883655 }
    },
    {
        name: "Crunch Fitness - Hamilton East Mountain",
        address: "1215 Stone Church Rd E, Hamilton, ON",
        type: [ "coed" ],
        position: { lat: 43.1984906769847, lng: -79.83638836678725 }
    },
    {
        name: "Body Pro Gym - Hamilton",
        address: "635 Upper Wentworth St, Hamilton, ON",
        type: [ "coed" ],
        position: { lat: 43.23055210515245, lng: -79.85810538112658 }
    },
    {
        name: "GoodLife Fitness Ancaster Wilson and McClure",
        address: "1096 Wilson St W, Ancaster, ON",
        type: [ "coed" ],
        position: { lat: 43.197704760953876, lng: -80.01712036971233 }
    },
    {
        name: "Fit4Less",
        address: "1211 Barton St E, Hamilton, ON",
        type: [ "coed" ],
        position: { lat: 43.2527679795883, lng: -79.81121844930992 }
    },
    {
        name: "Crunch Fitness - Ancaster",
        address: "1015 Golf Links Rd, Ancaster, ON",
        type: [ "coed" ],
        position: { lat: 43.22855844680504, lng: -79.94140508938384 }
    },
    {
        name: "Fit4Females",
        address: "2751 Barton St E, Hamilton, ON",
        type: [ "women" ],
        position: { lat: 43.23373877542196, lng: -79.74506311666954 }
    },
    {
        name: "Boutique Fit Women's Gym",
        address: "635 Upper Wentworth St, Hamilton, ON",
        type: [ "women" ],
        position: { lat: 43.23055210515245, lng: -79.85810538112658 }
    },
    {
        name: "Women Who Lift - Personal Traininer, Bootcamp & Fitness Hamilton",
        address: "875 Main St W Unit L1-11, Hamilton, ON",
        type: [ "women" ],
        position: { lat: 43.25899480851934, lng: -79.90074606049006 }
    },
    {
        name: "The Grappling Garden",
        address: "100 Frid St #15, Hamilton, ON",
        type: [ "rec" ],
        position: { lat: 43.2574951641368, lng: -79.89371374017652 }
    }

];

function initMap()
{

    map = new google.maps.Map(

        document.getElementById( "map" ),
        {

            center: { lat: 43.23872, lng: -79.88813 },
            zoom: 12

        }

    );

    var btn = document.getElementById( "btnGeolocate" );

    // Add click event listener to the geolocate button
    if ( btn ) {

        btn.addEventListener( "click", handleGeolocateClick );

    }

    geocoder = new google.maps.Geocoder();

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer( {

        map: map,
        panel: document.getElementById( "dirPanel" )

    } );

    createGymMarkers();
    setupFilterButtons();
    setupAddGymForm();
    setupDirectionsControls();

}

function createGymMarkers() {

    var i;

    // Loop through gymLocations and create a marker for each gym
    for ( i = 0; i < gymLocations.length; i++ ) {

        createOneGymMarker( gymLocations[i] );

    }

}

function createOneGymMarker( gym ) {

    var marker = new google.maps.Marker( {

        position: gym.position,
        map: map,
        title: gym.name

    } );

    gymMarkers.push( { marker: marker, type: gym.type } );

    // If a filter is active, hide this new marker if it doesn't match
    if ( currentFilterType !== "all" ) {

        // If the gym's type does not include the current filter type, hide the marker
        if ( gym.type.indexOf( currentFilterType ) === -1 ) {

            marker.setMap( null );

        }

    }


    var infoContent =
        "<div>" +
            "<h6 class='mb-1'>" + gym.name + "</h6>" +
            "<div>" + gym.address + "</div>" +
        "</div>";
        
    var infoWindow = new google.maps.InfoWindow( {

        content: infoContent

    } );

    marker.addListener( "click", function( ) {

        // Close the previously opened info window, if any
        if ( activeInfoWindow ) {

            activeInfoWindow.close( );

        }

        infoWindow.open( map, marker );
        activeInfoWindow = infoWindow;

        routeToGym( gym );

    } );

}

function handleGeolocateClick( )
{

    // Check if the browser supports geolocation
    if ( !navigator.geolocation ) {

        alert( "Geolocation is not supported by this browser." );
        return;

    }

    navigator.geolocation.getCurrentPosition(

        function ( position ) {

            var userLocation = {

                lat: position.coords.latitude,
                lng: position.coords.longitude

            };

            map.setCenter( userLocation );
            map.setZoom( 14 );

            // Remove existing user marker if it exists
            if ( userMarker ) {

                userMarker.setMap( null );

            }

            userMarker = new google.maps.Marker( {

                position: userLocation,
                map: map,
                title: "You are here",
                icon: {

                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"

                }

            } );

        },
        function ( ) {

            alert( "Unable to get your location." );

        }

    );

}

function setupFilterButtons( )
{

    var btnAll = document.getElementById( "btnAll" );
    var btnCoed = document.getElementById( "btnCoed" );
    var btnWomen = document.getElementById( "btnWomen" );
    var btnRec = document.getElementById( "btnRec" );

    // Add click event listeners to filter buttons
    if ( btnAll ) {

        btnAll.addEventListener( "click", function ( ) { applyFilter( "all" ); } );

    }

    // The filter buttons will pass the corresponding type to the applyFilter function when clicked
    if ( btnCoed ) {

        btnCoed.addEventListener( "click", function ( ) { applyFilter( "coed" ); } );

    }

    if ( btnWomen ) {

        btnWomen.addEventListener( "click", function ( ) { applyFilter( "women" ); } );

    }

    if ( btnRec ) {

        btnRec.addEventListener( "click", function ( ) { applyFilter( "rec" ); } );

    }

}

function applyFilter( filterType )
{

    currentFilterType = filterType;

    if ( activeInfoWindow ) {

        activeInfoWindow.close( );
        activeInfoWindow = null;

    }

    // Clear any existing directions from the map and the directions panel when applying a new filter
    if ( directionsRenderer ) {

        directionsRenderer.set( "directions", null );

    }

    var i;

    // Loop through gymMarkers and set the map for each marker based on the filter type
    for ( i = 0; i < gymMarkers.length; i++ ) {

        // If the filter type is "all", show all markers
        if ( filterType === "all" ) {

            gymMarkers[i].marker.setMap( map );

        } else { // If the filter type is not "all", check if the gym's type includes the filter type

            // If the gym's type includes the filter type, show the marker; otherwise, hide it
            if ( gymMarkers[i].type.indexOf( filterType ) !== -1 ) {

                gymMarkers[i].marker.setMap( map );

            } else { // If the gym's type does not include the filter type, hide the marker

                gymMarkers[i].marker.setMap( null );

            }

        }

    }

}

function setupAddGymForm( )
{

    var btnAdd = document.getElementById( "btnAddGym" );

    // Add click event listener to the add gym button
    if ( btnAdd ) {

        btnAdd.addEventListener( "click", handleAddGymClick );

    }

}

function handleAddGymClick( )
{

    var txtName = document.getElementById( "txtName" );
    var txtAddress = document.getElementById( "txtAddress" );
    var ddlType = document.getElementById( "selType" );
    var msg = document.getElementById( "msgAddGym" );

    var name = "";
    var address = "";
    var typeValue = "";

    // Get the values from the form inputs and trim any leading/trailing whitespace
    if ( txtName ) { name = txtName.value.trim( ); }
    // The address will be geocoded, so we can allow for more flexible input, but we still want to trim it
    if ( txtAddress ) { address = txtAddress.value.trim( ); }
    // The type is selected from a dropdown, so we can just get the value directly
    if ( ddlType ) { typeValue = ddlType.value; }

    // Clear any previous messages
    if ( msg ) { msg.textContent = ""; }

    // Validate the form inputs
    if ( name.length === 0 || address.length === 0 ) {

        // If either the name or address is empty, show an error message and return early
        if ( msg ) { msg.textContent = "Please enter a gym name and address."; }
        return;

    }

    // Check if the geocoder is initialized before attempting to use it
    if ( !geocoder ) {

        if ( msg ) { msg.textContent = "Geocoder not ready."; }
        return;

    }

    geocoder.geocode(

        { address: address },

        function ( results, status ) {

            // If the geocoding was not successful or did not return any results, show an error message and return early
            if ( status !== "OK" || !results || results.length === 0 ) {

                // If the geocoding was not successful, show an error message and return early
                if ( msg ) {
                    msg.textContent = "Geocoding failed: " + status;
                }

                return;

            }

            var location = results[0].geometry.location;

            var newGym = {

                name: name,
                address: results[0].formatted_address,
                type: [ typeValue ],
                position: { lat: location.lat( ), lng: location.lng( ) }

            };

            gymLocations.push( newGym );
            createOneGymMarker( newGym );

            map.setCenter( newGym.position );
            map.setZoom( 14 );

            // Clear the form inputs after adding the gym
            if ( msg ) { msg.textContent = "Gym added!"; }


            if ( txtName ) { // Clear the name input field
                txtName.value = "";
            } 
            if ( txtAddress ) { // Clear the address input field
                txtAddress.value = "";
            }
            if ( ddlType ) { // Reset the type dropdown to its default value
                ddlType.value = "coed";
            }

        }

    );

}

function setupDirectionsControls( )
{

    var btnClear = document.getElementById( "btnClearRoute" );

    // Add click event listener to the clear route button
    if ( btnClear ) {

        btnClear.addEventListener( "click", clearRoute );

    }

}

function clearRoute( )
{

    var msg = document.getElementById( "dirMsg" );
    var panel = document.getElementById( "dirPanel" );

    // Clear the directions from the map and the directions panel
    if ( directionsRenderer ) {

        directionsRenderer.setDirections( {
            routes: []
        } );

    }

    // Clear the directions panel content
    if ( panel ) {

        panel.innerHTML = "";

    }

    // Clear any messages in the directions panel
    if ( msg ) {

        msg.textContent = "";

    }

    // Close any open info window so it doesn't look like "route is still active"
    if ( activeInfoWindow ) {

        activeInfoWindow.close( );
        activeInfoWindow = null;

    }

}

function routeToGym( gym )
{

    var msg = document.getElementById( "dirMsg" );

    // You must have clicked "Use My Location" first
    if ( !userMarker ) {

        if ( msg ) {

            msg.textContent = "Click \"Use My Location\" first to get directions.";

        }

        return;

    }

    // Check if the directions service and renderer are initialized before attempting to use them
    if ( !directionsService || !directionsRenderer ) {

        if ( msg ) {

            msg.textContent = "Directions not ready yet.";

        }

        return;

    }

    // Clear any previous directions from the map and the directions panel
    if ( msg ) {

        msg.textContent = "";

    }

    directionsService.route(

        {

            origin: userMarker.getPosition( ),
            destination: gym.position,
            travelMode: google.maps.TravelMode.DRIVING

        },

        function ( result, status ) {

            // If the directions request was not successful, show an error message and return early
            if ( status !== "OK" ) {

                // If the directions request was not successful, show an error message and return early
                if ( msg ) {

                    msg.textContent = "Directions failed: " + status;

                }

                return;

            }

            directionsRenderer.setDirections( result );

            // If given a valid route, adjust the map bounds to fit the route
            if ( result && result.routes && result.routes.length > 0 ) {

                map.fitBounds( result.routes[0].bounds );

            }

        }

    );

}

window.initMap = initMap;
