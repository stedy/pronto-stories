import datetime as dt
import os
from sqlite3 import dbapi2 as sqlite3
from flask import Flask, request, g, redirect, url_for,\
        render_template, flash

app = Flask(__name__)

# Load default config and override config from an environment
# variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'pronto.db'),
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
))
app.config.from_envvar('ABOUNCE_SETTINGS', silent=True)


def connect_db():
    """Connects to the specific database."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql',mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.route('/', methods=['GET', 'POST'])
def show_entries():
    db = get_db()
    cur = db.execute("""SELECT DISTINCT start FROM Trips""")
    starts = cur.fetchall()
    curend = db.execute("""SELECT DISTINCT end FROM Trips""")
    ends = curend.fetchall()
    return render_template('main.html', starts=starts, ends=ends)

@app.route('/get_map', methods=['GET', 'POST'])
def get_map():
    db = get_db()
    cur = db.execute("""SELECT station_start, station_end, ntrips, routerank
                        FROM Trips WHERE start = ? AND end = ?""",
            [request.form['start'], request.form['end']])
    entries = cur.fetchall()
    route = request.form['start'] +'_'+ request.form['end']
    infile = 'route' + route + '.geojson'
    return render_template('map.html', entries=entries, route=route,
            infile=infile)

if __name__ == '__main__':
    app.run()
