{
  "name": "Review",
  "type": "object",
  "properties": {
    "movie_id": {
      "type": "number",
      "description": "TMDB movie ID"
    },
    "movie_title": {
      "type": "string"
    },
    "rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5
    },
    "review_text": {
      "type": "string"
    }
  },
  "required": [
    "movie_id",
    "rating"
  ]
}