{
  "name": "Watchlist",
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
    "genre_ids": {
      "type": "array",
      "items": {
        "type": "number"
      }
    }
  },
  "required": [
    "movie_id",
    "title"
  ]
}