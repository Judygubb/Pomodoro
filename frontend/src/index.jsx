import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainPresenter from './presenters/mainPresenter.jsx' // Point to the presenter instead!


createRoot(document.getElementById('root')).render(
<StrictMode>
<MainPresenter />
</StrictMode>,
) 