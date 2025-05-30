import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { store, persistor } from './redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import {HeroUIProvider} from '@heroui/react'

createRoot(document.getElementById('root')!).render(
    <PersistGate persistor={persistor}>
        <Provider store={store}>
            <Router>
                <HeroUIProvider>
                    <App />
                </HeroUIProvider>
            </Router>
        </Provider>
    </PersistGate>

)
