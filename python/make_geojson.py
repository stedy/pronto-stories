import json

with open("../data/pairwise_routes.json", 'rb') as pr:
    original = json.load(pr)
    for x in original:
        turns = x['turns']
        fc = [[turn[1], turn[0]] for turn in turns]
        route = x['route'].replace(":", "_")
        print route
        outfile = "route{}.geojson".format(route)
        with open(outfile, 'w') as at:
            at.write('{\n')
            at.write('"type": "FeatureCollection",\n')
            at.write('"crs": { "type": "name", "properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84" } },\n')
            at.write('"features":[\n')
            for f in fc[:-1]:
                at.write('{{ "type": "Feature", "properties": {{  "id": "{id}", "name":"Along route"}}, "geometry": {{ "type": "Point", "coordinates":{latlong} }} }} ,\n'.format(id=route, latlong=f))
            at.write('{{ "type": "Feature", "properties": {{  "id": "{id}", "name":"Along route"}}, "geometry": {{ "type": "Point", "coordinates": {latlong} }} }}\n'.format(id=route, latlong=fc[-1]))
            at.write(']}')

