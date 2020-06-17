import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { BabbleSearchField } from './';
import emoji from 'emojilib';

const windowWidth = Dimensions.get('window').width;
const columns = Math.floor(windowWidth / 50);

export default class BabbleEmojiSelector extends Component {
  state = {
    search: '',
  }

  _getData = () => {
    const search = (this.state.search) ? this.state.search.toLowerCase() : null;
    const sections = [
      { category: 'people', name: 'People', emojis: [] },
      { category: 'animals_and_nature', name: 'Nature', emojis: [] },
      { category: 'food_and_drink', name: 'Food', emojis: [] },
      { category: 'activity', name: 'Activity', emojis: [] },
      { category: 'travel_and_places', name: 'Travel', emojis: [] },
      { category: 'objects', name: 'Objects', emojis: [] },
      { category: 'symbols', name: 'Symbols', emojis: [] },
      { category: 'flags', name: 'Flags', emojis: [] },
    ];

    Object.keys(emoji.lib).forEach(emojiName => {
      const emojiObject = emoji.lib[emojiName];
      const section = sections.find(section => section.category === emojiObject.category);
      const searchMatch = emojiObject.keywords.join(' ').includes(search) ||
                          emojiName.includes(search);

      if (!search || searchMatch) {
        section.emojis.push({
          name: emojiName,
          emoji: emojiObject.char,
          keywords: emojiObject.keywords,
        });
      }
    });

    return sections.reduce((data, section) => {
      if (!section.emojis.length) {
        return data;
      }

      for (let i = 0; i < data.length % columns; i++) {
        data.push({ type: 'sectionSpacer' });
      }

      data.push({
        type: 'section',
        title: section.name,
      });

      for (let i = 0; i < columns - 1; i++) {
        data.push({ type: 'sectionSpacer' });
      }

      section.emojis.forEach(emoji => data.push({ type: 'emoji', ...emoji }));

      return data;
    }, []);
  }

  _emojiPress = emoji => {
    const { onEmojiPress } = this.props;

    if (onEmojiPress) {
      onEmojiPress(emoji);
    }
  }

  _renderItem = ({ item }) => {
    if (item.type === 'section') {
      return (
        <Text style={styles.title}>{item.title}</Text>
      );
    }

    if (item.type === 'sectionSpacer') {
      return (
        <View />
      );
    }

    if (item.type === 'emoji') {
      return (
        <TouchableOpacity onPress={() => this._emojiPress(item)} style={styles.button}>
          <Text style={styles.buttonText}>{item.emoji}</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    const { search } = this.state;

    return (
      <View style={styles.container}>
        <BabbleSearchField
          disableCancelButton
          onChangeText={text => this.setState({ search: text })}
          returnKeyType={'done'}
          placeholder={'Search reactions...'}
          value={search}
        />

        <FlatList
          data={this._getData()}
          renderItem={this._renderItem}
          numColumns={columns}
          columnWrapperStyle={styles.column}
          keyboardShouldPersistTaps={'always'}
          keyExtractor={(item, index) => item.name || index}
          style={styles.list}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 45,
    justifyContent: 'center',
    width: 45,
  },
  buttonText: {
    fontSize: 24,
  },
  container: {
    padding: 15,
  },
  list: {
    alignSelf: 'center',
    height: 300,
    width: 45 * columns,
  },
  title: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
});
