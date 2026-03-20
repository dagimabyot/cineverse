{
  "name": "WatchHistory",
  "type": "object",
  "properties": {
    "movie_id": {
      "type": "number",
      "description": "TMDB movie ID"
    },
    "title": {
      "type": "string"
    },
    "poster_path": {
      "type": "string"
    },
    "release_date": {
      "type": "string"
    },
    "vote_average": {
      "type": "number"
    },
    "watched_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "movie_id",
    "title"
  ]
}