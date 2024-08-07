import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const apiURL = "https://www.thecocktaildb.com/api/json/v1/1"

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/search-name", async (req, res) => {
   try {
    const cocktailName = req.body.cocktailName;
    const result = await axios.get(`${apiURL}/search.php?s=${cocktailName.toLowerCase()}`);
    if (result.data.drinks.length > 1) {
        res.render("search", {cocktailName, drinks: result.data.drinks});
    } else if (result.data.drinks.length === 1) {
        const id = result.data.drinks[0].idDrink;
        res.redirect(`/cocktail?id=${id}`);
    } else {
        res.render("search", { cocktailName, drinks: [] });
    }
   } catch {
    console.error(error);
    res.render("index");
   }
});

app.post("/filter", async (req, res) => {
    try {
     const ingredient = req.body.ingredient;
     const alcoholic = req.body.alcoholic;
     if (ingredient) {
        var result = await axios.get(`${apiURL}/filter.php?i=${ingredient.toLowerCase()}`)
     } else {
        var result = await axios.get(`${apiURL}/filter.php?a=${alcoholic}`)
     };
     if (result.data.drinks.length > 1) {
        res.render("search", {drinks: result.data.drinks});
    } else if (result.data.drinks.length === 1) {
        const id = result.data.drinks[0].idDrink;
        res.redirect(`/cocktail?id=${id}`);
    } else {
        res.render("search", { drinks: [] });
    }
   } catch {
    console.error(error);
    res.render("index");
   }
 });

app.post("/random-cocktail", async (req, res) => {
    try {
        const result = await axios.get(`${apiURL}/random.php`);
        const id = result.data.drinks[0].idDrink;
        res.redirect(`/cocktail?id=${id}`);
    } catch {
        console.error(error);
        res.render("index");
    }
})

app.get("/cocktail", async (req, res) => {
    try {
        let id = req.query.id;  
        const result = await axios.get(`${apiURL}/lookup.php?i=${id}`);
        const drink = result.data.drinks[0];
        const cocktailName = drink.strDrink;
        const glass = drink.strGlass;
        const alcoholic = drink.strAlcoholic;
        const image = drink.strDrinkThumb;
        const instructions = drink.strInstructions;

        const ingredients = [];
        const measures = [];

        for (let i = 1; i <= 15; i++) {
            const ingredientKey = `strIngredient${i}`;
            const measureKey = `strMeasure${i}`;
            if (drink[ingredientKey]) {
                if (drink[measureKey]) {
                    ingredients.push(`${drink[measureKey]} of ${drink[ingredientKey].toLowerCase()}`)
                } else {
                    ingredients.push(drink[ingredientKey]);
            }}};

        res.render("cocktail", { cocktailName, glass, alcoholic, image, ingredients, instructions });
    } catch (error) {
        console.error(error);
        res.render("index");
    }
})








app.listen(port);