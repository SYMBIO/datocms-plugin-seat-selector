import React, { Component } from 'react';
import PropTypes from 'prop-types';

import connectToDatoCms from './connectToDatoCms';
import './style.css';

const bindings = {
  10: { maxRow: 18, maxSeat: 25 },
  20: { maxRow: 22, maxSeat: 6 },
  21: { maxRow: 24, maxSeat: 6 },
  22: { maxRow: 24, maxSeat: 5 },
  23: { maxRow: 6, maxSeat: 3 },
  31: { maxRow: 7, maxSeat: 16 },
  32: { maxRow: 7, maxSeat: 63 },
  40: {
    minRow: 13, maxRow: 13, minSeat: 1, maxSeat: 2,
  },
};

@connectToDatoCms(plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath),
  setFieldValue: (val) => {
    plugin.setFieldValue(plugin.fieldPath, val);
  },
}))

export default class Main extends Component {
  static propTypes = {
    fieldValue: PropTypes.number,
    setFieldValue: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { fieldValue } = this.props;

    if (fieldValue) {
      this.state = {
        placement: Math.floor(fieldValue / 10000),
        row: Math.floor((fieldValue % 10000) / 100),
        seat: fieldValue % 100,
      };
    } else {
      this.state = {
        placement: '10',
        row: 1,
        seat: 1,
      };
    }

    this.handlePlacementChange = this.handlePlacementChange.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.handleSeatChange = this.handleSeatChange.bind(this);
    this.updateFieldValue = this.updateFieldValue.bind(this);
  }

  getRowOptions(placement) {
    const bind = bindings[placement] || bindings['10'];
    const result = [];
    for (let row = bind.minRow || 1; row <= bind.maxRow; row += 1) {
      result.push(<option key={`row${row}`} value={row}>{`Řada ${row}`}</option>);
    }
    return result;
  }

  getSeatOptions(placement) {
    const bind = bindings[placement] || bindings['10'];
    const result = [];
    for (let seat = bind.minSeat || 1; seat <= bind.maxSeat; seat += 1) {
      result.push(<option key={`seat${seat}`} value={seat}>{`Sedadlo ${seat}`}</option>);
    }
    return result;
  }

  handleSeatChange(event) {
    this.setState({ seat: event.target.value }, this.updateFieldValue);
  }

  handleRowChange(event) {
    this.setState({ row: event.target.value, seat: 1 }, this.updateFieldValue);
  }

  handlePlacementChange(event) {
    this.setState({ placement: event.target.value, row: 1, seat: 1 }, this.updateFieldValue);
  }

  updateFieldValue() {
    const { setFieldValue } = this.props;
    const { placement, row, seat } = this.state;
    setFieldValue((placement * 10000) + (row * 100) + (seat * 1));
  }

  render() {
    const { placement, row, seat } = this.state;

    return (
      <div className="container">
        <select value={placement} onChange={this.handlePlacementChange}>
          <option value={10}>Přízemí</option>
          <option value={20}>Lóže přízemí</option>
          <option value={21}>Lóže I. pořadí</option>
          <option value={22}>Lóže II. pořadí</option>
          <option value={23}>Lóže III. pořadí</option>
          <option value={31}>I. balkon</option>
          <option value={32}>II. balkon</option>
          <option value={40}>Vozíčkář</option>
        </select>
        <select value={row} onChange={this.handleRowChange}>
          {this.getRowOptions(placement)}
        </select>
        <select value={seat} onChange={this.handleSeatChange}>
          {this.getSeatOptions(placement)}
        </select>
      </div>
    );
  }
}
