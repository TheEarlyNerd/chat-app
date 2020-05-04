import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleUserAvatar } from './';

export default class BabbleConversationUsersToolbar extends Component {
  render() {
    const { style } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        <TouchableOpacity style={styles.user}>
          <BabbleUserAvatar
            activityIconStyle={styles.activityIconStyle}
            source={{ uri: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-9/71572992_2728234020533981_2005024985860538368_n.jpg?_nc_cat=105&_nc_sid=85a577&_nc_oc=AQm3dmHq4bGkok28oCH8ApLDfEeSaW_It8Sh_pSEX_TkbLpSGjaKsehzOC61rrBy4JhCoRFwIp-1is1cEmrOxA66&_nc_ht=scontent-sea1-1.xx&oh=39ff988af3d5e90acb04e560f6526acb&oe=5EC57631' }}
            size={35}
          />

          <Text style={styles.nameText} numberOfLines={1}>Braydon Batungbacal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.user}>
          <BabbleUserAvatar
            activityIconStyle={styles.activityIconStyle}
            source={{ uri: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p120x120/12717707_10205908719979367_3491263903448795284_n.jpg?_nc_cat=102&_nc_sid=7206a8&_nc_oc=AQnNDgBrpVuR6mOZqnzRWUolbi5j1jbpt5s6Ot13xcQlcVcnij_FvqCSU-srog5COwEXAInPyfkreQZOx37t2zHs&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=163dd5603e3a77826a7a2272494104ec&oe=5ED3D3BD' }}
            size={35}
          />

          <Text style={styles.nameText} numberOfLines={1}>Alex Filatov</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.user}>
          <BabbleUserAvatar
            activityIconStyle={styles.activityIconStyle}
            source={{ uri: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/68732876_2309235119183895_7509317865388900352_n.jpg?_nc_cat=107&_nc_sid=dbb9e7&_nc_oc=AQkwIaFoJFx9KjFuQBXepGu9EpNN3o6itC0xkaIvMco-xG_XJ-NIqJ0seT6Ifa7OH8fG_0JqsNOajUV9JoG3pXvp&_nc_ht=scontent-sea1-1.xx&oh=4b6d0f7a070b4878e208b0d4b5203ca3&oe=5ED22955' }}
            size={35}
          />

          <Text style={styles.nameText} numberOfLines={1}>Mo Adib</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.user}>
          <BabbleUserAvatar
            activityIconStyle={styles.activityIconStyle}
            source={{ uri: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/21752489_879003625586374_8255021344369597872_n.jpg?_nc_cat=103&_nc_sid=dbb9e7&_nc_oc=AQm6OfBh3r1iE90oxjpJPhHXwjQDWuEe59BOUloe2C2XJ2Fn6zaJfiZtE47vccdV7vczBuDSybAvICa6SMh7HeOP&_nc_ht=scontent-sea1-1.xx&oh=9620863d3d201765abff1315c0b183fb&oe=5ED26745' }}
            size={35}
          />

          <Text style={styles.nameText} numberOfLines={1}>Thomas Chang</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.user}>
          <BabbleUserAvatar
            activityIconStyle={styles.activityIconStyle}
            source={{ uri: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p200x200/48406353_10213592207343715_762772413514514432_o.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_oc=AQl4SPyNrqLtJq7tJDco2bmlL0Vwg_tfzKiYffwqW5ptPTnuADY4VgK0kdKRSVbJwcvIOx7VtTTjlNv48Af6_Wl6&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=45f4499ac0fed75cfdba19ecf69f9647&oe=5ED1FA9A' }}
            size={35}
          />

          <Text style={styles.nameText} numberOfLines={1}>Max Holmes</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activityIconStyle: {
    height: 10,
    right: -1,
    top: -1,
    width: 10,
  },
  container: {
    alignItems: 'center',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 7,
    width: '100%',
  },
  nameText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  user: {
    alignItems: 'center',
    marginRight: 5,
    width: 60,
  },
});
