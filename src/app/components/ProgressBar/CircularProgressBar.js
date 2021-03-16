import React from "react";
import "./CircularProgressBar.scss";

class CircularProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: 0
    };
  }
  componentDidMount() {
    const { percentage } = this.props;
    
    this.setState({ percentage });
  }
  
  componentDidUpdate(prevProps) {
    const { percentage } = this.props;
    
    if (percentage !== prevProps.percentage) {
      this.setState({ percentage });
    }
  }

  render() {
    const { percentage } = this.state;
    const { children } = this.props;
    // Size of the enclosing square
    const sqSize = this.props.sqSize;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (this.props.sqSize - this.props.strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - (dashArray * percentage) / 100;

    return (
      <svg
        width={this.props.sqSize}
        height={this.props.sqSize}
        viewBox={viewBox}
      >
        <circle
          className="circle-background"
          cx={this.props.sqSize / 2}
          cy={this.props.sqSize / 2}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
        />
        <circle
          className="circle-progress"
          cx={this.props.sqSize / 2}
          cy={this.props.sqSize / 2}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
          // Start progress marker at 12 O'Clock
          transform={`rotate(-90 ${this.props.sqSize / 2} ${this.props.sqSize /
            2})`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset
          }}
        />
        {!children && (
          <text
            className="circle-text"
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle"
          >
            {`${percentage}%`}
          </text>
        )}
        {children || null}
      </svg>
    );
  }
}

CircularProgressBar.defaultProps = {
  sqSize: 144,
  percentage: 0,
  strokeWidth: 10
};

export default CircularProgressBar;
