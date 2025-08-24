import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../client';

function ViewCreator() {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        setCreator(data);
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

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  if (loading) {
    return (
      <main style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        padding: '2rem 1rem'
      }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
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
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
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

  if (!creator) {
    return (
      <main style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        padding: '2rem 1rem'
      }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            textAlign: 'center', 
            color: '#f87171',
            padding: '2rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            marginTop: '2rem'
          }}>
            <h2>Creator not found</h2>
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
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <article style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          {creator.imageurl ? (
            <>
              <img 
                src={creator.imageurl} 
                alt={creator.name} 
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  marginBottom: '1.5rem',
                  border: '4px solid #e5e7eb'
                }}
                onError={handleImageError}
                loading="lazy"
              />
              <div style={{ display: 'none' }}>
                Image Not Available
              </div>
            </>
          ) : (
            <div style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '1rem',
              fontWeight: '500',
              marginBottom: '1.5rem',
              border: '4px solid #e5e7eb'
            }}>
              No Image Available
            </div>
          )}
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: '1rem'
            }}>
              {creator.name}
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#4b5563', 
              lineHeight: '1.7',
              maxWidth: '600px'
            }}>
              {creator.description}
            </p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '1rem'
          }}>
            <a 
              href={creator.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              role="button"
              style={{ textDecoration: 'none' }}
            >
              Visit {creator.name}'s Channel
            </a>
            <Link 
              to={`/edit/${creator.id}`} 
              role="button"
              className="secondary"
              style={{ textDecoration: 'none' }}
            >
              Edit Creator
            </Link>
            <Link 
              to="/" 
              role="button"
              className="secondary outline"
              style={{ textDecoration: 'none' }}
            >
              Back to All Creators
            </Link>
          </div>
        </article>
        
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </main>
  );
}

export default ViewCreator;