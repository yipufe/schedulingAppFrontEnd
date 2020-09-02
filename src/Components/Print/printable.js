import React from 'react';

class Printable extends React.Component {
  render() {
    return (
        <div>
            {this.props.children}
        </div>
    );
  }
}

export default Printable;