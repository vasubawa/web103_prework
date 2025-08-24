import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';

function AddCreator({ setCreators }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageurl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      try {
        new URL(formData.url);
      } catch {
        throw new Error('Please enter a valid URL for the creator\'s channel');
      }

      if (formData.imageurl) {
        try {
          new URL(formData.imageurl);
        } catch {
          throw new Error('Please enter a valid URL for the image');
        }
      }

      const { data, error } = await supabase
        .from('creators')
        .insert([formData])
        .select();

      if (error) {
        throw new Error(`Failed to add creator: ${error.message}`);
      }

      if (data && data.length > 0) {
        navigate('/', { 
          state: { message: `Successfully added ${formData.name} to your creator list!` }
        });
      }
    } catch (err) {
      console.error('Add creator error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minHeight: '100vh',
      padding: '2rem 1rem'
    }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#ffffff', 
          fontSize: '2rem', 
          fontWeight: '700',
          marginBottom: '2rem'
        }}>
          Add New Creator
        </h2>
        
        {error && (
          <div style={{ 
            marginBottom: '2rem', 
            textAlign: 'center', 
            color: '#f87171',
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)' 
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="name">Creator Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., PewDiePie, MrBeast, etc."
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="url">Channel/Profile URL *</label>
            <input
              id="url"
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://youtube.com/@example or https://twitch.tv/example"
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Tell us what makes this creator special and why you love their content..."
              rows="4"
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="imageurl">Profile Image URL (optional)</label>
            <input
              id="imageurl"
              type="url"
              name="imageurl"
              value={formData.imageurl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
            <small style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
              Add a profile picture or channel logo to make the card more visual
            </small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ height: 'auto', minHeight: '44px', display: 'flex', alignItems: 'center' }}
            >
              {loading ? 'Adding Creator...' : 'Add Creator'}
            </button>
            <Link 
              to="/" 
              role="button"
              className="secondary"
              style={{ 
                textDecoration: 'none', 
                height: 'auto', 
                minHeight: '44px', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AddCreator;