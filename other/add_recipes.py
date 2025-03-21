import json
import mysql.connector
import configparser
from bs4 import BeautifulSoup, MarkupResemblesLocatorWarning
import warnings
warnings.filterwarnings("ignore", category=MarkupResemblesLocatorWarning)

import api_client


#region Data Cleaning

def clean_value(value):
    if isinstance(value, str):
        # Remove HTML tags
        value = BeautifulSoup(value, "html.parser").get_text()
        # Escape single quotes
        value = value.replace("'", "\\'")

    elif value is None:
        # Replace None with NULL (for SQL)
        value = "NULL"
    
    elif isinstance(value, bool):
        # Convert Boolean to MySQL-compatible 1/0
        value = 1 if value else 0
    
    return value


def clean_data_dict(data_dict):
    clean_data_dict = {}

    for key, value in data_dict.items():
        clean_data_dict[key] = clean_value(value)

    return clean_data_dict

#endregion


#region Database Management

def get_db():
    config = configparser.ConfigParser()
    config.read("credentials.config")

    db = mysql.connector.connect(
        host = "dbhost.cs.man.ac.uk",
        user = config["db"]["username"],
        password = config["db"]["password"],
        database = "2024_comp10120_y10"
    )

    dbcursor = db.cursor()

    return db


def add_entry_to_db(recipe_dict):

    recipe_dict = clean_data_dict(recipe_dict)

    recipe_dict["pricePerServing"] = str(float(recipe_dict["pricePerServing"]) * 0.77) # Update exchange rate when using

    db = get_db()
    db_cursor = db.cursor()

    try:
        db_cursor.execute((
            f"INSERT INTO recipes (recipe_id, recipe_name, summary, servings, image_link, source_link, ready_in_minutes, preparation_minutes, cooking_minutes, price_per_serving, spoonacular_score, vegetarian, vegan, gluten_free, dairy_free)"
            f"VALUES"
            f"({recipe_dict["id"]}, \'{recipe_dict["title"]}\', \'{recipe_dict["summary"]}\', {recipe_dict["servings"]}, \'{recipe_dict["image"]}\', \'{recipe_dict["sourceUrl"]}\', {recipe_dict["readyInMinutes"]}, {recipe_dict["preparationMinutes"]}, {recipe_dict["cookingMinutes"]}, {recipe_dict["pricePerServing"]}, {recipe_dict["spoonacularScore"]}, {recipe_dict["vegetarian"]}, {recipe_dict["vegan"]}, {recipe_dict["glutenFree"]}, {recipe_dict["dairyFree"]})"
        ))

    except Exception as e:
        print(f"ERROR: Could not add recipe {recipe_dict["title"]} with id: {recipe_dict["id"]} to the database.")
        print(e)
        return

    for ingredient_dict in recipe_dict["extendedIngredients"]:
        try:
            db_cursor.execute((
                f"INSERT INTO ingredients (ingredient_id, ingredient_name, aisle, consistency)"
                f"VALUES"
                f"({ingredient_dict["id"]}, \'{ingredient_dict["nameClean"]}\', \'{ingredient_dict["aisle"]}\', \'{ingredient_dict["consistency"]}\')"
            ))
        except mysql.connector.errors.IntegrityError as e:
            pass
        except Exception as e:
            print(f"ERROR: Could not add ingredient {ingredient_dict["name"]} with id: {ingredient_dict["id"]} to the database.")
            return

        try:
            db_cursor.execute((
                f"INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)"
                f"VALUES"
                f"({recipe_dict["id"]}, {ingredient_dict["id"]}, {ingredient_dict["amount"]}, \'{ingredient_dict["unit"]}\')"
            ))
        except Exception as e:
            print(f"ERROR: Could not add ingredient recipe link for ingredient {ingredient_dict["name"]} with id: {ingredient_dict["id"]} to the database.")
            print(e)
            return

    db.commit()
    print(f"Added {recipe_dict["title"]} with id: {recipe_dict["id"]} to the database.")


def add_recipes_to_db(number_of_recipes):
    recipes = api_client.get_recipes(number_of_recipes)

    for recipe in recipes:
        add_entry_to_db(recipe)

#endregion

for i in range(100):
    add_recipes_to_db(10)
