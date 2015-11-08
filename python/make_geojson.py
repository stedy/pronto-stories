import geojson
import csv

with open("../data/2015_station_data.csv") as sd:
    reader = csv.reader(sd)
    
    for row in reader:
        to_geojson['terminal'] = row[2]
        to_geojson['lat'] = row[3]
        to_geojson['long'] = row[4]

print to_geojson
