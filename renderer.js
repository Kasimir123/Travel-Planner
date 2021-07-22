window.api.send("setCountries", "");

function setCountries(countries)
{

    var ul = document.getElementById("country-list");

    ul.innerHTML = "";

    var first = true;

    Object.keys(countries).sort().forEach(function(key, value) {
        var li = document.createElement("li");
        li.textContent = key;

        li.className = "list-item d-flex align-items-center";

        if (first)
        {
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

function setCities(cities)
{

    var ul = document.getElementById("city-list");

    ul.innerHTML = "";

    var first = true;

    Object.keys(cities).sort().forEach(function(key, value) {
        var li = document.createElement("li");
        li.textContent = key;

        li.className = "list-item d-flex align-items-center";

        if (first)
        {
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

function getAvgLivingCost(city, country, numOfPeople)
{

    var avgCost = document.getElementById('avg-housing-cost');

    avgCost.value = "Loading...";

    var totalCost = 0;
    var totalCount = 0;
    var lowest = 0;
    var highest = 0;

    $.ajax({ url: 'https://www.airbnb.com/s/' + city + '--' + country + '/homes?refinement_paths%5B%5D=%2Fhomes&date_picker_type=flexible_dates&search_type=filter_change&tab_id=home_tab&flexible_trip_lengths%5B%5D=one_month&adults=' + numOfPeople + '&source=structured_search_input_header', 
    success: function(data) {
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

    }});
}

function createPopover(obj, msg)
{
    obj.popover({
        placement: 'bottom',
        trigger: 'hover focus',
        html: true,
        title: "Cost Breakdown",
        content: msg
    });
    obj.popover('show');
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

window.api.send("getCountries", "");

$('body').on('click', '#add-country', function() {
    window.api.send("updateCountries", document.getElementById("country-select").value);
});

$('body').on('click', '#add-city', function() {
    console.log([document.getElementById('country-name').textContent, document.getElementById("city-select").value]);
    window.api.send("updateCities", [document.getElementById('country-name').textContent, document.getElementById("city-select").value]);
});

$('body').on('click', '.view-country', function() {
    var country = $(this).attr('country-name');
    document.getElementById('country-name').textContent = country;
    window.api.send("getCities", country);
    window.api.send("setCities", country);
});

$('body').on('click', '.view-city', function() {
    var city = $(this).attr('city-name');
    var country = document.getElementById('country-name').textContent;
    document.getElementById('city-name').textContent = city;
    document.getElementById('num-of-people').value = 1;

    getAvgLivingCost(city, country, 1);
    
});

$('body').on('change', '#num-of-people', function() {

    getAvgLivingCost(document.getElementById('city-name').textContent, document.getElementById('country-name').textContent, $(this)[0].value);
});

$('body').on('mouseenter', '#avg-housing-cost', function() {
    createPopover($(this), "Lowest $: " + $(this).attr('lowest-price') + "<br>Highest $: " + $(this).attr('highest-price'));
});

$('body').on('mouseleave', '.disabledPopover', function() {
    $(this).popover('dispose');
});