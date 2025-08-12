const distances = {
    "granholmsvägen2b-kontoret": 9000,
    "granholmsvägen2b-kvinnebyvägen1": 3000,
    "granholmsvägen2b-ullstämmavägen5": 2000,
    "kontoret-kvinnebyvägen1": 8000,
    "kontoret-ullstämmavägen5": 8000,
    "kvinnebyvägen1-ullstämmavägen5": 2000
}

document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayStr = yyyy + '-' + mm + '-' + dd;

    document.getElementById('departure-date').value = todayStr;
});

function calculateDistance(from, to) {

    if (from === to) return 0;

    const key = [from, to].sort().join('-');
    return distances[key] ?? "Okänt avstånd";
}

function displaySavedTrips() {
    const tripList = document.getElementById('tripList');
    tripList.innerHTML = '';

    const savedTrips = JSON.parse(localStorage.getItem('trips')) || [];

    if (savedTrips.length === 0) {
        tripList.innerHTML = '<li>Inga sparade resor ännu.</li>';
        return;
    }

    savedTrips.forEach(trip => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Från ${trip.from} till ${trip.to}</strong>
                        <div>Datum: ${trip.date}</div>
                        <small>Sparat den ${new Date(trip.timestamp).toLocaleString()}</small > `;
        tripList.appendChild(li);
    });
}

displaySavedTrips();

document.getElementById('tripForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('departure-date').value;
    const distance = calculateDistance(from, to);

    const trip = {
        from: from,
        to: to,
        distance: distance,
        date: date,
        timestamp: new Date().getTime()
    };

    const savedTrips = JSON.parse(localStorage.getItem('trips')) || [];

    savedTrips.push(trip);

    localStorage.setItem('trips', JSON.stringify(savedTrips));

    displaySavedTrips();

    this.reset();
    document.getElementById('departure-date').value = new Date().toISOString().split('T')[0];
});