library(RSQLite)
library(dplyr)

stations <- read.csv("data/2015_station_data.csv")
trips <- read.csv("data/2015_trip_data.csv")
trips$route <- paste(trips$from_station_id, trips$to_station_id, sep="_")

trips.summary <-
  trips %>%
  group_by(route) %>%
  do(data.frame(ntrips = length(.$route),
                mean_time = mean(.$tripduration))) %>%
  mutate(routefraction = ntrips/nrow(trips))

trips.summary$routerank <- rank(-trips.summary$ntrips, ties.method="max")

trips.summary$start <- sapply(strsplit(trips.summary$route, "_"), "[", 1)
trips.summary$end <- sapply(strsplit(trips.summary$route, "_"), "[", 2)

trips.summary <-
  trips.summary %>%
  merge(stations, by.x="start", by.y="terminal") %>%
  rename(station_start=name) %>%
  select(route, ntrips, mean_time, routefraction, routerank,
         station_start, start, end) %>%
  mutate(minutes = floor(mean_time/60),
         seconds = (mean_time %% 1) * 100)

trips.summary <-
  trips.summary %>%
  merge(stations, by.x="end", by.y="terminal") %>%
  rename(station_end=name) %>%
  select(route, ntrips, mean_time, routefraction, routerank,
         station_start, station_end, start, end,
         minutes, seconds)  

trips.summary[] <- data.frame(sapply(trips.summary, as.character))
trips.summary$seconds <- as.numeric(trips.summary$seconds)

conn <- dbConnect(SQLite(), dbname = "pronto.db")
dbSendQuery(conn, "DROP TABLE IF EXISTS Trips");
dbWriteTable(conn, "Trips", trips.summary)
dbDisconnect(conn)
