import React from 'react/addons';
import reactMixin from 'react-mixin';

import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import AutoComplete from 'material-ui/lib/auto-complete';
import zipCodes from '../constants/zip-be';

export default class AddressInput extends React.Component {
  static propTypes = {
    address: React.PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = Object.assign({
      street: '',
      zipCode: '',
      city: '',
      country: 'Belgium'
    }, this.props.address);
  }

  render() {
    let matchedCities = [];
    if (this.state.zipCode.length > 0) {
      matchedCities =
        zipCodes.filter((obj) => obj.zip === this.state.zipCode);
    }

    return (
      <div>
        <TextField
          hintText="Street"
          fullWidth={true}
          valueLink={this.linkState('street')}
          />
        <div>
          <TextField
            hintText="Zip"
            valueLink={this.linkState('zipCode')}
            />
          <AutoComplete
            hintText="City"
            dataSource={matchedCities.map(obj => obj.city)}
            />
        </div>
        <SelectField
          style={{marginTop: 24}}
          hintText="Country"
          fullWidth={true}
          valueLink={this.linkState('country')}
          valueMember="text"
          displayMember="text"
          menuItems={[
            {
              payload: 1,
              text: 'Belgium'
            },
            {
              payload: 2,
              text: 'Netherlands'
            },
            {
              payload: 3,
              text: 'Germany'
            }
          ]} />
      </div>
    );
  }
}

reactMixin(AddressInput.prototype, React.addons.LinkedStateMixin);
