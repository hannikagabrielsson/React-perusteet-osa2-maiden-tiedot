import { useState, useEffect } from 'react';
import {
getAllCountries as getAllCountries
//  showCountry as showCountry,
} from './countries/manageCountries.js';
import { getWeatherForCapital } from './countries/manageCountries.js';


const Filter = ({handleFilter, filterInput}) => {
return (
  <div>
       <label>Find countries </label>
       <input
         type="text"
         value={filterInput}
         onChange={handleFilter}
       />
   </div>
)
}

const Country = ({ chosenCountries, howManyMatch, languages, capital, area, flag, onClickShow, clicked, weather}) => {

  console.log("This is Languages:", languages);
// jos filtteröityjen maiden lukumäärä on suurempi kuin 10
  if (howManyMatch > 10){
    return (
      <>
        <p>Too many matches. Specify another filter.</p>
      </>
    )
  }

  // jos filtteröityjen maiden lukumäärä on pienempi tai yhtäsuuri kuin 10
  else if (howManyMatch <= 10 && howManyMatch > 1)
  {
    if (!clicked) {
    return (   
      <>
        <ul>
          {chosenCountries.map((country, index) => (
            <li key={index}>{ country } 
            <button onClick={() => onClickShow(country)}>show</button>

            </li>
          ))}
        </ul>
      </>
    )
  }
  }
  else if (howManyMatch === 1) {
    console.log("language ", chosenCountries.language)
    console.log("area ", chosenCountries.area)
    console.log("capital", chosenCountries.capital)
    return (
      <>
        {chosenCountries.map((country, index) => (
          <CountryInfo 
            key={index} 
            chosenCountries={chosenCountries} 
            languages={languages} 
            capital={capital} 
            area={area} 
            flag={flag} 
            country={country}
            weather={weather}/>
        ))}
      </>
    )
  }
}

const CountryInfo = ({chosenCountries, languages, capital, area, flag, weather}) => {
  return (
    <>
      {chosenCountries.map((country, index) => (
        <div key={index}>
          <h1>{country}</h1>
          <p>capital {capital}</p>
          <p>area {area}</p>
          <h4><strong>Languages:</strong></h4>
          <ul>
            {languages.map((language, languageIndex) => (
              <li key={languageIndex}>{language}</li>
            ))}
          </ul>
          <img src={flag} alt="Flag" />
          <h2>Weather in {capital}</h2>
           <p>Temperature: {weather.temperature} Celcius</p>
           <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt="Weather Icon" />
          <p>Wind: {weather.windSpeed} m/s</p>
        </div>
      ))}

    </>
  );
}

const ClickedInfo = ({clicked, languages}) => {
  if (clicked) {
    console.log("Comes here.")
    return (
      <div>
        <h1>{clicked.name.common}</h1>
        <p>capital {clicked.capital}</p>
        <p>area {clicked.area}</p>
        <h4><strong>Languages:</strong></h4>
        <ul>
        {languages.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
        <img src={clicked.flags.png} alt="Flag" />
      </div>
    );
  }
}


const App = () => {

const [countries, setCountries] = useState([]);
const [chosenCountries, setChosenCountries] = useState([]);
const [filterInput, setFilterInput] = useState("");
const [loading, setLoading] = useState(false);
const [howManyMatch, setHowManyMatch] = useState(0);
const [languages, setLanguages] = useState([]);
const [capital, setCapital] = useState([]);
const [area, setArea] = useState(0);
const [flag, setFlag] = useState("");
const [clickedCountry, setClickedCountry] = useState("");
const [showClickedInfo, setShowClickedInfo] = useState(false);
const [weather, setWeather] = useState({ temperature: null, windSpeed: null });
 
useEffect(() => {
 setLoading(true);
 getAllCountries()
   .then((countries) => {
     setCountries(countries);
     setLoading(false);
    //  console.log("first country: ", countries[0].name);
   })
   .catch(error => console.log("Error fetching countries: ", error));

},[]);

// Lukee hakutiedon
const handleFilter = (event) => {
 setFilterInput(event.target.value);
 console.log("handleFilter event: " + event.target.value)
}
console.log("filterInput: " + filterInput);


const api_key = import.meta.env.VITE_API_KEY
// muuttujassa api_key on nyt käynnistyksessä annettu API-avaimen arvo




const displayCountries = () => {
  
  console.log("Displaying countries")
  // // Listaa Apissa olevien maiden nimet
// const countriesOnApp = countries.map(country => country.name.common);
// console.log(countriesOnApp)

// // Tarkastaa, onko käyttäjän syöttämää merkkijonoa vastaavaa maata maiden nimien listalla
// const countriesMatch= countries.map(country => country.name.common.toLowerCase()).includes(filterInput.toLowerCase());

// Tarkistaa, onko filterInputin merkkijonoa vastaavaa maata
// maiden nimien listalla
const countriesIncludes = filterInput.trim() !== '' && countries.some(country =>
  country.name.common.toLowerCase().includes(filterInput.toLowerCase())
);

// Tallentaa muuttujaan maat,jotka vastaavat filterInputia
const countriesMatchingFilter = countries.filter(country => 
  country.name.common.toLowerCase().includes(filterInput.toLowerCase())
);
console.log("countries matching filter" + countriesMatchingFilter)
// console.log("countriesIncludes: " + countriesIncludes)

  if (countriesIncludes && filterInput != "") {
    // console.log("Countries matching filter:", countriesMatchingFilter.map(country => country.name.common));

    setHowManyMatch(countriesMatchingFilter.length);
    // setHowManyMatch(countriesMatchingFilter.map(country => country.name.common).length);
    console.log("how many match: " + howManyMatch)
    setChosenCountries(countriesMatchingFilter.map(country => country.name.common));

    setCapital(countriesMatchingFilter.map(country => country.capital))
    console.log("Capital is " + capital)

    setArea(countriesMatchingFilter.map(country => country.area))

    const flags = countriesMatchingFilter.map(country => country. flags.png).filter(flag => flag !== undefined);
    setFlag(flags);
    
    

  // jos filteriä vastaavia maita on yli 0 
  if (countriesMatchingFilter.length === 1) {
    
      const capital = countriesMatchingFilter.map(country => country.capital)
      setCapital(capital)
      // setCapital(countriesMatchingFilter.map(country => country.capital))
      console.log("Capital is Here " + capital)

      setArea(countriesMatchingFilter.map(country => country.area))

      const flags = countriesMatchingFilter.map(country => country.flags.png).filter(flag => flag !== undefined);
      setFlag(flags);

     

      const countriesWithValidLanguages = countriesMatchingFilter.filter(country => {
        // Check if languages property exists and is an object
     if (country.languages && typeof country.languages === 'object') {
         setLanguages(countriesMatchingFilter.flatMap(country => Object.values(country.languages)));
         return true;
      }
     else {
      console.error(`Invalid languages data for country: ${country.name.common}`);
      return false;
      } 
    })
    
    } else {
      setLanguages([]);
    } 
  }

  else if (!countriesIncludes) {
    setHowManyMatch(0);
    setChosenCountries([]);
    setLanguages([]);
    setCapital([]);
  }
}




useEffect(() => {
  if (capital && capital.length === 1) {

    console.log("This is THE capital: ", capital)
        // Extract the capital city name from the inner array
        const capitalCity = capital[0][0]; // Accessing the first element of the inner array
        console.log("This is CAPITAL CITY: ", capitalCity)
        setLoading(true);
        getWeatherForCapital(capitalCity)
          .then((data) => {
              setWeather(data);
              console.log("this is the Weather: ", data)
              setLoading(false);
          })
          .catch(error => console.log("Error fetching weather: ", error));
  }
}, [capital]);



const onClickShow = (clicked) => {
  console.log("Clicked Country:", clicked);
  
  const countryToShow = countries.find(country => 
    country.name.common.toLowerCase().includes(clicked.toLowerCase())
  );

  console.log("Country to show: ", countryToShow)

 if (countryToShow) {
    // Map the languages array here
    const languages = Object.values(countryToShow.languages);

    // Set the clicked country state along with the mapped languages
    setClickedCountry(countryToShow);
    setLanguages(languages);

    setShowClickedInfo(true);
  

    return (
      <>
        country={clickedCountry}
        languages={clickedCountry.languages}
        capital={clickedCountry.capital}
        area={clickedCountry.area}
        flag={clickedCountry.flag}
      </>
    )
  }
  else {
    setClickedCountry("")
    setLanguages([])
  }
}



// Reset state if filterInput is changed
useEffect(() => {
  setShowClickedInfo(false);
  setClickedCountry("");
  setLanguages([]);
}, [filterInput]);

useEffect(() => {
  console.log("chosenCountries:", chosenCountries);
}, [chosenCountries]);


useEffect(() => {
  displayCountries();
}, [countries, filterInput]);


return (
  <>
    <Filter
      filterInput={filterInput}
      setFilterInput={setFilterInput}
      handleFilter={handleFilter}
    />

   <Country 
   chosenCountries={chosenCountries}
   howManyMatch={howManyMatch}
   languages={languages}
   capital= {capital}
   area= {area}
   flag={flag}
   onClickShow={onClickShow}
   clicked={clickedCountry}
   weather={weather}
   />

   {showClickedInfo && (
   <ClickedInfo 
   clicked={clickedCountry}
   capital= {capital}
   area= {area}
   flag={flag}
   languages={languages}
   />
   )}
  </>
)

}

export default App