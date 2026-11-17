import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser, signInWithEmail, signUpWithEmail, signOut } from '../lib/auth';

export function AuthGate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { user } = await getCurrentUser();
      setUserName(user?.email ?? null);

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        setProfileName(data?.full_name || user.email || 'Student');
      }
    };

    loadUser();
  }, []);

  const handleSignIn = async () => {
    setError(null);
    const { error } = await signInWithEmail(email, password);
    if (error) setError(error.message);
    else {
      const { user } = await getCurrentUser();
      setUserName(user?.email ?? null);
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user!.id).single();
      setProfileName(data?.full_name || user?.email || 'Student');
    }
  };

  const handleSignUp = async () => {
    setError(null);
    const { error } = await signUpWithEmail(email, password, fullName);
    if (error) setError(error.message);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserName(null);
    setProfileName(null);
    setEmail('');
    setPassword('');
    setFullName('');
  };

  if (userName) {
    return (
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <p><strong>Signed in as:</strong> {profileName || userName}</p>
        <button className="secondary" onClick={handleSignOut}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '32px auto', display: 'grid', gap: 12, padding: 24 }}>
      <h2>Sign in / sign up</h2>
      <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="primary" onClick={handleSignIn}>Sign in</button>
        <button className="secondary" onClick={handleSignUp}>Create account</button>
      </div>
    </div>
  );
}
