import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Menu from "../template/Menu/Menu";
import Pages from "./Pages";

@inject("usuarioStore")
@observer
class App extends Component {
    render() {
        const {isAuthenticated} = this.props.usuarioStore;

        return (
            <div className={`main`}>
                <Menu/>
                <Pages isAuthenticated={isAuthenticated}/>
                <ToastContainer/>
            </div>
        );
    }
}

export default App;
