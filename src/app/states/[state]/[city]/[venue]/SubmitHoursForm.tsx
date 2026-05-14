'use client';

interface SubmitHoursFormProps {
  venueName: string;
  venueAddress: string;
  isUpdate?: boolean;
}

export function SubmitHoursForm({ venueName, venueAddress, isUpdate = false }: SubmitHoursFormProps) {
  const subject = isUpdate
    ? `Update Hours: ${venueName}`
    : `Submit Hours: ${venueName}`;

  const body = `Venue: ${venueName}
Address: ${venueAddress}

Pull Tab / Gambling Hours:
Monday: 
Tuesday: 
Wednesday: 
Thursday: 
Friday: 
Saturday: 
Sunday: 

Seller Type (Booth or Bar): 

Any notes: 
`;

  const mailtoUrl = `mailto:badtabits@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a
      href={mailtoUrl}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gold-300 border border-gold-300/30 hover:border-gold-300/60 hover:bg-gold-300/5 rounded-lg transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {isUpdate ? 'Submit Updated Hours' : 'Submit Gambling Hours'}
    </a>
  );
}
