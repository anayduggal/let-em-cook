import json

with open("example.json", "r") as f:
    data = f.read()

data_dict = json.loads(data)['recipes'][0]

def dictPrintEntry(dict, key):
    print(f"{key} : {dict[key]}\n")

for key, value in data_dict.items():
    print(f"{key} : {value}\n")

dictPrintEntry(data_dict, 'id')
dictPrintEntry(data_dict, 'title')
dictPrintEntry(data_dict, 'readyInMinutes')
dictPrintEntry(data_dict, 'servings')
dictPrintEntry(data_dict, 'cheap')
print("ingredients\n")

for i in data_dict['extendedIngredients']:
    print(f"{i['id']} {i['name']} {i['measures']['metric']['amount']} {i['measures']['metric']['unitShort']}")


print("\n")
