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
         parsedHtml('nav.current-category ').find('a').each((index, element) => {
             category = parsedHtml(element).text()
             categories.push(category)
         })
         return categories
     }
     function parseSkus(){
         const skusList = []
         parsedHtml('div.card-container').each((index, element) => {
             const skus = {}
             skus.name= parsedHtml(element).find('.prod-nome').text()
             skus.current_price= parseFloat(parsedHtml(element).find('.prod-pnow').text().replace(/\D+\.?\D+/g, '').replace(",","."))
             skus.old_price= parseFloat(parsedHtml(element).find('.prod-pold').text().replace(/\D+\.?\D+/g, '').replace(",","."))
             if(isNaN(skus.current_price)){
                 skus.available = false
             }else{
                 skus.available = true
             }
             skusList.push(skus)
         })
         return skusList
     }
     function parseReviews(){
         const reviewList = []
         parsedHtml('div.analisebox').each((index, element) => {
             const review = {}
             review.name= parsedHtml(element).find('.analiseusername').text()
             review.date = parsedHtml(element).find('.analisedate').text()
             review.review = parsedHtml(element).find('.analisestars').text().split("★").length - 1
             review.text = parsedHtml(element).find('p').text()
             reviewList.push(review)
         })
         return reviewList
     }
     function calculateReviewAverageScore(list){
         let average = 0;
         for (let i = 0; i < list.length; i++) {
             average += list[i].review
         }
         return parseFloat(average/list.length)
     }
     function parseProperties(){
         const propertiesList = []
         parsedHtml('tr').each((index, element) => {
             const properties= {}
             properties.label= parsedHtml(element).find('td b').text()
             properties.value= parsedHtml(element).find('td:nth-child(2)').text()

             propertiesList.push(properties)
         })
         return propertiesList
     }
     function parseContent(location){
         return parsedHtml(location).text()
     }

     respostaFinal['title'] =  parseContent('h2#product_title')
     respostaFinal['brand'] = parseContent('div.brand')
     respostaFinal['categories']= parseCategories()
     respostaFinal['description'] = parseContent('div.proddet p')
     respostaFinal['skus'] = parseSkus()
     respostaFinal['properties'] = parseProperties()
     respostaFinal['reviews'] = parseReviews()
     respostaFinal['reviews_average_score'] = calculateReviewAverageScore(parseReviews())
     respostaFinal['url'] = URL

     const jsonRespostaFinal = JSON.stringify(respostaFinal,null,"\t");

     fs.writeFile('produto.json', jsonRespostaFinal, function (err) {
         if (err) {
             console.log(err);
         } else {
             console.log('Arquivo salvo com sucesso');
         }
     })
 }).catch()

