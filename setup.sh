source venv/bin/activate
mkdir data
cd data
python ../python/get_elevations.py
cd ..
deactivate
RScript create_metadata.R

