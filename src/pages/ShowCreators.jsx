import CreatorCard from '../components/CreatorCard';
import { Link } from 'react-router-dom';

function ShowCreators({ creators, setCreators }) {
  const handleDelete = (id) => {
    setCreators(prev => prev.filter(creator => creator.id !== id));
  };

  return (
    <main style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minHeight: '100vh',
      padding: '2rem 1rem'
    }}>
      <section style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        padding: '2rem 0'
      }}>
        <h2 style={{ 
          color: '#ffffff', 
          fontSize: '2.5rem', 
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          Discover Amazing Creators
        </h2>
        <p style={{ 
          color: '#cbd5e1', 
          fontSize: '1.125rem', 
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Explore and manage your favorite content creators from across the web
        </p>
        <Link 
          to="/new" 
          role="button"
          style={{ 
            textDecoration: 'none',
            fontSize: '1.125rem'
          }}
        >
          Add New Creator
        </Link>
      </section>

      {creators.length === 0 ? (
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ 
            textAlign: 'center', 
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '3rem 2rem',
            color: '#ffffff'
          }}>
            <h3 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Ready to Start Your Creator Universe?
            </h3>
            <p style={{ 
              color: '#cbd5e1', 
              fontSize: '1.125rem', 
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              Add your first creator to begin building your personal collection of amazing content creators!
            </p>
            <Link 
              to="/new" 
              role="button"
              style={{ textDecoration: 'none' }}
            >
              Add Your First Creator
            </Link>
          </div>
        </div>
      ) : (
        <div className="container">
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {creators.map((creator, index) => (
              <CreatorCard 
                key={creator.id} 
                creator={creator} 
                onDelete={handleDelete}
                animationDelay={index * 0.1}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default ShowCreators;