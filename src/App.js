//components or pages
import Home from "./pages/Home/Home";
import Sign from "./pages/Sign/Sign";
//redux
import { store } from "./redux/store/store";
import {Provider} from "react-redux";

//routing
import { createBrowserRouter,RouterProvider } from "react-router-dom";
//styling
import './App.css';
//notifications
import { ToastContainer } from 'react-toastify';
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import ErrorFallBackUI from "./pages/ErrorFallBackUI/ErrorFallBackUI";



function App() {

  //router
  const router=createBrowserRouter([
    {
      index:true,
      element:<Home/>,
      errorElement:<ErrorFallBackUI/>
    },
    {
      path:"/sign",
      element:<Sign/>,
      errorElement:<ErrorFallBackUI/>,
      children:[
        {
          path:"signup",
          element:<SignUpForm/>
        },{
          path:"signin",
          element:<SignInForm/>
        }
      ]
    }
  ]);

  return (
  
      <div className="App position-absolute top-50 start-50 translate-middle">
        <Provider store={store}>  
          <RouterProvider router={router}/>
          <ToastContainer autoClose="1500"/>
        </Provider>
      </div>
    
  );
}

export default App;
