import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';

function EditCreator({ setCreators }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageurl: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    async function fetchCreator() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('creators')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            throw new Error('Creator not found');
          }
          throw new Error(`Failed to load creator: ${error.message}`);
        }
        
        const creatorData = {
          name: data.name || '',
          url: data.url || '',
          description: data.description || '',
          imageurl: data.imageurl || '',
        };
        
        setFormData(creatorData);
        setOriginalData(creatorData);
      } catch (err) {
        console.error('Fetch creator error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCreator();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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

      const { error } = await supabase
        .from('creators')
        .update(formData)
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to update creator: ${error.message}`);
      }

      navigate(`/creator/${id}`, { 
        state: { message: `Successfully updated ${formData.name}!` }
      });
    } catch (err) {
      console.error('Update creator error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const hasChanges = originalData && (
    formData.name !== originalData.name ||
    formData.url !== originalData.url ||
    formData.description !== originalData.description ||
    formData.imageurl !== originalData.imageurl
  );

  if (loading) {
    return (
      <main style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        padding: '2rem 1rem'
      }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ 
            textAlign: 'center', 
            color: '#ffffff',
            fontSize: '1.25rem',
            padding: '3rem' 
          }}>
            <h2>Loading creator details...</h2>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        padding: '2rem 1rem'
      }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ 
            textAlign: 'center', 
            color: '#f87171',
            padding: '2rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            marginTop: '2rem'
          }}>
            <h2>Error: {error}</h2>
            <Link to="/" role="button" style={{ marginTop: '1rem', textDecoration: 'none' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
          Edit Creator
        </h2>

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
              disabled={submitting}
              placeholder="e.g., PewDiePie, MrBeast, etc."
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
              disabled={submitting}
              placeholder="https://youtube.com/@example or https://twitch.tv/example"
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
              disabled={submitting}
              placeholder="Tell us what makes this creator special..."
              rows="4"
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
              disabled={submitting}
              placeholder="https://example.com/image.jpg"
            />
            <small style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
              Add a profile picture or channel logo to make the card more visual
            </small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button 
              type="submit" 
              disabled={submitting || !hasChanges}
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <Link 
              to={`/creator/${id}`} 
              role="button"
              className="secondary"
              style={{ textDecoration: 'none' }}
            >
              Cancel
            </Link>
          </div>
          
          {!hasChanges && originalData && (
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', marginTop: '1rem' }}>
              Make changes to enable the save button
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

export default EditCreator;