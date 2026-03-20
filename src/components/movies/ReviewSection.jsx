/**
 * ReviewSection — shows existing reviews and lets logged-in users add/edit their own.
 */
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import RatingStars from './RatingStars';
import { MessageSquare } from 'lucide-react';

export default function ReviewSection({ movieId, movieTitle, user }) {
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const all = await base44.entities.Review.filter({ movie_id: movieId });
    setReviews(all);
    if (user) {
      const mine = all.find(r => r.created_by === user.email);
      if (mine) { setMyReview(mine); setRating(mine.rating); setText(mine.review_text || ''); }
    }
  };

  useEffect(() => { load(); }, [movieId, user]);

  const submit = async () => {
    if (!rating) return;
    setSaving(true);
    if (myReview) {
      await base44.entities.Review.update(myReview.id, { rating, review_text: text });
    } else {
      await base44.entities.Review.create({ movie_id: movieId, movie_title: movieTitle, rating, review_text: text });
    }
    await load();
    setSaving(false);
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-violet-400" /> Reviews
          {reviews.length > 0 && <span className="text-gray-400 text-base font-normal">({reviews.length})</span>}
        </h2>
        {avg && (
          <div className="flex items-center gap-2">
            <RatingStars value={Math.round(parseFloat(avg))} size="sm" />
            <span className="text-gray-300 text-sm">{avg}/5</span>
          </div>
        )}
      </div>

      {/* Write review */}
      {user ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <p className="text-gray-300 text-sm font-medium mb-3">{myReview ? 'Update your review' : 'Write a review'}</p>
          <div className="flex items-center gap-2 mb-3">
            <RatingStars value={rating} onChange={setRating} size="md" />
            {rating > 0 && <span className="text-gray-400 text-sm">{rating}/5</span>}
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share your thoughts (optional)..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500 resize-none placeholder-gray-500 mb-3"
          />
          <button
            onClick={submit}
            disabled={!rating || saving}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-sm rounded-lg font-medium transition-colors"
          >
            {saving ? 'Saving...' : myReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6 text-center">
          <p className="text-gray-400 text-sm">
            <button onClick={() => base44.auth.redirectToLogin()} className="text-violet-400 hover:underline">Sign in</button> to write a review.
          </p>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                    {r.created_by?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-gray-300 text-sm">{r.created_by?.split('@')[0]}</span>
                </div>
                <RatingStars value={r.rating} size="sm" />
              </div>
              <p className="text-gray-600 text-xs mb-1">{new Date(r.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              {r.review_text && <p className="text-gray-400 text-sm leading-relaxed">{r.review_text}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}