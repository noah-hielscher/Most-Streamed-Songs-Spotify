// Globale Variablen
let stage;
let stageHeight;
let stageWidth;
let groupedByContinent;
let toggleViewButton = $("#toggleViewButton");

// Menüleiste
let info = $("#info"); // Informationen
let energy = $("#energy"); // Energie
let genres = $("#genres"); // Genres
let keys = $("#keys"); // Tasten

let isShowing;

let newGnere;
let thisGenre;

let holdTimeout;

let clickLabelInput1;
let clickLabelInput2;

let bar;

// Farbe der Genres
const colorGenres = [
	"#47B5D8",
	"#8FD87D",
	"#FAB16D",
	"#B3A7FF",
	"#F5F19D",
	"#FF8DB4",
	"#E6F89E",
	"#7CADF5",
	"#71BBF0",
	"#95FFD5",
	"#A7BAF2",
];

let searchQuery;

let clickedDot;

$(function () {
	stage = $("#renderer");
	stageHeight = stage.innerHeight();
	stageWidth = stage.innerWidth();

	prepareData();
	createElements();

	drawStart();
	// Info CSS geklicktes Menü
	info.addClass("clickedMenu");

	menubar.hover(menubar());
});

function prepareData() {
	songs.forEach((song) => {
		song.newGenre = song.genre.split(",")[0];
	});

	newGnere = gmynd.groupData(songs, "newGenre");

	return newGnere;
}

function createElements() {
	let indexX = 0;
	// barMax = Summe aller Songs in newGnere
	let barMax = songs.length;

	// Randabstände
	let marginTop = 230;
	let marginLeft = 50;
	let marginRight = 50;
	let marginBottom = 150;

	// Genres
	let dotWidth = 21;
	let paddingRender = 50;
	let gapY = dotWidth;
	let barX = 0;
	let barY = marginTop;
	let maxDotLength = Math.floor((stageWidth - paddingRender * 2) / dotWidth);

	// Maximaler Danceability-Wert
	let danceabilityMax = gmynd.dataMax(songs, "danceability");
	// Maximaler Valence-Wert
	let valenceMax = gmynd.dataMax(songs, "valence");
	// Maximaler Energie-Wert
	let energyMax = gmynd.dataMax(songs, "energy");

	let colorIndex = 0;
	for (let genreName in newGnere) {
		let currentGenre = newGnere[genreName];

		// Das jeweilige Genre wird durchlaufen, je nach Länge des Genres
		currentGenre.forEach((song, j) => {
			/* Virtuelles jQuery-Element erstellen und Klasse "song" hinzufügen */
			let dot = $("<div></div>");
			dot.addClass("song");

			// Parameter: Map - Ansicht 1
			const area = gmynd.map(
				song.danceability,
				0,
				danceabilityMax,
				0,
				100
			);
			const mapD = gmynd.circleRadius(area);
			const mapX = gmynd.map(
				song.valence,
				valenceMax,
				0,
				stageWidth - marginRight - 18,
				marginLeft - 45
			);
			const mapY = gmynd.map(
				song.energy,
				0,
				energyMax,
				stageHeight - marginBottom,
				marginTop
			);

			//Parameter Barchart - Ansicht 2

			barX = indexX * dotWidth + paddingRender;

			//Parameter Key - Ansicht 3
			keyX = gmynd.map(
				song.key + song.mode / 2,
				0,
				12,
				marginLeft + 10,
				stageWidth - marginRight + 40
			);
			keyY = gmynd.map(
				song.danceability,
				0,
				danceabilityMax,
				stageHeight - marginBottom + 100,
				marginTop
			);
			let keyHW = 5;

			//Farbe der Dots
			let color = colorGenres[colorIndex];

			dot.attr("genre", song.newGenre);

			dot.css({
				left: mapX,
				top: mapY,
			});

			dot.data({
				//Allgemein
				genre: song.newGenre,
				color: color,
				//Barchart
				barX: barX,
				barY: barY,
				barH: dotWidth,
				barW: dotWidth,
				//Map
				mapX: mapX,
				mapY: mapY,
				mapH: mapD,
				mapW: mapD,
				//Key
				keyX: keyX,
				keyY: keyY,
				// other information
				artist: song.artist,
				song: song.song,
				danceability: song.danceability,
				energy: song.energy,
				key: song.key,
				mode: song.mode,
				valence: song.valence,
				year: song.year,
				genre: song.genre,
			});

			stage.append(dot);
			clickLabel1 = $("#clickLabel1");
			clickLabel2 = $("#clickLabel2");
			resetLabel = $("#resetLabel");

			//Click Label
			dot.click(() => {
				$(".song").removeClass("clicked");
				searchQuery = song.artist + " " + song.song;

				//Clicklabel Hintergrundfarbe
				clickLabel1.css({
					borderTop: "2px solid " + color,
				});

				//durchlaufe und suche nach der Klasse transform
				$(".transform").each(function () {
					let dotData = $(this).data();
					$(this).css({
						left: dotData.barX,
						top: dotData.barY,
					});
				});

				//je nach Ansicht unterschiedliche Informationen im Label
				if (isShowing === "map") {
					clickLabelInput1 =
						"<p class='song-info'>Artist: " +
						song.artist +
						"<br>" +
						"Title: " +
						song.song +
						"<br>" +
						"Year: " +
						song.year +
						"<br>" +
						"<strong> Valence: " +
						song.valence +
						" | " +
						"Energy: " +
						song.energy +
						"</strong><br>" +
						"Genre: " +
						song.genre +
						" | " +
						"Danceability: " +
						song.danceability +
						"<br>" +
						"press to Play</p>";
				} else {
					if (isShowing === "bar") {
						clickLabelInput1 =
							"<p class='song-info'>Artist: " +
							song.artist +
							"<br>" +
							"Title: " +
							song.song +
							"<br>" +
							"Year: " +
							song.year +
							"<br>" +
							"<strong>Genre: " +
							song.genre +
							"</strong><br>" +
							"press to Play</p>";
					} else {
						clickLabelInput1 =
							"<p class='song-info'>Artist: " +
							song.artist +
							"<br>" +
							"Title: " +
							song.song +
							"<br>" +
							"Year: " +
							song.year +
							"<br>" +
							"<strong>Key: " +
							song.key +
							" | " +
							"Dancebility: " +
							song.danceability +
							"</strong><br>" +
							"Genre: " +
							song.genre +
							"<br>" +
							"press to Play</p>";
					}
				}
				//Input zum Clicklabel
				clickLabel1.html(clickLabelInput1);

				//abspielen der Musik nach "Klick" auf YoutTube
				clickLabel1.click(() => {
					let searchQuery = 0;
					let searchUrl = 0;
					openSong();
				});
				//doppelclick - alle im selben Genre eine Farbe
				dot.dblclick(() => {
					//Bei Doppelclick Farbe entfernen
					$(".song").removeClass("clicked");
					resetLabel.show();
					//Reset Label
					resetLabel.text("<- Reset View" + " " + song.newGenre);
					resetLabel.css({
						backgroundColor: color,
					});
					resetLabel.click(() => {
						$(".song").removeClass("clicked");
						$(".song").show();
						resetLabel.hide();
						clickLabel1.hide();
					});

					//Welche Eigenschaft hat der angeklickte Dot
					clickedDot = song.newGenre;

					$(".song").each(function () {
						let thisGenre = $(this).data("genre");

						if (thisGenre == clickedDot) {
						} else {
							$(this).hide();
						}
					});
				});

				function openSong() {
					// searchQuery = song.artist + " " + song.song;
					searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
						searchQuery
					)}`;
					window.open(searchUrl);
				}
				//dot doe klasse .song.clicked
				if (isShowing === "map") {
					dot.addClass("song clicked transform");
				} else {
					if (isShowing === "bar") {
						dot.addClass("song clicked");
					} else {
						dot.addClass("song clicked transform");
					}
				}
				clickLabel1.show();
			});

			//Hold Label
			dot.mousedown(() => {
				//variable die Breite von Clciklabel2
				let labelWidth = clickLabel1.width();

				holdTimeout = setTimeout(() => {
					clickLabel2.css({
						borderTop: "2px solid " + color,
						// backgroundColor: color,
						right: labelWidth + 100,
					});
					clickLabel2.show();

					if (isShowing === "map") {
						clickLabelInput2 =
							"<p class='song-info'>Artist: " +
							song.artist +
							"<br>" +
							"Title: " +
							song.song +
							"<br>" +
							"Year: " +
							song.year +
							"<br>" +
							"<strong> Valence: " +
							song.valence +
							" | " +
							"Energy: " +
							song.energy +
							"</strong><br>" +
							"Genre: " +
							song.genre +
							" | " +
							"Danceability: " +
							song.danceability +
							"<br>" +
							"press to Play</p>";
					} else {
						if (isShowing === "bar") {
							clickLabelInput2 =
								"<p class='song-info'>Artist: " +
								song.artist +
								"<br>" +
								"Title: " +
								song.song +
								"<br>" +
								"Year: " +
								song.year +
								"<br>" +
								"<strong>Genre: " +
								song.genre +
								"</strong><br>" +
								"press to Play</p>";
						} else {
							clickLabelInput2 =
								"<p class='song-info'>Artist: " +
								song.artist +
								"<br>" +
								"Title: " +
								song.song +
								"<br>" +
								"Year: " +
								song.year +
								"<br>" +
								"<strong>Key: " +
								song.key +
								" | " +
								"Dancebility: " +
								song.danceability +
								"</strong><br>" +
								"Genre: " +
								song.genre +
								"<br>" +
								"press to Play</p>";
						}
					}
					clickLabel2.html(clickLabelInput2);
				}, 1000);
			});

			dot.mouseup(() => {
				clearTimeout(holdTimeout);
				clickLabel2.hide();
			});

			//Hoover Label
			hoverLabel = $("#hoverLabel");
			dot.mouseover(() => {
				hoverLabel.text(song.song);

				let labely = $(this).data();

				let dotData = dot.data();
				let hooverx;

				//hoverLabel breite
				let hoverLabelWidth = hoverLabel.width();
				let hoverLabelPositionMax = dotData.mapX + hoverLabelWidth;

				if (isShowing === "map") {
					//hoverLabel position
					if (hoverLabelPositionMax > stageWidth - marginRight - 50) {
						labely = dotData.mapY - 11;
						hooverx = dotData.mapX - hoverLabelWidth - 50;
					} else {
						labely = dotData.mapY - 13;
						hooverx = dotData.mapX + 20;
					}
					//Dot hover effect
					dot.addClass("song hovered");
				} else {
					if (isShowing === "bar") {
						//hoverLabel position
						hoverLabelPositionMax = dotData.barX + hoverLabelWidth;
						if (
							hoverLabelPositionMax >
							stageWidth - marginRight - 50
						) {
							labely = dotData.barY - 5;
							hooverx = dotData.barX - hoverLabelWidth - 35;
						} else {
							labely = dotData.barY - 5;
							hooverx = dotData.barX + 30;
						}
					} else {
						//hoverLabel position
						hoverLabelPositionMax = dotData.keyX + hoverLabelWidth;
						if (
							hoverLabelPositionMax >
							stageWidth - marginRight - 50
						) {
							labely = dotData.keyY - 12;
							hooverx = dotData.keyX - hoverLabelWidth - 45;
						} else {
							labely = dotData.keyY - 13;
							hooverx = dotData.keyX + 20;
						}
						//Dot hover effect
						dot.addClass("song hovered");
					}
				}

				//css
				hoverLabel.css({
					left: hooverx,
					top: labely,
					backgroundColor: color,
				});
				hoverLabel.show();
			});
			//Hover out
			dot.mouseout(() => {
				$(".song").removeClass("hovered");
				$("#hoverLabel").text("");
			});
			indexX++;

			//parameter Ansicht 2
			if (maxDotLength === indexX) {
				barY = barY + gapY;
				barX = 0;
				indexX = 0;
			}
		});

		colorIndex++;
	}
}
