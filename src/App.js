
import './App.css';

import { Route, Routes } from 'react-router-dom';
import React, {Suspense} from 'react';



const TestComponent = React.lazy(
  () => import('./Components/testComponent')
);
const DevComponent = React.lazy(
  () => import('./Components/devComponent')
);
const NotFoundComponent = React.lazy(
  () => import('./Components/notFoundComponent')
);
const Index = React.lazy(
  () => import('./views/index')
);
const EditComponent = React.lazy(
  () => import('./views/modeEdit/editTemplate')
);

function App() {
  return (
      <Suspense fallback={ <p>Chargement...</p> }>
        <Routes>
          <Route path='/'>
            <Route index element={ <Index/> } />
            <Route path='/edit/:id' element={ <EditComponent/> } />
          </Route>

          <Route path='/test'>
            <Route index element={ <TestComponent/> } />
          </Route>
        
          <Route path='/dev'>
            <Route index element={ <DevComponent/> } />
          </Route>

          <Route path='*' element= { <NotFoundComponent/> } />
        </Routes>

      </Suspense>
    
  );
}

export default App;
