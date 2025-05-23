import React, { useState, FormEvent } from 'react';
import './RSVPForm.scss';

interface RSVPFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ isOpen, onClose }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    plusOneName: '',
    hasPlusOne: false,
    attendingBrunch: false,
    dietaryRestrictions: {
      vegan: false,
      vegetarian: false,
      glutenFree: false,
      dairyFree: false,
      nutAllergy: false,
      shellfish: false,
      other: false,
    },
    otherDietaryRestrictions: '',
    attending: 'yes',
    message: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('dietary-')) {
        const restriction = name.replace('dietary-', '');
        setFormState((prev) => ({
          ...prev,
          dietaryRestrictions: {
            ...prev.dietaryRestrictions,
            [restriction]: checkbox.checked,
          },
        }));
      } else if (name === 'hasPlusOne') {
        setFormState((prev) => ({
          ...prev,
          hasPlusOne: checkbox.checked,
          plusOneName: checkbox.checked ? prev.plusOneName : '',
        }));
      } else if (name === 'attendingBrunch') {
        setFormState((prev) => ({
          ...prev,
          attendingBrunch: checkbox.checked,
        }));
      }
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionStatus('submitting');

    try {
      // Create an object with all form data
      const formData = {
        'form-name': 'wedding-rsvp', // This must match the form name in the static HTML file
        name: formState.name,
        email: formState.email,
        hasPlusOne: formState.hasPlusOne,
        plusOneName: formState.plusOneName,
        attending: formState.attending,
        attendingBrunch: formState.attendingBrunch,
        message: formState.message,
        'dietary-vegan': formState.dietaryRestrictions.vegan,
        'dietary-vegetarian': formState.dietaryRestrictions.vegetarian,
        'dietary-glutenFree': formState.dietaryRestrictions.glutenFree,
        'dietary-dairyFree': formState.dietaryRestrictions.dairyFree,
        'dietary-nutAllergy': formState.dietaryRestrictions.nutAllergy,
        'dietary-shellfish': formState.dietaryRestrictions.shellfish,
        'dietary-other': formState.dietaryRestrictions.other,
        otherDietaryRestrictions: formState.otherDietaryRestrictions,
      };

      const dietaryRestrictionsArray = Object.entries(
        formState.dietaryRestrictions,
      )
        .filter(([_, isChecked]) => isChecked)
        .map(([restriction]) => restriction);

      if (dietaryRestrictionsArray.length > 0) {
        formData['dietaryRestrictionsFormatted'] =
          dietaryRestrictionsArray.join(', ');
      }

      // Encode the data for application/x-www-form-urlencoded format
      const encodedData = Object.keys(formData)
        .map(
          (key) =>
            encodeURIComponent(key) +
            '=' +
            encodeURIComponent(String(formData[key as keyof typeof formData])),
        )
        .join('&');

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodedData,
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setFormState({
          name: '',
          email: '',
          plusOneName: '',
          hasPlusOne: false,
          attendingBrunch: false,
          dietaryRestrictions: {
            vegan: false,
            vegetarian: false,
            glutenFree: false,
            dairyFree: false,
            nutAllergy: false,
            shellfish: false,
            other: false,
          },
          otherDietaryRestrictions: '',
          attending: 'yes',
          message: '',
        });
      } else {
        console.error(
          'Form submission error:',
          response.status,
          response.statusText,
        );
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus('error');
    }
  };

  if (!isOpen) return null;

  if (submissionStatus === 'success') {
    return (
      <div className="rsvp-modal-overlay" onClick={onClose}>
        <div
          className="rsvp-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <div className="success-message">
            <h2>Thank You!</h2>
            <p>Your RSVP has been successfully submitted.</p>
            <p>We can't wait to celebrate with you!</p>
            <button className="submit-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rsvp-modal-overlay" onClick={onClose}>
      <div className="rsvp-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>RSVP for Our Special Day</h2>
        <p className="rsvp-date">September 9, 2025</p>

        {/* Actual form that gets rendered */}
        <form
          name="wedding-rsvp"
          method="POST"
          className="rsvp-form"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
        >
          {/* Required hidden fields for Netlify */}
          <input type="hidden" name="form-name" value="wedding-rsvp" />
          <p className="hidden">
            <label>
              Don't fill this out if you're human: <input name="bot-field" />
            </label>
          </p>

          <div className="form-group">
            <label htmlFor="name">Your Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group attending-group">
            <label htmlFor="attending">Will you be attending?*</label>
            <select
              id="attending"
              name="attending"
              value={formState.attending}
              onChange={handleChange}
              required
            >
              <option value="yes">Joyfully Accept</option>
              <option value="no">Regretfully Decline</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="hasPlusOne"
                checked={formState.hasPlusOne}
                onChange={handleChange}
              />
              <span className="checkbox-text">I'm bringing a plus one</span>
            </label>
          </div>

          {formState.hasPlusOne && (
            <div className="form-group">
              <label htmlFor="plusOneName">Plus One's Name</label>
              <input
                type="text"
                id="plusOneName"
                name="plusOneName"
                value={formState.plusOneName}
                onChange={handleChange}
              />
            </div>
          )}

          {formState.attending === 'yes' && (
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="attendingBrunch"
                  checked={formState.attendingBrunch}
                  onChange={handleChange}
                />
                <span className="checkbox-text">
                  I'll also attend the Sunday Brunch
                </span>
              </label>
              <p className="brunch-info">
                Join us for a relaxed brunch on Sunday to continue the
                celebration!
              </p>
            </div>
          )}

          <div className="form-group">
            <label>Dietary Restrictions (if any)</label>
            <div className="dietary-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="dietary-vegetarian"
                  checked={formState.dietaryRestrictions.vegetarian}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Vegetarian</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="dietary-vegan"
                  checked={formState.dietaryRestrictions.vegan}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Vegan</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="dietary-glutenFree"
                  checked={formState.dietaryRestrictions.glutenFree}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Gluten-Free</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="dietary-dairyFree"
                  checked={formState.dietaryRestrictions.dairyFree}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Dairy-Free</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="dietary-nutAllergy"
                  checked={formState.dietaryRestrictions.nutAllergy}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Nut Allergy</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="dietary-shellfish"
                  checked={formState.dietaryRestrictions.shellfish}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Shellfish Allergy</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="dietary-other"
                  checked={formState.dietaryRestrictions.other}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Other</span>
              </label>
            </div>
          </div>

          {formState.dietaryRestrictions.other && (
            <div className="form-group">
              <label htmlFor="otherDietaryRestrictions">
                Please specify other dietary restrictions
              </label>
              <input
                type="text"
                id="otherDietaryRestrictions"
                name="otherDietaryRestrictions"
                value={formState.otherDietaryRestrictions}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="message">Message for the couple (optional)</label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={submissionStatus === 'submitting'}
          >
            {submissionStatus === 'submitting'
              ? 'Submitting...'
              : 'Submit RSVP'}
          </button>

          {submissionStatus === 'error' && (
            <p className="error-message">
              There was an error submitting your RSVP. Please try again or
              contact us directly.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RSVPForm;
