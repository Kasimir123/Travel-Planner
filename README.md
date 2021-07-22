# Travel Planner

## Purpose of the Project

This is a personal project meant to help me plan out my travels after I graduate. I decided to write this with electron so I could get some experience in a framework I wouldn't normally have a chance to use.

## Features

### Main View

- Displays all countries you have selected to visit
- Select from a list of countries and regions to add to your list

![Main View](https://github.com/Kasimir123/Travel-Planner/blob/photos/photos/main-screen.png?raw=true)

### Country View

- Displays all cities you have added to your list
- Select from cities within the country to add to your list

![Country View](https://github.com/Kasimir123/Travel-Planner/blob/photos/photos/country-view.png?raw=true)

### City View

- Queries data from airbnb for average rental cost in the city
    - Queries costs for 1 month at a time
    - Quries the next two months
    - Averages all costs, stores highest and lowest cost viewable in a popover
    - Will update based on the number of people selected
- Queries current cost of living data from Numbeo
    - Index Display:
        - Cost of living index
        - Groceries index
        - Restaurant price index
    - Restaurant Costs:
        - Displays average, low, and high prices for restaurants in the area
    - Market Costs:
        - Displays average, low, and high prices for markets in the area
    - Transportation Costs:
        - Displays average, low, and high prices for transportation costs in the area

![City View](https://github.com/Kasimir123/Travel-Planner/blob/photos/photos/city-view.png?raw=true)
![Cost Breakdown](https://github.com/Kasimir123/Travel-Planner/blob/photos/photos/cost-breakdown.png?raw=true)

### Persistence

- Saves data locally in data.json

### Responsive Design

- All components in the application scale with the application to provide a seamless user experience

## Installation

```bash
# Go into the root directory
cd Travel-Planner

# Install dependencies
npm install

# Install Electron
npm i -g electron

# Install bower
npm install -g bower

# Install Bootstrap
bower install bootstrap

# Install Jquery
bower install jquery

# Run the app
npm start
```