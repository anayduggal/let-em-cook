import json
import mysql.connector
import configparser
from bs4 import BeautifulSoup, MarkupResemblesLocatorWarning
import warnings
warnings.filterwarnings("ignore", category=MarkupResemblesLocatorWarning)


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

    return db, dbcursor


def add_entry_to_db(data_dict):

    data_dict = clean_data_dict(data_dict)

    db, dbcursor = get_db()

    sql_query = (
        f"INSERT INTO recipes (recipe_name, summary, servings, image_link, source_link, ready_in_minutes, preparation_minutes, cooking_minutes, price_per_serving, spoonacular_score, vegetarian, vegan, gluten_free, dairy_free)"
        f"VALUES"
        f"(\'{data_dict["title"]}\', \'{data_dict["summary"]}\', {data_dict["servings"]}, \'{data_dict["image"]}\', \'{data_dict["sourceUrl"]}\', {data_dict["readyInMinutes"]}, {data_dict["preparationMinutes"]}, {data_dict["cookingMinutes"]}, {data_dict["pricePerServing"]}, {data_dict["spoonacularScore"]}, {data_dict["vegetarian"]}, {data_dict["vegan"]}, {data_dict["glutenFree"]}, {data_dict["dairyFree"]})"
    )

    print(sql_query)

    dbcursor.execute(sql_query)
    db.commit()

#endregion


with open("example.json", "r") as f:
    data_dict = json.loads(f.read())["recipes"][0]

add_entry_to_db(data_dict)
