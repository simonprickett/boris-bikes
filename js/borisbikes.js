// borisbikes.js

const app = {
	init: () => {
		// Do any initialization...
	},

	loadBikeData: () => {
		$.getJSON(
			'https://api.tfl.gov.uk/bikepoint',
			(data) => {
				app.processBikeData(data);
			}
		);
	},

	processBikeData: (bikeData) => {
		let isFirstStation = true;
		
		for (let bikeStation of bikeData) {
			const bikeStationInfo = {};
			let attrsFound = 0;

			bikeStationInfo.name = bikeStation.commonName;
			bikeStationInfo.latitude = bikeStation.lat;
			bikeStationInfo.longitude = bikeStation.lon;

			for (let prop of bikeStation.additionalProperties) {
				switch (prop.key) {
					case 'NbBikes':
						bikeStationInfo.numAvailableBikes = parseInt(prop.value);
						attrsFound++;
						break;

					case 'NbEmptyDocks':
						bikeStationInfo.numEmptyDocks = parseInt(prop.value);
						attrsFound++;
						break;

					case 'NbDocks':
						bikeStationInfo.numDocks = parseInt(prop.value);
						attrsFound++;
						break;
				}

				// If we have found everything we need, no need to keep 
				// looking at other attrs...

				if (attrsFound === 3) {
					break;
				}
			} 

			app.displayBikeStation(bikeStationInfo, isFirstStation);
			isFirstStation = false;
		}
	},

	displayBikeStation: (bikeStationInfo, isFirstStation) => {
		console.log('called with: ' + isFirstStation);
		if (isFirstStation) {
			$('#bike-station-list').html('');
		}

		$('#bike-station-list').append(`<li>${bikeStationInfo.name}, latitude: ${bikeStationInfo.latitude}, longitude: ${bikeStationInfo.longitude}, available bikes: ${bikeStationInfo.numAvailableBikes}, empty docks: ${bikeStationInfo.numEmptyDocks}, total docks: ${bikeStationInfo.numDocks}</li>`);
	}
}

$(document).ready(() => {
    app.init();
    app.loadBikeData();
});