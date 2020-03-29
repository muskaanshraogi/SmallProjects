const requests = require('requests');

const findWeather = (location) => {
    return new Promise((resolve, reject) => {

        const locationURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(location) + '.json?limit=1&access_token=pk.eyJ1IjoibXVza2FhbnNocmFvZ2kiLCJhIjoiY2s4MzRlb3A0MDZndTNmb2RheTJqdDRxZiJ9.vdRRy-2yKWysA26SIihYOg'

        requests(locationURL)
        .on('data', (chunk) => {
            const data = JSON.parse(chunk)
            if(data.features.length) {
                const place = data.features[0].place_name 
                const lat = data.features[0].center[1]
                const long = data.features[0].center[0]
                const weatherURL = 'https://api.darksky.net/forecast/da59f9f2bf0aecc110d87f4550266f2e/' + lat + ',' + long + '?units=si'
    
                requests(weatherURL)
                .on('data', (chunk) => {
                    const report = JSON.parse(chunk)
                    resolve ({
                        place: place,
                        temp: report.currently.temperature,
                        summary: report.daily.summary,
                        icon: report.daily.icon,
                        view: true
                    })
                })
                .on('end', (error) => {
                    if(error) {
                        resolve ({
                            error: "Connection lost."
                        })
                    }
                })
            }
            else {
                resolve ({
                    error: "No results found. Try another search."
                })
            }
        })
        .on('end', (error) => {
            if(error) {
                resolve ({
                    error: "Connection lost."
                })
            }
        })
    })

    
}

module.exports = findWeather;