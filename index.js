const express = require('express');
const axios  = require('axios');
const cheerio = require('cheerio');
const {response} = require("express");
const fs = require('fs')

const PORT = 8080;

const server = express();

const URL = "https://infosimples.com/vagas/desafio/commercia/product.html"
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

 axios(URL).then(response => {
     const html = response.data
     const parsedHtml = cheerio.load(html)
     let title= parsedHtml('h2#product_title').text()
     let brand= parsedHtml('div.brand').text()
     let description = parsedHtml('div.proddet p').text()
     const categories=[]
     console.log(title)
     console.log(brand)
     console.log(description)
     categories.push(parsedHtml('nav a').append(" ").text())
     console.log( categories)

 }).catch(err => console.log(err))

