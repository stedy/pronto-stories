# crontab entry:
# 0 13 * * * bash [repo-dir]/scrapeElevations.sh APIKEY1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
rm ./scrapeOutput.log
source venv/bin/activate
cd python
python get_directions.py $1 >> ../scrapeOutput.log 2>&1
echo "DONE FOR TODAY!"
