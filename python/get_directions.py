import googlemaps
import json
import csv
from collections import OrderedDict
import pickle
import os.path

# https://console.developers.google.com/apis/credentials
API = ''
gmaps = googlemaps.Client(API)

def decode(point_str):
    '''Decodes a polyline that has been encoded using Google's algorithm
    http://code.google.com/apis/maps/documentation/polylinealgorithm.html
    hat tip to: https://gist.github.com/signed0/2031157'''

    coord_chunks = [[]]

    for char in point_str:
        value = ord(char) - 63
        split_after = not (value & 0x20)
        value &= 0x1f

        coord_chunks[-1].append(value)

        if split_after:
            coord_chunks.append([])

    del coord_chunks[-1]

    coords = []

    for coord_chunk in coord_chunks:
        coord = 0
        for i, chunk in enumerate(coord_chunk):
            coord |= chunk << (i * 5)
        if coord & 0x1:
            coord = ~coord
        coord >>= 1
        coord /= 100000.0

        coords.append(coord)

    points = []
    prev_x = 0
    prev_y = 0

    for i in xrange(0, len(coords) - 1,2):
        if coords[i] == 0 and coords[i + 1] == 0:
            continue
        prev_x += coords[i + 1]
        prev_y += coords[i]
        points.append((round(prev_x, 6), round(prev_y, 6)))
    return points

station_data = []
with open('../data/2015_station_data.csv', 'rb') as sd:
    csvfile = csv.reader(sd)
    csvfile.next()
    for row in csvfile:
        item = {}
        item['name'] = row[2]
        item['latlong'] = "{lat},{lon}".format(lat=row[3],lon=row[4])
        station_data.append(item)

pairwise_directions = []
for x in station_data:
    for y in station_data:
        if x != y:
            print 'getting directions for x: ' + str(x) + ', y: ' + str(y)

            # The Google directions API limits free use to 2500 queries per diem.
            # We'll surpass that, so save the results for each query into files.
            # Alternatively, we could use a key ring of API keys, but this way is a little easier.
            # On the second day, the direction data shall be complete.
            directionsFilename = '../data/directions/directions-' + x['name'] + '-' + y['name'] + '.dat'
            if os.path.isfile(directionsFilename):
                print '  loading directions from file...'
                dirsDict = pickle.load(open(directionsFilename, "rb"))
            else:
                print '  querying gmaps...'
                item2 = {}
                item2['route'] = "{}:{}".format(x['name'], y['name'])
                directions = gmaps.directions(x['latlong'], y['latlong'],
                        mode="bicycling")
                item2['turns'] = decode(directions[0]['overview_polyline']['points'])
                dirsDict = OrderedDict(sorted(item2.items(), key=lambda t: t[0]))
                pickle.dump(dirsDict, open(directionsFilename, "wb"))
            pairwise_directions.append(dirsDict)

with open('../data/pairwise_routes.json', 'w') as pr:
    pr.write(json.dumps(pairwise_directions))
