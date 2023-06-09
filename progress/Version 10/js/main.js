let stage;
let stageHeight;
let stageWidth;
let groupedByContinent;
let toggleViewButton = $("#toggleViewButton");
let isShowingMap;

let newGnere;
let thisGenre;

let clickedDot;
const colors = ["#2a9d8f", "#e9c46a", "#e76f51"];

$(function () {
	stage = $("#renderer");
	stageHeight = stage.innerHeight();
	stageWidth = stage.innerWidth();

	prepareData();
	createElements();
	drawMap();

	toggleViewButton.click(toggleView);
});

function prepareData() {
	songs.forEach((song) => {
		song.newGenre = song.genre.split(",")[0];
	});
	//Anzahl
	// console.log(gmynd.cumulateData(songs, "newGenre"));

	// newGnerea = gmynd.cumulateData(songs, "newGenre");
	// console.log(newGnerea);

	//Eigenschaften
	// console.log(gmynd.groupData(songs, "newGenre"));

	newGnere = gmynd.groupData(songs, "newGenre");

	return newGnere;
}

function createElements() {
	let indexSongs = 0;

	let barMax = songs.length;
	//barMax = newGnere Summer aller Songs

	// console.log(barMax);

	// Hilfsvariable: Map
	const populationMax = gmynd.dataMax(songs, "popularity");

	//Geht durch die Genres Durch für die Balken
	for (let genreName in newGnere) {
		// console.log(genreName);
		/* Iteration durch die Länder des Kontinents */

		let currentGenre = newGnere[genreName];
		// console.log(currentGenre);

		currentGenre.forEach((song, j) => {
			// Paramter: Bar-Chart

			let genreLength = newGnere[genreName].length;
			console.log(genreLength);

			const barH = (stageHeight / barMax) * genreLength;

			const barW = stageWidth;

			/* Virutelles jQuery-Element erstellen und Klasse song hizufügen. */
			let dot = $("<div></div>");
			dot.addClass("song");

			// Paramter: Bar-Chart
			//barY = aktuelle new Genre * barH

			//Variable mit der letzten Gnere Div höhe

			const barY = indexSongs * barH + barH;

			let barX = 0;

			// Parameter: Map
			const area = gmynd.map(song.danceability, 0, 1, 0, 1000);
			const mapD = gmynd.circleRadius(area);
			const mapX = gmynd.map(song.valence, 0, 1, 0, stageWidth);
			const mapY = gmynd.map(song.energy, 1, 0, stageHeight, 0);

			// if-schleife, dass genre.pop  = blau
			// if (song.newGenre == "pop") {
			// 	color = colors[0];
			let color;

			if (song.newGenre == "pop") {
				color = "rgba(51, 102, 204, 0.3)";
			} else {
				if (song.newGenre == "rock") {
					color = "rgb(51, 102, 104, 0.3)";
				} else {
					if (song.newGenre == "metal") {
						color = "rgb(51, 102, 4, 0.3)";
					} else {
						color = "rgb(55, 255, 255, 0.3)";
					}
				}
			}

			// let color = getColor(song.newGenre, populationMax);
			//console.log(newGnere.genre);

			/*  Dem Land die Parameter als Daten-Objekt zuweisen.
                Somit bekommt jedes Land die nötigen Paramter für
                die Animation. */
			dot.data({
				continent: song.continent,
				barX: barX,
				barY: barY,
				barW: barW,
				barH: barH,
				mapX: mapX,
				mapY: mapY,
				mapH: mapD,
				mapW: mapD,
				color: color,
			});

			stage.append(dot);

			clickLabel = $("#clickLabel");
			dot.click(() => {
				console.log("click");
				// /*  Dem geklickten Element den Text "Ländername: Einwohnerzahl" hinterlegen. */
				clickLabel.text("Genre: " + song.genre);
				clickLabel.show();
			});
		});

		indexSongs++;
	}

	// indexSongs++;
}

function drawMap() {
	isShowingMap = true;

	/* jQuery-Objekte (Länder) iterieren (each-Schleife) */
	$(".song").each(function () {
		/*  Für das jeweile Land an der aktuellen Position in der Schleife (each-Schleife) 
            das Daten-Objekt auslesen und in einer Variable speichern. */
		let dotData = $(this).data();

		/* Hintergrundfarbe als Style setzen. Kann nicht animiert werden. */
		$(this).css({
			"background-color": dotData.color,
		});

		/*  Ohne Animation: setzen von CSS-Style,
        $(this).css({
            'height': dotData.mapH,
            'width': dotData.mapW,
            'left': dotData.mapX,
            'top': dotData.mapY,
            'border-radius': '50%'
        }, 300);*/

		/* Mit Animation:
        Parameter mit den aktuellen werden zu den neuen Werte anmieren. */
		$(this).animate(
			{
				height: dotData.mapH,
				width: dotData.mapW,
				left: dotData.mapX,
				top: dotData.mapY,
				/* Kreis: deshalb Border-Radius 50% */
				"border-radius": "50%",
			},
			3000
		);
	});
}

function drawBarChart() {
	isShowingMap = false;

	/* Gleich siehe drawMap-Funktion */
	$(".song").each(function () {
		let dotData = $(this).data();

		$(this).animate(
			{
				height: dotData.barH,
				width: dotData.barW,
				left: dotData.barX,
				top: dotData.barY,
				/* Reckteck: Deshalb Border-Radius 0 */
				"border-radius": 0,
			},
			3000
		);
	});
}

function toggleView() {
	$("#clickLabel").removeClass("active");

	/* Stage leeren, wird nicht ausgeführt, da wir immer die selben Elemente nutzen */
	// stage.empty();

	if (isShowingMap) {
		drawBarChart();
	} else {
		drawMap();
	}
}

function getColor(population, populationMax) {
	if (population < populationMax / 20) {
		return colors[0];
	} else if (population < populationMax / 2) {
		return colors[1];
	} else {
		return colors[2];
	}
}
