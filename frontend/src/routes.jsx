import { Routes as RouterRoutes, Route } from 'react-router-dom'

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<div>Home</div>} />
      {/* More routes will be added */}
    </RouterRoutes>
  )
}

export default Routes