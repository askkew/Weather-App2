import React, {useState, useEffect} from 'react'
import { Card, CardActions, CardContent, Button, Typography, Box, Grid, TextField, Divider } from '@mui/material';
import { styled } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Weatherbutton from '../buttons/weatherbutton';
import Settingsbutton from '../buttons/settingsbutton';
import Forecastbutton from '../buttons/forecastbutton';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import moment from 'moment';
import axios from 'axios';


const Searcharea = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
})

const Submitbutton = styled(Button)({
    height: 55,
    marginLeft: 2,
    color: 'white',
    backgroundColor: 'rgb(108,168,255)'
})

const Primarycard = styled(Card)({
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    // minHeight: 844,
    // backgroundColor: 'rgb(11,18,47)',
    background: 'transparent',
})

const Locationarea = styled(CardContent)({
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: '89px',
})


const Locationgrid = styled(Grid) ({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
})

const Weathergrid = styled(Grid) ({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap'
})

const Conditionbox = styled('div')({
    display: 'flex',
    justifyContent: 'left',
    flexDirection: 'row',
    color: 'white',
})

const Forecast = styled(CardContent)({
    //minHeight: '133.39px',
})

const Temperaturearea = styled(CardContent)({
    paddingTop: 0,
    minHeight: '211px',
})

const Weatherdetails = styled(CardContent)({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: '232.56px',
})

const Fourbox = styled(Typography)({
    marginBottom: '5px',
    color: 'lightgrey'
})

const CustomTextField = styled(TextField)({
    root: {
        '& label.Mui-focused': {
          color: 'white',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: 'yellow',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'white',
          },
          '&:hover fieldset': {
            borderColor: 'white',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'yellow',
          },
        },
      },
})

const Mainpage = () => {
    const [data, setData] = useState({})
    const [location, setLocation] = useState('');

    //basic weather data by city name
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=7402bcd03e0b88f6c75855bda3497673`

    //useless
    //const urltwo = `https://api.openweathermap.org/data/3.0/onecall?lat=${data.weather?data.coord?.lat:null}&lon=${data.weather?data.coord?.lon:null}&exclude=hourly,daily&appid=7402bcd03e0b88f6c75855bda3497673`

    //get city location key by name
    //const locationkeyurl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=PJizTO8MMJqt62eaSX2GgHyWiC8zynwp=Jersey%20Village&alias=T`

    //get city 12 hour forecast by location key name
    //const forecasturl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/2110204?apikey=PJizTO8MMJqt62eaSX2GgHyWiC8zynwp`

    const handleSearch = () => {
    axios.get(url)
        .then((response) => { // first data fetch
            const newDataObj = {};
            let nameKey = {};
            if (response?.data) {
                console.log(response.data);
                const { name, weather, main, sys, wind } = response.data;
                newDataObj.name = name;
                newDataObj.weather = weather;
                newDataObj.main = main;
                newDataObj.sys = sys;
                newDataObj.wind = wind;

                nameKey = name;
            } 
            setData(response.data)
            return { newDataObj, nameKey };
        })
        .then(({ newDataObj, nameKey }) => { // second data fetch
            // const newNewDataObj = {};
            let locationKey = {};

            const locationkeyurl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=GkTpopNR6k4CajJOGJpgfkrY86BN80Dp&q=${nameKey}`
            console.log({ newDataObj, nameKey })
            axios.get(locationkeyurl).then((response2) => {
                if (response2?.data) {
                    console.log({response2})
                    const { Key } = response2.data[0];
                    locationKey = Key;
                } 
                return { newDataObj, locationKey };
            })
            .then(({ newDataObj, locationKey }) => { // third data fetch
                const forecasturl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=GkTpopNR6k4CajJOGJpgfkrY86BN80Dp`
                console.log({ newDataObj, locationKey })
                axios.get(forecasturl).then((forecastResponse) => {
                    console.log({ forecastResponse })
                    if (forecastResponse?.data) {

                        newDataObj.forecast = [];
                        forecastResponse.data.forEach((dataPoint, i) => {
                            if (i < 6) {
                                const { DateTime, IsDayLight, Temperature, WeatherIcon } = dataPoint;
                                const { Unit, Value } = Temperature;
                                const forecastPoint = {
                                    DateTime: DateTime,
                                    IsDayLight: IsDayLight,
                                    Temperature: Temperature,
                                    WeatherIcon: WeatherIcon,
                                    Unit: Unit,
                                    Value: Value,
                                }
                                newDataObj.forecast.push(forecastPoint);
                            }
                        });
                    } 
                    setData(newDataObj);
                    console.log({ newDataObj });
                })
            })
        })
    }

    const cityTemp = data.main?.temp;
    const locationName = data?.name;
    const countryName = data?.sys?.country
    const weatherIcon = data?.weather && data?.weather[0]?.icon ? data?.weather[0]?.icon : <AcUnitIcon />;
    const showPage = data?.main;
    const isData = data.main;

    return (
    <Grid container justifyContent="center">
        <Primarycard elevation={0}>
            <CardContent>
                <Searcharea>
                    <CustomTextField
                    id="outlined-basic"
                    label="Enter City Name"
                    variant="outlined"
                    onChange={event => setLocation(event.target.value)}
                    value={location}
                    />
                    <Submitbutton
                    variant="contained"
                    onClick={handleSearch}
                    >
                        Submit
                    </Submitbutton>
                </Searcharea>
                <Divider sx={{paddingBottom: 2}}></Divider>
                <Locationarea>
                    <Grid container spacing={2}>
                        <Locationgrid item xs={9}>
                            <Typography>{isData ? <LocationOnIcon /> : null}</Typography>
                            <Typography color="lightgrey">{locationName ? <Typography sx={{fontSize: '12px'}}>{locationName},  {countryName}</Typography> : null}</Typography>
                        </Locationgrid>
                        <Grid item xs={3}>
                            <Typography variant="h6">{data.weather ? <img style={{ width: 80, height: 80 }} src={(`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`)}></img> : null}</Typography>
                            {/* { Number(currentHour) >= 7 && Number(currentHour) <= 19 ? <WbSunnyIcon sx={{transform: 'scale(2)', float: 'right', color: 'goldenrod'}}/> : <NightsStayIcon sx={{transform: 'scale(2)', float: 'right', color: 'rgb(251, 225, 112)'}}/>} */}
                        </Grid>
                    </Grid>
                </Locationarea>
                <Temperaturearea>
                    <Grid container spacing={2}>
                        <Weathergrid item xs={7}>
                            <Typography>{isData ? <Typography sx={{fontSize: '85px'}}>{Math.round(cityTemp)}°</Typography> : null}</Typography>
                            <Conditionbox>
                                {/* <Typography variant="h6">{data.weather ? <img src={(`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`)}></img> : null}</Typography> */}
                                <Typography variant="h6">{data.weather ? <Typography variant="h6">{data.weather[0].main}</Typography> : null}</Typography>
                            </Conditionbox>
                            <Typography>{isData ? <Typography color="lightgrey" sx={{fontSize: "13px"}}>Last Updated: {moment().format('LT')}</Typography> : null}</Typography>
                        </Weathergrid>
                        <Grid item xs={5}>
                        </Grid>
                    </Grid>
                </Temperaturearea>
                { showPage && <Divider sx={{paddingBottom: 0.5}}/>}
                <Weatherdetails>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Fourbox> {isData ? <Fourbox variant="h6" sx={{fontSize: '12px'}}>High:</Fourbox> : null }</Fourbox>
                            <Typography>{isData ? <Typography variant="h6">{Math.round(data.main?.temp_max)}°</Typography> : null}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Fourbox> {isData ? <Fourbox variant="h6" sx={{fontSize: '12px'}}>Low:</Fourbox> : null }</Fourbox>
                            <Typography>{isData ? <Typography variant="h6">{Math.round(data.main?.temp_min)}°</Typography> : null}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Fourbox> {isData ? <Fourbox variant="h6" sx={{fontSize: '12px'}}>Chance of rain:</Fourbox> : null }</Fourbox>
                            <Typography> {isData ? <Typography variant="h6">N/A</Typography> : null}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Fourbox> {isData ? <Fourbox variant="h6" sx={{fontSize: '12px'}}>Precipitation:</Fourbox> : null }</Fourbox>
                            <Typography> {isData ? <Typography variant="h6">N/A</Typography> : null}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Fourbox> {isData ? <Fourbox variant="h6" sx={{fontSize: '12px'}}>Wind:</Fourbox> : null }</Fourbox>
                            <Typography>{isData ? <Typography variant="h6">{Math.round(data.wind?.speed)} mph</Typography> : null}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Fourbox> {isData ? <Fourbox variant="h6" sx={{fontSize: '12px'}}>Humidity:</Fourbox> : null }</Fourbox>
                            <Typography>{isData ? <Typography variant="h6">{Math.round(data.main?.humidity)}%</Typography> : null}</Typography>
                        </Grid>
                    </Grid>
                </Weatherdetails>
                { showPage && <Divider sx={{paddingBottom: 0.5}}/>}
                { isData && data.forecast && <Forecast>
                    <Grid container spacing={2}>
                        { data.forecast.map((dataPoint, i) => {
                            const {
                                DateTime, 
                                // IsDayLight, 
                                // Temperature, 
                                // Unit, 
                                Value, 
                                WeatherIcon 
                            } = dataPoint;
                            const UpdatedIcon = WeatherIcon < 10 ? '0' + WeatherIcon : WeatherIcon;
                            return <Grid item xs={2} key={`${i}/${Value}`}>
                                <Fourbox variant="h6" sx={{fontSize: '14px', marginBottom: 0}}>
                                    {(moment(DateTime).format("h A"))}
                                </Fourbox>
                                <Typography variant="h6">{Value}°</Typography>
                                <img style={{ width: 35, height: 25 }} src={(`https://developer.accuweather.com/sites/default/files/${UpdatedIcon}-s.png`)}></img>
                            </Grid>
                        })}
                    </Grid>
                </Forecast> }
            </CardContent>
        </Primarycard>

        </Grid>
    )
}

export default Mainpage