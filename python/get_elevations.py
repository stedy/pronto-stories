import json
import csv
import requests
import logging
import time

'''Using google maps to determine elevation, tip of the hat to
https://github.com/vmdx'''

class GoogleMapsApiException(Exception):
    def __init__(self, *args):
        self.args = args
    def __str__(self):
        return repr(self.args)

station_data = []
with open('../data/2015_station_data.csv', 'rb') as sd:
    csvfile = csv.reader(sd)
    csvfile.next()
    for row in csvfile:
        item = {}
        item['name'] = row[2]
        item['latlong'] = "{lat},{lon}".format(lat=row[3],lon=row[4])
        station_data.append(item)

def make_json_request(uri):
    req = requests.get(uri)
    if req.status_code != 200:
        logging.error('failed request: %s' % uri)
        raise GoogleMapsApiException(uri,req.status_code)
    return json.loads(req.content)

def get_elevation(latlng):
    lat,lng = latlng.split(',')[0], latlng.split(',')[1]
    elevation_uri = 'http://maps.googleapis.com/maps/api/elevation/json?locations=%s,%s&sensor=false' % (lat, lng)
    data = make_json_request(elevation_uri)
    return data['results'][0]['elevation']

with open('../data/elevations.txt', 'w') as el:
    for x in station_data:
        time.sleep(2)
        el.write("{}, {}\n".format(x['name'], get_elevation(x['latlong'])))
