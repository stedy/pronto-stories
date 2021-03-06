import googlemaps
import json
import csv
from collections import OrderedDict
import pickle
import os.path
import math
import sys

# https://console.developers.google.com/apis/credentials
API = sys.argv[1]
#API = ''
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
pairwise_elevations = []
totalCombinations = int(math.pow(len(station_data), 2))
for x in station_data:
    for y in station_data:
        if x != y:
            combinationIndex = station_data.index(x) * len(station_data) + station_data.index(y)
            prefix = '[' + str(combinationIndex+1) + ' of ' + str(totalCombinations) + ']'
            print prefix + ' getting directions for x: ' + str(x) + ', y: ' + str(y)

            # The Google directions API limits free use to 2500 queries per diem.
            # We'll surpass that, so save the results for each query into files.
            # Alternatively, we could use a key ring of API keys, but this way is a little easier.
            # On the second day, the direction data shall be complete.
            filenameSuffix = x['name'] + '-' + y['name'] + '.dat'
            directionsFilename = '../data/directions/directions-' + filenameSuffix
            elevationsFilename = '../data/elevations/elevations-' + filenameSuffix
            if os.path.isfile(directionsFilename) and os.path.isfile(elevationsFilename):
                print '  loading directions and elevations from file...'
                dirsDict = pickle.load(open(directionsFilename, "rb"))
                orderedElevations = pickle.load(open(elevationsFilename, "rb"))
            else:
                print '  querying gmaps...'
                item2 = {}
                item2['route'] = "{}:{}".format(x['name'], y['name'])
                directions = gmaps.directions(x['latlong'], y['latlong'],
                        mode="bicycling")
                path = decode(directions[0]['overview_polyline']['points'])

                item2['turns'] = path
                dirsDict = OrderedDict(sorted(item2.items(), key=lambda t: t[0]))
                pickle.dump(dirsDict, open(directionsFilename, "wb"))

                elevationsDict = {}
                elevations = []
                pathSegments = []
                pathSegmentDistances = []
                totalSegmentDistances = 0
                elevationMapPixels = 300
                elevationSamplingGranularity = 3
                totalSamples = elevationMapPixels / elevationSamplingGranularity

                for i in range(len(path) - 2):
                    pathSegment = path[i:i+2]

                    transformedPathSegment = []
                    # flip lat and long, since they are in the wrong order for the elevations API otherwise
                    for point in pathSegment:
                        transformedPathSegment.append((point[1], point[0]))

                    pathSegments.append(transformedPathSegment)

                    # a^2 + b^2 = c^2
                    a = transformedPathSegment[1][0] - transformedPathSegment[0][0]
                    b = transformedPathSegment[1][1] - transformedPathSegment[0][1]
                    segmentDistance = math.sqrt(math.pow(a, 2) + math.pow(b, 2))
                    pathSegmentDistances.append(segmentDistance)
                    totalSegmentDistances += segmentDistance

                for i in range(len(pathSegments)):
                    percentOfTotal = float(pathSegmentDistances[i]) / float(totalSegmentDistances)
                    samples = totalSamples * percentOfTotal
                    samples = max(int(samples) + 1, 2)
                    print "    querying elevation info for segment " + str(i+1) + " of " + str(len(pathSegments)) + "..."
                    segmentElevations = gmaps.elevation_along_path(pathSegments[i], samples)

                    if i == 0:
                        # only append the beginning elevation for the first path segment
                        elevations.append(segmentElevations[0])
                    for elevation in segmentElevations[1:]:
                        elevations.append(elevation)

                cleanedElevations = []
                for elevation in elevations:
                    cleanedElevations.append(elevation['elevation'])

                elevationsDict['totalSamples'] = totalSamples
                elevationsDict['elevations'] = cleanedElevations
                elevationsDict['route'] = item2['route']
                orderedElevations = OrderedDict(sorted(elevationsDict.items(), key=lambda t: t[0]))
                pickle.dump(orderedElevations, open(elevationsFilename, "wb"))

            pairwise_directions.append(dirsDict)
            pairwise_elevations.append(orderedElevations)

with open('../data/pairwise_routes.json', 'w') as pr:
    pr.write(json.dumps(pairwise_directions))

with open('../data/pairwise_elevations.json', 'w') as pr:
    pr.write(json.dumps(pairwise_elevations))
