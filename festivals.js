
var util = require('util');
const request = require('request');
const chalk = require('chalk');
var get = require('lodash.get');
const fs = require('fs');

const url = 'https://spreadsheets.google.com/feeds/list/1f9JYuJCNmhzrikx7Thh4_N_kG-p1k2V_Vq5_m1C4pp4/od6/public/values?alt=json'

const formatDate = date => {
  if (!date) return date;
  if (date === 'NOW') return date;
  // console.log('date', date)
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString("en-US", options);
}

const parseDate = date => {
  // console.log(date)
  if (!date) {
    // console.log('null')
    return null
  }
  if (date === 'NOW') {
    // console.log('NOW')
    return date;
  }
  // console.log(Date.parse(date))
  const parsed = new Date(Date.parse(date));
  return parsed;
}

const parseFestivals = festivals => {
  return festivals.map(festival => {
    return {
      id: festival.gsx$id.$t,
      name: festival.gsx$festival.$t,
      submissionsopen: parseDate(festival.gsx$submissionsopen.$t),
      submissionsclose: parseDate(festival.gsx$submissionsclose.$t),
      startdate: parseDate(festival.gsx$startdate.$t),
      enddate: parseDate(festival.gsx$enddate.$t),
      city: festival.gsx$city.$t,
      state: festival.gsx$state.$t,
      country: festival.gsx$country.$t,
      website: festival.gsx$website.$t,
      submissionNotes: festival.gsx$submissionnotes.$t,
    }
  })
}

const logFestival = festival => {
  console.log(chalk.green(festival.name))
  console.log('open:', formatDate(festival.submissionsopen))
  console.log('close:', formatDate(festival.submissionsclose))
  console.log('start:', formatDate(festival.startdate))

  if (festival.isOpen) {
    console.log(chalk.yellow('IS OPEN'))
  }
  if (festival.openingLater) {
    console.log(chalk.red('will open later '))
  }
  if (festival.recentlyOpen) {
    console.log(chalk.white.bgGreen('recently opened '))
  }
  if (festival.closingSoon) {
    console.log(chalk.magenta('closingSoon'))
  }
}

const getUpcoming = (festivals) => {
  // Newly open submissions
  // Closing Soon
  // Other Open Submissions
  const now = new Date();

  let twoWeeksEarlier = new Date();
  twoWeeksEarlier.setDate(now.getDate() - 30);

  const twoWeeksLater =new Date();
  twoWeeksLater.setDate(now.getDate() + 30);

  console.log(chalk.blue('now', formatDate(now)))
  console.log(chalk.blue('two weeks earlier', formatDate(twoWeeksEarlier)))
  console.log(chalk.blue('two weeks later', formatDate(twoWeeksLater)))

  // const newlyOpen = [];
  // const closingSoon = [];
  // const openingSoon = [];
  // const stillOpen = [];
  // const openingLater = [];

  const openNow = [];
  const festivalsOpeningLater = [];

  festivals.forEach(festival => {
    let isOpen, recentlyOpen, closingSoon, openingLater;
    // ignore festivals with no submission dates
    if (!festival.submissionsopen && !festival.submissionsclose) {
      return
    }
    // ignore festivals that already closed
    if (festival.submissionsclose && festival.submissionsclose < now) {
      return
    }

    if (festival.submissionsopen
      && festival.submissionsclose
      && festival.submissionsopen < now
      && festival.submissionsclose > now) {
        isOpen = true;
    }

    if (festival.submissionsopen
      && !festival.submissionsclose
      && festival.submissionsopen < now
    // ) {
      && festival.startdate > now) {
        isOpen = true;
    }

    if (isOpen && festival.submissionsopen > twoWeeksEarlier) {
      recentlyOpen = true;
    }

    if (isOpen && festival.submissionsclose && festival.submissionsclose < twoWeeksLater) {
      closingSoon = true;
    }

    if (festival.submissionsopen && festival.submissionsopen > now) {
      openingLater = true;
    }

    const festivalData = {...festival, closingSoon, recentlyOpen, openingLater, isOpen};
    if (isOpen) {
      openNow.push(festivalData)
    }
    if (openingLater){
      festivalsOpeningLater.push(festivalData)
    }
  })

  // openNowWithClosing = openNow.filter(festival => festival.submissionsclose)
  const future = new Date();
  future.setFullYear(future.getFullYear() + 50)
  openNow.sort((a, b) => (a.submissionsclose || future) > (b.submissionsclose || future) ? 1 : -1)
  openNow.forEach(festival => {
    logFestival(festival);
  })
  festivalsOpeningLater.sort((a,b) => a.submissionsopen > b.submissionsopen ? 1 : -1)


  // Return festivals sorted by their deadline date
  // Add recently opened and closing soon as badges
  return openNow;
}


// console.log('hello')
request.get(url, (error, response, body) => {
  let json = JSON.parse(body);
  // console.log(json);
  // const festivals = json.feed.entry.map(entry => {
  //   // console.log('entry!', entry)
  //   return entry;
  // })
  const festivals = parseFestivals(json.feed.entry)
  // console.log(festivals[0])
  //
  // console.log(Object.keys(festivals[0]))
  // console.log(festivals[0].gsx$country)

  const usFestivals = festivals.filter(festival => festival.country === 'US')
  const international = festivals.filter(festival => festival.country !== 'US')
  // console.log(international)
  // console.log('US festivals', usFestivals.length)
  // console.log('intl festivals', international.length)
  // console.log('festivals', usFestivals)
  const upcomingUS = getUpcoming(usFestivals)
  const upcomingIntl = getUpcoming(international)

  const template = `
  <div style="text-align: center; margin: 0 2em;" class="mcnTextContent">
    <style>
     p {
     text-align: center !important;
     }
   </style>
    <h1 style="text-align: center; margin: 3em 0; text-decoration: underline;">US Festivals</h1>
    ${renderFestivals(upcomingUS)}
    <h1 style="text-align: center; margin: 3em 0; text-decoration: underline;">International Festivals</h1>
    ${renderFestivals(upcomingIntl)}
  </div>
  `

  fs.writeFile("./test.html", template, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });


});

renderFestivals = (festivals, i18n) => {
  return festivals.map(festival => {
    return `
    <div style="text-align: center; margin: 3em 0;">
      <h2 style="text-align: center;">
        <a href="${festival.website}">${festival.name}</a>
      </h2>
      <strong>${festival.city}, ${festival.state} ${i18n ? `, ${festival.country}` : ''}</strong>
      <p>${formatDate(festival.startdate)} - ${formatDate(festival.enddate)}
      <p><strong>Deadline:</strong> ${formatDate(festival.submissionsclose) || 'not specified'}
      ${festival.submissionNotes ? `<p><strong>Submission Notes:</strong> <br/> ${festival.submissionNotes}</p>` : null}
    <div>
  `}).join('\n')
}
