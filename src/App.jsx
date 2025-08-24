import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from './client';
import ShowCreators from './pages/ShowCreators';
import ViewCreator from './pages/ViewCreator';
import EditCreator from './pages/EditCreator';
import AddCreator from './pages/AddCreator';

function App() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCreators() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('creators')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`Failed to load creators: ${error.message}`);
        }

        setCreators(data || []);
      } catch (err) {
        console.error('Fetch creators error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCreators();

    const subscription = supabase
      .channel('creators-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'creators' }, 
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setCreators(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCreators(prev => prev.map(creator => 
              creator.id === payload.new.id ? payload.new : creator
            ));
          } else if (payload.eventType === 'DELETE') {
            setCreators(prev => prev.filter(creator => 
              creator.id !== payload.old.id
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#cbd5e1' }}>
          <h2>Loading Creatorverse...</h2>
          <p>Preparing your amazing creators for display</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#f87171' }}>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            color: '#ffffff', 
            marginBottom: '0.5rem',
            textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
          }}>
            Creatorverse
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '2rem' }}>
            Your personal collection of amazing content creators
          </p>
          <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/" 
              role="button"
              style={{ textDecoration: 'none' }}
            >
              Home
            </Link>
            <Link 
              to="/new" 
              role="button"
              className="secondary"
              style={{ textDecoration: 'none' }}
            >
              Add Creator
            </Link>
          </nav>
        </header>

        <Routes>
          <Route 
            path="/" 
            element={<ShowCreators creators={creators} setCreators={setCreators} />} 
          />
          <Route 
            path="/creator/:id" 
            element={<ViewCreator />} 
          />
          <Route 
            path="/edit/:id" 
            element={<EditCreator setCreators={setCreators} />} 
          />
          <Route 
            path="/new" 
            element={<AddCreator setCreators={setCreators} />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;