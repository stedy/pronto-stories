source venv/bin/activate
mkdir data
mkdir data/directions
cd data
python ../python/get_elevations.py
cd ..
deactivate
RScript create_metadata.R

