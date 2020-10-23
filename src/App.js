import React,{useState, useEffect} from 'react';
import {MenuItem, FormControl,CardContent, Select, Card, Typography} from '@material-ui/core' ;
import { ThemeProvider,createMuiTheme } from '@material-ui/core/styles';

import './App.css';
import InfoBox from './InfoBox'
import Map from './Map'
import DarkModeToggle from "react-dark-mode-toggle";
import Table from './Table'
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";



function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo]=useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = 
  useState({lat: 34.80746, lng:-40.4796})
  const [mapZoom, setMapZoom]=useState(3);
  const [mapCountries, setMapCountries]=useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [isDarkMode, setIsDarkMode] = useState(() => true);


  const theme=createMuiTheme({
    palette:{
      type:isDarkMode? "dark" : "light"
    }
  })

 

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  },[])

  useEffect(()=>{
    const getCountriesData = async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso3,
          }
        ));
          
        const sortedData= sortData(data)
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);

      });
    };
    getCountriesData();
  },[])

  const onCountryChange = async (event) =>{
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode ==='worldwide' 
    ? 'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data=>{
      setCountry(countryCode);

      setCountryInfo(data);
      countryCode!=="worldwide" &&
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4)
    })

  }

  return (
    <ThemeProvider theme={theme}>

    <div className={isDarkMode ? "app darkMode" : "app"}>

      <div className="app__left">
          <div className="app__header">
          <h1 className={isDarkMode ? "darkHeader" : "lightHeader"}>Covid-19 Tracker</h1>
          <DarkModeToggle
            onChange={()=>setIsDarkMode(!isDarkMode)}
            checked={isDarkMode}
            size={80}
          />
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country)=>(
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          </div>


            <div className="app__stats">
                <InfoBox
                 isRed
                 title="Cases"
                 active={casesType==="cases"}
                 onClick={e=>setCasesType('cases')}
                 cases={prettyPrintStat(countryInfo.todayCases) } 
                 total={countryInfo.cases}/>
                
                <InfoBox 
                 title="Recovered"
                 active={casesType==="recovered"}
                 onClick={e=>setCasesType('recovered')}
                 cases={prettyPrintStat(countryInfo.todayRecovered)} 
                 total={countryInfo.recovered}/>
                
                <InfoBox
                 isRed
                 active={casesType==="deaths"}
                 title="Deaths" 
                 onClick={e=>setCasesType('deaths')}
                cases={prettyPrintStat(countryInfo.todayDeaths)} 
                total={countryInfo.deaths}/>
            </div>

              <Map
                casesType={casesType}
                countries={mapCountries}
                center={mapCenter}
                zoom={mapZoom}
              />
             

          </div>
      <Card className="app__right"> 
          <CardContent>
            <h3>Live Cases by country</h3>
            <Table countries={tableData}/>
            
            <br/>

            <br/>

            <h3 className="app__graphTitle">Worldwide new  {casesType}</h3>
            <br/>
            <LineGraph 
            
              className="app_graph"
              casesType={casesType}
            />
          </CardContent>
      </Card>


      
              
      </div>
      <footer >
        
        <div className={isDarkMode ? "favicon footerDark" : "favicon footerLight"}>
          
        <a href="https://www.linkedin.com/in/animesh-katigar-2471141a4/"><i class="fab fa-linkedin"></i></a>
        <a href="https://github.com/AnimeshKatigar"><i class="fab fa-github"></i></a> 
        <a href="https://www.instagram.com/anony.mesh/"><i class="fab fa-instagram"></i></a>

        </div>

        <div className={isDarkMode ? "footer footerDark" : "footer footerLight"}>
        Animesh Katigar © {(new Date().getFullYear())} 

        </div>
      </footer>
      </ThemeProvider>

     
  );
}

export default App;
