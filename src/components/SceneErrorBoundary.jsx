import { Component } from 'react';

export default class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('[SceneErrorBoundary]', error?.message || error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="fixed inset-0 z-0"
          style={{ background: '#050508' }}
          aria-hidden
        />
      );
    }
    return this.props.children;
  }
}
