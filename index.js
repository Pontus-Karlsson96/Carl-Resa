const distances = {
    "Granholmsvägen2b-Kontoret": 9000,
    "Granholmsvägen2b-Kvinnebyvägen1": 3000,
    "Granholmsvägen2b-Ullstämmavägen5": 2000,
    "Kontoret-Kvinnebyvägen1": 8000,
    "Kontoret-Ullstämmavägen5": 8000,
    "Kvinnebyvägen1-Ullstämmavägen5": 2000
};

document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayStr = yyyy + '-' + mm + '-' + dd;

    document.getElementById('departure-date').value = todayStr;
    displaySavedTrips();
});

function calculateDistance(from, to) {
    if (from === to) return 0;
    const key = [from, to].sort().join('-');
    return distances[key] ?? 0;
}

function addSpaceBeforeNumbers(str) {
    return str.replace(/(\D)(\d)/g, '$1 $2');
}

function displaySavedTrips() {
    const tripList = document.getElementById('tripList');
    tripList.innerHTML = '';
    displayTotal();

    const savedTrips = JSON.parse(localStorage.getItem('trips')) || [];

    if (savedTrips.length === 0) {
        tripList.innerHTML = '<li>Inga sparade resor ännu.</li>';
        return;
    }

    savedTrips.forEach(trip => {
        const li = document.createElement('li');
        const distanceKm = typeof trip.distance === 'number' ? (trip.distance / 1000) + ' km' : trip.distance;

        li.innerHTML = `
            <button class="delete-btn" onclick="deleteTrip(${trip.timestamp})">×</button>
            <strong>Från ${addSpaceBeforeNumbers(trip.from)} till ${addSpaceBeforeNumbers(trip.to)}</strong>
            <div>Avstånd: <span class="distance">${distanceKm}</span></div>
            <div>Datum: ${trip.date}</div>
            <small>Sparad: ${new Date(trip.timestamp).toLocaleString()}</small>
        `;
        tripList.appendChild(li);

    });
}

function deleteTrip(timestamp) {
    if (!confirm('Är du säker på att du vill ta bort denna resa?')) {
        return;
    }

    const savedTrips = JSON.parse(localStorage.getItem('trips')) || [];
    const updatedTrips = savedTrips.filter(trip => trip.timestamp !== timestamp);
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
    displaySavedTrips();
}

function deleteAll() {
    if (!confirm(`Är du SÄKER på att du vill ta bort ALLA?`)) {
        return;
    }

    localStorage.clear();
    displaySavedTrips();
    displayTotal();
}

function displayTotal() {
    try {
        const savedTrips = JSON.parse(localStorage.getItem('trips')) || [];
        let totalDistance = 0;

        savedTrips.forEach(trip => {
            totalDistance += Number(trip.distance) || 0;
        });

        const distanceKm = (totalDistance / 1000).toFixed(2) + ' km';
        const counterEl = document.getElementById("counter");

        if (counterEl) {
            counterEl.innerHTML = `Total distans: ${distanceKm}<br>Antal resor: ${savedTrips.length}`;
        }
    } catch (error) {
        console.error("Error updating totals:", error);
    }
}


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

document.getElementById("deleteAllBtn").addEventListener("click", (event) => {
    event.preventDefault();

    deleteAll();
})

