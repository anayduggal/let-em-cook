import http.client
import json
import configparser


def get_recipes(number_of_recipes):
    config = configparser.ConfigParser()
    config.read("credentials.config")

    conn = http.client.HTTPSConnection("spoonacular-recipe-food-nutrition-v1.p.rapidapi.com")

    headers = {
        'x-rapidapi-key': config["rapidapi"]["key"],
        'x-rapidapi-host': "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    }

    conn.request("GET", f"/recipes/random?number={number_of_recipes}", headers=headers)

    res = conn.getresponse()
    data = res.read()

    return json.loads(data)["recipes"]