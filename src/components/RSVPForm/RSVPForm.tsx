import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  plusOne: boolean;
}

const RSVPForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    plusOne: false,
  });

  return (
    <div style={{ marginBottom: '150px' }}>
      <form
        name="homiemoon-rsvp"
        className="rsvp-form"
        data-netlify="true"
        method="POST"
      >
        <input type="hidden" name="form-name" value="homiemoon-rsvp" />
        <input
          name="name"
          placeholder="Your Name"
          className="rsvp-input"
          required
        />
        <input
          name="email"
          placeholder="Your Email"
          type="email"
          className="rsvp-input"
          required
        />
        <input
          name="plusOne"
          placeholder="Are you coming/bringing some one?"
          type="text"
          className="rsvp-input"
          required
        />
        <button type="submit" className="rsvp-button">
          RSVP
        </button>
      </form>
    </div>
  );
};

export default RSVPForm;
