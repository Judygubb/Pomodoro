import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainPresenter from './presenters/mainPresenter.jsx' 


createRoot(document.getElementById('root')).render(
<StrictMode>
<MainPresenter />
</StrictMode>,
) 