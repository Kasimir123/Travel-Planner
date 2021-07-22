window.api.send("setCountries", "");

function setCountries(countries) {

    var ul = document.getElementById("country-list");

    ul.innerHTML = "";

    var first = true;

    Object.keys(countries).sort().forEach(function (key, value) {
        var li = document.createElement("li");
        li.textContent = key;

        li.className = "list-item d-flex align-items-center";

        if (first) {
            first = false;
        }
        else {
            li.className += " mt-2";
        }

        var btn = document.createElement('button');

        btn.setAttribute('type', 'button');
        btn.setAttribute('data-bs-toggle', 'modal');
        btn.setAttribute('data-bs-target', '#countryModal');
        btn.setAttribute('country-name', key);
        btn.className = "btn btn-outline-success ms-auto me-2 view-country";
        btn.textContent = "View Country";

        li.appendChild(btn);

        ul.appendChild(li);
    });
}

function setCities(cities) {

    var ul = document.getElementById("city-list");

    ul.innerHTML = "";

    var first = true;

    Object.keys(cities).sort().forEach(function (key, value) {
        var li = document.createElement("li");
        li.textContent = key;

        li.className = "list-item d-flex align-items-center";

        if (first) {
            first = false;
        }
        else {
            li.className += " mt-2";
        }

        var btn = document.createElement('button');

        btn.setAttribute('type', 'button');
        btn.setAttribute('data-bs-toggle', 'modal');
        btn.setAttribute('data-bs-target', '#cityModal');
        btn.setAttribute('city-name', key);
        btn.className = "btn btn-outline-success ms-auto me-2 view-city";
        btn.textContent = "View City";

        li.appendChild(btn);

        ul.appendChild(li);
    });

}

function getAvgLivingCost(city, country, numOfPeople) {

    var avgCost = document.getElementById('avg-housing-cost');

    avgCost.value = "Loading...";

    var totalCost = 0;
    var totalCount = 0;
    var lowest = 0;
    var highest = 0;

    $.ajax({
        url: 'https://www.airbnb.com/s/' + city + '--' + country + '/homes?refinement_paths%5B%5D=%2Fhomes&date_picker_type=flexible_dates&search_type=filter_change&tab_id=home_tab&flexible_trip_lengths%5B%5D=one_month&adults=' + numOfPeople + '&source=structured_search_input_header',
        success: function (data) {
            var jsonData = JSON.parse(new DOMParser().parseFromString(data, "text/html").getElementById('data-deferred-state').innerHTML).niobeMinimalClientData[1][1].data.dora.exploreV3.sections;

            jsonData = jsonData[jsonData.length - 1].items;


            jsonData.forEach(item => {
                var price = parseInt(item.pricingQuote.price.total.amount);

                if (lowest == 0 || price < lowest) lowest = price;
                if (highest == 0 || price > highest) highest = price;

                totalCost += price
                totalCount += 1;
            });

            avgCost.value = (totalCost / totalCount);
            avgCost.setAttribute('lowest-price', lowest);
            avgCost.setAttribute('highest-price', highest);

        }
    });
}

function createPopover(obj, msg) {
    obj.popover({
        placement: 'bottom',
        trigger: 'hover focus',
        html: true,
        title: "Cost Breakdown",
        content: msg
    });
    obj.popover('show');
}

function parsePriceItem(item)
{
    var tds = item.getElementsByTagName('td');

    var name = tds[0].textContent;
    var averagePrice = tds[1].getElementsByTagName('span')[0].textContent.replace("$", "").trim();
    var lowPrice = tds[2].getElementsByTagName('span')[0].textContent.replace("\n", "");
    var highPrice = tds[2].getElementsByTagName('span')[5].textContent;

    return [name, averagePrice, lowPrice, highPrice];
}

window.api.receive("updateCountries", (data) => {
    setCountries(data.countries);
});

window.api.receive("setCountries", (data) => {
    setCountries(data.countries);
});

window.api.receive("updateCities", (data) => {
    setCities(data.cities);
});

window.api.receive("setCities", (data) => {
    setCities(data.cities);
});

window.api.receive("getCountries", (data) => {
    document.getElementById("country-select").innerHTML = data;
});

window.api.receive("getCities", (data) => {
    document.getElementById("city-select").innerHTML = data;
});

window.api.receive("getCostOfliving", (data) => {
    document.getElementById('cost-of-living-index').value = data[3];
    document.getElementById('groceries-index').value = data[6];
    document.getElementById('restaurant-price-index').value = data[7];

    console.log();

    $.ajax({
        url: data[2] + '?displayCurrency=USD',
        success: function (data) {
            var items = new DOMParser().parseFromString(data, "text/html").getElementsByClassName('new_bar_table')[0].getElementsByTagName('tbody')[0].children;
    
            var restaurantCosts = document.getElementById('restaurant-costs');
            var marketCosts = document.getElementById('market-costs');
            var transportationCosts = document.getElementById('transportation-costs');

            restaurantCosts.innerHTML = ('<div class="row mt-3"><div class="col-12"><label class="form-label"><strong>Restaurant Costs</strong></label></div></div><div class="row mt-1"><div class="col-6"><label class="form-label">Item</label></div><div class="col-2"><label class="form-label">Average</label></div><div class="col-2"><label class="form-label">Lowest</label></div><div class="col-2"><label class="form-label">Highest</label></div></div>');
            marketCosts.innerHTML = ('<div class="row mt-3"><div class="col-12"><label class="form-label"><strong>Market Costs</strong></label></div></div><div class="row mt-1"><div class="col-6"><label class="form-label">Item</label></div><div class="col-2"><label class="form-label">Average</label></div><div class="col-2"><label class="form-label">Lowest</label></div><div class="col-2"><label class="form-label">Highest</label></div></div>');
            transportationCosts.innerHTML = ('<div class="row mt-3"><div class="col-12"><label class="form-label"><strong>Transportation Costs</strong></label></div></div><div class="row mt-1"><div class="col-6"><label class="form-label">Item</label></div><div class="col-2"><label class="form-label">Average</label></div><div class="col-2"><label class="form-label">Lowest</label></div><div class="col-2"><label class="form-label">Highest</label></div></div>');

            for (let i = 1; i <= 8; i++)
            {
                var parsedItem = parsePriceItem(items[i]);

                var row = document.createElement('div');
                var name = document.createElement('div');
                var avg = document.createElement('div');
                var low = document.createElement('div');
                var high = document.createElement('div');

                row.className = "row mt-1 blurred-back";
                name.className = "col-6";
                avg.className = "col-2";
                low.className = "col-2";
                high.className = "col-2";

                name.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="' + parsedItem[0] +'" disabled></div>');
                avg.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="$' + parsedItem[1] +'" disabled></div>');
                low.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="$' + parsedItem[2] +'" disabled></div>');
                high.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="$' + parsedItem[3] +'" disabled></div>');

                row.appendChild(name);
                row.appendChild(avg);
                row.appendChild(low);
                row.appendChild(high);

                restaurantCosts.appendChild(row);

            }

            for (let i = 10; i <= 27; i++)
            {
                var parsedItem = parsePriceItem(items[i]);

                var row = document.createElement('div');
                var name = document.createElement('div');
                var avg = document.createElement('div');
                var low = document.createElement('div');
                var high = document.createElement('div');

                row.className = "row mt-1 blurred-back";
                name.className = "col-6";
                avg.className = "col-2";
                low.className = "col-2";
                high.className = "col-2";

                name.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="' + parsedItem[0] +'" disabled></div>');
                avg.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="$' + parsedItem[1] +'" disabled></div>');
                low.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="$' + parsedItem[2] +'" disabled></div>');
                high.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="$' + parsedItem[3] +'" disabled></div>');

                row.appendChild(name);
                row.appendChild(avg);
                row.appendChild(low);
                row.appendChild(high);

                marketCosts.appendChild(row);

            }

            for (let i = 30; i <= 35; i++)
            {
                var parsedItem = parsePriceItem(items[i]);

                var row = document.createElement('div');
                var name = document.createElement('div');
                var avg = document.createElement('div');
                var low = document.createElement('div');
                var high = document.createElement('div');

                row.className = "row mt-1 blurred-back";
                name.className = "col-6";
                avg.className = "col-2";
                low.className = "col-2";
                high.className = "col-2";

                name.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="' + parsedItem[0] +'" disabled></div>');
                avg.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="$' + parsedItem[1] +'" disabled></div>');
                low.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="$' + parsedItem[2] +'" disabled></div>');
                high.innerHTML = ('<input type="text" class="form-control cost-item ms-0 ps-0" value="$' + parsedItem[3] +'" disabled></div>');

                row.appendChild(name);
                row.appendChild(avg);
                row.appendChild(low);
                row.appendChild(high);

                transportationCosts.appendChild(row);

            }
    
        }
    });
});

window.api.send("getCountries", "");

$('body').on('click', '#add-country', function () {
    window.api.send("updateCountries", document.getElementById("country-select").value);
});

$('body').on('click', '#add-city', function () {
    console.log([document.getElementById('country-name').textContent, document.getElementById("city-select").value]);
    window.api.send("updateCities", [document.getElementById('country-name').textContent, document.getElementById("city-select").value]);
});

$('body').on('click', '.view-country', function () {
    var country = $(this).attr('country-name');
    document.getElementById('country-name').textContent = country;
    window.api.send("getCities", country);
    window.api.send("setCities", country);
});

$('body').on('click', '.view-city', function () {
    var city = $(this).attr('city-name');
    var country = document.getElementById('country-name').textContent;
    document.getElementById('city-name').textContent = city;
    document.getElementById('num-of-people').value = 1;

    document.getElementById('restaurant-costs').innerHTML = '';
    document.getElementById('market-costs').innerHTML = '';
    document.getElementById('transportation-costs').innerHTML = '';
    document.getElementById('cost-of-living-index').value = "Unavailable";
    document.getElementById('groceries-index').value = "Unavailable";
    document.getElementById('restaurant-price-index').value = "Unavailable";

    getAvgLivingCost(city, country, 1);
    
    window.api.send("getCostOfliving", [city, country]);

});

$('body').on('change', '#num-of-people', function () {

    getAvgLivingCost(document.getElementById('city-name').textContent, document.getElementById('country-name').textContent, $(this)[0].value);
});

$('body').on('mouseenter', '#avg-housing-cost', function () {
    createPopover($(this), "Lowest $: " + $(this).attr('lowest-price') + "<br>Highest $: " + $(this).attr('highest-price'));
});

$('body').on('mouseleave', '.disabledPopover', function () {
    $(this).popover('dispose');
});


$.ajax({
    url: 'https://www.numbeo.com/cost-of-living/rankings_current.jsp',
    success: function (data) {
        var items = new DOMParser().parseFromString(data, "text/html").getElementById('t2').getElementsByTagName('tbody')[0].children;

        var cities = [];

        for (let i = 0; i < items.length; i++) {

            var item = items[i];
            var name = item.getElementsByClassName('discreet_link')[0].textContent;
            var link = item.getElementsByClassName('discreet_link')[0].href;
            var tds = item.getElementsByTagName('td');

            cities.push([name.split(',')[0].toLowerCase().trim(), name.split(',')[name.split(',').length - 1].toLowerCase().trim(), link, tds[2].textContent, 
                tds[3].textContent, tds[4].textContent, tds[5].textContent, tds[6].textContent, tds[7].textContent]);
        }

        window.api.send("setCostOfliving", cities);

    }
});