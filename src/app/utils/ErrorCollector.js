import React from "react";
import Notification from "../components/Notification";

class ErrorCollector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mensagem: props.mensagem,
            hasError: false,
            isOpen: false,
            variant: '',
            message: ''
        };
    }

    closeNotification = () => {
        this.setState({
            message: '',
            variant: '',
            isOpen: false
        })

    }

    resetNotification = () => {
        this.setState({
            message: '',
            variant: '',
            isOpen: false
        })
    }

    openNotification = (message, variant) => {
        this.setState({
            message: message,
            variant: variant,
            isOpen: true
        })
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            hasError: error,
            errorInfo: errorInfo
        });
        const mensagem = this.state.mensagem ? this.state.mensagem : 'Ocorreu um erro, se o erro persistir contate o suporte!';
        this.openNotification(mensagem, 'error');
    }

    render() {

        if (this.state.hasError) {

            return (
                <div>

                    <Notification
                        close={this.closeNotification}
                        reset={this.resetNotification}
                        isOpen={this.state.isOpen}
                        variant={this.state.variant}
                        message={this.state.message}
                    />
                </div>
            )
        }
        return this.props.children;
    }
}

export default ErrorCollector