import React, { Component } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class BabbleUserAvatarGroup extends Component {
  render() {
    const { size } = this.props;

    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            borderRadius: size / 2,
            height: size,
            width: size,
          },
        ]}
      >
        <View style={{ overflow: 'hidden', width: '100%', height: '100%', borderRadius: size / 2 }}>
          <View style={styles.images}>
            <Image
              source={{ uri: 'https://pbs.twimg.com/profile_images/1223706175910211584/tmu8d9fA_400x400.jpg' }}
              style={[ styles.image, { left: 0, width: '100%' } ]}
            />
            {/*}
            <Image
              source={{ uri: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p200x200/20526332_10209496993450410_8828216259337074259_n.jpg?_nc_cat=111&_nc_sid=dbb9e7&_nc_oc=AQkN8ww4eb_zc8bcZ4LFnGHtNKoKvvg9dDffdleWeEfMzv_oRqxjajPAHHAtW9ihUkBKFbxajSxS1fX8i6CssFOb&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=c089d9f2abda7bc607a3e105b32096b7&oe=5ECCCF4F' }}
              style={[ styles.image, { right: 0 } ]}
            />{*/}
          </View>

          <View style={styles.images}>
            <Image
              source={{ uri: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-9/53830277_2279125349025597_1888774982960414720_n.jpg?_nc_cat=104&_nc_sid=85a577&_nc_oc=AQlGZx97vp5At_CD8wSez9pYvITyOIJBLMpLAmemW87j1AyQfKBnx8kkWL1b5t3QehqFtrOLVlKRj_1ZifYhICOC&_nc_ht=scontent-sea1-1.xx&oh=ffe5a82142d5f3eaf7f097279b69a608&oe=5ECE22D1' }}
              style={[ styles.image, { left: 0, width: '100%' } ]}
            />

            {/*}<View style={[ styles.image, { right: 0, backgroundColor: '#1ACCB4', justifyContent: 'center', alignItems: 'center' } ]}>
              <Text style={styles.text}>+4</Text>

              <LinearGradient
                useAngle
                angle={36}
                colors={[ '#299BCB', '#1ACCB4' ]}
                locations={[ 0, 0.6 ]}
                style={styles.groupMoreBackground}
              />
            </View>{*/}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flexWrap: 'wrap',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  image: {
    bottom: -2,
    position: 'absolute',
    top: -2,
    width: '50%',
  },
  images: {
    flexDirection: 'row',
    height: '50%',
    overflow: 'hidden',
    width: '100%',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
    marginLeft: -4,
    marginTop: -4,
  },
  groupMoreBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
