import {Component} from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: React.ReactNode[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: object;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: {componentStack: ""},
    };
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true};
  }

  componentDidCatch(error: Error | null, info: object) {
    console.log("error", error);
    this.setState({hasError: true, error, info});
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2 style={{padding: "2em"}}>
            Что-то пошло не так. Пожалуйста, обновите страницу.
          </h2>
        </div>
      );

    }
    return this.props.children;
  }
}

export default ErrorBoundary;
