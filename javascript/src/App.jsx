import "./app.css";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Songs from "./Pages/Songs";
import ErrorPage from "./Pages/Error";
import {QueryClient, QueryClientProvider} from 'react-query'

function App() {
    const queryClient = new QueryClient()

    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/songs" element={<Songs/>}/>
                    <Route path="*" element={<ErrorPage/>}/>
                </Routes>
            </QueryClientProvider>
        </Router>
    )
        ;
}

export default App;