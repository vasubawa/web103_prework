import { Link } from 'react-router-dom';
import { supabase } from '../client';

function CreatorCard({ creator, onDelete, animationDelay = 0 }) {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${creator.name}? This action cannot be undone.`)) {
      try {
        const { error } = await supabase.from('creators').delete().eq('id', creator.id);
        if (error) throw new Error(`Delete error: ${error.message}`);
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete creator. Please try again.');
      }
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <article 
      style={{ 
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        animationDelay: `${animationDelay}s`,
        animation: 'fadeInUp 0.6s ease forwards',
        opacity: 0
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
      }}
    >
      {creator.imageurl ? (
        <>
          <img 
            src={creator.imageurl} 
            alt={creator.name} 
            onError={handleImageError}
            loading="lazy"
            style={{ 
              width: '100%', 
              height: '200px', 
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
          <div style={{ 
            width: '100%', 
            height: '200px', 
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            display: 'none', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#6b7280',
            fontStyle: 'italic',
            flexShrink: 0
          }}>
            Image Not Available
          </div>
        </>
      ) : (
        <div style={{ 
          width: '100%', 
          height: '200px', 
          background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#6b7280',
          fontStyle: 'italic',
          flexShrink: 0
        }}>
          No Image Available
        </div>
      )}
      
      <div style={{ 
        padding: '1.5rem', 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          color: '#1f2937', 
          marginBottom: '0.75rem', 
          lineHeight: '1.3' 
        }}>
          {creator.name}
        </h3>
        <p style={{ 
          color: '#6b7280', 
          lineHeight: '1.6', 
          marginBottom: 0, 
          flexGrow: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {creator.description}
        </p>
      </div>
      
      <div style={{ 
        padding: '1rem 1.5rem 1.5rem', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem',
        marginTop: 'auto'
      }}>
        <a 
          href={creator.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          role="button"
          style={{ textDecoration: 'none', fontSize: '0.85rem' }}
          title={`Visit ${creator.name}'s channel`}
        >
          Visit
        </a>
        <Link 
          to={`/creator/${creator.id}`} 
          role="button"
          className="secondary"
          style={{ textDecoration: 'none', fontSize: '0.85rem' }}
          title={`View ${creator.name}'s details`}
        >
          View
        </Link>
        <Link 
          to={`/edit/${creator.id}`} 
          role="button"
          className="secondary"
          style={{ textDecoration: 'none', fontSize: '0.85rem' }}
          title={`Edit ${creator.name}`}
        >
          Edit
        </Link>
        <button 
          onClick={handleDelete} 
          className="secondary"
          style={{ fontSize: '0.85rem', backgroundColor: '#ef4444', borderColor: '#ef4444' }}
          title={`Delete ${creator.name}`}
        >
          Delete
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </article>
  );
}

export default CreatorCard;