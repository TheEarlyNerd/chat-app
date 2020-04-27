import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleButton, BabbleConversationPreview, BabbleUserAvatar, BabbleHeader } from '../components';

export default class ProfileScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BabbleHeader style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />
        <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
          <View style={styles.user}>
            <BabbleUserAvatar
              activityIconStyle={styles.userAvatarActivityIcon}
              source={{ uri: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-9/71572992_2728234020533981_2005024985860538368_n.jpg?_nc_cat=105&_nc_sid=85a577&_nc_oc=AQm3dmHq4bGkok28oCH8ApLDfEeSaW_It8Sh_pSEX_TkbLpSGjaKsehzOC61rrBy4JhCoRFwIp-1is1cEmrOxA66&_nc_ht=scontent-sea1-1.xx&oh=39ff988af3d5e90acb04e560f6526acb&oe=5EC57631' }}
              size={60}
            />

            <View style={styles.userDetails}>
              <Text style={styles.nameText}>Braydon Batungbacal</Text>
              <Text style={styles.usernameText}>@braydon</Text>
            </View>

            <View style={styles.userFollowers}>
              <Text style={styles.userFollowersText}>Followers</Text>
              <Text style={styles.userFollowersCountText}>4.2m</Text>
            </View>
          </View>

          <View style={styles.userAbout}>
            <Text style={styles.aboutText} numberOfLines={3}>I'm baby cornhole health goth jean shorts, food truck typewriter listicle synth paleo lumbersexual. Chicharrones hexagon offal farm-to-table cornhole.</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>https://babble.app/</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userButtons}>
            <BabbleButton style={[ styles.button, styles.followButton ]}>Follow</BabbleButton>
            <BabbleButton style={styles.button}>Message</BabbleButton>
          </View>

          {Array(20).fill(null).map((value, index) => (
            <BabbleConversationPreview
              key={index}
              conversation={{
                id: 3,
                accessLevel: 'public',
                previewConversationMessage: {
                  text: 'If ya know anyone that needs some extra cash lmk their venmo and we’ll send something over :)',
                  conversationMessageReactions: [],
                },
                user: {
                  name: 'Braydon Batungabcal',
                  avatarAttachment: { url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-9/71572992_2728234020533981_2005024985860538368_n.jpg?_nc_cat=105&_nc_sid=85a577&_nc_oc=AQm3dmHq4bGkok28oCH8ApLDfEeSaW_It8Sh_pSEX_TkbLpSGjaKsehzOC61rrBy4JhCoRFwIp-1is1cEmrOxA66&_nc_ht=scontent-sea1-1.xx&oh=39ff988af3d5e90acb04e560f6526acb&oe=5EC57631' },
                },
              }}
              style={styles.conversationPreview}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  aboutText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBoldItalic',
    fontSize: 14,
  },
  button: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  conversationPreview: {
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.5,
    paddingVertical: 15,
  },
  followButton: {
    marginRight: 15,
  },
  linkText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
  },
  nameText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingBottom: 30,
    paddingTop: 140,
    paddingHorizontal: 15,
  },
  user: {
    flexDirection: 'row',
  },
  userAbout: {
    marginTop: 20,
  },
  userAvatarActivityIcon: {
    borderRadius: 10,
    height: 15,
    width: 15,
  },
  userButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  userDetails: {
    justifyContent: 'center',
    marginLeft: 15,
    width: '43%',
  },
  userFollowers: {
    alignItems: 'center',
    borderLeftColor: '#D8D8D8',
    borderLeftWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
    paddingLeft: 15,
  },
  userFollowersCountText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 28,
  },
  userFollowersText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 16,
  },
  usernameText: {
    color: '#797979',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
});
