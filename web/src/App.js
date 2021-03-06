import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-sliding-pane/dist/react-sliding-pane.css";
import './App.css';
import Header from "components/UI/Header";
import Title from "components/UI/Title";
import Footer from "components/UI/Footer";
import Home from "pages/Home/Home";
import Subscriptions from 'pages/Subscriptions/Subscriptions';
import Settings from 'pages/Settings/Settings.jsx';
import About from "pages/About/About";

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
            </div>
            <div className="container-fluid" style={{ "padding": "20px", marginBottom: "90px" }}>
                <Switch>
                    <Route path="/subscriptions">
                        <Title text="Subscriptions" />
                        <Subscriptions />
                    </Route>
                    <Route path="/settings">
                        <Title text="Settings" />
                        <Settings />
                    </Route>
                    <Route path="/about">
                        <Title text="About" />
                        <About />
                    </Route>
                    <Route path="/">
                        <Title text="Welcome to the Azure Marketplace Sandbox" />
                        <Home />
                    </Route>

                </Switch>
            </div>
            <Footer />
            <ToastContainer />
        </Router>
    );
}

export default App;
