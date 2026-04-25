'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-charcoal-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-charcoal-400 mb-8">
          <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-cream-300">Submit a Location</span>
        </nav>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-3">
          Submit a Location
        </h1>
        <p className="text-charcoal-400 mb-8">
          Know of a pull tab venue that&apos;s not on our map? Let us know and we&apos;ll add it after verification.
        </p>

        {submitted ? (
          <div className="glass rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-cream-200 mb-2">
              Thank you!
            </h2>
            <p className="text-charcoal-400 mb-6">
              We&apos;ll review your submission and add it to the map once verified.
            </p>
            <Link
              href="/"
              className="inline-flex px-6 py-2.5 text-sm font-medium bg-gold-300 hover:bg-gold-400 text-charcoal-900 rounded-xl transition-colors"
            >
              Back to Map
            </Link>
          </div>
        ) : (
          <form
            name="submit-location"
            method="POST"
            data-netlify="true"
            action="/submit?success=true"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);

              // Try Netlify form submission
              fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData as any).toString(),
              })
                .then(() => setSubmitted(true))
                .catch(() => {
                  // Fallback: mailto
                  const name = formData.get('venue-name');
                  const address = formData.get('address');
                  const city = formData.get('city');
                  const state = formData.get('state');
                  const type = formData.get('type');
                  const notes = formData.get('notes');

                  window.location.href = `mailto:badtabits@gmail.com?subject=New Location Submission: ${name}&body=Venue: ${name}%0AAddress: ${address}%0ACity: ${city}%0AState: ${state}%0AType: ${type}%0ANotes: ${notes}`;
                  setSubmitted(true);
                });
            }}
            className="glass rounded-xl p-6 sm:p-8 space-y-5"
          >
            <input type="hidden" name="form-name" value="submit-location" />

            <div>
              <label htmlFor="venue-name" className="block text-sm font-medium text-cream-200 mb-1.5">
                Venue Name <span className="text-gold-400">*</span>
              </label>
              <input
                id="venue-name"
                name="venue-name"
                type="text"
                required
                placeholder="e.g., Lucky's Bar & Grill"
                className="w-full px-4 py-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-cream-200 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:border-gold-300/50 transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-cream-200 mb-1.5">
                Address <span className="text-gold-400">*</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                placeholder="123 Main St"
                className="w-full px-4 py-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-cream-200 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:border-gold-300/50 transition-all text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-cream-200 mb-1.5">
                  City <span className="text-gold-400">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-cream-200 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:border-gold-300/50 transition-all text-sm"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-cream-200 mb-1.5">
                  State <span className="text-gold-400">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-cream-200 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:border-gold-300/50 transition-all text-sm"
                >
                  <option value="">Select state</option>
                  <option value="MN">Minnesota</option>
                  <option value="AK">Alaska</option>
                  <option value="IA">Iowa</option>
                  <option value="WI">Wisconsin</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-cream-200 mb-1.5">
                Venue Type
              </label>
              <select
                id="type"
                name="type"
                className="w-full px-4 py-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-cream-200 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:border-gold-300/50 transition-all text-sm"
              >
                <option value="bar-restaurant">Bar / Restaurant</option>
                <option value="vfw">VFW</option>
                <option value="american-legion">American Legion</option>
                <option value="eagles">Eagles</option>
                <option value="lions-club">Lions Club</option>
                <option value="bingo-hall">Bingo Hall</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="submitter-email" className="block text-sm font-medium text-cream-200 mb-1.5">
                Your Email (optional)
              </label>
              <input
                id="submitter-email"
                name="submitter-email"
                type="email"
                placeholder="In case we need to follow up"
                className="w-full px-4 py-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-cream-200 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:border-gold-300/50 transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-cream-200 mb-1.5">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Hours, games available, or other details…"
                className="w-full px-4 py-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-cream-200 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:border-gold-300/50 transition-all text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-sm font-semibold text-charcoal-900 bg-gold-300 hover:bg-gold-400 rounded-xl transition-colors shadow-lg"
            >
              Submit Location
            </button>

            <p className="text-xs text-charcoal-500 text-center">
              Submissions are reviewed before being added. You can also email us at{' '}
              <a href="mailto:badtabits@gmail.com" className="text-gold-400 hover:underline">
                badtabits@gmail.com
              </a>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
