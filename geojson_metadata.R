library(RJSONIO)
library(dplyr)

stations <- read.csv("data/2015_station_data.csv")
trips <- read.csv("data/2015_trip_data.csv")
trips$route.id <- paste(trips$from_station_id, trips$to_station_id, sep="_")

trips.summary <-
  trips %>%
  group_by(route.id) %>%
  do(data.frame(ntrips = length(.$route.id),
                mean.time = mean(.$tripduration))) %>%
  mutate(routefraction = ntrips/nrow(trips))

routes <- gtools::permutations(54, 2, stations$terminal)
all.routes <- c(paste(routes[, 1], routes[, 2], sep="_"),
                paste(stations$id, stations$id, sep="_"))

riderless.routes <- data.frame(route.id = setdiff(trips.summary$route.id, all.routes),
                               ntrips=0, mean.time = 0, routefraction=NA)
trips.summary <- rbind(trips.summary, riderless.routes)
trips.summary$routerank <- rank(trips.summary$routefraction, ties.method="max")

trips.summary$start <- sapply(strsplit(trips.summary$route.id, "_"), "[", 1)
trips.summary$end <- sapply(strsplit(trips.summary$route.id, "_"), "[", 2)

trips.summary <-
  trips.summary %>%
  merge(stations, by.x="start", by.y="terminal") %>%
  rename(station.start=name) %>%
  select(route.id, ntrips, mean.time, routefraction, routerank,    
         station.start, end)

trips.summary <-
  trips.summary %>%
  merge(stations, by.x="end", by.y="terminal") %>%
  rename(station.end=name) %>%
  select(route.id, ntrips, mean.time, routefraction, routerank,    
         station.start, station.end)
  
trips.summary.json <- toJSON(trips.summary)
cat(trips.summary.json, file = "data/trips_summary.json")
