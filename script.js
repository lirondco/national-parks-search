const apiKey = "0jj5kgIuzydNMXkVeAE0Bqfgcw4SwwSdONCf7cyV";
const baseUrl = "https://developer.nps.gov/api/v1/parks";

// le format de l'URL 
//  https://developer.nps.gov/api/v1/parks?stateCode=ca&stateCode=co&limit=10&api_key=0jj5kgIuzydNMXkVeAE0Bqfgcw4SwwSdONCf7cyV
// "https://developer.nps.gov/api/v1/parks?stateCode=ca&stateCode=co&limit=10&api_key=0jj5kgIuzydNMXkVeAE0Bqfgcw4SwwSdONCf7cyV"
const getResults = function (states, max) {
    const statesArr = states.split(',');
    let stateCodesStr = `stateCode=${statesArr.join().trim().toLowerCase()}&`;
    let maxStr = `limit=${max}&`;
    let resultsArr = [];
    //for (let i = 0; i < statesArr.length; i++) {
     //   stateCodesStr += `stateCode=${statesArr[i].trim().toLowerCase()}&`
        
    let searchURL = `${baseUrl}?${stateCodesStr}${maxStr}api_key=${apiKey}`
        fetch(searchURL, {
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error (response.statusText);
        }).then((json)=> {
            for (let i = 0; i < json.data.length; i++) {
                resultsArr.push({['fullname']: json.data[i].fullName,
                                ['description']: json.data[i].description,
                                ['link']: json.data[i].url,
                                ['address']: json.data[i].addresses})
            }
            displayResults(resultsArr);
            console.log(resultsArr)
        }).catch(err=> {
            $('#error-message').text(`uh oh. something went wrong! ${err.message}`)
        })
    }

const displayResults = function(array) {
    $('#results').empty();
   for (i = 0; i < array.length; i++) {
       $('#results').append(
         `<ul>
         <li><p>Name: ${array[i].fullname}</p>
            <p>Description: ${array[i].description}</p>
            <p>Website: <a href="${array[i].link}">${array[i].link}</a></p>
            <p>Physical Address: <p>${array[i].address[0].line1}\n${array[i].address[0].city}, ${array[i].address[0].stateCode} ${array[i].address[0].postalCode}</p></p>
            <p>Mailing Address: <p>${array[i].address[1].line1}\n${array[i].address[1].city}, ${array[i].address[1].stateCode} ${array[i].address[1].postalCode}</p></p>                        
         </ul><hr>`
       )
   }       
}


const handleSubmit = function () {
    $('.search-form').submit(event => {
        event.preventDefault();
        const states = $('#search-parks').val();
        const maxResults = parseInt($('#results-total').val());
        getResults(states, maxResults);

    })
}
const main = function () {
    handleSubmit()
}

$(main);