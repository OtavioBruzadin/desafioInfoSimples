const express = require('express');
const axios  = require('axios');
const cheerio = require('cheerio');
const {response} = require("express");
const fs = require('fs')

const PORT = 8080;

const server = express();

const URL = "https://infosimples.com/vagas/desafio/commercia/product.html"
server.listen(PORT);

 axios(URL).then(response => {
     const html = response.data
     const parsedHtml = cheerio.load(html)
     const  respostaFinal = {}
     function parseCategories() {
         const categories = []
         let category = ""

         parsedHtml('nav.current-category ').find('a').each((index, piece) => {
             category = parsedHtml(piece).text()
             categories.push(category)

         })
         return categories
     }
     respostaFinal['title'] =  parsedHtml('h2#product_title').text()
     respostaFinal['brand'] = parsedHtml('div.brand').text()
     respostaFinal['description'] = parsedHtml('div.proddet p').text()
     respostaFinal['categories']= parseCategories()

     const jsonRespostaFinal = JSON.stringify(respostaFinal);

     fs.writeFile('produto.json', jsonRespostaFinal, function (err) {
         if (err) {

             console.log(err);
         } else {
             console.log('Arquivo salvo');
         }
     })
 }).catch()

