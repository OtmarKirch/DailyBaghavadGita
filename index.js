import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { readFile } from 'node:fs';
import jsonfile from 'jsonfile'

const app = express()
const port = 3000

app.use(express.static("public"))



// API with content for website
// https://rapidapi.com/bhagavad-gita-bhagavad-gita-default/api/bhagavad-gita3
// variables for API request declared
let randChapterIndex;
let optionsChapter = {}
let displayData = {
    name_translated: "testthisobject",
    chapter_summary: "testanotherobject",
    chapter_number: "testchapter"
  }

let backgroundData = 5

function randomBackground(req, res, next){
  let svgCode = "red"
  const randNumber = 1 //Math.floor(Math.random()*2 + 1)
  console.log(randNumber)
  backgroundData = "data updated"
  switch (randNumber){
    case 1:
      readFile('public/images/pattern.svg', 'utf-8', (err, data) => {
        if (err) throw err;
        // console.log(data);
        backgroundData = data
        // console.log("switch case 1")
      })
      break
    case 2:
      svgCode = "testCase2"
      backgroundData = svgCode
      break
    default:
      break
  }
  next()
}

// Request chapter data function
function getChapterData(req, res, next){
  randChapterIndex = Math.floor(Math.random()*18) // Select one of the 18 chapters 
  const baseUrlRequestChapter = 'https://bhagavad-gita3.p.rapidapi.com/v2/chapters/'
  const UrlRequestChapter = baseUrlRequestChapter + randChapterIndex + "/"
 
  optionsChapter = {
    method: 'GET',
    url: UrlRequestChapter,
    headers: {
      'X-RapidAPI-Key': '422a8fc6admsh66d86a34578cbf3p17f7bejsn40d86ef8bbd3',
      'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com'
    }
  };
  next()
}

app.use(getChapterData, randomBackground, (req, res, next) =>{
  // console.log(backgroundData)
  next()
})

// 
app.get("/", async (req, res) => {
  
  try {
    
    const response = await axios.request(optionsChapter);
    // console.log(response.data);
    console.log(backgroundData)
    
    displayData.name_translated = response.data.name_translated
    displayData.chapter_summary = response.data.chapter_summary
    displayData.chapter_number = response.data.chapter_number
    
  } catch (error) {
    console.error(error);
  }

  // request verse data
  const baseUrlRequestVerses = 'https://bhagavad-gita3.p.rapidapi.com/v2/chapters/'
  const urlRequestVerses = baseUrlRequestVerses + randChapterIndex + "/verses/"

  const optionsVerse = {
    method: 'GET',
    url: urlRequestVerses,
    headers: {
      'X-RapidAPI-Key': '422a8fc6admsh66d86a34578cbf3p17f7bejsn40d86ef8bbd3',
      'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(optionsVerse);
    const numberVerses = response.data.length
    const randomVerseIndex = Math.floor(Math.random()*numberVerses)
    console.log(numberVerses)
    console.log("Verse " + response.data[randomVerseIndex].verse_number);
    console.log("Chapter " + response.data[randomVerseIndex].chapter_number);
    console.log("First sentence of verse " + response.data[randomVerseIndex].translations[0].description)
    displayData.verse_number = response.data[randomVerseIndex].verse_number
    displayData.verse_first_sentence = response.data[randomVerseIndex].translations[0].description
  } catch (error) {
    console.error(error);
  }

  // send response to frontend
  res.render("index.ejs", displayData)
    
})

app.listen(port, () => {
    console.log("Up and running listening on port " + port)
})