import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleHeader, BabbleUserSelectionToolbar, BabbleUserAvatar } from '../components';
//import { PlusCircleIcon, XCircleIcon } from '../components/icons';

const testUsers = [
  [ 'Chino Lex', 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/27540184_10210530825621359_6792294337055482922_n.jpg?_nc_cat=105&_nc_sid=dbb9e7&_nc_oc=AQnYidMYyQUrvjP6MFHulnQOiy2gZ5ekR3B94ntFP74Kf4hF78qF1mjrqfghBb_3GtVYNhMV-1810vIj8UwecVOq&_nc_ht=scontent-sea1-1.xx&oh=065912c58eaa9545dc03c061a3abb141&oe=5ECFCA51' ],
  [ 'Spencer Costanzo', 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/29258410_10156136187059906_3157413525008603151_n.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_oc=AQm6Ezj3hpiA6MOz_s3XbqHe6FAWJ_iBrHGexrI6AWd4ZpuhXzr2aersBKKHNZR4rSFU-77qolEJjehbxLGDoY8I&_nc_ht=scontent-sea1-1.xx&oh=f23e43fbf1d116c3f95a72fa91f4045e&oe=5ECFD166' ],
  [ 'Max Holmes', 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/48406353_10213592207343715_762772413514514432_o.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_oc=AQk0MKia__HXoG_Ca4ikK-pHX7Bt9YhOsE7QRoHchJVTHiLkrE1KE7RvFL6ckBeGQU-ihYbEMIeVTi3qFLEm-XUR&_nc_ht=scontent-sea1-1.xx&oh=dd78b0b130357c30daef2dcd55c49db7&oe=5ED141C8' ],
  [ 'Lindsey Hankwitz', 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p120x120/70964612_10157568508843839_5780755693829095424_n.jpg?_nc_cat=100&_nc_sid=7206a8&_nc_oc=AQla6re-gNLDgfTLzRcn_fBRj7h6fNPd7I_nGtsldhjZAWLwo2C3DhOnt_Dr8RHZF1W1Us3qCgyRv_GQyEckTD6Q&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=2eacdc2a20a18dbc87ff30dabb1e200a&oe=5ED159C3' ],
  [ 'Alex Filatov', 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p120x120/12717707_10205908719979367_3491263903448795284_n.jpg?_nc_cat=102&_nc_sid=7206a8&_nc_oc=AQm8MPbmA0rc8YmzpL-h2WJ_i18vMvIOcE7TvYFyXv2ViLjV0qMF_34YsPYyN2wjA-tjLjGtwmCFi2-pKP1RVrB7&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=1eebd12ca2289c6a7b8e921a4b995756&oe=5ECFDF3D' ],
];

export default class ConversationScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BabbleHeader
          back
          title={'New Message'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
        />

        <BabbleUserSelectionToolbar
          label={'To:'}
          style={{ marginTop: 100 }}
        />
{/*}
        <View style={styles.users}>
          <Text style={styles.toText}>To:</Text>

          {false && testUsers.map((user, index) => (
            <TouchableOpacity key={index} style={styles.user}>
              <BabbleUserAvatar
                source={{ uri: user[1] }}
                size={20}
                style={styles.userAvatar}
                activityIconStyle={styles.userAvatarActivityIcon}
              />

              <Text style={styles.userNameText}>{user[0]}</Text>
            </TouchableOpacity>
          ))}

          <TextInput
            placeholderColor={'#909090'}
            placeholder={'The World'}
            style={styles.userInput}
          />

          <TouchableOpacity style={styles.addButton}>
            <PlusCircleIcon style={styles.addButtonIcon} />
          </TouchableOpacity>
        </View>{*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  addButtonIcon: {
    color: '#2A99CC',
  },
  container: {
    flex: 1,
  },
  toText: {
    color: '#909090',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
    marginRight: 15,
  },
  userInput: {
//    backgroundColor: '#000',
    color: '#404040',
    flex: 1,
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
    minWidth: 150,
    paddingVertical: 10,
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
  userAvatar: {
    marginRight: 5,
  },
  userAvatarActivityIcon: {
    borderWidth: 1,
    height: 8,
    right: -2,
    top: -2,
    width: 8,
  },
  userNameText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
  },
  users: {
    alignItems: 'center',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 100,
    padding: 10,
    width: '100%',
  },
});
