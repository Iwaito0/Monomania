import {createBrowserRouter,RouterProvider} from "react-router-dom";
import ErrorPage from "./ErrorPage";
import InicioSesion from "./InicioSesion";
import Home from "./Home";
import Novelas from "./Novelas/ListarNovelas";
import Peliculas from "./Peliculas/ListarPeliculas";
import AgregaPelicula from "./Peliculas/AgregaPelicula";
import AgregarNovela from "./Novelas/AgregarNovela";
import Categoria from "./Categoria/Categoria";
import Listado from "./Listados/Listado";
import ListadoCatPel from "./Listados/ListadoCatPel";
import ListadoCatNov from "./Listados/ListadoCatNov";
//import Listado from "./Listado";

const router = createBrowserRouter([
  {
    path: "/",
    element:<InicioSesion />,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "home",
    element:<Home />,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "novelas",
    element:<Novelas />,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "peliculas",
    element:<Peliculas />,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "agregaPelicula",
    element:<AgregaPelicula />,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "agregaNovela",
    element:<AgregarNovela />,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "categoria",
    element:<Categoria />,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "listadoPelAll",
    element: <Listado />,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "listadoAll",
    element: <Listado />,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "listadoCatPel",
    element: <ListadoCatPel />,
    errorElement: <ErrorPage />,

  },
  {
    path: "listadoCatNov",
    element: <ListadoCatNov />,
    errorElement: <ErrorPage />,
    
  },
]);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;
