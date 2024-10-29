const express = require("express");
const app = express();
const port = 3000;

//konversi waktu ke detik
function convertToSecond(hour, min, sec) {
    return (hour * 3600) + (min * 60) + sec
}

//konversi detik ke format jam:menit:detik
function convertToTimeFormat(seconds) {
    let hour = Math.floor(seconds / 3600)
    let min = Math.floor((seconds % 3600) / 60)
    let sec = seconds % 60
    return `${hour}:${min}:${sec}`
}

//endpoint get untuk menghitung durasi perjalanan
app.get('/duration', (req, res) => {
    const { departure, arrival } = req.query;

    if (!departure || !arrival) {
        return res.status(400).json({ message: 'Please provide both departure and arrival times.' });
    }

    //memisahkan waktu ke jam, menit, dan detik
    const [departureHour, departureMin, departureSec] = departure.split(':');
    const [arrivalHour, arrivalMin, arrivalSec] = arrival.split(':');

    //konversi waktu keberangkatan dan kedatangan ke detik
    const departureTime = convertToSecond(parseInt(departureHour), parseInt(departureMin), parseInt(departureSec));
    const arrivalTime = convertToSecond(parseInt(arrivalHour), parseInt(arrivalMin), parseInt(arrivalSec));

    //hitung durasi perjalanan
    let durationSecond = arrivalTime - departureTime;

    //jika waktu kedatangan lebih awal dari keberangkatan (hari berikutnya)
    if (durationSecond < 0) {
        durationSecond += 24 * 3600;
    }

    const duration = convertToTimeFormat(durationSecond);
    return res.status(200).json({ duration });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});