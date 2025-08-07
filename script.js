// Create the map with hybrid (satellite + labels)
const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 10,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Map data © Google'
}).addTo(map);

// Custom purple icon visible on all terrains
const issIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/International_Space_Station.svg/48px-International_Space_Station.svg.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16]
});

// ISS marker
let marker = L.marker([0, 0], {icon: issIcon}).addTo(map);

// Update ISS data
async function updateISS() {
    const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    const data = await res.json();

    const {latitude, longitude, altitude, velocity} = data;

    marker.setLatLng([latitude, longitude]);

    document.getElementById('lat').textContent = latitude.toFixed(2);
    document.getElementById('lon').textContent = longitude.toFixed(2);
    document.getElementById('alt').textContent = altitude.toFixed(2) + ' km';
    document.getElementById('vel').textContent = velocity.toFixed(2) + ' km/h';

    map.setView([latitude, longitude]);

    // Get astronauts
    const astroRes = await fetch('http://api.open-notify.org/astros.json');
    const astroData = await astroRes.json();
    const issAstronauts = astroData.people.filter(p => p.craft === 'ISS').map(p => p.name);
    document.getElementById('astro').textContent = issAstronauts.join(', ') || 'N/A';
}

// Initial call and repeat every 5 seconds
updateISS();
setInterval(updateISS, 5000);
