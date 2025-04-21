import React, { useState } from 'react';
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
      }
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rsvp-modal-overlay" onClick={onClose}>
      <div className="rsvp-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>RSVP for Our Special Day</h2>
        <p className="rsvp-date">September 9, 2025</p>

        {/* Hidden form that Netlify can parse at build time */}
        <form
          name="wedding-rsvp"
          data-netlify="true"
          netlify-honeypot="bot-field"
          hidden
        >
          <input type="text" name="name" />
          <input type="email" name="email" />
          <input type="checkbox" name="hasPlusOne" />
          <input type="text" name="plusOneName" />
          <input type="checkbox" name="dietary-vegan" />
          <input type="checkbox" name="dietary-vegetarian" />
          <input type="checkbox" name="dietary-glutenFree" />
          <input type="checkbox" name="dietary-dairyFree" />
          <input type="checkbox" name="dietary-nutAllergy" />
          <input type="checkbox" name="dietary-shellfish" />
          <input type="checkbox" name="dietary-other" />
          <input type="text" name="otherDietaryRestrictions" />
          <select name="attending"></select>
          <textarea name="message"></textarea>
        </form>

        {/* Actual form that gets rendered */}
        <form
          name="wedding-rsvp"
          method="POST"
          className="rsvp-form"
          data-netlify="true"
          netlify-honeypot="bot-field"
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

          <button type="submit" className="submit-button">
            Submit RSVP
          </button>
        </form>
      </div>
    </div>
  );
};

export default RSVPForm;
