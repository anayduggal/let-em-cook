import http.client

conn = http.client.HTTPSConnection("spoonacular-recipe-food-nutrition-v1.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "8aaeba0037msha4731d87a5b178bp16b23ajsnbba95524d335",
    'x-rapidapi-host': "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
}

conn.request("GET", "/recipes/random?tags=vegetarian%2Cdessert&number=1", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))