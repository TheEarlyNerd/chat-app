import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { BabbleHeader, BabbleConversationPreviewMessage, BabbleSearchField, BabbleUserAvatar } from '../components';
import { UserIcon, EyeIcon } from '../components/icons';

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BabbleHeader style={styles.header} />

        <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
          <BabbleSearchField
            placeholder={'Search users and conversations...'}
            containerStyle={styles.searchField}
          />

          <Text style={styles.headingText}>Direct Messages</Text>

          <BabbleConversationPreviewMessage
            unread={4}
            avatarUri={'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p320x320/71572992_2728234020533981_2005024985860538368_n.jpg?_nc_cat=105&_nc_sid=dbb9e7&_nc_oc=AQkC6_7gtmxcuTEJkxUGX6b4hzh7mmoBmWcHS5WGZF8OITrVIx4nC4EqI2Q33oD8Snpzhy7EZW3GMSyv9xdQSXYF&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=8b49e6ea4ddca8f66a0fbc8939ec16a2&oe=5EC8C59D'}
            name={'Braydon Batungbacal'}
            message={'Braydon Batungbacal sent an attachment.'}
            style={styles.conversationPreviewMessage}
            media
          />

          <BabbleConversationPreviewMessage
            avatarUri={'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p480x480/12717707_10205908719979367_3491263903448795284_n.jpg?_nc_cat=102&_nc_sid=dbb9e7&_nc_oc=AQkY9cvHDPkTZjpHJB2AJfWXDxK4jZexz9WgtKReqGes73lh-ujVIyMcXJRyu0LQCjbfewvRZ4lc5mRWUyJbx1n8&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=35573a80e7c0f39280d1dcbea302638b&oe=5ECB2090'}
            name={'Alex Filatov'}
            message={'There is absolutely no way that is the situation with all of this'}
            style={styles.conversationPreviewMessage}
          />


          <Text style={styles.headingText}>Feed</Text>

          <BabbleConversationPreviewMessage
            avatarUri={'https://static-cdn.jtvnw.net/jtv_user_pictures/ded5a0a6-7650-4df2-a0a9-0d4606c9fadf-profile_image-70x70.png'}
            name={'ViBElol'}
            message={'Yes, I’m stating the obvious but I will a bit strong with my speech and I’ll say what needs to be said. Protoss has not been in the leading race on Aligulac since July 2015. When was the last time a toss won a $100000+ tournament ?'}
            style={styles.conversationPreviewMessage}
            unread={8}
            conversation
            media
          />

          <BabbleConversationPreviewMessage
            avatarUri={'https://pbs.twimg.com/profile_images/1223706175910211584/tmu8d9fA_400x400.jpg'}
            name={'David Dobrik'}
            message={'Hi guys!! I wanna help some more people out rather than just sending out venmos!! Reply!!'}
            style={styles.conversationPreviewMessage}
            conversation
          />

          <Text style={styles.headingText}>Explore</Text>

          {Array(5).fill(null).map((value, index) => (
            <>
              <BabbleConversationPreviewMessage
                unread={15}
                avatarUri={'https://pbs.twimg.com/profile_images/634514155261833216/czgYrPLQ_400x400.jpg'}
                name={'Travis Scott'}
                message={'http://smarturl.it/ASTROWORLD'}
                style={styles.conversationPreviewMessage}
                conversation
              />

              <BabbleConversationPreviewMessage
                unread={53}
                avatarUri={'https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg'}
                name={'Donald Trump'}
                message={'We all supporters here, #lol'}
                style={styles.conversationPreviewMessage}
                conversation
              />
            </>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingTop: 140,
    paddingHorizontal: 15,
  },
  headingText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Black',
    fontSize: 26,
    marginTop: 40,
  },
  conversationPreviewMessage: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D8D8D8',
  },

});
