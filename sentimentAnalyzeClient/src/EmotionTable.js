import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
      return (  
        <div>
          <table className="table table-bordered">
            <tbody>
                <tr>
                    <th>Emotion</th>
                    <th>Value (between 0 and 1)</th>
                </tr>
            {
                Object.keys(this.props.emotions).map((key, i) => (
                <tr key={i}>
                    <td>{key}</td>
                    <td>{this.props.emotions[key]}</td>
                </tr>
                ))
            }
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;
