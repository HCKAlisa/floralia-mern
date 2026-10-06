import { useEffect, useState } from 'react';
import './localization.css';

type Session = { email: string; webglAvailable: boolean };
type Access = 'loading' | 'ready' | 'expired' | 'unavailable';

export default function Localization() {
    const [access, setAccess] = useState<Access>('loading');
    const [session, setSession] = useState<Session | null>(null);

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
                    setAccess('expired');
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
                        <h1>BloomTale localization</h1>
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
                        <h1>{access === 'loading' ? 'Checking access…' : access === 'expired'
                            ? 'Your session has ended. Reload this page to sign in again.'
                            : 'Access isn’t available yet. Please contact Kirby.'}</h1>
                    </section>
                )}
            </main>
        </div>
    );
}
