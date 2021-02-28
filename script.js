/*document.getElementById("coinlist").appendChild( {
	console.log("sup");
	const url = "api.coingecko.com/api/v3/coins/list";
	fetch(url)
		.then(function(response) {
			return response.json();
		}).then(function(json) {
			console.log(json);
		});

});*/
function  makeCryptoList() {
	let list = "";
        //const url = "http://api.coingecko.com/api/v3/coins/list";
	const url = "https://api.coingecko.com/api/v3/coins/list?include_platform=false";
        //const url = "http://api.openweathermap.org/data/2.5/weather?q=" + "highland" + ",US&units=imperial" + "&APPID=fcfa69a0c6aa7bb1c2af70cf7f86876c";
	//fetch(url, {mode: '*cors'})
	fetch(url)
		.then(function(response) {
			console.log("nope");
			return response.json();
		}).then(function(json) {
			console.log(json);
			list += '<div class="list_container">';
			list += '<h2>Enter a cryptocurrency id from this list into the search bar</h2>';
			list += '<ul class="crypt_list">';
			for (let i = 1; i < json.length; i++) {
				list += "<li>";
				let cname = json[i].name;
				let cid = json[i].id;
				list += cname
				if (cname != cid) list += ' (' + cid + ')';
				list += "</li>";
			}
			list += "</ul>";
			list += "</div>";
			document.querySelector("#coinlist").innerHTML = list;
		});
	//return createTextNode("bruh");
	return "";
}

document.querySelector("#coinlist").innerHTML = makeCryptoList();

document.getElementById("coinSubmit").addEventListener("click", function(event) {
	event.preventDefault();
	const value = document.getElementById("coinInput").value.toLowerCase();
	if (value === "")
		return;
	console.log(value);
	const url = "https://api.coingecko.com/api/v3/coins/" + value + "?localization=false";
	fetch(url)
		.then(function(response) {
			return response.json();
		}).then(function(json) {
			console.log(json);
			let results = "";
			results += '<div class="container">';
			results += '<div class="heading">';
			results += '<h2 class="subtitle">' + json.name + " (" + json.symbol + ')</h2>';
			results += '<img src=' + json.image.small + '/>';
			results += '</div>';
			results += '<p class="block">' + json.description.en + '</p>';
			let cost = json.market_data.current_price.usd;
			results += '<p class="block">Value (USD): $' + json.market_data.current_price.usd + '</p>';
			let change24h = json.market_data.price_change_24h_in_currency.usd;
			let change7d = cost - cost*100/(100 + json.market_data.price_change_percentage_7d_in_currency.usd);
			if (change24h > 0) results += '<p class="positive">+ $' + change24h + ' (24 hours)</p>';
			else results += '<p class="negative">- $' + (-1*change24h) + ' (24 hours)</p>';
			if (change7d > 0) results += '<p class="positive">+ $' + change7d + ' (7 days)</p>';
                        else results += '<p class="negative">- $' + (-1*change7d) + ' (7 days)</p>';
			results += '</div>';
			document.getElementById("coinResults").innerHTML = results;
		});
	const url2 = "https://api.coingecko.com/api/v3/coins/" + value + "/market_chart?vs_currency=usd&days=7"
	fetch(url2)
	.then(function(response) {
		return response.json();
	}).then(function(json) {
		console.log(json);
		let data = json.prices;
		let chart = ""
		const xdat = [];
		const ydat = [];
		let lowest = data[0][0];
		let highest = data[data.length-1][0] - lowest
		for (let i = 0; i < data.length; i++) {
			xdat.push((data[i][0]-lowest)*7/highest - 7);
			ydat.push(data[i][1]);
		}
		var trace = {x: xdat, y: ydat, type: 'scatter'};
		var layout = {title: "7-Day History",
			xaxis: {title:"Days"},
			yaxis: {title: "$"}};
		let newimg = Plotly.newPlot('coinChart', [trace], layout);
	});
});
