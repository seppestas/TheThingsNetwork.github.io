// constants
var colours = {'PL': '#0000DD', 'AC': '#00DD00',
           'MA': '#80A000', 'DE': '#995555'};
var opacities = {'DE': 0.1, 'PL': 0.2, 'MA': 0.3, 'AC': 0.4};

// helpers
function shadeColor(color, percent) {  
    percent = percent || 10;
    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent);
    var R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000
               + (G<255?G<1?0:G:255)*0x100
               + (B<255?B<1?0:B:255)).toString(16).slice(1);
}


// Drawing functions

function draw_gateways(map, gatewaydump) {
    var gateways = [];
    var statuses = ['DE', 'PL', 'MA', 'AC'];
    // draw most important status last
    for (var si in statuses) {
        for (var g=0; g < gatewaydump.length; g++) {
            var gw = gatewaydump[g].fields;
            if (gw.status == statuses[si]) {
                gateways.push(draw_gateway(map, gw));
            }
        }
    }
    return gateways;
}

function draw_gateway(map, gw) {
    var colour = colours[gw.status] || '#333333';
    var opacity = opacities[gw.status] || 0.5;
    var gw = new google.maps.Circle({
        strokeColor: shadeColor(colour, 20),
        strokeOpacity: opacity,
        strokeWeight: 1,
        fillColor: colour,
        fillOpacity: opacity,
        map: map,
        center: {lat: gw.lat || 0, lng: gw.lon || 0 },
        radius: gw.rng || 5000
    });
    return gw;
}


function draw_communities(map, communitydump) {
    var communities = [];
    for (var i in communitydump) {
        var c = communitydump[i];
        communities.push(draw_community(map, c));
    }
    return communities
}

function draw_community(map, community) {
    console.log(community);
    var c = new google.maps.Circle({
        strokeColor: '#F00',
        strokeOpacity: 0.7,
        strokeWeight: 3,
        fillColor: '#F88',
        fillOpacity: 0.5,
        map: map,
        center: {lat: community.lat || 0, lng: community.lon || 0 },
        radius: Math.log(21 - (community.scale||13)) / Math.LN2 * 25000
    });
    return c;
}
