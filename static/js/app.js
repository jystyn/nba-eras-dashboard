// Return list of states
const states = [
    'ALL STATES', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL',
    'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
    'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
    'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
    'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const eras = [
    'ALL ERAS',
    'Before Integration (<1950)', 
    'After Integration (>=1950)', 
    'Before MJ Debut (<1985)', 
    'After MJ Debut (>=1985)'
];

let state_data, era_data, ten_list, header_list, stat_list, era, state, players;
let ten_gp, ten_pts, ten_reb, ten_assists, ten_blocks, ten_stl, ten_fg, ten_fga, ten_3p, ten_3pa, ten_ft, ten_fta, ten_to, ten_pf;


// #selDataset is html id for dropdown button
let dropdownMenu = d3.select('#selDataset');

let dropdownEra = d3.select('#selEra');

let displayCities = d3.select('#top-cities');

let topTenChart = d3.select('#table');

let url = '../../resources/full_states_nba.json';
const json_data = d3.json(url);


// Call the json data from the .json file
json_data.then((data) => {
    // console.log(data);
})

// This populates the dropdown button and intializes the functions
function init() {


    // Call the optionChanged function when the dropdown value is changed
    d3.selectAll('#selDataset').on('change', optionChanged);

    // call eraChanged Function when the dropdown value is changed
    d3.selectAll('#selEra').on('change', eraChanged);

    // Populates the options for the dropdown in the html
    states.forEach(state_abbrev => {
        dropdownMenu.append('option')
            .property('value', state_abbrev)
            .text(state_abbrev);
    });

    eras.forEach(era => {
        dropdownEra.append('option')
            .property('value', era)
            .text(era);
    });

    // Sets the initial values for state
    state = states[0];
    era = eras[0];
    // console.log(`Players born in ${state}, ${era}`);
    // displayData(state)
    // initMap(state);
    topFiveCities(state);
    topTenCharts(state);
    return era, state;
}

function createMap(players){
    let map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    
    var baseMaps = {
            "Map": map
        };
    var overlayMaps = {
            "Players": players
        };
    var myMap = L.map("bubble", {
        center: [39.81, -98.56],
        zoom: 3.5,
        layers: [map, players]
    });
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
}
function initMap(state_abbrev){



    json_data.then((data) => {
        if (era == 'Before Integration (<1950)') {
            era_data = data.filter(result => result.birthyear < 1950);
            console.log(era_data)
        } else if (era == 'After Integration (>=1950)') {
            era_data = data.filter(result => result.birthyear > 1949);
            console.log(era_data)
        } else if (era == 'Before MJ Debut (<1985)') {
            era_data = data.filter(result => result.birthyear < 1985);
            console.log(era_data)
        } else if ( era == 'After MJ Debut (>=1985)') {
            era_data = data.filter(result => result.birthyear >= 1985);
            console.log(era_data)
        } else {
            era_data = data;
            console.log(era_data);
        }

        if (state_abbrev != 'ALL STATES') {
            state_data = era_data.filter(result => result.state == state_abbrev);
        }
        else {
            state_data = era_data;
        }

        let playerMarkers = [];
            for (let index = 0; index < state_data.length; index++) {
                let one_player = state_data[index];
                let player_marker = L.circle([one_player.lat, one_player.lon],{
                    radius: 10
                }).bindPopup(`<h1>${one_player.city.replace('_',' ')}, ${one_player.state}</h1> <hr> <h3> Name : <a href=${one_player.url}> ${one_player.name} </a>
                `);
                playerMarkers.push(player_marker);
            }
            players = L.layerGroup(playerMarkers)
            createMap(players);
    })
}



// TOp 10 In each Stat per State
function topTenCharts(state_abbrev) {
    console.log(`Players born in ${state}, ${era}`);

    json_data.then((data) => {
        if (era == 'Before Integration (<1950)') {
            era_data = data.filter(result => result.birthyear < 1950);
            console.log(era_data)
        } else if (era == 'After Integration (>=1950)') {
            era_data = data.filter(result => result.birthyear > 1949);
            console.log(era_data)
        } else if (era == 'Before MJ Debut (<1985)') {
            era_data = data.filter(result => result.birthyear < 1985);
            console.log(era_data)
        } else if ( era == 'After MJ Debut (>=1985)') {
            era_data = data.filter(result => result.birthyear >= 1985);
            console.log(era_data)
        } else {
            era_data = data;
            console.log(era_data);
        }
        
        if (state_abbrev != 'ALL STATES') {
            state_data = era_data.filter(result => result.state == state_abbrev);
        }
        else {
            state_data = era_data;
        }
        ten_gp = state_data.sort((a, b) => d3.descending(a.gp, b.gp)).slice(0, 10);
        ten_pts = state_data.sort((a, b) => d3.descending(a.pts, b.pts)).slice(0, 10);
        ten_reb = state_data.sort((a, b) => d3.descending(a.trb, b.trb)).slice(0, 10);
        ten_assists = state_data.sort((a, b) => d3.descending(a.ast, b.ast)).slice(0, 10);
        ten_blocks = state_data.sort((a, b) => d3.descending(a.blk, b.blk)).slice(0, 10);
        ten_stl = state_data.sort((a, b) => d3.descending(a.stl, b.stl)).slice(0, 10);
        ten_fg = state_data.sort((a, b) => d3.descending(a.fg, b.fg)).slice(0, 10);
        ten_fga = state_data.sort((a, b) => d3.descending(a.fga, b.fga)).slice(0, 10);
        ten_3p = state_data.sort((a, b) => d3.descending(a.threep, b.threep)).slice(0, 10);
        ten_3pa = state_data.sort((a, b) => d3.descending(a.threepa, b.threepa)).slice(0, 10);
        ten_ft = state_data.sort((a, b) => d3.descending(a.ft, b.ft)).slice(0, 10);
        ten_fta = state_data.sort((a, b) => d3.descending(a.fta, b.fta)).slice(0, 10);
        ten_to = state_data.sort((a, b) => d3.descending(a.to, b.to)).slice(0, 10);
        ten_pf = state_data.sort((a, b) => d3.descending(a.pf, b.pf)).slice(0, 10);
        ten_list = [ten_gp, ten_pts, ten_reb, ten_assists, ten_blocks, ten_stl, ten_fg, ten_fga, ten_3p, ten_3pa, ten_ft, ten_fta, ten_to, ten_pf]
        header_list = ['Games Played', 'Points', 'Rebounds', 'Assists', 'Blocks', 'Steals', 'FG Made', 'FG Attempts', '3P Made', '3P Attempt', 'FT Made', 'FT Attempts', 'Turnovers', 'Personal Fouls']
        stat_list = ['gp', 'pts', 'trb', 'ast', 'blk', 'stl', 'fg', 'fga', 'threep', 'threepa', 'ft', 'fta', 'to', 'pf']

        for (i = 0; i < ten_list.length; i++) {
            topTenChart.append('div').text(header_list[i]).attr("class", "card mn-auto card bg-light mb-3").attr("id", `${stat_list[i]}-list`).attr("style", "width: 4%;")
            let stats_list = d3.select(`#${stat_list[i]}-list`)
            for (j = 0; j < ten_list[i].length; j++) {
                stats_list.append('a')
                    .text(`${j + 1}. ${ten_list[i][j].name} ${ten_list[i][j][stat_list[i]].toLocaleString()}`)
                    .attr("href", ten_list[i][j].url);

                stats_list.append('ul').text(`${ten_list[i][j].city}, ${ten_list[i][j].state}`)
            }
        };
    });

}

// in Init 
// Top five cities
function topFiveCities(state_abbrev) {
    // console.log(`Players born in ${state}, ${era}`);
    json_data.then((data) => {

        if (era == 'Before Integration (<1950)') {
            era_data = data.filter(result => result.birthyear < 1950);
            console.log(era_data)
        } else if (era == 'After Integration (>=1950)') {
            era_data = data.filter(result => result.birthyear > 1949);
            console.log(era_data)
        } else if (era == 'Before MJ Debut (<1985)') {
            era_data = data.filter(result => result.birthyear < 1985);
            console.log(era_data)
        } else if ( era == 'After MJ Debut (>=1985)') {
            era_data = data.filter(result => result.birthyear >= 1985);
            console.log(era_data)
        } else {
            era_data = data;
            console.log(era_data);
        }

        if (state_abbrev != 'ALL STATES') {
            state_data = era_data.filter(result => result.state == state_abbrev);
        }
        else {
            state_data = era_data;
        }
        city_count = d3.group(state_data, d => d.city)
        top_cities = d3.sort(city_count, (a, b) => d3.descending(a[1], b[1]))
        top_five_cities = Array.from(top_cities).slice(0, 5);
        console.log(top_five_cities)

        for (i = 0; i < top_five_cities.length; i++) {
            displayCities.append('ul').text(`${i + 1}. ${top_five_cities[i][0].replace('_', ' ')}, ${top_five_cities[i][1][0].state} (${top_five_cities[i][1].length}) `)
        }

    })
}

// Update page when a new id is selected
function optionChanged(new_state) {


    if (new_state instanceof Event) {

    }
    else {
        state = new_state;
        console.log(`Players born in ${state}, ${era}`);
        // Clear Tables before refilli
        
        displayCities.html('');
        topTenChart.html('');
        // initMap(state);
        topFiveCities(new_state);
        topTenCharts(new_state);

    }

}

function eraChanged(new_era) {
    
    if (new_era instanceof Event) {

    }
    else { 
        era = new_era
        console.log(`Players born in ${state}, ${era}`);
        // Clear Tables before refilli
        
        displayCities.html('');
        topTenChart.html('');
        initMap(state);
        topFiveCities(state);
        topTenCharts(state);

    }

}

init();
