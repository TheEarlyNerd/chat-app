import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleUserAvatar } from './';

export default class BabbleUserSelectionToolbar extends Component {
  state = {
    selectedUserIndex: null,
    textInputValue: '',
    users: [
      [ 'Lindsey Hankwitz', 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p120x120/70964612_10157568508843839_5780755693829095424_n.jpg?_nc_cat=100&_nc_sid=7206a8&_nc_oc=AQla6re-gNLDgfTLzRcn_fBRj7h6fNPd7I_nGtsldhjZAWLwo2C3DhOnt_Dr8RHZF1W1Us3qCgyRv_GQyEckTD6Q&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=2eacdc2a20a18dbc87ff30dabb1e200a&oe=5ED159C3' ],
      [ 'Spencer Costanzo', 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/29258410_10156136187059906_3157413525008603151_n.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_oc=AQm6Ezj3hpiA6MOz_s3XbqHe6FAWJ_iBrHGexrI6AWd4ZpuhXzr2aersBKKHNZR4rSFU-77qolEJjehbxLGDoY8I&_nc_ht=scontent-sea1-1.xx&oh=f23e43fbf1d116c3f95a72fa91f4045e&oe=5ECFD166' ],
      [ 'Chino Lex', 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/27540184_10210530825621359_6792294337055482922_n.jpg?_nc_cat=105&_nc_sid=dbb9e7&_nc_oc=AQnYidMYyQUrvjP6MFHulnQOiy2gZ5ekR3B94ntFP74Kf4hF78qF1mjrqfghBb_3GtVYNhMV-1810vIj8UwecVOq&_nc_ht=scontent-sea1-1.xx&oh=065912c58eaa9545dc03c061a3abb141&oe=5ECFCA51' ],
      [ 'Max Holmes', 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/48406353_10213592207343715_762772413514514432_o.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_oc=AQk0MKia__HXoG_Ca4ikK-pHX7Bt9YhOsE7QRoHchJVTHiLkrE1KE7RvFL6ckBeGQU-ihYbEMIeVTi3qFLEm-XUR&_nc_ht=scontent-sea1-1.xx&oh=dd78b0b130357c30daef2dcd55c49db7&oe=5ED141C8' ],
      [ 'Alex Filatov', 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p120x120/12717707_10205908719979367_3491263903448795284_n.jpg?_nc_cat=102&_nc_sid=7206a8&_nc_oc=AQm8MPbmA0rc8YmzpL-h2WJ_i18vMvIOcE7TvYFyXv2ViLjV0qMF_34YsPYyN2wjA-tjLjGtwmCFi2-pKP1RVrB7&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=1eebd12ca2289c6a7b8e921a4b995756&oe=5ECFDF3D' ],
    ],
  }

  textInput = null;
  lastKeyPress = null;

  _onKeyPress = ({ nativeEvent }) => {
    const { key } = nativeEvent;
    const { textInputValue } = this.state;

    this.lastKeyPress = key;

    if (key === 'Backspace' && !textInputValue.length) {
      this._onChangeText(textInputValue);
    }
  }

  _onChangeText = text => {
    const { selectedUserIndex, textInputValue, users } = this.state;
    const state = {
      textInputValue: text,
      selectedUserIndex: null,
    };

    if (this.lastKeyPress === 'Backspace' && (!textInputValue.length || selectedUserIndex !== null)) {
      if (selectedUserIndex !== null) {
        state.users = users.filter((user, index) => index !== selectedUserIndex);
        state.textInputValue = '';
      } else if (users.length > 0) {
        state.selectedUserIndex = users.length - 1;
      }
    }

    this.setState(state);
  }

  _userPress = userIndex => {
    this.textInput.focus();
    this.setState({ selectedUserIndex: userIndex });
  }

  _toolbarPress = () => {
    this.textInput.focus();
    this.setState({ selectedUserIndex: null });
  }

  render() {
    const { label, placeholder, style } = this.props;
    const { selectedUserIndex, textInputValue, users } = this.state;

    return (
      <TouchableWithoutFeedback onPress={this._toolbarPress}>
        <View style={[ styles.container, style ]}>
          <Text style={styles.labelText}>{label}</Text>

          {users.map((user, index) => (
            <TouchableOpacity
              onPress={() => this._userPress(index)}
              key={index}
              style={[
                styles.user,
                (index === selectedUserIndex) ? styles.userSelected : null,
              ]}
            >
              <BabbleUserAvatar
                source={{ uri: user[1] }}
                size={20}
                style={styles.avatar}
                activityIconStyle={styles.avatarActivityIcon}
              />

              <Text
                style={[
                  styles.nameText,
                  (index === selectedUserIndex) ? styles.nameSelectedText : null,
                ]}
              >
                {user[0]}
              </Text>
            </TouchableOpacity>
          ))}

          <TextInput
            caretHidden={selectedUserIndex !== null}
            onKeyPress={this._onKeyPress}
            onChangeText={this._onChangeText}
            placeholder={(!users.length) ? placeholder : ''}
            returnKeyType={'done'}
            value={textInputValue}
            style={styles.textInput}
            ref={component => this.textInput = component}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    marginRight: 5,
  },
  avatarActivityIcon: {
    borderWidth: 1,
    height: 8,
    right: -2,
    top: -2,
    width: 8,
  },
  container: {
    alignItems: 'center',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    width: '100%',
  },
  labelText: {
    color: '#909090',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    marginRight: 10,
  },
  nameSelectedText: {
    color: '#FFFFFF',
  },
  nameText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
  },
  textInput: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    marginLeft: 5,
    paddingVertical: 5,
  },
  user: {
    alignItems: 'center',
    backgroundColor: '#F1F2F6',
    borderRadius: 4,
    flexDirection: 'row',
    marginBottom: 5,
    marginRight: 5,
    padding: 5,
  },
  userSelected: {
    backgroundColor: '#2A99CC',
  },
});
