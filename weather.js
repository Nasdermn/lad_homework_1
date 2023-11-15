const axios = require('axios');
const yargs = require('yargs');
const fs = require('fs');

const API_URL = 'http://api.weatherapi.com/v1/current.json';
const CONFIG_FILE_PATH = './weather-config.json';

function getWeather(city, token) {
  const params = {
    key: token,
    q: city,
    aqi: 'no', //означает air quality data, нам это не нужно
  };

  return axios
    .get(API_URL, { params })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
    });
}

function getJSON() {
  try {
    const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf8'); //readFileSync блокирует выполнение дальнейшего кода пока не завершится чтение файла
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return {};
  }
}

const argv = yargs
  .option('s', {
    alias: 'city',
    describe:
      'Чтобы вписать город, погоду которого вы хотите увидеть, напишите -s "Название города" при запуске',
    type: 'string',
  })
  .option('t', {
    alias: 'token',
    describe: 'Впишите токен weather api после ввода -t',
    type: 'string',
  })
  .option('h', {
    alias: 'help',
    describe: 'Показывает вспомогательную информацию',
    type: 'boolean',
  })
  .help()
  .alias('help', 'h').argv;

const config = getJSON();

const city = argv.city || config.city || 'Нижний Новгород';
const token = argv.token || config.token;

getWeather(city, token)
  .then((data) => {
    console.log(`Текущая погода в городе ${city}:`);
    console.log(`Температура: ${data.current.temp_c}°C`);
    console.log(`Тип погоды: ${data.current.condition.text}`);
  })
  .catch((err) => {
    console.log(err);
  });
