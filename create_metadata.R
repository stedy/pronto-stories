library(RSQLite)
library(dplyr)

stations <- read.csv("data/2015_station_data.csv")
trips <- read.csv("data/2015_trip_data.csv")
trips$route <- paste(trips$from_station_id, trips$to_station_id, sep="_")

trips.summary <-
  trips %>%
  group_by(route) %>%
  do(data.frame(ntrips = length(.$route),
                mean.time = mean(.$tripduration))) %>%
  mutate(routefraction = ntrips/nrow(trips))

routes <- gtools::permutations(54, 2, stations$terminal)
all.routes <- c(paste(routes[, 1], routes[, 2], sep="_"),
                paste(stations$id, stations$id, sep="_"))

riderless.routes <- data.frame(route = setdiff(trips.summary$route, all.routes),
                               ntrips=0, mean.time = 0, routefraction=NA)
trips.summary <- rbind(trips.summary, riderless.routes)
trips.summary$routerank <- rank(trips.summary$routefraction, ties.method="max")

trips.summary$start <- sapply(strsplit(trips.summary$route, "_"), "[", 1)
trips.summary$end <- sapply(strsplit(trips.summary$route, "_"), "[", 2)

trips.summary <-
  trips.summary %>%
  merge(stations, by.x="start", by.y="terminal") %>%
  rename(station_start=name) %>%
  select(route, ntrips, mean.time, routefraction, routerank,
         station_start, start, end)

trips.summary <-
  trips.summary %>%
  merge(stations, by.x="end", by.y="terminal") %>%
  rename(station_end=name) %>%
  select(route, ntrips, mean.time, routefraction, routerank,
         station_start, station_end, start, end)

conn <- dbConnect(SQLite(), dbname = "pronto.db")
dbSendQuery(conn, "DROP TABLE IF EXISTS Trips");
dbWriteTable(conn, "Trips", trips.summary)
dbDisconnect(conn)
