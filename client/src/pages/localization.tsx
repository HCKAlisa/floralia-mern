import { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { app } from '../firebase';
import './localization.css';

type Session = { email: string; webglAvailable: boolean };
type Access = 'loading' | 'ready' | 'signed-out' | 'unavailable';

export default function Localization() {
    const [access, setAccess] = useState<Access>('loading');
    const [session, setSession] = useState<Session | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    async function login() {
        setBusy(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            const result = await signInWithPopup(getAuth(app), provider);
            const response = await fetch('/localization/api/login', {
                method: 'POST', credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: await result.user.getIdToken() }),
            });
            if (!response.ok) {
                setError(response.status === 403
                    ? 'This Google account doesn’t have localization access.'
                    : 'Sign-in failed. Please try again.');
                return;
            }
            window.location.reload();
        } catch {
            setError('Sign-in failed. Please try again.');
        } finally { setBusy(false); }
    }

    async function logout() {
        setBusy(true);
        try {
            const response = await fetch('/localization/api/logout', {
                method: 'POST', credentials: 'same-origin',
            });
            if (!response.ok) throw new Error('logout_failed');
            setSession(null);
            setAccess('signed-out');
            await signOut(getAuth(app));
        } catch { setError('Sign-in failed. Please try again.'); }
        finally { setBusy(false); }
    }

    useEffect(() => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 12000);
        let mounted = true;
        async function checkAccess() {
            try {
                const response = await fetch('/localization/api/session', {
                    credentials: 'same-origin', cache: 'no-store', redirect: 'manual', signal: controller.signal,
                });
                if (!mounted) return;
                if (response.type === 'opaqueredirect' || response.status === 403 || response.status === 401) {
                    setAccess('signed-out');
                } else if (!response.ok) {
                    setAccess('unavailable');
                } else {
                    const identity: Session = await response.json();
                    if (mounted && typeof identity.email === 'string'
                        && typeof identity.webglAvailable === 'boolean') {
                        setSession(identity);
                        setAccess('ready');
                    } else if (mounted) setAccess('unavailable');
                }
            } catch {
                if (mounted) setAccess('unavailable');
            } finally {
                window.clearTimeout(timeout);
            }
        }
        void checkAccess();
        return () => { mounted = false; controller.abort(); window.clearTimeout(timeout); };
    }, []);

    return (
        <div className="localization-page">
            <main className="localization-main">
                {access === 'ready' && session ? (
                    <section className="localization-content">
                        <header className="localization-header">
                            <h1>BloomTale localization</h1>
                            <button className="localization-button" onClick={logout} disabled={busy}>Sign out</button>
                        </header>
                        {error && <p role="alert">{error}</p>}
                        {session.webglAvailable ? (
                            <iframe
                                className="localization-game"
                                src="/localization/play/"
                                title="BloomTale localization"
                                allowFullScreen
                            />
                        ) : <p role="status">The test build hasn’t been uploaded yet.</p>}
                    </section>
                ) : (
                    <section className="localization-status" aria-live="polite" aria-busy={access === 'loading'}>
                        <h1>{access === 'loading' ? 'Checking access…' : 'BloomTale localization'}</h1>
                        {access === 'signed-out' && <>
                            <p>Sign in with your approved Google account.</p>
                            <button className="localization-button" onClick={login} disabled={busy}>Continue with Google</button>
                        </>}
                        {access === 'unavailable' && <p>Sign-in failed. Please try again.</p>}
                        {error && <p role="alert">{error}</p>}
                    </section>
                )}
            </main>
        </div>
    );
}
