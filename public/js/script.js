// const socket = io();
// //Checks if the browser supports geolocation.

// if(navigator.geolocation){

//     //Continuously monitors the user's location.
//     navigator.geolocation.watchPosition((position)=>{
//        const {latitude,longitude}= position.coords;

//        //When the position updates, it sends latitude (lat) and longitude (long) to the server via Socket.IO 
//        socket.emit("send-location",{latitude,longitude});
//     },(e)=>{
//         console.log(e);
//     },{
//         enableHighAccuracy:true,
//         maximumAge:0, //no caching
//         timeout:5000,
//     });
// }

// const map = L.map("map").setView([0,0],16); //asking for location

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
//     attribution:"OpenStreetMap"
// }).addTo(map);


// const markers={};

// socket.on("receive-location",(data)=>{
//     const {id,latitude,longitude} = data;
//     map.setView([latitude,longitude]);
//     if(markers[id]){
//         markers[id].setLatLng([latitude,longitude]);
//     }
//     else{
//         markers[id]=L.marker([latitude,longitude]).addTo(map)
//     }
// });

// socket.on("user-disconnected",(id)=>{
//     if(markers[id]){
//         map.removeLayer(markers[id]);
//         delete markers[id];
//     }
// })


// Checks if the browser supports geolocation
const socket = io();

// Checks if the browser supports geolocation
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;

        // Send location with user profile details
        socket.emit("send-location", {
            latitude,
            longitude,
            profile: {
                name: "User Name", // Replace with actual user profile data
                device: "Device Details" // Replace with actual device details
            }
        });
    }, (e) => {
        console.log(e);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
    });
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

const markers = {};
const profiles = document.getElementById("profiles");

socket.on("receive-location", (data) => {
    const { id, latitude, longitude, profile } = data;
    map.setView([latitude, longitude]);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

    // Update user profile display
    if (profiles) {
        const profileElement = document.getElementById(`profile-${id}`);
        if (profileElement) {
            profileElement.innerHTML = `
                <strong>${profile.name}</strong>
                <div class="details">
                    Device: ${profile.device}<br>
                    Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
                </div>
            `;
        } else {
            const newProfileElement = document.createElement("div");
            newProfileElement.id = `profile-${id}`;
            newProfileElement.classList.add("profile");
            newProfileElement.innerHTML = `
                <strong>${profile.name}</strong>
                <div class="details">
                    Device: ${profile.device}<br>
                    Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
                </div>
            `;
            profiles.appendChild(newProfileElement);
        }
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }

    // Remove user profile display
    const profileElement = document.getElementById(`profile-${id}`);
    if (profileElement) {
        profiles.removeChild(profileElement);
    }
});
